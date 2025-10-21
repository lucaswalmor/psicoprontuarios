# Respostas às Perguntas do Cursor

## 1. Arquitetura de Módulos

**Resposta Recomendada: b) Migrar para tabelas separadas (modulos + plano_modulos)**

### Justificativa:

- **Escalabilidade**: Com colunas booleanas, a cada novo módulo você precisa adicionar uma coluna. Com 10, 20 módulos fica insustentável.
- **Flexibilidade**: Futuramente você pode ter combinações customizadas de módulos por plano sem alterar schema.
- **Manutenção**: Mais fácil para novo desenvolvedor entender a relação M:M (muitos-para-muitos).
- **Segurança**: Rota de acesso fica centralizada em uma tabela, não espalhada em colunas.
- **Performance**: Query em tabela separada é eficiente com índices adequados.

### Implementação:
```
Tabela planos: id, nome, valor_mensal, stripe_product_id, stripe_price_id, ativo
Tabela modulos: id, nome, chave, descricao, ativo
Tabela plano_modulos: plano_id, modulo_id
```

**Adicione no plano**: Também crie um `ModuloSeeder` para popular módulos iniciais (prontuario, agenda, relatorio, etc).

---

## 2. Tratamento de Dados Existentes ASAAS

**Resposta Recomendada: b) Criar nova tabela separada e arquivar dados ASAAS**

### Justificativa:

- **Compliance**: Pode precisar manter histórico de pagamentos ASAAS para auditoria/fiscal.
- **Limpeza**: A tabela `assinaturas` fica apenas com dados Stripe (sem "lixo" de sistema antigo).
- **Rollback seguro**: Se algo der errado, tem os dados ASAAS salvos.
- **Relatórios**: Você consegue comparar histórico ASAAS vs Stripe depois.

### Implementação:
```
Criar tabela: assinaturas_asaas (arquivos históricos)
├── id
├── user_id
├── asaas_subscription_id
├── status
├── valor
├── data_inicio
├── data_fim
├── created_at
└── archived_at

Migração: Mover todos dados da tabela assinaturas atual para assinaturas_asaas
Depois: Limpar tabela assinaturas e criar nova estrutura Stripe
```

**Deixe claro ao Cursor**: 
> "Criar migration que copia dados históricos ASAAS para tabela separada assinaturas_asaas antes de limpar a tabela original. Depois criar nova tabela assinaturas com estrutura Stripe."

---

## 3. Tabela Pagamentos

**Resposta Recomendada: a) Deletar completamente**

### Justificativa:

- **Simplicidade**: Toda lógica de pagamento estará em `assinaturas` + histórico em `invoices_stripe` (do Stripe).
- **Stripe é source-of-truth**: Stripe já mantém histórico de invoices, não precisa duplicar.
- **Menos confusão**: Desenvolvedores não vão confundir pagamento separado com assinatura.
- **Dados ASAAS**: Se precisar histórico, está guardado em `assinaturas_asaas`.

### Implementação:
```
- Backup da tabela pagamentos (salvar SQL antes de dropar)
- Dropar foreign keys em outras tabelas que referenciam pagamentos
- Dropar tabela pagamentos
- Remover método pagamentos() de User, Assinatura, etc
- Atualizar qualquer query que use essa tabela
```

**Adicione ao plano**: 
> "Criar migration para dropar tabela pagamentos e suas constraints. Remover relação pagamentos() de User model."

---

## 4. Integração Stripe no Frontend

**Resposta Recomendada: a) Stripe Hosted Checkout**

### Justificativa:

**Vantagens Hosted Checkout:**
- ✅ Compliance PCI automático (Stripe cuida)
- ✅ Melhor para celular (responsive nativamente)
- ✅ Menos vulnerabilidades de XSS
- ✅ Suporta múltiplos métodos de pagamento (Pix, boleto, etc) automaticamente
- ✅ Menos código no frontend para manter
- ✅ Conversão maior (Stripe otimiza constantemente)

**Por que não Elements:**
- ❌ Você fica responsável por validações PCI
- ❌ Mais código = mais bugs potenciais
- ❌ Precisa fazer mais requests ao backend
- ❌ Em celular precisa de mobile-specific handling

### Fluxo Implementado:
```
1. Usuário clica "Assinar com [Plano]"
2. Frontend faz POST /assinaturas/checkout-session
3. Backend retorna checkout_session_id
4. Frontend redireciona para: https://checkout.stripe.com/c/pay/[session_id]
5. Usuário preenche dados no Stripe (já integrado com Pix, boleto, etc)
6. Stripe redireciona de volta: https://seu-site.com/assinatura/sucesso?session_id=xxx
7. Frontend valida session_id
8. Backend cria assinatura no BD
9. Usuário tem acesso!
```

**Adicione ao plano**:
> "Usar Stripe Hosted Checkout. Criar endpoint POST /assinaturas/checkout-session que retorna checkout_session_id. Implementar página de sucesso que valida e confirma assinatura."

