<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="text-500 mb-4">
                    Dashboard Geral 
                    <!-- <span v-if="themeStore.theme === 'dark'" class="text-blue-300">(Tema Escuro)</span>
                    <span v-else class="text-gray-500">(Tema Claro)</span> -->
                </h5>
                <!-- Cards de Estatísticas -->
                <div class="grid">
                    <!-- Total de Pacientes -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-3' : 'md:col-4'">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-2xl text-500 font-medium mb-2">Total de Pacientes</span>
                                    <!-- <span class="block text-blue-500 text-2xl font-medium mb-2">Total de Pacientes</span> -->
                                    <div class="font-medium text-xl text-500">{{ dados.pacientes?.pacientes_total || 0 }}</div>
                                </div>
                                <i :class="`pi pi-users text-2xl text-500`"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sessões do dia -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-3' : 'md:col-4'">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-2xl text-500 font-medium mb-2">Sessões do dia</span>
                                    <div class="text-500 font-medium text-xl">{{ dados.prontuarios?.sessoes_do_dia || 0 }}</div>
                                </div>
                                <i :class="`pi pi-calendar text-500 text-2xl`"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Prontuários 30 dias -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-3' : 'md:col-4'">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="text-500 block text-2xl font-medium mb-2">Prontuários (30 dias)</span>
                                    <div class="text-500 font-medium text-xl">{{ dados.prontuarios?.prontuarios_30_dias || 0 }}</div>
                                </div>
                                <i :class="`pi pi-calendar text-500 text-2xl`"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Saldo do Mês -->
                    <div class="col-12 md:col-3" v-if="isPlanoProfissional">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block font-medium mb-2 text-2xl text-500">Saldo do Mês</span>
                                    <div class="font-medium text-xl text-500">
                                        R$ {{ formatarValor(dados.financeiro?.saldo_mes || 0) }}
                                    </div>
                                </div>
                                <i class="pi pi-wallet text-2xl text-500"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cards Financeiros -->
                <div class="grid mt-4" v-if="isPlanoProfissional">
                    <div class="col-12 md:col-4">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex flex-column h-full">
                                <div class="flex align-items-center justify-content-between mb-3">
                                    <h6 class="text-500 font-bold mb-0 text-lg">Resumo Financeiro do Mês</h6>
                                    <i class="pi pi-chart-line text-500 text-xl"></i>
                                </div>
                                <div class="grid flex-grow-1">
                                    <div class="col-6">
                                        <div class="text-center">
                                            <div class="flex align-items-center justify-content-center mb-2">
                                                <i class="pi pi-arrow-up text-green-300 text-lg mr-2"></i>
                                                <span class="text-500 font-semibold text-sm">Receitas</span>
                                            </div>
                                            <div class="text-500 font-bold text-xl">
                                                R$ {{ formatarValor(dados.financeiro?.total_receitas_mes || 0) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-center">
                                            <div class="flex align-items-center justify-content-center mb-2">
                                                <i class="pi pi-arrow-down text-red-300 text-lg mr-2"></i>
                                                <span class="text-500 font-semibold text-sm">Despesas</span>
                                            </div>
                                            <div class="text-500 font-bold text-xl">
                                                R$ {{ formatarValor(dados.financeiro?.total_despesas_mes || 0) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Próxima Sessão -->
                    <div class="col-12 md:col-4">
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
                                            <span class="text-500 font-semibold">{{ proximaSessao.nome_paciente }}</span>
                                        </div>
                                        <div class="flex align-items-center">
                                            <i class="pi pi-phone text-pink-300 text-lg mr-2"></i>
                                            <span class="text-500 font-medium text-sm">{{ proximaSessao.telefone_paciente || 'Telefone não informado' }}</span>
                                        </div>
                                    </div>
                                    
                                    <div v-else class="text-center py-3">
                                        <i class="pi pi-calendar-times text-pink-300 text-2xl mb-2"></i>
                                        <div class="text-500 font-medium text-sm">Não há nenhuma sessão agendada para próxima hora</div>
                                    </div>
                                </div>
                                
                                <div class="mt-auto">
                                    <Button 
                                        label="Ver Agenda" 
                                        icon="pi pi-calendar" 
                                        size="small"
                                        class="w-full"
                                        @click="$router.push('/agendamentos')"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Aniversariantes do Mês -->
                    <div class="col-12 md:col-4">
                        <div class="card bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
                            <div class="flex flex-column h-full">
                                <div class="flex align-items-center justify-content-between mb-3">
                                    <h6 class="text-purple-500 font-bold mb-0 text-lg">Aniversariantes do Mês</h6>
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
                                        <div 
                                            v-for="aniversariante in dados.pacientes.aniversariantes_mes.slice(0, 3)" 
                                            :key="aniversariante.id"
                                            class="flex align-items-center mb-2"
                                        >
                                            <i class="pi pi-gift text-purple-300 text-lg mr-2"></i>
                                            <div class="flex-grow-1">
                                                <span class="text-500 font-semibold text-sm">{{ aniversariante.nome }}</span>
                                                <div class="text-purple-200 font-medium text-xs">
                                                    Dia {{ aniversariante.dia_aniversario }}
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="dados.pacientes.aniversariantes_mes.length > 3" class="text-center">
                                            <span class="text-purple-200 font-medium text-xs">
                                                +{{ dados.pacientes.aniversariantes_mes.length - 3 }} mais
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div v-else class="text-center py-3">
                                        <i class="pi pi-calendar-times text-purple-300 text-2xl mb-2"></i>
                                        <div class="text-500 font-medium text-sm">Nenhum aniversariante este mês</div>
                                    </div>
                                </div>
                                
                                <div class="mt-auto">
                                    <Button 
                                        label="Ver Pacientes" 
                                        icon="pi pi-users" 
                                        size="small"
                                        class="w-full"
                                        @click="$router.push('/pacientes')"
                                    />
                                </div>
                            </div>
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
                    <!-- Gráfico Pizza - Receitas vs Despesas -->
                    <div class="col-12 md:col-4" v-if="isPlanoProfissional">
                        <div class="card">
                            <h6 class="text-500 mb-3">Receitas vs Despesas (Mês)</h6>
                            <Chart 
                                type="pie" 
                                :data="pieChartData" 
                                :options="pieChartOptions" 
                                class="h-[250px]"
                            />
                        </div>
                    </div>
                    
                    <!-- Gráfico Linha - Evolução Financeira -->
                    <div class="col-12 md:col-4" v-if="isPlanoProfissional">
                        <div class="card">
                            <h6 class="text-500 mb-3">Evolução Financeira (6 meses)</h6>
                            <Chart 
                                type="line" 
                                :data="lineChartData" 
                                :options="lineChartOptions" 
                                class="h-[250px]"
                            />
                        </div>
                    </div>
                    
                    <!-- Gráfico Barra - Crescimento de Pacientes -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-4' : 'md:col-12'">
                        <div class="card">
                            <h6 class="text-500 mb-3">Crescimento de Pacientes (6 meses)</h6>
                            <Chart 
                                type="bar" 
                                :data="barChartData" 
                                :options="barChartOptions" 
                                class="h-[250px]"
                            />
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
                                <div 
                                    v-for="paciente in dados.pacientes.ultimos_pacientes" 
                                    :key="paciente.id"
                                    class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-500"
                                >
                                    <div>
                                        <span class="font-medium text-900">{{ paciente.nome }}</span>
                                        <div class="text-sm text-gray-500">
                                            {{ formatarData(paciente.created_at) }}
                                        </div>
                                    </div>
                                    <Button 
                                        icon="pi pi-eye" 
                                        rounded 
                                        outlined 
                                        size="small"
                                        @click="$router.push(`/pacientes/editar/${paciente.id}`)"
                                    />
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
                                <div 
                                    v-for="prontuario in dados.prontuarios.ultimos_prontuarios" 
                                    :key="prontuario.id"
                                    class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-500"
                                >
                                    <div>
                                        <span class="font-medium text-900">{{ prontuario.paciente_nome }}</span>
                                        <div class="text-sm text-gray-500">
                                            {{ formatarData(prontuario.created_at) }}
                                        </div>
                                    </div>
                                    <Button 
                                        icon="pi pi-eye" 
                                        rounded 
                                        outlined 
                                        size="small"
                                        @click="$router.push(`/pacientes/prontuarios/${prontuario.paciente_id}`)"
                                    />
                                </div>
                            </div>
                            <div v-else class="text-center p-4 text-gray-500">
                                Nenhum prontuário criado
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import { useThemeStore } from '@/store/theme';

export default {
    name: 'DashboardGeral',
    data() {
        return {
            dados: {
                pacientes: {
                    pacientes_total: 0,
                    ultimos_pacientes: [],
                    crescimento_pacientes: {}
                },
                prontuarios: {
                    sessoes_do_dia: 0,
                    prontuarios_30_dias: 0,
                    ultimos_prontuarios: []
                },
                financeiro: {
                    total_receitas_mes: 0,
                    total_despesas_mes: 0,
                    saldo_mes: 0,
                    saldo_total: 0,
                    evolucao_financeira: {},
                    alerta_financeiro: false
                }
                // Removido o campo 'plano' daqui pois será acessado via store
            },
            proximaSessao: null,
            loading: false
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
        pieChartData() {
            if (!this.isPlanoProfissional) {
                return {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [],
                        borderWidth: 2,
                        borderColor: '#374151'
                    }]
                };
            }
            
            return {
                labels: ['Receitas', 'Despesas'],
                datasets: [{
                    data: [
                        this.dados.financeiro?.total_receitas_mes || 0,
                        this.dados.financeiro?.total_despesas_mes || 0
                    ],
                    backgroundColor: ['#22c55e', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#374151'
                }]
            };
        },
        pieChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            };
        },
        lineChartData() {
            if (!this.isPlanoProfissional) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            
            const labels = [];
            const receitasData = [];
            const despesasData = [];
            
            Object.values(this.dados.financeiro?.evolucao_financeira || {}).forEach(item => {
                labels.push(item.mes);
                receitasData.push(parseFloat(item.receitas || 0));
                despesasData.push(parseFloat(item.despesas || 0));
            });

            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Receitas',
                        data: receitasData,
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Despesas',
                        data: despesasData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    }
                ]
            };
        },
        lineChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            };
        },
        barChartData() {
            const labels = [];
            const data = [];
            
            // Mapeamento de meses em inglês para português
            const mesesTraduzidos = {
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
                'Dec': 'Dez'
            };
            
            Object.values(this.dados.pacientes?.crescimento_pacientes || {}).forEach(item => {
                // Traduz o nome do mês se estiver em inglês
                const mesOriginal = item.mes;
                const mesTraduzido = mesesTraduzidos[mesOriginal] || mesOriginal;
                
                labels.push(mesTraduzido);
                data.push(item.total);
            });

            return {
                labels: labels,
                datasets: [{
                    label: 'Pacientes',
                    data: data,
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            };
        },
        barChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            };
        },
        isPlanoProfissional() {
            // Verificar se é usuário vitalício OU se tem plano Profissional
            return this.planStore.isVitalicio || this.planStore.planInfo?.nome === 'Profissional';
        }
    },
    async mounted() {
        // Inicializar o store do tema
        this.themeStore.init();
        
        // Carregar dados do plano primeiro
        if (!this.planStore.hasPlanData) {
            await this.planStore.fetchPlanInfo();
        }
        
        // Depois carregar dados do dashboard
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

.grid > .col-12 {
    display: flex;
    flex-direction: column;
}

.grid > .col-12 > .card {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Para os cards da primeira linha (estatísticas) */
.grid:first-child > .col-12 > .card {
    min-height: 120px;
}

/* Para os cards da segunda linha (financeiro, próxima sessão e aniversariantes) */
.grid:nth-child(2) > .col-12 > .card {
    min-height: 180px;
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
    .grid > .col-12 > .card {
        min-height: auto;
        margin-bottom: 1rem;
    }
    
    .grid:first-child > .col-12 > .card {
        min-height: 100px;
    }
    
    .grid:nth-child(2) > .col-12 > .card {
        min-height: 160px;
    }
    
    /* Garantir que os 3 cards da segunda linha sejam empilhados em mobile */
    .grid:nth-child(2) > .col-12 {
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
</style> 