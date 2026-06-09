<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <div class="p-4 config-tab-body">
                    <div class="col-12 mb-4">
                        <h5>Preferências</h5>
                        <p class="text-color-secondary m-0">
                            Configure alertas para você, backup de prontuários e lembretes automáticos enviados aos pacientes.
                        </p>
                    </div>

                    <div v-if="loading" class="flex justify-content-center p-5">
                        <ProgressSpinner />
                    </div>

                    <div v-else class="grid">
                        <div class="col-12 md:col-6 xl:col-3">
                            <div class="pref-card surface-card border-round-xl p-4 h-full flex flex-column">
                                <div class="pref-card__icon pref-card__icon--email">
                                    <i class="pi pi-envelope" />
                                </div>
                                <h6 class="pref-card__title">Agenda diária por e-mail</h6>
                                <p class="pref-card__text flex-1">
                                    Receba todas as manhãs a lista das consultas do dia (somente quando houver consultas).
                                </p>
                                <div class="pref-card__toggle">
                                    <InputSwitch
                                        v-model="preferencias.agenda_diaria_email"
                                        :disabled="saving"
                                        @change="salvar"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 md:col-6 xl:col-3">
                            <div
                                class="pref-card surface-card border-round-xl p-4 h-full flex flex-column"
                                :class="{ 'pref-card--disabled': !evolutionConectado }"
                            >
                                <div class="pref-card__icon pref-card__icon--whatsapp">
                                    <i class="pi pi-whatsapp" />
                                </div>
                                <h6 class="pref-card__title">Agenda diária por WhatsApp</h6>
                                <p class="pref-card__text flex-1">
                                    Receba a agenda do dia no seu WhatsApp (requer WhatsApp conectado em Comunicação).
                                </p>
                                <p v-if="!evolutionConectado" class="pref-card__alert">
                                    Configure e conecte o WhatsApp em Comunicação para habilitar este envio.
                                </p>
                                <div class="pref-card__toggle">
                                    <InputSwitch
                                        v-model="preferencias.agenda_diaria_whatsapp"
                                        :disabled="saving || !evolutionConectado"
                                        @change="salvar"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 md:col-6 xl:col-3">
                            <div class="pref-card surface-card border-round-xl p-4 h-full flex flex-column">
                                <div class="pref-card__icon pref-card__icon--backup">
                                    <i class="pi pi-file-export" />
                                </div>
                                <h6 class="pref-card__title">Backup mensal de prontuários</h6>
                                <p class="pref-card__text flex-1">
                                    No dia 1º de cada mês, receba por e-mail um ZIP com os prontuários do mês anterior
                                    (uma pasta por paciente). Arquivos acima de 25 MB são enviados pelo WhatsApp.
                                </p>
                                <div class="pref-card__toggle">
                                    <InputSwitch
                                        v-model="preferencias.backup_prontuarios_email"
                                        :disabled="saving"
                                        @change="salvar"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 md:col-6 xl:col-3">
                            <div
                                class="pref-card surface-card border-round-xl p-4 h-full flex flex-column"
                                :class="{ 'pref-card--disabled': !evolutionConectado }"
                            >
                                <div class="pref-card__icon pref-card__icon--paciente">
                                    <i class="pi pi-bell" />
                                </div>
                                <h6 class="pref-card__title">Lembrete de consulta para pacientes</h6>
                                <p class="pref-card__text flex-1">
                                    Envia WhatsApp no dia da consulta para pacientes que aceitaram receber lembretes
                                    (campo marcado no agendamento).
                                </p>
                                <p v-if="!evolutionConectado" class="pref-card__alert">
                                    Configure e conecte o WhatsApp em Comunicação para habilitar este envio.
                                </p>
                                <div class="pref-card__toggle">
                                    <InputSwitch
                                        v-model="preferencias.lembrete_consulta_paciente_whatsapp"
                                        :disabled="saving || !evolutionConectado"
                                        @change="salvar"
                                    />
                                </div>
                            </div>
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
                lembrete_consulta_paciente_whatsapp: true,
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
                    lembrete_consulta_paciente_whatsapp: dados.lembrete_consulta_paciente_whatsapp !== false,
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

.pref-card {
    border: 1px solid var(--surface-border);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    gap: 0.75rem;
}

.pref-card:hover {
    border-color: color-mix(in srgb, var(--primary-color) 25%, var(--surface-border));
    box-shadow: 0 4px 14px color-mix(in srgb, var(--primary-color) 8%, transparent);
}

.pref-card--disabled {
    opacity: 0.92;
}

.pref-card__icon {
    width: 3rem;
    height: 3rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
}

.pref-card__icon--email {
    background: color-mix(in srgb, var(--primary-color) 12%, var(--surface-ground));
    color: var(--primary-color);
}

.pref-card__icon--whatsapp {
    background: color-mix(in srgb, #25d366 15%, var(--surface-ground));
    color: #128c7e;
}

.pref-card__icon--backup {
    background: color-mix(in srgb, var(--orange-500, #f59e0b) 15%, var(--surface-ground));
    color: var(--orange-600, #d97706);
}

.pref-card__icon--paciente {
    background: color-mix(in srgb, var(--blue-500, #3b82f6) 15%, var(--surface-ground));
    color: var(--blue-600, #2563eb);
}

.pref-card__title {
    margin: 0;
    color: var(--text-color);
    font-size: 1rem;
    font-weight: 600;
}

.pref-card__text {
    margin: 0;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
}

.pref-card__alert {
    margin: 0;
    color: var(--red-500, #ef4444);
    font-size: 0.8rem;
    line-height: 1.4;
}

.pref-card__toggle {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.25rem;
}
</style>
