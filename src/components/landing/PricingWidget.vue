<template>
    <div class="pricing-section">
        <!-- Header -->
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Planos Acessíveis
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Escolha o plano ideal para sua prática e comece a gerenciar seus pacientes hoje mesmo
            </p>
        </div>

        <!-- Pricing Cards -->
        <div class="row g-4 justify-content-center">
            <!-- Plano Gratuito -->
            <div class="col-lg-4">
                <div class="pricing-card h-100">
                    <div class="card-header">
                        <h3 class="plan-title">Gratuito</h3>
                        <div class="plan-icon-wrapper">
                            <i class="pi pi-user text-4xl text-surface-400"></i>
                        </div>
                    </div>
                    
                    <div class="price-section">
                        <div class="price">
                            <span class="currency">R$</span>
                            <span class="amount">0</span>
                            <span class="period">/mês</span>
                        </div>
                        <p class="text-sm text-surface-500 dark:text-surface-400">Ideal para começar sua prática</p>
                    </div>
                    
                    <Divider class="divider" />
                    
                    <ul class="features-list">
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Até 5 pacientes</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Agendamentos</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Suporte por email</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Prontuários PDF</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Prontuários ilimitados</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-times text-red-500"></i>
                            <span class="text-surface-500">Anexos de arquivos</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-times text-red-500"></i>
                            <span class="text-surface-500">Dashboard</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-times text-red-500"></i>
                            <span class="text-surface-500">Gestão Financeira</span>
                        </li>
                    </ul>

                    <div class="mt-auto pt-6">
                        <Button 
                            label="Começar Grátis" 
                            class="cta-button"
                            @click="$router.push('/cadastro')"
                        />
                    </div>
                </div>
            </div>

            <!-- Plano Essencial -->
            <div class="col-lg-4">
                <div class="pricing-card featured h-100">
                    <div class="featured-badge">Mais Popular</div>
                    <div class="card-header">
                        <h3 class="plan-title">Essencial</h3>
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
                        <p class="text-sm text-surface-500 dark:text-surface-400">Perfeito para psicólogos em crescimento</p>
                    </div>
                    
                    <Divider class="divider" />
                    
                    <ul class="features-list">
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Até 15 pacientes</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Agendamentos</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Até 200 anexos</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Prontuários PDF</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Prontuários ilimitados</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Dashboard</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Suporte por email</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-times text-red-500"></i>
                            <span class="text-surface-500">Gestão Financeira</span>
                        </li>
                    </ul>

                    <div class="mt-auto pt-6">
                        <Button 
                            label="Escolher Essencial" 
                            class="cta-button featured"
                            @click="$router.push('/cadastro')"
                        />
                    </div>
                </div>
            </div>

            <!-- Plano Profissional -->
            <div class="col-lg-4">
                <div class="pricing-card h-100">
                    <div class="card-header">
                        <h3 class="plan-title">Profissional</h3>
                        <div class="plan-icon-wrapper">
                            <i class="pi pi-briefcase text-4xl text-surface-400"></i>
                        </div>
                    </div>
                    
                    <div class="price-section">
                        <div class="price">
                            <span class="currency">R$</span>
                            <span class="amount">59</span>
                            <span class="period">,90/mês</span>
                        </div>
                        <p class="text-sm text-surface-500 dark:text-surface-400">Solução completa para profissionais estabelecidos</p>
                    </div>
                    
                    <Divider class="divider" />
                    
                    <ul class="features-list">
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Até 30 pacientes</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Agendamentos</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Anexos ilimitados</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Prontuários PDF</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Prontuários ilimitados</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Dashboard</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Suporte completo</span>
                        </li>
                        <li class="feature-item">
                            <i class="pi pi-check text-green-500"></i>
                            <span>Gestão Financeira</span>
                        </li>
                    </ul>

                    <div class="mt-auto pt-6">
                        <Button 
                            label="Escolher Profissional" 
                            class="cta-button"
                            @click="$router.push('/cadastro')"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Info -->
        <div class="text-center mt-12">
            <p class="text-surface-600 dark:text-surface-300 mb-4">
                Todos os novos usuários começam no plano gratuito
            </p>
            <p class="text-sm text-surface-500 dark:text-surface-400">
                Faça upgrade quando quiser • Cancele a qualquer momento • Sem taxas ocultas
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
    }
};
</script>

<style scoped>
.pricing-section {
    padding: 2rem 0;
}

.pricing-card {
    @apply bg-surface-0 dark:bg-surface-900 rounded-3xl p-8 border-2 border-surface-200 dark:border-surface-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 relative;
    display: flex;
    flex-direction: column;
}

.pricing-card.featured {
    @apply border-primary shadow-xl scale-105;
}

.featured-badge {
    @apply absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium;
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
    
    .pricing-card.featured {
        @apply scale-100;
    }
    
    .amount {
        @apply text-4xl;
    }
}
</style>
