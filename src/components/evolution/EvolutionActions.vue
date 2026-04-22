<template>
    <div class="d-flex flex-wrap gap-2 mt-3 align-items-center">
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
            label="Excluir configuração"
            icon="pi pi-trash"
            severity="danger"
            :loading="excluirLoading"
            :disabled="excluirLoading"
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
        excluirLoading: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        confirmarExclusao() {
            if (this.excluirLoading) {
                return;
            }

            const estaConectado = this.status === 'connected';

            const message = estaConectado
                ? 'Sua instância está ativa e conectada ao WhatsApp. Ao excluir, o envio automatizado de mensagens e os lembretes de consulta para pacientes deixarão de funcionar até você configurar novamente. Deseja realmente excluir esta configuração?'
                : 'Tem certeza que deseja excluir a configuração do WhatsApp? Você precisará configurar novamente para usar o envio de mensagens e lembretes.';

            this.$confirm.require({
                group: 'evolution-delete',
                header: estaConectado ? 'Excluir instância ativa?' : 'Excluir configuração do WhatsApp',
                message,
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
