<template>
    <div class="pricing-section">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Planos para sua clínica
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Teste grátis por 7 dias em qualquer plano. Depois, valor fixo mensal — sem surpresas na fatura.
            </p>
        </div>

        <div class="row justify-content-center g-4">
            <div class="col-lg-6 col-xl-5">
                <div class="pricing-card h-100">
                    <div class="featured-badge badge-simples">Plano Simples</div>
                    <div class="card-header">
                        <h3 class="plan-title">Simples</h3>
                        <div class="plan-icon-wrapper">
                            <i class="pi pi-star text-4xl text-primary-500"></i>
                        </div>
                    </div>

                    <div class="price-section">
                        <div class="price">
                            <span class="currency">R$</span>
                            <span class="amount">29</span>
                            <span class="period">,90/mês</span>
                        </div>
                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-2">
                            7 dias de teste grátis para conhecer o sistema
                        </p>
                        <p class="text-sm text-surface-500 dark:text-surface-400">
                            Tudo o essencial para organizar atendimento, prontuário e finanças.
                        </p>
                    </div>

                    <Divider class="divider" />

                    <ul class="features-list">
                        <li v-for="(texto, idx) in featuresSimples" :key="'s-' + idx" class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>{{ texto }}</span>
                        </li>
                    </ul>

                    <div class="mt-auto pt-6">
                        <Button
                            label="Começar teste grátis"
                            class="cta-button"
                            @click="$router.push('/cadastro')"
                        />
                    </div>
                </div>
            </div>

            <div class="col-lg-6 col-xl-5">
                <div class="pricing-card featured h-100">
                    <div class="featured-badge badge-pro">Plano Pro</div>
                    <div class="card-header">
                        <h3 class="plan-title">Pro</h3>
                        <div class="plan-icon-wrapper">
                            <i class="pi pi-bolt text-4xl text-primary-500"></i>
                        </div>
                    </div>

                    <div class="price-section">
                        <div class="price">
                            <span class="currency">R$</span>
                            <span class="amount">49</span>
                            <span class="period">,90/mês</span>
                        </div>
                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-2">
                            7 dias de teste grátis — inclui IA, landing page e WhatsApp avançado
                        </p>
                        <p class="text-sm text-surface-500 dark:text-surface-400">
                            Tudo do Simples, mais recursos de IA, página pública e automações.
                        </p>
                    </div>

                    <Divider class="divider" />

                    <ul class="features-list">
                        <li v-for="(texto, idx) in featuresPro" :key="'p-' + idx" class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>{{ texto }}</span>
                        </li>
                    </ul>

                    <div class="mt-auto pt-6">
                        <Button
                            label="Começar teste grátis"
                            class="cta-button featured"
                            @click="$router.push('/cadastro')"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-12">
            <p class="text-surface-600 dark:text-surface-300 mb-2">
                Cancele quando quiser, conforme as regras do seu contrato de uso.
            </p>
            <p class="text-sm text-surface-500 dark:text-surface-400">
                Valor referente ao plano atual do catálogo — confira sempre os valores na tela de assinatura ao finalizar o cadastro.
            </p>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import Divider from 'primevue/divider';

export default {
    name: 'PricingWidget',
    components: {
        Button,
        Divider
    },
    data() {
        return {
            featuresSimples: [
                'Dashboard Geral',
                'Dashboard Financeiro',
                'Prontuários com histórico e PDF',
                'Agendamento de Sessões',
                'Controle Financeiro',
                'Anamnese e Anexos',
                'Indicadores de evolução (humor, GAD-7, PHQ-9)'
            ],
            featuresPro: [
                'Dashboard Geral',
                'Dashboard Financeiro',
                'Prontuários com histórico e PDF',
                'Agendamento de Sessões',
                'Controle Financeiro',
                'Anamnese e Anexos',
                'Indicadores de evolução (humor, GAD-7, PHQ-9)',
                'Landing page gratuita',
                'Melhoria de texto com I.A no prontuário',
                'Gerar relatório profissional com I.A nos prontuários',
                'Notificações de aniversários e datas comemorativas por WhatsApp',
                'WhatsApp: rotinas e automações no fluxo clínico',
            ]
        };
    }
};
</script>

<style scoped>
.pricing-section {
    padding: 2rem 0;
}

.pricing-card {
    @apply bg-surface-0 dark:bg-surface-900 rounded-3xl p-8 border-2 border-surface-200 dark:border-surface-700 transition-all duration-300 hover:shadow-2xl relative;
    display: flex;
    flex-direction: column;
}

.pricing-card.featured {
    @apply border-primary shadow-xl;
}

.featured-badge {
    @apply absolute -top-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r;
}

.featured-badge.badge-simples {
    @apply from-slate-600 to-slate-800;
}

.featured-badge.badge-pro {
    @apply from-purple-600 to-pink-600;
}

.card-header {
    @apply text-center mb-8;
    flex-shrink: 0;
}

.plan-title {
    @apply text-2xl font-bold text-surface-900 dark:text-surface-0 mb-4;
}

.plan-icon-wrapper {
    @apply w-24 h-24 mx-auto flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-full;
}

.price-section {
    @apply text-center mb-8;
    flex-shrink: 0;
}

.price {
    @apply flex items-center justify-center gap-2 mb-4;
}

.currency {
    @apply text-2xl text-surface-600 dark:text-surface-300;
}

.amount {
    @apply text-5xl font-bold text-surface-900 dark:text-surface-0;
}

.period {
    @apply text-lg text-surface-600 dark:text-surface-300;
}

.cta-button {
    @apply w-full !py-3 !text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl;
}

.cta-button.featured {
    @apply bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700;
}

.divider {
    @apply my-8 bg-surface-200 dark:bg-surface-700;
    flex-shrink: 0;
}

.features-list {
    @apply space-y-4;
    flex-grow: 1;
}

.feature-item {
    @apply flex items-center gap-3 text-surface-700 dark:text-surface-200;
}

.feature-item i {
    @apply text-lg;
}

@media (max-width: 768px) {
    .pricing-section {
        padding: 1rem 0;
    }

    .pricing-card {
        @apply p-6;
    }

    .amount {
        @apply text-4xl;
    }
}
</style>
