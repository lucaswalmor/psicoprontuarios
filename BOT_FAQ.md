# Psico Prontuários — Base de conhecimento para atendimento (bot / N8N)

Este arquivo tem **duas camadas** para a IA/bot:

1. **Guia do usuário (abaixo)** — *Onde clicar e em que ordem* para executar tarefas no sistema. Use esta parte quando o cliente perguntar **“como faço…”, “onde fica…”, “passo a passo”**.
2. **Referência técnica (demais seções)** — Rotas da API, e-mails, cronjobs, inconsistências de código. Use para **suporte avançado**, integração Asaas ou quando precisar explicar o que acontece “nos bastidores”.

O produto é um sistema web para **psicólogos** gerenciarem **pacientes**, **prontuários**, **agenda**, **financeiro** e **assinatura** (integração **Asaas**). O frontend Vue chama a API Laravel; a URL base da API vem de `VITE_API_URL` ou de `src/config/environment.js` (ex.: produção `https://psicoprontuarios-v2.lksoftware.com.br/public/api/`).

**Prefixo das rotas HTTP (referência técnica):** o frontend usa paths relativos como `/login`, `/pacientes` — isso significa `{BASE_API}/login`, etc.

---

## Guia do usuário — ações na interface (respostas “como faço…”)

**Instrução explícita para o bot:** para perguntas operacionais, **sempre** monte a resposta em **passos numerados**, com os **nomes exatos dos botões e menus** quando existirem neste documento. Não responda só com “use a API POST /paciente” para um psicólogo leigo.

**Palavras-chave para busca semântica:** cadastrar paciente, novo paciente, incluir paciente, adicionar paciente, registro de paciente, ficha, lista de pacientes.

### P: Como posso cadastrar um paciente? / Onde cadastro um paciente novo?

**R:**

1. Acesse o sistema e **faça login** (e-mail e senha, ou Google, se for o caso).
2. No **menu lateral**, clique em **Pacientes** (ícone de pessoas). Abre a **lista de pacientes**.
3. Clique no botão **Novo Paciente** (no topo da lista). Abre a página **Cadastro de Paciente** (rota interna `/pacientes/cadastro`).
4. Preencha os dados. O formulário está dividido em **três blocos** (acordeões que podem ser expandidos):
   - **Dados pessoais** — Nome completo é o campo **obrigatório** (marcado com *). Os demais (CPF, data de nascimento, e-mail, telefone, filiação, gênero, etc.) são opcionais, salvo validação do próprio sistema ao salvar.
   - **Dados profissionais** — Escolaridade, início do tratamento, profissão, convênio e a área **Informações adicionais** (medicação, contato de emergência, acompanhamento médico, menor de idade, diagnóstico prévio, etc.).
   - **Endereço** — CEP (ao sair do campo o sistema pode **preencher rua/bairro/cidade** automaticamente via consulta de CEP), depois complete se necessário.
5. Clique em **Salvar Paciente** (canto superior direito da página). Se você alterou o formulário, pode aparecer também uma **barra flutuante** na parte inferior com **Salvar Paciente** — use qualquer um dos dois.
6. Após salvar, o paciente aparece na **lista** em **Pacientes**. Você pode **clicar na linha** do paciente para abrir a **ficha** ou usar os ícones de ação da tabela (ver ficha, editar, etc.).

**Dicas que o bot pode acrescentar se fizer sentido:**

- **Não confundir** a página pública **Cadastro** do site (`/cadastro`), que serve para **criar conta de psicólogo**, com **Novo paciente**, que é **dentro do sistema já logado**.
- Se o cliente **não vê o menu Pacientes** ou é redirecionado para **pagamento / assinatura**, a conta pode estar **bloqueada** até regularizar plano ou cartão — nesse caso ele não consegue cadastrar paciente até o acesso ser liberado (ver seção sobre guarda de navegação mais abaixo).

---

