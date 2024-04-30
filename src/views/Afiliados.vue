<template>
    <div id="afiliados">
        <Navbar />

        <div class="col-md-12 mt-5 container">
            <div class="card p-3">
                <div class="card-header mb-3 text-center">
                    <h2>Afiliados</h2>
                </div>

                <Button label="Tornesse um afiliado" class="fa-fade rounded mb-5" @click="$router.push('/cadastro-afiliado')" />
                
                <Timeline :value="events" align="alternate" class="customized-timeline" v-if="!isMobile">
                    <template #marker="slotProps">
                        <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" :style="{ backgroundColor: slotProps.item.color }">
                            <i :class="slotProps.item.icon"></i>
                        </span>
                    </template>
                    <template #content="slotProps">
                        <Card class="mt-3">
                            <template #title>
                                {{ slotProps.item.status }}
                            </template>
                            <template #subtitle>
                                {{ slotProps.item.date }}
                            </template>
                            <template #content>
                                <p>
                                    Um programa de Afiliados é uma estratégia de marketing, em que os Afiliados focam em gerar vendas de produtos de outras pessoas e recebem uma comissão por cada transação realizada.
                                </p>
                                <Button label="Veja mais" @click="slotSelecionado(slotProps)" text></Button>
                            </template>
                        </Card>
                    </template>
                </Timeline>

                <Accordion :activeIndex="0" v-else>
                    <AccordionTab :header="evento.status" v-for="(evento, index) in events" :key="index">
                        <p>
                            Um programa de Afiliados é uma estratégia de marketing, em que os Afiliados focam em gerar vendas de produtos de outras pessoas e recebem uma comissão por cada transação realizada.
                        </p>

                        <Button label="Veja mais" @click="slotSelecionado(evento)" text></Button>
                    </AccordionTab>
                </Accordion>

                <Button label="Tornesse um afiliado" class="fa-fade rounded mb-5" @click="$router.push('/cadastro-afiliado')" />
            </div>

            <Dialog v-model:visible="afiliados_1" modal header="Informações" :style="{ width: '45rem' }">
                <div class="border-left-2 border-primary-500 p-3 mb-3">
                    Programa de Afiliados é uma forma de trabalhar focando em vendas. Ao se juntar a um, você pode se afiliar a diferentes produtos e trabalhar na divulgação deles. A cada venda feita, você ganha uma comissão.
                </div>

                <div class="col-md-12 mb-2">
                    Um programa de Afiliados é uma forma de gerar renda extra por meio da divulgação de produtos ou serviços. Nele, uma pessoa com experiência ou facilidade em vendas — chamada de Afiliada —trabalha na divulgação de produtos digitais ou físicos de terceiros e recebe uma comissão por cada venda feita.
                </div>

                <div class="col-md-12 mb-2">
                    Essa divulgação pode ser feita por meio de <b>redes sociais, blogs, vídeos no YouTube ou e-mail marketing</b>, por exemplo.
                </div>

                <div class="col-md-12 mb-2">
                    Embora o programa de Afiliados tenha ganhado mais popularidade recentemente, ele não é uma novidade. Se você se lembrou dos revendedores de cosméticos, acertou. O funcionamento das duas estratégias é bastante parecido.
                </div>

                <div class="col-md-12 mb-2">
                    A maior diferença é que saem as revistas e catálogos físicos e entram em cena ferramentas digitais, como plataformas especializadas na venda e promoção de infoprodutos. A facilidade de empreender sem precisar criar um produto e poder fazer isso de casa tem atraído cada vez mais pessoas interessadas.
                </div>

                <div class="col-md-12 mb-2">
                    Se você ainda não está familiarizado com o termo “programa de Afiliados”, este post vai contar tudo que você precisa saber sobre este segmento que permeia o universo do empreendedorismo digital.
                </div>
            </Dialog>

            <Dialog v-model:visible="afiliados_2" modal header="Informações" :style="{ width: '45rem' }">
                <div class="border-left-2 border-primary-500 p-3 mb-3">
                    Um programa de Afiliados é uma técnica de marketing que conecta dois lados do processo de vendas: o criador/produtor e o vendedor/afiliado. O funcionamento é fácil de entender:
                </div>

                <div class="col-md-12 mb-2">
                    <ul>
                        <li>
                            Um Afiliado, que é uma pessoa com habilidades em vendas, se afilia a um produto ou serviço de um produtor, recebendo um link específico para divulgação;
                        </li>
                        <li>
                            O Afiliado pode divulgar esse link em suas redes sociais, blog, site, canal no YouTube ou e-mails;
                        </li>
                        <li>
                            Cada vez que o Afiliado realiza uma venda por meio do link, recebe uma comissão previamente definida pelo produtor.
                        </li>
                    </ul>
                </div>

                <div class="col-md-12 mb-2">
                    Para que esse processo funcione, é necessária uma plataforma online responsável por disponibilizar os produtos, criar os links de divulgação, fazer a entrega segura das comissões e oferecer outras funcionalidades que ajudam tanto o Produtor quanto o Afiliado a aumentarem suas vendas.
                </div>

                <div class="col-md-12 mb-2">
                    É uma atividade gratuita, fácil e vantajosa, escolhida por muitos como uma oportunidade de empreender, obter independência financeira e ter conseguir uma renda sem sair de casa.
                </div>
            </Dialog>

            <Dialog v-model:visible="afiliados_3" modal header="Informações" :style="{ width: '45rem' }">
                <div class="border-left-2 border-primary-500 p-3 mb-3">
                    Você deve estar se perguntando: qual a chave para o sucesso por trás do programa de Afiliados?
                </div>

                <div class="col-md-12 mb-2">
                    O segredo é o fato desse sistema reunir pessoas com interesses em comum e ajudá-las a faturar de verdade. Afinal, as duas partes envolvidas no sistema recebem dinheiro após a venda.
                </div>

                <div class="col-md-12 mb-2">
                    Basicamente, ele é composto por dois personagens principais, que são:
                </div>

                <div class="col-md-12 mb-2">
                    <h5 class="text-secondary">
                        Produtor
                    </h5>
                </div>

                <div class="col-md-12 mb-2">
                    Os Produtores possuem conhecimento sobre o perfil do consumidor — que busca produtos virtuais com preços acessíveis, entrega rápida e sustentabilidade.
                </div>

                <div class="col-md-12 mb-2">
                    Contudo, esses profissionais não querem apenas criar seus produtos, eles também desejam comercializá-los.
                </div>

                <div class="col-md-12 mb-2">
                    Para isso, disponibilizam seus produtos em plataformas digitais e contam com a ajuda de Afiliados para aumentar suas vendas e faturamento. Em troca, oferecem comissões sobre as vendas realizadas, e as plataformas garantem a segurança das transações.
                </div>

                <div class="col-md-12 mb-2 text-secondary fw-bold">
                    O Programa de Afiliados é uma parceria mútua entre Produtores e Afiliados que resulta em um negócio virtual lucrativo para ambas as partes.
                </div>

                <div class="col-md-12 mb-2">
                    <h5 class="text-secondary">
                        Afiliado
                    </h5>
                </div>

                <div class="col-md-12 mb-2">
                    Já o Afiliado, por sua vez, é a pessoa que indica produtos criados por terceiros e recebe comissões por cada venda realizada.
                </div>

                <div class="col-md-12 mb-2">
                    Porém, por se tratar de um mercado digital e que, por isso, o contato com o cliente é apenas virtual, o Afiliado precisa não apenas tentar vender um produto para os clientes que vão a uma loja procurar por aquela mercadoria, mas principalmente passar uma imagem de credibilidade e confiança para conquistá-los.
                </div>

                <div class="col-md-12 mb-2">
                    Em outras palavras, o Afiliado é um indivíduo empreendedor que busca inovar e aproveitar a internet a seu favor.
                </div>

                <div class="col-md-12 mb-2">
                    Ele lucra ao promover nosso sistema, e recebe comissões de vendas realizadas por meio dos links que compartilha!
                </div>
            </Dialog>

            <Dialog v-model:visible="afiliados_4" modal header="Informações" :style="{ width: '45rem' }">
                <div class="border-left-2 border-primary-500 p-3 mb-3">
                    Você já deve ter entendido que o programa de Afiliados é uma forma de unir criadores de conteúdo digital com pessoas que querem vender esses conteúdos e ganhar comissões sobre as vendas realizadas a partir de seus links exclusivos de Afiliado.
                </div>

                <div class="col-md-12 mb-2">
                    Esses links são codificados para que, toda vez que uma venda é realizada através do seu link, você receba a devida comissão. Mas, além disso, existem outras estratégias que os Afiliados podem usar para aumentar suas vendas e comissões, como a produção de conteúdo relevante e o uso de técnicas de marketing digital.
                </div>

                <div class="col-md-12 mb-2">
                    O sucesso no programa de Afiliados depende, portanto, da sua dedicação em divulgar os produtos e em oferecer valor aos seus seguidores, além de escolher programas de Afiliados confiáveis e com produtos de qualidade para promover.
                </div>
            </Dialog>

            <Dialog v-model:visible="afiliados_5" modal header="Informações" :style="{ width: '45rem' }">
                <div class="border-left-2 border-primary-500 p-3 mb-3">
                    Seria possível substituir a pergunta por:
                </div>

                <div class="col-md-12 mb-2 font-italic">
                    É possível realmente obter uma renda participando de um programa de Afiliados?
                </div>

                <div class="col-md-12 mb-2">
                    A resposta é sim! Muitas pessoas em todo o mundo obtêm uma renda por meio de programas de Afiliados, transformando a afiliação de produtos em uma profissão.
                </div>

                <div class="col-md-12 mb-2">
                    Além disso, algumas pessoas trabalham como Afiliados para obter uma renda extra, o que pode ser tão benéfico quanto construir uma carreira como empreendedor digital. Tudo depende do seu objetivo.
                </div>

                <div class="col-md-12 mb-2">
                    No entanto, assim como em qualquer outra profissão, ganhar dinheiro como Afiliado depende dos seus esforços, especialmente se você estiver começando agora. Apesar disso, há diversas vantagens que serão abordadas ao longo do texto.
                </div>
            </Dialog>

            <Dialog v-model:visible="afiliados_6" modal header="Informações" :style="{ width: '45rem' }">
                <div class="border-left-2 border-primary-500 p-3 mb-3">
                    Existem várias razões para se tornar um Afiliado e uma das principais é a possibilidade de ganhar dinheiro de maneira fácil e independente.
                </div>

                <div class="col-md-12 mb-2">
                    Ao publicar um único anúncio, o Afiliado poderá atingir milhares de consumidores e terá inúmeras chances de que a indicação se converta em vendas. E todas as vezes que isso ocorrer, ele receberá uma porcentagem do valor vendido.
                </div>

                <div class="col-md-12 mb-2">
                    Ou seja, o sucesso depende apenas de esforço próprio: quanto mais a pessoa trabalhar, maiores serão as chances de lucrar.
                </div>

                <div class="col-md-12 mb-2">
                    Mas as vantagens desse programa não param por aí.
                </div>

                <div class="col-md-12 mb-2">
                    Na verdade, o sistema conta com muitos fatores atraentes para quem deseja começar a lucrar online.
                </div>

                <div class="col-md-12 mb-2 font-italic">
                    Quer descobrir quais são eles?
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Não correr risco de perder investimentos
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Muitas pessoas investem na criação de um e-commerce com o sonho de ganhar dinheiro pela internet. No entanto, muitas lojas virtuais tendem a fracassar devido à falta de planejamento e experiência do proprietário.
                </div>

                <div class="col-md-12 mb-2">
                    Em contrapartida, o programa de Afiliados é uma opção financeiramente segura, uma vez que o cadastro é gratuito e não requer nenhum investimento inicial.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Poder trabalhar sem precisar de um produto próprio
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Você não precisa ter seu próprio produto para começar a ganhar dinheiro na internet. Com um programa de Afiliados, é possível divulgar links para produtos produzidos por outras pessoas e receber comissões por vendas realizadas.
                </div>

                <div class="col-md-12 mb-2">
                    Isso significa que você terá lucro sem precisar se preocupar em adquirir e entregar o material vendido. Ou seja, você consegue focar seus esforços nos métodos de divulgação, o que pode te ajudar a vender mais como Afiliado.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Ser seu próprio patrão
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Tornar-se um Afiliado é como iniciar um novo empreendimento. Caso alcance bons resultados, poderá aproveitar diversas vantagens, tais como ser seu próprio chefe, trabalhar em casa e tomar decisões que achar mais apropriadas.
                </div>

                <div class="col-md-12 mb-2">
                    Além disso, você terá a possibilidade de gerenciar seu tempo da maneira que desejar, sem supervisores para seus horários ou interferências em seu trabalho.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Ter amplas possibilidades de divulgação
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Como um Afiliado, você terá diversas opções de produtos para promover. Existem centenas de produtos digitais em diferentes formatos, divididos em diversos nichos (mais adiante, explicaremos como escolher seu nicho de mercado).
                </div>

                <div class="col-md-12 mb-2">
                    Será fácil selecionar aqueles que melhor se conectam com sua audiência e, consequentemente, têm maior potencial de vendas e lucros.
                </div>

                <div class="col-md-12 mb-2">
                    E mesmo que você não tenha uma audiência ainda, é sempre possível pensar em outras estratégias de divulgação, como anúncios pagos (que também explicaremos neste post ainda), ampliando assim os meios de divulgação.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Não precisar de um site ou muito conhecimento técnico
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Para começar a promover links de produtos digitais, você não precisa necessariamente ter um website próprio. Existem outras ferramentas disponíveis, como redes sociais e e-mail marketing, que também podem ser utilizadas na divulgação.
                </div>

                <div class="col-md-12 mb-2">
                    Também não é necessário ser expert em informática para realizar o trabalho.
                </div>

                <div class="col-md-12 mb-2">
                    É claro que se você já tiver alguma experiência com essa tecnologia, seu trabalho como Afiliado será mais completo e você terá mais facilidade.
                </div>

                <div class="col-md-12 mb-2">
                    Porém, qualquer pessoa com conhecimentos básicos em internet pode entrar para o programa de Afiliados e, com o tempo, se especializar e aprender mais sobre isso.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Contar com garantia de pagamento
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Uma das principais vantagens do programa de Afiliados é que os pagamentos são gerenciados pela plataforma.
                </div>

                <div class="col-md-12 mb-2">
                    As comissões são computadas automaticamente após as vendas, o que elimina o risco de o Produtor não realizar o pagamento.
                </div>

                <div class="col-md-12 mb-2">
                    Nesse sistema, a remuneração do Afiliado fica garantida integralmente.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Quem pode se tornar um Afiliado?
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Assim como no caso de Produtores Digitais, qualquer pessoa pode se tornar um Afiliado de sucesso.
                </div>

                <div class="col-md-12 mb-2">
                    Com o mercado digital cada vez mais em expansão, é possível encontrar uma infinidade de produtos, e você poderá escolher dentre aqueles que têm mais afinidade.
                </div>

                <div class="col-md-12 mb-2">
                    Além disso, é possível encontrar muitos materiais sobre afiliação e técnicas de marketing para utilizar na divulgação.
                </div>

                <div class="col-md-12 mb-2">
                    <h3 class="text-secondary">
                        Invista tempo em seu negócio
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    Pode ser que, no início, o programa de Afiliados seja apenas uma forma de você ter renda extra.
                </div>

                <div class="col-md-12 mb-2">
                    Porém, assim que você começar a dedicar mais tempo para manter suas estratégias atualizadas, ter uma frequência maior de divulgação de produtos, você perceberá a necessidade de dedicar mais tempo ao seu negócio.
                </div>

                <div class="col-md-12 mb-2">
                    Para te ajudar a entender quanto tempo você precisa dedicar à afiliação de produtos, trace uma meta para entender onde você quer chegar e estabeleça horários específicos para cuidar de seu negócio diariamente.
                </div>

                <div class="col-md-12 mb-2">
                    <h3>
                        Quais habilidades um Afiliado deve ter?
                    </h3>
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Disciplina
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    Ser Afiliado é também um trabalho e, para colher bons resultados, é preciso ter disciplina para sempre manter o mínimo de consistência em sua estratégias. Estipule um calendário com ações que você possa executar para alavancar seu negócio pouco a pouco e seja fiel ao seu plano.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Gostar de estudar
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    Quanto mais você souber sobre seu mercado, mais profissional você se tornará. Por isso, atente-se às novidades e estude as técnicas de divulgação que você ainda desconhece.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Boa comunicação
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    Para gerar audiência, é preciso comunicar-se bem com seu público, e isso significa saber escrever de forma clara, seja para anúncios, redes sociais ou blogs.
                </div>

                <div class="col-md-12 mb-2">
                    Se você pretende gravar vídeos, também terá que treinar sua oratória. Além de falar com o público, bons Afiliados sempre buscam fazer networking com outros profissionais do mercado, assim, podem trocar experiências, aprimorar suas técnicas e escalar ainda mais seus ganhos.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Persistência
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    Essa dica vale principalmente para aqueles que desejam ter grandes resultados e não só fazer uma venda ou outra. O imediatismo é um dos fatores que fazem as pessoas desistirem tão facilmente de suas metas e sonhos. Trace um plano para seu negócio e cumpra-o mesmo quando ainda não houver nenhum lucro.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Ser criterioso
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    É claro que você pode escolher vários produtos diferentes para divulgar. Porém, um bom Afiliado sabe selecionar o produto tendo como base não apenas a comissão recebida, mas principalmente a qualidade do produto e sua relevância para seus clientes.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Acompanhar os resultados
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    Para saber se você está tendo sucesso como Afiliado é muito importante saber acompanhar todos seus resultados. Por isso, invista tempo explorando os dados do Google Analytics e outras ferramentas para entender quais são as ações que você tem feito que estão gerando bons resultados.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Ser inovador
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    De nada adianta começar um negócio se você continuar fazendo as mesmas coisas que as outras pessoas já fazem. Por isso, além de estudar, tente ser diferente para se destacar de sua concorrência.
                </div>

                <div class="col-md-12 mb-2">
                    <h4 class="text-secondary">
                        Como se tornar um Afiliado de sucesso?
                    </h4>
                </div>

                <div class="col-md-12 mb-2">
                    O sucesso é algo que todos perseguem hoje em dia. A verdade, no entanto, é que nem todos conseguem alcançar seus objetivos.
                </div>

                <div class="col-md-12 mb-2">
                    Isso ocorre porque sonhos só se realizam a partir de ações. Isso mesmo! Dinheiro não cai do céu, não é fruto da sorte ou do acaso. É preciso trabalhar duro para consegui-lo.
                </div>

                <div class="col-md-12 mb-2">
                    A boa notícia é que todo esforço tem consequências, portanto, trabalhando com dedicação, é possível vencer.
                </div>

                <div class="col-md-12 mb-2">
                    Se você <b>quer se tornar um Afiliado de sucesso</b>, é necessário encarar suas atividades diárias como uma empresa.
                </div>

                <div class="col-md-12 mb-2">
                    Isso significa que, para obter altos índices de conversão de indicações em vendas e bons resultados financeiros, você precisará utilizar algumas técnicas de gestão empresarial.
                </div>

                <div class="col-md-12 mb-2">
                    São estratégias de quatro áreas básicas da administração:
                </div>

                <div class="col-md-12 mb-2">
                    <ol>
                        <li>
                            Planejamento
                        </li>
                        <li>
                            Marketing
                        </li>
                        <li>
                            Finanças
                        </li>
                        <li>
                            Controles
                        </li>
                    </ol>
                </div>

                <div class="col-md-12 mb-2">
                    Parece complicado? Fique tranquilo! Tudo é bem mais fácil do que você imagina!
                </div>

                <div class="col-md-12 mb-2 text-secondary fw-bold">
                    Conheça os detalhes a seguir:
                </div>

                <div class="col-md-12 mb-2">
                    Planejamento é fundamental para qualquer negócio! Então, se você quer ser um Afiliado de sucesso, deve planejar suas ações.
                </div>

                <div class="col-md-12 mb-2">
                    Um bom começo é traçar um <b>cronograma de trabalho</b>, definindo quanto tempo você dedicará à promoção dos links diariamente.
                </div>

                <div class="col-md-12 mb-2">
                    Também é aconselhável estabelecer tarefas específicas, como escrever artigos em um blog. Essa estratégia manterá o foco e não permitirá que o Afiliado acabe se tornando improdutivo.
                </div>

                <div class="col-md-12 mb-2">
                    Tenha em mente que planejar vai muito além da elaboração de uma agenda. Você também precisa traçar metas financeiras, que o ajudarão a nortear seu trabalho.
                </div>

                <div class="col-md-12 mb-2">
                    Primeiro, defina as margens de ganhos que deseja obter a curto, médio e longo prazos. Depois, verifique quais são as ações que você deverá adotar para alcançar todos esses objetivos.
                </div>

                <div class="col-md-12 mb-2">
                    Coloque tudo no papel e organize-se para que realmente consiga concretizar seus objetivos. Esse é o segredo para crescer.
                </div>

                <div class="col-md-12 mb-2 text-secondary fw-bold">
                    Marketing: saiba promover
                </div>

                <div class="col-md-12 mb-2">
                    Se você quer obter resultados expressivos no programa de Afiliados, deve ter consciência de que a promoção de links é marketing puro. Então, é essencial usar as ferramentas corretas na hora de divulgar.
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Timeline from 'primevue/timeline';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

