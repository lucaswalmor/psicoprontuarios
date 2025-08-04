<template>
    <div 
        class="plano-card"
        :class="{ 
            'selected': isSelected,
            'current': isCurrent,
            'popular': plan.popular
        }"
        @click="$emit('select', plan)"
    >
        <!-- Badge Popular -->
        <div v-if="plan.popular" class="popular-badge">
            <i class="pi pi-star-fill me-2"></i>
            <span>Mais Popular</span>
        </div>

        <!-- Badge Plano Atual -->
        <div v-if="isCurrent" class="current-badge">
            <i class="pi pi-check-circle"></i>
            <span>Plano Atual</span>
        </div>

        <div class="card-header">
            <h3 class="plan-name">{{ plan.nome }}</h3>
            <div class="plan-price">{{ plan.preco }}</div>
            <p class="plan-description">{{ plan.descricao }}</p>
        </div>

        <div class="card-features">
            <h4>Recursos incluídos:</h4>
            <ul class="features-list">
                <li 
                    v-for="feature in plan.features" 
                    :key="feature"
                    class="feature-item"
                >
                    <i class="pi pi-check"></i>
                    <span>{{ feature }}</span>
                </li>
            </ul>
        </div>

        <div class="card-actions">
            <Button 
                v-if="!isCurrent"
                :label="isSelected ? 'Selecionado' : 'Selecionar Plano'"
                :class="isSelected ? 'p-button-success' : 'p-button-primary'"
                :disabled="isCurrent"
                @click.stop="$emit('select', plan)"
            />
            <div v-else class="current-plan-message">
                <i class="pi pi-info-circle"></i>
                <span>Este é seu plano atual</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlanoCard',
    props: {
        plan: {
            type: Object,
            required: true
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        isCurrent: {
            type: Boolean,
            default: false
        }
    },
    emits: ['select']
};
</script>

<style scoped>
.plano-card {
    background: var(--surface-card);
    border: 2px solid var(--surface-border);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: visible;
}

.plano-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--primary-color);
}

.plano-card.selected {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, var(--surface-card), rgba(var(--primary-color-rgb), 0.05));
    box-shadow: 0 8px 24px rgba(var(--primary-color-rgb), 0.2);
}

.plano-card.current {
    border-color: var(--surface-border);
    opacity: 0.7;
    cursor: not-allowed;
}

.plano-card.popular {
    border-color: var(--primary-color);
    box-shadow: 0 4px 16px rgba(var(--primary-color-rgb), 0.15);
}

.popular-badge {
    @apply absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium;
}

.current-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--surface-border);
    color: var(--text-color-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.card-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.plan-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
}

.plan-price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.plan-description {
    color: var(--text-color-secondary);
    margin: 0;
    font-size: 0.875rem;
}

.card-features {
    flex: 1;
    margin-bottom: 1.5rem;
}

.card-features h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 1rem 0;
}

.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.feature-item i {
    color: var(--primary-color);
    font-size: 0.875rem;
}

.card-actions {
    margin-top: auto;
}

.current-plan-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    padding: 1rem;
    background: var(--surface-ground);
    border-radius: 8px;
}

.current-plan-message i {
    color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
    .plano-card {
        padding: 1.5rem;
    }
    
    .plan-name {
        font-size: 1.25rem;
    }
    
    .plan-price {
        font-size: 1.5rem;
    }
    
    .popular-badge {
        font-size: 0.7rem;
        padding: 0.4rem 0.8rem;
        min-width: 100px;
        top: -12px;
    }
}
</style> 