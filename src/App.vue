<script setup>
import { onMounted, nextTick } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { loadThemeConfig } from '@/utils/themeStorage';
import LoadingGlobal from '@/components/LoadingGlobal.vue';

const { applyCompleteTheme } = useLayout();

onMounted(async () => {
    // Aguardar o próximo tick para garantir que tudo esteja montado
    await nextTick();

    // Aplicar tema completo após o app estar montado
    const config = loadThemeConfig();
    if (config) {
        applyCompleteTheme(config);
    }

    const theme = localStorage.getItem('theme');
    const sakai = {
        "preset": "Aura",
        "primary": "noir",
        "surface": "zinc",
        "darkTheme": true,
        "menuMode": "static"
    }

    if (!theme) {
        localStorage.setItem('theme', 'dark');
        localStorage.setItem('sakai-theme-config', JSON.stringify(sakai));
    }
});
</script>

<template>
    <router-view />
    <LoadingGlobal />
</template>

<style scoped></style>
