# Psico Prontuários — Documentação Completa para IA

> **Como usar este arquivo:** Cole o conteúdo completo no início de qualquer conversa com uma IA (Cursor, Claude, ChatGPT, Copilot, etc.) para que ela entenda o projeto sem precisar de explicações adicionais. Mantenha este arquivo atualizado sempre que adicionar funcionalidades relevantes.

---

## 1. Visão Geral do Produto

**Psico Prontuários** é um SaaS B2B voltado para **psicólogos autônomos brasileiros**. O psicólogo se cadastra, assina um plano e ganha acesso a um sistema completo de gestão do consultório: pacientes, prontuários, agenda, financeiro, notificações via WhatsApp e uma landing page pública personalizada.

- **URL de produção (frontend):** `https://psico-prontuarios-landingpage.vercel.app`
- **URL de produção (API):** `https://psicoprontuarios-v2.lksoftware.com.br/public/api/`
- **Landing page pública do psicólogo:** `{slug}.psicoprontuarios.com.br`
- **Repositório frontend:** `https://github.com/lucaswalmor/psico-prontuario-landingpage`
- **Repositório backend:** `https://github.com/lucaswalmor/psicoprontuarios-v2`

---

## 2. Stack Tecnológica

### Backend (`psicoprontuarios-v2`)
- **Framework:** Laravel 11 (PHP 8.x)
- **Banco de dados:** MySQL
- **Autenticação:** Laravel Sanctum (tokens Bearer)
- **Pagamentos:** Asaas (assinaturas recorrentes + webhooks)
- **WhatsApp:** Evolution API v2 (instância própria por psicólogo)
- **Login social:** Google OAuth
- **E-mail transacional:** Resend (SMTP, domínio verificado obrigatório)
- **Deploy:** Docker + Easypanel

### Frontend (`psico-prontuario-landingpage`)
- **Framework:** Vue 3 com **Options API** (nunca Composition API)
- **Build:** Vite
- **UI:** PrimeVue 4 + PrimeFlex + PrimeIcons
- **CSS:** Tailwind CSS 3 + SCSS
- **Calendário:** FullCalendar (@fullcalendar/vue3)
- **Editor de texto rico:** Quill
- **Slider:** Swiper
- **Máscara de valores:** v-money3
- **Onboarding:** v-onboarding
- **State management:** Pinia
- **HTTP:** Axios
- **Deploy:** Vercel

### Regras de desenvolvimento obrigatórias
- Sempre usar **Options API** no Vue.js 3
- Sempre usar **Bootstrap 5.3.3** para layout (não Tailwind para estrutura de página)
- Nunca usar `<form>` HTML — usar event handlers (`onClick`, `onChange`)
- Manter `CONTEXTO.md` atualizado no backend a cada mudança

---

## 3. Estrutura dos Repositórios

### Backend — pastas principais
```
app/
  Http/
    Controllers/        # Controllers da API
    Requests/           # Form Requests com validações
    Resources/          # API Resources
  Models/               # Models Eloquent
  Services/             # Lógica de negócio
    Asaas/              # Integração Asaas
    Evolution/          # Integração WhatsApp
    Notificacoes/       # Serviços de notificação
    Site/               # Landing page do psicólogo
config/
  services.php          # Chaves de API externas (Asaas, Evolution, Google)
database/
  migrations/
  seeders/
routes/
  api.php               # Todas as rotas da API
```

### Frontend — pastas principais
```
src/
  views/
    pages/              # Telas do sistema (pacientes, agenda, financeiro, etc.)
    notificacoes/       # Telas de notificações WhatsApp
  components/
    dialogs/            # Dialogs reutilizáveis
    evolution/          # Componentes de configuração WhatsApp
  services/             # Chamadas à API (axios)
  config/
    environment.js      # VITE_API_URL e variáveis de ambiente
  router/
    authInactiveGuard.js # Guard de navegação por status de assinatura
```

---

## 4. Autenticação e Controle de Acesso

