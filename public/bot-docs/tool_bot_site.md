Manual de Suporte: Meu Site — Landing Page do Psicólogo - PsicoProntuários

Este manual detalha todas as funcionalidades da seção "Meu Site" da plataforma PsicoProntuários, onde o psicólogo configura e personaliza sua landing page pública.


Índice
1. O que é o Meu Site
2. Como acessar
3. Endereço público da página (slug)
4. Aba: Geral
5. Aba: Aparência
6. Aba: Textos
7. Aba: Especialidades
8. Aba: Horários
9. FAQ — Perguntas e Respostas Diretas


1. O que é o Meu Site

O "Meu Site" é a landing page pública e personalizada do psicólogo, disponível na internet para qualquer visitante acessar. Ela exibe informações profissionais, especialidades, horários de atendimento e dados de contato, funcionando como uma página de apresentação profissional.

**Plano necessário:** recurso disponível apenas para assinantes do plano **Pro** ou **Vitalício**. Usuários do plano Simples veem a tela de upgrade ao acessar `/meu-site` (mesmo padrão visual da etiqueta **PRO** no menu).

Ao se cadastrar na plataforma como psicólogo, o sistema cria automaticamente uma página inicial com dados pré-preenchidos a partir do cadastro (nome, e-mail, telefone e CRP). O psicólogo Pro/Vitalício pode personalizar tudo depois.


2. Como acessar

No menu lateral do painel, clique em "Meu Site" (ícone de globo).
A página carrega com 5 abas de configuração: Geral, Aparência, Textos, Especialidades e Horários.
No topo direito da página há um botão "Ver meu site" que abre a landing page pública em uma nova aba (visível apenas para plano **Pro** ou **Vitalício**, quando o slug já estiver definido).


3. Endereço público da página (slug)

O endereço público da landing page usa um **slug** (subdomínio), gerado a partir do nome completo do psicólogo no momento do cadastro.
Exemplo: o psicólogo "Ana Lima" pode ter o endereço `ana-lima.psicoprontuarios.com.br`.

Na aba **Geral**, o slug é exibido como **informação fixa** (somente leitura): o sistema não permite alteração pelo usuário para evitar conflitos e links quebrados.

Como ver o endereço: aba **Geral** ou botão **Ver meu site** no topo da tela **Meu Site**.


4. Aba: Geral

Configura os dados de contato e tipo de atendimento exibidos na landing page.

Campos disponíveis (resumo)
WhatsApp: Número exibido nos botões de contato e na seção de contatos da página.
E-mail de contato: E-mail público da landing page (pode ser diferente do e-mail de login).
Endereço: Endereço do consultório exibido na seção de contato (campo de texto livre).
CRP: Número do CRP exibido na página como credencial profissional.
Tipo de atendimento: Define se o psicólogo atende Online, Presencial, ou Online e Presencial. Essa informação aparece em destaque na página inicial.

Como salvar
Preencha ou edite os campos desejados e clique no botão "Salvar" no canto superior direito da aba.

Observação: Se os campos estiverem vazios, o sistema usa automaticamente os dados do cadastro do psicólogo como fallback (telefone, e-mail e CRP do cadastro original). O endereço do consultório deve ser preenchido manualmente nesta aba, pois não é coletado durante o cadastro inicial.


5. Aba: Aparência

Permite personalizar as **cores por seção** da landing pública (menu, hero, sobre, especialidades, como funciona, benefícios, **CTA**, contato, rodapé, fundo geral da página).

