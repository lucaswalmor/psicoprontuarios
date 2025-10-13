<script>
import { usePlanStore } from '@/store/plan';
import { useLayout } from '@/layout/composables/layout';
import AppMenuItem from './AppMenuItem.vue';

export default {
    name: 'AppMenu',
    components: {
        AppMenuItem
    },
    data() {
        return {
            planStore: null,
            layoutComposable: null
        };
    },
    computed: {
        // Computed para verificar se deve mostrar o botão de upgrade
        shouldShowUpgradeButton() {
            if (!this.planStore?.planInfo) return false;

            const currentPlan = this.planStore.planInfo.nome;
            return currentPlan === 'Gratuito' || currentPlan === 'Essencial';
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
            const baseMenu = [
                {
                    label: 'Home',
                    items: [
                        {
                            label: 'Dashboard', 
                            icon: 'pi pi-fw pi-home', 
                            to: '/dashboard',
                            requiredFeature: 'dashboard'
                        },
                        {
                            label: 'Gestão Financeira', 
                            icon: 'pi pi-fw pi-wallet', 
                            to: '/financeiro',
                            requiredFeature: 'gestao_financeira'
                        },
                        {
                            label: 'Pacientes', 
                            icon: 'pi pi-fw pi-user', 
                            to: '/pacientes',
                            requiredFeature: null // Sempre disponível
                        },
                        {
                            label: 'Agendamentos', 
                            icon: 'pi pi-fw pi-calendar', 
                            to: '/agendamentos',
                            requiredFeature: 'agendamentos'
                        },
                        {
                            label: 'Meu Psicólogo', 
                            icon: 'pi pi-fw pi-user-edit', 
                            to: '/meu-psicologo',
                            requiredFeature: 'perfil_publico'
                        },
                    ]
                },
                {
                    label: 'Configurações',
                    items: [
                        {
                            label: 'Geral', 
                            icon: 'pi pi-fw pi-cog', 
                            to: '/configuracoes',
                            requiredFeature: null // Sempre disponível
                        },
                        {
                            label: 'FAQ - Dúvidas', 
                            icon: 'pi pi-fw pi-question-circle', 
                            to: '/faq',
                            requiredFeature: null // Sempre disponível
                        }
                    ]
                }
            ];

            // Obter dados do store
            const planInfo = this.planStore?.planInfo;
            const userInfo = this.planStore?.userInfo;
            const isVitalicio = this.planStore?.isVitalicio;

            // Filtrar itens baseado no plano
            return baseMenu.map(section => ({
                ...section,
                items: section.items.filter(item => {
                    // Usuários vitalícios têm acesso total
                    if (isVitalicio) {
                        return true;
                    }
                    
                    // Se não tem feature requerida, sempre disponível
                    if (!item.requiredFeature) {
                        return true;
                    }
                    
                    // Se o plano está pausado, verificar se a feature é permitida
                    if (this.planStore?.isPlanPaused) {
                        // Quando pausado, apenas algumas features são permitidas
                        const allowedWhenPaused = ['dashboard', null]; // null = sempre disponível
                        return allowedWhenPaused.includes(item.requiredFeature);
                    }
                    
                    // Verificar se a feature está disponível no plano
                    return planInfo?.features?.[item.requiredFeature] || false;
                })
            }));
        }
    },
    methods: {
        // Carregar informações do plano
        async loadPlanInfo() {
            try {
                // Se não tem dados no store, carregar do localStorage ou servidor
                if (!this.planStore.hasPlanData) {
                    this.planStore.loadPlanFromStorage();
                    
                    // Se ainda não tem dados, buscar do servidor
                    if (!this.planStore.hasPlanData) {
                        await this.planStore.fetchPlanInfo();
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar informações do plano:', error);
            }
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
        // Inicializar stores e composables
        this.planStore = usePlanStore();
        this.layoutComposable = useLayout();
        
        // Carregar informações do plano
        await this.loadPlanInfo();
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