### Login
- `POST /api/login` — e-mail/senha
- `POST /api/auth/google` — Google OAuth (valida `id_token`, cria ou vincula usuário)
- Retorna token Sanctum + dados do usuário + flags de assinatura + NPS

### Estados de conta
- **Conta ativa (`user_ativo = true`):** acesso normal ao sistema
- **Conta inativa (`user_ativo = false`):** login retorna `status: 'inativo'` + `motivo` + token limitado → frontend redireciona para `/pagamento`

### Guard de navegação (`authInactiveGuard.js`)
- Sem token → `/login`
- `user_ativo = false` → apenas rotas públicas + `/pagamento`
- `statusAssinatura === 'sem_assinatura'` (e não vitalício) → apenas `/upgrade` e `/completar-cadastro`
- Usuário ativo acessando `/pagamento` → redireciona para `/dashboard`

### Recuperação de senha
- `POST /api/user/send-reset-code` → envia código por e-mail
- `POST /api/user/verify-reset-code` → valida código
- `POST /api/user/reset-password` → redefine senha

---

## 5. Planos e Assinaturas

### Planos disponíveis
| Plano | Slug | Descrição |
|---|---|---|
| Simples | `simples` | Funcionalidades básicas |
| Pro | `pro` | + IA no prontuário, WhatsApp, notificações. Trial 7 dias |
| Vitalício | `vitalicio` | Acesso total, sem cobrança recorrente |

### Estados de assinatura
| Status | Acesso |
|---|---|
| `trial` | ✅ Liberado (7 dias) |
| `ativa` | ✅ Liberado |
| `cancelada_pendencia` | ✅ Liberado até fim do ciclo pago |
| `pausada` | ❌ Bloqueado imediatamente |
| `cancelada_definitiva` | ❌ Bloqueado |

### Regras críticas de assinatura
- Login **nunca** chama a API do Asaas — depende exclusivamente do estado local (`user_ativo`)
- Um único `asaas_customer_id` por usuário (por CPF/CNPJ normalizado)
- **Cancelar plano no produto = `POST /api/assinatura/pausar`** (não `/cancelar`) — bloqueia acesso imediatamente; usuário é avisado antes de confirmar
- Upgrade não gera cobrança imediata — vale na próxima fatura
- Reativação não tem trial — cobrança começa imediatamente
- Dados de cartão **nunca** são armazenados no banco — ficam no Asaas

### Webhooks Asaas (`POST /api/webhook/asaas`)
| Evento | Ação |
|---|---|
| `PAYMENT_CONFIRMED` / `PAYMENT_RECEIVED` | `status = ativa`, `user_ativo = true` |
| `PAYMENT_OVERDUE` / `PAYMENT_FAILED` | `user_ativo = false` |
| `SUBSCRIPTION_DELETED` | `status = cancelada_definitiva` |
| `PAYMENT_CREATED` / `SUBSCRIPTION_CREATED` | Registra em `assinaturas_faturas`, sem mudança de status |

### Gating de features por plano (frontend)
```javascript
// Verifica se é Pro ou Vitalício
['pro', 'vitalicio'].includes($planService.resolverTipoPlanoUsuario())
```
Funcionalidades bloqueadas para plano Simples:
- IA no prontuário (melhorar texto + gerar relatório)
- Integração WhatsApp (Evolution)
- Aba Notificações (comemorativas + aniversariantes)

---

## 6. Módulos do Sistema

### 6.1 Pacientes
- CRUD completo: `GET/POST /api/paciente`, `PUT/DELETE /api/paciente/{id}`
- Campos principais: nome (obrigatório), CPF, data nascimento, e-mail, telefone, endereço (autocomplete de CEP), convênio, diagnóstico prévio, contato de emergência
- Ficha: estatísticas, anamnese, sessões, anexos
- Status de tratamento: Em Andamento, Recesso, Concluído → `PUT /api/paciente/status/{id}`
- **Dados isolados por psicólogo** — Sanctum garante que cada usuário vê apenas os seus pacientes

