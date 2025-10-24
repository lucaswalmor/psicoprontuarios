import { showAccessDeniedToast } from '@/utils/toast';

// Função para verificar permissões do plano usando dados do localStorage
function performPlanCheck(to, next) {
    // Obter dados do localStorage (vindos do login)
    const planoId = parseInt(localStorage.getItem('planoId'));
    const statusAssinatura = localStorage.getItem('statusAssinatura') || 'sem_assinatura';
    const modulosPlano = JSON.parse(localStorage.getItem('modulosPlano') || '{}');

    // Plano Vitalício (id=4): acesso total
    if (planoId === 4) {
        return next();
    }

    // Verificar se a rota requer módulo específico
    const requiredModulo = routeModuleMap[to.path];
    
    // Rota sempre acessível
    if (requiredModulo === null) {
        return next();
    }

    // Planos pagos (2=Essencial, 3=Profissional): verificar status da assinatura
    if ([2, 3].includes(planoId)) {
        if (statusAssinatura !== 'ativa') {
            console.warn(`Acesso negado: assinatura ${statusAssinatura} não permite acesso`);
            showAccessDeniedToast(to.path, statusAssinatura);
            return next('/upgrade');
        }
    }

    // Verificar se o módulo está disponível no plano
    if (!modulosPlano[requiredModulo]) {
        console.warn(`Acesso negado: ${to.path} não está disponível no plano atual`);
        showAccessDeniedToast(to.path, 'módulo não disponível');
        return next('/upgrade');
    }

    // Se tem acesso, permite
    return next();
}

// Mapeamento de rotas para módulos requeridos
const routeModuleMap = {
    '/dashboard': 'dashboard',
    '/financeiro': 'gestao_financeira',
    '/financeiro/novo': 'gestao_financeira',
    '/financeiro/editar': 'gestao_financeira',
    '/financeiro/lista': 'gestao_financeira',
    '/financeiro/categorias': 'gestao_financeira',
    '/agendamentos': 'agendamentos',
    '/agendamentos/novo': 'agendamentos',
    '/agendamentos/editar': 'agendamentos',
    '/meu-psicologo': 'perfil_publico',
    '/meu-psicologo/editar': 'perfil_publico',
    '/meu-psicologo/foto': 'perfil_publico',
    '/meu-psicologo/video': 'perfil_publico',
    '/prontuarios/pdf': 'prontuarios_pdf',
    '/pacientes': null, // sempre acessível
    '/pacientes/cadastro': null, // sempre acessível
    '/pacientes/editar': null, // sempre acessível
    '/pacientes/prontuarios': null, // sempre acessível
    '/prontuarios': null, // sempre acessível
    '/prontuarios/novo': null,
    '/prontuarios/editar': null,
    '/upgrade': null, // sempre acessível
    '/assinatura': null, // sempre acessível
    '/configuracoes': null, // sempre acessível
    '/checkout/sucesso': null, // sempre acessível
    '/checkout/cancelado': null, // sempre acessível
};

// Rotas que sempre devem ser acessíveis
const alwaysAllowedRoutes = [
    '/',
    '/login',
    '/modelos-arquivos',
    '/change-password',
    '/cadastro',
    '/politica-privacidade',
    '/termos-uso',
    '/pages/notfound',
    '/auth/access',
    '/auth/error'
];

export function planGuard(to, from, next) {
    // Se é uma rota sempre permitida, permite acesso
    if (alwaysAllowedRoutes.includes(to.path)) {
        return next();
    }

    // Se não está autenticado, redireciona para login
    const token = localStorage.getItem('token');
    if (!token) {
        return next('/login');
    }

    // Verificação simplificada usando dados do localStorage (vindos do login)
    return performPlanCheck(to, next);
}

// Função para configurar o guard no router
export function setupPlanGuard(router) {
    router.beforeEach(planGuard);
}