## 1. Público-alvo e papéis

- **Usuário principal:** psicólogo cadastrado no sistema.
- **Dados isolados por psicólogo:** pacientes, prontuários, agendamentos, financeiro e configurações pertencem ao usuário logado (`auth:sanctum` no backend).

---

## 2. Rotas do frontend (Vue Router) — o que o usuário vê

| Caminho | Nome / função |
|---------|----------------|
| `/` | Landing pública (marketing). |
| `/login` | Login (e-mail/senha ou fluxos auxiliares). |
| `/cadastro` | Cadastro de novo psicólogo. |
| `/change-password` | Fluxo de redefinição de senha (código por e-mail). |
| `/completar-cadastro` | Completar dados após login social (Google); exige autenticação. |
| `/upgrade` | Contratação de plano / primeira assinatura (layout dedicado). |
| `/politica-privacidade`, `/termos-uso` | Textos legais. |
| `/dashboard` | Painel geral (métricas). |
| `/pacientes` | Lista de pacientes. |
| `/pacientes/cadastro`, `/pacientes/editar/:id` | Cadastro e edição de paciente. |
| `/pacientes/prontuarios/:pacienteId` | Lista de prontuários do paciente. |
| `/pacientes/anexos/:id` | Anexos do paciente. |
| `/pacientes/ficha/:id` | Ficha do paciente (estatísticas, anamnese, sessões na prática = agendamentos). |
| `/agendamentos` | Calendário / agenda de consultas. |
| `/agendamentos-old` | Versão antiga da agenda (legado). |
| `/financeiro/receitas`, `/financeiro/despesas` | Lista financeira (mesmo componente, tipo diferente). |
| `/financeiro/novo`, `/financeiro/editar/:id` | Lançamento financeiro. |
| `/configuracoes` | Abas: Plano (Asaas), Segurança (senha), Preferências (notificações e-mail/WhatsApp). |
| `/perfil` | Perfil do psicólogo. |
| `/faq` | Página de FAQ (tenta carregar da API). |
| `/pagamento` | Tela quando a conta está **inativa** (assinatura/pagamento): reativar, atualizar cartão ou ir a planos. |
| `/modelos-arquivos` | Download de modelos `.docx` estáticos (contrato, encaminhamento, etc.) — **sem** chamada à API. |
| `/uikit/*`, `/pages/*`, `/documentation` | Demonstrações/templates Sakai; não são funcionalidades de negócio. |
| `/auth/access`, `/auth/error` | Páginas de erro de acesso genéricas. |

**Guard de navegação (`authInactiveGuard.js`):**

- Sem token → redireciona para `/login`.
- `localStorage.userAtivo === 'false'` (conta inativa) → só permite rotas públicas, `/pagamento` e rotas com `meta.allowsInactive`.
- Se `statusAssinatura === 'sem_assinatura'` e não for usuário vitalício → força `/upgrade` ou `/completar-cadastro`.
- Usuário ativo que acessa `/pagamento` é redirecionado ao dashboard.

---

## 3. Autenticação e sessão

### 3.1 Login

- **Frontend:** `POST /login` com e-mail (ou telefone em cenários específicos) e senha; cabeçalho **sem** Bearer nas rotas públicas.
- **Backend (`AuthController::login`):** valida credenciais, cria token Sanctum, retorna dados do usuário, flags de assinatura e se precisa de **NPS**. Se conta bloqueada por assinatura/inatividade, retorna `status: inativo`, `motivo` e ainda assim um `token` para acesso limitado à tela de pagamento.

### 3.2 Google

- **Frontend:** `POST /auth/google` com `{ token: credential }`.
- **Backend (`SocialAuthController`):** valida token Google, cria ou vincula usuário; pode exigir `cadastro_completo` e redirecionar para `/completar-cadastro`.

### 3.3 Sessão e validação

