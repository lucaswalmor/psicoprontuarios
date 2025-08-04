import axios from 'axios';

var urlProd = 'https://psicoprontuarios.lksoftware.com.br/public/api/';
var urlDev = 'http://localhost:8000/api';

// Configuração base do axios
const api = axios.create({
    baseURL: urlProd,
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
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Mostrar loading para todas as requisições exceto login e logout
        // Também não mostrar para requisições de plano se já tem loading específico
        // E não mostrar para verificações de status PIX (polling)
        const isPlanRequest = config.url.includes('/user/plan-info') || config.url.includes('/user/check-feature');
        const isPixStatusRequest = config.url.includes('/user/pix-payment-status/');
        const hasPlanLoading = window.planLoadingActive;
        
        if (!config.url.includes('/login') && !config.url.includes('/logout') && !(isPlanRequest && hasPlanLoading) && !isPixStatusRequest) {
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
        return response;
    },
    (error) => {
        // Esconder loading em caso de erro
        hideLoading();
        
        // Se o token expirou ou é inválido
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Redirecionar para login se necessário
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api; 