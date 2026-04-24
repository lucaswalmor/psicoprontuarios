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

const STORAGE_KEY = 'psico_prontuario_tour_dashboard_clinica_v1';
const FIRST_TARGET = '[data-tour="tour-clinica-pacientes"]';

const STEPS = [
    {
        attachTo: { element: '[data-tour="tour-clinica-pacientes"]' },
        content: {
            title: 'Total de pacientes',
            description: 'Quantidade total de pacientes cadastrados na sua base. Clique no cartão para abrir a lista completa.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-sessoes"]' },
        content: {
            title: 'Sessões do dia',
            description: 'Número de atendimentos agendados para hoje. Clique para ir direto à agenda e ver os horários.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-prontuarios"]' },
        content: {
            title: 'Prontuários (30 dias)',
            description: 'Quantidade de novos prontuários preenchidos no último mês. Ajuda a acompanhar o ritmo de registros clínicos.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-status"]' },
        content: {
            title: 'Status dos pacientes',
            description: 'Visão rápida da situação atual da sua base: pacientes Em Andamento (ativos), em Recesso (pausa temporária) e Concluídos (terapia finalizada).'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-metricas"]' },
        content: {
            title: 'Métricas de desempenho',
            description: 'Indicadores clínicos detalhados: tempo médio de tratamento, taxa de conclusão, percentual com anamnese e comparativo de novos vs. retornados no mês.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-proxima-sessao"]' },
        content: {
            title: 'Próxima sessão',
            description: 'Nome e horário do próximo paciente agendado. Use o botão "Ver Agenda" para acessar o calendário completo do dia.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-aniversariantes"]' },
        content: {
            title: 'Aniversariantes do mês',
            description: 'Lista de pacientes que fazem aniversário neste mês. Uma ótima oportunidade para um contato humanizado e envio de mensagens especiais.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-graficos-dist"]' },
        content: {
            title: 'Distribuição demográfica',
            description: 'Gráficos de Distribuição por Gênero e por Faixa Etária (0–18, 19–30, 31–50, 51+), gerados automaticamente com base na sua base de pacientes.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-evolucao-status"]' },
        content: {
            title: 'Evolução de status (6 meses)',
            description: 'Gráfico de linha mostrando como sua base de pacientes evoluiu nos últimos 6 meses: ativos, em recesso e concluídos.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-evolucao-pacientes"]' },
        content: {
            title: 'Evolução de pacientes (6 meses)',
            description: 'Comparativo visual entre novos cadastros e conclusões de caso no semestre. Útil para identificar tendências de crescimento ou queda.'
        }
    },
    {
        attachTo: { element: '[data-tour="tour-clinica-ultimos"]' },
        content: {
            title: 'Últimas movimentações',
            description: 'Acesso rápido aos 5 pacientes cadastrados mais recentemente e aos 5 prontuários preenchidos por último. Clique no ícone de olho para abrir a ficha.'
        }
    }
];

export default {
    name: 'DashboardGeralTour',
    components: { VOnboardingWrapper, VOnboardingStep },
    data() {
        return {
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
            if (attempt < 12) {
                this._retryTimer = setTimeout(() => this.tryStartWithRetry(attempt + 1), 200);
            }
        },
        start() {
            this.$nextTick(() => this.$refs.wrapper?.start?.());
        }
    }
};
</script>

<style>
/* Garante que o tour fique acima do sidebar e topbar em qualquer rota */
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