- **GET `/user`** (autenticado): valida token e devolve/atualiza dados do usuário (o `authService` usa isso para sincronizar `localStorage` / assinatura).
- **POST `/logout`:** encerra sessão no servidor (requer autenticação).

### 3.4 Recuperação e troca de senha

- **Público:** `POST /user/send-reset-code`, `POST /user/verify-reset-code`, `POST /user/reset-password` — fluxo de código por e-mail (`UsuariosController`).
- **Logado:** `POST /user/change-password` — alteração de senha autenticada.

### 3.5 Completar cadastro (social)

- **PUT `/user/completar-cadastro`** — `SocialAuthController`, usuário autenticado.

---

## 4. Pacientes

**Tela:** lista, cadastro, edição, ficha.

**API (PacientesController, todas autenticadas):**

| Método | Rota | Função |
|--------|------|--------|
| GET | `/paciente` | Lista paginada com filtros (telefone, e-mail, nome). |
| GET | `/pacientes` | Lista simplificada (todos). |
| GET | `/paciente/{idPaciente}` | Detalhe do paciente (inclui anexos no payload conforme implementação). |
| POST | `/paciente` | Cria paciente. |
| PUT | `/paciente/{idPaciente}` | Atualiza. |
| PUT | `/paciente/status/{idPaciente}` | Altera `status_tratamento` (ex.: Em Andamento, Recesso, Concluído). |
| DELETE | `/paciente/{idPaciente}` ou `/paciente/{idPaciente}/delete` | Remove paciente. |
| GET | `/paciente/{pacienteId}/estatisticas` | Números para a ficha (sessões, etc.). |
| GET | `/paciente/{pacienteId}/sessoes` | “Sessões” = registros de **Agendamento** do paciente, paginados. |
| POST | `/paciente/{pacienteId}/sessao` | Cria um agendamento/sessão (campos: `paciente_id`, `data_consulta`, `tipo_consulta`, `status`, `observacoes`). |
| DELETE | `/paciente/sessao/{sessaoId}` | Remove essa sessão/agendamento. |
| GET/POST/PUT | `/paciente/.../anamnese`, `/anamnese/{id}` | Anamnese do paciente. |

**Inconsistência importante para suporte:** o arquivo `pacientesService.js` também define `POST /sessao` e `DELETE /sessao/{id}`, mas no `api.php` existem **closures placeholder** em `/sessao` que só retornam JSON fixo — o fluxo **real** de criação/exclusão é `POST /paciente/{id}/sessao` e `DELETE /paciente/sessao/{sessaoId}`. Na ficha, a lista de “sessões” usa **dialogs de agendamento** que falam com **AgendamentosController** (`/agendamento`), não com esses stubs.

---

## 5. Prontuários

**Telas:** lista por paciente, criação/edição, exportação PDF.

**API (ProntuariosController):**

| Método | Rota | Função |
|--------|------|--------|
| GET | `/prontuario/paciente/{idPaciente}` | Lista paginada de prontuários. |
| GET | `/prontuarios/paciente/{idPaciente}/todos` | Alternativa “todos” (existe no backend). |
| POST | `/prontuario/paciente/{idPaciente}` | Novo prontuário. |
| PUT | `/prontuario/{idProntuario}` | Editar. |
| DELETE | `/prontuario/{idProntuario}` | Excluir. |
| GET | `/prontuario/paciente/{idPaciente}/exportar` | PDF com todos os prontuários do paciente. |
| GET | `/prontuario/{idProntuario}/exportar` | PDF de um prontuário. |
| GET | `/paciente/{idPaciente}/evolucao` | Dados para linha do tempo / evolução clínica. |

---

## 6. Anexos

**API (AnexosController):**

