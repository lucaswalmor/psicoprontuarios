<template>
    <div class="testimonials-section py-16 lg:py-24">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                    O que nossos clientes dizem
                </h2>
                <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                    Veja os depoimentos de psicólogos que já transformaram sua prática com nossa plataforma
                </p>
            </div>

            <div class="testimonials-carousel relative">
                <div class="testimonials-grid-desktop row g-4">
                    <div v-for="data in testimonials" :key="`desktop-${data.id}`" class="col-md-4">
                        <article class="testimonial-card">
                            <div class="stars-row">
                                <i v-for="star in 5" :key="star" class="pi pi-star-fill text-yellow-400"></i>
                            </div>

                            <blockquote class="testimonial-comment">
                                "{{ data.comment }}"
                            </blockquote>

                            <div class="testimonial-author">
                                <div class="author-avatar">
                                    <i class="pi pi-user text-white"></i>
                                </div>
                                <h4 class="author-name">{{ data.name }}</h4>
                                <p class="author-title">{{ data.title }}</p>
                                <p class="author-location">{{ data.location }}</p>
                            </div>
                        </article>
                    </div>
                </div>

                <div class="testimonials-swiper-mobile">
                    <Swiper
                        :modules="[Autoplay, Pagination]"
                        :slides-per-view="1.12"
                        :space-between="12"
                        :loop="true"
                        :autoplay="{ delay: 5000, disableOnInteraction: false }"
                        :pagination="{ clickable: true }"
                        class="testimonials-swiper"
                    >
                        <SwiperSlide v-for="data in testimonials" :key="`mobile-${data.id}`">
                            <article class="testimonial-card">
                                <div class="stars-row">
                                    <i v-for="star in 5" :key="star" class="pi pi-star-fill text-yellow-400"></i>
                                </div>

                                <blockquote class="testimonial-comment">
                                    "{{ data.comment }}"
                                </blockquote>

                                <div class="testimonial-author">
                                    <div class="author-avatar">
                                        <i class="pi pi-user text-white"></i>
                                    </div>
                                    <h4 class="author-name">{{ data.name }}</h4>
                                    <p class="author-title">{{ data.title }}</p>
                                    <p class="author-location">{{ data.location }}</p>
                                </div>
                            </article>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = ref([
    {
        id: 1,
        name: 'Dra. Maria Silva',
        title: 'Psicóloga Clínica',
        location: 'São Paulo, SP',
        comment: 'Esse sistema revolucionou minha prática! A automação pelo WhatsApp é incrível, meus pacientes adoram a facilidade. Agora consigo focar 100% no atendimento.'
    },
    {
        id: 2,
        name: 'Dr. João Santos',
        title: 'Psicólogo Organizacional',
        location: 'Rio de Janeiro, RJ',
        comment: 'A captação de pacientes realmente funciona! Em 3 meses aumentei minha clientela em 40%. O sistema é intuitivo e o suporte é excepcional.'
    },
    {
        id: 3,
        name: 'Dra. Ana Costa',
        title: 'Psicóloga Infantil',
        location: 'Belo Horizonte, MG',
        comment: 'Nunca pensei que gerenciar prontuários pudesse ser tão simples. A segurança dos dados me dá total tranquilidade para trabalhar.'
    },
    {
        id: 4,
        name: 'Dr. Carlos Oliveira',
        title: 'Psicoterapeuta',
        location: 'Brasília, DF',
        comment: 'O WhatsApp integrado mudou tudo! Meus pacientes conseguem agendar e acessar informações sem complicações. Recomendo para todos os colegas.'
    },
    {
        id: 5,
        name: 'Dra. Fernanda Lima',
        title: 'Psicóloga Social',
        location: 'Fortaleza, CE',
        comment: 'Excelente plataforma! Os relatórios detalhados me ajudam muito no acompanhamento dos casos. Interface linda e muito funcional.'
    },
    {
        id: 6,
        name: 'Dr. Roberto Mendes',
        title: 'Neuropsicólogo',
        location: 'Porto Alegre, RS',
        comment: 'Impressionado com a qualidade do sistema. A captação de pacientes realmente funciona e o atendimento da equipe é nota 10!'
    }
]);
</script>

<style scoped>
.testimonials-section {
    background: transparent;
}

.testimonial-card {
    @apply bg-surface-0 dark:bg-surface-900 rounded-2xl p-8 border border-surface-200 dark:border-surface-700 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary;
    height: 100%;
    min-height: 360px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.stars-row {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    font-size: 1rem;
}

.testimonial-comment {
    @apply text-surface-600 dark:text-surface-300;
    text-align: center;
    font-style: italic;
    line-height: 1.65;
    flex-grow: 1;
}

.testimonial-author {
    text-align: center;
}

.author-avatar {
    width: 3.5rem;
    height: 3.5rem;
    margin: 0 auto 0.75rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
    display: flex;
    align-items: center;
    justify-content: center;
}

.author-avatar i {
    font-size: 1rem;
}

.author-name {
    @apply text-surface-900 dark:text-surface-0;
    font-weight: 700;
    font-size: 1.05rem;
    margin: 0;
}

.author-title {
    @apply text-surface-600 dark:text-surface-400;
    font-size: 0.9rem;
    margin: 0.2rem 0 0;
}

.author-location {
    @apply text-surface-500 dark:text-surface-500;
    font-size: 0.75rem;
    margin: 0.2rem 0 0;
}

.testimonials-swiper-mobile {
    display: none;
}

:deep(.testimonials-swiper) {
    margin: 0 -0.5rem;
}

:deep(.testimonials-swiper .swiper-wrapper) {
    padding: 0 0.5rem;
}

:deep(.testimonials-swiper .swiper-slide) {
    overflow: visible;
    padding: 0 0.25rem;
    height: auto;
}

:deep(.testimonials-swiper .swiper-pagination) {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
}

:deep(.testimonials-swiper .swiper-pagination-bullet) {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--surface-300);
    border: none;
    transition: all 0.3s ease;
}

:deep(.testimonials-swiper .swiper-pagination-bullet-active) {
    background: var(--primary-color);
    transform: scale(1.2);
}

@media (max-width: 768px) {
    .testimonials-grid-desktop {
        display: none;
    }

    .testimonials-swiper-mobile {
        display: block;
    }

    .testimonial-card {
        @apply p-6;
        min-height: 320px;
    }

    .stars-row {
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .testimonial-card {
        @apply p-5;
        min-height: 300px;
    }

    :deep(.testimonials-swiper) {
        margin: 0 -0.25rem;
    }

    :deep(.testimonials-swiper .swiper-wrapper) {
        padding: 0 0.25rem;
    }
}
</style>
