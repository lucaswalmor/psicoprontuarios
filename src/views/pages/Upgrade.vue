<template>
    <div class="upgrade-page">
        <SucessoPagamento
            v-if="pagamentoSucesso"
            :plano-nome="planoContratado"
            @continuar="irParaDashboard"
        />

        <template v-else>
            <!-- Step 1: Planos -->
            <section v-if="currentStep === 1" class="upgrade-step">
                <div
                    v-if="previewExpirado"
                    class="status-banner status-banner--warning"
                >
                    <i class="pi pi-exclamation-circle"></i>
                    <div>
                        <strong>Período de exploração encerrado</strong>
                        <p>Escolha um plano e confirme seu cartão para continuar usando o PsicoProntuários.</p>
                    </div>
                </div>

                <div
                    v-else-if="!isAtivacaoInicial"
                    class="status-banner status-banner--info"
                >
                    <i class="pi pi-arrow-up-right"></i>
                    <div>
                        <strong>Upgrade de plano</strong>
                        <p>Você está no plano {{ currentPlanName }}. A mudança vale a partir da próxima fatura.</p>
                    </div>
                </div>

                <div class="hero">
                    <span class="hero-badge">Escolha seu plano</span>
                    <h1 class="hero-title">Escolha o plano ideal para o seu consultório</h1>
                    <p class="hero-subtitle">
                        Planos completos para organizar atendimentos, prontuários e finanças e levar sua prática para o próximo nível.
                    </p>

                    <div class="billing-row">
                        <div class="billing-toggle">
                            <span class="billing-option billing-option--active">Mensal</span>
                        </div>
                    </div>
                </div>

                <div v-if="loadingPlanos" class="plans-loading">
                    <i class="pi pi-spin pi-spinner"></i>
                    <p>Carregando planos…</p>
                </div>

                <Message v-else-if="erroPlanos" severity="error" :closable="false" class="plans-error">
                    {{ erroPlanos }}
                </Message>

                <div v-else class="plans-grid">
                    <PlanoCard
                        v-for="plan in availablePlans"
                        :key="plan.id"
                        :plan="plan"
                        :is-current="isPlanoAtual(plan)"
                        @select="selectPlan"
                    />
                </div>

                <div v-if="podeVoltarAoSistema" class="explore-action">
                    <Button
                        :label="labelVoltarAoSistema"
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        outlined
                        @click="voltarAoSistema"
                    />
                </div>

                <div class="trust-bar">
                    <div class="trust-item">
                        <span class="trust-icon"><i class="pi pi-shield"></i></span>
                        <div>
                            <strong>Pagamento 100% seguro</strong>
                            <p>Seus dados protegidos com criptografia.</p>
                        </div>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon"><i class="pi pi-times-circle"></i></span>
                        <div>
                            <strong>Cancele quando quiser</strong>
                            <p>Sem taxas, sem burocracia.</p>
                        </div>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon"><i class="pi pi-comments"></i></span>
                        <div>
                            <strong>Suporte humanizado</strong>
                            <p>Estamos aqui para te ajudar.</p>
                        </div>
                    </div>
                </div>

                <p class="support-line">
                    Dúvidas?
                    <a href="mailto:suporte@psicoprontuarios.com" class="support-link">
                        Fale com nosso suporte
                        <i class="pi pi-whatsapp"></i>
                    </a>
                </p>
            </section>

            <!-- Step 2: Checkout -->
            <section v-else class="upgrade-step checkout-step">
                <button type="button" class="back-link" @click="previousStep" :disabled="loading">
                    <i class="pi pi-arrow-left"></i>
                    Voltar aos planos
                </button>

                <div class="checkout-header">
                    <span class="hero-badge">Finalizar assinatura</span>
                    <h1 class="hero-title hero-title--sm">{{ tituloEtapaPagamento }}</h1>
                    <p class="hero-subtitle">{{ descricaoEtapaPagamento }}</p>
                </div>

                <div v-if="selectedPlan" class="checkout-summary">
                    <div class="summary-plan">
                        <span class="summary-label">Plano selecionado</span>
                        <strong>{{ selectedPlan.nome }}</strong>
                    </div>
                    <div class="summary-price">{{ selectedPlan.preco }}</div>
                </div>

                <div class="checkout-card">
                    <EnderecoCheckout
                        ref="enderecoRef"
                        :initial="enderecoInitial"
                    />
                    <CartaoAsaas
                        :loading="loading"
                        @submit="processarPagamento"
                    />
                </div>

                <div class="checkout-actions">
                    <Button
                        v-if="podeVoltarAoSistema"
                        :label="labelVoltarAoSistema"
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        outlined
                        :disabled="loading"
                        @click="voltarAoSistema"
                    />
                </div>
            </section>
        </template>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/store/plan';