| Método | Rota | Função |
|--------|------|--------|
| GET | `/anexos/paciente/{idPaciente}` ou `/paciente/{pacienteId}/anexos` | Listar. |
| POST | `/anexos/paciente/{idPaciente}` | Upload (multipart). |
| POST | `/anexos/paciente/{idPaciente}/multiple` | Vários arquivos. |
| GET | `/anexos/{idAnexo}/download` ou `/paciente/anexo/{anexoId}/download` | Download. |
| DELETE | `/anexos/{idAnexo}` ou `/paciente_anexo/{anexoId}` | Excluir. |

---

## 7. Agendamentos (agenda principal)

**Telas:** `/agendamentos`, dialogs na ficha do paciente.

**API (AgendamentosController):**

| Método | Rota | Função |
|--------|------|--------|
| GET | `/agendamentos` | Todos os agendamentos do psicólogo (formato simplificado para calendário: título, data, hora, `publicId`). |
| GET | `/agendamento/{idAgendamento}` | Detalhe por `publicId` (atenção: parâmetro é o ID público). |
| GET | `/agendamentos/paciente/{pacienteId}` | Lista paginada **por mês/ano** (`mes`, `ano`, `page`, `per_page`). |
| POST | `/agendamento` | Cria consulta; pode **replicar** semanalmente, quinzenalmente ou mensalmente por até 52/26/12 ocorrências (`reagendar_consulta`, `tipo_reagendamento`). Grava data/hora da consulta, data/hora da **notificação** lembrete, tipos (e-mail, SMS, WhatsApp) e para quem enviar. |
| PUT | `/agendamento/{idAgendamento}` | Remarcar (`remarcar`). |
| DELETE | `/agendamento/{idAgendamento}` | Excluir um. |
| DELETE | `/agendamentos/{codAgendamento}` | Excluir **todas** as consultas com o mesmo `codigo_agendamento` (série recorrente). |

**Notificações agendadas (horário exato):** o job/controlador `verificarAgendamentos` compara `data_notificacao` com data/hora atual e dispara e-mail/SMS/WhatsApp conforme flags do registro. No **web** também existe rota GET `/verificar-agendamentos` em `routes/web.php` apontando para o mesmo método (fora do prefixo `/api`).

**GET `/api/verificar-agendamentos`:** também registrada no `api.php` (autenticada) — ver implementação atual se ainda é usada pelo frontend (geralmente é tarefa de cron/servidor).

---

## 8. Financeiro

**Telas:** receitas/despesas, formulário, dashboard financeiro.

**API (FinanceiroController + CategoriaFinanceiroController):**

| Método | Rota | Função |
|--------|------|--------|
| GET | `/financeiros` | Lista com filtros. |
| GET | `/financeiros/{id}` | Detalhe. |
| POST | `/financeiros` | Criar lançamento. |
| PUT | `/financeiros/{id}` | Atualizar. |
| DELETE | `/financeiros/{id}` | Excluir. |
| GET | `/financeiros/dashboard` | Agregados para gráficos/resumo. |
| POST | `/financeiros/pagar-lote` | Marcar vários como pagos/recebidos (`ids`). |
| CRUD | `/categoria-financeiro` | Categorias personalizadas. |

---

## 9. Dashboard geral

- **GET `/dashboard`** — `DashboardController::index`: totais de pacientes por status, aniversariantes do mês, últimos pacientes, agendamentos, métricas financeiras, evoluções temporais, etc. Alimenta `DashboardGeral.vue`.

---

## 10. Perfil do usuário (psicólogo)

- **GET `/user/profile`** — dados do perfil (inclui campos de exclusão: `deletion_requested_at`, `deletion_scheduled_for`, `deletion_processed_at`).
- **PUT `/user/profile`** — atualização (pode disparar e-mails de “dados alterados” para e-mail/telefone).
- **PUT `/usuario/{idUsuario}`** — edição por ID (com autenticação).
- **GET `/usuario/{idUsuario}`** — busca por ID.

**Exclusão de conta (LGPD) — aba Segurança em `/perfil` (não em Configurações):**