---

## 5. Grace Period: Qual é o Comportamento?

**Resposta Recomendada: a) Acesso completo durante grace period**

### Justificativa:

**Acesso Completo (recomendado):**
- ✅ Melhor UX: usuário não é "punido" por falha de processamento (que pode ser erro do banco)
- ✅ Mais conversões: usuário tem 3 dias para atualizar cartão ou resolver
- ✅ Padrão da indústria: Netflix, Spotify, outros SaaS fazem assim
- ✅ Webhook pode falhar? Nenhum problema, só avisa via email
- ✅ Menos suporte: usuário não reclama que perdeu acesso em hora errada

**Fluxo com Acesso Completo:**
```
Dia 1 (vencimento): Pagamento falha
↓
Status: 'pendente' | Acesso: COMPLETO
↓
Stripe tenta 2x automaticamente (Dia 2, Dia 3)
↓
Se falhar 3x: Status vai para 'vencida' | Acesso: NEGADO (Dia 4)
↓
Usuário recebe email a cada falha com link para atualizar cartão
↓
Se atualizar cartão: Status volta para 'ativa' | Acesso: COMPLETO
```

### Configuração Stripe:
```
- Automatic tax recovery: ativado (3 tentativas)
- Dunning emails: ativados (notifica usuário a cada falha)
- Grace period: 3 dias (configurável)
```

**Adicione ao plano**:
> "Durante grace period (3 dias após pagamento falho), manter status='pendente' e usuário com acesso completo. Apenas após 3 dias falhos, mover para status='vencida' e negar acesso. Webhook invoice.payment_failed final muda para vencida."

---

## Resumo das Respostas para Copiar/Colar:

```
1. Arquitetura de Módulos: b) Migrar para tabelas separadas
   
2. Dados ASAAS: b) Criar tabela assinaturas_asaas e arquivar
   
3. Tabela Pagamentos: a) Deletar completamente
   
4. Checkout Frontend: a) Stripe Hosted Checkout
   
5. Grace Period: a) Acesso completo durante grace period
```

---

## Instruções para Cursor:

Quando responder ao Cursor, você pode usar este formato:

---

### 1. Arquitetura de Módulos: **Opção B**

Prefiro migrar para tabelas separadas (modulos + plano_modulos) porque:
- Mais flexível para adicionar novos módulos sem alterar schema
- Melhor para manutenção futura e escalabilidade
- Relação M:M é padrão da indústria para este tipo de cenário

---

### 2. Dados Históricos ASAAS: **Opção B**

Gostaria de criar uma tabela separada `assinaturas_asaas` para arquivar dados antigos:
- Mantém conformidade com auditoria fiscal
- Deixa tabela `assinaturas` limpa apenas com dados Stripe
- Permite rollback seguro se necessário

Detalhe da migration:
- Copiar dados da tabela `assinaturas` atual para `assinaturas_asaas`
- Limpar tabela `assinaturas`
- Recriar tabela `assinaturas` com nova estrutura Stripe

---

### 3. Tabela Pagamentos: **Opção A**

Deletar completamente porque:
- Stripe mantém histórico em invoices automaticamente
- Menos duplicação de dados
- Simplifica arquitetura (uma tabela menos para manter)

Detalhe da migration:
- Backup da tabela antes
- Remover foreign keys que referenciam pagamentos
- Dropar tabela
- Remover relação pagamentos() de User model

---

### 4. Checkout Frontend: **Opção A**

Usar Stripe Hosted Checkout porque:
- Melhor segurança (Stripe cuida de PCI compliance)
- Suporta múltiplos métodos (Pix, boleto, cartão) automaticamente
- Responsivo em mobile natively
- Menos código para manter no frontend

Fluxo esperado:
1. Frontend POST /assinaturas/checkout-session → retorna session_id
2. Redireciona para checkout.stripe.com
3. Após pagamento, retorna para success page
4. Backend valida e cria assinatura

---

### 5. Grace Period: **Opção A**

Durante os 3 dias de grace period, o usuário mantém acesso completo porque:
- Melhor UX (não é "punido" por falha de processamento)
- Padrão da indústria (Netflix, Spotify fazem assim)
- Mais conversões (usuário tem tempo para resolver)
- Menos tickets de suporte

Comportamento:
- Dia 1: Pagamento falha → status='pendente', acesso=COMPLETO
- Dias 2-3: Stripe tenta 2x automaticamente
- Dia 4: Se ainda falhar → status='vencida', acesso=NEGADO
- Email notifica usuário a cada falha com link para atualizar cartão

---

## Próximas Ações:

Após responder, peça ao Cursor:

1. **Criar migrations** para tabelas de módulos e assinaturas_stripe
2. **Criar StripeService** com métodos para CRUD de assinaturas
3. **Criar webhooks** para: customer.subscription.created, invoice.payment_failed, etc
4. **Testar checkout** em sandbox mode do Stripe

Boa sorte! 🚀
```