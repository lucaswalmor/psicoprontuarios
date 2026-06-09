# PsicoProntuários
## Manual de Suporte
### Módulo: Dashboard — Visão Geral e Métricas
> Base de conhecimento para bot de atendimento no n8n

---

## Índice

1. [Visão Geral do Dashboard](#1-visão-geral-do-dashboard)
2. [Indicadores Principais (Cards)](#2-indicadores-principais-cards)
3. [Status dos Pacientes](#3-status-dos-pacientes)
4. [Métricas de Desempenho Clínico](#4-métricas-de-desempenho-clínico)
5. [Próximas Sessões e Aniversariantes](#5-próximas-sessões-e-aniversariantes)
6. [Gráficos e Análises Visuais](#6-gráficos-e-análises-visuais)
7. [Atalhos de Cadastro e Prontuários](#7-atalhos-de-cadastro-e-prontuários)
8. [FAQ — Perguntas Frequentes](#8-faq--perguntas-frequentes)
9. [Aba Financeiro — Receitas não recebidas](#9-aba-financeiro--receitas-não-recebidas)

---

## 1. Visão Geral do Dashboard

O Dashboard é a tela inicial do PsicoProntuários (`/dashboard`), projetada para oferecer ao psicólogo uma visão 360º da clínica ou consultório. Ele centraliza dados sobre pacientes, sessões e produtividade.

A tela possui **duas abas**:
- **Pacientes** — métricas clínicas, gráficos e atalhos
- **Financeiro** — resumo de receitas, despesas e saldo (mesma visão do módulo financeiro, integrada ao dashboard)

**Para acessar:** Menu Lateral → Dashboard.

---

## 2. Indicadores Principais (Cards)

No topo da aba **Pacientes**, três cards apresentam os números mais importantes:

| Campo | O que significa |
|---|---|
| **Total de Pacientes** | Quantidade total de pacientes cadastrados na base de dados. |
| **Sessões do Dia** | Número de atendimentos agendados para a data atual. |
| **Prontuários (30 dias)** | Quantidade de novos prontuários preenchidos no último mês. |

---

## 3. Status dos Pacientes

Este bloco detalha a situação atual da base de pacientes, dividindo-os por categorias de tratamento:

- **Em Andamento:** Pacientes com sessões regulares e tratamento ativo.
- **Recesso:** Pacientes que pausaram o tratamento temporariamente.
- **Concluídos:** Pacientes que já finalizaram o processo terapêutico.

---

## 4. Métricas de Desempenho Clínico

Dados estatísticos que ajudam a entender a eficiência do consultório:

- **Tempo Médio de Tratamento:** Média de dias que os pacientes permanecem em terapia.
- **Taxa de Conclusão:** Percentual de pacientes que finalizaram o tratamento em relação ao total.
- **Pacientes com Anamnese:** Percentual de pacientes que já possuem a ficha de anamnese preenchida.
- **Este Mês (Novos/Retornados):** Comparativo de quantos pacientes iniciaram ou voltaram ao tratamento no mês atual.

---

## 5. Próximas Sessões e Aniversariantes

Blocos de utilidade diária para organização da agenda:

- **Próxima Sessão:** Exibe o nome e horário do próximo paciente agendado. Possui o botão **"Ver Agenda"** para acesso rápido ao calendário completo.
- **Aniversariantes do Mês:** Lista os pacientes que fazem aniversário no mês vigente. Possui o botão **"Ver Pacientes"** para facilitar o contato ou envio de mensagens.

---

## 6. Gráficos e Análises Visuais

O dashboard gera automaticamente quatro visualizações gráficas:

1. **Distribuição por Gênero:** Perfil demográfico dos pacientes.
2. **Distribuição por Faixa Etária:** Divisão dos pacientes por idade (0–18, 19–30, 31–50, 51+).
3. **Evolução de Status (6 meses):** Gráfico de linha mostrando como a base de pacientes (ativos/concluídos) mudou no semestre.
4. **Evolução de Pacientes (6 meses):** Comparativo visual entre novos cadastros e conclusões de caso.

---

## 7. Atalhos de Cadastro e Prontuários

Na parte inferior, o sistema lista as movimentações mais recentes:

- **Últimos Pacientes Cadastrados:** Lista rápida com nome e data de cadastro dos 5 pacientes mais recentes.
- **Últimos Prontuários Criados:** Atalho para os 5 prontuários preenchidos mais recentemente, facilitando a continuidade do registro.

---

## 8. FAQ — Perguntas Frequentes

**P: Os dados do Dashboard são atualizados em tempo real?**
R: Sim. Sempre que você cadastra um novo paciente, agenda uma sessão ou finaliza um prontuário, os números do Dashboard são atualizados automaticamente.

---

**P: O que é a "Taxa de Conclusão"?**
R: É o cálculo que mostra quantos dos seus pacientes totais chegaram ao fim do tratamento (status "Concluído"). Uma taxa alta indica uma boa rotatividade e finalização de ciclos terapêuticos.

---

**P: Por que o campo "Próxima Sessão" está vazio?**
R: Este bloco exibe a próxima consulta agendada. Se não houver sessão futura cadastrada, aparece a mensagem "Não há sessão agendada para a próxima hora". Clique em **"Ver agenda"** para abrir o calendário completo.

---

**P: Como o sistema calcula o "Tempo Médio de Tratamento"?**
R: O sistema calcula a diferença entre a data de cadastro e a data de conclusão do tratamento para todos os pacientes com status "Concluído" e tira a média em dias.

---

**P: Posso exportar os gráficos do Dashboard?**
R: Os gráficos são para visualização interna. Para exportar histórico clínico, use a aba **Prontuários** na ficha do paciente (PDF individual ou "Exportar Todos"). Para detalhes financeiros, use o menu **Financeiro** → Receitas/Despesas.

---

**P: Onde vejo o resumo financeiro no Dashboard?**
R: Clique na aba **Financeiro** no topo do Dashboard. Lá aparecem cards de receitas, despesas e saldo do período, com atalho para as telas de lançamentos.

---

## 9. Aba Financeiro — Receitas não recebidas

Na aba **Financeiro** do Dashboard, abaixo do resumo anual e **acima** dos cards "Receitas por categoria" / "Despesas por categoria", pode aparecer o card **Receitas não recebidas**.

**O que ele mostra**
- Receitas com data **já passada** e status **Não recebido**
- Linha de resumo com quantidade e valor total pendente
- Lista das principais receitas (descrição, data e valor)
- Se houver mais itens do que os exibidos: texto "+ N outras na lista"

**Ações disponíveis**
- **Ver na lista** (canto superior direito do card): abre Financeiro → Receitas filtrando apenas não recebidas (`Não recebido`)
- **Clique em uma linha da lista**: abre a tela de **edição** daquela receita para marcar como recebida ou ajustar dados

**P: Por que aparecem receitas de meses anteriores nesse card?**
R: O card lista todas as receitas vencidas/não recebidas, independentemente do mês selecionado no gráfico de fluxo de caixa. Por isso o clique em cada item leva direto à edição — assim você não precisa procurar na listagem filtrada por mês.

**P: Cadastrei uma sessão no financeiro mas não aparece no card.**
R: Verifique se a receita está marcada como **Recebida**. Só entram receitas com status **Não recebido** e data igual ou anterior a hoje.

---

*Documento gerado para suporte técnico — PsicoProntuários.*