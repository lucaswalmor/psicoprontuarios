<template>
    <Card class="mb-5">
        <template #content>
            <div>
                <!-- Cabeçalho com plano atual -->
                <div class="current-plan-header">
                    <div class="container">
                        <div class="plan-info">
                            <h1>Upgrade de Plano</h1>
                            <div class="current-plan-badge" :class="currentPlanClass">
                                <i class="pi pi-crown"></i>
                                <span class="text-800">Você está no plano {{ currentPlanName }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <!-- Stepper de progresso -->
                    <UpgradeStepper 
                        :current-step="currentStep" 
                        :steps="steps"
                        @step-change="handleStepChange"
                    />

                    <!-- Conteúdo baseado no step atual -->
                    <div class="upgrade-content4">
                        <!-- Step 1: Escolha do plano -->
                        <div v-if="currentStep === 1" class="step-content pt-6">
                            <h2>Escolha seu novo plano</h2>
                            <p class="step-description">
                                Selecione o plano que melhor atende às suas necessidades
                            </p>
                            
                            <div class="plans-grid">
                                <PlanoCard
                                    v-for="plan in availablePlans"
                                    :key="plan.id"
                                    :plan="plan"
                                    :is-selected="selectedPlan?.id === plan.id"
                                    :is-current="plan.nome === currentPlanName"
                                    @select="selectPlan"
                                />
                            </div>

                            <div class="step-actions">
                                <Button 
                                    label="Continuar" 
                                    :disabled="!selectedPlan"
                                    @click="nextStep"
                                    class="p-button-primary"
                                />
                            </div>
                        </div>

                        <!-- Step 2: Confirmação -->
                        <div v-if="currentStep === 2" class="step-content">
                            <h2>Confirme sua escolha</h2>
                            <p class="step-description">
                                Revise os detalhes do seu upgrade
                            </p>

                            <!-- Aviso sobre período gratuito -->
                            <div class="trial-notice">
                                <i class="pi pi-gift"></i>
                                <div class="trial-content">
                                    <h4>🎉 7 dias gratuitos para teste!</h4>
                                    <p>Você terá acesso completo ao plano por 7 dias sem cobrança. Após esse período, a cobrança será automática. Pode cancelar a qualquer momento dentro dos 7 dias.</p>
                                </div>
                            </div>

                            <div class="confirmation-card">
                                <div class="plan-summary">
                                    <h3>Resumo do Upgrade</h3>
                                    <div class="summary-item">
                                        <span class="label">Plano Atual:</span>
                                        <span class="value">{{ currentPlanName }}</span>
                                    </div>
                                    <div class="summary-item">
                                        <span class="label">Novo Plano:</span>
                                        <span class="value">{{ selectedPlan?.nome }}</span>
                                    </div>
                                    <div class="summary-item">
                                        <span class="label">Valor:</span>
                                        <span class="value price">{{ selectedPlan?.preco }}</span>
                                    </div>
                                </div>

                                <div class="plan-features">
                                    <h4>Recursos incluídos:</h4>
                                    <ul>
                                        <li v-for="feature in selectedPlan?.features" :key="feature">
                                            <i class="pi pi-check"></i>
                                            {{ feature }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="step-actions">
                                <Button 
                                    label="Voltar" 
                                    @click="previousStep"
                                    class="p-button-secondary"
                                />
                                <Button 
                                    label="Prosseguir para Pagamento" 
                                    @click="nextStep"
                                    class="p-button-primary"
                                />
                            </div>
                        </div>

                        <!-- Step 3: Pagamento -->
                        <div v-if="currentStep === 3" class="step-content">
                            <h2>Pagamento</h2>
                            <p class="step-description">
                                Complete o pagamento para ativar seu novo plano
                            </p>

                            <div class="payment-section">
                                <PaymentForm 
                                    :plan="selectedPlan"
                                    @payment-success="handlePaymentSuccess"
                                    @payment-error="handlePaymentError"
                                />
                            </div>

                            <div class="step-actions">
                                <Button 
                                    label="Voltar" 
                                    @click="previousStep"
                                    class="p-button-secondary"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- FAQ Section -->
                    <div class="faq-section mb-5">
                        <h3>Perguntas Frequentes</h3>
                        <FaqModal />
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/store/plan';
import UpgradeStepper from '@/components/upgrade/UpgradeStepper.vue';
import PlanoCard from '@/components/upgrade/PlanoCard.vue';
import PaymentForm from '@/components/upgrade/PaymentForm.vue';
import FaqModal from '@/components/upgrade/FaqModal.vue';

export default {
    name: 'Upgrade',
    components: {
        UpgradeStepper,
        PlanoCard,
        PaymentForm,
        FaqModal
    },
    setup() {
        const router = useRouter();
        const planStore = usePlanStore();
        
        const currentStep = ref(1);
        const selectedPlan = ref(null);
        
        const steps = [
            { id: 1, title: 'Escolha do Plano', icon: 'pi pi-list' },
            { id: 2, title: 'Confirmação', icon: 'pi pi-check-circle' },
            { id: 3, title: 'Pagamento', icon: 'pi pi-credit-card' }
        ];

        // Computed properties
        const currentPlanName = computed(() => {
            return planStore.planInfo?.nome || 'Gratuito';
        });

        const currentPlanClass = computed(() => {
            const plan = currentPlanName.value.toLowerCase();
            return `plan-${plan}`;
        });

                const availablePlans = computed(() => {
            const currentPlan = currentPlanName.value;

            if (currentPlan === 'Gratuito') {
                return [
                    {
                        id: 2, // ID do plano Essencial no banco
                        nome: 'Essencial',
                        preco: 'R$ 29,90/mês',
                        descricao: 'Perfeito para psicólogos em crescimento',
                        features: [
                            'Até 15 pacientes',
                            'Agendamentos',
                            'Até 200 anexos',
                            'Prontuários PDF',
                            'Dashboard',
                            'Backup Automático',
                            'Suporte por email',
                            'Prontuários ilimitados'
                        ],
                        popular: true
                    },
                    {
                        id: 3, // ID do plano Profissional no banco
                        nome: 'Profissional',
                        preco: 'R$ 59,90/mês',
                        descricao: 'Solução completa para profissionais estabelecidos',
                        features: [
                            'Até 30 pacientes',
                            'Agendamentos',
                            'Anexos ilimitados',
                            'Prontuários PDF',
                            'Dashboard',
                            'Gestão Financeira',
                            'Backup Automático',
                            'Suporte completo',
                            'Prontuários ilimitados'
                        ],
                        popular: false
                    }
                ];
            } else if (currentPlan === 'Essencial') {
                return [
                    {
                        id: 3, // ID do plano Profissional no banco
                        nome: 'Profissional',
                        preco: 'R$ 59,90/mês',
                        descricao: 'Solução completa para profissionais estabelecidos',
                        features: [
                            'Até 30 pacientes',
                            'Agendamentos',
                            'Anexos ilimitados',
                            'Prontuários PDF',
                            'Dashboard',
                            'Gestão Financeira',
                            'Backup Automático',
                            'Suporte completo',
                            'Prontuários ilimitados'
                        ],
                        popular: false
                    }
                ];
            }
            
            return [];
        });

        // Methods
        const selectPlan = (plan) => {
            selectedPlan.value = plan;
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

        const handlePaymentSuccess = () => {
            // Atualizar informações do plano
            planStore.fetchPlanInfo();
            
            // Mostrar mensagem de sucesso
            // O modal de sucesso será mostrado pelo PaymentForm
        };

        const handlePaymentError = (error) => {
            console.error('Erro no pagamento:', error);
            // Mostrar mensagem de erro
        };

        // Lifecycle
        onMounted(async () => {
            // Carregar informações do plano se não estiverem carregadas
            if (!planStore.hasPlanData) {
                await planStore.fetchPlanInfo();
            }
            
            // Verificar se o usuário pode fazer upgrade
            if (currentPlanName.value === 'Profissional' || currentPlanName.value === 'Vitalício') {
                router.push('/dashboard');
            }
        });

        return {
            currentStep,
            selectedPlan,
            steps,
            currentPlanName,
            currentPlanClass,
            availablePlans,
            selectPlan,
            nextStep,
            previousStep,
            handleStepChange,
            handlePaymentSuccess,
            handlePaymentError
        };
    }
};
</script>

<style scoped>
.current-plan-header {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-600));
    color: white;
    padding: 2rem 0;
    margin-bottom: 2rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.plan-info {
    text-align: center;
}

.plan-info h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.current-plan-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    backdrop-filter: blur(10px);
}

.current-plan-badge i {
    color: #ffd700;
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
    color: var(--text-color);
}

.step-description {
    text-align: center;
    color: var(--text-color-secondary);
    margin-bottom: 2rem;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
    padding-top: 1rem;
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

.trial-notice {
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

.trial-notice i {
    color: #4caf50;
    font-size: 1.5rem;
    margin-top: 0.25rem;
}

.trial-content h4 {
    margin: 0 0 0.5rem 0;
    color: #2e7d32;
    font-size: 1.1rem;
    font-weight: 700;
}

.trial-content p {
    margin: 0;
    color: #388e3c;
    font-size: 0.95rem;
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
    .plan-info h1 {
        font-size: 2rem;
    }
    
    .plans-grid {
        grid-template-columns: 1fr;
    }
    
    .step-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .trial-notice {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }
    
    .trial-notice i {
        margin-top: 0;
    }
}
</style> 