### 6.2 Prontuários
- CRUD: `GET/POST /api/prontuario/paciente/{id}`, `PUT/DELETE /api/prontuario/{id}`
- Métricas clínicas por sessão: Humor (1–10), Progresso (1–10), Ansiedade GAD-7 (0–21), Depressão PHQ-9 (0–27)
- Exportação PDF: por prontuário (`/prontuario/{id}/exportar`) ou todos de um paciente (`/prontuario/paciente/{id}/exportar`)
- **IA (apenas Pro/Vitalício):** melhorar texto no editor (`DialogNovoProntuario.vue`) e gerar relatório profissional (`FichaPaciente.vue`)

### 6.3 Agenda
- `GET /api/agendamentos` — lista para o calendário
- `POST /api/agendamento` — criar; suporta recorrência semanal/quinzenal/mensal (até 52/26/12 ocorrências)
- `PUT /api/agendamento/{id}` — remarcar
- `DELETE /api/agendamento/{id}` — excluir uma consulta
- `DELETE /api/agendamentos/{codAgendamento}` — excluir toda a série recorrente
- Notificações: data/hora exata + canais (e-mail, SMS, WhatsApp) definidos na criação; disparadas pelo endpoint `GET /api/verificar-agendamentos` (cron)

### 6.4 Financeiro
- CRUD: `GET/POST /api/financeiros`, `PUT/DELETE /api/financeiros/{id}`
- `GET /api/financeiros/dashboard` — dados para gráficos
- `POST /api/financeiros/pagar-lote` — marcar vários como pagos
- Categorias personalizadas: `CRUD /api/categoria-financeiro`
- Campos: tipo (receita/despesa), valor, data, status pagamento (`paga`), data pagamento, categoria

### 6.5 Dashboard
- `GET /api/dashboard` — totais de pacientes por status, aniversariantes do mês, últimos pacientes, agendamentos do dia, métricas financeiras, evoluções temporais

### 6.6 Meu Site (Landing Page Pública)
Cada psicólogo tem uma landing pública em `{slug}.psicoprontuarios.com.br`.

- **Slug:** gerado automaticamente do nome completo no cadastro — **fixo, não editável pelo usuário**
- `GET /api/site/{slug}` — JSON flat público para a landing (com cache Laravel 1h)
- `GET /api/site/meu-site` — dados do painel (inicializa automaticamente se não existir)

Abas do painel "Meu Site":
- **Geral** (`PUT /api/site/configuracoes`): WhatsApp, e-mail, endereço, CRP, tipo de atendimento
- **Aparência** (`PUT /api/site/cores`): cores por seção (hex) — header, hero, sobre, especialidades, como funciona, benefícios, CTA, contato, footer
- **Textos** (`PUT /api/site/informacoes`): hero, sobre, CTA, seção "Como funciona" (4 passos)
- **Especialidades** (`PUT /api/site/temas` + `/api/site/especialidades`): temas tratados + abordagens terapêuticas
- **Horários** (`PUT /api/site/horarios`): grade semanal (seg–dom), hora início/fim, toggle ativo

### 6.7 WhatsApp — Evolution API v2 (Pro/Vitalício)
- Instância própria por psicólogo na Evolution API
- `POST /api/evolution/instancia` — cria instância
- `GET /api/evolution/instancia/status` — verifica se conectado
- `GET /api/evolution/instancia/qrcode` — QR code para vincular celular
- `POST /api/evolution/instancia/mensagem-teste` — envia mensagem teste
- `DELETE /api/evolution/instancia` — remove instância

### 6.8 Notificações WhatsApp (Pro/Vitalício + Evolution conectado)

**Datas Comemorativas:**
- Mensagens automáticas para datas especiais (ex: Dia do Psicólogo, Natal)
- `GET/POST/PUT/DELETE /api/notificacoes/datas-comemorativas`
- Cron: `GET /api/cronjob/datas-comemorativas`

**Aniversariantes:**
- Mensagem automática no aniversário de cada paciente
- `GET/POST/PUT/DELETE /api/notificacoes/aniversariantes`
- Cron: `GET /api/cronjob/aniversariantes`

