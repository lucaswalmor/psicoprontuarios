<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <h5 class="text-500 mb-4 m-3">Dashboard Geral</h5>

                <!-- Tabs -->
                <TabView v-model:activeIndex="activeTabIndex" @tab-change="onTabChange">
                    <!-- Tab Pacientes -->
                    <TabPanel header="Pacientes">
                        <!-- Cards de Estatísticas -->
                        <div class="grid">
                            <!-- Total de Pacientes -->
                            <div class="col-12 md:col-4">
                                <div class="card cursor-pointer"
                                    :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                                    @click="$router.push('/pacientes')">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-2xl text-500 font-medium mb-2">Total de
                                                Pacientes</span>
                                            <!-- <span class="block text-blue-500 text-2xl font-medium mb-2">Total de Pacientes</span> -->
                                            <div class="font-medium text-xl text-500">{{
                                                dados.pacientes?.pacientes_total || 0 }}</div>
                                        </div>
                                        <i :class="`pi pi-users text-2xl text-500`"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Sessões do dia -->
                            <div class="col-12 md:col-4">
                                <div class="card cursor-pointer"
                                    :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                                    @click="$router.push('/agendamentos')">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-2xl text-500 font-medium mb-2">Sessões do dia</span>
                                            <div class="text-500 font-medium text-xl">{{
                                                dados.prontuarios?.sessoes_do_dia || 0 }}</div>
                                        </div>
                                        <i :class="`pi pi-calendar text-500 text-2xl`"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Prontuários 30 dias -->
                            <div class="col-12 md:col-4">
                                <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="text-500 block text-2xl font-medium mb-2">Prontuários (30
                                                dias)</span>
                                            <div class="text-500 font-medium text-xl">{{
                                                dados.prontuarios?.prontuarios_30_dias || 0 }}</div>
                                        </div>
                                        <i :class="`pi pi-calendar text-500 text-2xl`"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card Pacientes por Status -->
                        <div class="grid mt-4">
                            <div class="col-12">
                                <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <h6 class="text-500 mb-3">Pacientes por Status</h6>
                                    <div class="flex align-items-center justify-content-between flex-wrap gap-3">
                                        <div class="flex align-items-center gap-2">
                                            <i class="pi pi-circle-fill text-blue-500"></i>
                                            <span class="text-500 font-medium">Em andamento:</span>
                                            <span class="text-500 font-bold text-xl">{{ dados.pacientes?.pacientes_em_andamento || 0 }}</span>
                                        </div>
                                        <span class="text-500">|</span>
                                        <div class="flex align-items-center gap-2">
                                            <i class="pi pi-circle-fill text-yellow-500"></i>
                                            <span class="text-500 font-medium">Recesso:</span>
                                            <span class="text-500 font-bold text-xl">{{ dados.pacientes?.pacientes_recesso || 0 }}</span>
                                        </div>
                                        <span class="text-500">|</span>
                                        <div class="flex align-items-center gap-2">
                                            <i class="pi pi-circle-fill text-green-500"></i>
                                            <span class="text-500 font-medium">Concluídos:</span>
                                            <span class="text-500 font-bold text-xl">{{ dados.pacientes?.pacientes_concluidos || 0 }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cards de Estatísticas Detalhadas -->
                        <div class="grid mt-4">
                            <!-- Tempo Médio de Tratamento -->
                            <div class="col-12 md:col-3">
                                <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-500 text-sm font-medium mb-2">Tempo Médio de Tratamento</span>
                                            <div class="text-500 font-bold text-xl">
                                                {{ dados.pacientes?.tempo_medio_tratamento || 0 }} dias
                                            </div>
                                        </div>
                                        <i class="pi pi-clock text-2xl text-500"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Taxa de Conclusão -->
                            <div class="col-12 md:col-3">
                                <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-500 text-sm font-medium mb-2">Taxa de Conclusão</span>
                                            <div class="text-500 font-bold text-xl">
                                                {{ dados.pacientes?.taxa_conclusao || 0 }}%
                                            </div>
                                        </div>
                                        <i class="pi pi-check-circle text-2xl text-500"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Pacientes com Anamnese -->
                            <div class="col-12 md:col-3">
                                <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-500 text-sm font-medium mb-2">Pacientes com Anamnese</span>
                                            <div class="text-500 font-bold text-xl">
                                                {{ dados.pacientes?.percentual_anamnese || 0 }}%
                                            </div>
                                        </div>
                                        <i class="pi pi-file text-2xl text-500"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Novos vs Retornados -->
                            <div class="col-12 md:col-3">
                                <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-500 text-sm font-medium mb-2">Este Mês</span>
                                            <div class="text-500 font-medium text-sm">
                                                Novos: {{ dados.pacientes?.pacientes_novos_mes || 0 }}
                                            </div>
                                            <div class="text-500 font-medium text-sm">
                                                Retornados: {{ dados.pacientes?.pacientes_retornados_mes || 0 }}
                                            </div>
                                        </div>
                                        <i class="pi pi-users text-2xl text-500"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cards Financeiros -->
                        <div class="grid mt-4" v-if="isPlanoProfissional">
                            <!-- Próxima Sessão -->
                            <div class="col-12 md:col-6">
                                <div class="card bg-gradient-to-r from-pink-900 to-indigo-900 border-pink-500">
                                    <div class="flex flex-column h-full">
                                        <div class="flex align-items-center justify-content-between mb-3">
                                            <h6 class="text-pink-500 font-bold mb-0 text-lg">Próxima Sessão</h6>
                                            <div class="text-right">
                                                <div v-if="proximaSessao" class="text-pink-500 font-semibold text-sm">
                                                    {{ formatarData(proximaSessao.data_consulta) }}
                                                </div>
                                                <div v-if="proximaSessao" class="text-pink-200 font-medium text-xs">
                                                    {{ formatarHora(proximaSessao.data_consulta) }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex-grow-1">
                                            <div v-if="proximaSessao" class="mb-3">
                                                <div class="flex align-items-center mb-2">
                                                    <i class="pi pi-user text-pink-300 text-lg mr-2"></i>
                                                    <span class="text-500 font-semibold">{{ proximaSessao.nome_paciente
                                                        }}</span>
                                                </div>
                                                <div class="flex align-items-center">
                                                    <i class="pi pi-phone text-pink-300 text-lg mr-2"></i>
                                                    <span class="text-500 font-medium text-sm">{{
                                                        proximaSessao.telefone_paciente || 'Telefone não informado'
                                                        }}</span>
                                                </div>
                                            </div>

                                            <div v-else class="text-center py-3">
                                                <i class="pi pi-calendar-times text-pink-300 text-2xl mb-2"></i>
                                                <div class="text-500 font-medium text-sm">Não há nenhuma sessão agendada
                                                    para próxima hora</div>
                                            </div>
                                        </div>

                                        <div class="mt-auto">
                                            <Button label="Ver Agenda" icon="pi pi-calendar" size="small" class="w-full"
                                                @click="$router.push('/agendamentos')" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Aniversariantes do Mês -->
                            <div class="col-12 md:col-6">
                                <div class="card bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
                                    <div class="flex flex-column h-full">
                                        <div class="flex align-items-center justify-content-between mb-3">
                                            <h6 class="text-purple-500 font-bold mb-0 text-lg">Aniversariantes do Mês
                                            </h6>
                                            <div class="text-right">
                                                <div class="text-purple-500 font-semibold text-sm">
                                                    {{ dados.pacientes?.aniversariantes_mes?.length || 0 }} pacientes
                                                </div>
                                                <div class="text-purple-200 font-medium text-xs">
                                                    {{ getNomeMesAtual() }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex-grow-1">
                                            <div v-if="dados.pacientes?.aniversariantes_mes?.length > 0" class="mb-3">
                                                <div v-for="aniversariante in dados.pacientes.aniversariantes_mes.slice(0, 3)"
                                                    :key="aniversariante.id" class="flex align-items-center mb-2">
                                                    <i class="pi pi-gift text-purple-300 text-lg mr-2"></i>
                                                    <div class="flex-grow-1">
                                                        <span class="text-500 font-semibold text-sm">{{
                                                            aniversariante.nome }}</span>
                                                        <div class="text-purple-200 font-medium text-xs">
                                                            Dia {{ aniversariante.dia_aniversario }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="dados.pacientes.aniversariantes_mes.length > 3"
                                                    class="text-center">
                                                    <span class="text-purple-200 font-medium text-xs">
                                                        +{{ dados.pacientes.aniversariantes_mes.length - 3 }} mais
                                                    </span>
                                                </div>
                                            </div>

                                            <div v-else class="text-center py-3">
                                                <i class="pi pi-calendar-times text-purple-300 text-2xl mb-2"></i>
                                                <div class="text-500 font-medium text-sm">Nenhum aniversariante este mês
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-auto">
                                            <Button label="Ver Pacientes" icon="pi pi-users" size="small" class="w-full"
                                                @click="$router.push('/pacientes')" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gráficos de Distribuição -->
                        <div class="grid mt-4">
                            <!-- Distribuição por Gênero -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="text-500 mb-3">Distribuição por Gênero</h6>
                                    <Chart type="doughnut" :data="generoChartData" :options="generoChartOptions"
                                        class="h-[200px]" />
                                </div>
                            </div>

                            <!-- Distribuição por Faixa Etária -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="text-500 mb-3">Distribuição por Faixa Etária</h6>
                                    <Chart type="doughnut" :data="faixaEtariaChartData" :options="faixaEtariaChartOptions"
                                        class="h-[200px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Gráfico de Evolução de Status -->
                        <div class="grid mt-4">
                            <div class="col-12">
                                <div class="card">
                                    <h6 class="text-500 mb-3">Evolução de Status (6 meses)</h6>
                                    <Chart type="line" :data="statusEvolutionChartData" :options="statusEvolutionChartOptions"
                                        class="h-[300px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Alertas -->
                        <div class="grid mt-4" v-if="mostrarAlertas && isPlanoProfissional">
                            <div class="col-12">
                                <div class="card bg-red-900 border-red-500" v-if="dados.financeiro?.alerta_financeiro">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-exclamation-triangle text-red-500 text-xl mr-3"></i>
                                        <span class="text-red-200">Atenção: Saldo do mês está negativo!</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gráficos -->
                        <div class="grid mt-4">
                            <!-- Gráfico Barra - Evolução de Pacientes -->
                            <div class="col-12">
                                <div class="card">
                                    <h6 class="text-500 mb-3">Evolução de Pacientes (6 meses)</h6>
                                    <Chart type="bar" :data="barChartData" :options="barChartOptions"
                                        class="h-[200px]" />
                                </div>
                            </div>
                        </div>

                        <!-- Listagens Rápidas -->
                        <div class="grid mt-4">
                            <!-- Últimos Pacientes -->
                            <div class="col-12 md:col-6">
                                <div class="card">
                                    <h6 class="text-500 mb-3">Últimos Pacientes Cadastrados</h6>
                                    <div v-if="dados.pacientes?.ultimos_pacientes?.length > 0">
                                        <div v-for="paciente in dados.pacientes.ultimos_pacientes" :key="paciente.id"
                                            class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-500">
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
                                    <h6 class="text-500 mb-3">Últimos Prontuários Criados</h6>
                                    <div v-if="dados.prontuarios?.ultimos_prontuarios?.length > 0">
                                        <div v-for="prontuario in dados.prontuarios.ultimos_prontuarios"
                                            :key="prontuario.id"
                                            class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-500">
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
                    <TabPanel header="Financeiro">
                        <FinanceiroDashboard :lazy="true" ref="financeiroDashboardRef" />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import { useThemeStore } from '@/store/theme';
import FinanceiroDashboard from '@/views/pages/financeiro/FinanceiroDashboard.vue';

export default {
    name: 'DashboardGeral',
    components: {
        FinanceiroDashboard
    },
    data() {
        return {
            activeTabIndex: 0,
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

            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Novos Cadastros',
                        data: novosData,
                        backgroundColor: '#3b82f6',
                        borderColor: '#2563eb',
                        borderWidth: 1
                    },
                    {
                        label: 'Concluídos',
                        data: concluidosData,
                        backgroundColor: '#10b981',
                        borderColor: '#059669',
                        borderWidth: 1
                    }
                ]
            };
        },
        barChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000',
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.themeStore.theme === 'dark' ? '#374151' : '#e5e7eb'
                        },
                        ticks: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000'
                        }
                    },
                    x: {
                        grid: {
                            color: this.themeStore.theme === 'dark' ? '#374151' : '#e5e7eb'
                        },
                        ticks: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000'
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
            const distribuicao = this.dados.pacientes?.distribuicao_genero || {};
            const labels = Object.keys(distribuicao);
            const data = Object.values(distribuicao);
            
            return {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [{
                    data: data.length > 0 ? data : [0],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    borderWidth: 0
                }]
            };
        },
        generoChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000',
                            padding: 15
                        }
                    }
                }
            };
        },
        faixaEtariaChartData() {
            const distribuicao = this.dados.pacientes?.distribuicao_faixa_etaria || {};
            const labels = Object.keys(distribuicao);
            const data = Object.values(distribuicao);
            
            return {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [{
                    data: data.length > 0 ? data : [0],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            };
        },
        faixaEtariaChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000',
                            padding: 15
                        }
                    }
                }
            };
        },
        statusEvolutionChartData() {
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

            return {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [
                    {
                        label: 'Em Andamento',
                        data: emAndamentoData.length > 0 ? emAndamentoData : [0],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Recesso',
                        data: recessoData.length > 0 ? recessoData : [0],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Concluídos',
                        data: concluidosData.length > 0 ? concluidosData : [0],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
        },
        statusEvolutionChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000',
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.themeStore.theme === 'dark' ? '#374151' : '#e5e7eb'
                        },
                        ticks: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000'
                        }
                    },
                    x: {
                        grid: {
                            color: this.themeStore.theme === 'dark' ? '#374151' : '#e5e7eb'
                        },
                        ticks: {
                            color: this.themeStore.theme === 'dark' ? '#ffffff' : '#000000'
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

        async onTabChange(event) {
            // Quando a tab Financeiro for selecionada (índice 1), carregar dados
            if (event.index === 1) {
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
.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Garantir que todos os cards tenham a mesma altura */
.grid {
    display: flex;
    flex-wrap: wrap;
}

.grid>.col-12 {
    display: flex;
    flex-direction: column;
}

.grid>.col-12>.card {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Para os cards da primeira linha (estatísticas) */
.grid:first-child>.col-12>.card {
    min-height: 120px;
}

/* Para os cards da segunda linha (financeiro, próxima sessão e aniversariantes) */
.grid:nth-child(2)>.col-12>.card {
    min-height: 180px;
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
    .grid>.col-12>.card {
        min-height: auto;
        margin-bottom: 1rem;
    }

    .grid:first-child>.col-12>.card {
        min-height: 100px;
    }

    .grid:nth-child(2)>.col-12>.card {
        min-height: 160px;
    }

    /* Garantir que os 3 cards da segunda linha sejam empilhados em mobile */
    .grid:nth-child(2)>.col-12 {
        margin-bottom: 1rem;
    }
}

/* Garantir que o conteúdo interno se expanda corretamente */
.card .flex {
    flex: 1;
}

.card .flex-grow-1 {
    flex-grow: 1;
}

.card .mt-auto {
    margin-top: auto;
}

/* Estilo para cards clicáveis */
.cursor-pointer {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cursor-pointer:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
</style>