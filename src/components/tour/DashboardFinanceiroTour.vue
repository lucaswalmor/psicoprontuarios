<template>
    <VOnboardingWrapper
        v-if="!dismissed"
        ref="wrapper"
        :steps="steps"
        :options="wrapperOptions"
        @finish="onTourDone"
        @exit="onTourDone"
    >
        <template #default="{ step, next, previous, exit, isFirst, isLast, index }">
            <VOnboardingStep>
                <div class="dtour">
                    <div class="dtour__dots">
                        <span
                            v-for="(_, i) in steps"
                            :key="i"
                            class="dtour__dot"
                            :class="{ 'dtour__dot--active': i === index }"
                        />
                    </div>

                    <h3 v-if="step?.content?.title" class="dtour__title">
                        {{ step.content.title }}
                    </h3>

                    <p v-if="step?.content?.description" class="dtour__desc">
                        {{ step.content.description }}
                    </p>

                    <div class="dtour__actions">
                        <button
                            v-if="isFirst"
                            type="button"
                            class="dtour__btn dtour__btn--ghost"
                            @click="() => { onTourDone(); exit(); }"
                        >
                            Finalizar
                        </button>
                        <button
                            v-else
                            type="button"
                            class="dtour__btn dtour__btn--ghost"
                            @click="previous"
                        >
                            ← Voltar
                        </button>

                        <button
                            type="button"
                            class="dtour__btn dtour__btn--primary"
                            @click="() => { if (isLast) { onTourDone(); exit(); } else { next(); } }"
                        >
                            {{ isLast ? 'Concluir' : 'Próximo →' }}
                        </button>
                    </div>
                </div>
            </VOnboardingStep>
        </template>
    </VOnboardingWrapper>
</template>

<script>
import { VOnboardingWrapper, VOnboardingStep } from 'v-onboarding';
import userService from '@/services/userService';

const STORAGE_KEY = 'psico_prontuario_tour_dashboard_financeiro_v1';
const FIRST_TARGET = '[data-tour="tour-fin-receitas"]';

const STEPS = [
    {
        attachTo: { element: '[data-tour="tour-fin-receitas"]' },
        content: {
            title: 'Receitas do mês',
            description: 'Total de receitas registradas no mês atual. Clique no cartão para acessar a lista completa com status, categorias e datas de cada lançamento.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-fin-despesas"]' },
        content: {
            title: 'Despesas do mês',
            description: 'Total de despesas pagas e previstas no período. Clique para gerenciar por categoria, tipo de pagamento (à vista ou parcelado) e status.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-fin-saldo"]' },
        content: {
            title: 'Saldo do período',
            description: 'Diferença entre receitas e despesas no mês selecionado. Saldo positivo aparece em verde; negativo em vermelho.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-fin-fluxo"]' },
        content: {
            title: 'Fluxo de caixa',
            description: 'Gráfico de barras com a evolução de receitas e despesas no período. Use os filtros rápidos (DIA, SEMANA, MÊS, TRIMESTRE) ou defina datas personalizadas.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-fin-resumo-anual"]' },
        content: {
            title: 'Resumo anual',
            description: 'Visão consolidada do ano: total de receitas, despesas e saldo anual. Ideal para acompanhar a saúde financeira do consultório ao longo do ano.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-fin-categorias"]' },
        content: {
            title: 'Receitas e despesas por categoria',
            description: 'Detalhamento das movimentações do mês agrupadas por categoria (ex: Consultas, Aluguel). Ajuda a identificar onde entra e sai mais dinheiro.'
        }
    }
];

export default {
    name: 'DashboardFinanceiroTour',
    components: { VOnboardingWrapper, VOnboardingStep },
    data() {
        return {
            dismissed: false,
            steps: STEPS,
            wrapperOptions: {
                autoFinishByExit: true,
                hideButtons: { previous: true, next: true, exit: true },
                scrollToStep: {
                    enabled: true,
                    options: { behavior: 'smooth', block: 'center' }
                }
            },
            _observer: null,
            _retryTimer: null
        };
    },
    mounted() {
        this.dismissed = this.isTourDismissed();
        if (!this.dismissed) {
            /* Aguarda o DOM estabilizar e então observa a visibilidade do 1º elemento.
               Quando a aba Financeiro é ativada (display: none → block),
               o IntersectionObserver dispara e o tour inicia automaticamente. */
            this._retryTimer = setTimeout(() => this.watchForVisibility(), 400);
        }
    },
    beforeUnmount() {
        clearTimeout(this._retryTimer);
        this.destroyObserver();
    },
    methods: {
        isTourDismissed() {
            try {
                return localStorage.getItem(STORAGE_KEY) === '1';
            } catch {
                return false;
            }
        },
        onTourDone() {
            if (this.dismissed) return;
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch {
                /* ignore */
            }
            userService.salvarTourFinalizado(STORAGE_KEY);
            this.dismissed = true;
            this.destroyObserver();
            try {
                this.$refs.wrapper?.finish?.();
            } catch {
                /* ignore */
            }
        },
        watchForVisibility() {
            if (this.dismissed || this.isTourDismissed()) return;
            const el = document.querySelector(FIRST_TARGET);
            if (!el) return;

            this._observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !this.dismissed && !this.isTourDismissed()) {
                        this.destroyObserver();
                        this.start();
                    }
                },
                { threshold: 0.1 }
            );

            this._observer.observe(el);
        },
        destroyObserver() {
            if (this._observer) {
                this._observer.disconnect();
                this._observer = null;
            }
        },
        start() {
            this.$nextTick(() => this.$refs.wrapper?.start?.());
        }
    }
};
</script>

<style scoped>
.dtour {
    width: 22rem;
    background: #ffffff;
    border-radius: 14px;
    padding: 1.375rem 1.5rem 1.25rem;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.07),
        0 10px 24px -4px rgba(0, 0, 0, 0.11);
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.dtour__dots {
    display: flex;
    gap: 0.3125rem;
    margin-bottom: 0.25rem;
}

.dtour__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e4e4e7;
    transition: background 0.2s ease, transform 0.2s ease;
}

.dtour__dot--active {
    background: var(--p-primary-color, #6366f1);
    transform: scale(1.2);
}

.dtour__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #18181b;
}

.dtour__desc {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.55;
    color: #71717a;
}

.dtour__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.375rem;
}

.dtour__btn {
    flex: 1;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.625rem 1rem;
    border-radius: 8px;
    border: 1px solid transparent;
    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        opacity 0.15s ease;
}

.dtour__btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.22);
}

.dtour__btn--primary {
    background: #18181b;
    color: #ffffff;
    border-color: #18181b;
    box-shadow: none;
}

.dtour__btn--primary:hover {
    background: #3f3f46;
    border-color: #3f3f46;
    box-shadow: none;
    opacity: 1;
}

.dtour__btn--ghost {
    background: transparent;
    color: #52525b;
    border-color: #e4e4e7;
}

.dtour__btn--ghost:hover {
    background: #f4f4f5;
    border-color: #a1a1aa;
    color: #18181b;
}
</style>
