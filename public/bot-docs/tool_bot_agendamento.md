PsicoProntuários
Manual de Suporte
Módulo: Agendamentos
Base de conhecimento para bot de atendimento no n8n


Índice
1. Visão Geral da Tela de Agendamentos
2. Como Criar um Novo Agendamento
3. Campos da Modal: Agendar Consulta
4. Reagendamento Automático (Recorrência)
5. Visualizando Agendamentos por Data
6. Como Editar um Agendamento
7. Como Excluir Agendamentos
8. FAQ — Perguntas Frequentes

1. Visão Geral da Tela de Agendamentos
A tela de Agendamentos é acessada pelo menu lateral esquerdo. Ela exibe um calendário mensal interativo e a lista de consultas do dia selecionado.

Elementos da tela
Calendário mensal: exibe o mês atual com navegação por setas (anterior/próximo). O dia atual é destacado com um círculo roxo preenchido. O dia selecionado aparece com borda circular.
Seletor de trimestre: na lateral do calendário, permite navegar rapidamente entre Jan, Abr, Jul e Out.
Painel lateral direito: exibe os agendamentos do dia selecionado com horário e nome do paciente.
Feriados do Mês: bloco abaixo do calendário listando os feriados nacionais do mês vigente.
Botão + Novo Agendamento: verde, no canto superior direito, abre a modal para criar um agendamento.

2. Como Criar um Novo Agendamento
Siga os passos abaixo para agendar uma consulta:

No menu lateral, clique em Agendamentos.
Clique no botão verde + Novo Agendamento no canto superior direito.
A modal 'Agendar Consulta' será aberta.
Selecione o Paciente no campo de busca.
Informe a Data da Consulta.
Selecione a Hora da Consulta no menu dropdown.
Se desejar repetir automaticamente, ative o toggle 'Deseja reagendar para os próximos 12 meses?' e escolha a Forma de Reagendamento.
Clique em Agendar Consulta para confirmar.

3. Campos da Modal: Agendar Consulta
A tabela abaixo detalha cada campo disponível na modal de criação de agendamento. O símbolo * indica campo obrigatório.

Campo
Descrição
Paciente
Dropdown de busca para selecionar o paciente cadastrado no sistema.
Data da Consulta *
Campo de data no formato DD/MM/AAAA. Preenchido automaticamente com a data atual.
Hora da Consulta
Menu dropdown com os horários disponíveis em intervalos fixos (ex: 08:00, 08:30...).
Reagendar para 12 meses?
Toggle (Não/Sim). Quando ativado em 'Sim', habilita o campo de Forma de Reagendamento.
Forma de Reagendamento
Aparece quando o toggle acima está em 'Sim'. Opções: Semanal, Quinzenal ou Mensal.


⚠️  Os campos de recorrência (Reagendamento e Forma) só ficam visíveis e ativos quando o toggle é alternado para 'Sim'.

4. Reagendamento Automático (Recorrência)
O sistema permite criar automaticamente uma série de consultas recorrentes para os próximos 12 meses com apenas um agendamento.

Como funciona
Ative o toggle: na modal de agendamento, mude o toggle 'Deseja reagendar esta consulta para os próximos 12 meses?' de Não para Sim.
Escolha a frequência: selecione uma das três opções de Forma de Reagendamento:

Frequência
O que acontece
Semanal
Uma consulta é criada toda semana no mesmo dia da semana e horário por 12 meses.
Quinzenal
Uma consulta é criada a cada 14 dias no mesmo horário por 12 meses.
Mensal
Uma consulta é criada no mesmo dia do mês e horário pelos próximos 12 meses.


⚠️  Ao excluir um agendamento recorrente, o sistema oferece a opção de excluir apenas aquela consulta ou todas as consultas relacionadas à série.

5. Visualizando Agendamentos por Data
O calendário é o principal meio de navegar entre as consultas agendadas.

Clique em qualquer dia do calendário: para ver as consultas daquele dia listadas no painel lateral direito.
Cada consulta exibe: o horário (ex: 08:00) e o nome do paciente.
Clique na seta >: ao lado de cada consulta para abrir os detalhes ou editar.
Navegação mensal: use as setas < > no topo do calendário para ir ao mês anterior ou próximo.
Navegação trimestral: use os botões Jan, Abr, Jul, Out na lateral para pular diretamente ao trimestre desejado.