export default {
    components: {
        Navbar,
        Timeline,
        Button,
        Card,
        Dialog,
        Accordion,
        AccordionTab,
    },
    data() {
        return {
            events: [
                { 
                    status: 'Programa de Afiliados Psico Prontuários: o que é e como funciona?',
                    date: '2024',
                    icon: 'pi pi-shopping-cart',
                    color: '#9C27B0',
                    slot: 'slot_1'
                },
                { 
                    status: 'O que é um programa de Afiliados?', 
                    date: '2024', 
                    icon: 'pi pi-cog', 
                    color: '#673AB7',
                    slot: 'slot_2'
                },
                { 
                    status: 'Mas, afinal, por que o programa de Afiliados dá tão certo?', 
                    date: '2024', 
                    icon: 'pi pi-shopping-cart', 
                    color: '#FF9800',
                    slot: 'slot_3'
                },
                { 
                    status: 'Como funciona um programa de Afiliados?', 
                    date: '2024', 
                    icon: 'pi pi-check', 
                    color: '#607D8B',
                    slot: 'slot_4'
                },
                { 
                    status: 'Essa estratégia realmente funciona?', 
                    date: '2024', 
                    icon: 'pi pi-cog', 
                    color: '#673AB7',
                    slot: 'slot_5'
                },
                { 
                    status: 'Quais as vantagens de participar de um programa de Afiliados?', 
                    date: '2024', 
                    icon: 'pi pi-shopping-cart', 
                    color: '#FF9800',
                    slot: 'slot_6'
                },
            ],
            isMobile: window.innerWidth <= 768,
            afiliados_1: false,
            afiliados_2: false,
            afiliados_3: false,
            afiliados_4: false,
            afiliados_5: false,
            afiliados_6: false,
        };
    },
    mounted() {
        // Adiciona um event listener para verificar a largura da janela quando ela muda
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        // Remove o event listener quando o componente é destruído para evitar vazamentos de memória
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            // Atualiza a propriedade isMobile quando a largura da janela muda
            this.isMobile = window.innerWidth <= 768;
        },
        slotSelecionado(value) {
            if (this.isMobile) {
                switch(value.slot) {
                    case 'slot_1':
                        this.afiliados_1 = true;
                        break;
                    case 'slot_2':
                        this.afiliados_2 = true;
                        break;
                    case 'slot_3':
                        this.afiliados_3 = true;
                        break;
                    case 'slot_4':
                        this.afiliados_4 = true;
                        break;
                    case 'slot_5':
                        this.afiliados_5 = true;
                        break;
                    case 'slot_6':
                        this.afiliados_6 = true;
                        break;
                }
            } else {
                switch(value.item.slot) {
                    case 'slot_1':
                        this.afiliados_1 = true;
                        break;
                    case 'slot_2':
                        this.afiliados_2 = true;
                        break;
                    case 'slot_3':
                        this.afiliados_3 = true;
                        break;
                    case 'slot_4':
                        this.afiliados_4 = true;
                        break;
                    case 'slot_5':
                        this.afiliados_5 = true;
                        break;
                    case 'slot_6':
                        this.afiliados_6 = true;
                        break;
                }
            }
        }
    }
}
</script>

<style>
@media screen and (max-width: 960px) {
	 ::v-deep(.customized-timeline) .p-timeline-event:nth-child(even) {
		 flex-direction: row;
	}
	 ::v-deep(.customized-timeline) .p-timeline-event:nth-child(even) .p-timeline-event-content {
		 text-align: left;
	}
	 ::v-deep(.customized-timeline) .p-timeline-event-opposite {
		 flex: 0;
	}
}

a {
    text-decoration: none;
}
 </style>