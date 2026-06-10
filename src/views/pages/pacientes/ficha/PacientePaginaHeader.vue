<template>
    <div class="ficha-page-header">
        <div class="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div class="min-w-0">
                <h1>{{ title }}</h1>
                <p class="text-color-secondary m-0">
                    {{ subtitle }}<span v-if="paciente?.nome"> · {{ paciente.nome }}</span>
                </p>
            </div>
            <Button
                label="Voltar à ficha"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                class="shrink-0"
                @click="$emit('voltar')"
            />
        </div>
        <div v-if="$slots.actions" class="flex flex-wrap gap-2 mb-3">
            <slot name="actions" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'PacientePaginaHeader',
    props: {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            default: ''
        },
        paciente: {
            type: Object,
            default: null
        }
    },
    emits: ['voltar']
};
</script>

<style scoped>
.ficha-page-header :deep(h1) {
    margin-bottom: 0.5rem;
}
</style>
