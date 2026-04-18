<template>
    <div class="container p-4 mb-4">
        <div class="upgrade-layout-grid">
            <!-- Card Esquerda -->
            <div class="left-card">
                <div class="card-content-left">
                    <!-- Header -->
                    <div class="plan-info-left">
                        <h1>Upgrade de Plano</h1>
                        <div class="current-plan-badge-left" :class="currentPlanClass">
                            <i class="pi pi-crown"></i>
                            <span>Você está no plano {{ currentPlanName }}</span>
                        </div>
                    </div>

                    <!-- Mensagem de Trial (apenas no step 2) -->
                    <div class="trial-notice-left">
                        <i class="pi pi-gift"></i>
                        <div class="trial-content-left">
                            <h4>🎉 7 dias gratuitos para teste!</h4>
                            <p>Você terá acesso completo ao plano por 7 dias sem cobrança. Após esse período, a cobrança será automática. Pode cancelar a qualquer momento dentro dos 7 dias.</p>
                        </div>
                    </div>

                    <!-- Resumo do Plano (apenas no step 2) -->
                    <div v-if="currentStep === 2 && selectedPlan && !pagamentoSucesso" class="plan-summary-left">
                        <div class="summary-item-left">
                            <span class="label">Plano Atual:</span>
                            <span class="value">{{ currentPlanName }}</span>
                        </div>
                        <div class="summary-item-left">
                            <span class="label">Novo Plano:</span>
                            <span class="value">{{ selectedPlan?.nome }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card Direita (maior) -->
            <div class="right-card">
                <div class="card-content-right">
                    <!-- Mensagem de sucesso após pagamento -->
                    <div v-if="pagamentoSucesso" class="sucesso-container">
                        <SucessoPagamento 
                            :plano-nome="planoContratado"
                            @continuar="irParaDashboard"
                        />
                    </div>

                    <!-- Conteúdo principal (oculto quando pagamentoSucesso) -->
                    <div v-else>
                        <!-- Stepper de progresso -->
                        <UpgradeStepper 
                            :current-step="currentStep" 
                            :steps="steps"
                            :selected-plan="selectedPlan"
                            @step-change="handleStepChange"
                        />

                        <!-- Step 1: Escolha do plano -->
                        <div v-if="currentStep === 1" class="step-content">
                            <h2>Escolha seu novo plano</h2>
                            <p class="step-description">
                                Selecione o plano que melhor atende às suas necessidades
                            </p>
                            
                            <div v-if="loadingPlanos" class="plans-loading text-center py-5">
                                <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                                <p class="mt-3 mb-0 text-color-secondary">Carregando planos…</p>
                            </div>
                            <Message v-else-if="erroPlanos" severity="error" :closable="false" class="mb-3">
                                {{ erroPlanos }}
                            </Message>
                            <div v-else class="plans-grid">
                                <PlanoCard
                                    v-for="plan in availablePlans"
                                    :key="plan.id"
                                    :plan="plan"
                                    :is-selected="selectedPlan?.id === plan.id"
                                    :is-current="isPlanoAtual(plan)"
                                    @select="selectPlan"
                                />
                            </div>
                        </div>

                        <!-- Step 2: Pagamento -->
                        <div v-if="currentStep === 2" class="step-content">
                            <h2>Finalizar Pagamento</h2>
                            <p class="step-description">
                                Complete o pagamento para ativar seu novo plano
                            </p>

                            <div class="payment-form-container">
                                <div class="payment-form-card">
                                    <CartaoAsaas
                                        :loading="loading"
                                        @submit="processarPagamento"
                                    />
                                </div>
                            </div>

                            <div class="step-actions">
                                <Button 
                                    label="Voltar" 
                                    @click="previousStep"
                                    class="p-button-secondary"
                                    :disabled="loading"
                                />
                            </div>
                        </div>

                        <!-- FAQ Section -->
                        <div class="faq-section">
                            <h3>Perguntas Frequentes</h3>
                            <FaqModal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/store/plan';
import { useAsaas } from '@/composables/useAsaas';
import { useToast } from 'primevue/usetoast';
import Message from 'primevue/message';
import planService, { parseDescricaoPlano } from '@/services/planService';
import UpgradeStepper from '@/components/upgrade/UpgradeStepper.vue';
import PlanoCard from '@/components/upgrade/PlanoCard.vue';
import FaqModal from '@/components/upgrade/FaqModal.vue';
import CartaoAsaas from '@/components/checkout/CartaoAsaas.vue';
import SucessoPagamento from '@/components/checkout/SucessoPagamento.vue';

export default {
    name: 'Upgrade',
    components: {
        UpgradeStepper,
        PlanoCard,
        FaqModal,
        CartaoAsaas,
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

        const steps = [
            { id: 1, title: 'Escolha do Plano' },
            { id: 2, title: 'Pagamento' }
        ];

        function mapearPlanoApi(p) {
            const precoNum = Number(p.preco);
            const precoOk = Number.isFinite(precoNum);
            const slug = String(p.slug || '').toLowerCase();
            const nomeLower = String(p.nome || '').toLowerCase();
            const vitalicio = slug === 'vitalicio' || nomeLower.includes('vitalício') || nomeLower.includes('vitalicio');
            const precoStr = precoOk
                ? (vitalicio ? `R$ ${precoNum.toFixed(2).replace('.', ',')} (pagamento único)` : `R$ ${precoNum.toFixed(2).replace('.', ',')}/mês`)
                : 'Consulte valores';

            const { resumo, itens } = parseDescricaoPlano(p.descricao);
            const features = [];
            if (p.trial_dias > 0) {
                features.push(`${p.trial_dias} dia${p.trial_dias > 1 ? 's' : ''} de trial gratuito`);
            }
            features.push(...itens);
            if (!features.length) {
                features.push('Acesso às funcionalidades do sistema');
            }

            return {
                id: p.id,
                nome: p.nome,
                slug,
                preco: precoStr,
                /** Texto curto abaixo do preço (cabeçalho do card) */
                resumo: resumo || String(p.descricao || '').trim() || '',
                /** Compat: mesma coisa que o resumo quando o formato novo está em uso */
                descricao: resumo || '',
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
                planosList.value = arr.map((p) => mapearPlanoApi(p));
            } catch (e) {
                console.error('Erro ao carregar planos:', e);
                erroPlanos.value = 'Não foi possível carregar os planos. Tente atualizar a página.';
                planosList.value = [];
            } finally {
                loadingPlanos.value = false;
            }
        }

        const currentPlanName = computed(() => planStore.planoNome || 'Livre');

        const currentPlanClass = computed(() => {
            const plan = currentPlanName.value.toLowerCase().replace(/\s+/g, '-');
            return `plan-${plan}`;
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

        // Methods
        const selectPlan = (plan) => {
            selectedPlan.value = plan;
            // Ir automaticamente para a próxima etapa ao selecionar um plano
            if (currentStep.value === 1) {
                nextStep();
            }
        };

        const nextStep = () => {
            if (currentStep.value < steps.length) {
                currentStep.value++;
            }
        };

        const previousStep = () => {
            if (currentStep.value > 1) {
                currentStep.value--;
            }
        };

        const handleStepChange = (step) => {
            currentStep.value = step;
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
            try {
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

        // Método para ir ao dashboard após sucesso
        const irParaDashboard = () => {
            router.push('/dashboard');
        };

        // Lifecycle
        onMounted(async () => {
            await carregarPlanos();
            const nome = currentPlanName.value.toLowerCase();
            if (nome === 'profissional' || nome === 'vitalício' || nome === 'vitalicio') {
                router.push('/dashboard');
            }
        });

        return {
            currentStep,
            selectedPlan,
            pagamentoSucesso,
            planoContratado,
            steps,
            currentPlanName,
            currentPlanClass,
            availablePlans,
            loadingPlanos,
            erroPlanos,
            isPlanoAtual,
            selectPlan,
            nextStep,
            previousStep,
            handleStepChange,
            processarPagamento,
            irParaDashboard,
            loading: asaas.loading
        };
    }
};
</script>

<style scoped>


.upgrade-layout-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 1.5rem;
    margin: 0 auto;
}

/* Card Esquerda */
.left-card {
    background: var(--surface-card);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--surface-border);
    height: fit-content;
    position: sticky;
    top: 1.5rem;
}

.card-content-left {
    padding: 2rem;
}

.plan-info-left {
    text-align: center;
    margin-bottom: 2rem;
}

.plan-info-left h1 {
    margin: 0 0 1rem 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-color);
}

.current-plan-badge-left {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-600));
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.9rem;
}

