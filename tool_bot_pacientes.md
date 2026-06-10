Manual de Suporte: Gestão de Pacientes - PsicoProntuários (Versão Hub)
Este manual detalha todas as funcionalidades da seção de Pacientes da plataforma PsicoProntuários, servindo como base de conhecimento definitiva para o suporte e integração com bots de atendimento no n8n.

**Importante:** A ficha do paciente **não usa mais abas**. Ela foi reorganizada em um **hub central** (`/pacientes/ficha/:id`) com **cards de navegação**. Cada área (Dados, Prontuários, Sessões, etc.) abre em uma **tela dedicada** com botão **"Voltar à ficha"**.




Índice
1. Listagem de Pacientes
2. Ficha do Paciente — Hub (visão geral)
3. Tela: Dados Pessoais
4. Tela: Prontuários
5. Tela: Sessões
6. Tela: Anexos
7. Tela: Anamnese
8. Tela: Evolução
9. Rotas e compatibilidade
10. FAQ — Perguntas e Respostas Diretas




1. Listagem de Pacientes
A tela principal de pacientes (`/pacientes`) é o ponto de partida para a gestão clínica.

O que é exibido na tela
Tabela com todos os pacientes cadastrados.
Botões superiores: Filtros e + Novo Paciente.
Paginação para navegação entre registros.

Campos visíveis na tabela
Nome: Nome completo do paciente (clicável para acessar a ficha).
Telefone: Número de contato principal.
Status: Situação do tratamento (ex: Em Andamento, Recesso, Concluído).
Ações: Botão de menu (três pontos) para ações rápidas.

Filtros e busca disponíveis
Ao clicar em Filtros, é possível localizar pacientes por:
Nome
E-mail
Telefone

Como cadastrar um novo paciente
Clique em + Novo Paciente.
Preencha obrigatoriamente o Nome Completo.
Insira CPF, Data de Nascimento, Telefone e E-mail.
Opcionalmente, preencha Dados Profissionais e Endereço.
Clique em Salvar Paciente no canto superior direito.

Como abrir a ficha de um paciente
Na listagem, clique na **linha** do paciente ou no ícone de ação **Ver Ficha**.
O sistema abre o **hub da ficha** em `/pacientes/ficha/:id`.




2. Ficha do Paciente — Hub (visão geral)
Rota: `/pacientes/ficha/:id`

A ficha centraliza o histórico e as ferramentas de atendimento. Ao abrir um paciente, o usuário vê primeiro o **hub** — uma tela-resumo com cabeçalho e **6 cards** que levam às áreas detalhadas.

Cabeçalho (lado esquerdo)
Nome do paciente em destaque.
Badge de **Status do tratamento** logo abaixo do nome (ex.: Em Andamento, Recesso, Concluído).
O badge é **clicável** (quando o usuário tem permissão de edição) e abre um diálogo para alterar o status.

Cabeçalho (lado direito)
Botões **Editar** e **Excluir** (quando permitido pelo plano).
Cartão de **dados rápidos** com três colunas separadas por divisores:
Data de nascimento (com idade, quando cadastrada)
Telefone
E-mail
Se algum dado não estiver cadastrado, o campo exibe **"—"** (travessão).

Seção "Áreas do Paciente"
Grade com **6 cards** clicáveis. Cada card abre uma tela exclusiva:

| Card | Rota | Conteúdo resumido |
|------|------|-------------------|
| Dados Pessoais | `/pacientes/ficha/:id/dados` | Informações cadastrais em modo leitura |
| Prontuários | `/pacientes/ficha/:id/prontuarios` | Registros clínicos, exportação e I.A |
| Sessões | `/pacientes/ficha/:id/sessoes` | Agendamentos e histórico do paciente |
| Anexos | `/pacientes/ficha/:id/anexos` | Upload e gestão de arquivos |
| Anamnese | `/pacientes/ficha/:id/anamnese` | Formulário clínico inicial |
| Evolução | `/pacientes/ficha/:id/evolucao` | Gráficos e métricas de progresso |

Indicadores nos cards (badges)
No card **Sessões**: exibe quantidade de sessões **agendadas** e **pendentes** (ex.: "12 agendadas · 0 pendentes").
No card **Anexos**: exibe o **total de arquivos** anexados (ex.: "0 arquivo(s)").

