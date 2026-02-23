// Configuração de ambiente para o projeto
// Este arquivo pode ser usado para sobrescrever configurações padrão

export const config = {
    // URLs da API para diferentes ambientes
    apiUrls: {
        development: 'http://127.0.0.1:8000/api',
        production: 'https://psicoprontuarios-v2.lksoftware.com.br/public/api/',
        // productionV1: 'https://psicoprontuarios.lksoftware.com.br/public/api/',
        // production: 'https://api.psicoprontuarios.com.br/api/'
    },
    
    // Configurações do Google OAuth
    google: {
        clientId: '594742730494-gnt2br1prntohpppk7i96bcapjjdccrv.apps.googleusercontent.com'
    },
    
    // Outras configurações
    app: {
        title: 'Psico Prontuários',
        version: '1.0.0'
    }
};

// Função para obter a URL da API baseada no ambiente
export const getApiUrl = () => {
    // Verifica se existe uma variável de ambiente específica
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Detecta ambiente automaticamente
    const isDevelopment = import.meta.env.DEV || 
                         window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
    
    return isDevelopment ? config.apiUrls.development : config.apiUrls.production;
};

export default config;
