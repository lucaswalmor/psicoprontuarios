<template>
    <div class="d-flex flex-wrap gap-2 mt-3">
        <Button
            v-if="status === 'disconnected' || status === 'connecting'"
            label="Gerar QR Code"
            icon="pi pi-qrcode"
            @click="$emit('gerar-qrcode')"
        />

        <Button
            v-if="status === 'connected'"
            label="Enviar mensagem de teste"
            icon="pi pi-send"
            severity="secondary"
            @click="$emit('enviar-teste')"
        />

        <Button
            v-if="status === 'connected'"
            label="Excluir configuração"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmarExclusao"
        />

        <ConfirmDialog group="evolution-delete" />
    </div>
</template>

<script>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';

export default {
    name: 'EvolutionActions',
    components: {
        Button,
        ConfirmDialog,
    },
    props: {
        status: {
            type: String,
            default: 'disconnected',
        },
        instanceName: {
            type: String,
            default: '',
        },
    },
    methods: {
        confirmarExclusao() {
            this.$confirm.require({
                group: 'evolution-delete',
                header: 'Excluir configuração do WhatsApp',
                message: 'Tem certeza que deseja excluir a configuração do WhatsApp? Você precisará configurar novamente para usar o envio de mensagens.',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sim, excluir',
                rejectLabel: 'Cancelar',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.$emit('excluir');
                },
            });
        },
    },
};
</script>
