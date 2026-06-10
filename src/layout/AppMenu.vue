<template>
    <ul class="layout-menu app-menu">
        <li class="app-menu__main">
            <PanelMenu :model="menuData" class="app-nav-panelmenu">
                <template #item="{ item, active, root }">
                    <!-- Navegação principal: rota direta (não é filho de painel com submenu) -->
                    <router-link
                        v-if="item.to && !item.items && root"
                        v-slot="{ href, navigate }"
                        :to="item.to"
                        custom
                    >
                        <a
                            :href="href"
                            class="app-nav-entry app-nav-entry--link flex align-items-center w-full"
                            :class="{ 'app-nav-entry--active': isRouteActive(item.to), 'active-route': isRouteActive(item.to) }"
                            :aria-current="isRouteActive(item.to) ? 'page' : undefined"
                            @click="navigate"
                        >
                            <div class="menu-item-row">
                                <span class="app-nav-entry__icon-wrap">
                                    <i :class="['layout-menuitem-icon', item.icon]" />
                                </span>
                                <div class="menu-label-row">
                                    <span class="layout-menuitem-text app-nav-entry__label">{{ item.label }}</span>
                                    <Tag
                                        v-if="item.to === '/meu-site' && !podeMeuSite"
                                        value="PRO"
                                        severity="warning"
                                        class="menu-pro-tag"
                                    />
                                </div>
                            </div>
                        </a>
                    </router-link>

                    <!-- Subitens de painel (Financeiro, Configurações, etc.) -->
                    <router-link
                        v-else-if="item.to && !item.items && !root"
                        v-slot="{ href, navigate }"
                        :to="item.to"
                        custom
                    >
                        <a
                            :href="href"
                            class="app-nav-entry app-nav-entry--link app-nav-entry--submenu flex align-items-center w-full"
                            :class="{ 'app-nav-entry--active': isRouteActive(item.to), 'active-route': isRouteActive(item.to) }"
                            :aria-current="isRouteActive(item.to) ? 'page' : undefined"
                            @click="navigate"
                        >
                            <div class="menu-item-row menu-item-row--submenu">
                                <span class="app-nav-entry__icon-wrap app-nav-entry__icon-wrap--submenu">
                                    <i :class="['layout-menuitem-icon', item.icon]" />
                                </span>
                                <div class="menu-label-row menu-label-row--submenu">
                                    <span class="layout-menuitem-text app-nav-entry__label">{{ item.label }}</span>
                                    <Tag
                                        v-if="item.proTag"
                                        value="PRO"
                                        severity="warning"
                                        class="menu-pro-tag"
                                    />
                                </div>
                            </div>
                        </a>
                    </router-link>

                    <!-- Painel com submenu (Financeiro): mesma hierarquia visual dos outros itens -->
                    <a
                        v-else-if="item.items"
                        href="#"
                        class="app-nav-entry app-nav-entry--panel flex align-items-center w-full"
                        :class="{ 'app-nav-entry--panel-open': active }"
                        @click.prevent
                    >
                        <div class="menu-item-row">
                            <span class="app-nav-entry__icon-wrap">
                                <i :class="['layout-menuitem-icon', item.icon]" />
                            </span>
                            <div class="menu-label-row menu-label-row--panel">
                                <span class="layout-menuitem-text app-nav-entry__label">{{ item.label }}</span>
                                <i
                                    class="app-nav-entry__chevron pi"
                                    :class="active ? 'pi-chevron-down' : 'pi-chevron-right'"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </a>

                    <!-- Fallback (item sem rota e sem submenu) -->
                    <a
                        v-else
                        href="#"
                        class="app-nav-entry app-nav-entry--header flex align-items-center w-full"
                        @click.prevent
                    >
                        <span v-if="item.icon" class="app-nav-entry__icon-wrap">
                            <i :class="['layout-menuitem-icon', item.icon]" />
                        </span>
                        <span class="layout-menuitem-text app-nav-entry__label">{{ item.label }}</span>
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
import Tag from 'primevue/tag';

export default {
    name: 'AppMenu',
    components: {
        PanelMenu,
        Tag
    },
    data() {
        return {
            layoutComposable: null,
            /** Itens-base; `menuData` (computed) aplica regras por plano */
            menuItems: [
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
                    items: [
                        { label: 'Preferências', icon: 'pi pi-sliders-h', to: '/configuracoes/preferencias' },
                        { label: 'Comunicação', icon: 'pi pi-whatsapp', to: '/configuracoes/comunicacao', proTag: true },
                    ]
                },
                {
                    label: 'Meu Site',
                    icon: 'pi pi-globe',
                    to: '/meu-site'
                },
                {
                    label: 'Modelos de Arquivos',
                    icon: 'pi pi-folder-open',
                    to: '/modelos-arquivos'
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
        podeMeuSite() {
            const tipo = this.$planService.resolverTipoPlanoUsuario();
            return ['pro', 'vitalicio'].includes(tipo);
        },

        /** Itens exibidos no PanelMenu */
        menuData() {
            return this.menuItems;
        },

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
        },

        isRouteActive(to) {
            if (!to) return false;
            const current = this.$route.path;
            return current === to || current.startsWith(to + '/');
        }
    },
    mounted() {
        this.layoutComposable = useLayout();
    }
};
</script>

<style lang="scss" scoped>
.app-menu {
    margin: 0;
}

.app-menu__main {
    list-style: none;
}

.menu-item-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.65rem;
    padding: 0.55rem 0.65rem;
}

