<template>
    <aside class="layout-sidebar app-sidebar" aria-label="Navegação principal">
        <div class="app-sidebar__accent" aria-hidden="true" />
        <div class="app-sidebar__inner">
            <div class="app-sidebar__menu">
                <app-menu />
            </div>
            <SidebarPreviewCta class="app-sidebar__cta" />
        </div>
    </aside>
</template>

<script>
import AppMenu from './AppMenu.vue';
import SidebarPreviewCta from '@/components/preview/SidebarPreviewCta.vue';

export default {
    name: 'AppSidebar',
    components: {
        AppMenu,
        SidebarPreviewCta
    }
};
</script>

<style lang="scss" scoped>
.app-sidebar {
    display: flex;
}

.app-sidebar__accent {
    flex: 0 0 3px;
    width: 3px;
    align-self: stretch;
    margin: 0.5rem 0 0.5rem 0.35rem;
    border-radius: 999px;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--primary-color) 85%, transparent) 0%,
        var(--primary-color) 45%,
        color-mix(in srgb, var(--primary-color) 55%, var(--surface-border)) 100%
    );
}

.app-sidebar__inner {
    flex: 1;
    min-width: 0;
    min-height: calc(100vh - 9.5rem);
    padding: 0.15rem 0.15rem 0.15rem 0.35rem;
    display: flex;
    flex-direction: column;
}

.app-sidebar__menu {
    flex: 1 1 auto;
    min-height: 0;
}

.app-sidebar__cta {
    flex: 0 0 auto;
    margin-top: auto;
    padding: 0.65rem 0.15rem 0.25rem;
}
</style>
