<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <div class="p-4 config-tab-body">
                    <div class="col-12 mb-4">
                        <h5>Preferências</h5>
                        <p class="text-color-secondary m-0">
                            Configure alertas enviados para você — agenda do dia e backup mensal de prontuários.
                        </p>
                    </div>

                    <div v-if="loading" class="flex justify-content-center p-5">
                        <ProgressSpinner />
                    </div>

                    <div v-else class="flex flex-column gap-3">
                        <div class="surface-card p-4 border-round flex align-items-center justify-content-between gap-3 flex-wrap">
                            <div class="flex-1 min-w-0">
                                <h6 class="m-0 mb-1">Agenda diária por e-mail</h6>
                                <p class="text-sm text-color-secondary m-0">
                                    Receba todas as manhãs a lista das consultas do dia (somente quando houver consultas).
                                </p>
                            </div>
                            <InputSwitch
                                v-model="preferencias.agenda_diaria_email"
                                :disabled="saving"
                                @change="salvar"
                            />
                        </div>

                        <div class="surface-card p-4 border-round flex align-items-center justify-content-between gap-3 flex-wrap">
                            <div class="flex-1 min-w-0">
                                <h6 class="m-0 mb-1">Agenda diária por WhatsApp</h6>
                                <p class="text-sm text-color-secondary m-0">
                                    Receba a agenda do dia no seu WhatsApp (requer WhatsApp conectado em Comunicação).
                                </p>
                                <p v-if="!evolutionConectado" class="text-danger text-sm mt-2 mb-0">
                                    Configure e conecte o WhatsApp em Comunicação para habilitar este envio.
                                </p>
                            </div>
                            <InputSwitch
                                v-model="preferencias.agenda_diaria_whatsapp"
                                :disabled="saving || !evolutionConectado"
                                @change="salvar"
                            />
                        </div>

                        <div class="surface-card p-4 border-round flex align-items-center justify-content-between gap-3 flex-wrap">
                            <div class="flex-1 min-w-0">
                                <h6 class="m-0 mb-1">Backup mensal de prontuários</h6>
                                <p class="text-sm text-color-secondary m-0">
                                    No dia 1º de cada mês, receba por e-mail um ZIP com os prontuários do mês anterior
                                    (uma pasta por paciente). Arquivos acima de 25 MB são enviados pelo WhatsApp.
                                </p>
                            </div>
                            <InputSwitch
                                v-model="preferencias.backup_prontuarios_email"
                                :disabled="saving"
                                @change="salvar"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/utils/axios';
import preferenciasPsicologoService from '@/services/preferenciasPsicologoService';
import InputSwitch from 'primevue/inputswitch';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'ConfiguracaoPreferencias',
    components: {
        InputSwitch,
        ProgressSpinner,
    },
    data() {
        return {
            loading: true,
            saving: false,
            evolutionConectado: false,
            preferencias: {
                agenda_diaria_email: false,
                agenda_diaria_whatsapp: false,
                backup_prontuarios_email: false,
            },
        };
    },
    async mounted() {
        await Promise.all([this.carregarPreferencias(), this.carregarEstadoEvolution()]);
    },
    async activated() {
        await this.carregarEstadoEvolution();
    },
    methods: {
        async carregarPreferencias() {
            try {
                this.loading = true;
                const dados = await preferenciasPsicologoService.obter();
                this.preferencias = {
                    agenda_diaria_email: !!dados.agenda_diaria_email,
                    agenda_diaria_whatsapp: !!dados.agenda_diaria_whatsapp,
                    backup_prontuarios_email: !!dados.backup_prontuarios_email,
                };
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar suas preferências.',
                    life: 4000,
                });
            } finally {
                this.loading = false;
            }
        },
        async carregarEstadoEvolution() {
            let status = 'disconnected';

            try {
                const stRes = await api.get('/evolution/instancia/status');
                status = stRes?.data?.status || 'disconnected';
            } catch {
                status = 'disconnected';
            }

            this.evolutionConectado = status === 'connected';
        },
        async salvar() {
            if (this.saving) return;

            this.saving = true;
            try {
                await preferenciasPsicologoService.atualizar(this.preferencias);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Salvo',
                    detail: 'Preferências atualizadas.',
                    life: 2500,
                });
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error?.response?.data?.error || 'Não foi possível salvar as preferências.',
                    life: 4000,
                });
                await this.carregarPreferencias();
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>

<style scoped>
.config-tab-body {
    min-height: 200px;
}
</style>
