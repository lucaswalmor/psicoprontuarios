<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        :closable="false"
        :dismissableMask="false"
        :style="{ width: '500px' }"
        class="success-dialog"
    >
        <template #header>
            <div class="flex align-items-center gap-2">
                <i class="pi pi-check-circle text-green-500 text-2xl"></i>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 m-0">
                    Cadastro Realizado com Sucesso!
                </h3>
            </div>
        </template>

        <div class="text-center py-6">
            <div class="mb-4">
                <i class="pi pi-check-circle text-green-500 text-6xl mb-4"></i>
                <h4 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                    Parabéns pelo seu cadastro!
                </h4>
                <p class="text-surface-600 dark:text-surface-400 mb-4">
                    Sua conta foi criada com sucesso. Você será redirecionado para a página de login em alguns
                    segundos.
                </p>
            </div>

            <div class="flex items-center justify-content-center mb-4">
                <img :src="logo" alt="PsicoProntuários" class="animated-logo" />
            </div>

            <div class="text-sm text-surface-500 dark:text-surface-400">
                Aguarde {{ countdown }} segundos
            </div>
        </div>
    </Dialog>
</template>

<script>
import logo from '@/assets/img/no-bg.webp';

export default {
    name: 'DialogCadastroSucesso',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        countdown: {
            type: Number,
            default: 3
        }
    },
    emits: ['update:visible'],
    data() {
        return {
            logo
        };
    }
};
</script>

<style scoped>
.success-dialog :deep(.p-dialog) {
    max-width: 500px;
    width: 90%;
}

.success-dialog :deep(.p-dialog-header) {
    border-bottom: 1px solid var(--surface-border);
    padding: 1.5rem 1.5rem 1rem;
}

.success-dialog :deep(.p-dialog-content) {
    padding: 0 1.5rem 1.5rem;
}

.success-dialog :deep(.p-dialog-header-icon) {
    display: none;
}

/* Animação da logo */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animated-logo {
    width: 80px;
    height: 80px;
    animation: spin 1s linear infinite;
}
</style>
