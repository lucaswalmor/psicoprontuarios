<template>
    <div class="features-section">
        <!-- Header -->
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Recursos Principais
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Tudo que você precisa para gerenciar seus pacientes de forma eficiente e segura
            </p>
        </div>

        <!-- Features Grid -->
        <div class="row g-4">
            <!-- Card 1: Fácil de Usar -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-yellow-400 to-orange-500">
                        <i class="pi pi-lightbulb text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Fácil de Usar</h3>
                    <p class="feature-description">
                        Interface intuitiva e moderna para gerenciar seus pacientes sem complicações.
                    </p>
                </div>
            </div>

            <!-- Card 2: Prontuários Seguros -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-blue-400 to-cyan-500">
                        <i class="pi pi-shield text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Prontuários Seguros</h3>
                    <p class="feature-description">
                        Dados protegidos e sigilosos conforme LGPD. Criptografia de ponta a ponta.
                    </p>
                </div>
            </div>

            <!-- Card 3: Histórico Completo -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-indigo-400 to-purple-500">
                        <i class="pi pi-file text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Histórico Completo</h3>
                    <p class="feature-description">
                        Acompanhe todo o histórico de seus pacientes com detalhes e evoluções.
                    </p>
                </div>
            </div>

            <!-- Card 4: Acesso Multiplataforma -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-slate-400 to-gray-500">
                        <i class="pi pi-mobile text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Acesso Multiplataforma</h3>
                    <p class="feature-description">
                        Acesse de qualquer dispositivo, a qualquer hora. Desktop, tablet e mobile.
                    </p>
                </div>
            </div>

            <!-- Card 5: Relatórios Detalhados -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-orange-400 to-red-500">
                        <i class="pi pi-chart-bar text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Relatórios Detalhados</h3>
                    <p class="feature-description">
                        Gere relatórios completos e personalizados para suas sessões e tratamentos.
                    </p>
                </div>
            </div>

            <!-- Card 6: Agendamento -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-pink-400 to-rose-500">
                        <i class="pi pi-calendar text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Agendamento Inteligente</h3>
                    <p class="feature-description">
                        Organize suas consultas e sessões com lembretes automáticos e notificações.
                    </p>
                </div>
            </div>

            <!-- Card 7: Pronto para Usar -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-teal-400 to-green-500">
                        <i class="pi pi-check-circle text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Pronto para Usar</h3>
                    <p class="feature-description">
                        Configure rapidamente e comece a usar em minutos. Sem complicações.
                    </p>
                </div>
            </div>

            <!-- Card 8: Tecnologia Moderna -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-blue-500 to-indigo-500">
                        <i class="pi pi-globe text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Tecnologia Moderna</h3>
                    <p class="feature-description">
                        Desenvolvido com as melhores práticas e tecnologias mais recentes.
                    </p>
                </div>
            </div>

            <!-- Card 9: Privacidade -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-purple-400 to-violet-500">
                        <i class="pi pi-eye text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Privacidade Total</h3>
                    <p class="feature-description">
                        Seus dados sempre protegidos e seguros. Conformidade total com LGPD.
                    </p>
                </div>
            </div>
        </div>

        <!-- Testimonial Section -->
        <div class="testimonial-section mt-20">
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-surface-800 dark:to-surface-700 rounded-3xl p-6 md:p-8 lg:p-12">
                <div class="text-center max-w-4xl mx-auto">
                    <div class="flex justify-center mb-4 md:mb-6">
                        <div class="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <i class="pi pi-user text-white text-lg md:text-2xl"></i>
                        </div>
                    </div>
                    <blockquote class="text-lg md:text-xl lg:text-2xl text-surface-900 dark:text-surface-0 font-medium mb-4 md:mb-6 leading-relaxed px-2 md:px-0 max-w-3xl mx-auto">
                        "O sistema de prontuários psicológicos revolucionou minha prática. Agora posso focar no que realmente importa: meus pacientes. A interface é intuitiva e os dados ficam sempre seguros."
                    </blockquote>
                    <div class="text-base md:text-lg text-surface-700 dark:text-surface-200">
                        <strong class="text-surface-900 dark:text-surface-0">Dr. Maria Silva</strong>
                        <span class="block text-sm mt-1">Psicóloga Clínica</span>
                    </div>
                </div>
            </div>
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
