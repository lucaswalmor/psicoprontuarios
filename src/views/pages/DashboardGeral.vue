<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="text-600 mb-4">Dashboard Geral</h5>
                <!-- Cards de Estatísticas -->
                <div class="grid">
                    <!-- Total de Pacientes -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-3' : 'md:col-4'">
                        <div class="card bg-blue-900 border-blue-600">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-blue-200 font-medium mb-2">Total de Pacientes</span>
                                    <div class="text-blue-200 font-medium text-xl">{{ dados.pacientes?.pacientes_total || 0 }}</div>
                                </div>
                                <i class="pi pi-users text-blue-400 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Total de Prontuários -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-3' : 'md:col-4'">
                        <div class="card bg-purple-900 border-purple-600">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-purple-200 font-medium mb-2">Total de Prontuários</span>
                                    <div class="text-purple-200 font-medium text-xl">{{ dados.prontuarios?.prontuarios_total || 0 }}</div>
                                </div>
                                <i class="pi pi-file text-purple-400 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Prontuários 30 dias -->
                    <div class="col-12" :class="isPlanoProfissional ? 'md:col-3' : 'md:col-4'">
                        <div class="card bg-orange-900 border-orange-600">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-orange-200 font-medium mb-2">Prontuários (30 dias)</span>
                                    <div class="text-orange-200 font-medium text-xl">{{ dados.prontuarios?.prontuarios_30_dias || 0 }}</div>
                                </div>
                                <i class="pi pi-calendar text-orange-400 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Saldo do Mês -->
                    <div class="col-12 md:col-3" v-if="isPlanoProfissional">
                        <div class="card" :class="saldoClass">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block font-medium mb-2" :class="saldoLabelClass">Saldo do Mês</span>
                                    <div class="font-medium text-xl" :class="saldoTextClass">
                                        R$ {{ formatarValor(dados.financeiro?.saldo_mes || 0) }}
                                    </div>
                                </div>
                                <i class="pi pi-wallet text-2xl" :class="saldoIconClass"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cards Financeiros -->
                <div class="grid mt-4" v-if="isPlanoProfissional">
                    <div class="col-12 md:col-6">
                        <div class="card bg-green-900 border-green-600">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-green-200 font-medium mb-2">Receitas do Mês</span>
                                    <div class="text-green-200 font-medium text-xl">
                                        R$ {{ formatarValor(dados.financeiro?.total_receitas_mes || 0) }}
                                    </div>
                                </div>
                                <i class="pi pi-arrow-up text-green-400 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12 md:col-6">
                        <div class="card bg-red-900 border-red-600">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-red-200 font-medium mb-2">Despesas do Mês</span>
                                    <div class="text-red-200 font-medium text-xl">
                                        R$ {{ formatarValor(dados.financeiro?.total_despesas_mes || 0) }}
                                    </div>
                                </div>
                                <i class="pi pi-arrow-down text-red-400 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card do Plano -->
                <div class="grid mt-4">
                    <div class="col-12">
                        <div class="card" :class="planoCardClass">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block font-medium mb-2" :class="planoLabelClass">Plano Atual</span>
                                    <div class="font-medium text-xl" :class="planoTextClass">
                                        {{ planStore.planInfo?.nome || 'Básico' }}
                                    </div>
                                    <div class="text-sm mt-2" :class="planoDiasClass">
                                        {{ planStore.stats?.limite_pacientes || 0 }} pacientes permitidos
                                    </div>
                                </div>
                                <div class="flex align-items-center">
                                    <i class="pi pi-star text-2xl mr-3" :class="planoIconClass"></i>
                                    <Tag 
                                        v-if="planStore.isPlanPaused" 
                                        value="Plano Pausado!" 
                                        severity="danger" 
                                        class="ml-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alertas -->
                <div class="grid mt-4" v-if="mostrarAlertas && isPlanoProfissional">
                    <div class="col-12">
                        <div class="card bg-red-900 border-red-600" v-if="dados.financeiro?.alerta_financeiro">
                            <div class="flex align-items-center">
                                <i class="pi pi-exclamation-triangle text-red-400 text-xl mr-3"></i>
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
                            <h6 class="text-600 mb-3">Receitas vs Despesas (Mês)</h6>
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
                            <h6 class="text-600 mb-3">Evolução Financeira (6 meses)</h6>
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
                            <h6 class="text-600 mb-3">Crescimento de Pacientes (6 meses)</h6>
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
                            <h6 class="text-600 mb-3">Últimos Pacientes Cadastrados</h6>
                            <div v-if="dados.pacientes?.ultimos_pacientes?.length > 0">
                                <div 
                                    v-for="paciente in dados.pacientes.ultimos_pacientes" 
                                    :key="paciente.id"
                                    class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-600"
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
                            <h6 class="text-600 mb-3">Últimos Prontuários Criados</h6>
                            <div v-if="dados.prontuarios?.ultimos_prontuarios?.length > 0">
                                <div 
                                    v-for="prontuario in dados.prontuarios.ultimos_prontuarios" 
                                    :key="prontuario.id"
                                    class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-600"
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
                    prontuarios_total: 0,
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
            loading: false
        };
    },
    computed: {
        // Store do plano como propriedade computada
        planStore() {
            return usePlanStore();
        },
        
        saldoClass() {
            return this.dados.financeiro?.saldo_mes >= 0 ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600';
        },
        saldoLabelClass() {
            return this.dados.financeiro?.saldo_mes >= 0 ? 'text-green-200' : 'text-red-200';
        },
        saldoTextClass() {
            return this.dados.financeiro?.saldo_mes >= 0 ? 'text-green-200' : 'text-red-200';
        },
        saldoIconClass() {
            return this.dados.financeiro?.saldo_mes >= 0 ? 'text-green-400' : 'text-red-400';
        },
        planoCardClass() {
            return this.planStore.isPlanPaused ? 'bg-orange-900 border-orange-600' : 'bg-gray-900 border-gray-600';
        },
        planoLabelClass() {
            return this.planStore.isPlanPaused ? 'text-orange-200' : 'text-gray-200';
        },
        planoTextClass() {
            return this.planStore.isPlanPaused ? 'text-orange-200' : 'text-gray-200';
        },
        planoDiasClass() {
            return this.planStore.isPlanPaused ? 'text-orange-300' : 'text-gray-300';
        },
        planoIconClass() {
            return this.planStore.isPlanPaused ? 'text-orange-400' : 'text-gray-400';
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
            // Usar o store do plano em vez dos dados do dashboard
            console.log('Dados do plano do store:', this.planStore.planInfo);
            
            // Verificar se é usuário vitalício OU se tem plano Profissional
            return this.planStore.isVitalicio || this.planStore.planInfo?.nome === 'Profissional';
        }
    },
    async mounted() {
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
        async carregarDados() {
            this.loading = true;
            
            try {
                const response = await this.$dashboardService.buscarDados();
                this.dados = response.data;
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
</style> 