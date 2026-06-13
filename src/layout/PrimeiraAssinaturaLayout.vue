<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import logo from '@/assets/img/logo.webp';
import authService from '@/services/authService';
import { usePlanStore } from '@/store/plan';
import { usuarioPodeSairDaUpgrade } from '@/router/authInactiveGuard';

const router = useRouter();
const planStore = usePlanStore();

const podeVoltarAoSistema = computed(() => usuarioPodeSairDaUpgrade());

const subtituloHeader = computed(() => {
    const stat = planStore.statusAssinatura || localStorage.getItem('statusAssinatura') || '';
    if (stat !== 'sem_assinatura') {
        return 'Escolha o plano ideal para sua clínica';
    }
    if (planStore.precisaAtivarPlano && !planStore.previewAtivo) {
        return 'Ative seu plano para continuar usando o sistema';
    }
    return 'Explore o sistema ou ative seu plano quando quiser';
});

function voltarAoSistema() {
    router.push('/dashboard');
}

async function sair() {
    await authService.sair();
    window.location.href = '/login';
}
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
                    <span class="text-sm text-color-secondary hidden sm:inline">{{ subtituloHeader }}</span>
                </div>
            </div>
            <div class="flex align-items-center gap-2">
                <Button
                    v-if="podeVoltarAoSistema"
                    label="Voltar ao sistema"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    text
                    class="hidden sm:inline-flex"
                    @click="voltarAoSistema"
                />
                <Button
                    v-if="podeVoltarAoSistema"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    text
                    aria-label="Voltar ao sistema"
                    class="inline-flex sm:hidden"
                    @click="voltarAoSistema"
                />
                <Button label="Sair" icon="pi pi-sign-out" severity="secondary" outlined @click="sair" />
            </div>
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