import { useAsaas } from '@/composables/useAsaas';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Message from 'primevue/message';
import planService, { parseDescricaoPlano } from '@/services/planService';
import userService from '@/services/userService';
import PlanoCard from '@/components/upgrade/PlanoCard.vue';
import CartaoAsaas from '@/components/checkout/CartaoAsaas.vue';
import EnderecoCheckout from '@/components/checkout/EnderecoCheckout.vue';
import SucessoPagamento from '@/components/checkout/SucessoPagamento.vue';
import { usuarioPodeSairDaUpgrade } from '@/router/authInactiveGuard';

const FEATURES_BY_SLUG = {
    simples: [
        'Dashboard Geral',
        'Dashboard Financeiro',
        'Prontuários com histórico e PDF',
        'Agendamento de Sessões',
        'Controle Financeiro',
        'Anamnese e Anexos',
        'Indicadores de evolução (humor, GAD-7, PHQ-9)',
        'Suporte por e-mail'
    ],
    pro: [
        'Tudo do plano Simples',
        'Site Exclusivo para você',
        'Melhoria de texto com IA no prontuário',
        'Gerar relatório profissional com IA nos prontuários',
        'Notificações de aniversários e datas comemorativas por WhatsApp',
        'WhatsApp: notificações de consulta e lembretes',
        'Suporte prioritário por WhatsApp'
    ]
};

const RESUMO_BY_SLUG = {
    simples: 'Tudo o essencial para organizar seus atendimentos.',
    pro: 'Mais recursos e automações para otimizar sua rotina.'
};

function parsePrecoParts(precoNum) {
    const [inteiro, decimos] = precoNum.toFixed(2).split('.');
    return { precoInt: inteiro, precoDec: decimos };
}

