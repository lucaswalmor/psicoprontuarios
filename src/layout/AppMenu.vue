<template>
    <ul class="layout-menu">
        <li>
            <PanelMenu :model="menuData">
                <template #item="{ item }">
                    <!-- Navegação por rota -->
                    <router-link
                        v-if="item.to"
                        v-slot="{ href, navigate, isActive }"
                        :to="item.to"
                        custom
                    >
                        <a
                            :href="href"
                            @click="navigate"
                            class="flex align-items-center px-3 py-2 w-full"
                            :class="{ 'active-route': isActive }"
                        >
                            <i :class="['layout-menuitem-icon', item.icon]" class="mr-2" />
                            <span class="layout-menuitem-text">
                                {{ item.label }}
                                {{ $planService.resolverTipoPlanoUsuario() }}
                            </span>
                        </a>
                    </router-link>

                    <!-- Títulos / itens sem rota (ex: grupos) -->
                    <a
                        v-else
                        href="#"
                        class="flex align-items-center px-3 py-2 w-full"
                        @click.prevent
                    >
                        <i v-if="item.icon" :class="['layout-menuitem-icon', item.icon]" class="mr-2" />
                        <span class="layout-menuitem-text">{{ item.label }}</span>
                    </a>
                </template>
            </PanelMenu>
        </li>

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

<script>
import { useLayout } from '@/layout/composables/layout';
import PanelMenu from 'primevue/panelmenu';

export default {
    name: 'AppMenu',
    components: {
        PanelMenu
    },
    data() {
        return {
            layoutComposable: null,
            // Modelo estático do menu para o PanelMenu
            menuData: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-home',
                    to: '/dashboard'
                },
                {
                    label: 'Pacientes',
                    icon: 'pi pi-users',
                    to: '/pacientes'
                },
                {
                    label: 'Agendamentos',
                    icon: 'pi pi-calendar',
                    to: '/agendamentos'
                },
                {
                    label: 'Financeiro',
                    icon: 'pi pi-wallet',
                    items: [
                        { label: 'Receitas', icon: 'pi pi-arrow-down-right', to: '/financeiro/receitas' },
                        { label: 'Despesas', icon: 'pi pi-arrow-up-right', to: '/financeiro/despesas' }
                    ]
                },
                {
                    label: 'Configurações',
                    icon: 'pi pi-cog',
                    to: '/configuracoes'
                },
                {
                    label: 'Meu Site',
                    icon: 'pi pi-globe',
                    to: '/meu-site'
                },
                {
                    label: 'Suporte',
                    icon: 'pi pi-comments',
                    to: '/chamados'
                }
            ]
        };
    },
    computed: {
        // Computed para tema escuro
        isDarkTheme() {
            return this.layoutComposable?.isDarkTheme;
        },

        // Upgrade desativado enquanto planos não existem
        shouldShowUpgradeButton() {
            return false;
        }
    },
    methods: {
        goToUpgrade() {
            this.$router.push('/upgrade');
        },

        goToProfile() {
            this.$router.push('/perfil');
        },

        logout() {
            if (window.$authService) {
                window.$authService.sair();
                this.$router.push('/login');
            } else {
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
    mounted() {
        this.layoutComposable = useLayout();
    }
};
</script>

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