Ações de gestão no hub
Alterar status: Clique no badge de status abaixo do nome → selecione Em Andamento, Recesso ou Concluído → confirme.
Editar: Botão **Editar** no topo direito → abre `/pacientes/editar/:id`.
Excluir: Botão **Excluir** no topo direito → remove o paciente após confirmação (irreversível; apaga prontuários e anexos vinculados).




3. Tela: Dados Pessoais
Rota: `/pacientes/ficha/:id/dados`

Tela dedicada com cabeçalho **"Dados Pessoais"**, subtítulo com o nome do paciente e botão **"Voltar à ficha"** (retorna ao hub).

Campos exibidos (modo leitura)
Nome Completo, Telefone, E-mail, Data de Nascimento e Status do Tratamento.

Como editar os dados cadastrais
Esta tela é somente leitura. Para alterar, use **Editar** no hub da ficha ou volte à listagem e edite o paciente.




4. Tela: Prontuários
Rota: `/pacientes/ficha/:id/prontuarios`

Registro técnico das evoluções terapêuticas. Possui botão **"Voltar à ficha"** no topo.

Botões de ação (topo da tela)
**Novo Prontuário**: Cria um registro clínico.
**Exportar Todos**: Disponível quando há prontuários — gera PDF com todo o histórico.
**Gerar relatório com I.A**: Disponível quando há prontuários — consolida resumo, padrões e evolução (plano Pro ou Vitalício).

Como criar um novo prontuário
Na tela Prontuários, clique em **+ Novo Prontuário**.
Defina a Data do Prontuário.
Preencha as métricas opcionais (0-10 ou escalas GAD-7/PHQ-9).
Escreva o relato no campo Descrição.
Clique em Salvar.

Menu de Ações do Prontuário
Ao clicar nos três pontos ao lado de um prontuário:
Prontuário: Abre o dialog para editar o conteúdo do prontuário existente.
Exportar Prontuário: Gera um arquivo PDF individual do registro.
Excluir Prontuário: Remove permanentemente o registro.

Exportação PDF
Individual: Via menu de ações do prontuário específico.
Completa: Botão **Exportar Todos** no topo da tela.

Recursos de I.A (plano Pro ou Vitalício)
Melhorar texto com I.A: No editor do prontuário (+ Novo Prontuário ou editar existente), botão "Melhorar texto com I.A" — exige pelo menos 100 caracteres na descrição. Usuários do plano Simples veem etiqueta PRO e tela de upgrade.
Gravar resumo por voz: No formulário de novo ou editar prontuário, botão "Gravar resumo por voz" (etiqueta PRO no plano Simples). Grave o resumo da sessão, envie e revise o texto transcrito antes de salvar. Exige permissão de microfone no navegador.
Gerar relatório com I.A: Botão **Gerar relatório com I.A** no topo da tela Prontuários — consolida resumo, padrões, evolução e observações a partir dos prontuários.




5. Tela: Sessões
Rota: `/pacientes/ficha/:id/sessoes`

Gestão de agendamentos e horários do paciente. Possui botão **"Voltar à ficha"**.

Elementos da tela
Navegação por **mês** (setas anterior/próximo).
Botão **+ Nova Sessão**.
Tabela com data, hora, paciente e ações.

Como agendar uma nova sessão
Clique em **+ Nova Sessão**.
Selecione a Data e o Horário.
Campos Dinâmicos: Após selecionar o horário, surgem campos adicionais:
Tipo de Atendimento: Online ou Presencial.
Valor da Sessão: Campo para definir o preço específico.
Status Inicial: Confirmado ou Pendente.
Observações: Campo de texto livre para notas rápidas.
Clique em Agendar.

Ações na listagem de sessões
Editar Sessão: Altera detalhes do agendamento.
Excluir Sessão: Remove o registro da lista.
Excluir todas as sessões: Remove em massa todos os agendamentos vinculados ao paciente.

Relação com a agenda principal
Agendamentos criados em **Agendamentos** (`/agendamentos`) também aparecem na tela **Sessões** da ficha do paciente.




6. Tela: Anexos
Rota: `/pacientes/ficha/:id/anexos`

Armazenamento de documentos externos. Possui botão **"Voltar à ficha"**.

Upload: Clique em **Upload de Anexo**, escolha o arquivo e confirme.
Formatos: Aceita PDF, imagens (JPG/PNG) e documentos de texto.
Gestão: Ícones na lista permitem Download ou Excluir o arquivo.
O total de anexos também aparece como badge no card **Anexos** do hub.




7. Tela: Anamnese
Rota: `/pacientes/ficha/:id/anamnese`

