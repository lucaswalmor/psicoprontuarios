<template>
    <div class="testimonials-section py-16 lg:py-24">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                    O que nossos clientes dizem
                </h2>
                <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                    Veja os depoimentos de psicólogos que já transformaram sua prática com nossa plataforma
                </p>
            </div>

            <!-- Carrossel de Testemunhos -->
            <div class="testimonials-carousel relative">
                <Carousel 
                    :value="testimonials" 
                    :numVisible="3" 
                    :numScroll="1" 
                    :showIndicators="true"
                    :showNavigators="true"
                    :responsiveOptions="responsiveOptions"
                    :autoplayInterval="5000"
                    circular
                    class="custom-carousel"
                >
                    <template #item="{ data }">
                        <div class="testimonial-card p-4">
                            <div class="card bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-6 h-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                <!-- Estrelas -->
                                <div class="flex justify-center mb-4">
                                    <div class="flex space-x-1">
                                        <i v-for="star in 5" :key="star" class="pi pi-star-fill text-yellow-400 text-lg"></i>
                                    </div>
                                </div>

                                <!-- Comentário -->
                                <blockquote class="text-surface-700 dark:text-surface-300 text-center mb-6 italic leading-relaxed">
                                    "{{ data.comment }}"
                                </blockquote>

                                <!-- Autor -->
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i class="pi pi-user text-white text-xl"></i>
                                    </div>
                                    <h4 class="font-bold text-surface-900 dark:text-surface-0 text-lg">{{ data.name }}</h4>
                                    <p class="text-surface-600 dark:text-surface-400 text-sm">{{ data.title }}</p>
                                    <p class="text-surface-500 dark:text-surface-500 text-xs mt-1">{{ data.location }}</p>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #header>
                        <div class="carousel-indicators-custom">
                            <!-- Indicadores customizados serão renderizados aqui -->
                        </div>
                    </template>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const testimonials = ref([
    {
        id: 1,
        name: "Dra. Maria Silva",
        title: "Psicóloga Clínica",
        location: "São Paulo, SP",
        comment: "Esse sistema revolucionou minha prática! A automação pelo WhatsApp é incrível, meus pacientes adoram a facilidade. Agora consigo focar 100% no atendimento."
    },
    {
        id: 2,
        name: "Dr. João Santos",
        title: "Psicólogo Organizacional",
        location: "Rio de Janeiro, RJ",
        comment: "A captação de pacientes realmente funciona! Em 3 meses aumentei minha clientela em 40%. O sistema é intuitivo e o suporte é excepcional."
    },
    {
        id: 3,
        name: "Dra. Ana Costa",
        title: "Psicóloga Infantil",
        location: "Belo Horizonte, MG",
        comment: "Nunca pensei que gerenciar prontuários pudesse ser tão simples. A segurança dos dados me dá total tranquilidade para trabalhar."
    },
    {
        id: 4,
        name: "Dr. Carlos Oliveira",
        title: "Psicoterapeuta",
        location: "Brasília, DF",
        comment: "O WhatsApp integrado mudou tudo! Meus pacientes conseguem agendar e acessar informações sem complicações. Recomendo para todos os colegas."
    },
    {
        id: 5,
        name: "Dra. Fernanda Lima",
        title: "Psicóloga Social",
        location: "Fortaleza, CE",
        comment: "Excelente plataforma! Os relatórios detalhados me ajudam muito no acompanhamento dos casos. Interface linda e muito funcional."
    },
    {
        id: 6,
        name: "Dr. Roberto Mendes",
        title: "Neuropsicólogo",
        location: "Porto Alegre, RS",
        comment: "Impressionado com a qualidade do sistema. A captação de pacientes realmente funciona e o atendimento da equipe é nota 10!"
    }
]);

const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>

<style scoped>
.testimonials-section {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.testimonial-card {
    height: 100%;
}

.card {
    transition: all 0.3s ease;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
}

:deep(.p-carousel) {
    margin: 0 -1rem;
}

:deep(.p-carousel-container) {
    padding: 0 1rem;
}

:deep(.p-carousel-content) {
    overflow: visible;
}

:deep(.p-carousel-item) {
    padding: 0 0.5rem;
}

:deep(.p-carousel-prev),
:deep(.p-carousel-next) {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--surface-200);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    color: var(--text-color);
    transition: all 0.3s ease;
}

:deep(.p-carousel-prev:hover),
:deep(.p-carousel-next:hover) {
    background: var(--primary-color);
    color: white;
    transform: scale(1.1);
}

:deep(.p-carousel-indicators) {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
}

:deep(.p-carousel-indicator button) {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--surface-300);
    border: none;
    transition: all 0.3s ease;
}

:deep(.p-carousel-indicator.p-highlight button) {
    background: var(--primary-color);
    transform: scale(1.2);
}

@media (max-width: 768px) {
    :deep(.p-carousel-prev),
    :deep(.p-carousel-next) {
        width: 2.5rem;
        height: 2.5rem;
    }
    
    .card {
        min-height: 280px;
    }
}

@media (max-width: 480px) {
    .card {
        min-height: 300px;
    }
    
    :deep(.p-carousel) {
        margin: 0;
    }
    
    :deep(.p-carousel-container) {
        padding: 0;
    }
}
</style>

