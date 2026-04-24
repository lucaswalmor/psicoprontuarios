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
                    <h3 v-if="step?.content?.title" class="dtour__title">{{ step.content.title }}</h3>
                    <p v-if="step?.content?.description" class="dtour__desc">{{ step.content.description }}</p>
                    <div class="dtour__actions">
                        <button v-if="isFirst" type="button" class="dtour__btn dtour__btn--ghost" @click="exit">Finalizar</button>
                        <button v-else type="button" class="dtour__btn dtour__btn--ghost" @click="previous">← Voltar</button>
                        <button type="button" class="dtour__btn dtour__btn--primary" @click="next">
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

const STORAGE_KEY = 'psico_prontuario_tour_meu_site_especialidades_v1';

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
            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom'] } },
            { name: 'preventOverflow', options: { padding: 8 } }
        ]
    }
};

const STEPS = [
    {
        attachTo: { element: '[data-tour="tour-meusite-esp-temas-intro"]' },
        content: {
            title: 'Especialidades (temas)',
            description:
                'Aqui você escolhe os temas clínicos ou de atuação que descrevem seu trabalho. Eles viram cards na landing para visitantes entenderem seu foco.'
        },
        options: popperBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-meusite-esp-temas-chips"]' },
        content: {
            title: 'Seleção de temas',
            description:
                'Área dos chips (ou carregamento enquanto a lista busca o servidor). Clique em cada chip para marcar ou desmarcar; selecionados ficam destacados. Salve em seguida para publicar.'
        },
        options: popperBottom
    },
    {
        attachTo: { element: '[data-tour="tour-meusite-esp-salvar-temas"]' },
        content: {
            title: 'Salvar especialidades',
            description: 'Sincroniza a lista de temas escolhidos com o servidor para publicar na página pública.'
        },
        options: popperBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-meusite-esp-abordagens-intro"]' },
        content: {
            title: 'Abordagens terapêuticas',
            description:
                'Segunda área: suas linhas teóricas ou técnicas (TCC, psicanálise etc.). Aparecem como chips na seção “Sobre mim” do site.'
        },
        options: popperBottomStart
    },
    {
        attachTo: { element: '[data-tour="tour-meusite-esp-abordagens-chips"]' },
        content: {
            title: 'Seleção de abordagens',
            description:
                'Mesmo padrão dos temas: após carregar, clique nos chips para alternar seleção conforme sua prática.'
        },
        options: popperBottom
    },
    {
        attachTo: { element: '[data-tour="tour-meusite-esp-salvar-abordagens"]' },
        content: {
            title: 'Salvar abordagens',
            description: 'Grava as abordagens marcadas e atualiza a landing após sucesso.'
        },
        options: popperBottomStart
    }
];

export default {
    name: 'MeuSiteEspecialidadesTour',
    components: { VOnboardingWrapper, VOnboardingStep },
    data() {
        return {
            steps: STEPS,
            firstTargetSelector: '[data-tour="tour-meusite-esp-temas-intro"]',
            wrapperOptions: {
                autoFinishByExit: true,
                hideButtons: { previous: true, next: true, exit: true },
                scrollToStep: { enabled: true, options: { behavior: 'smooth', block: 'center' } }
            },
            _retryTimer: null,
            _observer: null
        };
    },
    mounted() {
        if (this.isTourDismissed()) return;
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
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch {
                /* ignore */
            }
        },
        watchForVisibilityWithRetry(attempt) {
            if (this.isTourDismissed()) return;
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
                    if (entries[0].isIntersecting && !this.isTourDismissed()) {
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
    max-width: min(22rem, calc(100vw - 2rem));
    background: #ffffff;
    border-radius: 14px;
    padding: 1.375rem 1.5rem 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 10px 24px -4px rgba(0, 0, 0, 0.11);
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
    transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
.dtour__btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.22);
}
.dtour__btn--primary {
    background: #18181b;
    color: #fff;
    border-color: #18181b;
}
.dtour__btn--primary:hover {
    background: #3f3f46;
    border-color: #3f3f46;
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