| Rota | Função |
|------|--------|
| POST `/user/enviar-codigo-exclusao` | Envia código por e-mail (contas Google sem senha local). |
| POST `/user/solicitar-exclusao` | Solicita exclusão (`current_password` ou `codigo_confirmacao`). Carência de 30 dias. |
| POST `/user/cancelar-exclusao` | Cancela solicitação pendente. |

**Cron (N8N):** `GET /api/cronjob/processar-exclusoes-conta` — processa contas com `deletion_scheduled_for` vencido (middleware `conta.cron.token`, env `CONTA_CRON_TOKEN`).

Manual do bot: `tool_bot_perfil.md` (zona de perigo, fluxo e retenção de dados).

**Validações no `userService.js`:** existem chamadas a `/user/check-email`, `/user/check-cpf`, `/user/check-crp`, `/user/check-telefone`. **No `api.php` analisado essas rotas não estão registradas** — se a tela usar esses métodos sem backend equivalente, pode ocorrer 404 até alguém expor os endpoints.

---

## 11. Configurações e notificações

**Preferências (`UserConfigController`):**

- **GET `/user-config`** — lê ou cria padrão.
- **PUT `/user-config`** — campos booleanos: `notificacoes_consultas_whatsapp`, `notificacoes_consultas_email`, `notificacoes_consultas_pacientes_whatsapp`, `notificacoes_consultas_pacientes_email`.
- **POST `/user-config/reset`** — volta tudo para `true`.

**Efeito:** o **cron diário** de e-mails (`/api/cronjob/notificar-agendamentos`) só envia e-mail consolidado ao psicólogo se `notificacoes_consultas_email` estiver ativo; e-mails a pacientes no dia da consulta se `notificacoes_consultas_pacientes_email` estiver ativo. Ou seja: as preferências da tela **afetam** o cron de lembretes do dia, não substituem o lembrete agendado por consulta (aquele usa outro fluxo na criação do agendamento).

---

## 12. Planos e assinatura (Asaas)

**Planos públicos:**

- **GET `/planos`**, **GET `/planos/{id}`**, **GET `/planos/slug/{slug}`** — `PlanoController` (catálogo).

**Assinatura (autenticado, `AssinaturaController`):**

| Rota | Função |
|------|--------|
| GET `/assinatura/painel` | Assinatura atual + faturas (tela “Plano” em configurações). |
| POST `/assinatura/iniciar` | Inicia assinatura com `plano_id` e dados do cartão; exige **CPF/CNPJ válido** no perfil (validação Asaas). Inclui período de **trial** conforme `trial_dias` do plano. |
| POST `/assinatura/cancelar` | Cancela (opcional `motivo_cancelamento`). |
| POST `/assinatura/pausar` | Pausa cobrança/acesso conforme regra de negócio. |
| POST `/assinatura/reativar` | Reativa. |
| POST `/assinatura/upgrade` | Troca de plano. |
| POST `/assinatura/atualizar-cartao` | Atualiza cartão na Asaas. |

**Webhook (público):**

- **POST `/webhook/asaas`** — `AsaasWebhookController::handle`: registra evento, sincroniza **faturas** (`AssinaturaFatura`) e status da assinatura conforme pagamentos da Asaas.

**Admin / debug (existem no `api.php`; cuidado em produção):**

- **GET `/admin/asaas/customer`**, `/admin/asaas/subscription`**, `/admin/assinaturas`** — consultas Asaas/dados locais (há grupo duplicado com e sem `auth:sanctum` no arquivo; tratar como restrito).

**Tela `/pagamento`:** usa motivos como `assinatura_pausada`, `assinatura_cancelada`, `conta_bloqueada`, pagamento em atraso; oferece reativar, atualizar cartão ou ir a `/upgrade`.

---

## 13. NPS (Net Promoter Score)

- **POST `/nps`** — salva nota 1–10 e comentário opcional; atualiza `ult_dat_nps` do usuário.
- **GET `/nps/check`** — se deve exibir pesquisa (primeira vez ou passaram 3 meses).
- **GET `/nps/historico`** — respostas anteriores do psicólogo.

