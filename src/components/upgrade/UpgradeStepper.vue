<template>
    <div class="upgrade-stepper">
        <div class="stepper-container">
            <div 
                v-for="(step, index) in steps" 
                :key="step.id"
                class="step-item"
                :class="{ 
                    'active': currentStep === step.id,
                    'completed': currentStep > step.id,
                    'clickable': step.id < currentStep
                }"
                @click="step.id < currentStep ? $emit('step-change', step.id) : null"
            >
                <div class="step-icon">
                    <i :class="step.icon"></i>
                </div>
                <div class="step-content">
                    <h4 class="step-title">{{ step.title }}</h4>
                    <div class="step-line" v-if="index < steps.length - 1"></div>
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
        }
    },
    emits: ['step-change']
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

.step-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--surface-card);
    border: 3px solid var(--surface-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
}

.step-icon i {
    font-size: 1.5rem;
    color: var(--text-color-secondary);
    transition: color 0.3s ease;
}

.step-content {
    text-align: center;
    position: relative;
    width: 100%;
}

.step-title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    transition: color 0.3s ease;
}

.step-line {
    position: absolute;
    top: 30px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: var(--surface-border);
    transform: translateX(-50%);
    z-index: 1;
}

/* Estados dos steps */
.step-item.active .step-icon {
    background: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
}

.step-item.active .step-icon i {
    color: white;
}

.step-item.active .step-title {
    color: var(--primary-color);
    font-weight: 700;
}

.step-item.completed .step-icon {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.step-item.completed .step-icon i {
    color: white;
}

.step-item.completed .step-title {
    color: var(--primary-color);
}

.step-item.completed .step-line {
    background: var(--primary-color);
}

.step-item.clickable {
    cursor: pointer;
}

.step-item.clickable:hover .step-icon {
    transform: scale(1.05);
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
    
    .step-line {
        display: none;
    }
    
    .step-icon {
        width: 50px;
        height: 50px;
    }
    
    .step-icon i {
        font-size: 1.25rem;
    }
}
</style> 