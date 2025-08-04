# Módulo de Upgrade de Planos

## Visão Geral

O módulo de upgrade de planos permite que usuários dos planos Gratuito e Essencial façam upgrade para planos superiores através de uma interface moderna e intuitiva.

## Funcionalidades Implementadas

### 1. Botão de Upgrade no AppTopbar
- **Localização**: Ao lado esquerdo do botão de troca de tema
- **Visibilidade**: Aparece apenas para usuários dos planos Gratuito e Essencial
- **Design**: Botão com gradiente chamativo e ícone de estrela
- **Responsivo**: Texto oculto em telas pequenas

### 2. Página de Upgrade (`/upgrade`)
- **Cabeçalho**: Mostra o plano atual do usuário
- **Stepper**: Progresso visual com 3 etapas
- **Comparativo**: Cards dos planos disponíveis
- **FAQ**: Modal com perguntas frequentes

### 3. Componentes Criados

#### UpgradeStepper.vue
- Mostra o progresso do upgrade
- 3 etapas: Escolha do Plano, Confirmação, Pagamento
- Estados visuais: ativo, completo, clicável

#### PlanoCard.vue
- Exibe informações do plano
- Badges para plano popular e atual
- Seleção interativa
- Lista de recursos incluídos

#### PaymentForm.vue
- Formulário de pagamento completo
- Validação de campos
- Integração com API da Asaas
- Termos e política de privacidade

#### FaqModal.vue
- Modal com perguntas frequentes
- Accordion com 10 perguntas principais
- Informações de contato

## Estrutura de Arquivos

```
src/
├── components/
│   └── upgrade/
│       ├── UpgradeStepper.vue
│       ├── PlanoCard.vue
│       ├── PaymentForm.vue
│       └── FaqModal.vue
├── views/
│   └── pages/
│       └── Upgrade.vue
├── services/
│   └── planService.js (atualizado)
└── layout/
    └── AppTopbar.vue (atualizado)
```

## Regras de Negócio

### Planos Disponíveis
- **Gratuito → Essencial**: R$ 29,90/mês
- **Gratuito → Profissional**: R$ 59,90/mês
- **Essencial → Profissional**: R$ 59,90/mês

### Validações
- Usuários Profissional e Vitalício não podem fazer upgrade
- Apenas planos superiores são mostrados
- Validação de dados de pagamento
- Aceitação obrigatória dos termos

## Integração com API

### Endpoints Utilizados
- `GET /user/plan-info`: Informações do plano atual
- `POST /user/upgrade-plan`: Processar upgrade
- `GET /user/available-plans`: Planos disponíveis

### Dados de Pagamento
```javascript
{
  planId: 'essencial|profissional',
  customerData: {
    name: 'Nome do Cliente',
    cpf: '12345678901',
    email: 'email@exemplo.com'
  },
  paymentData: {
    cardNumber: '1234567890123456',
    cardName: 'NOME NO CARTAO',
    expiry: '12/25',
    cvv: '123'
  }
}
```

## Estilização

### Design System
- Cores primárias do tema
- Gradientes para destaque
- Animações suaves
- Responsivo para mobile

### Componentes PrimeVue Utilizados
- Button
- InputText
- Checkbox
- Dialog
- Accordion
- ProgressSpinner

## Estados e Validações

### Estados do Stepper
- **Ativo**: Step atual (azul)
- **Completo**: Steps anteriores (azul)
- **Pendente**: Steps futuros (cinza)

### Validações de Formulário
- Nome obrigatório
- CPF válido (11 dígitos)
- Cartão válido (13+ dígitos)
- Data de validade (MM/AA)
- CVV (3 dígitos)
- Aceitação dos termos

## Responsividade

### Breakpoints
- **Desktop**: Layout completo
- **Tablet**: Cards em coluna única
- **Mobile**: Stepper vertical, botões empilhados

### Adaptações Mobile
- Texto do botão oculto
- Cards em coluna única
- Formulário em coluna única
- Modal em tela cheia

## Segurança

### Dados Sensíveis
- Cartão de crédito não armazenado
- Processamento via Asaas
- Criptografia de ponta a ponta
- Conformidade LGPD

### Validações
- Sanitização de inputs
- Validação de CPF
- Verificação de cartão
- Rate limiting

## Testes Recomendados

### Funcionalidades
- [ ] Botão aparece apenas para planos elegíveis
- [ ] Navegação entre steps
- [ ] Seleção de planos
- [ ] Validação de formulário
- [ ] Processamento de pagamento
- [ ] Redirecionamento após sucesso

### Responsividade
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### Acessibilidade
- [ ] Navegação por teclado
- [ ] Screen readers
- [ ] Contraste adequado
- [ ] Textos alternativos

## Próximos Passos

### Melhorias Sugeridas
1. **Testes Unitários**: Jest + Vue Test Utils
2. **Testes E2E**: Cypress ou Playwright
3. **Analytics**: Tracking de conversão
4. **A/B Testing**: Diferentes layouts
5. **Performance**: Lazy loading de componentes

### Funcionalidades Futuras
1. **Downgrade**: Redução de plano
2. **Promoções**: Códigos de desconto
3. **Pagamento PIX**: Integração adicional
4. **Boleto**: Opção de pagamento
5. **Notificações**: Email de confirmação

## Troubleshooting

### Problemas Comuns
1. **Botão não aparece**: Verificar plano do usuário
2. **Erro de pagamento**: Validar dados do cartão
3. **Stepper travado**: Verificar estado do componente
4. **Responsividade**: Testar em diferentes dispositivos

### Logs Úteis
```javascript
// Verificar plano atual
console.log(planStore.planInfo);

// Verificar dados do formulário
console.log(formData);

// Verificar resposta da API
console.log(response);
```

## Contribuição

Para contribuir com o módulo:

1. Siga o padrão de código existente
2. Adicione testes para novas funcionalidades
3. Documente mudanças na API
4. Teste em diferentes dispositivos
5. Valide acessibilidade 