6. Como Editar um Agendamento
Para alterar data ou horário de uma consulta já agendada:

No calendário, clique no dia da consulta que deseja editar.
No painel lateral, clique na seta > ao lado da consulta.
A modal 'Editar Agendamento' será aberta.
Altere o campo Data da Consulta e/ou Hora da Consulta conforme necessário.
Clique em Salvar Alterações para confirmar.

Campos disponíveis na modal de edição
Paciente: exibido como texto (não editável nesta modal).
Data da Consulta *: campo editável com a data atual do agendamento.
Hora da Consulta: dropdown para alterar o horário.

7. Como Excluir Agendamentos
Dentro da modal de Editar Agendamento, existem dois botões de exclusão:

Botão
O que faz
Excluir esta consulta
Remove apenas o agendamento selecionado. Os demais agendamentos da série (se houver) continuam existindo.
Excluir todas as consultas relacionadas a este agendamento
Remove todos os agendamentos vinculados à mesma série de recorrência. Use com cautela — a ação é irreversível.


⚠️  O botão 'Excluir todas as consultas relacionadas' aparece em vermelho e só tem efeito prático quando o agendamento faz parte de uma série recorrente.

8. FAQ — Perguntas Frequentes

P: Como acesso a tela de Agendamentos?
R: Clique em 'Agendamentos' no menu lateral esquerdo do sistema.
P: Como crio um novo agendamento?
R: Clique no botão verde '+ Novo Agendamento' no canto superior direito, preencha os campos na modal e clique em 'Agendar Consulta'.
P: Quais campos são obrigatórios para agendar?
R: Apenas a Data da Consulta é marcada como obrigatória (*). É recomendável também selecionar o Paciente e o Horário para um agendamento completo.
P: Como vejo os agendamentos de um dia específico?
R: Clique no dia desejado no calendário. Os agendamentos daquele dia aparecem automaticamente no painel lateral direito.
P: Como altero a data ou horário de uma consulta?
R: Clique no dia no calendário, depois na seta > ao lado da consulta. Na modal 'Editar Agendamento', altere os campos e clique em 'Salvar Alterações'.
P: Como excluo apenas uma consulta de uma série recorrente?
R: Abra a modal de edição da consulta desejada e clique em 'Excluir esta consulta'. Somente aquele agendamento será removido.
P: Como excluo todos os agendamentos de uma série de uma vez?
R: Abra qualquer agendamento da série, clique em 'Excluir todas as consultas relacionadas a este agendamento'. Atenção: esta ação é irreversível.
P: O sistema repete agendamentos automaticamente?
R: Sim. Ao criar um agendamento, ative o toggle 'Deseja reagendar para os próximos 12 meses?' e escolha a frequência: Semanal, Quinzenal ou Mensal.
P: Qual a diferença entre reagendamento Semanal, Quinzenal e Mensal?
R: Semanal cria uma consulta toda semana. Quinzenal a cada 14 dias. Mensal no mesmo dia do mês — todos pelo período de 12 meses.
P: O calendário mostra feriados?
R: Sim. Abaixo do calendário há um bloco 'Feriados do Mês' que lista os feriados nacionais do mês atual com data e nome.
P: Como navego entre os meses no calendário?
R: Use as setas < > no topo do calendário para avançar ou voltar mês a mês. Para pular entre trimestres, use os botões Jan, Abr, Jul e Out na lateral.
P: Posso agendar para um paciente que ainda não está cadastrado?
R: Não. O paciente precisa estar previamente cadastrado na seção 'Pacientes' para aparecer no campo de seleção da modal de agendamento.
P: O agendamento feito aqui aparece também na ficha do paciente?
R: Sim. Todos os agendamentos criados ficam vinculados ao paciente e são visíveis na aba 'Sessões' dentro da ficha do paciente.
P: O que acontece se eu clicar em Cancelar na modal?
R: A modal é fechada e nenhuma alteração é salva. O agendamento original não é afetado.

