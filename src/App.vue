<script setup>
import { onMounted, nextTick } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { loadThemeConfig } from '@/utils/themeStorage';
import LoadingGlobal from '@/components/LoadingGlobal.vue';

const { applyCompleteTheme } = useLayout();

// Função para definir tema padrão
const setDefaultTheme = () => {
    const theme = localStorage.getItem('theme');
    const sakaiConfig = localStorage.getItem('sakai-theme-config');
    
    // Configuração padrão do tema
    const defaultSakai = {
        "preset": "Aura",
        "primary": "noir",
        "surface": "zinc",
        "darkTheme": true,
        "menuMode": "static"
    };

    // Se não existe tema definido, definir o padrão
    if (!theme) {
        localStorage.setItem('theme', 'dark');
        console.log('🎨 Tema padrão definido: dark');
    }
    
    // Se não existe configuração do Sakai, definir o padrão
    if (!sakaiConfig) {
        localStorage.setItem('sakai-theme-config', JSON.stringify(defaultSakai));
        console.log('⚙️ Configuração Sakai padrão definida');
    }
};

// Definir tema padrão imediatamente
setDefaultTheme();

onMounted(async () => {
    // Aguardar o próximo tick para garantir que tudo esteja montado
    await nextTick();

    // Aplicar tema completo após o app estar montado
    const config = loadThemeConfig();
    if (config) {
        applyCompleteTheme(config);
    }
});
</script>

<template>
    <router-view />
    <LoadingGlobal />
</template>

<style scoped></style>
