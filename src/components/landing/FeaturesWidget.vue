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
                        Dados clínicos com controle de acesso, sigilo profissional e boas práticas alinhadas à LGPD.
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
                    <h3 class="feature-title">Visão da prática</h3>
                    <p class="feature-description">
                        Dashboard, financeiro da consulta e indicadores de evolução (humor, GAD-7, PHQ-9) para decidir com dados.
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

            <!-- Card 7: Automação WhatsApp -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-green-400 to-emerald-500">
                        <i class="pi pi-whatsapp text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">WhatsApp no fluxo de trabalho</h3>
                    <p class="feature-description">
                        Cadastros, listagens e consultas das principais telas pelo WhatsApp, sem abrir o navegador. Menos cliques, mais tempo com o paciente.
                    </p>
                </div>
            </div>

            <!-- Card 8: Notificações automáticas -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-violet-500 to-purple-600">
                        <i class="pi pi-bell text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Notificações automáticas</h3>
                    <p class="feature-description">
                        Mensagens de aniversário, datas comemorativas e outras rotinas pelo WhatsApp, conforme você configurar.
                    </p>
                </div>
            </div>

            <!-- Card 9: Privacidade -->
            <div class="col-md-4">
                <div class="feature-card h-100">
                    <div class="feature-icon bg-gradient-to-br from-purple-400 to-violet-500">
                        <i class="pi pi-eye text-white text-2xl"></i>
                    </div>
                    <h3 class="feature-title">Privacidade e LGPD</h3>
                    <p class="feature-description">
                        Tratamento de dados pensado para o contexto clínico, com separação por conta e transparência nas finalidades do uso.
                    </p>
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
