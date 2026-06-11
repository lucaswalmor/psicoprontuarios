<script setup>
const passos = [
    {
        numero: '1',
        icon: 'pi pi-user-plus',
        titulo: 'Crie sua conta',
        descricao: 'Cadastro em poucos minutos, com e-mail ou conta Google. Sem instalar nada: funciona direto no navegador.'
    },
    {
        numero: '2',
        icon: 'pi pi-users',
        titulo: 'Cadastre seus pacientes',
        descricao: 'Importe os dados dos seus pacientes, registre a anamnese e organize os prontuários com segurança.'
    },
    {
        numero: '3',
        icon: 'pi pi-heart',
        titulo: 'Atenda com tudo organizado',
        descricao: 'Agenda, financeiro, evolução clínica e lembretes automáticos funcionando para você focar no atendimento.'
    }
];
</script>

<template>
    <div class="como-funciona-section">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Comece em 3 passos
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Do cadastro ao primeiro atendimento organizado em menos de 5 minutos
            </p>
        </div>

        <div class="passos-grid">
            <div v-for="(passo, idx) in passos" :key="passo.numero" class="passo-wrapper">
                <div class="passo-card">
                    <div class="passo-numero">{{ passo.numero }}</div>
                    <div class="passo-icon">
                        <i :class="[passo.icon, 'text-white text-2xl']"></i>
                    </div>
                    <h3 class="passo-titulo">{{ passo.titulo }}</h3>
                    <p class="passo-descricao">{{ passo.descricao }}</p>
                </div>
                <div v-if="idx < passos.length - 1" class="passo-seta">
                    <i class="pi pi-arrow-right text-2xl text-surface-300 dark:text-surface-600"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.como-funciona-section {
    padding: 2rem 0;
}

.passos-grid {
    @apply flex flex-col lg:flex-row items-stretch justify-center gap-6;
}

.passo-wrapper {
    @apply flex flex-col lg:flex-row items-center gap-6;
    flex: 1;
}

.passo-card {
    @apply relative bg-surface-0 dark:bg-surface-900 rounded-2xl p-8 border border-surface-200 dark:border-surface-700 text-center transition-all duration-300 hover:shadow-xl hover:border-primary;
    width: 100%;
    height: 100%;
}

.passo-numero {
    @apply absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-sm;
    background: linear-gradient(to right, #2563eb, #9333ea);
}

.passo-icon {
    @apply w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 mt-2;
    background: linear-gradient(135deg, #60a5fa, #a855f7);
}

.passo-titulo {
    @apply text-xl font-bold text-surface-900 dark:text-surface-0 mb-3;
}

.passo-descricao {
    @apply text-surface-600 dark:text-surface-300 leading-relaxed;
}

.passo-seta {
    @apply hidden lg:flex items-center flex-shrink-0;
}

@media (max-width: 1023px) {
    .passo-wrapper {
        flex-direction: column;
    }
}
</style>
