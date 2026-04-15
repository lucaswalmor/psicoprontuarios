<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const features = [
    {
        title: 'Fácil de Usar',
        description: 'Interface intuitiva e moderna para gerenciar seus pacientes sem complicações.',
        icon: 'pi pi-lightbulb',
        colorClass: 'feature-icon--yellow'
    },
    {
        title: 'Prontuários Seguros',
        description: 'Dados clínicos com controle de acesso, sigilo profissional e boas práticas alinhadas à LGPD.',
        icon: 'pi pi-shield',
        colorClass: 'feature-icon--blue'
    },
    {
        title: 'Histórico Completo',
        description: 'Acompanhe todo o histórico de seus pacientes com detalhes e evoluções.',
        icon: 'pi pi-file',
        colorClass: 'feature-icon--indigo'
    },
    {
        title: 'Acesso Multiplataforma',
        description: 'Acesse de qualquer dispositivo, a qualquer hora. Desktop, tablet e mobile.',
        icon: 'pi pi-mobile',
        colorClass: 'feature-icon--slate'
    },
    {
        title: 'Visão da prática',
        description: 'Dashboard, financeiro da consulta e indicadores de evolução (humor, GAD-7, PHQ-9) para decidir com dados.',
        icon: 'pi pi-chart-bar',
        colorClass: 'feature-icon--orange'
    },
    {
        title: 'Agendamento Inteligente',
        description: 'Organize suas consultas e sessões com lembretes automáticos e notificações.',
        icon: 'pi pi-calendar',
        colorClass: 'feature-icon--pink'
    },
    {
        title: 'WhatsApp no fluxo de trabalho',
        description: 'Cadastros, listagens e consultas das principais telas pelo WhatsApp, sem abrir o navegador. Menos cliques, mais tempo com o paciente.',
        icon: 'pi pi-whatsapp',
        colorClass: 'feature-icon--green'
    },
    {
        title: 'Notificações automáticas',
        description: 'Mensagens de aniversário, datas comemorativas e outras rotinas pelo WhatsApp, conforme você configurar.',
        icon: 'pi pi-bell',
        colorClass: 'feature-icon--violet'
    },
    {
        title: 'Privacidade e LGPD',
        description: 'Tratamento de dados pensado para o contexto clínico, com separação por conta e transparência nas finalidades do uso.',
        icon: 'pi pi-eye',
        colorClass: 'feature-icon--purple'
    }
];
</script>

<template>
    <div class="features-section">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Recursos Principais
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Tudo que você precisa para gerenciar seus pacientes de forma eficiente e segura
            </p>
        </div>

        <div class="features-grid-desktop row g-4">
            <div v-for="feature in features" :key="feature.title" class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon" :class="feature.colorClass">
                        <i :class="[feature.icon, 'text-white text-2xl']"></i>
                    </div>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-description">
                        {{ feature.description }}
                    </p>
                </div>
            </div>
        </div>

        <div class="features-swiper-mobile">
            <Swiper
                :modules="[Pagination]"
                :slides-per-view="1.1"
                :space-between="14"
                :pagination="{ clickable: true }"
            >
                <SwiperSlide v-for="feature in features" :key="`mobile-${feature.title}`">
                    <div class="feature-card h-100">
                        <div class="feature-icon" :class="feature.colorClass">
                            <i :class="[feature.icon, 'text-white text-2xl']"></i>
                        </div>
                        <h3 class="feature-title">{{ feature.title }}</h3>
                        <p class="feature-description">
                            {{ feature.description }}
                        </p>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>

<style scoped>
.features-section {
    padding: 2rem 0;
}

.feature-card {
    @apply bg-surface-0 dark:bg-surface-900 rounded-2xl p-8 border border-surface-200 dark:border-surface-700 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.feature-icon {
    @apply w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300;
    flex-shrink: 0;
}

.feature-icon--yellow {
    background: linear-gradient(135deg, #facc15, #f97316);
}

.feature-icon--blue {
    background: linear-gradient(135deg, #60a5fa, #06b6d4);
}

.feature-icon--indigo {
    background: linear-gradient(135deg, #818cf8, #a855f7);
}

.feature-icon--slate {
    background: linear-gradient(135deg, #94a3b8, #6b7280);
}

.feature-icon--orange {
    background: linear-gradient(135deg, #fb923c, #ef4444);
}

.feature-icon--pink {
    background: linear-gradient(135deg, #f472b6, #f43f5e);
}

.feature-icon--green {
    background: linear-gradient(135deg, #4ade80, #10b981);
}

.feature-icon--violet {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.feature-icon--purple {
    background: linear-gradient(135deg, #c084fc, #8b5cf6);
}

.feature-card:hover .feature-icon {
    @apply scale-110;
}

.feature-title {
    @apply text-xl font-bold text-surface-900 dark:text-surface-0 mb-4;
    flex-shrink: 0;
}

.feature-description {
    @apply text-surface-600 dark:text-surface-300 leading-relaxed;
    flex-grow: 1;
}

.features-swiper-mobile {
    display: none;
}

.features-swiper-mobile :deep(.swiper) {
    padding: 0 0 2.25rem 0;
}

.features-swiper-mobile :deep(.swiper-slide) {
    height: auto;
}

.features-swiper-mobile :deep(.swiper-pagination-bullet-active) {
    background: var(--primary-color);
}

.testimonial-section {
    @apply relative;
}

.testimonial-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05));
    border-radius: 1.5rem;
}

.testimonial-section blockquote {
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.6;
    min-width: 280px;
}

@media (max-width: 768px) {
    .features-section {
        padding: 1rem 0;
    }

    .features-grid-desktop {
        display: none;
    }

    .features-swiper-mobile {
        display: block;
    }

    .feature-card {
        @apply p-6;
    }

    .feature-icon {
        @apply w-14 h-14;
    }

    .testimonial-section {
        margin-top: 3rem;
    }

    .testimonial-section blockquote {
        font-size: 1.125rem;
        line-height: 1.7;
        padding: 0 1rem;
        word-break: normal;
        overflow-wrap: break-word;
        min-width: 250px;
        max-width: 100%;
    }

    .testimonial-section .bg-gradient-to-r {
        padding: 1.5rem !important;
    }
}

@media (max-width: 480px) {
    .testimonial-section blockquote {
        font-size: 1rem;
        line-height: 1.6;
        padding: 0 0.75rem;
        min-width: 220px;
    }
    
    .testimonial-section .bg-gradient-to-r {
        padding: 1rem !important;
    }
}

@media (max-width: 360px) {
    .testimonial-section blockquote {
        font-size: 0.95rem;
        line-height: 1.5;
        padding: 0 0.5rem;
        min-width: 200px;
        word-break: keep-all;
        overflow-wrap: normal;
    }
    
    .testimonial-section .bg-gradient-to-r {
        padding: 0.75rem !important;
    }
}
</style>
