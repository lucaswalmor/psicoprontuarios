<script>
import { useLayout } from '@/layout/composables/layout';

export default {
    name: 'AppMenuItem',
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            default: 0
        },
        root: {
            type: Boolean,
            default: true
        },
        parentItemKey: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            layoutState: null,
            setActiveMenuItem: null,
            toggleMenu: null,
            isActiveMenu: false,
            itemKey: null
        };
    },
    created() {
        const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();
        this.layoutState = layoutState;
        this.setActiveMenuItem = setActiveMenuItem;
        this.toggleMenu = toggleMenu;
    },
    beforeMount() {
        this.itemKey = this.parentItemKey ? this.parentItemKey + '-' + this.index : String(this.index);
        const activeItem = this.layoutState.activeMenuItem;
        this.isActiveMenu = activeItem === this.itemKey || (activeItem ? activeItem.startsWith(this.itemKey + '-') : false);
    },
    watch: {
        'layoutState.activeMenuItem'(newVal) {
            this.isActiveMenu = newVal === this.itemKey || newVal.startsWith(this.itemKey + '-');
        }
    },
    methods: {
        itemClick(event, item) {
            this.$router.push(item.to);
        },
        checkActiveRoute(item) {
            return this.$route.path === item.to;
        }
    }
};
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>
        <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </router-link>
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped></style>
