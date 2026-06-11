<script setup>
import { useRouter } from 'vue-router';
import { registrarMarketingLog } from '@/services/marketingLogService.js';
import { trackStartTrialClick } from '@/utils/metaPixel';

const router = useRouter();

function irParaCadastro() {
    trackStartTrialClick('cta_final');
    registrarMarketingLog('teste_gratis_click', { placement: 'cta_final' });
    router.push('/cadastro');
}
</script>

<template>
    <div class="cta-final-section">
        <div class="cta-card">
            <h2 class="cta-title">Pronto para organizar seu consultório?</h2>
            <p class="cta-subtitle">
                Prontuário, agenda, financeiro e WhatsApp em um só lugar. Comece agora — leva menos de 5 minutos.
            </p>
            <div class="cta-actions">
                <Button
                    label="Testar grátis por 7 dias"
                    rounded
                    class="cta-button"
                    @click="irParaCadastro"
                />
            </div>
            <p class="cta-disclaimer">Cancele durante o teste e não pague nada.</p>
        </div>
    </div>
</template>

<style scoped>
.cta-final-section {
    padding: 2rem 0;
}

.cta-card {
    @apply max-w-4xl mx-auto text-center rounded-3xl px-8 py-14 shadow-2xl;
    background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
}

.cta-title {
    @apply text-3xl md:text-4xl font-bold text-white mb-4;
}

.cta-subtitle {
    @apply text-lg md:text-xl mb-8 max-w-2xl mx-auto;
    color: rgba(255, 255, 255, 0.85);
}

.cta-actions {
    @apply flex justify-center;
}

.cta-button {
    @apply !text-lg !px-10 !py-3 font-semibold border-0 shadow-lg hover:shadow-xl transition-all duration-300;
    background: #ffffff !important;
    color: #6d28d9 !important;
}

.cta-button:hover {
    background: #f3f0ff !important;
}

.cta-disclaimer {
    @apply mt-4 text-sm;
    color: rgba(255, 255, 255, 0.7);
}
</style>