Histórico clínico inicial estruturado. Possui botão **"Voltar à ficha"**.

Campos principais (preencher detalhadamente):
Motivo da Consulta, História do Problema Atual, Sintomas Principais, Duração dos Sintomas, Intensidade dos Sintomas, Fatores Desencadeantes, Fatores que Melhoram, Fatores que Pioram, Impacto na Vida Diária, Tentativas de Tratamento Anteriores, Medicamentos Atuais, Histórico Psiquiátrico, Histórico Médico, Histórico Familiar, Uso de Substâncias, Relacionamentos, Trabalho/Estudo, Atividades de Lazer, Suporte Social, Expectativas do Tratamento, Observações Adicionais.

Para salvar, preencha os campos e clique no botão **Salvar** na própria tela.




8. Tela: Evolução
Rota: `/pacientes/ficha/:id/evolucao`

Visualização gráfica do progresso. Possui botão **"Voltar à ficha"**.

Consolida as métricas (Humor, Ansiedade, Depressão) inseridas nos prontuários.
Exibe gráficos de linha com a variação das pontuações ao longo do tempo.
Cards de resumo: Média Atual, Tendência, Baseline e Melhor Período.
Seção de insights quando disponível.




9. Rotas e compatibilidade

Rotas principais
| Rota | Função |
|------|--------|
| `/pacientes` | Lista de pacientes |
| `/pacientes/cadastro` | Cadastro de novo paciente |
| `/pacientes/editar/:id` | Edição do cadastro |
| `/pacientes/ficha/:id` | Hub da ficha (entrada principal) |
| `/pacientes/ficha/:id/dados` | Dados pessoais |
| `/pacientes/ficha/:id/prontuarios` | Prontuários |
| `/pacientes/ficha/:id/sessoes` | Sessões |
| `/pacientes/ficha/:id/anexos` | Anexos |
| `/pacientes/ficha/:id/anamnese` | Anamnese |
| `/pacientes/ficha/:id/evolucao` | Evolução |

Redirecionamentos legados (ainda funcionam)
| Rota antiga | Redireciona para |
|-------------|------------------|
| `/pacientes/prontuarios/:pacienteId` | `/pacientes/ficha/:id/prontuarios` |
| `/pacientes/anexos/:id` | `/pacientes/ficha/:id/anexos` |
| `/pacientes/ficha/:id?tab=0` | `/pacientes/ficha/:id/dados` |
| `/pacientes/ficha/:id?tab=1` | `/pacientes/ficha/:id/prontuarios` |
| `/pacientes/ficha/:id?tab=2` | `/pacientes/ficha/:id/sessoes` |
| `/pacientes/ficha/:id?tab=3` | `/pacientes/ficha/:id/anexos` |
| `/pacientes/ficha/:id?tab=4` | `/pacientes/ficha/:id/anamnese` |
| `/pacientes/ficha/:id?tab=5` | `/pacientes/ficha/:id/evolucao` |

Navegação entre hub e telas
Em qualquer tela de área (Dados, Prontuários, etc.), o botão **"Voltar à ficha"** retorna ao hub `/pacientes/ficha/:id`.
No hub, clique no card da área desejada para abrir a tela correspondente.




10. FAQ — Perguntas e Respostas Diretas

P: Onde fica a ficha do paciente agora? Tem abas?
R: Não há mais abas. Ao abrir um paciente, você vê o **hub** em `/pacientes/ficha/:id` com cards para Dados Pessoais, Prontuários, Sessões, Anexos, Anamnese e Evolução. Clique no card para abrir a tela dedicada.

P: Como volto do prontuário para a ficha?
R: Clique em **"Voltar à ficha"** no topo da tela. Você retorna ao hub com os cards.

P: Como faço para criar um novo prontuário?
R: Abra a ficha do paciente → clique no card **Prontuários** → botão **"+ Novo Prontuário"** → preencha e salve.

P: Como edito um prontuário que já foi salvo?
R: Na tela **Prontuários**, clique nos três pontos ao lado do registro e selecione **Prontuário**.

P: Posso exportar todo o histórico do paciente para PDF?
R: Sim. Na tela **Prontuários**, clique em **Exportar Todos** (visível quando há prontuários).

P: Como altero o status de um paciente para 'Concluído'?
R: No **hub da ficha**, clique no badge de status abaixo do nome do paciente → escolha **Concluído** → confirme.

