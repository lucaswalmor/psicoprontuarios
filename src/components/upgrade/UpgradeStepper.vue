<template>
    <div class="upgrade-stepper">
        <div class="stepper-container">
            <div 
                v-for="step in steps" 
                :key="step.id"
                class="step-item"
                :class="{ 
                    'active': currentStep === step.id,
                    'completed': currentStep > step.id,
                    'clickable': canClickStep(step.id)
                }"
                @click="handleStepClick(step.id)"
            >
                <div class="step-content">
                    <h4 class="step-title">{{ step.title }}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UpgradeStepper',
    props: {
        currentStep: {
            type: Number,
            required: true
        },
        steps: {
            type: Array,
            required: true
        },
        selectedPlan: {
            type: Object,
            default: null
        }
    },
    emits: ['step-change'],
    methods: {
        canClickStep(stepId) {
            // Pode clicar para voltar (step anterior)
            if (stepId < this.currentStep) {
                return true;
            }
            // Pode clicar para avançar se estiver no step 1 e tiver plano selecionado
            if (stepId === 2 && this.currentStep === 1 && this.selectedPlan) {
                return true;
            }
            return false;
        },
        handleStepClick(stepId) {
            if (this.canClickStep(stepId)) {
                this.$emit('step-change', stepId);
            }
        }
    }
};
</script>

<style scoped>
.upgrade-stepper {
    margin: 2rem 0;
}

.stepper-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    max-width: 200px;
}

.step-content {
    text-align: center;
    position: relative;
    width: 100%;
    padding: 1rem 0;
}

.step-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    transition: color 0.3s ease;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    background: var(--surface-card);
    border: 2px solid var(--surface-border);
    transition: all 0.3s ease;
}

/* Estados dos steps */
.step-item.active .step-title {
    color: var(--primary-color);
    font-weight: 700;
    border-color: var(--primary-color);
    background: rgba(var(--primary-color-rgb), 0.1);
}

.step-item.completed .step-title {
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.step-item.clickable {
    cursor: pointer;
}

.step-item.clickable:hover .step-title {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
    .stepper-container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .step-item {
        max-width: none;
        width: 100%;
    }
    
    .step-title {
        width: 100%;
    }
}
</style> 