Como funciona
Os campos estão agrupados por seção (ex.: Cabeçalho, Hero, CTA, Contato). Cada item é uma cor em **hexadecimal** (#RRGGBB).
Use o seletor de cor ou digite o código no campo. O quadrado de pré-visualização ao lado atualiza em tempo real.

Pré-visualização
À direita (em telas largas), um **iframe** pode mostrar o site público quando o psicólogo já definiu um slug em **Geral** e salvou. Há botão para **recarregar** a pré-visualização após salvar cores no servidor.

Como salvar
Clique em **Salvar cores** para enviar todas as cores ao servidor. As alterações passam a valer na landing pública após a atualização da página (há cache no backend; ao salvar, o sistema invalida o cache do site).

Paleta inicial: novos cadastros recebem valores padrão (tema roxo/branco) definidos no banco; não é mais a paleta antiga “Sage” com 10 cores genéricas.


6. Aba: Textos

Configura os textos editáveis da landing page, organizados por blocos.

Seção Principal (Hero) — parte superior da página
Nome exibido na navegação: Nome que aparece no menu e no rodapé da página.
Eyebrow: Linha pequena de destaque acima do título principal (ex.: número do CRP ou frase curta).
Título principal: Manchete da primeira dobra.
Subtítulo: Frase complementar abaixo do título.
Descrição: Parágrafo explicativo sobre o atendimento.

Seção Sobre Mim
Título da seção: Cabeçalho da área “Sobre mim”.
Biografia — parágrafo 1 e parágrafo 2: Textos da apresentação profissional.

Seção Como funciona
Título em três partes: texto antes do destaque, palavra(s) em **itálico** no meio, texto depois do destaque (ex.: “Um processo ” + “simples” + “ e transparente”). Inclua espaços nas caixas quando quiser separação visual.
Parágrafo introdutório: texto acima dos quatro cards.
Quatro passos (cards): para cada um — **título**, **descrição** e **detalhe opcional** (linha pequena no rodapé do card, ex.: “50 minutos”). Na página pública, os cards **não são numerados**.

Seção Chamada final (CTA / próximo passo)
Rótulo acima do título (ex.: “Próximo passo”).
Título em duas partes (primeira linha + linha em destaque/itálico).
Parágrafo do bloco.
Texto do botão (ex.: “Falar pelo WhatsApp”).

Como salvar
Edite os campos desejados e clique em **Salvar textos** no canto superior direito da aba.


7. Aba: Especialidades

Configura quais especialidades e abordagens terapêuticas aparecem na landing page.

Seção Especialidades (cards)
Exibe uma lista de chips clicáveis com todos os temas disponíveis no sistema.
Clique em um chip para selecioná-lo (fica destacado). Clique novamente para desmarcar.
Os temas selecionados aparecem como cards na seção "Áreas de atuação" da landing page, com ícone e nome.
Clique em "Salvar especialidades" para confirmar a seleção.

Seção Abordagens Terapêuticas (chips do Sobre)
Mesma lógica de seleção por chips clicáveis.
As abordagens selecionadas aparecem como tags pequenas (chips) na seção "Sobre mim" da landing page.
Clique em "Salvar abordagens" para confirmar.

Observação: Especialidades e abordagens são listas independentes e têm botões de salvar separados.


8. Aba: Horários

Configura os dias e horários de atendimento exibidos na landing page.

Como funciona
A aba exibe todos os dias da semana (Segunda a Domingo) com os campos: horário de início, horário de fim e um toggle (liga/desliga).
Por padrão, todos os dias começam desativados. Ative apenas os dias em que você atende.

Como configurar um dia
Clique no toggle ao lado do dia para ativá-lo (fica destacado com borda colorida).
Com o dia ativo, preencha o horário de início e de fim no formato HH:MM (ex: 08:00 e 18:00).
Repita para cada dia de atendimento.
Clique em "Salvar horários" para confirmar.

Na landing page
Apenas os dias com toggle ativo aparecem na tabela de horários da seção de contato.
Se nenhum dia estiver configurado, a seção exibe a mensagem "Horários não informados.".


9. FAQ — Perguntas e Respostas Diretas

P: Preciso do plano Pro para usar o Meu Site?
R: Sim. A personalização da landing page pública (Meu Site) está disponível apenas no plano Pro ou Vitalício.

P: O que é o "Meu Site" no PsicoProntuários?
R: É a landing page pública do psicólogo, uma página na internet onde qualquer pessoa pode ver suas informações profissionais, especialidades, horários e formas de contato.

P: Preciso criar o site do zero?
R: Não. Ao se cadastrar como psicólogo na plataforma, o sistema cria automaticamente uma página inicial com seus dados de cadastro (nome, e-mail, telefone e CRP). Você só precisa personalizar o que quiser.

P: Qual é o endereço da minha landing page?
R: O endereço usa um subdomínio (slug) gerado a partir do seu nome. Exemplo: `ana-lima.psicoprontuarios.com.br`. Você vê o slug na aba **Geral** e pode abrir a página pelo botão **Ver meu site**.

P: Posso mudar o endereço (slug) da minha página?
R: Não. O slug é fixo após o cadastro e aparece como somente leitura na aba Geral.

P: Como altero meu número de WhatsApp na landing page?
R: Acesse "Meu Site" no menu lateral, clique na aba "Geral", atualize o campo "WhatsApp" e clique em "Salvar".

P: O que acontece se eu deixar o campo de WhatsApp vazio na aba Geral?
R: O sistema usa automaticamente o telefone do seu cadastro como fallback.

P: Como personalizo as cores da minha página?
R: Acesse a aba **Aparência**. As cores são por **seção** (menu, hero, CTA, contato, etc.). Escolha cada cor com o seletor ou digite o hexadecimal e clique em **Salvar cores**.

P: Onde aparecem os temas de especialidade que seleciono?
R: Na seção "Áreas de atuação" da sua landing page, como cards com ícone e nome.

P: Onde aparecem as abordagens terapêuticas que seleciono?
R: Na seção "Sobre mim" da landing page, como chips/tags pequenas abaixo da sua biografia.

P: Como adiciono meus horários de atendimento na página?
R: Acesse a aba "Horários", ative o toggle dos dias que você atende, preencha os horários de início e fim e clique em "Salvar horários".

P: Se eu não configurar nenhum horário, o que aparece na landing page?
R: A seção de horários exibe a mensagem "Horários não informados." enquanto nenhum dia estiver ativo.

P: Como altero os textos da landing (hero, sobre, CTA, como funciona)?
R: Acesse a aba **Textos**. Lá estão o Hero, Sobre, bloco **Como funciona** (título, parágrafo e quatro cards) e a **Chamada final (CTA)**. Clique em **Salvar textos**.

P: O que é o campo "Eyebrow" na aba Textos?
R: É a linha pequena que aparece acima do título principal na primeira dobra; costuma ser usada para CRP ou credencial.

P: Posso ter mais de uma landing page?
R: Não. Cada psicólogo cadastrado tem exatamente uma landing page vinculada ao seu perfil.

P: A landing page fica visível para qualquer pessoa na internet?
R: Sim, desde que o site esteja ativo na configuração do sistema. A página é pública e não requer login para ser acessada.

P: Como vejo minha landing page após fazer alterações?
R: Use **Ver meu site** no canto superior direito da tela **Meu Site**, ou abra manualmente o subdomínio do seu slug. Após mudanças de cores ou textos salvos no servidor, atualize a página no navegador para ver o resultado.

P: Posso deixar campos em branco na aba Textos?
R: Sim em vários campos; onde o texto estiver vazio, a landing pode usar texto padrão ou ocultar o bloco conforme o layout. Recomenda-se preencher hero e biografia para uma página completa.

P: O que é "Tipo de atendimento" na aba Geral?
R: Define como você realiza suas sessões: Online, Presencial ou Online e Presencial. Essa informação aparece em destaque na landing.

P: Posso salvar cada aba separadamente?
R: Sim. Cada aba tem seu próprio botão de salvar (**Salvar**, **Salvar cores**, **Salvar textos**, etc.) e funciona de forma independente.
