import axios from 'axios';
import { getApiUrl } from '../config/environment.js';

// Configuração base do axios
const api = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Importante para o Sanctum
});

// Função para mostrar/esconder loading
const showLoading = () => {
    if (window.$loading) {
        window.$loading.show();
    }
};

const hideLoading = () => {
    if (window.$loading) {
        window.$loading.hide();
    }
};

// Interceptor para adicionar token e mostrar loading em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // Rotas que não enviam Bearer (login, cadastro, reset de senha).
        // Logout NÃO entra aqui: POST /logout exige auth:sanctum no Laravel.
        const publicRoutes = [
            '/login',
            '/user/send-reset-code',
            '/user/verify-reset-code',
            '/user/reset-password',
            '/cadastro',
            '/usuario',
            '/leads',
            '/marketing-logs'
        ];
        
        // Verificar se a rota atual é pública
        const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
        
        // Só adicionar token se não for rota pública
        if (token && !isPublicRoute) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Mostrar loading para todas as requisições exceto login e logout
        // Também não mostrar para requisições de plano se já tem loading específico
        // E não mostrar para verificações de status PIX (polling)
        const isPlanRequest = config.url.includes('/user/plan-info') || config.url.includes('/user/check-feature');
        const isPixStatusRequest = config.url.includes('/user/pix-payment-status/');
        const hasPlanLoading = window.planLoadingActive;
        
        if (!config.url.includes('/login') && !config.url.includes('/logout') && !config.url.includes('/leads') && !config.url.includes('/marketing-logs') && !(isPlanRequest && hasPlanLoading) && !isPixStatusRequest) {
            showLoading();
        }
        
        return config;
    },
    (error) => {
        hideLoading();
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
    (response) => {
        // Esconder loading em caso de sucesso
        hideLoading();
        
        // Não processar respostas de blob (downloads)
        if (response.config.responseType === 'blob') {
            return response;
        }
        
        // Verificação de status de pagamento desativada temporariamente:
        // o sistema de planos/assinaturas foi removido e todas as funcionalidades
        // estão liberadas, então não há mais necessidade de checar pendências aqui.

        return response;
    },
    (error) => {
        // Esconder loading em caso de erro
        hideLoading();
        
        // Lista de rotas públicas que não devem redirecionar para login em caso de 401
        const publicRoutes = [
            '/login',
            '/logout',
            '/user/send-reset-code',
            '/user/verify-reset-code',
            '/user/reset-password',
            '/cadastro',
            '/usuario',
            '/leads',
            '/marketing-logs'
        ];
        
        // Verificar se a rota atual é pública
        const isPublicRoute = publicRoutes.some(route => error.config?.url?.includes(route));
        
        // Se o token expirou ou é inválido e não é rota pública
        if (error.response?.status === 401 && !isPublicRoute) {
            localStorage.removeItem('token');
            // Redirecionar para login se necessário
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        const errorCode = error.response?.data?.code;
        if (error.response?.status === 403 && (errorCode === 'preview_expirado' || error.response?.data?.precisa_ativar_plano)) {
            localStorage.setItem('previewAtivo', 'false');
            localStorage.setItem('precisaAtivarPlano', 'true');
            if (window.location.pathname !== '/upgrade') {
                window.location.href = '/upgrade';
            }
        }

        if (error.response?.status === 422 && errorCode === 'preview_limite_pacientes') {
            localStorage.setItem('mostrarPromptAtivacao', 'true');
        }

        return Promise.reject(error);
    }
);

export default api; 