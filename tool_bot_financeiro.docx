PsicoProntuário — Manual de Suporte
Módulo: Receitas e Despesas



Índice
Visão Geral da Tela
Como Criar um Novo Registro
Campos da Modal (Cadastro/Edição)
Funcionalidades Identificadas
Filtros e Navegação
Edição de Registros
Exclusão de Registros
Regras de Negócio Observadas
FAQ — Perguntas Frequentes




1. Visão Geral da Tela
As telas de Receitas e Despesas no PsicoProntuário compartilham uma estrutura e funcionalidades idênticas, projetadas para o gerenciamento financeiro do profissional. 

Principais elementos visuais:
Indicadores de Totais: No topo da listagem, há cards mostrando os valores totais (ex: "Recebidas" e "Previstas" para receitas; "Pagas" e "Previstas" para despesas).
Botões de Ação Principal: Botões "Nova Receita" (ou "Nova Despesa") e "Filtros" localizados acima da tabela.
Listagem (Tabela): Uma tabela central que exibe os registros financeiros com as seguintes colunas:
Data
Status (ex: Não recebido / Recebido)
Categoria
Valor
Descrição
Ações (botões de editar e excluir)
Paginação: Controles na parte inferior da tabela para navegar entre as páginas de registros (exibindo 10 registros por página por padrão).




2. Como Criar um Novo Registro
O processo de criação é o mesmo para Receitas e Despesas.

Passo a passo completo:
Acesse o menu lateral e clique em Financeiro.
Selecione a aba Receitas ou Despesas.
Clique no botão roxo + Nova Receita (ou + Nova Despesa).
Uma nova tela/modal de cadastro será aberta.
Preencha os campos obrigatórios (Categoria, Valor, Data de lançamento).
(Opcional) Se a categoria desejada não existir, clique no botão "criar" ao lado do campo Categoria para adicionar uma nova.
Preencha os campos opcionais (Tipo de Pagamento, Descrição, e a chave se a despesa/receita já foi paga/recebida).
Clique no botão roxo Cadastrar para salvar o registro.
O sistema redirecionará de volta para a listagem, onde o novo registro aparecerá (respeitando os filtros ativos).




3. Campos da Modal (Cadastro/Edição)
Abaixo estão os campos disponíveis ao criar ou editar uma transação financeira:

Nome do Campo
Descrição
Obrigatoriedade
Tipo
Categoria
Classificação da transação (ex: Consultas, Aluguel). Permite criar novas categorias clicando em "criar".
Obrigatório
Select (Dropdown)
Valor
Valor monetário da transação (em Reais).
Obrigatório
Input (Numérico/Moeda)
Data de lançamento
Data em que a transação ocorreu ou ocorrerá.
Obrigatório
Input (Data/Calendário)
Receita Recebida? / Despesa Paga?
Chave (toggle) para indicar se o valor já foi efetivamente recebido ou pago.
Opcional (Padrão: Não)
Toggle (Switch)
Tipo de Pagamento
Forma como o pagamento foi realizado (ex: À Vista, À Prazo). ⚠️ Ao selecionar "À Prazo", o campo "Quantidade de Parcelas" é exibido.
Opcional
Select (Dropdown)
Quantidade de Parcelas
Número de parcelas em que o valor será dividido. Campo dinâmico, aparece apenas quando "Tipo de Pagamento" é "À Prazo".
Obrigatório (se "À Prazo")
Input (Numérico)
Descrição
Campo de texto livre para detalhar a transação (ex: nome do paciente, detalhes do serviço).
Opcional
Textarea




4. Funcionalidades Identificadas
Durante o uso da tela, as seguintes funcionalidades estão disponíveis:

Criação de Categorias Dinâmicas: É possível criar novas categorias diretamente na tela de cadastro de transação, sem precisar ir a um menu de configurações separado.
Paginação: A listagem exibe 10 registros por página. Há controles na parte inferior para avançar, retroceder e selecionar a página desejada.
Status Visual: A coluna "Status" indica claramente se a transação está pendente ("Não recebido" / "Não pago") ou concluída.
Indicadores de Resumo: Os cards no topo somam automaticamente os valores das transações exibidas na tela, separando o que já foi efetivado do que está previsto.




5. Filtros e Navegação
O sistema possui um painel de filtros robusto acessado pelo botão Filtros.