O **login** também pode retornar flag de NPS conforme a mesma regra de 3 meses.

---

## 14. Lookups públicos (sem login)

**GET** `/especialidades`, `/temas`, `/convenios`, `/idiomas`, `/lookups/buscar` — usados por componentes de **perfil público** no frontend (`perfilPublicoService.js`).

**Observação:** o serviço chama rotas como `/perfil-publico` (CRUD foto, vídeo, preview). O controller `PerfilPublicoController` existe no backend, mas **não há registro dessas rotas no `routes/api.php` analisado** — funcionalidade pode estar desligada ou em outro arquivo de rotas; vale checar deploy.

---

## 15. Leads (contato / landing)

- **Backend:** `POST /leads` grava lead e envia e-mail interno de novo lead.
- **Frontend (`leadsService.js`):** na prática envia para **webhook N8N** (`https://n8n-n8n.ibn4qt.easypanel.host/webhook/lead`), não para `/leads` (código comentado). Para suporte: “formulário de contato pode ir direto ao N8N”.

---

## 16. FAQ dentro do sistema

- **Frontend:** `/faq` usa `faqService`: `GET /faq`, `/faq/categoria/{categoria}`, `/faq/buscar?termo=`, `/faq/{id}`.
- **Backend:** existe `FaqController` completo, mas **no `api.php` não há `Route` registrada para o FaqController** (apenas `use` importado). Se a página falhar ao carregar, a causa provável é **rotas FAQ não publicadas** na API.

---

## 17. Cronjobs (API, sem auth no grupo atual)

Chamadas GET típicas para agendador externo:

| Rota | Função |
|------|--------|
| `/cronjob/notificar-agendamentos` | E-mails do **dia**: consolidado para psicólogos (consultas de hoje) e lembrete por paciente; respeita `UserConfig` (e-mail). Timezone America/Sao_Paulo. |
| `/cronjob/aniversarios` | E-mail de aniversário para pacientes com e-mail e data de nascimento no dia. |
| `/cronjob/validar-pagamentos` | Registrada no `api.php`, mas **não há método correspondente** em `CronjobController` no código analisado — possível rota quebrada ou pendente de implementação. |

---

## 18. Evolution API (WhatsApp técnico)

Rotas autenticadas `/evolution-api` (CRUD instância, status, teste de envio). **O frontend principal analisado não referencia** essas rotas — uso administrativo ou futuro.

---

## 19. E-mails — o que existe e quando costuma disparar

Templates ficam em `resources/views` (nomes abaixo são os arquivos blade/html usados pelo `Mail::send`).

### 19.1 Usuários e conta (`EmailUsuarios`)

| Template / método | Quando (código ativo) |
|-------------------|------------------------|
| `emailContaRecemCriada` | Após cadastro bem-sucedido de psicólogo (`UsuariosController::cadastro`). |
| `emailDadosAlterados` | Alteração de e-mail, telefone ou senha no perfil/fluxos de usuário. |
| `emailUsuarioCadastradoComIndicacao` | Cadastro com código de indicação válido (e-mail para quem indicou). |
| `emailCodigoResetSenha` | Fluxo “esqueci minha senha” (código). |
| `emailNovoLead` | Novo lead em `POST /leads` (destino fixo no código — e-mail interno). |

### 19.2 Planos (métodos existem em `EmailUsuarios`; checar jobs/crons se ainda são chamados)

| Template | Uso típico (legado / disponível) |
|----------|----------------------------------|
| `emailPlanoRenovado` | Renovação — verificar chamadas em jobs antigos. |
| `enviarEmailFimPlanoAproximando`, `enviarEmailFimPlano` | Aviso de fim de plano. |
| `emailPlanoAtualizado` | Mudança de plano. |
| `codigoVerificacao` | 2FA — método `enviarEmailVerificacaoDuasEtapas` existe; **não há chamada encontrada** no `app` além da definição (recurso preparado ou desativado). |

