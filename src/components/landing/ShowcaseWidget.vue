<script setup>
import { ref } from 'vue';

import dashboardLight from '@/assets/prints_psicoprontuarios/light-web/Screenshot_1.png';
import dashboardDark from '@/assets/prints_psicoprontuarios/dark-web/dashboard-geral.png';
import agendaLight from '@/assets/prints_psicoprontuarios/light-web/agendamento.png';
import agendaDark from '@/assets/prints_psicoprontuarios/dark-web/agendamentos.png';
import fichaLight from '@/assets/prints_psicoprontuarios/light-web/ficha-paciente.png';
import fichaDark from '@/assets/prints_psicoprontuarios/dark-web/pacientes-ficha.png';
import financeiroLight from '@/assets/prints_psicoprontuarios/light-web/receitas.png';
import financeiroDark from '@/assets/prints_psicoprontuarios/dark-web/receitas.png';
import whatsappLight from '@/assets/prints_psicoprontuarios/light-web/configuracoes-whatsapp.png';
import whatsappDark from '@/assets/prints_psicoprontuarios/dark-web/configuracoes-whatsapp.png';
import mobileLight from '@/assets/prints_psicoprontuarios/light-mobile/dashboard.png';
import mobileDark from '@/assets/prints_psicoprontuarios/dark-mobile/dashboard.png';

const tabs = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        title: 'Sua clínica em números',
        description: 'Total de pacientes, sessões do dia, status dos tratamentos e taxa de conclusão — tudo na primeira tela ao entrar.',
        light: dashboardLight,
        dark: dashboardDark
    },
    {
        id: 'agenda',
        label: 'Agenda',
        icon: 'pi pi-calendar',
        title: 'Agenda do dia sempre à mão',
        description: 'Calendário mensal com feriados, criação rápida de sessões, recorrência semanal ou quinzenal e remarcação sem dor de cabeça.',
        light: agendaLight,
        dark: agendaDark
    },
    {
        id: 'ficha',
        label: 'Ficha do Paciente',
        icon: 'pi pi-user',
        title: 'Tudo do paciente em um só lugar',
        description: 'Dados, prontuários, sessões, anexos, anamnese e gráficos de evolução (humor, GAD-7, PHQ-9) organizados em abas.',
        light: fichaLight,
        dark: fichaDark
    },
    {
        id: 'financeiro',
        label: 'Financeiro',
        icon: 'pi pi-wallet',
        title: 'Receitas e despesas sem planilha',
        description: 'Controle o financeiro do consultório com filtros, status de pagamento, pagamento em lote e exportação em PDF.',
        light: financeiroLight,
        dark: financeiroDark
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: 'pi pi-whatsapp',
        title: 'Rotinas automáticas no WhatsApp',
        description: 'Conecte seu número e ative lembretes de consulta para pacientes, agenda diária para você e mensagens de aniversário.',
        light: whatsappLight,
        dark: whatsappDark
    }
];

const activeTab = ref(tabs[0]);

function selectTab(tab) {
    activeTab.value = tab;
}
</script>

<template>
    <div class="showcase-section">
        <!-- Header -->
        <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Veja o sistema por dentro
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Telas reais do PsicoProntuários — no computador, tablet ou celular, com tema claro e escuro
            </p>
        </div>

        <!-- Tabs -->
        <div class="showcase-tabs" role="tablist">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                class="showcase-tab"
                :class="{ active: activeTab.id === tab.id }"
                role="tab"
                :aria-selected="activeTab.id === tab.id"
                @click="selectTab(tab)"
            >
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- Screenshot + descrição -->
        <div class="showcase-stage">
            <div class="showcase-copy">
                <h3 class="showcase-title">{{ activeTab.title }}</h3>
                <p class="showcase-description">{{ activeTab.description }}</p>
            </div>

            <div class="showcase-frames">
                <!-- Browser frame (desktop print) -->
                <div class="browser-frame">
                    <div class="browser-bar">
                        <span class="browser-dot dot-red"></span>
                        <span class="browser-dot dot-yellow"></span>
                        <span class="browser-dot dot-green"></span>
                        <span class="browser-url">psicoprontuarios.com.br</span>
                    </div>
                    <div class="browser-body">
                        <img
                            :src="activeTab.light"
                            :alt="`${activeTab.label} do PsicoProntuários — tema claro`"
                            class="screen-img dark:hidden"
                            loading="lazy"
                        />
                        <img
                            :src="activeTab.dark"
                            :alt="`${activeTab.label} do PsicoProntuários — tema escuro`"
                            class="screen-img hidden dark:block"
                            loading="lazy"
                        />
                    </div>
                </div>

                <!-- Phone frame (mobile print) -->
                <div class="phone-frame">
                    <div class="phone-notch"></div>
                    <img
                        :src="mobileLight"
                        alt="PsicoProntuários no celular — tema claro"
                        class="phone-img dark:hidden"
                        loading="lazy"
                    />
                    <img
                        :src="mobileDark"
                        alt="PsicoProntuários no celular — tema escuro"
                        class="phone-img hidden dark:block"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.showcase-section {
    padding: 2rem 0;
}

/* Tabs */
.showcase-tabs {
    @apply flex flex-wrap justify-center gap-2 mb-10;
}

.showcase-tab {
    @apply flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-200 font-medium transition-all duration-200 cursor-pointer;
}

.showcase-tab:hover {
    @apply border-primary text-primary;
}

.showcase-tab.active {
    @apply text-white border-0;
    background: linear-gradient(to right, #2563eb, #9333ea);
}

/* Stage */
.showcase-copy {
    @apply text-center max-w-2xl mx-auto mb-8;
}

.showcase-title {
    @apply text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-0 mb-3;
}

.showcase-description {
    @apply text-lg text-surface-600 dark:text-surface-300 leading-relaxed;
}

.showcase-frames {
    @apply flex items-end justify-center gap-6;
}

/* Browser mockup */
.browser-frame {
    @apply rounded-2xl overflow-hidden shadow-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900;
    flex: 1 1 auto;
    max-width: 860px;
}

.browser-bar {
    @apply flex items-center gap-2 px-4 py-3 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700;
}

.browser-dot {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
}

.dot-red { background: #f87171; }
.dot-yellow { background: #fbbf24; }
.dot-green { background: #34d399; }

.browser-url {
    @apply ml-3 px-4 py-1 rounded-full bg-surface-0 dark:bg-surface-900 text-xs text-surface-500 dark:text-surface-400;
}

.browser-body {
    aspect-ratio: 1024 / 486;
    background: var(--surface-100);
}

.screen-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Phone mockup */
.phone-frame {
    @apply relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-surface-900 dark:border-surface-600 bg-surface-900;
    flex: 0 0 auto;
    width: 200px;
}

.phone-notch {
    @apply absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-surface-900 dark:bg-surface-600 z-10;
}

.phone-img {
    width: 100%;
    display: block;
}

@media (max-width: 992px) {
    .showcase-frames {
        @apply flex-col items-center;
    }

    .phone-frame {
        width: 220px;
        margin-top: 0.5rem;
    }
}

@media (max-width: 768px) {
    .showcase-tab {
        @apply px-4 py-2 text-sm;
    }
}
</style>
