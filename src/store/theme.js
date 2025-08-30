import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: false,
        sakaiTheme: {
            preset: 'Aura',
            primary: 'emerald',
            surface: 'zinc',
            darkTheme: false,
            menuMode: 'static'
        }
    }),

    getters: {
        // Retorna 'light' ou 'dark' para usar diretamente no template
        theme: (state) => state.isDark ? 'dark' : 'light',
        
        // Retorna true/false para v-if
        isDarkTheme: (state) => state.isDark,
        
        // Retorna a cor primária atual
        primaryColor: (state) => state.sakaiTheme.primary,
        
        // Retorna o preset atual
        currentPreset: (state) => state.sakaiTheme.preset,
        
        // Retorna a superfície atual
        surfaceColor: (state) => state.sakaiTheme.surface
    },

    actions: {
        // Inicializar o store lendo do localStorage
        init() {
            try {
                // Ler o tema light/dark
                const theme = localStorage.getItem('theme');
                if (theme) {
                    this.isDark = theme === 'dark';
                } else {
                    // Se não houver tema salvo, verificar se o sistema está em modo escuro
                    this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }

                // Ler o sakai-theme-config
                const sakaiConfig = localStorage.getItem('sakai-theme-config');
                if (sakaiConfig) {
                    const config = JSON.parse(sakaiConfig);
                    this.sakaiTheme = {
                        preset: config.preset || 'Aura',
                        primary: config.primary || 'emerald',
                        surface: config.surface || 'zinc',
                        darkTheme: config.darkTheme || false,
                        menuMode: config.menuMode || 'static'
                    };
                }
            } catch (error) {
                console.warn('Erro ao ler configuração do tema:', error);
            }
        },

        // Atualizar o tema light/dark
        updateTheme(theme) {
            this.isDark = theme === 'dark';
            // Salvar no localStorage
            localStorage.setItem('theme', theme);
        },

        // Atualizar o sakai-theme-config
        updateSakaiTheme(config) {
            
            this.sakaiTheme = {
                preset: config.preset || this.sakaiTheme.preset,
                primary: config.primary || this.sakaiTheme.primary,
                surface: config.surface || this.sakaiTheme.surface,
                darkTheme: config.darkTheme || this.sakaiTheme.darkTheme,
                menuMode: config.menuMode || this.sakaiTheme.menuMode
            };
            
            // Salvar no localStorage
            localStorage.setItem('sakai-theme-config', JSON.stringify(this.sakaiTheme));
        },

        // Atualizar apenas uma propriedade específica
        updateSakaiThemeProperty(key, value) {
            this.sakaiTheme[key] = value;
            // Salvar no localStorage
            localStorage.setItem('sakai-theme-config', JSON.stringify(this.sakaiTheme));
        },

        // Alternar entre light/dark
        toggleTheme() {
            const newTheme = this.isDark ? 'light' : 'dark';
            this.updateTheme(newTheme);
        }
    }
});
