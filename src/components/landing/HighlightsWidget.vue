<template>
    <div class="container-fluid">
        <!-- Header -->
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Poderoso em Qualquer Lugar
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Acesse seus prontuários de qualquer dispositivo com a mesma qualidade e funcionalidade
            </p>
        </div>

        <!-- Mobile Section -->
        <div class="highlight-item mb-20 flex justify-content-center align-items-center">
            <!-- <div class="row align-items-center"> -->
            <div class="d-flex">
                <div class="d-flex justify-content-center justify-content-lg-start">
                    <div class="position-relative">
                        <div class="highlight-image-bg"></div>
                        <img :src="celular" class="w-7 hidden-image" alt="Aplicativo Mobile" />
                        <!-- <img src="/demo/images/landing/mockup.svg" class="w-15" alt="Aplicativo Mobile" /> -->
                    </div>
                </div>
                <div class="highlight-content text-center flex flex-column align-items-center justify-content-center">
                    <div class="d-flex justify-content-center justify-content-lg-start mb-4">
                        <div class="highlight-icon bg-gradient-to-br from-purple-400 to-blue-500">
                            <i class="pi pi-mobile text-white text-3xl"></i>
                        </div>
                    </div>
                    <h3 class="highlight-title">
                        Acesso Mobile
                    </h3>
                    <p class="highlight-description">
                        Acesse seus prontuários de qualquer lugar através do seu smartphone ou tablet. Interface
                        otimizada para dispositivos móveis, permitindo que você gerencie seus pacientes mesmo fora do
                        consultório.
                    </p>

                    <!-- Features List -->
                    <div class="highlight-features">
                        <div class="feature-item">
                            <i class="pi pi-check-circle text-green-500 text-lg"></i>
                            <span>Interface responsiva</span>
                        </div>
                        <div class="feature-item">
                            <i class="pi pi-check-circle text-green-500 text-lg"></i>
                            <span>Sincronização em tempo real</span>
                        </div>
                        <div class="feature-item">
                            <i class="pi pi-check-circle text-green-500 text-lg"></i>
                            <span>Notificações push</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- </div> -->
        </div>

        <!-- Desktop Section -->
        <div class="highlight-item mb-20 flex justify-content-center align-items-center">
            <!-- <div class="row align-items-center"> -->
            <div class="d-flex gap-5">
                <!-- Content -->
                <div class="col-md-5 d-flex justify-content-center justify-content-lg-start">
                    <div
                        class="highlight-content text-center flex flex-column align-items-center justify-content-center">
                        <div class="d-flex justify-content-center justify-content-lg-start mb-4">
                            <div class="highlight-icon bg-gradient-to-br from-yellow-400 to-orange-500">
                                <i class="pi pi-desktop text-white text-3xl"></i>
                            </div>
                        </div>
                        <h3 class="highlight-title">
                            Interface Desktop Completa
                        </h3>
                        <p class="highlight-description">
                            No computador, aproveite todas as funcionalidades avançadas do sistema. Interface completa
                            com recursos de relatórios, agendamento avançado e gerenciamento completo de prontuários.
                        </p>

                        <!-- Features List -->
                        <div class="highlight-features">
                            <div class="feature-item">
                                <i class="pi pi-check-circle text-green-500 text-lg"></i>
                                <span>Dashboard completo</span>
                            </div>
                            <div class="feature-item">
                                <i class="pi pi-check-circle text-green-500 text-lg"></i>
                                <span>Relatórios avançados</span>
                            </div>
                            <div class="feature-item">
                                <i class="pi pi-check-circle text-green-500 text-lg"></i>
                                <span>Gestão de múltiplos pacientes</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-7 d-flex justify-content-center align-items-center">
                    <div class="highlight-image-bg desktop"></div>
                    <img :src="macbook" class="w-15 hidden-image" alt="Interface Desktop" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import celular from '@/assets/img/celular.webp';
import macbook from '@/assets/img/macbook.webp';
</script>

<style scoped>
.highlights-section {
    padding: 2rem 0;
}

.highlight-item {
    @apply relative;
}

.highlight-content {
    @apply space-y-6;
}

.highlight-icon {
    @apply w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110;
}

.highlight-title {
    @apply text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-0 mb-4;
}

.highlight-description {
    @apply text-lg text-surface-600 dark:text-surface-300 leading-relaxed max-w-lg mx-auto;
}

.highlight-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center
}

.feature-item {
    @apply flex items-center gap-3;
}

.feature-item span {
    @apply text-surface-700 dark:text-surface-200;
}

.highlight-image-bg {
    @apply absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl;
}

.highlight-image-bg.desktop {
    @apply from-yellow-500/20 to-orange-500/20;
}

.highlight-image {
    @apply relative w-full max-w-md rounded-2xl shadow-2xl;
}

.hidden-image {
    display: block;
}

@media (max-width: 768px) {
    .hidden-image {
        display: none;
    }
    
    .highlights-section {
        padding: 1rem 0;
    }

    .highlight-item {
        @apply mb-16;
    }

    .highlight-icon {
        @apply w-16 h-16;
    }
}
</style>
