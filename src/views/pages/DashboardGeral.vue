<template>
    <div class="dash-clinic">
        <DashboardGeralTour />
        <div class="grid">
            <div class="col-12">
                <div class="dash-clinic-shell card p-0 overflow-hidden">
                    <header class="dash-clinic-header px-3 py-3 md:px-4 md:py-4">
                        <p class="dash-clinic-eyebrow m-0 mb-1">Visão geral</p>
                        <h1 class="dash-clinic-title m-0">Dashboard da clínica</h1>
                    </header>
                    <div class="px-2 pb-3 md:px-3 md:pb-4">
                <Tabs
                    v-model:value="activeTab"
                    class="dash-clinic-tabs"
                    @update:value="onTabChange"
                >
                    <TabList>
                        <Tab value="0">Pacientes</Tab>
                        <Tab value="1">Financeiro</Tab>
                    </TabList>
                    <TabPanels>
                    <!-- Tab Pacientes -->
                    <TabPanel value="0">
                        <!-- Cards de Estatísticas -->
                        <div class="grid">
                            <!-- Total de Pacientes -->
                            <div class="col-12 md:col-4">
                                <div
                                    class="card dash-metric cursor-pointer"
                                    data-tour="tour-clinica-pacientes"
                                    :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                                    @click="$router.push('/pacientes')"
                                >
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Total de pacientes</span>
                                            <div class="dash-metric__value">{{ dados.pacientes?.pacientes_total || 0 }}</div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-users"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Sessões do dia -->
                            <div class="col-12 md:col-4">
                                <div
                                    class="card dash-metric cursor-pointer"
                                    data-tour="tour-clinica-sessoes"
                                    :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                                    @click="$router.push('/agendamentos')"
                                >
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Sessões do dia</span>
                                            <div class="dash-metric__value">{{ dados.prontuarios?.sessoes_do_dia || 0 }}</div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-calendar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Prontuários 30 dias -->
                            <div class="col-12 md:col-4">
                                <div
                                    class="card dash-metric"
                                    data-tour="tour-clinica-prontuarios"
                                    :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                                >
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Prontuários (30 dias)</span>
                                            <div class="dash-metric__value">{{ dados.prontuarios?.prontuarios_30_dias || 0 }}</div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-file-edit"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card Pacientes por Status -->
                        <div class="grid mt-4">
                            <div class="col-12">
                                <div class="card" data-tour="tour-clinica-status" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <h6>Pacientes por status</h6>
                                    <div class="dash-status-grid">
                                        <div class="dash-status-pill">
                                            <i class="pi pi-circle-fill text-blue-500"></i>
                                            <span class="dash-status-pill__label">Em andamento</span>
                                            <span class="dash-status-pill__value">{{ dados.pacientes?.pacientes_em_andamento || 0 }}</span>
                                        </div>
                                        <div class="dash-status-pill">
                                            <i class="pi pi-circle-fill text-yellow-500"></i>
                                            <span class="dash-status-pill__label">Recesso</span>
                                            <span class="dash-status-pill__value">{{ dados.pacientes?.pacientes_recesso || 0 }}</span>
                                        </div>
                                        <div class="dash-status-pill">
                                            <i class="pi pi-circle-fill text-green-500"></i>
                                            <span class="dash-status-pill__label">Concluídos</span>
                                            <span class="dash-status-pill__value">{{ dados.pacientes?.pacientes_concluidos || 0 }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cards de Estatísticas Detalhadas -->
                        <div class="grid mt-4" data-tour="tour-clinica-metricas">
                            <!-- Tempo Médio de Tratamento -->
                            <div class="col-12 md:col-3">
                                <div class="card dash-metric" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Tempo médio de tratamento</span>
                                            <div class="dash-metric__value">{{ dados.pacientes?.tempo_medio_tratamento || 0 }} <span class="text-base font-medium">dias</span></div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-clock"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Taxa de Conclusão -->
                            <div class="col-12 md:col-3">
                                <div class="card dash-metric" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Taxa de conclusão</span>
                                            <div class="dash-metric__value">{{ dados.pacientes?.taxa_conclusao || 0 }}%</div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-check-circle"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pacientes com Anamnese -->
                            <div class="col-12 md:col-3">
                                <div class="card dash-metric" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Pacientes com anamnese</span>
                                            <div class="dash-metric__value">{{ dados.pacientes?.percentual_anamnese || 0 }}%</div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-file"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Novos vs Retornados -->
                            <div class="col-12 md:col-3">
                                <div class="card dash-metric" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between gap-3 pl-2">
                                        <div class="flex-1 min-w-0">
                                            <span class="dash-metric__label">Este mês</span>
                                            <div class="text-sm font-semibold mt-1" style="color: var(--text-color-secondary)">
                                                Novos: {{ dados.pacientes?.pacientes_novos_mes || 0 }}
                                            </div>
                                            <div class="text-sm font-semibold" style="color: var(--text-color-secondary)">
                                                Retornados: {{ dados.pacientes?.pacientes_retornados_mes || 0 }}
                                            </div>
                                        </div>
                                        <div class="dash-metric__icon flex-shrink-0">
                                            <i class="pi pi-users"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cards Financeiros -->
                        <div class="grid mt-4" v-if="isPlanoProfissional">
                            <!-- Próxima Sessão -->
                            <div class="col-12 md:col-6">
                                <div class="card dash-feature p-4" data-tour="tour-clinica-proxima-sessao">
                                    <div class="flex flex-column h-full">
                                        <div class="flex align-items-center justify-content-between mb-3 gap-2">
                                            <h6 class="dash-feature__title mb-0 border-none p-0">Próxima sessão</h6>
                                            <div class="text-right flex-shrink-0">
                                                <div v-if="proximaSessao" class="dash-feature__accent font-semibold text-sm">
                                                    {{ formatarData(proximaSessao.data_consulta) }}
                                                </div>
                                                <div v-if="proximaSessao" class="dash-feature__meta text-xs">
                                                    {{ formatarHora(proximaSessao.data_consulta) }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex-grow-1 dash-feature__body">
                                            <div v-if="proximaSessao" class="mb-3">
                                                <div class="flex align-items-center mb-2">
                                                    <i class="pi pi-user dash-feature__accent text-lg mr-2"></i>
                                                    <span class="dash-feature__strong">{{ proximaSessao.nome_paciente }}</span>
                                                </div>
                                                <div class="flex align-items-center">
                                                    <i class="pi pi-phone dash-feature__accent text-lg mr-2"></i>
                                                    <span class="text-sm">{{
                                                        proximaSessao.telefone_paciente || 'Telefone não informado'
                                                    }}</span>
                                                </div>
                                            </div>

                                            <div v-else class="text-center py-3">
                                                <i class="pi pi-calendar-times dash-feature__accent text-2xl mb-2"></i>
                                                <div class="text-sm">Não há sessão agendada para a próxima hora</div>
                                            </div>
                                        </div>

                                        <div class="mt-auto">
                                            <Button
                                                label="Ver agenda"
                                                icon="pi pi-calendar"
                                                size="small"
                                                class="w-full"
                                                severity="secondary"
                                                @click="$router.push('/agendamentos')"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Aniversariantes do Mês -->
                            <div class="col-12 md:col-6">
                                <div class="card dash-feature dash-feature--warm p-4" data-tour="tour-clinica-aniversariantes">
                                    <div class="flex flex-column h-full">
                                        <div class="flex align-items-center justify-content-between mb-3 gap-2">
                                            <h6 class="dash-feature__title mb-0 border-none p-0">Aniversariantes do mês</h6>
                                            <div class="text-right flex-shrink-0">
                                                <div class="dash-feature__accent font-semibold text-sm">
                                                    {{ dados.pacientes?.aniversariantes_mes?.length || 0 }} pacientes
                                                </div>
                                                <div class="dash-feature__meta text-xs">
                                                    {{ getNomeMesAtual() }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex-grow-1 dash-feature__body">
                                            <div v-if="dados.pacientes?.aniversariantes_mes?.length > 0" class="mb-3">
                                                <div
                                                    v-for="aniversariante in dados.pacientes.aniversariantes_mes.slice(0, 3)"
                                                    :key="aniversariante.id"
                                                    class="flex align-items-center mb-2"
                                                >
                                                    <i class="pi pi-gift dash-feature__accent text-lg mr-2"></i>
                                                    <div class="flex-grow-1">
                                                        <span class="dash-feature__strong text-sm">{{ aniversariante.nome }}</span>
                                                        <div class="dash-feature__meta text-xs">
                                                            Dia {{ aniversariante.dia_aniversario }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="dados.pacientes.aniversariantes_mes.length > 3" class="text-center">
                                                    <span class="dash-feature__meta text-xs">
                                                        +{{ dados.pacientes.aniversariantes_mes.length - 3 }} mais
                                                    </span>
                                                </div>
                                            </div>

                                            <div v-else class="text-center py-3">
                                                <i class="pi pi-calendar-times dash-feature__accent text-2xl mb-2"></i>
                                                <div class="text-sm">Nenhum aniversariante este mês</div>
                                            </div>
                                        </div>

                                        <div class="mt-auto">
                                            <Button
                                                label="Ver pacientes"
                                                icon="pi pi-users"
                                                size="small"
                                                class="w-full"
                                                severity="secondary"
                                                @click="$router.push('/pacientes')"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gráficos de Distribuição -->
                        <div class="grid mt-4" data-tour="tour-clinica-graficos-dist">
                            <!-- Distribuição por Gênero -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="mb-3">Distribuição por Gênero</h6>
                                    <Chart type="doughnut" :data="generoChartData" :options="generoChartOptions"
                                        class="h-[200px]" />
                                </div>
                            </div>

                            <!-- Distribuição por Faixa Etária -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="mb-3">Distribuição por Faixa Etária</h6>
                                    <Chart type="doughnut" :data="faixaEtariaChartData" :options="faixaEtariaChartOptions"
                                        class="h-[200px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Gráfico de Evolução de Status -->
                        <div class="grid mt-4">
                            <div class="col-12">
                                <div class="card" data-tour="tour-clinica-evolucao-status">
                                    <h6 class="mb-3">Evolução de Status (6 meses)</h6>
                                    <Chart type="line" :data="statusEvolutionChartData" :options="statusEvolutionChartOptions"
                                        class="h-[300px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Alertas -->
                        <div class="grid mt-4" v-if="mostrarAlertas && isPlanoProfissional">
                            <div class="col-12">
                                <div class="card dash-alert-negative p-4" v-if="dados.financeiro?.alerta_financeiro">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-exclamation-triangle text-red-400 text-xl mr-3"></i>
                                        <span>Atenção: saldo do mês está negativo.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gráficos -->
                        <div class="grid mt-4">
                            <!-- Gráfico Barra - Evolução de Pacientes -->
                            <div class="col-12">
                                <div class="card" data-tour="tour-clinica-evolucao-pacientes">
                                    <h6 class="mb-3">Evolução de Pacientes (6 meses)</h6>
                                    <Chart type="bar" :data="barChartData" :options="barChartOptions"
                                        class="h-[200px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Listagens Rápidas -->
                        <div class="grid mt-4" data-tour="tour-clinica-ultimos">
                            <!-- Últimos Pacientes -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="mb-3">Últimos Pacientes Cadastrados</h6>
                                    <div v-if="dados.pacientes?.ultimos_pacientes?.length > 0">
                                        <div v-for="paciente in dados.pacientes.ultimos_pacientes" :key="paciente.id"
                                            class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
                                            <div>
                                                <span class="font-medium text-900">{{ paciente.nome }}</span>
                                                <div class="text-sm text-gray-500">
                                                    {{ formatarData(paciente.created_at) }}
                                                </div>
                                            </div>
                                            <Button icon="pi pi-eye" rounded outlined size="small"
                                                @click="$router.push(`/pacientes/ficha/${paciente.id}`)" />
                                        </div>
                                    </div>
                                    <div v-else class="text-center p-4 text-gray-500">
                                        Nenhum paciente cadastrado
                                    </div>
                                </div>
                            </div>

                            <!-- Últimos Prontuários -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="mb-3">Últimos Prontuários Criados</h6>
                                    <div v-if="dados.prontuarios?.ultimos_prontuarios?.length > 0">
                                        <div v-for="prontuario in dados.prontuarios.ultimos_prontuarios"
                                            :key="prontuario.id"
                                            class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
                                            <div>
                                                <span class="font-medium text-900">{{ prontuario.paciente_nome }}</span>
                                                <div class="text-sm text-gray-500">
                                                    {{ formatarData(prontuario.created_at) }}
                                                </div>
                                            </div>
                                            <Button icon="pi pi-eye" rounded outlined size="small"
                                                @click="$router.push({ path: `/pacientes/ficha/${prontuario.paciente_id}`, query: { tab: '1' } })" />
                                        </div>
                                    </div>
                                    <div v-else class="text-center p-4 text-gray-500">
                                        Nenhum prontuário criado
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Tab Financeiro -->
                    <TabPanel value="1">
                        <FinanceiroDashboard :lazy="true" ref="financeiroDashboardRef" />
                    </TabPanel>
                    </TabPanels>
                </Tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import { useThemeStore } from '@/store/theme';
import DashboardGeralTour from '@/components/tour/DashboardGeralTour.vue';
import FinanceiroDashboard from '@/views/pages/financeiro/FinanceiroDashboard.vue';
import {
    darkenCssColor,
    primaryChartPalette,
    readPrimaryColor,
    readTextColor,
    readTextMutedColor,
    readThemeResolvedColor,
    rgbaFromCssColor
} from '@/utils/themeCssColors';

export default {
    name: 'DashboardGeral',
    components: {
        FinanceiroDashboard,
        DashboardGeralTour
    },
    data() {
        return {
            activeTab: '0',
            dados: {
                pacientes: {
                    pacientes_total: 0,
                    pacientes_em_andamento: 0,
                    pacientes_recesso: 0,
                    pacientes_concluidos: 0,
                    ultimos_pacientes: [],
                    crescimento_pacientes: {},
                    evolucao_status: {},
                    tempo_medio_tratamento: 0,
                    taxa_conclusao: 0,
                    pacientes_novos_mes: 0,
                    pacientes_retornados_mes: 0,
                    distribuicao_genero: {},
                    distribuicao_faixa_etaria: {},
                    pacientes_com_anamnese: 0,
                    percentual_anamnese: 0
                },
                prontuarios: {
                    sessoes_do_dia: 0,
                    prontuarios_30_dias: 0,
                    ultimos_prontuarios: []
                },
                financeiro: {
                    evolucao_financeira: {},
                    alerta_financeiro: false
                }
                // Removido o campo 'plano' daqui pois será acessado via store
            },
            proximaSessao: null,
            loading: false,
            financeiroDashboardRef: null
        };
    },
    computed: {
        // Store do plano como propriedade computada
        planStore() {
            return usePlanStore();
        },

        // Store do tema como propriedade computada
        themeStore() {
            return useThemeStore();
        },

        mostrarAlertas() {
            if (this.isPlanoProfissional) {
                return this.dados.financeiro?.alerta_financeiro || this.planStore.isPlanPaused;
            } else {
                return this.planStore.isPlanPaused;
            }
        },
        barChartData() {
            void this.themeStore.primaryColor;
            void this.themeStore.theme;

            const labels = [];
            const data = [];

            // Mapeamento completo de meses em inglês para português brasileiro
            const mesesTraduzidos = {
                // Meses completos
                'January': 'Janeiro',
                'February': 'Fevereiro',
                'March': 'Março',
                'April': 'Abril',
                'May': 'Maio',
                'June': 'Junho',
                'July': 'Julho',
                'August': 'Agosto',
                'September': 'Setembro',
                'October': 'Outubro',
                'November': 'Novembro',
                'December': 'Dezembro',
                // Meses abreviados
                'Jan': 'Jan',
                'Feb': 'Fev',
                'Mar': 'Mar',
                'Apr': 'Abr',
                'May': 'Mai',
                'Jun': 'Jun',
                'Jul': 'Jul',
                'Aug': 'Ago',
                'Sep': 'Set',
                'Oct': 'Out',
                'Nov': 'Nov',
                'Dec': 'Dez',
                // Possíveis variações
                'JANUARY': 'Janeiro',
                'FEBRUARY': 'Fevereiro',
                'MARCH': 'Março',
                'APRIL': 'Abril',
                'MAY': 'Maio',
                'JUNE': 'Junho',
                'JULY': 'Julho',
                'AUGUST': 'Agosto',
                'SEPTEMBER': 'Setembro',
                'OCTOBER': 'Outubro',
                'NOVEMBER': 'Novembro',
                'DECEMBER': 'Dezembro',
                'JAN': 'Jan',
                'FEB': 'Fev',
                'MAR': 'Mar',
                'APR': 'Abr',
                'MAY': 'Mai',
                'JUN': 'Jun',
                'JUL': 'Jul',
                'AUG': 'Ago',
                'SEP': 'Set',
                'OCT': 'Out',
                'NOV': 'Nov',
                'DEC': 'Dez'
            };

            const novosData = [];
            const concluidosData = [];

            Object.values(this.dados.pacientes?.crescimento_pacientes || {}).forEach(item => {
                // Traduz o nome do mês se estiver em inglês
                let mesOriginal = item.mes;
                let mesTraduzido = null;

                // Se o formato for "May/2025", extrai apenas o mês
                if (typeof mesOriginal === 'string' && mesOriginal.includes('/')) {
                    const partes = mesOriginal.split('/');
                    const mesParte = partes[0].trim();
                    const anoParte = partes[1] ? partes[1].trim() : '';

                    // Traduz o mês
                    mesTraduzido = mesesTraduzidos[mesParte];

                    // Se encontrou tradução, reconstrói com o ano
                    if (mesTraduzido && anoParte) {
                        mesTraduzido = `${mesTraduzido}/${anoParte}`;
                    } else if (mesTraduzido) {
                        mesTraduzido = mesTraduzido;
                    } else {
                        mesTraduzido = mesOriginal; // Fallback para o original
                    }
                } else {
                    // Busca tradução direta
                    mesTraduzido = mesesTraduzidos[mesOriginal];
                }

                // Se não encontrou tradução, tenta converter número para nome do mês
                if (!mesTraduzido && typeof mesOriginal === 'number') {
                    const mesesNumericos = [
                        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                    ];
                    mesTraduzido = mesesNumericos[mesOriginal - 1] || mesOriginal;
                }

                // Se ainda não encontrou, usa o original
                if (!mesTraduzido) {
                    mesTraduzido = mesOriginal;
                }

                labels.push(mesTraduzido);
                novosData.push(item.novos || 0);
                concluidosData.push(item.concluidos || 0);
            });

            const primary = readPrimaryColor();
            const primaryBorder = darkenCssColor(primary, 0.2);

            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Novos Cadastros',
                        data: novosData,
                        backgroundColor: primary,
                        borderColor: primaryBorder,
                        borderWidth: 1
                    },
                    {
                        label: 'Concluídos',
                        data: concluidosData,
                        backgroundColor: rgbaFromCssColor(primary, 0.42),
                        borderColor: darkenCssColor(primary, 0.32),
                        borderWidth: 1
                    }
                ]
            };
        },
        barChartOptions() {
            void this.themeStore.theme;

            const legendColor = readTextColor();
            const tickColor = readTextMutedColor();
            const gridColor = readThemeResolvedColor(
                ['--p-content-border-color', '--surface-border'],
                '#e5e7eb'
            );

            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: legendColor,
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: tickColor
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: tickColor
                        }
                    }
                }
            };
        },
        isPlanoProfissional() {
            // Verificar se é usuário vitalício OU se tem plano Profissional
            return this.planStore.isVitalicio || this.planStore.planInfo?.nome === 'Profissional';
        },
        generoChartData() {
            void this.themeStore.primaryColor;
            void this.themeStore.theme;

            const distribuicao = this.dados.pacientes?.distribuicao_genero || {};
            const labels = Object.keys(distribuicao);
            const data = Object.values(distribuicao);
            
            return {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [{
                    data: data.length > 0 ? data : [0],
                    backgroundColor: primaryChartPalette(5),
                    borderWidth: 0
                }]
            };
        },
        generoChartOptions() {
            void this.themeStore.theme;

            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: readTextColor(),
                            padding: 15
                        }
                    }
                }
            };
        },
        faixaEtariaChartData() {
            void this.themeStore.primaryColor;
            void this.themeStore.theme;

            const distribuicao = this.dados.pacientes?.distribuicao_faixa_etaria || {};
            const labels = Object.keys(distribuicao);
            const data = Object.values(distribuicao);
            
            return {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [{
                    data: data.length > 0 ? data : [0],
                    backgroundColor: primaryChartPalette(4),
                    borderWidth: 0
                }]
            };
        },
        faixaEtariaChartOptions() {
            void this.themeStore.theme;

            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: readTextColor(),
                            padding: 15
                        }
                    }
                }
            };
        },
        statusEvolutionChartData() {
            void this.themeStore.primaryColor;
            void this.themeStore.theme;

            const labels = [];
            const emAndamentoData = [];
            const recessoData = [];
            const concluidosData = [];

            const mesesTraduzidos = {
                'January': 'Janeiro', 'February': 'Fevereiro', 'March': 'Março', 'April': 'Abril',
                'May': 'Maio', 'June': 'Junho', 'July': 'Julho', 'August': 'Agosto',
                'September': 'Setembro', 'October': 'Outubro', 'November': 'Novembro', 'December': 'Dezembro',
                'Jan': 'Jan', 'Feb': 'Fev', 'Mar': 'Mar', 'Apr': 'Abr',
                'May': 'Mai', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
                'Sep': 'Set', 'Oct': 'Out', 'Nov': 'Nov', 'Dec': 'Dez'
            };

            Object.values(this.dados.pacientes?.evolucao_status || {}).forEach(item => {
                let mesOriginal = item.mes;
                let mesTraduzido = null;

                if (typeof mesOriginal === 'string' && mesOriginal.includes('/')) {
                    const partes = mesOriginal.split('/');
                    const mesParte = partes[0].trim();
                    const anoParte = partes[1] ? partes[1].trim() : '';
                    mesTraduzido = mesesTraduzidos[mesParte];
                    if (mesTraduzido && anoParte) {
                        mesTraduzido = `${mesTraduzido}/${anoParte}`;
                    } else if (mesTraduzido) {
                        mesTraduzido = mesTraduzido;
                    } else {
                        mesTraduzido = mesOriginal;
                    }
                } else {
                    mesTraduzido = mesesTraduzidos[mesOriginal] || mesOriginal;
                }

                labels.push(mesTraduzido);
                emAndamentoData.push(item.em_andamento || 0);
                recessoData.push(item.recesso || 0);
                concluidosData.push(item.concluidos || 0);
            });

            const primary = readPrimaryColor();
            const conclBorder = darkenCssColor(primary, 0.26);

            return {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [
                    {
                        label: 'Em Andamento',
                        data: emAndamentoData.length > 0 ? emAndamentoData : [0],
                        borderColor: primary,
                        backgroundColor: rgbaFromCssColor(primary, 0.12),
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Recesso',
                        data: recessoData.length > 0 ? recessoData : [0],
                        borderColor: '#b45309',
                        backgroundColor: 'rgba(180, 83, 9, 0.12)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Concluídos',
                        data: concluidosData.length > 0 ? concluidosData : [0],
                        borderColor: conclBorder,
                        backgroundColor: rgbaFromCssColor(conclBorder, 0.12),
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
        },
        statusEvolutionChartOptions() {
            void this.themeStore.theme;

            const legendColor = readTextColor();
            const tickColor = readTextMutedColor();
            const gridColor = readThemeResolvedColor(
                ['--p-content-border-color', '--surface-border'],
                '#e5e7eb'
            );

            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: legendColor,
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: tickColor
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: tickColor
                        }
                    }
                }
            };
        }
    },
    async mounted() {
        // Inicializar o store do tema
        this.themeStore.init();
        await this.carregarDados();
    },
    methods: {
        formatarValor(valor) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(valor);
        },
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        formatarHora(data) {
            if (!data) return '-';
            return new Date(data).toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric' });
        },
        getNomeMesAtual() {
            const meses = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            return meses[new Date().getMonth()];
        },
        async carregarDados() {
            this.loading = true;

            try {
                const response = await this.$dashboardService.buscarDados();
                this.dados = response.data;

                // Buscar próxima sessão dos dados do dashboard
                this.proximaSessao = response.data.prontuarios?.proxima_sessao || null;
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do dashboard',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        async onTabChange(value) {
            // Quando a tab Financeiro for selecionada, carregar dados
            if (value === '1') {
                await this.$nextTick();
                const financeiroDashboard = this.$refs.financeiroDashboardRef;
                if (financeiroDashboard && !financeiroDashboard.dadosCarregados) {
                    // Inicializar filtros se ainda não foram inicializados
                    if (!financeiroDashboard.filtrosData.data_inicial || !financeiroDashboard.filtrosData.data_final) {
                        financeiroDashboard.inicializarFiltrosData();
                    }
                    // Carregar dados
                    await financeiroDashboard.carregarDados({
                        data_inicial: financeiroDashboard.formatarDataParaAPI(financeiroDashboard.filtrosData.data_inicial),
                        data_final: financeiroDashboard.formatarDataParaAPI(financeiroDashboard.filtrosData.data_final),
                        tipo_periodo: financeiroDashboard.filtroAtivo || 'mes'
                    });
                }
            }
        }
    }
};
</script>

<style scoped>
/* Altura em cartões de destaque — sem reescrever a grelha PrimeFlex */
.dash-clinic .dash-feature .flex-column.h-full {
    min-height: 200px;
}

@media (max-width: 768px) {
    .dash-clinic .dash-feature .flex-column.h-full {
        min-height: auto;
    }
}

.dash-clinic .dash-feature .flex-grow-1 {
    flex-grow: 1;
}

.dash-clinic .dash-feature .mt-auto {
    margin-top: auto;
}

.dash-clinic .cursor-pointer.dash-metric:hover {
    transform: translateY(-2px);
}
</style>