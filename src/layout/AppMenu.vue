<script>
import { usePlanStore } from '@/store/plan';
import { useLayout } from '@/layout/composables/layout';
import AppMenuItem from './AppMenuItem.vue';
import api from '@/utils/axios';

export default {
    name: 'AppMenu',
    components: {
        AppMenuItem
    },
    data() {
        return {
            layoutComposable: null,
            menuData: []
        };
    },
    computed: {
        planStore() {
            return usePlanStore();
        },

        // Computed para verificar se deve mostrar o botão de upgrade
        shouldShowUpgradeButton() {
            // Mostrar para planos Gratuito e Essencial
            return this.planStore.isGratuito || (this.planStore.planoId === 2);
        },
        
        // Computed para detectar se é layout mobile
        isMobileLayout() {
            return this.layoutComposable?.layoutState.staticMenuMobileActive || window.innerWidth <= 991;
        },
        
        // Computed para tema escuro
        isDarkTheme() {
            return this.layoutComposable?.isDarkTheme;
        },
        
        // Modelo do menu filtrado baseado no plano
        model() {
            // Se não tem menu carregado, retornar array vazio
            if (!this.menuData || this.menuData.length === 0) {
                return [];
            }

            // Filtrar menu baseado em requiredFeature
            return this.filterMenuByFeatures(this.menuData);
        }
    },
    methods: {
        // Carregar informações do plano
        async loadPlanInfo() {
            try {
                // Se não tem dados no store, carregar do localStorage ou servidor
                if (!this.planStore.hasPlanData) {
                    this.planStore.loadFromStorage();
                    
                    // Se ainda não tem dados, buscar do servidor
                    if (!this.planStore.hasPlanData) {
                        await this.planStore.fetchModulosAcesso();
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar informações do plano:', error);
            }
        },
        
        // Carregar menu do localStorage ou buscar do servidor
        async loadMenu() {
            try {
                // Tentar carregar do localStorage primeiro
                const menuFromStorage = localStorage.getItem('menu');
                if (menuFromStorage) {
                    this.menuData = JSON.parse(menuFromStorage);
                    return;
                }
                
                // Se não tem no localStorage, buscar do servidor
                // Isso só acontece se o usuário não fez login recente
                if (this.planStore.planoId) {
                    await this.fetchMenuFromServer();
                }
            } catch (error) {
                console.error('Erro ao carregar menu:', error);
                this.menuData = [];
            }
        },
        
        // Buscar menu do servidor
        async fetchMenuFromServer() {
            try {
                const response = await api.get('/menu');
                if (response.data && response.data.menu) {
                    this.menuData = response.data.menu;
                    localStorage.setItem('menu', JSON.stringify(response.data.menu));
                }
            } catch (error) {
                console.error('Erro ao buscar menu do servidor:', error);
                this.menuData = [];
            }
        },
        
        // Filtrar menu baseado em requiredFeature
        filterMenuByFeatures(menuItems) {
            return menuItems.map(item => {
                // Se o item tem requiredFeature, verificar se o plano tem acesso
                if (item.requiredFeature && !this.planStore.temAcessoModulo(item.requiredFeature)) {
                    return null; // Não mostrar item
                }
                
                // Se tem subitens, filtrar recursivamente
                if (item.items && item.items.length > 0) {
                    const filteredItems = this.filterMenuByFeatures(item.items).filter(i => i !== null);
                    if (filteredItems.length === 0) {
                        return null; // Se não tem subitens visíveis, não mostrar o pai
                    }
                    return {
                        ...item,
                        items: filteredItems
                    };
                }
                
                return item;
            }).filter(item => item !== null);
        },
        
        goToUpgrade() {
            this.$router.push('/upgrade');
        },
        
        goToProfile() {
            this.$router.push('/perfil');
        },
        
        logout() {
            // Usar o mesmo padrão do AppTopbar
            if (window.$authService) {
                window.$authService.logout();
                this.$router.push('/login');
            } else {
                // Fallback: limpar sessionStorage e redirecionar
                sessionStorage.clear();
                this.$router.push('/login');
            }
        },
        
        toggleDarkMode() {
            if (this.layoutComposable) {
                this.layoutComposable.toggleDarkMode();
            }
        }
    },
    async mounted() {
        // Inicializar composables (planStore é computed, não precisa ser atribuído)
        this.layoutComposable = useLayout();
        
        // Carregar informações do plano
        await this.loadPlanInfo();
        
        // Carregar menu
        await this.loadMenu();
        
        // Escutar mudanças de plano em tempo real
        window.addEventListener('plan-updated', async () => {
            await this.loadPlanInfo();
            await this.loadMenu(); // Recarregar menu quando plano mudar
        });
        
        // Escutar atualização de menu
        window.addEventListener('menu-updated', (event) => {
            if (event.detail) {
                this.menuData = event.detail;
            }
        });
    },

    beforeUnmount() {
        // Remover listeners ao desmontar
        window.removeEventListener('plan-updated', this.loadPlanInfo);
        window.removeEventListener('menu-updated', this.loadMenu);
    }
};
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
                
        <!-- Botões do Topbar no Drawer (Mobile) -->
        <li class="mobile-topbar-actions">
            <!-- Botão de Upgrade -->
            <button v-if="shouldShowUpgradeButton" type="button" class="mobile-upgrade-button" @click="goToUpgrade">
                <i class="pi pi-star-fill"></i>
                <span>Faça o upgrade do seu plano</span>
            </button>
            
            <!-- Botão de Tema -->
            <button type="button" class="mobile-action-button" @click="toggleDarkMode">
                <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                <span>{{ isDarkTheme ? 'Modo Claro' : 'Modo Escuro' }}</span>
            </button>
            
            <!-- Botão de Perfil -->
            <button type="button" class="mobile-action-button" @click="goToProfile">
                <i class="pi pi-user"></i>
                <span>Meu Perfil</span>
            </button>
            
            <!-- Botão de Logout -->
            <button type="button" class="mobile-action-button" @click="logout">
                <i class="pi pi-sign-out"></i>
                <span>Sair</span>
            </button>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 768px) {
    .mobile-topbar-actions {
        display: none;
    }
}

/* Botões do Topbar no Drawer (Mobile) */
.mobile-topbar-actions {
    padding: 1rem;
    border-top: 1px solid var(--surface-border);
    margin-top: 1rem;
}

.mobile-upgrade-button {
    width: 100%;
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
        box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        transform: translateY(-1px);
    }
    
    i {
        font-size: 1.1rem;
    }
}

.mobile-action-button {
    width: 100%;
    background: var(--surface-card);
    color: var(--text-color);
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    
    &:hover {
        background: var(--surface-hover);
        border-color: var(--primary-color);
        transform: translateY(-1px);
    }
    
    &:last-child {
        margin-bottom: 0;
    }
    
    i {
        font-size: 1.1rem;
        color: var(--primary-color);
    }
    
    span {
        font-size: 0.95rem;
    }
}

/* Separador visual */
.menu-separator {
    height: 1px;
    background: var(--surface-border);
    margin: 1rem 0;
}
</style>
