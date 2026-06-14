<script setup>
import { useRouter } from 'vue-router';
import dashboardLight from '@/assets/prints_psicoprontuarios/light-web/dashboard-geral.png';
import dashboardDark from '@/assets/prints_psicoprontuarios/dark-web/dashboard-geral.png';
import { registrarMarketingLog, irParaCadastroComUtms } from '@/services/marketingLogService.js';
import { trackStartTrialClick } from '@/utils/metaPixel';

const router = useRouter();

const irParaCadastro = () => {
    trackStartTrialClick('hero');
    registrarMarketingLog('teste_gratis_click', { placement: 'hero' });
    irParaCadastroComUtms(router);
};

const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};
</script>

<template>
    <div class="hero-section relative min-h-screen flex items-center">
        <!-- Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-surface-800 dark:via-surface-900 dark:to-surface-800"></div>
        
        <!-- Content Container -->
        <div class="hero-container py-16 lg:py-24 relative z-10">
            <div class="hero-layout">
                <!-- Hero Preview - Primeiro em mobile, segundo em desktop -->
                <div class="hero-layout__media">
                    <div class="hero-preview relative w-full">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                        <div class="browser-frame relative">
                            <div class="browser-bar">
                                <span class="browser-dot dot-red"></span>
                                <span class="browser-dot dot-yellow"></span>
                                <span class="browser-dot dot-green"></span>
                                <span class="browser-url">psicoprontuarios.com.br</span>
                            </div>
                            <div class="browser-body">
                                <img
                                    :src="dashboardLight"
                                    alt="Dashboard do PsicoProntuários — tema claro"
                                    class="screen-img dark:hidden"
                                    fetchpriority="high"
                                />
                                <img
                                    :src="dashboardDark"
                                    alt="Dashboard do PsicoProntuários — tema escuro"
                                    class="screen-img hidden dark:block"
                                    fetchpriority="high"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Text Content - Segundo em mobile, primeiro em desktop -->
                <div class="hero-layout__content text-center lg:text-left space-y-8">
                    <div class="space-y-4">
                        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            <span class="block">Sistema para Psicólogos</span>
                            <span class="block">Prontuário Eletrônico, Agenda Online e Financeiro</span>
                        </h1>
                        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-light text-surface-600 dark:text-surface-300 leading-tight">
                            Seu consultório organizado em um só lugar
                        </h2>
                        <p class="text-lg md:text-xl lg:text-2xl text-surface-700 dark:text-surface-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Menos planilha e mais clínica: prontuário, agenda, financeiro e rotinas no WhatsApp para você focar no atendimento.
                        </p>
                    </div>
                    
                    <!-- CTA Buttons -->
                    <div class="space-y-3">
                        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button 
                                label="Testar grátis por 7 dias" 
                                rounded 
                                class="!text-lg !px-8 !py-3 bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                @click="irParaCadastro"
                            />
                            <Button 
                                label="Nossos Planos" 
                                text 
                                rounded 
                                class="!text-lg !px-8 !py-3 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800"
                                @click="scrollToPricing"
                            />
                        </div>
                        <p class="text-sm text-surface-500 dark:text-surface-400 text-center lg:text-left">
                            Cancele durante o teste e não pague nada.
                        </p>
                    </div>
                    
                    <!-- Trust Indicators -->
                    <div class="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-shield text-green-500 text-xl"></i>
                            <span class="text-sm text-surface-600 dark:text-surface-300">Adequação à LGPD</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-check-circle text-blue-500 text-xl"></i>
                            <span class="text-sm text-surface-600 dark:text-surface-300">Cancele quando quiser</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-clock text-orange-500 text-xl"></i>
                            <span class="text-sm text-surface-600 dark:text-surface-300">Setup em 5 min</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Floating Elements -->
        <div class="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
    </div>
</template>

<style scoped>
.hero-section {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
}

.hero-container {
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
    padding-inline: 1rem;
}

.hero-layout {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: center;
}

.hero-layout__media {
    order: 2;
    min-width: 0;
    width: 100%;
    display: flex;
    justify-content: center;
}

.hero-layout__content {
    order: 1;
    min-width: 0;
}

.hero-preview {
    min-width: 0;
    width: 100%;
}

.browser-frame {
    @apply overflow-hidden shadow-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900;
    width: 100%;
    border-radius: 12px;
}

.browser-bar {
    @apply flex items-center gap-2 px-4 py-3 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700;
}

.browser-dot {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
}

.dot-red { background: #f87171; }
.dot-yellow { background: #fbbf24; }
.dot-green { background: #34d399; }

.browser-url {
    @apply ml-3 px-4 py-1 rounded-full bg-surface-0 dark:bg-surface-900 text-xs text-surface-500 dark:text-surface-400;
}

.browser-body {
    aspect-ratio: 1024 / 486;
    background: var(--surface-100);
}

.screen-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

@media (min-width: 992px) {
    .hero-container {
        padding-inline: 2rem;
        max-width: 1280px;
    }

    .hero-layout {
        display: grid;
        grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
        gap: clamp(1.5rem, 2.5vw, 3rem);
        align-items: center;
    }

    .hero-layout__media {
        justify-content: stretch;
        overflow: visible;
    }

    .hero-preview {
        width: 100%;
        overflow: visible;
    }

    .browser-frame {
        border-radius: 1rem;
        transform: scale(1.05);
        transform-origin: center left;
    }
}

@media (min-width: 1280px) {
    .hero-container {
        max-width: 1360px;
    }

    .hero-layout {
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    }

    .browser-frame {
        transform: scale(1.08);
    }
}

@media (min-width: 1920px) {
    .hero-container {
        max-width: 1440px;
        padding-inline: 3rem;
    }

    .browser-frame {
        transform: scale(1.1);
    }
}

@media (max-width: 1024px) {
    .hero-section {
        min-height: auto;
        padding: 4rem 0;
    }
}
</style>
