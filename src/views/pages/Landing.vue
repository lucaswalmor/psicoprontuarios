<script setup lang="ts">
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import HeroWidget from '@/components/landing/HeroWidget.vue';
import ShowcaseWidget from '@/components/landing/ShowcaseWidget.vue';
import ComoFuncionaWidget from '@/components/landing/ComoFuncionaWidget.vue';
import FaqWidget from '@/components/landing/FaqWidget.vue';
import CtaFinalWidget from '@/components/landing/CtaFinalWidget.vue';
import PricingWidget from '@/components/landing/PricingWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import LeadsWidget from '@/components/landing/LeadsWidget.vue';
import ChatAtendimento from '@/components/ChatAtendimento.vue';
import { getN8nChatWebhookUrl } from '@/config/environment.js';
import { registrarLandingViewUmaVez } from '@/services/marketingLogService.js';
import { onMounted } from 'vue';

const n8nChatWebhookUrl = getN8nChatWebhookUrl();

// SEO: as meta tags estáticas (title, description, OG, Twitter, JSON-LD)
// ficam no index.html para serem visíveis a crawlers sem execução de JS.
// Aqui só garantimos o title ao navegar de volta para a landing via SPA.
const updateMetaTags = () => {
    document.title =
        'Sistema para Psicólogos | PsicoProntuários - Prontuário Eletrônico, Agenda e Financeiro';
        // 'PsicoProntuários — Prontuário, agenda e financeiro para psicólogos';
};

onMounted(() => {
    updateMetaTags();
    registrarLandingViewUmaVez();
});
</script>

<template>
    <div class="landing-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <!-- Header/Navigation -->
        <header class="sticky top-0 z-50 bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700" role="banner">
            <div class="container mx-auto px-4">
                <TopbarWidget />
            </div>
        </header>

        <!-- Main Content -->
        <main class="container-fluid" role="main">
            <!-- Hero Section -->
            <section id="hero" class="relative overflow-x-clip lg:overflow-visible" aria-label="Seção principal">
                <HeroWidget />
            </section>

            <!-- Features Section -->
            <section id="features" class="py-16 lg:py-24 bg-surface-50 dark:bg-surface-800" aria-label="Recursos da plataforma">
                <div class="container mx-auto px-4">
                    <FeaturesWidget />
                </div>
            </section>

            <!-- Showcase Section (telas reais do sistema) -->
            <section id="highlights" class="py-16 lg:py-24" aria-label="Telas do sistema">
                <div class="container mx-auto px-4">
                    <ShowcaseWidget />
                </div>
            </section>

            <!-- Como Funciona Section -->
            <section id="como-funciona" class="py-16 lg:py-24 bg-surface-50 dark:bg-surface-800" aria-label="Como funciona">
                <div class="container mx-auto px-4">
                    <ComoFuncionaWidget />
                </div>
            </section>

            <!-- Pricing Section -->
            <section id="pricing" class="py-16 lg:py-24" aria-label="Planos e preços">
                <div class="container mx-auto px-4">
                    <PricingWidget />
                </div>
            </section>

            <!-- FAQ Section -->
            <section id="faq" class="py-16 lg:py-24 bg-surface-50 dark:bg-surface-800" aria-label="Perguntas frequentes">
                <div class="container mx-auto px-4">
                    <FaqWidget />
                </div>
            </section>

            <!-- Leads Section -->
            <section id="leads" class="py-16 lg:py-24" aria-label="Formulário de contato">
                <LeadsWidget />
            </section>

            <!-- CTA Final Section -->
            <section id="cta-final" class="pb-16 lg:pb-24 px-4" aria-label="Comece agora">
                <CtaFinalWidget />
            </section>
        </main>

        <!-- Footer -->
        <footer class="bg-surface-100 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700" role="contentinfo">
            <div class="container mx-auto px-4">
                <FooterWidget />
            </div>
        </footer>

        <ChatAtendimento :webhook-url="n8nChatWebhookUrl" />
    </div>
</template>

<style scoped>
.landing-page {
    font-family:
        'Inter',
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
}

.landing-wrapper {
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
}

/* Smooth scrolling for anchor links */
html {
    scroll-behavior: smooth;
}

/* Responsive container adjustments */
@media (max-width: 768px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .container {
        padding-left: 2rem;
        padding-right: 2rem;
    }
}

@media (min-width: 1025px) {
    .container {
        padding-left: 3rem;
        padding-right: 3rem;
    }
}
</style>
