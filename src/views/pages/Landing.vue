<script setup lang="ts">
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import HeroWidget from '@/components/landing/HeroWidget.vue';
import HighlightsWidget from '@/components/landing/HighlightsWidget.vue';
import PricingWidget from '@/components/landing/PricingWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import LeadsWidget from '@/components/landing/LeadsWidget.vue';
import TestimonialsWidget from '@/components/landing/TestimonialsWidget.vue';
import ChatAtendimento from '@/components/ChatAtendimento.vue';
import { getN8nChatWebhookUrl } from '@/config/environment.js';
import { registrarLandingViewUmaVez } from '@/services/marketingLogService.js';
import { onMounted } from 'vue';

const n8nChatWebhookUrl = getN8nChatWebhookUrl();

// SEO Meta tags
const updateMetaTags = () => {
    // Título da página
    document.title =
        'PsicoProntuários — Prontuário, agenda e financeiro para psicólogos';

    const descContent =
        'Software para psicólogos: prontuário digital, agenda, financeiro da consulta, anexos, indicadores de evolução (GAD-7, PHQ-9) e rotinas no WhatsApp. Teste grátis por 7 dias.';

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', descContent);
    } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = descContent;
        document.head.appendChild(newMeta);
    }

    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute(
            'content',
            'prontuário psicológico, software psicólogo, agenda consultório, gestão consultório psicologia, LGPD prontuário, financeiro psicólogo, GAD-7, PHQ-9, WhatsApp psicólogo'
        );
    } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'keywords';
        newMeta.content =
            'prontuário psicológico, software psicólogo, agenda consultório, gestão consultório psicologia, LGPD prontuário, financeiro psicólogo, GAD-7, PHQ-9, WhatsApp psicólogo';
        document.head.appendChild(newMeta);
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute(
            'content',
            'PsicoProntuários — Prontuário, agenda e financeiro para psicólogos'
        );
    } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', 'og:title');
        newMeta.content = 'PsicoProntuários — Prontuário, agenda e financeiro para psicólogos';
        document.head.appendChild(newMeta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', descContent);
    } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', 'og:description');
        newMeta.content = descContent;
        document.head.appendChild(newMeta);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
        ogType.setAttribute('content', 'website');
    } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', 'og:type');
        newMeta.content = 'website';
        document.head.appendChild(newMeta);
    }

    // Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) {
        twitterCard.setAttribute('content', 'summary_large_image');
    } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'twitter:card';
        newMeta.content = 'summary_large_image';
        document.head.appendChild(newMeta);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute(
            'content',
            'PsicoProntuários — Prontuário, agenda e financeiro para psicólogos'
        );
    } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'twitter:title';
        newMeta.content = 'PsicoProntuários — Prontuário, agenda e financeiro para psicólogos';
        document.head.appendChild(newMeta);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', descContent);
    } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'twitter:description';
        newMeta.content = descContent;
        document.head.appendChild(newMeta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.setAttribute('href', window.location.href);
    } else {
        const newLink = document.createElement('link');
        newLink.rel = 'canonical';
        newLink.href = window.location.href;
        document.head.appendChild(newLink);
    }

    // Structured Data (evita duplicar em re-mount)
    const prevLd = document.getElementById('ld-json-landing');
    if (prevLd) {
        prevLd.remove();
    }

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'PsicoProntuários',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: descContent,
        url: window.location.origin,
        offers: {
            '@type': 'Offer',
            price: '29.90',
            priceCurrency: 'BRL',
            description: 'Plano Simples com 7 dias de teste grátis (valores sujeitos à confirmação no cadastro).'
        }
    };

    const script = document.createElement('script');
    script.id = 'ld-json-landing';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
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
            <section id="hero" class="relative overflow-hidden" aria-label="Seção principal">
                <HeroWidget />
            </section>

            <!-- Features Section -->
            <section id="features" class="py-16 lg:py-24 bg-surface-50 dark:bg-surface-800" aria-label="Recursos da plataforma">
                <div class="container mx-auto px-4">
                    <FeaturesWidget />
                </div>
            </section>

            <!-- Highlights Section -->
            <section id="highlights" class="py-16 lg:py-24 bg-surface-50 dark:bg-surface-800" aria-label="Destaques da plataforma">
                <div class="container-fluid mx-auto px-4">
                    <HighlightsWidget />
                </div>
            </section>

            <!-- Pricing Section -->
            <section id="pricing" class="py-16 lg:py-24" aria-label="Planos e preços">
                <div class="container mx-auto px-4">
                    <PricingWidget />
                </div>
            </section>

            <!-- Testimonials Section -->
            <section id="testimonials" class="bg-surface-50 dark:bg-surface-800" aria-label="Depoimentos de clientes">
                <TestimonialsWidget />
            </section>

            <!-- Leads Section -->
            <section id="leads" class="py-16 lg:py-24" aria-label="Formulário de contato">
                <LeadsWidget />
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
