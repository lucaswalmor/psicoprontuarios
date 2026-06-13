<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/store/plan';
import Button from 'primevue/button';

const router = useRouter();
const planStore = usePlanStore();
const dismissedSession = ref(sessionStorage.getItem('preview_banner_dismissed') === '1');

const visible = computed(() => planStore.mostrarUiPreview && !dismissedSession.value);
const diasRestantes = computed(() => {
    const raw = planStore.previewExpiraEm;
    if (!raw) return null;
    const expira = new Date(raw);
    const diffMs = expira.getTime() - Date.now();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

const mensagem = computed(() => {
    if (planStore.previewPacientesUsados >= 1) {
        return 'Você já começou a usar o sistema. Ative seu plano para continuar sem interrupções.';
    }
    if (diasRestantes.value !== null && diasRestantes.value <= 1) {
        return 'Seu período de exploração termina em breve. Ative seu plano para manter o acesso.';
    }
    return 'Explore o PsicoProntuários à vontade. Quando quiser, escolha um plano e ative sua conta.';
});

watch(
    () => planStore.mostrarPromptAtivacao,
    (value) => {
        if (value) {
            dismissedSession.value = false;
            sessionStorage.removeItem('preview_banner_dismissed');
        }
    }
);

function irParaAtivacao() {
    router.push('/upgrade');
}

function continuarExplorando() {
    dismissedSession.value = true;
    sessionStorage.setItem('preview_banner_dismissed', '1');
}
</script>

<template>
    <div
        v-if="visible"
        class="preview-activation-banner surface-card border-1 surface-border border-round-lg p-3 mb-3 shadow-1"
    >
        <div class="flex flex-column md:flex-row md:align-items-center justify-content-between gap-3">
            <div class="flex align-items-start gap-3">
                <i class="pi pi-gift text-primary text-2xl mt-1"></i>
                <div>
                    <p class="font-semibold text-color m-0 mb-1">Ative seu plano</p>
                    <p class="text-sm text-color-secondary m-0 line-height-3">{{ mensagem }}</p>
                    <p v-if="diasRestantes !== null" class="text-xs text-color-secondary mt-2 mb-0">
                        Exploração gratuita: {{ diasRestantes }} dia(s) restante(s)
                        · até {{ planStore.previewMaxPacientes }} pacientes
                    </p>
                </div>
            </div>
            <div class="flex flex-wrap gap-2 flex-shrink-0">
                <Button label="Continuar explorando" severity="secondary" outlined @click="continuarExplorando" />
                <Button label="Ativar plano" icon="pi pi-credit-card" @click="irParaAtivacao" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview-activation-banner {
    border-left: 4px solid var(--primary-color);
}
</style>
