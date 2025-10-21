import { showAccessDeniedToast } from '@/utils/toast';

// Função para verificar permissões do plano usando dados do localStorage
function performPlanCheck(to, next) {
    // Obter dados do localStorage (vindos do login)
    const usuarioVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
    const statusAssinatura = localStorage.getItem('statusAssinatura') || 'sem_assinatura';
    const temAssinaturaAtiva = localStorage.getItem('temAssinaturaAtiva') === 'true';
    const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');

    // Usuários vitalícios têm acesso total
    if (usuarioVitalicio) {
        return next();
    }

    // Verificar se a rota requer uma feature específica
    const requiredModulo = routeModuleMap[to.path];
    
    // Se não requer módulo específico, permite acesso
    if (requiredModulo === null) {
        return next();
    }

    // Verificar se assinatura permite acesso (ativa ou pendente)
    if (!temAssinaturaAtiva) {
        console.warn(`Acesso negado: assinatura ${statusAssinatura} não permite acesso`);
        showAccessDeniedToast(to.path, statusAssinatura);
        return next('/upgrade');
    }

    // Se requer módulo específico, verificar se está disponível no plano
    if (requiredModulo && assinatura && assinatura.plano && assinatura.plano.modulos) {
        const modulosDisponiveis = assinatura.plano.modulos.map(modulo => modulo.chave);
        
        if (!modulosDisponiveis.includes(requiredModulo)) {
            // Redirecionar para rota apropriada baseada no plano
            let redirectRoute = '/pacientes'; // Rota padrão
            
            if (modulosDisponiveis.includes('dashboard')) {
                redirectRoute = '/dashboard';
            } else if (modulosDisponiveis.includes('agendamentos')) {
                redirectRoute = '/agendamentos';
            }

            // Mostrar mensagem de erro
            console.warn(`Acesso negado: ${to.path} não está disponível no plano atual`);
            showAccessDeniedToast(to.path, 'plano atual');
            
            return next(redirectRoute);
        }
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
    '/pacientes': null, // sempre acessível
    '/pacientes/cadastro': null, // sempre acessível
    '/pacientes/editar': null, // sempre acessível
    '/pacientes/prontuarios': null, // sempre acessível
    '/prontuarios': 'prontuario', // sempre acessível (plano gratuito tem)
    '/prontuarios/novo': 'prontuario',
    '/prontuarios/editar': 'prontuario',
    '/prontuarios/pdf': 'prontuarios_pdf',
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

    // Verificação simples usando dados do localStorage (vindos do login)
    return performPlanCheck(to, next);
}

// Função para configurar o guard no router
export function setupPlanGuard(router) {
    router.beforeEach(planGuard);
}