### 6.9 Configurações do Usuário
- `GET/PUT /api/user-config` — preferências de notificação (e-mail/WhatsApp para psicólogo e pacientes)
- `GET/PUT /api/user/profile` — perfil do psicólogo
- `PUT /api/user/change-password` — troca de senha autenticada
- `GET /api/assinatura/painel` — assinatura atual + até 100 faturas

### 6.10 Modelos de Arquivos
- Tela `/modelos-arquivos` — arquivos `.docx` estáticos para download (sem API)
- Documentos: Declaração de Comparecimento, Contrato de Prestação de Serviço, Receituário Psicológico, Modelo de Encaminhamento, Ficha de Evolução

### 6.11 FAQ e NPS
- FAQ: `GET /api/faq`, `/api/faq/categoria/{categoria}`, `/api/faq/buscar?termo=`, `/api/faq/{id}`
- NPS: `POST /api/nps` (nota 1–10 + comentário); aparece no login a cada 3 meses

---

## 7. Banco de Dados — Tabelas Principais

```
users                           — Usuários/psicólogos (user_ativo, usuario_vitalicio, asaas_customer_id)
pacientes                       — Pacientes dos psicólogos
agendamentos                    — Consultas (publicId, codigo_agendamento para séries)
prontuarios                     — Sessões clínicas com métricas
financeiros                     — Lançamentos financeiros (paga, data_pagamento)
planos                          — Catálogo de planos
assinaturas                     — Assinaturas recorrentes (Asaas-centric)
assinaturas_faturas             — Histórico de eventos/faturas do Asaas
users_evolution_api             — Instância WhatsApp por usuário
datas_comemorativas             — Catálogo de datas especiais (nome, icone, MM-DD)
mensagens_comemorativas         — Mensagem configurada por data por psicólogo
mensagens_comemorativas_pacientes — Pacientes vinculados a cada mensagem
mensagens_templates_aniversario — Templates globais de aniversário
mensagens_aniversariantes_pacientes — Config por psicólogo/paciente para aniversário
site_configuracoes              — Config geral da landing (slug único, tipo_atendimento)
site_cores                      — Cores por seção da landing (hex, colunas *_section_*_color)
site_informacoes                — Textos da landing (hero, sobre, CTA, como funciona)
site_temas_tratados             — Pivot: temas do psicólogo
site_especialidades             — Pivot: abordagens terapêuticas do psicólogo
site_horarios_atendimento       — Horários por dia da semana (0=Dom...6=Sáb)
temas_tratados                  — Catálogo de temas (id, nome, icone emoji)
especialidades_abordagens       — Catálogo de abordagens terapêuticas
```

### Relacionamentos principais
```
User → hasMany: Pacientes, Agendamentos, Prontuarios, Financeiros, Assinaturas
User → hasOne: ConfiguracaoSite, CoresSite, InformacoesSite, UserEvolutionApi
User → belongsToMany: TemasTratados, EspecialidadesAbordagens
```

---

## 8. Variáveis de Ambiente Necessárias

### Backend (`.env`)
```env
# App
APP_URL=https://psicoprontuarios-v2.lksoftware.com.br
APP_KEY=...

# Banco
DB_CONNECTION=mysql
DB_HOST=...
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

# Mail (Resend — domínio verificado obrigatório)
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_USERNAME=resend
MAIL_PASSWORD=...
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=noreply@seudominio.com.br
MAIL_FROM_NAME="Psico Prontuários"

# Asaas
ASAAS_API_KEY=...
ASAAS_API_URL=https://api-sandbox.asaas.com/v3  # ou https://api.asaas.com/v3 em prod
ASAAS_WEBHOOK_TOKEN=...
ASAAS_GRACE_PERIOD_DAYS=3

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

# Evolution API v2 (WhatsApp)
EVOLUTION_API_URL=https://sua-evolution.dominio.com
EVOLUTION_API_KEY=...

# Banco de produção (apenas para db:pull-production, nunca commitar)
PROD_DB_HOST=...
PROD_DB_PORT=3306
PROD_DB_USERNAME=...
PROD_DB_PASSWORD=...
PROD_DB_DATABASE=...
```