export default {
    name: 'Upgrade',
    components: {
        Button,
        PlanoCard,
        CartaoAsaas,
        EnderecoCheckout,
        SucessoPagamento,
        Message
    },
    setup() {
        const router = useRouter();
        const planStore = usePlanStore();
        const toast = useToast();
        const asaas = useAsaas();

        const currentStep = ref(1);
        const selectedPlan = ref(null);
        const pagamentoSucesso = ref(false);
        const planoContratado = ref(null);
        const planosList = ref([]);
        const loadingPlanos = ref(false);
        const erroPlanos = ref(null);
        const enderecoRef = ref(null);
        const enderecoInitial = ref({});

        async function carregarEnderecoPerfil() {
            try {
                const perfil = await userService.getProfile();
                enderecoInitial.value = {
                    cep: perfil.cep || '',
                    rua: perfil.rua || '',
                    bairro: perfil.bairro || '',
                    cidade: perfil.cidade || '',
                    estado: perfil.estado || '',
                    numero: perfil.numero || '',
                    complemento: perfil.complemento || '',
                };
            } catch (e) {
                console.warn('Não foi possível carregar endereço do perfil:', e);
            }
        }

        function mapearPlanoApi(p, omitirTrialNosRecursos = false) {
            const precoNum = Number(p.preco);
            const precoOk = Number.isFinite(precoNum);
            const slug = String(p.slug || '').toLowerCase();
            const nomeLower = String(p.nome || '').toLowerCase();
            const vitalicio = slug === 'vitalicio' || nomeLower.includes('vitalício') || nomeLower.includes('vitalicio');
            const precoStr = precoOk
                ? (vitalicio ? `R$ ${precoNum.toFixed(2).replace('.', ',')} (pagamento único)` : `R$ ${precoNum.toFixed(2).replace('.', ',')}/mês`)
                : 'Consulte valores';

            const { resumo, itens } = parseDescricaoPlano(p.descricao);
            let features = FEATURES_BY_SLUG[slug] ? [...FEATURES_BY_SLUG[slug]] : [];

            if (!features.length) {
                if (p.trial_dias > 0 && !omitirTrialNosRecursos) {
                    features.push(`${p.trial_dias} dia${p.trial_dias > 1 ? 's' : ''} de trial gratuito`);
                }
                features.push(...itens);
            }

            if (!features.length) {
                features.push('Acesso às funcionalidades do sistema');
            }

            const resumoFinal = RESUMO_BY_SLUG[slug] || resumo || String(p.descricao || '').trim() || '';

            return {
                id: p.id,
                nome: p.nome,
                slug,
                preco: precoStr,
                ...(precoOk ? parsePrecoParts(precoNum) : { precoInt: '—', precoDec: '00' }),
                resumo: resumoFinal,
                descricao: resumoFinal,
                features,
                popular: slug === 'pro'
            };
        }

        async function carregarPlanos() {
            loadingPlanos.value = true;
            erroPlanos.value = null;
            try {
                const raw = await planService.listarPlanosPublicos();
                const arr = Array.isArray(raw) ? raw : [];
                planosList.value = arr.map((p) => mapearPlanoApi(p, isAtivacaoInicial.value));
            } catch (e) {
                console.error('Erro ao carregar planos:', e);
                erroPlanos.value = 'Não foi possível carregar os planos. Tente atualizar a página.';
                planosList.value = [];
            } finally {
                loadingPlanos.value = false;
            }
        }

        const currentPlanName = computed(() => planStore.planoNome || 'Livre');

        const isNovoUsuario = computed(() => {
            const stat = planStore.statusAssinatura || localStorage.getItem('statusAssinatura') || '';
            return stat === 'sem_assinatura';
        });

        const isAtivacaoInicial = computed(() => isNovoUsuario.value);

        const previewAtivo = computed(() => planStore.previewAtivo === true);

        const previewExpirado = computed(() => {
            return isAtivacaoInicial.value && !previewAtivo.value && planStore.precisaAtivarPlano;
        });

        const podeVoltarAoSistema = computed(() => usuarioPodeSairDaUpgrade());

        const labelVoltarAoSistema = computed(() => {
            return previewAtivo.value ? 'Continuar explorando' : 'Voltar ao sistema';
        });

        const tituloEtapaPagamento = computed(() => {
            return isAtivacaoInicial.value ? 'Confirmar assinatura' : 'Finalizar pagamento';
        });

        const descricaoEtapaPagamento = computed(() => {
            if (isAtivacaoInicial.value) {
                return 'Informe os dados do cartão para ativar sua assinatura. Nenhuma cobrança será feita hoje.';
            }
            return 'Complete o pagamento para ativar seu novo plano.';
        });

        const availablePlans = computed(() => {
            const list = planosList.value;
            if (!list.length) return [];
            const stat = planStore.statusAssinatura || localStorage.getItem('statusAssinatura') || '';
            if (stat === 'sem_assinatura') return list;
            const pidRaw = localStorage.getItem('planoId');
            if (pidRaw == null || pidRaw === '') return list;
            const pid = parseInt(pidRaw, 10);
            if (Number.isNaN(pid)) return list;
            return list.filter((pl) => Number(pl.id) !== pid);
        });

        const isPlanoAtual = (plan) => {
            if (plan.nome === currentPlanName.value) return true;
            const pidRaw = localStorage.getItem('planoId');
            if (pidRaw == null || pidRaw === '') return false;
            const pid = parseInt(pidRaw, 10);
            return !Number.isNaN(pid) && Number(plan.id) === pid;
        };

        const selectPlan = async (plan) => {
            selectedPlan.value = plan;
            if (currentStep.value === 1) {
                await carregarEnderecoPerfil();
                currentStep.value = 2;
            }
        };

        const previousStep = () => {
            if (currentStep.value > 1) {
                currentStep.value--;
            }
        };

        const processarPagamento = async (payload) => {
            if (!selectedPlan.value?.id) {
                toast.add({
                    severity: 'warn',
                    summary: 'Plano',
                    detail: 'Selecione um plano antes de pagar.',
                    life: 4000
                });
                return;
            }
            if (!payload?.cartao) {
                toast.add({ severity: 'warn', summary: 'Cartão', detail: 'Dados do cartão incompletos.', life: 4000 });
                return;
            }
            if (!enderecoRef.value?.validar()) {
                toast.add({
                    severity: 'warn',
                    summary: 'Endereço',
                    detail: 'Informe e confirme seu endereço de cobrança.',
                    life: 5000
                });
                return;
            }
            try {
                await userService.salvarEndereco(enderecoRef.value.getDados());
                await asaas.criarCheckout(selectedPlan.value.id, payload.cartao);
                planoContratado.value = selectedPlan.value.nome;
                pagamentoSucesso.value = true;
                toast.add({
                    severity: 'success',
                    summary: 'Assinatura',
                    detail: 'Plano ativado com sucesso.',
                    life: 5000
                });
            } catch (e) {
                const body = e?.response?.data;
                let msg = body?.message || e?.message || 'Não foi possível processar o pagamento.';
                if (typeof body?.errors === 'object' && body.errors) {
                    const first = Object.values(body.errors).flat()[0];
                    if (first) msg = first;
                }
                toast.add({
                    severity: 'error',
                    summary: 'Pagamento',
                    detail: String(msg),
                    life: 8000
                });
            }
        };

        const irParaDashboard = () => {
            router.push('/dashboard');
        };

        const voltarAoSistema = () => {
            router.push('/dashboard');
        };

        onMounted(async () => {
            await carregarPlanos();
            const nome = currentPlanName.value.toLowerCase();
            if (nome === 'profissional' || nome === 'vitalício' || nome === 'vitalicio') {
                router.push('/dashboard');
                return;
            }

            const slugPreferido = localStorage.getItem('planoPreferidoSlug');
            if (slugPreferido && isNovoUsuario.value) {
                const plano = planosList.value.find((p) => p.slug === slugPreferido);
                if (plano) {
                    selectedPlan.value = plano;
                    await carregarEnderecoPerfil();
                    currentStep.value = 2;
                }
            }
        });

        return {
            currentStep,
            selectedPlan,
            pagamentoSucesso,
            planoContratado,
            currentPlanName,
            isAtivacaoInicial,
            previewAtivo,
            previewExpirado,
            podeVoltarAoSistema,
            labelVoltarAoSistema,
            tituloEtapaPagamento,
            descricaoEtapaPagamento,
            availablePlans,
            loadingPlanos,
            erroPlanos,
            enderecoRef,
            enderecoInitial,
            isPlanoAtual,
            selectPlan,
            previousStep,
            processarPagamento,
            irParaDashboard,
            voltarAoSistema,
            loading: asaas.loading
        };
    }
};
</script>

