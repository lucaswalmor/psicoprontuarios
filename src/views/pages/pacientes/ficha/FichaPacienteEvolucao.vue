<template>
    <div class="card ficha-page">
        <FichaPacienteEvolucaoTour />

        <PacientePaginaHeader
            title="Evolução"
            subtitle="Métricas, gráficos e insights do tratamento"
            :paciente="paciente"
            @voltar="voltarParaFicha"
        />

        <div v-if="!loadingEvolucao">
            <div class="grid mb-4" data-tour="tour-ficha-evolucao-resumo">
                <div class="col-12 md:col-3">
                    <div class="ficha-stat-card surface-card border-round-xl p-3 h-full">
                        <span class="ficha-stat-card__label">Média Atual (Últimas 3)</span>
                        <div class="ficha-stat-card__value text-base">
                            Humor: {{ evolucao?.estatisticas?.media_atual?.humor ? evolucao.estatisticas.media_atual.humor.toFixed(1) : '-' }}
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-3">
                    <div class="ficha-stat-card surface-card border-round-xl p-3 h-full">
                        <span class="ficha-stat-card__label">Tendência</span>
                        <div class="ficha-stat-card__value text-base flex align-items-center gap-2">
                            <i :class="getTendenciaIcon(evolucao?.estatisticas?.tendencia)"></i>
                            {{ getTendenciaTexto(evolucao?.estatisticas?.tendencia) }}
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-3">
                    <div class="ficha-stat-card surface-card border-round-xl p-3 h-full">
                        <span class="ficha-stat-card__label">Baseline</span>
                        <div class="ficha-stat-card__value text-base">
                            {{ evolucao?.estatisticas?.baseline?.data || '-' }}
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-3">
                    <div class="ficha-stat-card surface-card border-round-xl p-3 h-full">
                        <span class="ficha-stat-card__label">Melhor Período</span>
                        <div class="ficha-stat-card__value text-base">
                            {{ evolucao?.estatisticas?.melhor_periodo?.data || '-' }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="surface-card border-round-xl p-4 mb-4 border-1 surface-border" v-if="evolucao?.metricas?.length > 0">
                <h5 class="mt-0 mb-3">Evolução Temporal</h5>
                <Chart type="line" :data="lineChartData" :options="lineChartOptions" style="height: 300px;" />
            </div>

            <div class="surface-card border-round-xl p-4 mb-4 border-1 surface-border" v-if="evolucao?.metricas?.length > 0" data-tour="tour-ficha-evolucao-graficos">
                <h5 class="mt-0 mb-3">Comparação Multidimensional</h5>
                <Chart type="radar" :data="radarChartData" :options="radarChartOptions" style="height: 300px;" />
            </div>

            <div class="surface-card border-round-xl p-4 border-1 surface-border" v-if="evolucao?.insights?.length > 0" data-tour="tour-ficha-evolucao-insights">
                <h5 class="mt-0 mb-3">Insights Automáticos</h5>
                <div class="flex flex-column gap-2">
                    <div
                        v-for="(insight, index) in evolucao.insights"
                        :key="index"
                        class="flex align-items-start gap-2 p-3 border-round surface-ground"
                    >
                        <i class="pi pi-info-circle text-primary mt-1"></i>
                        <span class="text-color-secondary">{{ insight }}</span>
                    </div>
                </div>
            </div>

            <div v-if="!evolucao?.metricas?.length" class="text-center p-6" data-tour="tour-ficha-evolucao-insights">
                <i class="pi pi-chart-line text-6xl text-color-secondary mb-3"></i>
                <h5 class="mb-2">Nenhum dado de evolução disponível</h5>
                <p class="text-color-secondary text-sm m-0">Adicione métricas nos prontuários para visualizar a evolução do paciente.</p>
            </div>
        </div>
        <div v-else class="flex justify-content-center p-5">
            <ProgressSpinner />
        </div>
    </div>
</template>

<script>
import ProgressSpinner from 'primevue/progressspinner';
import { useThemeStore } from '@/store/theme';
import FichaPacienteEvolucaoTour from '@/components/tour/pacientes/ficha/FichaPacienteEvolucaoTour.vue';
import PacientePaginaHeader from './PacientePaginaHeader.vue';
import fichaPacienteMixin from './fichaPacienteMixin';
import prontuariosService from '@/services/prontuariosService';

export default {
    name: 'FichaPacienteEvolucao',
    components: {
        ProgressSpinner,
        FichaPacienteEvolucaoTour,
        PacientePaginaHeader
    },
    mixins: [fichaPacienteMixin],
    computed: {
        themeStore() {
            return useThemeStore();
        },
        lineChartData() {
            if (!this.evolucao?.metricas?.length) {
                return { labels: [], datasets: [] };
            }
            const labels = this.evolucao.metricas.map(m => m.data_formatada);
            return {
                labels,
                datasets: [
                    {
                        label: 'Humor',
                        data: this.evolucao.metricas.map(m => m.humor),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Progresso',
                        data: this.evolucao.metricas.map(m => m.avaliacao_progresso),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Ansiedade (GAD-7)',
                        data: this.evolucao.metricas.map(m => m.escala_ansiedade),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Depressão (PHQ-9)',
                        data: this.evolucao.metricas.map(m => m.escala_depressao),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            };
        },
        lineChartOptions() {
            const textColor = this.themeStore.theme === 'dark' ? '#ffffff' : '#000000';
            const textColorSecondary = this.themeStore.theme === 'dark' ? '#9ca3af' : '#6b7280';
            const gridColor = this.themeStore.theme === 'dark' ? '#374151' : '#e5e7eb';
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColorSecondary } },
                    x: { grid: { color: gridColor }, ticks: { color: textColorSecondary } }
                }
            };
        },
        radarChartData() {
            if (!this.evolucao?.estatisticas?.media_atual) {
                return { labels: [], datasets: [] };
            }
            const mediaAtual = this.evolucao.estatisticas.media_atual;
            const baseline = this.evolucao.estatisticas.baseline;
            return {
                labels: ['Humor', 'Progresso', 'Ansiedade (invertido)', 'Depressão (invertido)'],
                datasets: [
                    {
                        label: 'Média Atual',
                        data: [
                            mediaAtual.humor || 0,
                            mediaAtual.avaliacao_progresso || 0,
                            mediaAtual.escala_ansiedade ? (21 - mediaAtual.escala_ansiedade) : 0,
                            mediaAtual.escala_depressao ? (27 - mediaAtual.escala_depressao) : 0
                        ],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#3b82f6'
                    },
                    ...(baseline && baseline.humor ? [{
                        label: 'Baseline',
                        data: [
                            baseline.humor || 0,
                            baseline.avaliacao_progresso || 0,
                            baseline.escala_ansiedade ? (21 - baseline.escala_ansiedade) : 0,
                            baseline.escala_depressao ? (27 - baseline.escala_depressao) : 0
                        ],
                        borderColor: '#9ca3af',
                        backgroundColor: 'rgba(156, 163, 175, 0.2)',
                        pointBackgroundColor: '#9ca3af',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#9ca3af'
                    }] : [])
                ]
            };
        },
        radarChartOptions() {
            const textColor = this.themeStore.theme === 'dark' ? '#ffffff' : '#000000';
            const gridColor = this.themeStore.theme === 'dark' ? '#374151' : '#e5e7eb';
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        grid: { color: gridColor },
                        pointLabels: { color: textColor },
                        ticks: { color: textColor, backdropColor: 'transparent' }
                    }
                }
            };
        }
    },
    data() {
        return {
            evolucao: null,
            loadingEvolucao: false
        };
    },
    async mounted() {
        await this.carregarPaciente();
        this.carregarEvolucao();
    },
    methods: {
        async carregarEvolucao() {
            if (!this.pacienteId) return;
            this.loadingEvolucao = true;
            try {
                const response = await prontuariosService.buscarEvolucao(this.pacienteId);
                this.evolucao = response;
            } catch (error) {
                console.error('Erro ao carregar evolução:', error);
                this.evolucao = { metricas: [], estatisticas: null, insights: [] };
            } finally {
                this.loadingEvolucao = false;
            }
        },
        getTendenciaIcon(tendencia) {
            const icons = {
                melhorando: 'pi pi-arrow-up',
                piorando: 'pi pi-arrow-down',
                estavel: 'pi pi-minus',
                sem_dados: 'pi pi-info-circle'
            };
            return icons[tendencia] || 'pi pi-info-circle';
        },
        getTendenciaTexto(tendencia) {
            const textos = {
                melhorando: 'Melhorando',
                piorando: 'Piorando',
                estavel: 'Estável',
                sem_dados: 'Sem dados'
            };
            return textos[tendencia] || 'Sem dados';
        },
        getTendenciaColor(tendencia) {
            const colors = {
                melhorando: 'text-green-500',
                piorando: 'text-red-500',
                estavel: 'text-yellow-500',
                sem_dados: 'text-gray-500'
            };
            return colors[tendencia] || 'text-gray-500';
        }
    }
};
</script>

<style scoped src="./fichaPacientePage.scss"></style>