### 19.3 Agendamentos

| Origem | Template | Conteúdo resumido |
|--------|----------|-------------------|
| `EmailNotificacoesAgendamentos` | `notificacaoAgendamento` | Psicólogo: consulta agendada com paciente (data/hora). |
| `EmailNotificacoesAgendamentos` | `notificacaoAgendamentoPaciente` | Paciente: lembrete com psicólogo e horário. |
| `CronjobController` (dia da consulta) | `emails.consulta-diaria-psicologo` | Lista **todas** as consultas de hoje para o psicólogo. |
| `CronjobController` | `emails.lembrete-consulta-paciente` | “Você tem consulta hoje” com horário. |
| `CronjobController` (aniversário) | `emails.aniversario` | Parabéns ao paciente com nome do psicólogo. |

### 19.4 Pagamento Asaas (job legado)

- `emails.pagamento-recusado` — enviado em `ProcessarWebhookAsaas` quando pagamento recusado (fluxo legado com modelo `Pagamento`); o webhook **atual** em `AsaasWebhookController` pode seguir outro caminho. Para suporte: “problema de cartão — verificar e-mail da Asaas e tela Configurações > Plano / Pagamento”.

### 19.5 Outros

- `abrirChamado` — classe `EmailAberturaChamados` existe; **sem referências** no restante do `app` grepado — possível feature antiga.

### 19.6 SMS e WhatsApp (não são e-mail)

- `NotificacoesAgendamentosSMSVonage`, `NotificacoesAgendamentosWhatsApp` — disparados em `verificarAgendamentos` quando o agendamento tem `tipo_notificacao` e `enviar_notificacoes_para` adequados.

---

## 20. Perguntas frequentes operacionais (respostas curtas para bot)

Para **“como faço X na tela”**, preferir sempre a seção **Guia do usuário — ações na interface** no início deste arquivo (lá está o passo a passo completo de **cadastrar paciente**; outros fluxos podem ser acrescentados no mesmo formato).

- **“Por que fui parar na tela de pagamento?”** — A assinatura está inativa, pausada, cancelada ou há falha de cobrança; o sistema libera só essa área até regularizar (reativar, novo plano ou cartão).
- **“Onde mudo cartão / plano?”** — Configurações → aba Plano; ou `/pagamento` se bloqueado.
- **“Lembretes de consulta”** — Na criação da consulta: data/hora da notificação e canais (e-mail/SMS/WhatsApp). Além disso, cron diário envia resumo do dia se as preferências em Configurações permitirem.
- **“Sessão na ficha x agenda”** — Na prática ambos usam a tabela de **agendamentos**; a agenda principal usa `POST /agendamento` com mais opções (notificação, recorrência). A rota `POST /paciente/{id}/sessao` é uma criação mais simples no backend.
- **“Exportar prontuário”** — Na lista de prontuários, exportação gera **PDF** pelo backend.
- **“Modelos de documentos”** — Em `/modelos-arquivos`, arquivos locais do frontend; não consomem API.
- **“Cadastro com Google pede mais dados”** — Normal até concluir `PUT /user/completar-cadastro`.
- **“NPS aparece de novo”** — A cada **3 meses** após a última resposta, ou na primeira vez.

---

## 21. Glossário rápido

- **Asaas:** gateway de pagamento recorrente (assinatura, faturas, webhook).
- **Sanctum:** tokens Bearer para API Laravel.
- **publicId / codigo_agendamento:** identificadores expostos ao frontend para edição em massa da série recorrente (`codigo_agendamento` igual em várias linhas).

---

*Gerado a partir do código em `psicoprontuarios/src` e `psicoprontuarios-v2` (Laravel). Se algo na API mudar, atualize este arquivo junto com o deploy.*
