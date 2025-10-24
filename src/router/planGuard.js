import { showAccessDeniedToast } from '@/utils/toast';

// Função para obter o módulo requerido pela rota
function getRequiredModule(path) {
    // Rotas sempre acessíveis (não requerem módulo específico)
    const alwaysAccessible = [
        '/pacientes',
        '/pacientes/cadastro',
        '/pacientes/editar',
        '/pacientes/ficha',
        '/pacientes/prontuarios',
        '/prontuarios',
        '/prontuarios/novo',
        '/prontuarios/editar',
        '/upgrade',
        '/assinatura',
        '/configuracoes',
        '/checkout/sucesso',
        '/checkout/cancelado'
    ];
    
    // Verificar rotas dinâmicas sempre acessíveis
    if (path.startsWith('/pacientes/ficha/') || 
        path.startsWith('/pacientes/editar/') || 
        path.startsWith('/prontuarios/editar/')) {
        return null;
    }
    
    // Verificar rotas sempre acessíveis
    if (alwaysAccessible.some(route => path.startsWith(route))) {
        return null;
    }
    
    // Mapeamento de rotas que requerem módulos específicos
    const moduleMap = {
        '/dashboard': 'dashboard',
        '/financeiro': 'gestao_financeira',
        '/agendamentos': 'agendamentos',
        '/meu-psicologo': 'perfil_publico',
        '/prontuarios/pdf': 'prontuarios_pdf'
    };
    
    // Verificar padrões dinâmicos que requerem módulos
    if (path.startsWith('/financeiro/')) return 'gestao_financeira';
    if (path.startsWith('/agendamentos/')) return 'agendamentos';
    if (path.startsWith('/meu-psicologo/')) return 'perfil_publico';
    
    return moduleMap[path] || null;
}

// Função principal de verificação de plano
function performPlanCheck(to, next) {
    const planoId = parseInt(localStorage.getItem('planoId'));
    const statusAssinatura = localStorage.getItem('statusAssinatura') || 'sem_assinatura';
    const modulosPlano = JSON.parse(localStorage.getItem('modulosPlano') || '{}');

    // Plano Vitalício: acesso total
    if (planoId === 4) {
        return next();
    }

    // Obter módulo requerido pela rota
    const requiredModulo = getRequiredModule(to.path);
    
    // Rota sempre acessível
    if (!requiredModulo) {
        return next();
    }

    // Planos pagos (2=Essencial, 3=Profissional): verificar status da assinatura
    if ([2, 3].includes(planoId) && statusAssinatura !== 'ativa') {
        console.warn(`Acesso negado: assinatura ${statusAssinatura} não permite acesso`);
        showAccessDeniedToast(to.path, statusAssinatura);
        return next('/upgrade');
    }

    // Verificar se o módulo está disponível no plano
    if (!modulosPlano[requiredModulo]) {
        console.warn(`Acesso negado: ${to.path} não está disponível no plano atual`);
        showAccessDeniedToast(to.path, 'módulo não disponível');
        return next('/upgrade');
    }

    return next();
}

// Rotas que sempre devem ser acessíveis (sem autenticação)
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

    // Verificação de plano simplificada
    return performPlanCheck(to, next);
}

// Função para configurar o guard no router
export function setupPlanGuard(router) {
    router.beforeEach(planGuard);
}