<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/store/plan';
import Button from 'primevue/button';

const router = useRouter();
const planStore = usePlanStore();

const visible = computed(() => planStore.previewAtivo === true);

const diasRestantes = computed(() => {
    const raw = planStore.previewExpiraEm;
    if (!raw) return null;
    const expira = new Date(raw);
    const diffMs = expira.getTime() - Date.now();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

const tituloPrazo = computed(() => {
    if (diasRestantes.value === null) return 'Período de exploração ativo';
    if (diasRestantes.value === 0) return 'Exploração encerra hoje';
    if (diasRestantes.value === 1) return '1 dia restante';
    return `${diasRestantes.value} dias restantes`;
});

const subtitulo = computed(() => {
    if (planStore.previewPacientesUsados >= 1) {
        return 'Ative um plano para continuar sem interrupções.';
    }
    return `Até ${planStore.previewMaxPacientes} pacientes no preview. Escolha Simples ou Pro quando quiser.`;
});

function irParaPlanos() {
    router.push('/upgrade');
}
</script>

<template>
    <div v-if="visible" class="sidebar-preview-cta">
        <div class="sidebar-preview-cta__badge">
            <i class="pi pi-sparkles" aria-hidden="true" />
            <span>Exploração gratuita</span>
        </div>
        <p class="sidebar-preview-cta__title">{{ tituloPrazo }}</p>
        <p class="sidebar-preview-cta__text">{{ subtitulo }}</p>
        <Button
            label="Ver planos"
            icon="pi pi-arrow-right"
            icon-pos="right"
            class="sidebar-preview-cta__btn w-full"
            @click="irParaPlanos"
        />
    </div>
</template>

<style scoped>
.sidebar-preview-cta {
    padding: 0.85rem;
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--primary-color) 28%, var(--surface-border));
    background:
        radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 55%),
        var(--surface-card);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--primary-color) 10%, transparent);
}

.sidebar-preview-cta__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-color) 12%, var(--surface-ground));
    color: var(--primary-color);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

.sidebar-preview-cta__title {
    margin: 0 0 0.35rem;
    font-size: 0.92rem;
    font-weight: 700;
    line-height: 1.35;
    color: var(--text-color);
}

.sidebar-preview-cta__text {
    margin: 0 0 0.75rem;
    font-size: 0.78rem;
    line-height: 1.45;
    color: var(--text-color-secondary);
}

.sidebar-preview-cta__btn {
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    border-radius: 9px !important;
}
</style>
