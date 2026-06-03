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

const STORAGE_KEY = 'psico_prontuario_tour_ficha_paciente_tab_evolucao_v1';

const popperBottomStart = {
    popper: {
        placement: 'bottom-start',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['bottom', 'top'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

const popperBottom = {
    popper: {
        placement: 'bottom',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['top'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

const STEPS = [
    {
        attachTo: { element: '[data-tour="tour-ficha-evolucao-resumo"]' },
        content: {
            title: 'Resumo da evolução',
            description:
                'Indicadores calculados a partir das métricas registradas nos prontuários: média atual, tendência, baseline e melhor período.'
        },
        options: popperBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-ficha-evolucao-graficos"]' },
        content: {
            title: 'Gráficos de evolução',
            description:
                'Visualize a evolução temporal e a comparação multidimensional quando houver métricas suficientes cadastradas nos prontuários.'
        },
        options: popperBottom
    },
    {
        attachTo: { element: '[data-tour="tour-ficha-evolucao-insights"]' },
        content: {
            title: 'Insights e disponibilidade',
            description:
                'Quando houver dados, os insights aparecem aqui. Sem métricas, a aba orienta a registrar informações nos prontuários para alimentar a evolução.'
        },
        options: popperBottom
    }
];

export default {
    name: 'FichaPacienteEvolucaoTour',
    components: { VOnboardingWrapper, VOnboardingStep },
    data() {
        return {
            dismissed: false,
            steps: STEPS,
            firstTargetSelector: '[data-tour="tour-ficha-evolucao-resumo"]',
            wrapperOptions: {
                autoFinishByExit: true,
                hideButtons: { previous: true, next: true, exit: true },
                scrollToStep: {
                    enabled: true,
                    options: { behavior: 'smooth', block: 'center' }
                }
            },
            _retryTimer: null,
            _observer: null
        };
    },
    mounted() {
        this.dismissed = this.isTourDismissed();
        if (this.dismissed) return;
        if (!this.steps?.length) return;
        this._retryTimer = setTimeout(() => this.watchForVisibilityWithRetry(0), 400);
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
        watchForVisibilityWithRetry(attempt) {
            if (this.dismissed || this.isTourDismissed()) return;
            const el = document.querySelector(this.firstTargetSelector);
            if (!el) {
                if (attempt < 120) {
                    this._retryTimer = setTimeout(() => this.watchForVisibilityWithRetry(attempt + 1), 200);
                }
                return;
            }

            this.destroyObserver();
            this._observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !this.dismissed && !this.isTourDismissed()) {
                        this.destroyObserver();
                        this.start();
                    }
                },
                { threshold: 0.05, rootMargin: '0px' }
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
            if (this.dismissed || this.isTourDismissed()) return;
            this.$nextTick(() => {
                const firstSel = this.steps?.[0]?.attachTo?.element;
                if (firstSel) {
                    const target = document.querySelector(firstSel);
                    const rect = target?.getBoundingClientRect?.();
                    const ok = target && rect && (rect.width > 0 || rect.height > 0);
                    if (!ok) {
                        this.destroyObserver();
                        this._retryTimer = setTimeout(() => this.watchForVisibilityWithRetry(0), 300);
                        return;
                    }
                }
                this.$refs.wrapper?.start?.();
            });
        }
    }
};
</script>

<style>
:root {
    --v-onboarding-overlay-z: 99990;
    --v-onboarding-step-z: 99991;
}
</style>

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
