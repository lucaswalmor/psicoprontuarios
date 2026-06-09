<template>
    <div class="dash-clinic">
    <DashboardFinanceiroTour />
    <div class="grid">
        <div class="col-12">
            <div class="flex flex-wrap gap-2 justify-content-end align-items-center mb-3">
                <Button
                    label="Filtros"
                    severity="secondary"
                    icon="pi pi-filter"
                    v-if="!hasFiltros"
                    size="small"
                    @click="drawerFilterFinanceiro = true"
                />
                <Button label="Limpar filtros" severity="danger" size="small" @click="limparFiltros" v-else />
            </div>

            <!-- Cards de Resumo -->
            <div class="grid">
                <div class="col-12 md:col-4">
                    <div
                        class="card dash-metric card-clickable"
                        data-tour="tour-fin-receitas"
                        :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                        @click="$router.push('/financeiro/receitas')"
                    >
                        <div class="flex align-items-center justify-content-between gap-3 pl-2">
                            <div class="flex-1 min-w-0">
                                <span class="dash-metric__label">Receitas</span>
                                <div class="dash-metric__value">R$ {{ formatarValor(dados.mes_atual?.receitas || 0) }}</div>
                            </div>
                            <div class="dash-metric__icon dash-metric__icon--income flex-shrink-0">
                                <i class="pi pi-arrow-up"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-4">
                    <div
                        class="card dash-metric card-clickable"
                        data-tour="tour-fin-despesas"
                        :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                        @click="$router.push('/financeiro/despesas')"
                    >
                        <div class="flex align-items-center justify-content-between gap-3 pl-2">
                            <div class="flex-1 min-w-0">
                                <span class="dash-metric__label">Despesas</span>
                                <div class="dash-metric__value">R$ {{ formatarValor(dados.mes_atual?.despesas || 0) }}</div>
                            </div>
                            <div class="dash-metric__icon dash-metric__icon--expense flex-shrink-0">
                                <i class="pi pi-arrow-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-4">
                    <div
                        class="card dash-metric"
                        data-tour="tour-fin-saldo"
                        :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : ''"
                    >
                        <div class="flex align-items-center justify-content-between gap-3 pl-2">
                            <div class="flex-1 min-w-0">
                                <span class="dash-metric__label">Saldo</span>
                                <div class="dash-metric__value" :class="saldo >= 0 ? '' : 'text-red-500'">R$ {{ formatarValor(saldo) }}</div>
                            </div>
                            <div
                                class="dash-metric__icon flex-shrink-0"
                                :class="saldo >= 0 ? 'dash-metric__icon--income' : 'dash-metric__icon--risk'"
                            >
                                <i class="pi pi-wallet"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="grid">
                <div class="col-12 md:col-12">
                    <div class="card" data-tour="tour-fin-fluxo">
                        <h6 class="mb-3">Fluxo de caixa</h6>
                        
                        <!-- Filtros de Data -->
                        <div class="grid mb-4">
                            <div class="col-12 md:col-6">
                                <div class="flex gap-2">
                                    <div class="flex-1">
                                        <label class="block text-600 mb-2">Data Inicial</label>
                                        <DatePicker 
                                            v-model="filtrosData.data_inicial" 
                                            dateFormat="dd/mm/yy" 
                                            placeholder="Data inicial"
                                            class="w-full"
                                            @update:modelValue="aplicarFiltrosData"
                                        />
                                    </div>
                                    <div class="flex-1">
                                        <label class="block text-600 mb-2">Data Final</label>
                                        <DatePicker 
                                            v-model="filtrosData.data_final" 
                                            dateFormat="dd/mm/yy" 
                                            placeholder="Data final"
                                            class="w-full"
                                            @update:modelValue="aplicarFiltrosData"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-12 md:col-6">
                                <div class="flex flex-column justify-content-end">
                                    <label class="block text-600 mb-2">Filtros Rápidos</label>
                                    <div class="flex gap-2">
                                        <Button 
                                            label="DIA" 
                                            size="small" 
                                            :severity="filtroAtivo === 'dia' ? 'primary' : 'secondary'"
                                            @click="aplicarFiltroRapido('dia')"
                                        />
                                        <Button 
                                            label="SEMANA" 
                                            size="small" 
                                            :severity="filtroAtivo === 'semana' ? 'primary' : 'secondary'"
                                            @click="aplicarFiltroRapido('semana')"
                                        />
                                        <Button 
                                            label="MÊS" 
                                            size="small" 
                                            :severity="filtroAtivo === 'mes' ? 'primary' : 'secondary'"
                                            @click="aplicarFiltroRapido('mes')"
                                        />
                                        <Button 
                                            label="TRIMESTRE" 
                                            size="small" 
                                            :severity="filtroAtivo === 'trimestre' ? 'primary' : 'secondary'"
                                            @click="aplicarFiltroRapido('trimestre')"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
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
                    <div class="card" data-tour="tour-fin-resumo-anual">
                        <h6 class="mb-3">Resumo anual</h6>
                        <div class="grid">
                            <div class="col-12 md:col-4">
                                <div class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
                                    <span class="font-medium text-900">Receitas anuais</span>
                                    <span class="font-bold dash-figure-accent">R$ {{ formatarValor(dados.total_ano?.receitas || 0) }}</span>
                                </div>
                            </div>
                            <div class="col-12 md:col-4">
                                <div class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
                                    <span class="font-medium text-900">Despesas anuais</span>
                                    <span class="text-red-400 font-bold">R$ {{ formatarValor(dados.total_ano?.despesas || 0) }}</span>
                                </div>
                            </div>
                            <div class="col-12 md:col-4">
                                <div class="dash-list-row flex justify-content-between align-items-center p-3">
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

            <!-- Receitas não recebidas -->
            <div v-if="dados.receitas_em_aberto?.quantidade > 0" class="grid mb-0">
                <div class="col-12">
                    <div class="card">
                        <div class="flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                            <h6 class="m-0">Receitas não recebidas</h6>
                            <Button
                                label="Ver na lista"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                severity="secondary"
                                size="small"
                                text
                                @click="$router.push('/financeiro/receitas?paga=false')"
                            />
                        </div>
                        <div class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
                            <span class="text-600 text-sm">
                                {{ dados.receitas_em_aberto.quantidade }}
                                {{ dados.receitas_em_aberto.quantidade === 1 ? 'receita com data já passada' : 'receitas com data já passada' }}
                            </span>
                            <span class="font-bold dash-figure-pendente">R$ {{ formatarValor(dados.receitas_em_aberto.total_valor) }}</span>
                        </div>
                        <router-link
                            v-for="(item, index) in dados.receitas_em_aberto.itens"
                            :key="item.id"
                            :to="rotaReceitaEmAberto(item.id)"
                            class="dash-list-row dash-list-row--link flex justify-content-between align-items-center p-3 no-underline"
                            :class="{ 'border-bottom-1 border-200': index < dados.receitas_em_aberto.itens.length - 1 }"
                        >
                            <div class="flex flex-column gap-1 min-w-0 pr-3">
                                <span class="font-medium text-900">
                                    {{ item.paciente_nome || item.descricao || 'Receita' }}
                                </span>
                                <span class="text-sm text-500">{{ formatarDataItem(item.data) }}</span>
                            </div>
                            <span class="flex align-items-center gap-2 flex-shrink-0">
                                <span class="font-bold dash-figure-pendente">R$ {{ formatarValor(item.valor) }}</span>
                                <i class="pi pi-angle-right text-400 text-sm"></i>
                            </span>
                        </router-link>
                        <div
                            v-if="dados.receitas_em_aberto.quantidade > (dados.receitas_em_aberto.itens?.length || 0)"
                            class="text-center py-2 px-3 text-sm text-500 border-top-1 border-200"
                        >
                            + {{ dados.receitas_em_aberto.quantidade - dados.receitas_em_aberto.itens.length }}
                            {{ dados.receitas_em_aberto.quantidade - dados.receitas_em_aberto.itens.length === 1 ? 'outra na lista' : 'outras na lista' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Categorias -->
            <div class="grid" data-tour="tour-fin-categorias">
                <div class="col-12 md:col-6">
                    <div class="card">
                        <h6 class="mb-3">Receitas por categoria</h6>
                        <div v-if="Object.keys(dados.mes_atual?.categorias_receitas || {}).length > 0">
                            <div v-for="(valor, categoria) in dados.mes_atual.categorias_receitas" :key="categoria" class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
                                <span class="font-medium text-900">{{ categoria }}</span>
                                <span class="font-bold dash-figure-accent">R$ {{ formatarValor(valor) }}</span>
                            </div>
                        </div>
                        <div v-else class="text-center p-4 text-gray-500">
                            Nenhuma receita registrada
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="card">
                        <h6 class="mb-3">Despesas por categoria</h6>
                        <div v-if="Object.keys(dados.mes_atual?.categorias_despesas || {}).length > 0">
                            <div v-for="(valor, categoria) in dados.mes_atual.categorias_despesas" :key="categoria" class="dash-list-row flex justify-content-between align-items-center p-3 border-bottom-1 border-200">
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

        <!-- Componente de Filtro -->
        <DrawerFilterFinanceiro 
            :limparCampos="limparCampos" 
            :visible="drawerFilterFinanceiro"
            @update:visible="onUpdateDrawerFilterFinanceiro" 
            @filtrarFinanceiro="filtrarFinanceiro"
            @limparFiltros="limparFiltros"
        />
    </div>
    </div>
</template>

<script>
import DashboardFinanceiroTour from '@/components/tour/DashboardFinanceiroTour.vue';
import DrawerFilterFinanceiro from '@/components/drawers/DrawerFilterFinanceiro.vue';
import { useThemeStore } from '@/store/theme';
import { usePlanStore } from '@/store/plan';
import {
    darkenCssColor,
    readPrimaryColor,
    readTextColor,
    readTextMutedColor,
    readThemeResolvedColor,
    rgbaFromCssColor
} from '@/utils/themeCssColors';

export default {
    name: 'FinanceiroDashboard',
    components: {
        DrawerFilterFinanceiro,
        DashboardFinanceiroTour
    },
    props: {
        lazy: {
            type: Boolean,
            default: false
        }
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
                },
                fluxo_caixa: [],
                receitas_em_aberto: {
                    total_valor: 0,
                    quantidade: 0,
                    itens: [],
                },
            },
            filtros: {
                ano: new Date().getFullYear(),
                mes: new Date().getMonth() + 1
            },
            filtrosData: {
                data_inicial: null,
                data_final: null
            },
            filtroAtivo: 'mes', // dia, semana, mes, trimestre
            drawerFilterFinanceiro: false,
            hasFiltros: false,
            limparCampos: false,
            dadosCarregados: false
        };
    },
    computed: {
        
        // Store do tema como propriedade computada
        themeStore() {
            return useThemeStore();
        },

        // Store do plano como propriedade computada
        planStore() {
            return usePlanStore();
        },

        saldo() {
            return this.dados.mes_atual?.saldo || 0;
        },
        barChartData() {
            void this.themeStore.primaryColor;
            void this.themeStore.theme;

            const primary = readPrimaryColor();
            const primaryDark = darkenCssColor(primary, 0.12);
            const receitasPrevFill = rgbaFromCssColor(primary, 0.5);
            const receitasPrevBorder = darkenCssColor(primary, 0.06);

            // Se temos dados de fluxo de caixa (período específico), usar eles
            if (this.dados.fluxo_caixa && this.dados.fluxo_caixa.length > 0) {
                // Formatar labels para exibição (dd/mm)
                // Extrair dia e mês diretamente da string para evitar problemas de fuso horário
                const labels = this.dados.fluxo_caixa.map(item => {
                    // Formato esperado: "YYYY-MM-DD"
                    const partes = item.data.split('-');
                    if (partes.length === 3) {
                        const dia = partes[2];
                        const mes = partes[1];
                        return `${dia}/${mes}`;
                    }
                    // Fallback: usar Date se o formato não for o esperado
                    const data = new Date(item.data + 'T12:00:00'); // Adicionar meio-dia para evitar problemas de fuso
                    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
                });
                
                // Separar receitas e despesas por status de pagamento
                const receitasPagasData = this.dados.fluxo_caixa.map(item => parseFloat(item.receitas_pagas || 0));
                const receitasPrevistasData = this.dados.fluxo_caixa.map(item => parseFloat(item.receitas_previstas || 0));
                const despesasPagasData = this.dados.fluxo_caixa.map(item => parseFloat(item.despesas_pagas || 0));
                const despesasPrevistasData = this.dados.fluxo_caixa.map(item => parseFloat(item.despesas_previstas || 0));
                
                // Usar o saldo acumulativo que vem do backend
                // O backend já calcula o saldo acumulativo corretamente (receitas_pagas - despesas_pagas) dia a dia
                const saldoAcumulativoData = this.dados.fluxo_caixa.map(item => parseFloat(item.saldo_acumulativo || 0));

                return {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Receitas Pagas',
                            data: receitasPagasData,
                            backgroundColor: primary,
                            borderColor: primaryDark,
                            borderWidth: 1,
                            type: 'bar'
                        },
                        {
                            label: 'Receitas Previstas',
                            data: receitasPrevistasData,
                            backgroundColor: receitasPrevFill,
                            borderColor: receitasPrevBorder,
                            borderWidth: 1,
                            type: 'bar'
                        },
                        {
                            label: 'Despesas Pagas',
                            data: despesasPagasData,
                            backgroundColor: '#9f1239',
                            borderColor: '#881337',
                            borderWidth: 1,
                            type: 'bar'
                        },
                        {
                            label: 'Despesas Previstas',
                            data: despesasPrevistasData,
                            backgroundColor: '#fda4af',
                            borderColor: '#fb7185',
                            borderWidth: 1,
                            type: 'bar'
                        },
                        {
                            label: 'Saldo Acumulativo',
                            data: saldoAcumulativoData,
                            backgroundColor: 'transparent',
                            borderColor: darkenCssColor(primary, 0.22),
                            borderWidth: 3,
                            type: 'line',
                            fill: false,
                            tension: 0.1
                        }
                    ]
                };
            }

            // Se não há filtros de data específicos, mostrar dados mensais do ano
            // Nota: Para dados anuais, não temos separação de pagas/previstas ainda
            // Por enquanto, mantemos o formato antigo, mas podemos melhorar depois
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
                        backgroundColor: primary,
                        borderColor: primaryDark,
                        borderWidth: 1
                    },
                    {
                        label: 'Despesas',
                        data: despesasData,
                        backgroundColor: '#e11d48',
                        borderColor: '#be123c',
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
                        position: 'top',
                        labels: {
                            color: legendColor
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
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            };
        }
    },
    async mounted() {
        // Inicializar o store do tema
        this.themeStore.init();

        // Se não for lazy, carregar dados imediatamente
        if (!this.lazy) {
            this.inicializarFiltrosData();
            // Usar $nextTick para garantir que os filtros sejam inicializados antes de carregar os dados
            await this.$nextTick();
            await this.carregarDados({
                data_inicial: this.formatarDataParaAPI(this.filtrosData.data_inicial),
                data_final: this.formatarDataParaAPI(this.filtrosData.data_final),
                tipo_periodo: 'mes'
            });
        } else {
            // Mesmo em lazy mode, inicializar os filtros para quando for carregado
            this.inicializarFiltrosData();
        }
    },
    methods: {
        formatarValor(valor) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(valor);
        },
        formatarDataItem(data) {
            if (!data) return '-';
            const [ano, mes, dia] = String(data).split('-');
            if (ano && mes && dia) {
                return `${dia}/${mes}/${ano}`;
            }
            return data;
        },
        rotaReceitaEmAberto(id) {
            return {
                path: `/financeiro/editar/${id}`,
                query: { from: 'dashboard' },
            };
        },
        async carregarDados(filtrosAdicionais = {}) {
            try {
                // Se há filtros de data específicos, usar apenas eles
                // Caso contrário, usar os filtros de ano e mês
                const params = {};
                
                // Verificar se há filtros de data específicos
                const temDataInicial = filtrosAdicionais.data_inicial && 
                    filtrosAdicionais.data_inicial !== null && 
                    filtrosAdicionais.data_inicial !== '';
                const temDataFinal = filtrosAdicionais.data_final && 
                    filtrosAdicionais.data_final !== null && 
                    filtrosAdicionais.data_final !== '';
                
                if (temDataInicial && temDataFinal) {
                    // Usar filtros de data específicos
                    params.data_inicial = filtrosAdicionais.data_inicial;
                    params.data_final = filtrosAdicionais.data_final;
                    if (filtrosAdicionais.tipo_periodo) {
                        params.tipo_periodo = filtrosAdicionais.tipo_periodo;
                    }
                } else {
                    // Usar filtros de ano e mês padrão
                    params.ano = this.filtros.ano;
                    params.mes = this.filtros.mes;
                }
                
                const response = await this.$financeirosService.dashboard(params);
                this.dados = response.data;
                this.dadosCarregados = true;
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
            this.inicializarFiltrosData();
            // Usar $nextTick para garantir que os filtros sejam inicializados antes de carregar os dados
            this.$nextTick(() => {
                this.carregarDados({
                    data_inicial: this.formatarDataParaAPI(this.filtrosData.data_inicial),
                    data_final: this.formatarDataParaAPI(this.filtrosData.data_final),
                    tipo_periodo: 'mes'
                });
            });
        },
        onUpdateDrawerFilterFinanceiro(event) {
            this.drawerFilterFinanceiro = event;
        },
        
        inicializarFiltrosData() {
            const hoje = new Date();
            const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            
            this.filtrosData.data_inicial = primeiroDiaMes;
            this.filtrosData.data_final = ultimoDiaMes;
            this.filtroAtivo = 'mes';
        },
        
        aplicarFiltrosData() {
            if (this.filtrosData.data_inicial && this.filtrosData.data_final) {
                this.filtroAtivo = 'custom';
                // Usar $nextTick para garantir que as datas sejam atualizadas antes de carregar os dados
                this.$nextTick(() => {
                    this.carregarDados({
                        data_inicial: this.formatarDataParaAPI(this.filtrosData.data_inicial),
                        data_final: this.formatarDataParaAPI(this.filtrosData.data_final),
                        tipo_periodo: 'custom'
                    });
                });
            }
        },
        
        aplicarFiltroRapido(tipo) {
            this.filtroAtivo = tipo;
            const hoje = new Date();
            let dataInicial = null;
            let dataFinal = null;
            
            switch (tipo) {
                case 'dia':
                    dataInicial = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                    dataInicial.setHours(0, 0, 0, 0);
                    dataFinal = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                    dataFinal.setHours(23, 59, 59, 999);
                    break;
                    
                case 'semana':
                    const inicioSemana = new Date(hoje);
                    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
                    inicioSemana.setHours(0, 0, 0, 0);
                    const fimSemana = new Date(inicioSemana);
                    fimSemana.setDate(inicioSemana.getDate() + 6);
                    fimSemana.setHours(23, 59, 59, 999);
                    
                    dataInicial = inicioSemana;
                    dataFinal = fimSemana;
                    break;
                    
                case 'mes':
                    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    primeiroDiaMes.setHours(0, 0, 0, 0);
                    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
                    ultimoDiaMes.setHours(23, 59, 59, 999);
                    
                    dataInicial = primeiroDiaMes;
                    dataFinal = ultimoDiaMes;
                    break;
                    
                case 'trimestre':
                    const trimestreAtual = Math.floor(hoje.getMonth() / 3);
                    const primeiroDiaTrimestre = new Date(hoje.getFullYear(), trimestreAtual * 3, 1);
                    primeiroDiaTrimestre.setHours(0, 0, 0, 0);
                    const ultimoDiaTrimestre = new Date(hoje.getFullYear(), (trimestreAtual + 1) * 3, 0);
                    ultimoDiaTrimestre.setHours(23, 59, 59, 999);
                    
                    dataInicial = primeiroDiaTrimestre;
                    dataFinal = ultimoDiaTrimestre;
                    break;
            }
            
            // Atualizar as datas no objeto reativo
            this.filtrosData.data_inicial = dataInicial;
            this.filtrosData.data_final = dataFinal;
            
            // Formatar as datas antes de enviar
            const dataInicialFormatada = this.formatarDataParaAPI(dataInicial);
            const dataFinalFormatada = this.formatarDataParaAPI(dataFinal);
            
            // Aplicar o filtro imediatamente
            const filtrosParaEnviar = {
                data_inicial: dataInicialFormatada,
                data_final: dataFinalFormatada,
                tipo_periodo: tipo
            };
            
            this.carregarDados(filtrosParaEnviar);
        },
        
        formatarDataParaAPI(data) {
            if (!data) return null;
            
            // Se já é uma string no formato YYYY-MM-DD, retornar diretamente
            if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
                return data;
            }
            
            // Criar objeto Date e formatar
            const d = new Date(data);
            
            // Verificar se a data é válida
            if (isNaN(d.getTime())) {
                return null;
            }
            
            // Formatar para YYYY-MM-DD
            const ano = d.getFullYear();
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const dia = String(d.getDate()).padStart(2, '0');
            
            return `${ano}-${mes}-${dia}`;
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.card-clickable {
    cursor: pointer;
    transition: all 0.3s ease;
}

.card-clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
}

.empty-icon {
    margin-bottom: 1.5rem;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.empty-description {
    font-size: 1rem;
    color: var(--text-color-secondary);
    margin-bottom: 1.5rem;
}
</style>

