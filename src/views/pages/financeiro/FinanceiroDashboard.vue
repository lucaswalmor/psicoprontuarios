<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="text-600">Dashboard Financeiro</h5>
                
                <!-- Filtros -->
                <div class="flex gap-2 mb-4">
                    <Button label="Filtros" severity="secondary" icon="pi pi-filter" v-if="!hasFiltros"
                        @click="drawerFilterFinanceiro = true" />
                    <Button label="Limpar Filtros" severity="danger" @click="limparFiltros" v-else />
                    <Button label="Atualizar" icon="pi pi-refresh" @click="carregarDados" />
                    <Button label="Nova Transação" icon="pi pi-plus" @click="$router.push('/financeiro/novo')" />
                    <Button label="Lista de Transações" icon="pi pi-list" @click="$router.push('/financeiro/lista')" />
                </div>

                <!-- Cards de Resumo -->
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-600 font-medium mb-2">Receitas</span>
                                    <div class="text-600 font-medium text-xl">R$ {{ formatarValor(dados.mes_atual?.receitas || 0) }}</div>
                                </div>
                                <i class="pi pi-arrow-up text-green-500 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block text-600 font-medium mb-2">Despesas</span>
                                    <div class="text-600 font-medium text-xl">R$ {{ formatarValor(dados.mes_atual?.despesas || 0) }}</div>
                                </div>
                                <i class="pi pi-arrow-down text-red-400 text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="card" :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''">
                            <div class="flex align-items-center justify-content-between">
                                <div>
                                    <span class="block font-medium mb-2" :class="saldoLabelClass">Saldo</span>
                                    <div class="font-medium text-xl" :class="saldoTextClass">R$ {{ formatarValor(saldo) }}</div>
                                </div>
                                <i class="pi pi-wallet text-2xl" :class="saldoIconClass"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gráficos -->
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="card">
                            <h6 class="text-600 mb-3">Distribuição Receitas/Despesas</h6>
                            <Chart 
                                type="pie" 
                                :data="pieChartData" 
                                :options="pieChartOptions" 
                                class="h-[300px]"
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="card">
                            <h6 class="text-600 mb-3">Evolução Mensal</h6>
                            <Chart 
                                type="bar" 
                                :data="barChartData" 
                                :options="barChartOptions" 
                                class="h-[300px]"
                            />
                        </div>
                    </div>
                </div>

                <!-- Resumo Anual -->
                <div class="grid">
                    <div class="col-12">
                        <div class="card">
                            <h6 class="text-600 mb-3">Resumo Anual</h6>
                            <div class="grid">
                                <div class="col-12 md:col-4">
                                    <div class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-600">
                                        <span class="font-medium text-900">Receitas Anuais</span>
                                        <span class="text-500 font-bold">R$ {{ formatarValor(dados.total_ano?.receitas || 0) }}</span>
                                    </div>
                                </div>
                                <div class="col-12 md:col-4">
                                    <div class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-600">
                                        <span class="font-medium text-900">Despesas Anuais</span>
                                        <span class="text-red-400 font-bold">R$ {{ formatarValor(dados.total_ano?.despesas || 0) }}</span>
                                    </div>
                                </div>
                                <div class="col-12 md:col-4">
                                    <div class="flex justify-content-between align-items-center p-3">
                                        <span class="font-medium text-900">Saldo Anual</span>
                                        <span class="font-bold" :class="(dados.total_ano?.saldo || 0) >= 0 ? 'text-500' : 'text-red-400'">
                                            R$ {{ formatarValor(dados.total_ano?.saldo || 0) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Categorias -->
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="card">
                            <h6 class="text-600 mb-3">Receitas por Categoria</h6>
                            <div v-if="Object.keys(dados.mes_atual?.categorias_receitas || {}).length > 0">
                                <div v-for="(valor, categoria) in dados.mes_atual.categorias_receitas" :key="categoria" class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-600">
                                    <span class="font-medium text-900">{{ categoria }}</span>
                                    <span class="text-500 font-bold">R$ {{ formatarValor(valor) }}</span>
                                </div>
                            </div>
                            <div v-else class="text-center p-4 text-gray-500">
                                Nenhuma receita registrada
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="card">
                            <h6 class="text-600 mb-3">Despesas por Categoria</h6>
                            <div v-if="Object.keys(dados.mes_atual?.categorias_despesas || {}).length > 0">
                                <div v-for="(valor, categoria) in dados.mes_atual.categorias_despesas" :key="categoria" class="flex justify-content-between align-items-center p-3 border-bottom-1 border-gray-600">
                                    <span class="font-medium text-900">{{ categoria }}</span>
                                    <span class="text-red-400 font-bold">R$ {{ formatarValor(valor) }}</span>
                                </div>
                            </div>
                            <div v-else class="text-center p-4 text-gray-500">
                                Nenhuma despesa registrada
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Componente de Filtro -->
        <DrawerFilterFinanceiro 
            :limparCampos="limparCampos" 
            :visible="drawerFilterFinanceiro"
            @update:visible="onUpdateDrawerFilterFinanceiro" 
            @filtrarFinanceiro="filtrarFinanceiro"
            @limparFiltros="limparFiltros"
        />
    </div>
</template>

<script>
import DrawerFilterFinanceiro from '@/components/drawers/DrawerFilterFinanceiro.vue';
import { useThemeStore } from '@/store/theme';

export default {
    name: 'FinanceiroDashboard',
    components: {
        DrawerFilterFinanceiro
    },
    data() {
        return {
            dados: {
                mes_atual: {
                    receitas: 0,
                    despesas: 0,
                    saldo: 0,
                    categorias_receitas: {},
                    categorias_despesas: {}
                },
                dados_anuais: {},
                total_ano: {
                    receitas: 0,
                    despesas: 0,
                    saldo: 0
                },
                periodo: {
                    ano: new Date().getFullYear(),
                    mes: new Date().getMonth() + 1
                }
            },
            filtros: {
                ano: new Date().getFullYear(),
                mes: new Date().getMonth() + 1
            },
            drawerFilterFinanceiro: false,
            hasFiltros: false,
            limparCampos: false
        };
    },
    computed: {
        
        // Store do tema como propriedade computada
        themeStore() {
            return useThemeStore();
        },

        saldo() {
            return (this.dados.mes_atual?.receitas || 0) - (this.dados.mes_atual?.despesas || 0);
        },
        saldoClass() {
            return this.saldo >= 0 ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600';
        },
        saldoLabelClass() {
            return this.saldo >= 0 ? 'text-600' : 'text-600';
        },
        saldoTextClass() {
            return this.saldo >= 0 ? 'text-600' : 'text-600';
        },
        saldoIconClass() {
            return this.saldo >= 0 ? 'text-500' : 'text-red-400';
        },
        pieChartData() {
            return {
                labels: ['Receitas', 'Despesas'],
                datasets: [{
                    data: [
                        this.dados.mes_atual?.receitas || 0,
                        this.dados.mes_atual?.despesas || 0
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
        barChartData() {
            const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const receitasData = [];
            const despesasData = [];
            
            // Preencher dados para os 12 meses
            for (let i = 1; i <= 12; i++) {
                const mesKey = i.toString().padStart(2, '0'); // Garantir formato 01, 02, etc.
                const dadosMes = this.dados.dados_anuais?.[mesKey] || { receitas: 0, despesas: 0 };
                
                receitasData.push(parseFloat(dadosMes.receitas || 0));
                despesasData.push(parseFloat(dadosMes.despesas || 0));
            }

            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Receitas',
                        data: receitasData,
                        backgroundColor: '#22c55e',
                        borderColor: '#16a34a',
                        borderWidth: 1
                    },
                    {
                        label: 'Despesas',
                        data: despesasData,
                        backgroundColor: '#ef4444',
                        borderColor: '#dc2626',
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
        async carregarDados(filtrosAdicionais = {}) {
            try {
                const params = {
                    ano: this.filtros.ano,
                    mes: this.filtros.mes,
                    ...filtrosAdicionais
                };
                
                const response = await this.$financeirosService.dashboard(params);
                this.dados = response.data;
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        },
        filtrarFinanceiro(filtro) {
            this.carregarDados(filtro);
            this.hasFiltros = true;
            this.drawerFilterFinanceiro = false;
        },
        limparFiltros() {
            this.hasFiltros = false;
            this.drawerFilterFinanceiro = false;
            this.limparCampos = true;
            this.carregarDados();
        },
        onUpdateDrawerFilterFinanceiro(event) {
            this.drawerFilterFinanceiro = event;
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