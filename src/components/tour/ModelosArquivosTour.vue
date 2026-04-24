<template>
    <VOnboardingWrapper
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
                            @click="exit"
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
                            @click="next"
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

const STORAGE_KEY = 'psico_prontuario_tour_modelos_arquivos_v1';
const FIRST_TARGET = '[data-tour="tour-modelos-intro"]';

const popBottomStart = {
    popper: {
        placement: 'bottom-start',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'right'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

const popBottom = {
    popper: {
        placement: 'bottom',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

const popBottomEnd = {
    popper: {
        placement: 'bottom-end',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'left'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

function buildSteps(arquivos) {
    const list = Array.isArray(arquivos) ? arquivos : [];
    const first = list.length ? list[0] : null;

    const steps = [
        {
            attachTo: { element: '[data-tour="tour-modelos-intro"]' },
            content: {
                title: 'Modelos de Arquivos',
                description:
                    'Aqui você encontra documentos prontos (.docx) para usar na prática clínica. Você pode clicar no card para baixar, ou usar o botão Baixar dentro de cada modelo.'
            },
            options: popBottomStart
        },
        {
            attachTo: { element: '[data-tour="tour-modelos-grid"]' },
            content: {
                title: 'Catálogo de modelos',
                description:
                    'Os modelos aparecem em cards com categoria, tipo de arquivo e uma descrição rápida. Role a página para ver todos os itens disponíveis.'
            },
            options: popBottomStart
        }
    ];

    // Card por card (explicação do que é cada modelo)
    for (let i = 0; i < list.length; i++) {
        const a = list[i];
        const cardSel = a?.tourId ? `[data-tour="tour-modelos-card-${a.tourId}"]` : '[data-tour="tour-modelos-grid"]';

        steps.push({
            attachTo: { element: cardSel },
            content: {
                title: a?.titulo || `Modelo ${i + 1}`,
                description: a?.descricao
                    ? a.descricao
                    : 'Clique no card para iniciar o download deste modelo.'
            },
            options: popBottom
        });

        // Apenas no primeiro card, mostrar o botão de baixar
        if (i === 0 && a?.tourId) {
            steps.push({
                attachTo: { element: `[data-tour="tour-modelos-btn-${a.tourId}"]` },
                content: {
                    title: 'Botão Baixar',
                    description:
                        'Neste primeiro modelo, você também pode usar o botão Baixar para iniciar o download diretamente. Nos próximos passos vamos apenas explicar o que é cada modelo.'
                },
                options: popBottomEnd
            });
        }
    }

    steps.push({
        attachTo: { element: '[data-tour="tour-modelos-footer"]' },
        content: {
            title: 'Dica de edição',
            description:
                'Todos os modelos podem ser editados no Microsoft Word, Google Docs ou LibreOffice antes de imprimir ou enviar ao paciente.'
        },
        options: popBottomStart
    });

    return steps;
}

export default {
    name: 'ModelosArquivosTour',
    components: { VOnboardingWrapper, VOnboardingStep },
    props: {
        arquivos: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            wrapperOptions: {
                autoFinishByExit: true,
                hideButtons: { previous: true, next: true, exit: true },
                scrollToStep: {
                    enabled: true,
                    options: { behavior: 'smooth', block: 'center' }
                }
            },
            _autoStartTimer: null,
            _retryTimer: null
        };
    },
    computed: {
        steps() {
            return buildSteps(this.arquivos);
        }
    },
    mounted() {
        if (!this.isTourDismissed()) {
            this.scheduleAutoStart();
        }
    },
    beforeUnmount() {
        clearTimeout(this._autoStartTimer);
        clearTimeout(this._retryTimer);
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
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch {
                /* ignore */
            }
        },
        scheduleAutoStart() {
            clearTimeout(this._autoStartTimer);
            this._autoStartTimer = setTimeout(() => {
                this.$nextTick(() => this.tryStartWithRetry(0));
            }, 500);
        },
        tryStartWithRetry(attempt) {
            if (this.isTourDismissed()) return;
            const el = document.querySelector(FIRST_TARGET);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 || rect.height > 0) {
                    this.start();
                    return;
                }
            }
            if (attempt < 40) {
                this._retryTimer = setTimeout(() => this.tryStartWithRetry(attempt + 1), 200);
            }
        },
        start() {
            this.$nextTick(() => {
                const firstSel = this.steps?.[0]?.attachTo?.element;
                if (firstSel) {
                    const target = document.querySelector(firstSel);
                    const rect = target?.getBoundingClientRect?.();
                    const ok = target && rect && (rect.width > 0 || rect.height > 0);
                    if (!ok) {
                        this._retryTimer = setTimeout(() => this.tryStartWithRetry(0), 300);
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
    max-width: min(22rem, calc(100vw - 2rem));
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
    transition:
        background 0.2s ease,
        transform 0.2s ease;
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
