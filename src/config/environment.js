// Configuração de ambiente para o projeto
// Este arquivo pode ser usado para sobrescrever configurações padrão

export const config = {
    // URLs da API para diferentes ambientes
    apiUrls: {
        development: 'http://127.0.0.1:8000/api',
        // production: 'https://psicoprontuarios-v2.lksoftware.com.br/public/api/',
        production: 'https://lucas-psicoprontuarios.irkqjy.easypanel.host/api/',
    },
    
    // Configurações do Google OAuth e Analytics
    google: {
        clientId: '594742730494-gnt2br1prntohpppk7i96bcapjjdccrv.apps.googleusercontent.com',
        gaMeasurementId: 'G-LPK81CWKFN',
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

/** Webhook N8N do chat flutuante (passado ao componente via prop no layout). */
const DEFAULT_N8N_CHAT_WEBHOOK_URL =
    'https://petgre-n8n-petgre.irkqjy.easypanel.host/webhook/psico-bot-webhook/chat';

export const getN8nChatWebhookUrl = () => {
    const fromEnv = (import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL || '').trim();
    return fromEnv || DEFAULT_N8N_CHAT_WEBHOOK_URL;
};

/** ID de medição GA4 (G-XXXXXXXXXX). Vazio = Analytics desligado. */
export const getGaMeasurementId = () => {
    const fromEnv = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
    if (fromEnv) return fromEnv;
    return (config.google.gaMeasurementId || '').trim();
};

export default config;