P: Onde registro a Anamnese?
R: Hub da ficha → card **Anamnese** → preencha os campos → **Salvar**.

P: Quais campos aparecem ao agendar uma nova sessão?
R: Após selecionar data e hora: Tipo de Atendimento (Online/Presencial), Valor da Sessão, Status Inicial e Observações.

P: Como vejo o gráfico de evolução do paciente?
R: Hub da ficha → card **Evolução**. Os gráficos são gerados a partir das métricas dos prontuários.

P: Posso anexar um PDF de exame ou laudo?
R: Sim. Hub → card **Anexos** → **Upload de Anexo** (PDF, JPG, PNG).

P: Como excluo permanentemente um paciente?
R: No **hub da ficha**, botão **Excluir** no topo direito → confirme. Apaga todos os dados vinculados.

P: Como busco um paciente pelo telefone?
R: Tela **Pacientes** → **Filtros** → campo Telefone → filtrar.

P: O que é a escala GAD-7 no prontuário?
R: Campo opcional para registrar pontuação de ansiedade (0 a 21) na sessão.

P: O que é a escala PHQ-9 no prontuário?
R: Campo opcional para registrar nível de depressão (0 a 27) na sessão.

P: Posso imprimir apenas um prontuário isolado?
R: Sim. Menu de três pontos do prontuário → **Exportar Prontuário**.

P: Como uso a I.A para melhorar o texto do prontuário?
R: Na tela **Prontuários**, abra ou crie um prontuário. Com plano Pro ou Vitalício, use **Melhorar texto com I.A** (mínimo 100 caracteres).

P: Como gravo o resumo da sessão por voz no prontuário?
R: Com plano Pro ou Vitalício, em Novo/Editar Prontuário → **Gravar resumo por voz** → autorize o microfone → envie e revise antes de salvar.

P: A gravação por voz não funciona / dá erro.
R: Verifique permissão do microfone, grave alguns segundos antes de enviar e use Chrome ou Edge atualizado. Se houver limite da API, aguarde ou contate o suporte.

P: Como gero um relatório profissional com I.A?
R: Tela **Prontuários** → **Gerar relatório com I.A** (Pro ou Vitalício).

P: Sou do plano Simples — posso usar I.A no prontuário?
R: Não. Melhoria de texto e relatório com I.A são do plano Pro ou Vitalício.

P: Como registro medicamentos na Anamnese?
R: Tela **Anamnese** → campo **Medicamentos Atuais**.

P: Consigo apagar todos os agendamentos de um paciente de uma vez?
R: Sim. Tela **Sessões** → opção **Excluir todas as sessões**.

P: Onde vejo quantas sessões estão agendadas ou pendentes?
R: No **hub**, o card **Sessões** mostra um resumo (ex.: "12 agendadas · 0 pendentes"). Detalhes completos na tela Sessões.

P: Como altero o endereço de um paciente?
R: Hub → **Editar** (ou listagem → editar) → seção de endereço → salvar.

P: O que preencher em 'Fatores Desencadeantes' na Anamnese?
R: Situações, pensamentos ou eventos que disparam os sintomas.

P: Como defino se a sessão será Online ou Presencial?
R: Ao criar **Nova Sessão**, selecione o horário para liberar o campo **Tipo de Atendimento**.

P: O sistema avisa se o paciente tiver anexos?
R: Sim. O card **Anexos** no hub exibe o total (ex.: "3 arquivo(s)").

P: Posso editar a Anamnese depois do primeiro preenchimento?
R: Sim. Tela **Anamnese** → edite e **Salvar** novamente.

P: Onde registro o impacto do problema na vida diária?
R: Tela **Anamnese** → campo **Impacto na Vida Diária**.

P: Como mudo o valor de uma sessão específica?
R: Ao agendar ou editar a sessão, altere **Valor da Sessão** na modal.

P: O que acontece se eu excluir um prontuário?
R: O registro é removido permanentemente e as métricas deixam de aparecer nos gráficos de Evolução.

P: Posso filtrar pacientes por e-mail?
R: Sim. Listagem **Pacientes** → **Filtros** → campo E-mail.

P: Link antigo com ?tab=1 ainda funciona?
R: Sim. Links como `/pacientes/ficha/123?tab=1` redirecionam automaticamente para `/pacientes/ficha/123/prontuarios`.

P: O agendamento feito na agenda principal aparece na ficha?
R: Sim. Agendamentos em **Agendamentos** ficam visíveis na tela **Sessões** da ficha do paciente.
