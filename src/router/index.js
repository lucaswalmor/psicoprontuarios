import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { setupAuthInactiveGuard } from './authInactiveGuard';
import { trackPageView } from '@/utils/metaPixel';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/change-password',
            name: 'change-password',
            component: () => import('@/views/pages/auth/ChangePassword.vue')
        },
        {
            path: '/cadastro',
            name: 'cadastro',
            component: () => import('@/views/pages/Cadastro.vue')
        },
        {
            path: '/completar-cadastro',
            name: 'completar-cadastro',
            component: () => import('@/views/pages/CompletarCadastro.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/upgrade',
            component: () => import('@/layout/PrimeiraAssinaturaLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'Upgrade',
                    component: () => import('@/views/pages/Upgrade.vue')
                }
            ]
        },
        {
            path: '/politica-privacidade',
            name: 'politica-privacidade',
            component: () => import('@/views/pages/PoliticaPrivacidade.vue')
        },
        {
            path: '/termos-uso',
            name: 'termos-uso',
            component: () => import('@/views/pages/TermosUso.vue')
        },
        {
            path: '/bot-docs',
            name: 'bot-docs',
            component: () => import('@/views/pages/bot/BotDocsIndex.vue')
        },
        {
            path: '/bot-docs/:slug',
            name: 'bot-doc',
            component: () => import('@/views/pages/bot/BotDocView.vue'),
            props: true
        },
        {
            path: '/dashboard',
            component: AppLayout,
            redirect: '/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'DashboardGeral',
                    component: () => import('@/views/pages/DashboardGeral.vue'),
                },
                {
                    path: '/pacientes',
                    name: 'Pacientes',
                    component: () => import('@/views/pages/pacientes/ListaPacientes.vue'),
                },
                {
                    path: '/pacientes/editar',
                    name: 'EditarPacientes',
                    redirect: '/pacientes'
                },
                {
                    path: '/pacientes/cadastro',
                    name: 'CadastroPaciente',
                    component: () => import('@/views/pages/pacientes/CadastroPaciente.vue'),
                },
                {
                    path: '/pacientes/editar/:id',
                    name: 'EditarPaciente',
                    component: () => import('@/views/pages/pacientes/EditarPaciente.vue'),
                },
                {
                    path: '/pacientes/prontuarios',
                    name: 'Prontuarios',
                    redirect: '/pacientes'
                },
                {
                    path: '/pacientes/prontuarios/:pacienteId',
                    redirect: (to) => `/pacientes/ficha/${to.params.pacienteId}/prontuarios`
                },
                {
                    path: '/pacientes/anexos',
                    name: 'Anexos',
                    redirect: '/pacientes'
                },
                {
                    path: '/pacientes/anexos/:id',
                    redirect: (to) => `/pacientes/ficha/${to.params.id}/anexos`
                },
                {
                    path: '/pacientes/ficha/:id',
                    name: 'Ficha do Paciente',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteHub.vue'),
                    beforeEnter(to) {
                        const tabParam = to.query.tab;
                        if (tabParam === undefined) return true;
                        const tabMap = { 0: 'dados', 1: 'prontuarios', 2: 'sessoes', 3: 'anexos', 4: 'anamnese', 5: 'evolucao' };
                        const secao = tabMap[parseInt(tabParam, 10)];
                        if (secao) {
                            return `/pacientes/ficha/${to.params.id}/${secao}`;
                        }
                        return true;
                    }
                },
                {
                    path: '/pacientes/ficha/:id/dados',
                    name: 'FichaPacienteDados',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteDados.vue')
                },
                {
                    path: '/pacientes/ficha/:id/prontuarios',
                    name: 'FichaPacienteProntuarios',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteProntuarios.vue')
                },
                {
                    path: '/pacientes/ficha/:id/sessoes',
                    name: 'FichaPacienteSessoes',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteSessoes.vue')
                },
                {
                    path: '/pacientes/ficha/:id/anexos',
                    name: 'FichaPacienteAnexos',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteAnexos.vue')
                },
                {
                    path: '/pacientes/ficha/:id/anamnese',
                    name: 'FichaPacienteAnamnese',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteAnamnese.vue')
                },
                {
                    path: '/pacientes/ficha/:id/evolucao',
                    name: 'FichaPacienteEvolucao',
                    component: () => import('@/views/pages/pacientes/ficha/FichaPacienteEvolucao.vue')
                },
                {
                    path: '/configuracoes',
                    redirect: '/configuracoes/preferencias',
                },
                {
                    path: '/configuracoes/preferencias',
                    name: 'ConfiguracaoPreferencias',
                    component: () => import('@/views/pages/configuracoes/ConfiguracaoPreferencias.vue'),
                },
                {
                    path: '/configuracoes/comunicacao',
                    name: 'ConfiguracaoComunicacao',
                    component: () => import('@/views/pages/configuracoes/ConfiguracaoComunicacao.vue'),
                },
                {
                    path: '/meu-site',
                    name: 'MeuSite',
                    component: () => import('@/views/pages/meu-site/MeuSite.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/notificacoes/datas-comemorativas',
                    name: 'DatasComemorativas',
                    component: () => import('@/views/notificacoes/DatasComemorativas.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/notificacoes/aniversariantes',
                    name: 'Aniversariantes',
                    component: () => import('@/views/notificacoes/Aniversariantes.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/notificacoes/personalizadas',
                    name: 'Personalizadas',
                    component: () => import('@/views/notificacoes/Personalizadas.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/perfil',
                    name: 'Perfil',
                    component: () => import('@/views/pages/Perfil.vue'),
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/financeiro/receitas',
                    name: 'FinanceiroReceitas',
                    component: () => import('@/views/pages/financeiro/FinanceiroLista.vue'),
                },
                {
                    path: '/financeiro/despesas',
                    name: 'FinanceiroDespesas',
                    component: () => import('@/views/pages/financeiro/FinanceiroLista.vue'),
                },
                {
                    path: '/financeiro/novo',
                    name: 'FinanceiroNovo',
                    component: () => import('@/views/pages/financeiro/FinanceiroForm.vue'),
                },
                {
                    path: '/financeiro/editar/:id',
                    name: 'FinanceiroEditar',
                    component: () => import('@/views/pages/financeiro/FinanceiroForm.vue'),
                },
                {
                    path: '/financeiro/lista',
                    name: 'FinanceiroLista',
                    redirect: '/financeiro/receitas'
                },
                {
                    path: '/agendamentos-old',
                    name: 'AgendamentosOld',
                    component: () => import('@/views/pages/AgendamentosOld.vue'),
                },
                {
                    path: '/agendamentos',
                    name: 'Agendamentos',
                    component: () => import('@/views/pages/Agendamentos.vue'),
                },
                {
                    path: '/chamados',
                    name: 'Chamados',
                    component: () => import('@/views/pages/chamados/ListaChamados.vue'),
                },
                {
                    path: '/chamados/novo',
                    name: 'NovoChamado',
                    component: () => import('@/views/pages/chamados/NovoChamado.vue'),
                },
                {
                    path: '/chamados/:id',
                    name: 'DetalheChamado',
                    component: () => import('@/views/pages/chamados/DetalheChamado.vue'),
                },
                {
                    path: '/assinatura',
                    redirect: { path: '/perfil', query: { tab: 'plano' } }
                },
                {
                    path: '/pagamento',
                    name: 'PagamentoBloqueio',
                    component: () => import('@/views/pages/PagamentoBloqueio.vue'),
                    meta: { allowsInactive: true }
                },
                {
                    path: '/modelos-arquivos',
                    name: 'ModelosArquivos',
                    component: () => import('@/views/pages/ModelosArquivos.vue'),
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

setupAuthInactiveGuard(router);

router.afterEach(() => {
    trackPageView();
});

// Recupera automaticamente de erro de chunk desatualizado após deploy.
router.onError((error) => {
    const mensagem = String(error?.message || '');
    const erroDeChunk =
        mensagem.includes('Failed to fetch dynamically imported module') ||
        mensagem.includes('Importing a module script failed');

    if (!erroDeChunk) return;

    const chaveReload = 'chunk-reload-attempted';
    const jaTentouReload = sessionStorage.getItem(chaveReload) === '1';

    if (jaTentouReload) {
        sessionStorage.removeItem(chaveReload);
        return;
    }

    sessionStorage.setItem(chaveReload, '1');
    window.location.reload();
});

export default router;
