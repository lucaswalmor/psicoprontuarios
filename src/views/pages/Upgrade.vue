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
            <section v-else class="co-page">
                <div class="co-layout">
                    <!-- COLUNA ESQUERDA -->
                    <div class="co-left">
                        <button type="button" class="back-link" @click="previousStep" :disabled="loading">
                            <i class="pi pi-arrow-left"></i>
                            Voltar aos planos
                        </button>

                        <div class="co-header">
                            <h1 class="co-title">{{ tituloEtapaPagamento }}</h1>
                            <p class="co-subtitle">{{ descricaoEtapaPagamento }}</p>
                        </div>

                        <!-- Seção 1: Endereço -->
                        <div class="co-section">
                            <div class="co-section-head">
                                <span class="co-section-num">1</span>
                                <h3 class="co-section-title">Endereço de cobrança</h3>
                                <button
                                    v-if="enderecoConfirmado"
                                    type="button"
                                    class="co-edit-btn"
                                    @click="editarEndereco"
                                >Editar</button>
                            </div>

                            <!-- Preview confirmado -->
                            <div v-if="enderecoConfirmado" class="co-address-preview">
                                <p>{{ enderecoLinha1 }}</p>
                                <p>{{ enderecoLinha2 }}</p>
                            </div>

                            <!-- Formulário de endereço -->
                            <div v-else class="co-section-body">
                                <EnderecoCheckout
                                    ref="enderecoRef"
                                    :initial="enderecoInitial"
                                    :hide-title="true"
                                />
                                <Button
                                    type="button"
                                    label="Confirmar endereço"
                                    icon="pi pi-check"
                                    class="co-confirm-section-btn"
                                    @click="confirmarEndereco"
                                />
                            </div>
                        </div>

                        <!-- Seção 2: Cartão -->
                        <div class="co-section" :class="{ 'co-section--locked': !enderecoConfirmado }">
                            <div class="co-section-head">
                                <span class="co-section-num">2</span>
                                <h3 class="co-section-title">Informações do Cartão</h3>
                            </div>
                            <div v-if="enderecoConfirmado" class="co-section-body">
                                <CartaoAsaas
                                    ref="cartaoRef"
                                    :hide-submit="true"
                                    :loading="loading"
                                    @submit="processarPagamento"
                                />
                            </div>
                            <div v-else class="co-section-locked-msg">
                                <i class="pi pi-lock"></i>
                                <span>Confirme o endereço para preencher os dados do cartão</span>
                            </div>
                        </div>

                        <!-- Botão confirmar assinatura -->
                        <Button
                            v-if="enderecoConfirmado"
                            type="button"
                            label="Confirmar assinatura"
                            icon="pi pi-lock"
                            :loading="loading"
                            :disabled="loading"
                            class="co-pay-btn w-full"
                            @click="confirmarPagamento"
                        />

                        <p class="co-security-note">
                            <i class="pi pi-shield"></i>
                            Seus dados estão protegidos. O pagamento é processado de forma segura pela Asaas.
                        </p>

                        <div v-if="podeVoltarAoSistema" class="co-back-action">
                            <Button
                                :label="labelVoltarAoSistema"
                                icon="pi pi-arrow-left"
                                severity="secondary"
                                text
                                :disabled="loading"
                                @click="voltarAoSistema"
                            />
                        </div>
                    </div>

                    <!-- COLUNA DIREITA: Resumo do pedido -->
                    <div class="co-right">
                        <div class="co-summary">
                            <h3 class="co-summary-title">Resumo do pedido</h3>

                            <div v-if="selectedPlan" class="co-summary-plan">
                                <span class="co-summary-plan-label">Plano selecionado</span>
                                <div class="co-summary-plan-row">
                                    <strong>{{ selectedPlan.nome }}</strong>
                                    <span class="co-summary-plan-price">R$ {{ selectedPlan.precoInt }},{{ selectedPlan.precoDec }}/mês</span>
                                </div>
                                <p class="co-summary-plan-desc">{{ selectedPlan.resumo }}</p>
                            </div>

                            <div class="co-summary-totals">
                                <div class="co-total-row">
                                    <span>Subtotal mensal</span>
                                    <span>R$ {{ selectedPlan?.precoInt }},{{ selectedPlan?.precoDec }}</span>
                                </div>
                                <div class="co-total-row co-total-row--discount">
                                    <span>Desconto promocional</span>
                                    <span>- R$ 0,00</span>
                                </div>
                                <div class="co-total-row co-total-row--total">
                                    <strong>Total mensal</strong>
                                    <strong class="co-total-price">R$ {{ selectedPlan?.precoInt }},{{ selectedPlan?.precoDec }}</strong>
                                </div>
                            </div>

                            <div class="co-trust-items">
                                <div class="co-trust-item">
                                    <span class="co-trust-icon co-trust-icon--green">
                                        <i class="pi pi-bolt"></i>
                                    </span>
                                    <div>
                                        <strong>Ativação rápida</strong>
                                        <p>Seu plano é ativado após a confirmação do pagamento.</p>
                                    </div>
                                </div>
                                <div class="co-trust-item">
                                    <span class="co-trust-icon co-trust-icon--red">
                                        <i class="pi pi-times-circle"></i>
                                    </span>
                                    <div>
                                        <strong>Sem fidelidade</strong>
                                        <p>Cancele quando quiser, sem multas ou burocracia.</p>
                                    </div>
                                </div>
                                <div class="co-trust-item">
                                    <span class="co-trust-icon co-trust-icon--blue">
                                        <i class="pi pi-comments"></i>
                                    </span>
                                    <div>
                                        <strong>Suporte humanizado</strong>
                                        <p>Atendimento sempre que você precisar.</p>
                                    </div>
                                </div>
                                <div class="co-trust-item">
                                    <span class="co-trust-icon co-trust-icon--orange">
                                        <i class="pi pi-whatsapp"></i>
                                    </span>
                                    <div>
                                        <strong>Precisa de ajuda?</strong>
                                        <p>Fale com nosso time pelo WhatsApp ou chat online.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Barra de confiança inferior -->
                <div class="co-bottom-bar">
                    <div class="co-bottom-item">
                        <i class="pi pi-lock"></i>
                        <div>
                            <strong>Ambiente 100% seguro</strong>
                            <span>Seus dados protegidos com criptografia</span>
                        </div>
                    </div>
                    <div class="co-bottom-item">
                        <i class="pi pi-credit-card"></i>
                        <div>
                            <strong>Pagamento processado pela Asaas</strong>
                            <span>Plataforma de pagamentos líder no Brasil</span>
                        </div>
                    </div>
                    <div class="co-bottom-item">
                        <i class="pi pi-shield"></i>
                        <div>
                            <strong>Conformidade LGPD</strong>
                            <span>Cumprimos todas as normas de proteção</span>
                        </div>
                    </div>
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
        const cartaoRef = ref(null);
        const enderecoConfirmado = ref(false);
        const enderecoConfirmadoDados = ref(null);

        async function carregarEnderecoPerfil() {
            try {
                const perfil = await userService.getProfile();
                const addr = {
                    cep: perfil.cep || '',
                    rua: perfil.rua || '',
                    bairro: perfil.bairro || '',
                    cidade: perfil.cidade || '',
                    estado: perfil.estado || '',
                    numero: perfil.numero || '',
                    complemento: perfil.complemento || '',
                };
                enderecoInitial.value = addr;
                if (addr.cep && addr.rua && addr.numero && addr.cidade && addr.estado && addr.bairro) {
                    enderecoConfirmadoDados.value = { ...addr };
                    enderecoConfirmado.value = true;
                }
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

        /** Assinatura paga/trial Asaas — distinto do preview gratuito ou plano_id default no cadastro. */
        const temPlanoContratado = computed(() => {
            if (planStore.usuarioVitalicio || localStorage.getItem('usuarioVitalicio') === 'true') {
                return true;
            }
            const stat = planStore.statusAssinatura || localStorage.getItem('statusAssinatura') || '';
            if (stat === 'sem_assinatura') {
                return false;
            }
            if (planStore.assinatura?.plano_id) {
                return true;
            }
            try {
                const raw = localStorage.getItem('userAssinatura');
                if (raw) {
                    const assinatura = JSON.parse(raw);
                    if (assinatura?.plano_id || assinatura?.status) {
                        return true;
                    }
                }
            } catch {
                // ignora JSON inválido
            }
            return stat !== 'sem_assinatura';
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
            if (!temPlanoContratado.value) {
                return false;
            }
            if (plan.nome === currentPlanName.value) {
                return true;
            }
            const pidRaw = localStorage.getItem('planoId');
            if (pidRaw == null || pidRaw === '') {
                return false;
            }
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

        const enderecoLinha1 = computed(() => {
            const e = enderecoConfirmadoDados.value;
            if (!e?.rua) return '';
            let linha = e.rua;
            if (e.numero) linha += `, ${e.numero}`;
            if (e.complemento) linha += ` — ${e.complemento}`;
            return linha;
        });

        const enderecoLinha2 = computed(() => {
            const e = enderecoConfirmadoDados.value;
            if (!e?.cidade) return '';
            const partes = [];
            if (e.bairro) partes.push(e.bairro);
            partes.push(e.cidade + (e.estado ? `/${e.estado}` : ''));
            if (e.cep) partes.push(`CEP: ${e.cep}`);
            return partes.join(' — ');
        });

        function confirmarEndereco() {
            if (!enderecoRef.value?.validar()) return;
            enderecoConfirmadoDados.value = enderecoRef.value.getDados();
            enderecoConfirmado.value = true;
        }

        function editarEndereco() {
            enderecoConfirmado.value = false;
        }

        const confirmarPagamento = async (cartaoOverride) => {
            if (!selectedPlan.value?.id) {
                toast.add({ severity: 'warn', summary: 'Plano', detail: 'Selecione um plano antes de pagar.', life: 4000 });
                return;
            }
            if (!enderecoConfirmado.value || !enderecoConfirmadoDados.value) {
                toast.add({ severity: 'warn', summary: 'Endereço', detail: 'Confirme o endereço de cobrança antes de continuar.', life: 5000 });
                return;
            }
            if (!cartaoRef.value) return;
            const dadosCartao = cartaoOverride ? { cartao: cartaoOverride } : cartaoRef.value.getDadosCartao();
            if (!dadosCartao) return;
            try {
                await userService.salvarEndereco(enderecoConfirmadoDados.value);
                await asaas.criarCheckout(selectedPlan.value.id, dadosCartao.cartao);
                planoContratado.value = selectedPlan.value.nome;
                pagamentoSucesso.value = true;
                toast.add({ severity: 'success', summary: 'Assinatura', detail: 'Plano ativado com sucesso.', life: 5000 });
            } catch (e) {
                const body = e?.response?.data;
                let msg = body?.message || e?.message || 'Não foi possível processar o pagamento.';
                if (typeof body?.errors === 'object' && body.errors) {
                    const first = Object.values(body.errors).flat()[0];
                    if (first) msg = first;
                }
                toast.add({ severity: 'error', summary: 'Pagamento', detail: String(msg), life: 8000 });
            }
        };

        const processarPagamento = async (payload) => {
            if (payload?.cartao) {
                await confirmarPagamento(payload.cartao);
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
            temPlanoContratado,
            podeVoltarAoSistema,
            labelVoltarAoSistema,
            tituloEtapaPagamento,
            descricaoEtapaPagamento,
            availablePlans,
            loadingPlanos,
            erroPlanos,
            enderecoRef,
            enderecoInitial,
            cartaoRef,
            enderecoConfirmado,
            enderecoLinha1,
            enderecoLinha2,
            isPlanoAtual,
            selectPlan,
            previousStep,
            processarPagamento,
            confirmarEndereco,
            editarEndereco,
            confirmarPagamento,
            irParaDashboard,
            voltarAoSistema,
            loading: asaas.loading
        };
    }
};
</script>

<style scoped>
.upgrade-page {
    max-width: 1060px;
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

/* ========== CHECKOUT REDESIGN ========== */

.co-page {
    width: 100%;
}

.co-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 1.75rem;
    align-items: start;
}

.co-left {
    min-width: 0;
}

.co-header {
    margin-bottom: 1.75rem;
}

.co-title {
    margin: 0 0 0.4rem;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: clamp(1.4rem, 2.5vw, 1.9rem);
    font-weight: 700;
    color: var(--text-color);
}

.co-subtitle {
    margin: 0;
    font-size: 0.92rem;
    color: var(--text-color-secondary);
}

.co-section {
    margin-bottom: 0.85rem;
    border-radius: 1rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    overflow: hidden;
    transition: opacity 0.2s;
}

.co-section--locked {
    opacity: 0.55;
}

.co-section-head {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1rem 1.4rem;
}

.co-section-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    background: #2563eb;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;
}

.co-section--locked .co-section-num {
    background: var(--surface-400, #94a3b8);
}

.co-section-title {
    flex: 1;
    margin: 0;
    font-size: 0.97rem;
    font-weight: 600;
    color: var(--text-color);
}

.co-edit-btn {
    padding: 0.28rem 0.85rem;
    border: 1px solid var(--surface-border);
    border-radius: 0.5rem;
    background: var(--surface-card);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-color-secondary);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.co-edit-btn:hover {
    background: var(--surface-100);
    color: var(--text-color);
}

.co-section-body {
    padding: 0 1.4rem 1.4rem;
    border-top: 1px solid var(--surface-border);
}

.co-address-preview {
    padding: 0.75rem 1.4rem 1.2rem;
    border-top: 1px solid var(--surface-border);
}

.co-address-preview p {
    margin: 0.3rem 0 0;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.co-section-locked-msg {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.4rem 1rem;
    font-size: 0.86rem;
    color: var(--text-color-secondary);
    border-top: 1px solid var(--surface-border);
}

.co-confirm-section-btn {
    margin-top: 1rem;
}

.co-pay-btn {
    font-size: 1.05rem !important;
    padding: 0.85rem 1.5rem !important;
    border-radius: 0.65rem !important;
    margin-top: 1.1rem;
}

.co-security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin: 0.85rem 0 0;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    text-align: center;
}

.co-security-note i {
    color: #22c55e;
}

.co-back-action {
    display: flex;
    justify-content: center;
    margin-top: 0.75rem;
}

/* --- Sidebar direita --- */

.co-right {
    position: sticky;
    top: 1.5rem;
}

.co-summary {
    border-radius: 1rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    padding: 1.4rem;
}

.co-summary-title {
    margin: 0 0 1.1rem;
    font-size: 0.97rem;
    font-weight: 700;
    color: var(--text-color);
}

.co-summary-plan {
    padding: 0.9rem 1rem;
    border-radius: 0.75rem;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    margin-bottom: 1.1rem;
}

.co-summary-plan-label {
    display: block;
    font-size: 0.72rem;
    color: #3b82f6;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.5rem;
}

.co-summary-plan-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.co-summary-plan-row strong {
    font-size: 0.95rem;
    color: var(--text-color);
}

.co-summary-plan-price {
    font-size: 0.92rem;
    font-weight: 700;
    color: #2563eb;
    white-space: nowrap;
}

.co-summary-plan-desc {
    margin: 0.45rem 0 0;
    font-size: 0.78rem;
    color: var(--text-color-secondary);
    line-height: 1.45;
}

.co-summary-totals {
    border-top: 1px solid var(--surface-border);
    padding-top: 0.9rem;
    margin-bottom: 1.1rem;
}

.co-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0;
    font-size: 0.86rem;
    color: var(--text-color-secondary);
}

.co-total-row--discount span:last-child {
    color: #16a34a;
}

.co-total-row--total {
    border-top: 1px solid var(--surface-border);
    margin-top: 0.4rem;
    padding-top: 0.65rem;
    font-size: 0.96rem;
    color: var(--text-color);
}

.co-total-price {
    color: #2563eb !important;
}

.co-trust-items {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    border-top: 1px solid var(--surface-border);
    padding-top: 1.1rem;
}

.co-trust-item {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
}

.co-trust-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 0.95rem;
}

.co-trust-icon--green { background: #dcfce7; color: #16a34a; }
.co-trust-icon--red   { background: #fee2e2; color: #dc2626; }
.co-trust-icon--blue  { background: #eff6ff; color: #2563eb; }
.co-trust-icon--orange{ background: #fff7ed; color: #ea580c; }

.co-trust-item strong {
    display: block;
    font-size: 0.83rem;
    color: var(--text-color);
    margin-bottom: 0.1rem;
}

.co-trust-item p {
    margin: 0;
    font-size: 0.76rem;
    color: var(--text-color-secondary);
    line-height: 1.4;
}

/* Barra inferior */

.co-bottom-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.1rem 1.5rem;
    border-radius: 1rem;
    background: var(--surface-100);
    border: 1px solid var(--surface-border);
}

.co-bottom-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    text-align: left;
}

.co-bottom-item i {
    font-size: 1.3rem;
    color: #2563eb;
    flex-shrink: 0;
}

.co-bottom-item strong {
    display: block;
    font-size: 0.8rem;
    color: var(--text-color);
}

.co-bottom-item span {
    font-size: 0.73rem;
    color: var(--text-color-secondary);
}

@media (max-width: 900px) {
    .co-layout {
        grid-template-columns: 1fr;
    }

    .co-right {
        position: static;
        order: -1;
    }

    .co-bottom-bar {
        grid-template-columns: 1fr;
    }
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
    display: none;
}

.checkout-summary {
    display: none;
}

.summary-label {
    display: none;
}

.summary-price {
    display: none;
}

.checkout-card {
    display: none;
}

.checkout-actions {
    display: none;
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
