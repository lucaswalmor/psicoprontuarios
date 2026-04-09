<template>
    <div class="surface-card p-4 border-round border-1 surface-border">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
                <h6 class="mb-1 text-800 font-bold">Integração com WhatsApp</h6>
                <small class="text-600">Conecte seu WhatsApp para envio automatizado de mensagens.</small>
            </div>

            <EvolutionStatusTag v-if="hasInstance" :status="status" />
        </div>

        <div v-if="loading" class="d-flex justify-content-center p-4">
            <ProgressSpinner />
        </div>

        <div v-else>
            <EvolutionForm
                v-if="!hasInstance"
                :instanceName="predictedInstanceName"
                :loading="saving"
                @salvar="salvarInstancia"
            />

            <div v-else>
                <div class="surface-100 p-3 border-round mb-3">
                    <p class="m-0"><strong>Número:</strong> {{ formattedPhone(instance.phone_number) }}</p>
                    <small class="text-600">Identificador: {{ instance.instance_name }}</small>
                </div>

                <EvolutionActions
                    :status="status"
                    :instanceName="instance.instance_name"
                    @gerar-qrcode="abrirQrCode"
                    @enviar-teste="enviarMensagemTeste"
                    @excluir="excluirConfiguracao"
                />
            </div>
        </div>

        <EvolutionQrDialog
            :visible="showQrDialog"
            :instanceName="instance?.instance_name || ''"
            @conectado="onConectado"
            @cancelar="showQrDialog = false"
        />
    </div>
</template>

<script>
import api from '@/utils/axios';
import EvolutionActions from '@/components/evolution/EvolutionActions.vue';
import EvolutionForm from '@/components/evolution/EvolutionForm.vue';
import EvolutionQrDialog from '@/components/evolution/EvolutionQrDialog.vue';
import EvolutionStatusTag from '@/components/evolution/EvolutionStatusTag.vue';
import ProgressSpinner from 'primevue/progressspinner';
import userService from '@/services/userService';

export default {
    name: 'EvolutionConfig',
    components: {
        EvolutionActions,
        EvolutionForm,
        EvolutionQrDialog,
        EvolutionStatusTag,
        ProgressSpinner,
    },
    data() {
        return {
            loading: false,
            saving: false,
            sendingTest: false,
            deleting: false,
            instance: null,
            status: 'disconnected',
            showQrDialog: false,
            predictedInstanceName: '',
        };
    },
    computed: {
        hasInstance() {
            return !!this.instance;
        },
    },
    async created() {
        await this.carregarDadosIniciais();
    },
    methods: {
        async carregarDadosIniciais() {
            this.loading = true;
            try {
                await this.carregarInstancia();
                if (this.hasInstance) {
                    await this.atualizarStatus();
                } else {
                    await this.carregarIdentificadorPrevisto();
                }
            } finally {
                this.loading = false;
            }
        },
        async carregarInstancia() {
            try {
                const response = await api.get('/evolution/instancia');
                this.instance = response?.data?.data || null;
                this.status = this.instance?.status || 'disconnected';
            } catch (error) {
                if (error?.response?.status === 404) {
                    this.instance = null;
                    this.status = 'disconnected';
                    return;
                }
                this.showToast('error', 'Erro', 'Erro ao carregar configuração do WhatsApp.');
            }
        },
        async carregarIdentificadorPrevisto() {
            try {
                const profile = await userService.getProfile();
                const nome = (profile?.nome || '').toString().trim();
                const crp = (profile?.crp || '').toString();
                this.predictedInstanceName = this.gerarInstanceName(nome, crp);
            } catch (error) {
                this.predictedInstanceName = '';
            }
        },
        gerarInstanceName(nome, crp) {
            const nomeFormatado = nome
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .trim()
                .replace(/\s+/g, '_');

            const crpFormatado = (crp || '').replace(/\D/g, '');
            return `${nomeFormatado}_${crpFormatado}`.replace(/^_+|_+$/g, '');
        },
        async atualizarStatus() {
            if (!this.hasInstance) return;

            try {
                const response = await api.get('/evolution/instancia/status');
                this.status = response?.data?.status || 'disconnected';
                this.instance = {
                    ...this.instance,
                    status: this.status,
                };
            } catch (error) {
                this.showToast('warn', 'Aviso', 'Não foi possível atualizar o status do WhatsApp.');
            }
        },
        async salvarInstancia(phoneNumber) {
            this.saving = true;
            try {
                await api.post('/evolution/instancia', { phone_number: phoneNumber });
                this.showToast('success', 'Sucesso', 'Configuração salva com sucesso.');
                await this.carregarInstancia();
                await this.atualizarStatus();
            } catch (error) {
                const message = error?.response?.data?.message || 'Erro ao salvar configuração do WhatsApp.';
                this.showToast('error', 'Erro', message);
            } finally {
                this.saving = false;
            }
        },
        abrirQrCode() {
            this.showQrDialog = true;
        },
        onConectado() {
            this.showQrDialog = false;
            this.status = 'connected';
            if (this.instance) {
                this.instance.status = 'connected';
            }
            this.showToast('success', 'Conectado', 'WhatsApp conectado com sucesso.');
        },
        async enviarMensagemTeste() {
            this.sendingTest = true;
            try {
                await api.post('/evolution/instancia/mensagem-teste');
                this.showToast('success', 'Sucesso', 'Mensagem de teste enviada com sucesso.');
            } catch (error) {
                const message = error?.response?.data?.message || 'Erro ao enviar mensagem de teste.';
                this.showToast('error', 'Erro', message);
            } finally {
                this.sendingTest = false;
            }
        },
        async excluirConfiguracao() {
            this.deleting = true;
            try {
                await api.delete('/evolution/instancia');
                this.instance = null;
                this.status = 'disconnected';
                this.showQrDialog = false;
                await this.carregarIdentificadorPrevisto();
                this.showToast('success', 'Sucesso', 'Configuração excluída com sucesso.');
            } catch (error) {
                const message = error?.response?.data?.message || 'Erro ao excluir configuração.';
                this.showToast('error', 'Erro', message);
            } finally {
                this.deleting = false;
            }
        },
        formattedPhone(phone) {
            const digits = (phone || '').replace(/\D/g, '');
            if (digits.length < 10) return phone || '-';
            if (digits.length === 10) {
                return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
            }
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
        },
        showToast(severity, summary, detail) {
            this.$toast.add({
                severity,
                summary,
                detail,
                life: 3000,
            });
        },
    },
};
</script>