/* Subitens de painel (Financeiro, Configurações, etc.) */
.app-nav-entry--submenu {
    padding: 0 !important;
}

.app-nav-entry--submenu .menu-item-row--submenu {
    padding: 0.55rem 0.65rem;
    gap: 0.65rem;
    width: 100%;
}

.app-nav-entry--submenu .menu-label-row--submenu {
    gap: 0.5rem;
}

.app-nav-entry__icon-wrap--submenu {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.app-nav-entry__icon-wrap--submenu .layout-menuitem-icon.pi {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    line-height: 1;
    margin: 0;
}

.app-nav-entry--submenu .app-nav-entry__label {
    font-size: 0.9375rem;
    font-weight: 500;
}

.menu-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    min-width: 0;
}

.menu-pro-tag {
    flex: 0 0 auto;
    font-size: 0.7rem;
    padding: 0.125rem 0.4rem;
}

/* Entradas do menu (slot + alinhadas ao tema) */
.app-nav-entry {
    text-decoration: none;
    color: var(--text-color);
    border-radius: 10px;
    border: 1px solid transparent;
    transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease,
        box-shadow 0.15s ease;
}

.app-nav-entry--link:hover {
    background: color-mix(in srgb, var(--primary-color) 8%, var(--surface-card));
    border-color: color-mix(in srgb, var(--primary-color) 18%, var(--surface-border));
}

.app-nav-entry--header {
    cursor: default;
    color: var(--text-color-secondary);
    font-weight: 600;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 0.15rem;
}

/* Cabeçalho de painel com submenu (ex.: Financeiro) — alinhado aos itens simples */
.app-nav-entry--panel {
    cursor: pointer;
    color: var(--text-color);
}

.app-nav-entry--panel .app-nav-entry__label {
    font-weight: 500;
    font-size: 0.9375rem;
}

.menu-label-row--panel {
    min-height: 2.25rem;
}

.app-nav-entry__chevron {
    flex-shrink: 0;
    font-size: 0.7rem;
    color: var(--text-color-secondary);
    margin-left: auto;
}

.app-nav-entry__icon-wrap {
    flex: 0 0 auto;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-ground));
    color: var(--primary-color);
}

.app-nav-entry--header .app-nav-entry__icon-wrap {
    background: color-mix(in srgb, var(--text-color-secondary) 12%, var(--surface-ground));
    color: var(--text-color-secondary);
}

.app-nav-entry--panel .app-nav-entry__icon-wrap {
    background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-ground));
    color: var(--primary-color);
}

.app-nav-entry__label {
    font-weight: 500;
    font-size: 0.9375rem;
}

.app-nav-entry--active,
.app-nav-entry.active-route {
    color: var(--primary-color);
    font-weight: 600;
    background: color-mix(in srgb, var(--primary-color) 11%, var(--surface-card));
    border-color: color-mix(in srgb, var(--primary-color) 28%, var(--surface-border));
    box-shadow: inset 2px 0 0 0 var(--primary-color);
}

.app-nav-entry--active .app-nav-entry__icon-wrap,
.app-nav-entry.active-route .app-nav-entry__icon-wrap {
    background: color-mix(in srgb, var(--primary-color) 18%, var(--surface-card));
    color: var(--primary-color);
}

/* Prime PanelMenu — painéis e submenu */
.app-nav-panelmenu {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    width: 100%;
    border: none !important;
    background: transparent !important;
    padding: 0;
}

.app-nav-panelmenu :deep(.p-panelmenu-panel) {
    border: none;
    border-radius: 12px;
    overflow: visible;
    margin: 0;
    padding: 0 !important;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
}

.app-nav-panelmenu :deep(.p-panelmenu-header) {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--surface-border);
    background: color-mix(in srgb, var(--surface-ground) 40%, var(--surface-card));
    outline: none;
    transition:
        border-color 0.15s ease,
        background 0.15s ease;
}

.app-nav-panelmenu :deep(.p-panelmenu-header:not(.p-disabled):hover) {
    border-color: color-mix(in srgb, var(--primary-color) 25%, var(--surface-border));
    background: color-mix(in srgb, var(--primary-color) 5%, var(--surface-card));
}

.app-nav-panelmenu :deep(.p-panelmenu-header-active) {
    border-color: color-mix(in srgb, var(--primary-color) 35%, var(--surface-border));
    background: color-mix(in srgb, var(--primary-color) 7%, var(--surface-card));
}

