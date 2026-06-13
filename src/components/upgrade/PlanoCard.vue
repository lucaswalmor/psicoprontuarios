<template>
    <article
        class="plano-card"
        :class="{
            popular: plan.popular,
            current: isCurrent
        }"
    >
        <div v-if="plan.popular" class="popular-badge">
            <i class="pi pi-star-fill"></i>
            <span>Mais Popular</span>
        </div>

        <div v-if="isCurrent" class="current-badge">
            <i class="pi pi-check-circle"></i>
            <span>Plano atual</span>
        </div>

        <header class="card-header">
            <h3 class="plan-name">{{ plan.nome }}</h3>
            <div class="plan-price">
                <span class="currency">R$</span>
                <span class="amount">{{ plan.precoInt }}</span>
                <span class="decimals">,{{ plan.precoDec }}</span>
                <span class="period">/mês</span>
            </div>
            <p class="plan-description">{{ plan.resumo || plan.descricao }}</p>
        </header>

        <ul class="features-list">
            <li
                v-for="(feature, idx) in plan.features"
                :key="idx + '-' + feature"
                class="feature-item"
                :class="{ highlight: idx === 0 && plan.popular && feature.includes('Simples') }"
            >
                <i class="pi pi-check"></i>
                <span v-html="featureHtml(feature)"></span>
            </li>
        </ul>

        <footer class="card-footer">
            <Button
                v-if="!isCurrent"
                label="Escolher plano"
                class="choose-btn w-full"
                :class="{ 'choose-btn--pro': plan.popular }"
                @click="$emit('select', plan)"
            />
            <div v-else class="current-plan-message">
                <i class="pi pi-info-circle"></i>
                <span>Este é seu plano atual</span>
            </div>
            <p class="cancel-hint">Cancele quando quiser</p>
        </footer>
    </article>
</template>

<script>
import Button from 'primevue/button';

export default {
    name: 'PlanoCard',
    components: { Button },
    props: {
        plan: {
            type: Object,
            required: true
        },
        isCurrent: {
            type: Boolean,
            default: false
        }
    },
    emits: ['select'],
    methods: {
        featureHtml(text) {
            if (!text.includes('Tudo do plano Simples')) return text;
            return text.replace('Tudo do plano Simples', '<strong>Tudo do plano Simples</strong>');
        }
    }
};
</script>

<style scoped>
.plano-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem 1.75rem 1.5rem;
    background: var(--surface-card);
    border: 1.5px solid var(--surface-border);
    border-radius: 1.25rem;
    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plano-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.plano-card.popular {
    border-color: #7c3aed;
    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.12);
}

.plano-card.current {
    opacity: 0.72;
}

.popular-badge {
    position: absolute;
    top: -0.85rem;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #7c3aed, #9333ea);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
}

.current-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    background: var(--surface-100);
    color: var(--text-color-secondary);
    font-size: 0.75rem;
    font-weight: 600;
}

.card-header {
    text-align: left;
    margin-bottom: 1.25rem;
    padding-top: 0.5rem;
}

.plan-name {
    margin: 0 0 0.75rem;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text-color);
}

.plan-price {
    display: flex;
    align-items: baseline;
    gap: 0.15rem;
    margin-bottom: 0.65rem;
    color: #2563eb;
    font-weight: 700;
}

.currency,
.decimals,
.period {
    font-size: 1.1rem;
    font-weight: 600;
}

.amount {
    font-size: 2.25rem;
    line-height: 1;
    font-weight: 800;
}

.plan-description {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--text-color-secondary);
}

.features-list {
    list-style: none;
    margin: 0 0 1.5rem;
    padding: 0;
    flex: 1;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.45rem 0;
    font-size: 0.9rem;
    line-height: 1.45;
    color: var(--text-color);
}

.feature-item i {
    margin-top: 0.15rem;
    color: #22c55e;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.feature-item.highlight {
    font-weight: 500;
}

.card-footer {
    margin-top: auto;
}

.choose-btn {
    border-radius: 0.75rem !important;
    padding: 0.85rem 1rem !important;
    font-weight: 600 !important;
    border: 2px solid #2563eb !important;
    background: transparent !important;
    color: #2563eb !important;
}

.choose-btn:hover {
    background: rgba(37, 99, 235, 0.06) !important;
}

.choose-btn--pro {
    border: none !important;
    background: linear-gradient(135deg, #7c3aed, #9333ea) !important;
    color: #fff !important;
}

.choose-btn--pro:hover {
    background: linear-gradient(135deg, #6d28d9, #7e22ce) !important;
}

.current-plan-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem;
    border-radius: 0.75rem;
    background: var(--surface-100);
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.cancel-hint {
    margin: 0.75rem 0 0;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
}

@media (max-width: 768px) {
    .plano-card {
        padding: 1.5rem 1.25rem 1.25rem;
    }

    .amount {
        font-size: 2rem;
    }
}
</style>