### Frontend (`.env`)
```env
VITE_API_URL=https://psicoprontuarios-v2.lksoftware.com.br/public/api/
VITE_N8N_CHAT_WEBHOOK_URL=https://n8n-n8n.ibn4qt.easypanel.host/webhook/...
```

---

## 9. Comandos Artisan Customizados

```bash
# Backup do banco
php artisan backup:database

# Pull do banco de produção para local
php artisan db:pull-production
php artisan db:pull-production --dump-only     # só gera o dump
php artisan db:pull-production --no-clean      # mantém o arquivo .sql

# Seeders (todos seguros para produção via updateOrCreate)
php artisan db:seed
php artisan db:seed --class=PlanosSeeder
php artisan db:seed --class=ConfigurarSitePsicologosExistentesSeeder
```

---

## 10. Rotas da API — Referência Completa

### Públicas (sem autenticação)
```
POST   /api/login
POST   /api/auth/google
POST   /api/user/send-reset-code
POST   /api/user/verify-reset-code
POST   /api/user/reset-password
GET    /api/planos
GET    /api/planos/{id}
GET    /api/planos/slug/{slug}
GET    /api/site/{slug}               # Landing pública do psicólogo
POST   /api/leads                     # Formulário de contato
POST   /api/webhook/asaas             # Webhook Asaas
GET    /api/cronjob/notificar-agendamentos
GET    /api/cronjob/datas-comemorativas
GET    /api/cronjob/aniversariantes
```

### Autenticadas (`Authorization: Bearer {token}`)
```
# Usuário e sessão
GET    /api/user
POST   /api/logout
PUT    /api/user/profile
PUT    /api/user/change-password
PUT    /api/user/completar-cadastro

# Pacientes
GET    /api/paciente                   # Lista paginada com filtros
GET    /api/pacientes                  # Lista simplificada (todos)
GET    /api/paciente/{id}
POST   /api/paciente
PUT    /api/paciente/{id}
DELETE /api/paciente/{id}
PUT    /api/paciente/status/{id}       # Altera status_tratamento
GET    /api/paciente/{id}/estatisticas
GET    /api/paciente/{id}/sessoes
POST   /api/paciente/{id}/sessao
DELETE /api/paciente/sessao/{sessaoId}
GET    /api/paciente/{id}/anexos
POST   /api/anexos/paciente/{id}
POST   /api/anexos/paciente/{id}/multiple
GET    /api/anexos/{id}/download
DELETE /api/anexos/{id}
GET/POST/PUT /api/paciente/{id}/anamnese

# Prontuários
GET    /api/prontuario/paciente/{id}
POST   /api/prontuario/paciente/{id}
PUT    /api/prontuario/{id}
DELETE /api/prontuario/{id}
GET    /api/prontuario/{id}/exportar
GET    /api/prontuario/paciente/{id}/exportar
GET    /api/paciente/{id}/evolucao

# Agendamentos
GET    /api/agendamentos
GET    /api/agendamento/{id}
GET    /api/agendamentos/paciente/{id}
POST   /api/agendamento
PUT    /api/agendamento/{id}
DELETE /api/agendamento/{id}
DELETE /api/agendamentos/{codAgendamento}  # Exclui série inteira

# Financeiro
GET    /api/financeiros
GET    /api/financeiros/{id}
POST   /api/financeiros
PUT    /api/financeiros/{id}
DELETE /api/financeiros/{id}
GET    /api/financeiros/dashboard
POST   /api/financeiros/pagar-lote
CRUD   /api/categoria-financeiro

# Dashboard
GET    /api/dashboard

# Assinatura
GET    /api/assinatura/painel
POST   /api/assinatura/iniciar
POST   /api/assinatura/cancelar
POST   /api/assinatura/pausar
POST   /api/assinatura/reativar
POST   /api/assinatura/upgrade
POST   /api/assinatura/atualizar-cartao

# Meu Site
GET    /api/site/meu-site
PUT    /api/site/configuracoes
PUT    /api/site/cores
PUT    /api/site/informacoes
PUT    /api/site/temas
PUT    /api/site/especialidades
PUT    /api/site/horarios
GET    /api/temas
GET    /api/especialidades

# WhatsApp (Evolution)
GET    /api/evolution/instancia
POST   /api/evolution/instancia
DELETE /api/evolution/instancia
GET    /api/evolution/instancia/status
GET    /api/evolution/instancia/qrcode
POST   /api/evolution/instancia/mensagem-teste

# Notificações WhatsApp
GET    /api/notificacoes/datas-comemorativas/datas-disponiveis
CRUD   /api/notificacoes/datas-comemorativas
CRUD   /api/notificacoes/aniversariantes
GET    /api/notificacoes/aniversariantes/templates

# Configurações do usuário
GET    /api/user-config
PUT    /api/user-config
POST   /api/user-config/reset

# NPS
POST   /api/nps
GET    /api/nps/check
GET    /api/nps/historico

# FAQ
GET    /api/faq
GET    /api/faq/{id}
GET    /api/faq/categoria/{categoria}
GET    /api/faq/buscar
```

