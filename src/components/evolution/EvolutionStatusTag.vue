<template>
    <Tag :value="label" :severity="severity" />
</template>

<script>
import Tag from 'primevue/tag';

export default {
    name: 'EvolutionStatusTag',
    components: {
        Tag,
    },
    props: {
        status: {
            type: String,
            default: 'disconnected',
        },
    },
    computed: {
        severity() {
            if (this.status === 'connected') return 'success';
            if (this.status === 'connecting') return 'warning';
            return 'danger';
        },
        label() {
            if (this.status === 'connected') return 'Conectado';
            if (this.status === 'connecting') return 'Conectando...';
            return 'Desconectado';
        },
    },
};
</script>
