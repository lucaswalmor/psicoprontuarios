<template>
    <Dialog
        :visible="visible"
        modal
        :closable="false"
        :dismissableMask="false"
        :closeOnEscape="false"
        header="Conectar WhatsApp"
        :style="{ width: '32rem' }"
    >
        <div class="text-center">
            <p class="mb-3">
                Escaneie o QR Code com o WhatsApp do número cadastrado
            </p>

            <div v-if="loadingQr" class="py-5">
                <ProgressSpinner style="width: 3rem; height: 3rem" />
            </div>

            <div v-else-if="qrCodeSrc" class="d-flex justify-content-center mb-2">
                <img :src="qrCodeSrc" alt="QR Code WhatsApp" class="evolution-qr-image" />
            </div>

            <small v-else class="text-danger">Não foi possível carregar o QR Code.</small>
        </div>

        <template #footer>
            <Button label="Cancelar" severity="secondary" @click="cancelar" />
        </template>
    </Dialog>
</template>

<script>
import api from '@/utils/axios';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'EvolutionQrDialog',
    components: {
        Button,
        Dialog,
        ProgressSpinner,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        instanceName: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            loadingQr: false,
            qrCodeBase64: '',
            pollingId: null,
        };
    },
    computed: {
        qrCodeSrc() {
            if (!this.qrCodeBase64) return '';
            if (this.qrCodeBase64.startsWith('data:image')) return this.qrCodeBase64;
            return `data:image/png;base64,${this.qrCodeBase64}`;
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.iniciarFluxo();
                } else {
                    this.pararPolling();
                    this.qrCodeBase64 = '';
                    this.loadingQr = false;
                }
            },
        },
    },
    beforeUnmount() {
        this.pararPolling();
    },
    methods: {
        async iniciarFluxo() {
            await this.carregarQrCode();
            this.iniciarPolling();
        },
        async carregarQrCode() {
            this.loadingQr = true;
            this.qrCodeBase64 = '';

            try {
                const response = await api.get('/evolution/instancia/qrcode');
                this.qrCodeBase64 = response?.data?.qrcode || '';
            } catch (error) {
                this.qrCodeBase64 = '';
            } finally {
                this.loadingQr = false;
            }
        },
        iniciarPolling() {
            this.pararPolling();
            this.pollingId = setInterval(this.verificarStatus, 10000);
        },
        pararPolling() {
            if (this.pollingId) {
                clearInterval(this.pollingId);
                this.pollingId = null;
            }
        },
        async verificarStatus() {
            try {
                const response = await api.get('/evolution/instancia/status');
                const status = response?.data?.status;
                if (status === 'connected') {
                    this.pararPolling();
                    this.$emit('conectado');
                }
            } catch (error) {
                // Mantém polling, pois pode ser oscilação temporária.
            }
        },
        cancelar() {
            this.pararPolling();
            this.$emit('cancelar');
        },
    },
};
</script>

<style scoped>
.evolution-qr-image {
    width: 240px;
    height: 240px;
    object-fit: contain;
}
</style>
