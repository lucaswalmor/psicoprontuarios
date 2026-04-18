<template>
    <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>
</template>

<script>
import AppMenu from './AppMenu.vue';

export default {
    name: 'AppSidebar',
    components: {
        AppMenu
    },
    mounted() {
    }
};

</script>


<style lang="scss" scoped></style>
