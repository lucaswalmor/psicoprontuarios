// Utilitário para gerenciar configurações do tema no localStorage

const STORAGE_KEY = 'sakai-theme-config';

// Configurações padrão
const DEFAULT_CONFIG = {
    preset: 'Aura',
    primary: 'purple',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
};

/**
 * Salva as configurações do tema no localStorage
 * @param {Object} config - Configurações a serem salvas
 */
export const saveThemeConfig = (config) => {
    try {
        const configToSave = {
            ...DEFAULT_CONFIG,
            ...config
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
        
        // Sincroniza a chave 'theme' com o valor darkTheme
        if (configToSave.darkTheme !== undefined) {
            localStorage.setItem('theme', configToSave.darkTheme ? 'dark' : 'light');
        }
        
        return true;
    } catch (error) {
        console.warn('Erro ao salvar configurações do tema:', error);
        return false;
    }
};

/**
 * Carrega as configurações do tema do localStorage
 * @returns {Object} Configurações carregadas ou configurações padrão
 */
export const loadThemeConfig = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const themeKey = localStorage.getItem('theme');
        
        if (stored) {
            // Se há configurações salvas, usa elas como prioridade
            const config = JSON.parse(stored);
            const finalConfig = {
                ...DEFAULT_CONFIG,
                ...config
            };
            
            // Sincroniza a chave 'theme' com as configurações salvas se necessário
            const expectedThemeKey = finalConfig.darkTheme ? 'dark' : 'light';
            if (themeKey !== expectedThemeKey) {
                localStorage.setItem('theme', expectedThemeKey);
            }
            
            return finalConfig;
        }
        
        // Se não há configurações salvas, usa a chave 'theme' ou padrão
        if (!themeKey) {
            localStorage.setItem('theme', 'light');
        }
        
        const isDarkTheme = themeKey === 'dark';
        return { 
            ...DEFAULT_CONFIG,
            darkTheme: isDarkTheme
        };
    } catch (error) {
        console.warn('Erro ao carregar configurações do tema:', error);
        return { 
            ...DEFAULT_CONFIG,
            darkTheme: false
        };
    }
};

/**
 * Aplica as configurações do tema ao DOM
 * @param {Object} config - Configurações a serem aplicadas
 */
export const applyThemeConfig = (config) => {
    if (config.darkTheme) {
        document.documentElement.classList.add('app-dark');
    } else {
        document.documentElement.classList.remove('app-dark');
    }
};

/**
 * Limpa as configurações salvas no localStorage
 */
export const clearThemeConfig = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.warn('Erro ao limpar configurações do tema:', error);
        return false;
    }
};

/**
 * Verifica se existem configurações salvas
 * @returns {boolean}
 */
export const hasStoredConfig = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) !== null;
    } catch (error) {
        return false;
    }
}; 