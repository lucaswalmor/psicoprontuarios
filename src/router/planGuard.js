import { showAccessDeniedToast } from '@/utils/toast';

// Função para verificar permissões do plano
function performPlanCheck(planStore, to, next) {
    const planInfo = planStore.planInfo;
    const isVitalicio = planStore.isVitalicio;

    // Usuários vitalícios têm acesso total
    if (isVitalicio) {
        return next();
    }

    // Verificar se a rota requer uma feature específica
    const requiredFeature = routeFeatureMap[to.path];
    
    // Se não requer feature específica, permite acesso
    if (requiredFeature === null) {
        return next();
    }

    // Se requer feature específica, verificar se está disponível
    if (requiredFeature && !planInfo.features[requiredFeature]) {
        // Redirecionar para rota apropriada baseada no plano
        let redirectRoute = '/pacientes'; // Rota padrão
        
        if (planInfo.features.dashboard) {
            redirectRoute = '/dashboard';
        } else if (planInfo.features.agendamentos) {
            redirectRoute = '/agendamentos';
        }

        // Mostrar mensagem de erro
        console.warn(`Acesso negado: ${to.path} não está disponível no plano ${planInfo.nome}`);
        showAccessDeniedToast(to.path, planInfo.nome);
        
        return next(redirectRoute);
    }

    // Se tem acesso, permite
    return next();
}

// Mapeamento de rotas para features requeridas
const routeFeatureMap = {
    '/dashboard': 'dashboard',
    '/financeiro': 'gestao_financeira',
    '/financeiro/novo': 'gestao_financeira',
    '/financeiro/editar': 'gestao_financeira',
    '/financeiro/lista': 'gestao_financeira',
    '/agendamentos': 'agendamentos',
    // Pacientes sempre disponível
    '/pacientes': null,
    '/pacientes/cadastro': null,
    '/pacientes/editar': null,
    '/pacientes/prontuarios': null
};

// Rotas que sempre devem ser acessíveis
const alwaysAllowedRoutes = [
    '/',
    '/login',
    '/cadastro',
    '/politica-privacidade',
    '/termos-uso',
    '/pages/notfound',
    '/auth/access',
    '/auth/error'
];

export async function planGuard(to, from, next) {
    // Se é uma rota sempre permitida, permite acesso
    if (alwaysAllowedRoutes.includes(to.path)) {
        return next();
    }

    // Se não está autenticado, redireciona para login
    const token = localStorage.getItem('token');
    if (!token) {
        return next('/login');
    }

    try {
        // Obter informações do plano do store Pinia
        const { usePlanStore } = await import('@/store/plan');
        const planStore = usePlanStore();

        // Carregar dados do localStorage se não estiverem no store
        if (!planStore.hasPlanData) {
            planStore.loadPlanFromStorage();
        }

        const planInfo = planStore.planInfo;
        const isVitalicio = planStore.isVitalicio;

        // Só mostrar loading do plano se realmente precisar buscar dados do servidor
        let needsServerFetch = false;
        if (!planInfo) {
            needsServerFetch = true;
            // Emitir evento para mostrar loading apenas quando vai buscar do servidor
            if (to.meta.requiresPlanCheck) {
                window.dispatchEvent(new CustomEvent('plan-check-start'));
            }
            await planStore.fetchPlanInfo();
        }

        // Se os dados já estavam disponíveis, não precisa de loading
        if (!needsServerFetch) {
            // Verificação instantânea sem loading
            return performPlanCheck(planStore, to, next);
        }

        // Se precisou buscar dados do servidor, fazer verificação com loading
        const result = performPlanCheck(planStore, to, next);
        
        // Sempre finalizar o loading se foi iniciado
        window.dispatchEvent(new CustomEvent('plan-check-end'));
        
        return result;

    } catch (error) {
        console.error('Erro ao verificar plano do usuário:', error);
        if (needsServerFetch) {
            window.dispatchEvent(new CustomEvent('plan-check-end'));
        }
        // Em caso de erro, redireciona para pacientes
        return next('/pacientes');
    }
}

// Função para configurar o guard no router
export function setupPlanGuard(router) {
    router.beforeEach(planGuard);
} 