---

## 11. Rotas do Frontend (Vue Router)

| Rota | Descrição |
|---|---|
| `/` | Landing de marketing do produto |
| `/login` | Login |
| `/cadastro` | Cadastro de novo psicólogo |
| `/change-password` | Redefinição de senha |
| `/completar-cadastro` | Completar dados após Google OAuth |
| `/upgrade` | Primeira assinatura / troca de plano |
| `/dashboard` | Painel principal com métricas |
| `/pacientes` | Lista de pacientes |
| `/pacientes/cadastro` | Novo paciente |
| `/pacientes/editar/:id` | Editar paciente |
| `/pacientes/prontuarios/:id` | Prontuários do paciente |
| `/pacientes/anexos/:id` | Anexos do paciente |
| `/pacientes/ficha/:id` | Ficha completa do paciente |
| `/agendamentos` | Calendário de consultas |
| `/financeiro/receitas` | Receitas |
| `/financeiro/despesas` | Despesas |
| `/financeiro/novo` | Novo lançamento |
| `/financeiro/editar/:id` | Editar lançamento |
| `/configuracoes` | Configurações (abas: Plano, WhatsApp, Notificações, Segurança) |
| `/meu-site` | Painel da landing page do psicólogo |
| `/perfil` | Perfil do psicólogo |
| `/modelos-arquivos` | Biblioteca de documentos .docx |
| `/faq` | FAQ |
| `/pagamento` | Tela de bloqueio por inadimplência/pausa |
| `/politica-privacidade` | Política de privacidade |
| `/termos-uso` | Termos de uso |

---

## 12. Inconsistências Conhecidas e Armadilhas

> Atenção especial ao trabalhar nestes pontos:

- **Rotas `/sessao`:** existem closures placeholder em `api.php` que retornam JSON fixo. O fluxo real de sessões usa `POST /api/paciente/{id}/sessao` e `DELETE /api/paciente/sessao/{id}` — nunca as closures
- **Rotas FAQ:** `FaqController` existe mas pode não estar registrado em `api.php` — verificar antes de usar
- **Leads:** `leadsService.js` envia para webhook N8N (`n8n-n8n.ibn4qt.easypanel.host`), não para `/api/leads` diretamente
- **`/assinatura`:** redireciona para `/configuracoes`, não é uma tela independente
- **Cancelar plano:** usar sempre `POST /api/assinatura/pausar` na UI (não `/cancelar`) — bloqueia acesso imediatamente; mostrar aviso antes de confirmar
- **Slug do psicólogo:** campo fixo, nunca editável. Backend remove do request em `UpdateConfiguracoesSiteRequest::prepareForValidation()`
- **Dark mode PrimeVue (preset noir):** `--primary-color` em dark mode = `surface.50` (near-white). Usar `--p-primary-500` (light) e `--p-primary-600` via `:global(.app-dark)` para garantir contraste
- **v-onboarding:** `exit()` não encerra overlay — usar `finish()` no evento `@finish` com flag `dismissed`
- **Asaas CPF:** validar 11 dígitos com `Helpers::validarCPF` antes de enviar — API rejeita CPF inválido com `invalid_object`
- **E-mail com Resend:** remetente deve ser de domínio verificado no painel Resend. Com domínio errado retorna 550 SMTP

