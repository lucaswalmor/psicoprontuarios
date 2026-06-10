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
                        <div
                            v-for="card in cards"
                            :key="card.key"
                            class="col-12 md:col-6 xl:col-3"
                        >
                            <div
                                class="pref-card surface-card border-round-xl"
                                :class="{ 'pref-card--disabled': card.cardDisabled }"
                                :style="{ borderLeft: `4px solid ${card.cor}` }"
                            >
                                <div class="pref-card__header">
                                    <div
                                        class="pref-card__icon-wrap"
                                        :style="{ background: card.corFundo }"
                                    >
                                        <i :class="card.icon" :style="{ color: card.cor }" />
                                    </div>
                                    <h6 class="pref-card__title">{{ card.titulo }}</h6>
                                    <div class="pref-card__toggle">
                                        <InputSwitch
                                            v-model="preferencias[card.key]"
                                            :disabled="card.switchDisabled"
                                            @change="salvar"
                                        />
                                    </div>
                                </div>

                                <p class="pref-card__desc">{{ card.descricao }}</p>
                                <p v-if="card.alert" class="pref-card__alert">{{ card.alert }}</p>

                                <i
                                    :class="[card.icon, 'pref-card__deco']"
                                    aria-hidden="true"
                                />
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
    computed: {
        cards() {
            const waOff = !this.evolutionConectado;
            const waAlert = 'Configure e conecte o WhatsApp em Comunicação para habilitar este envio.';

            return [
                {
                    key: 'agenda_diaria_email',
                    titulo: 'Agenda diária por e-mail',
                    descricao: 'Receba todas as manhãs a lista das consultas do dia (somente quando houver consultas).',
                    icon: 'pi pi-envelope',
                    cor: '#7c3aed',
                    corFundo: 'rgba(124, 58, 237, 0.10)',
                    cardDisabled: false,
                    switchDisabled: this.saving,
                    alert: null,
                },
                {
                    key: 'agenda_diaria_whatsapp',
                    titulo: 'Agenda diária por WhatsApp',
                    descricao: 'Receba a agenda do dia no seu WhatsApp (requer WhatsApp conectado em Comunicação).',
                    icon: 'pi pi-whatsapp',
                    cor: '#16a34a',
                    corFundo: 'rgba(22, 163, 74, 0.10)',
                    cardDisabled: waOff,
                    switchDisabled: this.saving || waOff,
                    alert: waOff ? waAlert : null,
                },
                {
                    key: 'backup_prontuarios_email',
                    titulo: 'Backup mensal de prontuários',
                    descricao: 'No dia 1º de cada mês, receba por e-mail um ZIP com os prontuários do mês anterior (uma pasta por paciente). Arquivos acima de 25 MB são enviados pelo WhatsApp.',
                    icon: 'pi pi-file-export',
                    cor: '#ea580c',
                    corFundo: 'rgba(234, 88, 12, 0.10)',
                    cardDisabled: false,
                    switchDisabled: this.saving,
                    alert: null,
                },
                {
                    key: 'lembrete_consulta_paciente_whatsapp',
                    titulo: 'Lembrete de consulta para pacientes',
                    descricao: 'Envia WhatsApp no dia da consulta para pacientes que aceitaram receber lembretes (campo marcado no agendamento).',
                    icon: 'pi pi-bell',
                    cor: '#0891b2',
                    corFundo: 'rgba(8, 145, 178, 0.10)',
                    cardDisabled: waOff,
                    switchDisabled: this.saving || waOff,
                    alert: waOff ? waAlert : null,
                },
            ];
        },
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
    position: relative;
    overflow: hidden;
    padding: 1.25rem 1.25rem 1.25rem 1rem;
    min-height: 150px;
    height: 100%;
    border: 1px solid var(--surface-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    background: var(--surface-card);
}

.pref-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.11);
    transform: translateY(-2px);
}

.pref-card--disabled {
    opacity: 0.92;
}

.pref-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 1;
}

.pref-card__icon-wrap {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.25rem;
}

.pref-card__title {
    flex: 1;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
    line-height: 1.3;
}

.pref-card__toggle {
    flex-shrink: 0;
}

.pref-card__desc {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-color-secondary);
    line-height: 1.5;
    position: relative;
    z-index: 1;
    max-width: 85%;
}

.pref-card__alert {
    margin: 0.5rem 0 0 0;
    font-size: 0.75rem;
    color: var(--red-500, #ef4444);
    line-height: 1.4;
    position: relative;
    z-index: 1;
    max-width: 85%;
}

.pref-card__deco {
    position: absolute;
    bottom: -4px;
    right: 4px;
    font-size: 5rem;
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
    line-height: 1;
}
</style>