Opções de Filtro:
Por Categoria: Permite selecionar uma categoria específica (ex: "Consultas") para ver apenas as transações relacionadas a ela.
Por Período (Data Inicial e Data Final): Permite definir um intervalo de datas para visualizar as transações que ocorreram ou ocorrerão naquele período.

⚠️ Comportamento Importante do Filtro Padrão:Ao acessar a tela de Receitas ou Despesas, o sistema aplica automaticamente um filtro para o mês atual. Se você cadastrar uma transação com data de um mês anterior ou futuro, ela não aparecerá na listagem imediatamente até que você altere as datas no painel de Filtros.




6. Edição de Registros
É possível alterar os dados de uma transação já cadastrada.

Como editar:
Na listagem, localize o registro que deseja alterar.
Na coluna "Ações", clique no ícone de lápis (Editar).
A tela de edição será aberta com os dados atuais preenchidos.
Faça as alterações necessárias. Todos os campos podem ser alterados (Categoria, Valor, Data, Status, Tipo de Pagamento e Descrição).
Clique no botão Atualizar para salvar.




7. Exclusão de Registros
(Nota: A exclusão não foi executada nos testes para preservar os dados, mas o botão está presente na interface).

Como excluir: Na coluna "Ações" da listagem, ao lado do botão de editar, há um botão com ícone de lixeira para excluir o registro.
Impactos: A exclusão remove permanentemente o registro do sistema e atualiza automaticamente os indicadores de totais no topo da tela.




8. Regras de Negócio Observadas
Filtro de Mês Vigente: O sistema sempre carrega a listagem filtrando pelo primeiro e último dia do mês atual.
Atualização de Totais: Os cards de "Recebidas/Pagas" e "Previstas" são recalculados dinamicamente com base nos filtros aplicados. Se você filtrar por uma categoria específica, os totais refletirão apenas aquela categoria.
Categorias Compartilhadas/Independentes: As categorias criadas na tela de Receitas (ex: Consultas) parecem ser independentes das categorias criadas na tela de Despesas (ex: Aluguel), mantendo a organização financeira separada.
Parcelamento de Transações: Ao registrar uma transação "À Prazo" e informar a "Quantidade de Parcelas", o sistema gera automaticamente lançamentos individuais para cada parcela, com o valor total dividido igualmente entre elas e datas de vencimento sequenciais (assumindo mensalmente, se não especificado de outra forma).




9. FAQ — Perguntas Frequentes
P: Cadastrei uma receita/despesa, mas ela sumiu da lista. O que aconteceu?R: Provavelmente você cadastrou a transação com uma data fora do mês atual. O sistema filtra automaticamente para mostrar apenas o mês vigente. Clique no botão "Filtros" e ajuste a "Data Inicial" e "Data Final" para o período em que você cadastrou a transação.

P: Como crio uma nova categoria para minhas despesas?R: Clique em "Nova Despesa". No formulário, ao lado do campo "Categoria", clique na palavra "criar" em azul. Digite o nome da nova categoria (ex: "Internet") e clique em "Salvar". Ela já estará disponível para uso.

P: Posso alterar o valor de uma consulta que já registrei?R: Sim. Na lista de receitas, encontre o registro da consulta e clique no ícone de lápis (Editar) na coluna "Ações". Altere o valor e clique em "Atualizar".

P: O que significa o card "Previstas" no topo da tela?R: O card "Previstas" soma o valor de todas as transações listadas na tela que estão com o status "Não recebido" (para receitas) ou "Não pago" (para despesas).

P: Como faço para registrar uma receita ou despesa parcelada?R: Ao criar uma nova receita ou despesa, selecione "À Prazo" no campo "Tipo de Pagamento". Um novo campo "Quantidade de Parcelas" aparecerá. Informe o número de parcelas desejado, e o sistema se encarregará de dividir o valor total e gerar os lançamentos correspondentes.

P: É possível ver apenas as receitas de "Plano de Saúde"?R: Sim. Clique no botão "Filtros", abra o campo "Categoria", selecione "Plano de Saúde" e clique em "Filtrar". A lista e os totais serão atualizados para mostrar apenas essas receitas.



Documento gerado automaticamente com base em testes de usabilidade no sistema PsicoProntuário.