.current-plan-badge-left i {
    color: #ffd700;
}

.trial-notice-left {
    background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
    border: 2px solid #4caf50;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
}

.trial-notice-left i {
    color: #4caf50;
    font-size: 1.5rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
}

.trial-content-left h4 {
    margin: 0 0 0.5rem 0;
    color: #2e7d32;
    font-size: 1rem;
    font-weight: 700;
}

.trial-content-left p {
    margin: 0;
    color: #388e3c;
    font-size: 0.875rem;
    line-height: 1.5;
}

.plan-summary-left {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid var(--surface-border);
}

.summary-item-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--surface-border);
}

.summary-item-left:last-child {
    border-bottom: none;
}

.summary-item-left .label {
    font-weight: 600;
    color: var(--text-color);
    font-size: 0.9rem;
}

.summary-item-left .value {
    color: var(--primary-color);
    font-weight: 700;
    font-size: 0.95rem;
}

/* Card Direita */
.right-card {
    background: var(--surface-card);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--surface-border);
}

.card-content-right {
    padding: 2rem;
}

.sucesso-container {
    padding: 2rem 0;
}

.upgrade-content {
    margin: 2rem 0;
}

.step-content {
    max-width: 800px;
    margin: 0 auto;
}

.step-content h2 {
    text-align: center;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
    color: var(--text-color);
}

