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

const STORAGE_KEY = 'psico_prontuario_tour_agendamentos_v1';
const FIRST_TARGET = '[data-tour="tour-ag-calendario"]';

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

const STEPS = [
    {
        attachTo: { element: '[data-tour="tour-ag-calendario"]' },
        content: {
            title: 'Calendário da agenda',
            description:
                'Escolha o dia para ver os agendamentos à direita. Use as setas ou o cabeçalho do calendário para mudar de mês e ano. Dias que possuem pelo menos um agendamento ficam destacados.'
        },
        options: popBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-ag-feriados"]' },
        content: {
            title: 'Feriados do mês',
            description:
                'Lista os feriados nacionais e facultativos do Brasil referentes ao mês que você está visualizando no calendário — útil para planejar sessões e evitar surpresas.'
        },
        options: popBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-ag-header"]' },
        content: {
            title: 'Cabeçalho da agenda',
            description:
                'Mostra o rótulo Agendamentos e a data escolhida no calendário por extenso (dia da semana, dia, mês e ano). É o mesmo dia cujos compromissos aparecem na lista ao lado.'
        },
        options: popBottom
    },
    {
        attachTo: { element: '[data-tour="tour-ag-novo"]' },
        content: {
            title: '+ Novo Agendamento',
            description:
                'Abre o formulário para escolher paciente, data e horário, ativar lembrete por WhatsApp no dia da consulta (com WhatsApp conectado nas configurações) e, se quiser, repetir nos próximos 12 meses. Ao salvar, o compromisso entra na lista e o dia ganha marcação no calendário.'
        },
        options: {
            popper: {
                placement: 'bottom-end',
                modifiers: [
                    { name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'left'] } },
                    { name: 'preventOverflow', options: { padding: 8 } }
                ]
            }
        }
    },
    {
        attachTo: { element: '[data-tour="tour-ag-area-dia"]' },
        content: {
            title: 'Agenda do dia',
            description:
                'Se for hoje, aparece o horário atual (Agora). Com compromissos, cada linha mostra horário e nome: clique para abrir o editor, salvar alterações, excluir só esta consulta ou todas as relacionadas quando houver série. Sem itens, a área orienta a usar + Novo Agendamento.'
        },
        options: popBottom
    }
];

export default {
    name: 'AgendamentosTour',
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
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch {
                /* ignore */
            }
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
