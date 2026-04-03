<template>
    <div class="plano-tab">
        <div v-if="loading" class="flex flex-column align-items-center justify-content-center py-6 gap-3">
            <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
            <span class="text-600">Carregando seu plano…</span>
        </div>

        <template v-else>
            <!-- Sem assinatura -->
            <div v-if="!assinatura" class="empty-state surface-card border-round-xl p-5 text-center">
                <div class="empty-icon mb-4">
                    <i class="pi pi-sparkles"></i>
                </div>
                <h3 class="mt-0 mb-2 text-900">Você ainda não tem um plano pago</h3>
                <p class="text-600 mb-4 line-height-3 m-0">
                    Contrate um plano para usar todos os recursos com cobrança segura pela Asaas (cartão, trial quando disponível).
                </p>
                <Button label="Ver planos e assinar" icon="pi pi-arrow-right" iconPos="right" @click="irUpgrade" />
            </div>

            <template v-else>
                <!-- Alertas -->
                <Message v-if="mostrarAlterarCartao" severity="error" :closable="false" class="mb-4">
                    Existe cobrança <strong>em atraso</strong>. Atualize o cartão com o botão <strong>Alterar cartão</strong> em Ações (acima de Parar assinatura).
                </Message>
                <Message v-else-if="temFaturaPendente" severity="warn" :closable="false" class="mb-4">
                    Existe cobrança <strong>pendente</strong>. Confirme o pagamento no e-mail da Asaas ou aguarde a confirmação automática.
                </Message>

                <!-- Hero -->
                <div class="hero-plano border-round-xl p-4 md:p-5 mb-4">
                    <div class="flex flex-column md:flex-row md:align-items-start md:justify-content-between gap-4">
                        <div>
                            <p class="text-white-alpha-80 text-sm font-semibold uppercase tracking-wide m-0 mb-2">Seu plano</p>
                            <h2 class="text-white m-0 mb-2 text-3xl font-bold">{{ nomePlano }}</h2>
                            <p class="text-white-alpha-90 m-0 line-height-3">{{ assinatura.plano?.descricao || 'Assinatura recorrente via Asaas.' }}</p>
                        </div>
                        <div class="flex flex-column align-items-start md:align-items-end gap-2">
                            <Tag :value="labelStatus" :severity="severidadeStatus" class="text-sm font-bold" />
                            <div class="text-white text-2xl font-bold">{{ valorMensal }}</div>
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <div class="info-card surface-card border-round-xl p-4 h-full">
                            <div class="flex align-items-center gap-2 mb-3">
                                <span class="info-card__icon"><i class="pi pi-calendar"></i></span>
                                <span class="font-bold text-900">Datas</span>
                            </div>
                            <ul class="list-none p-0 m-0 flex flex-column gap-3">
                                <li v-if="assinatura.data_inicio_trial">
                                    <span class="text-600 text-sm block">Início do trial</span>
                                    <span class="text-900 font-medium">{{ formatarData(assinatura.data_inicio_trial) }}</span>
                                </li>
                                <li v-if="assinatura.data_fim_trial">
                                    <span class="text-600 text-sm block">Fim do trial</span>
                                    <span class="text-900 font-medium">{{ formatarData(assinatura.data_fim_trial) }}</span>
                                </li>
                                <li v-if="assinatura.data_inicio_cobranca">
                                    <span class="text-600 text-sm block">Início da cobrança</span>
                                    <span class="text-900 font-medium">{{ formatarData(assinatura.data_inicio_cobranca) }}</span>
                                </li>
                                <li v-if="!assinatura.data_fim_trial && !assinatura.data_inicio_cobranca">
                                    <span class="text-600 text-sm">Datas detalhadas aparecem após a primeira sincronização com a Asaas.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 lg:col-4">
                        <div class="info-card surface-card border-round-xl p-4 h-full">
                            <div class="flex align-items-center gap-2 mb-3">
                                <span class="info-card__icon"><i class="pi pi-credit-card"></i></span>
                                <span class="font-bold text-900">Pagamento</span>
                            </div>
                            <p class="text-600 line-height-3 m-0">
                                Cobrança mensal com cartão processada pela <strong>Asaas</strong>. Se houver cobrança em atraso, o botão
                                <strong>Alterar cartão</strong> aparece em Ações.
                            </p>
                        </div>
                    </div>
                    <div class="col-12 lg:col-4">
                        <div class="info-card surface-card border-round-xl p-4 h-full">
                            <div class="flex align-items-center gap-2 mb-3">
                                <span class="info-card__icon"><i class="pi pi-bolt"></i></span>
                                <span class="font-bold text-900">Ações</span>
                            </div>
                            <div class="flex flex-column gap-2">
                                <Button
                                    v-if="mostrarAlterarCartao"
                                    label="Alterar cartão"
                                    icon="pi pi-credit-card"
                                    severity="warn"
                                    class="w-full"
                                    @click="dialogCartao = true"
                                />
                                <Button
                                    v-if="mostrarParar"
                                    label="Parar assinatura"
                                    icon="pi pi-pause"
                                    severity="danger"
                                    outlined
                                    class="w-full"
                                    @click="dialogParar = true"
                                />
                                <Button
                                    v-if="mostrarReativar"
                                    label="Reativar assinatura"
                                    icon="pi pi-play"
                                    severity="success"
                                    class="w-full"
                                    :loading="acaoLoading"
                                    @click="reativar"
                                />
                            </div>
                            <small class="text-600 block mt-3 line-height-3">
                                Parar encerra a recorrência na Asaas e bloqueia o acesso ao app até reativar com cartão válido.
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Faturas -->
                <div class="surface-card border-round-xl p-4 mt-4">
                    <div class="flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                        <h3 class="m-0 text-xl text-900">Cobranças registradas</h3>
                        <span class="text-600 text-sm">Histórico sincronizado com webhooks da Asaas</span>
                    </div>
                    <DataTable
                        :value="faturas"
                        stripedRows
                        :paginator="faturas.length > 8"
                        :rows="8"
                        responsiveLayout="stack"
                        class="p-datatable-sm"
                    >
                        <template #empty>
                            <div class="text-center text-600 py-4">Nenhuma cobrança registrada ainda.</div>
                        </template>
                        <Column field="data_vencimento" header="Vencimento">
                            <template #body="{ data }">
                                {{ formatarData(data.data_vencimento) }}
                            </template>
                        </Column>
                        <Column field="valor" header="Valor">
                            <template #body="{ data }">
                                {{ formatarMoeda(data.valor) }}
                            </template>
                        </Column>
                        <Column field="asaas_status" header="Status">
                            <template #body="{ data }">
                                <Tag :value="labelStatusFatura(data.asaas_status)" :severity="severidadeFatura(data.asaas_status)" />
                            </template>
                        </Column>
                        <Column field="data_pagamento" header="Pago em">
                            <template #body="{ data }">
                                {{ data.data_pagamento ? formatarData(data.data_pagamento) : '—' }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </template>

        <Dialog v-model:visible="dialogParar" modal header="Parar assinatura" class="w-full max-w-lg" :closable="true">
            <Message severity="warn" :closable="false" class="mb-3">
                Ao confirmar, a cobrança recorrente será interrompida na Asaas e <strong>você perderá o acesso ao sistema na hora</strong>
                (pacientes, prontuários, agenda etc.).
            </Message>
            <p class="text-600 text-sm m-0">Para voltar depois, reative a assinatura com cartão válido.</p>
            <template #footer>
                <Button label="Manter assinatura" severity="secondary" outlined @click="dialogParar = false" />
                <Button label="Parar e perder acesso" severity="danger" :loading="acaoLoading" @click="parar" />
            </template>
        </Dialog>

        <Dialog v-model:visible="dialogCartao" modal header="Atualizar cartão" class="w-full max-w-md" :closable="true">
            <div class="flex flex-column gap-3">
                <div class="field">
                    <label class="block mb-1 font-medium" for="plano-cartao-holder">Nome no cartão</label>
                    <InputText id="plano-cartao-holder" v-model="cartao.holder_name" class="w-full" />
                </div>
                <div class="field">
                    <label class="block mb-1 font-medium" for="plano-cartao-num">Número</label>
                    <InputText id="plano-cartao-num" v-model="cartao.number" class="w-full" maxlength="19" />
                </div>
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <label class="block mb-1 font-medium" for="plano-cartao-mes">Mês</label>
                        <InputText id="plano-cartao-mes" v-model="cartao.expiry_month" class="w-full" placeholder="MM" maxlength="2" />
                    </div>
                    <div class="col-12 md:col-4">
                        <label class="block mb-1 font-medium" for="plano-cartao-ano">Ano</label>
                        <InputText id="plano-cartao-ano" v-model="cartao.expiry_year" class="w-full" placeholder="AAAA" maxlength="4" />
                    </div>
                    <div class="col-12 md:col-4">
                        <label class="block mb-1 font-medium" for="plano-cartao-cvv">CVV</label>
                        <InputText id="plano-cartao-cvv" v-model="cartao.ccv" class="w-full" maxlength="4" />
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" severity="secondary" outlined @click="dialogCartao = false" />
                <Button label="Salvar" icon="pi pi-check" :loading="loadingCartao" @click="salvarCartao" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import { useToast } from 'primevue/usetoast';
import assinaturaService from '@/services/assinaturaService';
import asaasService from '@/services/asaasService';
import authService from '@/services/authService';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';

export default {
    name: 'ConfiguracaoPlanoTab',
    components: {
        Button,
        Column,
        DataTable,
        Dialog,
        InputText,
        Message,
        ProgressSpinner,
        Tag
    },
    setup() {
        return {
            planStore: usePlanStore(),
            toast: useToast()
        };
    },
    data() {
        return {
            loading: true,
            assinatura: null,
            dialogParar: false,
            dialogCartao: false,
            acaoLoading: false,
            loadingCartao: false,
            cartao: {
                holder_name: '',
                number: '',
                expiry_month: '',
                expiry_year: '',
                ccv: ''
            }
        };
    },
    computed: {
        nomePlano() {
            return this.assinatura?.plano?.nome || 'Plano';
        },
        valorMensal() {
            const v = this.assinatura?.valor_atual;
            if (v == null || v === '') return '—';
            const n = Number(v);
            if (Number.isNaN(n)) return String(v);
            return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '/mês';
        },
        faturas() {
            return Array.isArray(this.assinatura?.faturas) ? this.assinatura.faturas : [];
        },
        labelStatus() {
            const s = this.assinatura?.status;
            const map = {
                trial: 'Período de testes',
                ativa: 'Ativa',
                pausada: 'Pausada',
                cancelada_pendencia: 'Cancelamento (acesso até o fim do ciclo)',
                cancelada_definitiva: 'Encerrada'
            };
            return map[s] || s || '—';
        },
        severidadeStatus() {
            const s = this.assinatura?.status;
            if (s === 'ativa' || s === 'trial') return 'success';
            if (s === 'cancelada_pendencia') return 'warn';
            if (s === 'pausada') return 'info';
            if (s === 'cancelada_definitiva') return 'danger';
            return 'secondary';
        },
        mostrarParar() {
            const s = this.assinatura?.status;
            return s === 'trial' || s === 'ativa' || s === 'cancelada_pendencia';
        },
        mostrarReativar() {
            return this.assinatura?.status === 'pausada';
        },
        /** Cobrança vencida (atrasada) — exibe Alterar cartão */
        mostrarAlterarCartao() {
            return this.faturas.some((f) => (f.asaas_status || '').toUpperCase() === 'OVERDUE');
        },
        temFaturaPendente() {
            return this.faturas.some((f) => {
                const st = (f.asaas_status || '').toUpperCase();
                return st === 'PENDING' || st === 'OVERDUE';
            });
        }
    },
    mounted() {
        this.carregar();
    },
    methods: {
        async carregar() {
            this.loading = true;
            try {
                const data = await assinaturaService.getPainel();
                this.assinatura = data.assinatura || null;
            } catch (e) {
                console.error(e);
                this.assinatura = null;
                this.toast.add({
                    severity: 'error',
                    summary: 'Plano',
                    detail: e.response?.data?.message || 'Não foi possível carregar os dados da assinatura.',
                    life: 5000
                });
            } finally {
                this.loading = false;
            }
        },
        formatarData(s) {
            if (!s) return '—';
            const d = new Date(s);
            return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString('pt-BR');
        },
        formatarMoeda(v) {
            if (v == null || v === '') return '—';
            const n = Number(v);
            return Number.isNaN(n) ? String(v) : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },
        labelStatusFatura(st) {
            if (!st) return '—';
            const u = String(st).toUpperCase();
            const map = {
                RECEIVED: 'Recebido',
                CONFIRMED: 'Confirmado',
                PENDING: 'Pendente',
                OVERDUE: 'Vencido',
                REFUNDED: 'Estornado',
                RECEIVED_IN_CASH: 'Recebido',
                CHARGEBACK_REQUESTED: 'Contestação',
                CHARGEBACK_DISPUTE: 'Em disputa',
                AWAITING_CHARGEBACK_REVERSAL: 'Aguardando estorno',
                DUNNING_REQUESTED: 'Negativação',
                DUNNING_RECEIVED: 'Negativado',
                AWAITING_RISK_ANALYSIS: 'Análise de risco'
            };
            return map[u] || st;
        },
        severidadeFatura(st) {
            const u = String(st || '').toUpperCase();
            if (u === 'RECEIVED' || u === 'CONFIRMED') return 'success';
            if (u === 'PENDING') return 'warn';
            if (u === 'OVERDUE') return 'danger';
            return 'secondary';
        },
        irUpgrade() {
            this.$router.push('/upgrade');
        },
        async salvarCartao() {
            this.loadingCartao = true;
            try {
                await asaasService.atualizarCartao(this.cartao);
                this.toast.add({
                    severity: 'success',
                    summary: 'Cartão',
                    detail: 'Dados enviados para a Asaas.',
                    life: 4000
                });
                this.dialogCartao = false;
                await this.carregar();
            } catch (e) {
                const msg = e.response?.data?.error || e.response?.data?.message || e.message || 'Não foi possível atualizar o cartão.';
                this.toast.add({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 });
            } finally {
                this.loadingCartao = false;
            }
        },
        async parar() {
            this.acaoLoading = true;
            try {
                const res = await asaasService.pausarAssinatura();
                const a = res.assinatura;
                if (a) {
                    this.planStore.setAssinatura(a);
                }
                authService.marcarComoInativo('assinatura_pausada');
                this.dialogParar = false;
                this.toast.add({ severity: 'success', summary: 'Assinatura', detail: 'Assinatura pausada na Asaas.', life: 4000 });
                await this.carregar();
            } catch (e) {
                const msg = e.response?.data?.error || e.response?.data?.message || e.message || 'Erro ao pausar.';
                this.toast.add({ severity: 'error', summary: 'Erro', detail: msg, life: 6000 });
            } finally {
                this.acaoLoading = false;
            }
        },
        async reativar() {
            this.acaoLoading = true;
            try {
                const res = await asaasService.reativarAssinatura();
                const a = res.assinatura;
                if (a) {
                    this.planStore.setAssinatura(a);
                }
                authService.marcarComoAtivoLocal();
                await authService.sincronizarSessaoComApi();
                this.toast.add({ severity: 'success', summary: 'Assinatura', detail: 'Assinatura reativada.', life: 4000 });
                await this.carregar();
            } catch (e) {
                const msg = e.response?.data?.error || e.response?.data?.message || e.message || 'Erro ao reativar.';
                this.toast.add({ severity: 'error', summary: 'Erro', detail: msg, life: 6000 });
            } finally {
                this.acaoLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.plano-tab {
    max-width: 1200px;
    margin: 0 auto;
}

.hero-plano {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600, #4338ca) 100%);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.text-white-alpha-80 {
    color: rgba(255, 255, 255, 0.85);
}
.text-white-alpha-90 {
    color: rgba(255, 255, 255, 0.95);
}
.text-white-alpha-70 {
    color: rgba(255, 255, 255, 0.7);
}

.empty-state {
    border: 1px solid var(--surface-border);
}

.empty-icon {
    width: 4.5rem;
    height: 4.5rem;
    margin: 0 auto;
    border-radius: 50%;
    background: var(--primary-50, rgba(99, 102, 241, 0.12));
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-icon i {
    font-size: 2rem;
    color: var(--primary-color);
}

.info-card {
    border: 1px solid var(--surface-border);
    transition: box-shadow 0.2s ease;
}

.info-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.info-card__icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 10px;
    background: var(--primary-50, rgba(99, 102, 241, 0.12));
    color: var(--primary-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.surface-card {
    border: 1px solid var(--surface-border);
}
</style>