.step-description {
    text-align: center;
    color: var(--text-color-secondary);
    margin-bottom: 1rem;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
    margin-top: 1rem;
    position: relative;
}

.step-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.confirmation-card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.plan-summary h3 {
    margin-bottom: 1.5rem;
    color: var(--text-color);
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--surface-border);
}

.summary-item:last-child {
    border-bottom: none;
}

.summary-item .label {
    font-weight: 600;
    color: var(--text-color);
}

.summary-item .value {
    color: var(--text-color-secondary);
}

.summary-item .value.price {
    color: var(--primary-color);
    font-weight: 700;
    font-size: 1.2rem;
}

.plan-features {
    margin-top: 2rem;
}

.plan-features h4 {
    margin-bottom: 1rem;
    color: var(--text-color);
}

.plan-features ul {
    list-style: none;
    padding: 0;
}

.plan-features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: var(--text-color-secondary);
}

.plan-features li i {
    color: var(--primary-color);
}

.payment-form-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
}

.payment-form-card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--surface-border);
    max-width: 600px;
    width: 100%;
}

.payment-section {
    max-width: 600px;
    margin: 0 auto;
}

.faq-section {
    margin-top: 4rem;
    text-align: center;
}

.faq-section h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
}


/* Responsive */
@media (max-width: 1024px) {
    .upgrade-layout-grid {
        grid-template-columns: 1fr;
    }
    
    .left-card {
        position: relative;
        top: 0;
    }
}

@media (max-width: 768px) {
    .upgrade-page-container {
        padding: 1rem;
    }
    
    .card-content-left,
    .card-content-right {
        padding: 1.5rem;
    }
    
    .plan-info-left h1 {
        font-size: 1.5rem;
    }
    
    .plans-grid {
        grid-template-columns: 1fr;
    }
    
    .payment-form-container {
        margin: 1.5rem 0;
    }
    
    .payment-form-card {
        padding: 1.5rem;
    }
    
    .step-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .trial-notice-left {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }
    
    .trial-notice-left i {
        margin-top: 0;
    }
    
    .plan-price-large {
        font-size: 2rem;
    }
}
</style> 