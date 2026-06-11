<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        :closable="true"
        :dismissableMask="false"
        :style="{ width: '500px' }"
        class="success-dialog"
    >
        <template #header>
            <div class="flex align-items-center gap-2">
                <i class="pi pi-info-circle text-blue-500 text-2xl"></i>
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 m-0">
                    Conta Já Cadastrada
                </h3>
            </div>
        </template>

        <div class="text-center py-6">
            <div class="mb-4">
                <i class="pi pi-info-circle text-blue-500 text-6xl mb-4"></i>
                <h4 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                    Você já possui uma conta!
                </h4>
                <p class="text-surface-600 dark:text-surface-400 mb-4">
                    Este email já está cadastrado em nosso sistema. Faça login para acessar sua conta.
                </p>
            </div>

            <div class="flex items-center justify-content-center mb-4">
                <img :src="logo" alt="PsicoProntuários" class="animated-logo" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end">
                <Button 
                    label="Acessar Sistema" 
                    icon="pi pi-arrow-right" 
                    @click="$emit('access-system')" 
                    class="p-button-primary" 
                />
            </div>
        </template>
    </Dialog>
</template>

<script>
import logo from '@/assets/img/logo.webp';

export default {
    name: 'DialogContaExistente',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:visible', 'access-system'],
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
