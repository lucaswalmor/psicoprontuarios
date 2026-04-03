<script>
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import logo from '@/assets/img/no-bg.webp';
import authService from '@/services/authService';

export default {
    name: 'PrimeiraAssinaturaLayout',
    components: {
        Button,
        Toast
    },
    data() {
        return {
            logo
        };
    },
    methods: {
        async sair() {
            await authService.sair();
            this.$router.push('/login');
        }
    }
};
</script>

<template>
    <div class="primeira-assinatura-layout min-h-screen surface-ground">
        <header
            class="flex align-items-center justify-content-between px-3 md:px-4 py-3 surface-card border-bottom-1 surface-border shadow-1"
        >
            <div class="flex align-items-center gap-2">
                <img :src="logo" alt="PsicoProntuários" class="w-3rem h-3rem" />
                <div class="flex flex-column">
                    <span class="font-semibold text-lg text-color">PsicoProntuários</span>
                    <span class="text-sm text-color-secondary hidden sm:inline">Ative seu plano para acessar o sistema</span>
                </div>
            </div>
            <Button label="Sair" icon="pi pi-sign-out" severity="secondary" outlined @click="sair" />
        </header>
        <main class="w-full">
            <router-view />
        </main>
        <Toast />
    </div>
</template>

<style scoped>
.primeira-assinatura-layout {
    display: flex;
    flex-direction: column;
}
</style>