---

## 13. Serviços e Classes Importantes

### Backend
| Arquivo | Responsabilidade |
|---|---|
| `app/Services/Asaas/AssinaturaService.php` | Criação/gestão de assinaturas no Asaas |
| `app/Services/Evolution/EvolutionService.php` | Chamadas à Evolution API (instância, envio de mensagens) |
| `app/Services/Site/ConfigurarSitePsicologoService.php` | Inicializa landing page do psicólogo no cadastro |
| `app/Services/Notificacoes/NotificacaoComemorativaService.php` | Disparo de mensagens comemorativas |
| `app/Services/Notificacoes/NotificacaoAniversarianteService.php` | Disparo de mensagens de aniversário |
| `app/Http/Resources/LandingPageResource.php` | JSON flat da landing pública |
| `app/Http/Controllers/AsaasWebhookController.php` | Processa eventos do Asaas |
| `app/Http/Controllers/CronjobNotificacoesController.php` | Cron de notificações comemorativas |
| `app/Http/Controllers/CronjobAniversariantesController.php` | Cron de aniversariantes |

### Frontend
| Arquivo | Responsabilidade |
|---|---|
| `src/router/authInactiveGuard.js` | Guard de navegação por status de assinatura |
| `src/services/planService.js` | Resolve tipo de plano do usuário (`resolverTipoPlanoUsuario()`) |
| `src/config/environment.js` | `VITE_API_URL` e variáveis de ambiente |
| `src/views/pages/Configuracoes.vue` | Tela de configurações (abas Plano, WhatsApp, Notificações, Segurança) |
| `src/views/pages/meu-site/MeuSite.vue` | Painel da landing page do psicólogo |
| `src/components/evolution/EvolutionConfig.vue` | Configuração WhatsApp (QR code, status, polling) |
| `src/components/PlanoPro.vue` | Componente de upgrade exibido para usuários sem plano Pro |

---

## 14. E-mails Transacionais Disparados

| Trigger | Template | Destinatário |
|---|---|---|
| Cadastro de psicólogo | `emailContaRecemCriada` | Psicólogo |
| Alteração de dados sensíveis | `emailDadosAlterados` | Psicólogo |
| Recuperação de senha | `emailCodigoResetSenha` | Psicólogo |
| Novo lead no site | `emailNovoLead` | Admin (lucaswsb52@gmail.com) |
| Consulta agendada | `notificacaoAgendamento` | Psicólogo |
| Lembrete de consulta | `notificacaoAgendamentoPaciente` | Paciente |
| Consultas do dia (cron) | `emails.consulta-diaria-psicologo` | Psicólogo |
| Lembrete do dia (cron) | `emails.lembrete-consulta-paciente` | Paciente |
| Pagamento recusado | `emails.pagamento-recusado` | Psicólogo |

---

## 15. Infraestrutura e Deploy

- **Backend:** Docker (Alpine), Easypanel; Dockerfile na raiz do repositório
- **Frontend:** Vercel, build automático do branch `master`
- **Banco:** MySQL (produção); backup via `php artisan backup:database`
- **Domínio landing pública:** subdomínio wildcard `*.psicoprontuarios.com.br` via DNS
- **Crons:** chamadas HTTP GET externas para os endpoints `/api/cronjob/*` (sem autenticação)
- **CI/CD:** GitHub Actions (`.github/workflows/`)

---

## 16. Usuário Admin (Desenvolvimento/Produção)

```
E-mail: lucaswsb52@gmail.com
Plano:  Vitalício (acesso total, sem cobrança)
Tipo:   admin
```

---

*Última atualização: Junho/2026. Manter este arquivo sincronizado com o `CONTEXTO.md` do backend a cada nova feature relevante.*