.app-nav-panelmenu :deep(.p-panelmenu-header-content) {
    padding: 0;
}

.app-nav-panelmenu :deep(.p-panelmenu-content-container) {
    padding: 0.25rem 0 0;
    width: 100%;
}

.app-nav-panelmenu :deep(.p-panelmenu-content) {
    width: 100%;
    padding: 0;
}

/* Subitens de painel — sem recuo lateral para alinhar ícones ao menu principal */
.app-nav-panelmenu :deep(.p-panelmenu-root-list) {
    margin: 0;
    padding: 0 !important;
    border-left: none;
    list-style: none;
    width: 100%;
}

.app-nav-panelmenu :deep(.p-panelmenu-submenu) {
    margin: 0;
    padding: 0.15rem 0 0 !important;
    border-left: none;
    list-style: none;
    width: 100%;
}

.app-nav-panelmenu :deep(.p-panelmenu-item) {
    width: 100%;
}

.app-nav-panelmenu :deep(.p-panelmenu-item-content) {
    width: 100%;
    border-radius: 10px;
    margin: 0.2rem 0;
    box-sizing: border-box;
}

.app-nav-panelmenu :deep(.p-panelmenu-root-list > .p-panelmenu-item > .p-panelmenu-item-content) {
    margin: 0.08rem 0;
}

.app-nav-panelmenu :deep(.p-panelmenu-item-link) {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    min-height: 2.75rem;
    gap: 0;
    padding: 0.45rem 0.5rem 0.45rem 0.45rem !important;
    border-radius: 10px;
    color: var(--text-color);
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 500;
    border: 1px solid transparent;
    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease;
}

.app-nav-panelmenu :deep(.p-panelmenu-root-list .p-panelmenu-item-link) {
    min-height: 2.35rem;
    padding: 0.28rem 0.4rem 0.28rem 0.35rem !important;
}

.app-nav-panelmenu :deep(.p-panelmenu-item-icon) {
    flex: 0 0 auto;
    display: inline-grid !important;
    place-items: center;
    width: 2.25rem !important;
    height: 2.25rem !important;
    margin-right: 0.65rem !important;
    border-radius: 9px;
    background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-ground));
    color: var(--primary-color);
    font-size: 0.95rem;
    line-height: 0;
}

.app-nav-panelmenu :deep(.p-panelmenu-item-icon::before) {
    line-height: 1;
}

.app-nav-panelmenu :deep(.p-panelmenu-item-label) {
    flex: 1;
    min-width: 0;
    text-align: left;
}

.app-nav-panelmenu :deep(.p-panelmenu-item-link:hover) {
    background: color-mix(in srgb, var(--primary-color) 8%, var(--surface-card));
    border-color: color-mix(in srgb, var(--primary-color) 15%, var(--surface-border));
}

.app-nav-panelmenu :deep(.p-panelmenu-item-link.router-link-active),
.app-nav-panelmenu :deep(.p-panelmenu-item-link.router-link-exact-active) {
    color: var(--primary-color);
    font-weight: 600;
    background: color-mix(in srgb, var(--primary-color) 11%, var(--surface-card));
    border-color: color-mix(in srgb, var(--primary-color) 28%, var(--surface-border));
    box-shadow: inset 2px 0 0 0 var(--primary-color);
}

.app-nav-panelmenu :deep(.p-panelmenu-item-link.router-link-active .p-panelmenu-item-icon),
.app-nav-panelmenu :deep(.p-panelmenu-item-link.router-link-exact-active .p-panelmenu-item-icon) {
    background: color-mix(in srgb, var(--primary-color) 18%, var(--surface-card));
    color: var(--primary-color);
}

.app-nav-panelmenu :deep(.p-panelmenu-item.p-focus > .p-panelmenu-item-content) {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 35%, transparent);
    border-radius: 10px;
}

@media screen and (min-width: 768px) {
    .mobile-topbar-actions {
        display: none;
    }
}

.mobile-topbar-actions {
    padding: 1rem 0.35rem;
    border-top: 1px solid var(--surface-border);
    margin-top: 0.75rem;
}

.mobile-upgrade-button {
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
    font-weight: 600;
    cursor: pointer;
    color: var(--primary-contrast-color, #ffffff);
    background: linear-gradient(
        135deg,
        var(--primary-color) 0%,
        color-mix(in srgb, var(--primary-color) 72%, #1e1b4b) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    box-shadow: 0 4px 14px color-mix(in srgb, var(--primary-color) 35%, transparent);

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px color-mix(in srgb, var(--primary-color) 45%, transparent);
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
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 8px;
    font-weight: 500;
    cursor: pointer;
    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;

    &:hover {
        background: var(--surface-hover);
        border-color: color-mix(in srgb, var(--primary-color) 35%, var(--surface-border));
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

.menu-separator {
    height: 1px;
    background: var(--surface-border);
    margin: 1rem 0;
}
</style>