<style scoped>
.upgrade-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
}

.upgrade-step {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.status-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    width: 100%;
    max-width: 720px;
    margin-bottom: 1.75rem;
    padding: 1rem 1.15rem;
    border-radius: 0.85rem;
    font-size: 0.9rem;
    line-height: 1.5;
}

.status-banner i {
    font-size: 1.25rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
}

.status-banner p {
    margin: 0.25rem 0 0;
    opacity: 0.9;
}

.status-banner--warning {
    background: #fff8e1;
    border: 1px solid #ffb74d;
    color: #e65100;
}

.status-banner--info {
    background: #eff6ff;
    border: 1px solid #93c5fd;
    color: #1d4ed8;
}

.hero {
    text-align: center;
    max-width: 680px;
    margin-bottom: 2.25rem;
}

.hero-badge {
    display: inline-block;
    margin-bottom: 1rem;
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 0.82rem;
    font-weight: 600;
}

.hero-title {
    margin: 0 0 0.85rem;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: clamp(1.75rem, 4vw, 2.35rem);
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-color);
}

.hero-title--sm {
    font-size: clamp(1.5rem, 3vw, 2rem);
}

.hero-subtitle {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-color-secondary);
}

.billing-row {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
}

.billing-toggle {
    display: inline-flex;
    padding: 0.25rem;
    border-radius: 999px;
    background: var(--surface-100);
    border: 1px solid var(--surface-border);
}

.billing-option {
    padding: 0.45rem 1.25rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color-secondary);
}

.billing-option--active {
    background: #2563eb;
    color: #fff;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.plans-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 3rem 0;
    color: var(--text-color-secondary);
}

.plans-loading i {
    font-size: 2rem;
    color: var(--primary-color);
}

.plans-error {
    width: 100%;
    max-width: 560px;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 880px;
    margin-bottom: 2rem;
}

.explore-action {
    margin-bottom: 1.5rem;
}

.trust-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    width: 100%;
    max-width: 880px;
    padding: 1.25rem 1.5rem;
    border-radius: 1rem;
    background: var(--surface-100);
    border: 1px solid var(--surface-border);
}

.trust-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.trust-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.65rem;
    background: var(--surface-card);
    color: #2563eb;
    flex-shrink: 0;
}

.trust-item strong {
    display: block;
    font-size: 0.88rem;
    margin-bottom: 0.15rem;
    color: var(--text-color);
}

.trust-item p {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.4;
    color: var(--text-color-secondary);
}

.support-line {
    margin: 1.5rem 0 0;
    font-size: 0.92rem;
    color: var(--text-color-secondary);
}

.support-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.35rem;
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;
}

.support-link:hover {
    text-decoration: underline;
}

.support-link i {
    color: #22c55e;
}

.checkout-step {
    align-items: stretch;
    max-width: 560px;
    margin: 0 auto;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
    padding: 0;
    border: none;
    background: none;
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    cursor: pointer;
}

.back-link:hover:not(:disabled) {
    color: var(--primary-color);
}

.back-link:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.checkout-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.checkout-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding: 1rem 1.15rem;
    border-radius: 0.85rem;
    background: var(--surface-100);
    border: 1px solid var(--surface-border);
}

.summary-label {
    display: block;
    font-size: 0.78rem;
    color: var(--text-color-secondary);
    margin-bottom: 0.15rem;
}

.summary-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2563eb;
    white-space: nowrap;
}

.checkout-card {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
}

.checkout-actions {
    display: flex;
    justify-content: center;
    margin-top: 1.25rem;
}

@media (max-width: 768px) {
    .upgrade-page {
        padding: 1.25rem 1rem 2rem;
    }

    .plans-grid {
        grid-template-columns: 1fr;
    }

    .trust-bar {
        grid-template-columns: 1fr;
        padding: 1rem;
    }

    .checkout-summary {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
