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

const STORAGE_KEY = 'psico_prontuario_tour_chamados_lista_v1';
const FIRST_TARGET = '[data-tour="tour-chamados-header"]';

const popBottomStart = {
    popper: {
        placement: 'bottom-start',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'right'] } },
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

const popBottom = {
    popper: {
        placement: 'bottom',
        modifiers: [
            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

const STEPS = [
    {
        attachTo: { element: '[data-tour="tour-chamados-titulo"]' },
        content: {
            title: 'Meus Chamados',
            description:
                'Aqui você acompanha seus atendimentos com o suporte: veja status, última resposta e entre no chamado para conversar e anexar informações.'
        },
        options: popBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-chamados-novo"]' },
        content: {
            title: 'Novo Chamado',
            description:
                'Crie um novo atendimento quando precisar de ajuda. Você escolhe o tema, descreve o problema e acompanha as respostas por aqui.'
        },
        options: popBottomEnd
    },
    {
        attachTo: { element: '[data-tour="tour-chamados-filtros"]' },
        content: {
            title: 'Busca e filtros',
            description:
                'Use a busca para procurar por título/mensagem e filtre por status para encontrar um chamado mais rápido. Pressione Enter na busca para aplicar.'
        },
        options: popBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-chamados-status"]' },
        content: {
            title: 'Filtro por status',
            description:
                'Escolha Aberto, Em andamento, Respondido ou Fechado. Você também pode limpar o filtro pelo “x” do campo.'
        },
        options: popBottom
    },
    {
        attachTo: { element: '[data-tour="tour-chamados-filtrar"]' },
        content: {
            title: 'Aplicar filtros',
            description:
                'Clique em Filtrar para atualizar a lista com os critérios escolhidos. A paginação também volta para o início ao aplicar filtros.'
        },
        options: popBottomEnd
    },
    {
        attachTo: { element: '[data-tour="tour-chamados-limpar"]' },
        content: {
            title: 'Limpar',
            description:
                'Remove a busca e o status selecionado, voltando para a lista completa de chamados.'
        },
        options: popBottomEnd
    },
    {
        attachTo: { element: '[data-tour="tour-chamados-tabela"]' },
        content: {
            title: 'Lista de chamados',
            description:
                'Cada linha mostra título, tema, status e a data da última resposta. Use o botão Abrir para entrar no chamado e continuar a conversa com o suporte.'
        },
        options: popBottom
    }
];

export default {
    name: 'ListaChamadosTour',
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
            _autoStartTimer: null,
            _retryTimer: null
        };
    },
    mounted() {
        this.dismissed = this.isTourDismissed();
        if (!this.dismissed) {
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
            if (this.dismissed) return;
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch {
                /* ignore */
            }
            userService.salvarTourFinalizado(STORAGE_KEY);
            this.dismissed = true;
            try {
                this.$refs.wrapper?.finish?.();
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
            if (this.dismissed || this.isTourDismissed()) return;
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
                const firstSel = STEPS[0]?.attachTo?.element;
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
