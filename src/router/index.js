import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { setupPlanGuard } from './planGuard';

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
            path: '/dashboard',
            component: AppLayout,
            redirect: '/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'DashboardGeral',
                    component: () => import('@/views/pages/DashboardGeral.vue'),
                    meta: { requiresPlanCheck: true }
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
                    name: 'Prontuários do Paciente',
                    component: () => import('@/views/pages/pacientes/ListaProntuarios.vue')
                },
                {
                    path: '/pacientes/anexos',
                    name: 'Anexos',
                    redirect: '/pacientes'
                },
                {
                    path: '/pacientes/anexos/:id',
                    name: 'Anexos do Paciente',
                    component: () => import('@/views/pages/pacientes/ListaAnexos.vue')
                },
                {
                    path: '/pacientes/ficha/:id',
                    name: 'Ficha do Paciente',
                    component: () => import('@/views/pages/pacientes/FichaPaciente.vue')
                },
                {
                    path: '/configuracoes',
                    name: 'Configuracoes',
                    component: () => import('@/views/pages/Configuracoes.vue'),
                    meta: { requiresPlanCheck: false }
                },
                {
                    path: '/faq',
                    name: 'Faq',
                    component: () => import('@/views/pages/Faq.vue'),
                    meta: { requiresPlanCheck: false }
                },
                {
                    path: '/perfil',
                    name: 'Perfil',
                    component: () => import('@/views/pages/Perfil.vue'),
                    meta: { requiresPlanCheck: false }
                },
                {
                    path: '/meu-psicologo',
                    name: 'MeuPsicologo',
                    component: () => import('@/views/pages/MeuPsicologo.vue'),
                    meta: { requiresPlanCheck: true }
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
                    path: '/financeiro',
                    name: 'FinanceiroDashboard',
                    component: () => import('@/views/pages/financeiro/FinanceiroDashboard.vue'),
                    meta: { requiresPlanCheck: true }
                },
                {
                    path: '/financeiro/novo',
                    name: 'FinanceiroNovo',
                    component: () => import('@/views/pages/financeiro/FinanceiroForm.vue'),
                    meta: { requiresPlanCheck: true }
                },
                {
                    path: '/financeiro/editar/:id',
                    name: 'FinanceiroEditar',
                    component: () => import('@/views/pages/financeiro/FinanceiroForm.vue'),
                    meta: { requiresPlanCheck: true }
                },
                {
                    path: '/financeiro/lista',
                    name: 'FinanceiroLista',
                    component: () => import('@/views/pages/financeiro/FinanceiroLista.vue'),
                    meta: { requiresPlanCheck: true }
                },
                {
                    path: '/agendamentos',
                    name: 'Agendamentos',
                    component: () => import('@/views/pages/Agendamentos.vue'),
                    meta: { requiresPlanCheck: true }
                },
                {
                    path: '/upgrade',
                    name: 'Upgrade',
                    component: () => import('@/views/pages/Upgrade.vue'),
                    meta: { requiresPlanCheck: true }
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

// Configurar o guard de plano
setupPlanGuard(router);

export default router;
