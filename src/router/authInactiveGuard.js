/**
 * Guard: usuário logado com conta inativa (pagamento / assinatura pausada etc.)
 * só acessa /pagamento, rotas públicas e logout.
 */

const PUBLIC_PATHS = new Set([
    '/',
    '/login',
    '/cadastro',
    '/politica-privacidade',
    '/termos-uso',
    '/change-password',
    '/pages/notfound',
    '/auth/access',
    '/auth/error'
]);

function isPublicRoute(path) {
    if (PUBLIC_PATHS.has(path)) return true;
    if (path.startsWith('/auth/')) return true;
    if (path === '/bot-docs' || path.startsWith('/bot-docs/')) return true;
    return false;
}

function isInactive() {
    return localStorage.getItem('userAtivo') === 'false';
}

/** Conta ativa mas ainda sem assinatura: preview liberado ou bloqueio em /upgrade. */
export function usuarioPrecisaContratarPlano() {
    if (isInactive()) {
        return false;
    }
    if (localStorage.getItem('usuarioVitalicio') === 'true') {
        return false;
    }
    if (localStorage.getItem('previewAtivo') === 'true') {
        return false;
    }
    if (localStorage.getItem('precisaAtivarPlano') === 'true') {
        return true;
    }
    return localStorage.getItem('statusAssinatura') === 'sem_assinatura';
}

/** Usuário pode sair de /upgrade e voltar ao app (ex.: assinante fazendo upgrade voluntário). */
export function usuarioPodeSairDaUpgrade() {
    if (!localStorage.getItem('token')) {
        return false;
    }
    if (isInactive()) {
        return false;
    }
    return !usuarioPrecisaContratarPlano();
}

const ROTAS_COM_ASSINATURA_OBRIGATORIA = new Set(['/upgrade', '/completar-cadastro']);

export function setupAuthInactiveGuard(router) {
    router.beforeEach((to, from, next) => {
        if (isPublicRoute(to.path)) {
            return next();
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return next('/login');
        }

        if (isInactive()) {
            const allows = to.meta.allowsInactive === true || to.path === '/pagamento';
            if (allows) {
                return next();
            }
            return next({ path: '/pagamento', replace: true });
        }

        if (usuarioPrecisaContratarPlano()) {
            if (ROTAS_COM_ASSINATURA_OBRIGATORIA.has(to.path)) {
                return next();
            }
            return next({ path: '/upgrade', replace: true });
        }

        if (to.path === '/pagamento' && !isInactive()) {
            return next({ path: '/dashboard', replace: true });
        }

        return next();
    });
}
