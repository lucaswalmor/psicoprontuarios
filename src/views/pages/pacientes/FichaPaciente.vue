<template>
    <div class="card">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-4 md:p-6 mb-6">
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-start gap-3">
                <div class="flex-grow-1 min-w-0">
                    <h1 class="text-light text-2xl sm:text-3xl md:text-4xl font-bold mb-2 line-height-3 break-words">
                        {{ paciente?.nome || 'Carregando...' }}
                    </h1>
                    <div class="flex flex-wrap align-items-center gap-2 md:gap-4 text-blue-100 mb-2">
                        <div v-if="paciente?.data_nascimento" class="flex align-items-center">
                            <i class="pi pi-calendar mr-2"></i>
                            <span>{{ calcularIdade(paciente.data_nascimento) }} anos</span>
                        </div>
                        <div v-if="paciente?.email" class="flex align-items-center min-w-0">
                            <i class="pi pi-envelope mr-2 shrink-0"></i>
                            <span class="break-all md:break-normal">{{ paciente.email }}</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap align-items-center gap-2">
                        <i class="pi pi-pencil text-blue-100" v-if="podeEditar" v-tooltip.top="'Clique para alterar o status do tratamento'"></i>
                        <Tag :severity="getStatusSeverity(paciente?.status_tratamento)"
                            :value="paciente?.status_tratamento || 'N/A'" 
                            class="cursor-pointer"
                            @click="abrirDialogAlterarStatus"
                            v-if="podeEditar" />
                        <Tag :severity="getStatusSeverity(paciente?.status_tratamento)"
                            :value="paciente?.status_tratamento || 'N/A'" 
                            v-else />
                    </div>
                </div>
                <div
                    v-if="podeEditar"
                    class="flex flex-column sm:flex-row flex-wrap gap-2 w-full md:w-auto md:shrink-0 md:justify-content-end"
                >
                    <Button
                        class="w-full sm:flex-1 md:flex-initial md:w-auto"
                        icon="pi pi-user-edit"
                        label="Editar"
                        @click="editarPaciente"
                    />
                    <Button
                        class="w-full sm:flex-1 md:flex-initial md:w-auto"
                        icon="pi pi-trash"
                        label="Excluir"
                        severity="danger"
                        @click="confirmarExclusao($event)"
                    />
                </div>
            </div>
        </div>

        <!-- Cards de Estatísticas -->
        <div class="grid mb-6">
            <div class="col-12 md:col-3">
                <div class="card bg-blue-50 border-blue-200">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <span class="block text-blue-600 font-medium mb-2">Sessões Agendadas</span>
                            <div class="text-blue-900 font-bold text-xl">{{ estatisticas?.sessoes_agendadas || 0 }}
                            </div>
                        </div>
                        <i class="pi pi-calendar text-blue-400 text-3xl"></i>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-3">
                <div class="card bg-green-50 border-green-200">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <span class="block text-green-600 font-medium mb-2">Sessões Realizadas</span>
                            <div class="text-green-900 font-bold text-xl">{{ estatisticas?.sessoes_realizadas || 0 }}
                            </div>
                        </div>
                        <i class="pi pi-check-circle text-green-400 text-3xl"></i>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-3">
                <div class="card bg-orange-50 border-orange-200">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <span class="block text-orange-600 font-medium mb-2">Sessões Pendentes</span>
                            <div class="text-orange-900 font-bold text-xl">{{ estatisticas?.sessoes_pendentes || 0 }}
                            </div>
                        </div>
                        <i class="pi pi-clock text-orange-400 text-3xl"></i>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-3">
                <div class="card bg-purple-50 border-purple-200">
                    <div class="flex align-items-center justify-content-between">
                        <div>
                            <span class="block text-purple-600 font-medium mb-2">Total de Anexos</span>
                            <div class="text-purple-900 font-bold text-xl">{{ estatisticas?.total_anexos || 0 }}</div>
                        </div>
                        <i class="pi pi-paperclip text-purple-400 text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <Tabs v-model:value="activeTab">
            <TabList>
                <Tab :value="0">Dados Pessoais</Tab>
                <Tab :value="1">Prontuários</Tab>
                <Tab :value="2">Sessões</Tab>
                <Tab :value="3">Anexos</Tab>
                <Tab :value="4">Anamnese</Tab>
                <Tab :value="5">Evolução</Tab>
            </TabList>
            <TabPanels>
                <!-- Tab Dados Pessoais -->
                <TabPanel :value="0">
                    <div class="card" v-if="paciente">
                        <h5 class="text-500 mb-4">Informações do Paciente</h5>

                        <!-- Informações Essenciais -->
                        <div class="grid mb-4">
                            <div class="col-12">
                                <label class="block text-500 font-medium mb-2">Nome Completo</label>
                                <InputText :model-value="paciente.nome || ''" disabled class="w-full"
                                    placeholder="Nome não informado" />
                            </div>
                            <div class="col-12 md:col-6">
                                <label class="block text-500 font-medium mb-2">Telefone</label>
                                <InputMask :model-value="paciente.telefone || ''" disabled class="w-full"
                                    mask="(99) 99999-9999" placeholder="Telefone não informado" />
                            </div>
                            <div class="col-12 md:col-6">
                                <label class="block text-500 font-medium mb-2">E-mail</label>
                                <InputText :model-value="paciente.email || ''" disabled class="w-full"
                                    placeholder="E-mail não informado" />
                            </div>
                            <div class="col-12 md:col-6">
                                <label class="block text-500 font-medium mb-2">Data de Nascimento</label>
                                <InputMask
                                    :model-value="paciente.data_nascimento ? formatarData(paciente.data_nascimento) : ''"
                                    disabled class="w-full" mask="99/99/9999" placeholder="Data não informada" />
                            </div>
                            <div class="col-12 md:col-6">
                                <label class="block text-500 font-medium mb-2">Status do Tratamento</label>
                                <Tag :severity="getStatusSeverity(paciente.status_tratamento)"
                                    :value="paciente.status_tratamento || 'Não informado'"
                                    class="w-full justify-content-center" />
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <!-- Tab Prontuários -->
                <TabPanel :value="1">
                    <div class="card">
                        <div class="flex justify-content-between align-items-center mb-4">
                            <h5 class="text-500 mb-0">Lista de Prontuários</h5>
                            <div class="flex gap-2">
                                <Button 
                                    v-if="paciente && totalProntuarios > 0" 
                                    label="Exportar Todos" 
                                    icon="pi pi-file-export" 
                                    severity="help"
                                    @click="exportarTodosProntuarios" 
                                />
                                <Button 
                                    v-if="podeEditar && paciente" 
                                    label="Novo Prontuário" 
                                    icon="pi pi-plus"
                                    @click="abrirDialogNovoProntuario" 
                                />
                            </div>
                        </div>
                        <ListaProntuarios 
                            :paciente-id="pacienteId"
                            :prontuarios="prontuarios"
                            :loading="loadingProntuarios"
                            :total-records="totalProntuarios"
                            @page-change="onPageChangeProntuarios"
                            @prontuario-salvo="onProntuarioSalvo"
                        />
                    </div>
                </TabPanel>

                <!-- Tab Sessões -->
                <TabPanel :value="2">
                    <ListaSessoesPacientes 
                        ref="listaSessoes"
                        :paciente-id="pacienteId || ''"
                        :paciente="paciente"
                        :status-tratamento="paciente?.status_tratamento"
                        v-if="pacienteId"
                        @agendamento-salvo="onAgendamentoSalvo"
                    />
                    <div v-else class="text-center p-4 text-500">
                        Carregando informações do paciente...
                    </div>
                </TabPanel>

                <!-- Tab Anexos -->
                <TabPanel :value="3">
                    <div class="card">
                        <div class="mb-4">
                            <h5 class="text-500 mb-0">Lista de Anexos</h5>
                        </div>
                        <ListaAnexos 
                            :paciente-id="pacienteId"
                            :anexos="anexos"
                            :loading="loadingAnexos"
                            :paciente="paciente"
                            :status-tratamento="paciente?.status_tratamento"
                            @anexo-deletado="onAnexoDeletado"
                            @anexo-uploaded="onAnexoUploaded"
                        />
                    </div>
                </TabPanel>

                <!-- Tab Anamnese -->
                <TabPanel :value="4">
                    <Anamnese 
                        ref="anamnese"
                        :paciente-id="pacienteId"
                        :status-tratamento="paciente?.status_tratamento"
                    />
                </TabPanel>

                <!-- Tab Evolução -->
                <TabPanel :value="5">
                    <div class="card" v-if="!loadingEvolucao">
                        <h5 class="text-500 mb-4">Evolução do Paciente</h5>

                        <!-- Cards de Resumo -->
                        <div class="grid mb-4">
                            <div class="col-12 md:col-3">
                                <div class="card bg-blue-50 border-blue-200">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-blue-600 font-medium mb-2">Média Atual (Últimas 3)</span>
                                            <div class="text-blue-900 font-bold text-xl">
                                                Humor: {{ evolucao?.estatisticas?.media_atual?.humor ? evolucao.estatisticas.media_atual.humor.toFixed(1) : '-' }}
                                            </div>
                                        </div>
                                        <i class="pi pi-chart-line text-blue-400 text-3xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 md:col-3">
                                <div class="card bg-green-50 border-green-200">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-green-600 font-medium mb-2">Tendência</span>
                                            <div class="text-green-900 font-bold text-xl">
                                                <i :class="getTendenciaIcon(evolucao?.estatisticas?.tendencia)"></i>
                                                {{ getTendenciaTexto(evolucao?.estatisticas?.tendencia) }}
                                            </div>
                                        </div>
                                        <i :class="[getTendenciaIcon(evolucao?.estatisticas?.tendencia), getTendenciaColor(evolucao?.estatisticas?.tendencia), 'text-3xl']"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 md:col-3">
                                <div class="card bg-purple-50 border-purple-200">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-purple-600 font-medium mb-2">Baseline</span>
                                            <div class="text-purple-900 font-bold text-sm">
                                                {{ evolucao?.estatisticas?.baseline?.data || '-' }}
                                            </div>
                                        </div>
                                        <i class="pi pi-calendar text-purple-400 text-3xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 md:col-3">
                                <div class="card bg-orange-50 border-orange-200">
                                    <div class="flex align-items-center justify-content-between">
                                        <div>
                                            <span class="block text-orange-600 font-medium mb-2">Melhor Período</span>
                                            <div class="text-orange-900 font-bold text-sm">
                                                {{ evolucao?.estatisticas?.melhor_periodo?.data || '-' }}
                                            </div>
                                        </div>
                                        <i class="pi pi-star text-orange-400 text-3xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gráfico de Linha - Evolução Temporal -->
                        <div class="card mb-4" v-if="evolucao?.metricas?.length > 0">
                            <h6 class="text-500 mb-3">Evolução Temporal</h6>
                            <Chart type="line" :data="lineChartData" :options="lineChartOptions" style="height: 300px;" />
                        </div>

                        <!-- Gráfico de Radar -->
                        <div class="card mb-4" v-if="evolucao?.metricas?.length > 0">
                            <h6 class="text-500 mb-3">Comparação Multidimensional</h6>
                            <Chart type="radar" :data="radarChartData" :options="radarChartOptions" style="height: 300px;" />
                        </div>

                        <!-- Insights Automáticos -->
                        <div class="card" v-if="evolucao?.insights?.length > 0">
                            <h6 class="text-500 mb-3">Insights Automáticos</h6>
                            <div class="flex flex-column gap-2">
                                <div v-for="(insight, index) in evolucao.insights" :key="index" 
                                     class="flex align-items-start gap-2 p-3 border-round"
                                     :class="themeStore.theme === 'dark' ? 'bg-white-alpha-10' : 'bg-gray-50'">
                                    <i class="pi pi-info-circle text-primary mt-1"></i>
                                    <span class="text-500">{{ insight }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Mensagem quando não há dados -->
                        <div v-if="!evolucao?.metricas?.length" class="text-center p-6">
                            <i class="pi pi-chart-line text-6xl text-gray-400 mb-3"></i>
                            <h6 class="text-500 mb-2">Nenhum dado de evolução disponível</h6>
                            <p class="text-500 text-sm">Adicione métricas nos prontuários para visualizar a evolução do paciente.</p>
                        </div>
                    </div>
                    <div v-else class="text-center p-6">
                        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                        <p class="text-500 mt-3">Carregando dados de evolução...</p>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <DialogNovoProntuario 
            :visible="dialogNovoProntuario" 
            :paciente="paciente || {}"
            :paciente-id="pacienteId"
            @update:visible="dialogNovoProntuario = false" 
            @salvarProntuario="onProntuarioSalvo" 
        />
        
        <DialogAlterarStatus 
            :visible="dialogAlterarStatus" 
            :paciente="paciente || {}"
            @update:visible="dialogAlterarStatus = false"
            @status-alterado="onStatusAlterado" 
        />
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import { useThemeStore } from '@/store/theme';
import ListaSessoesPacientes from './ListaSessoesPacientes.vue';
import ListaProntuarios from './ListaProntuarios.vue';
import ListaAnexos from './ListaAnexos.vue';
import Anamnese from '@/components/pacientes/Anamnese.vue';
import DialogNovoProntuario from '@/components/dialogs/prontuarios/DialogNovoProntuario.vue';
import DialogAlterarStatus from '@/components/dialogs/pacientes/DialogAlterarStatus.vue';

import prontuariosService from '@/services/prontuariosService';
import anexosService from '@/services/anexosService';

export default {
    name: 'FichaPaciente',
    components: {
        ListaSessoesPacientes,
        ListaProntuarios,
        ListaAnexos,
        Anamnese,
        DialogNovoProntuario,
        DialogAlterarStatus,
    },
    computed: {
        planStore() {
            return usePlanStore();
        },
        themeStore() {
            return useThemeStore();
        },
        
        // Computed para controle de edição baseado no plano e status da assinatura
        podeEditar() {
            // Plano gratuito e vitalício: sempre pode
            if (this.planStore.isGratuito || this.planStore.isVitalicio) {
                return true;
            }
            // Planos pagos: verificar se pode editar dados
            return this.planStore.podeEditarDados;
        },
        
        // Gráfico de linha - Evolução temporal
        lineChartData() {
            if (!this.evolucao?.metricas?.length) {
                return { labels: [], datasets: [] };
            }

            const labels = this.evolucao.metricas.map(m => m.data_formatada);
            const humorData = this.evolucao.metricas.map(m => m.humor).filter(v => v !== null);
            const progressoData = this.evolucao.metricas.map(m => m.avaliacao_progresso).filter(v => v !== null);
            const ansiedadeData = this.evolucao.metricas.map(m => m.escala_ansiedade).filter(v => v !== null);
            const depressaoData = this.evolucao.metricas.map(m => m.escala_depressao).filter(v => v !== null);

            return {
                labels: labels,
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
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
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
                            color: textColorSecondary
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColorSecondary
                        }
                    }
                }
            };
        },
        
        // Gráfico de radar
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
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: gridColor
                        },
                        pointLabels: {
                            color: textColor
                        },
                        ticks: {
                            color: textColor,
                            backdropColor: 'transparent'
                        }
                    }
                }
            };
        }
    },
    data() {
        return {
            pacienteId: null,
            paciente: null,
            loading: false,
            estatisticas: {
                sessoes_agendadas: 0,
                sessoes_realizadas: 0,
                sessoes_pendentes: 0,
                total_anexos: 0
            },

            // Prontuários
            prontuarios: [],
            loadingProntuarios: false,
            totalProntuarios: 0,
            currentPageProntuarios: 1,
            // Anexos
            anexos: [],
            loadingAnexos: false,
            // Dialogs
            dialogNovoProntuario: false,
            dialogAlterarStatus: false,

            // Tab ativa
            activeTab: 0,

            // Evolução
            evolucao: null,
            loadingEvolucao: false
        };
    },
    watch: {
        activeTab(newTab, oldTab) {
            this.onTabChange(newTab);
        }
    },
    async mounted() {
        this.pacienteId = this.$route.params.id;
        await this.carregarDados();
        // Carregar estatísticas imediatamente
        await this.carregarEstatisticas();
        
        // Verificar se há query param para definir a tab ativa
        const tabParam = this.$route.query.tab;
        if (tabParam !== undefined) {
            const tabIndex = parseInt(tabParam);
            if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 5) {
                this.activeTab = tabIndex;
            } else {
                this.activeTab = 0;
            }
        } else {
            this.activeTab = 0;
        }
    },
    methods: {
        async carregarDados() {
            this.loading = true;
            try {
                const response = await this.$pacientesService.getById(this.pacienteId);
                this.paciente = response;
            } catch (error) {
                console.error('Erro ao carregar dados do paciente:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do paciente',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        async carregarEstatisticas() {
            try {
                const response = await this.$pacientesService.buscarEstatisticas(this.pacienteId);
                
                // A resposta já vem diretamente do backend, não precisa de .data
                if (response.sessoes_agendadas !== undefined) {
                    this.estatisticas = response;
                } else if (response.data) {
                    this.estatisticas = response.data;
                } else {
                    console.warn('Estrutura de resposta inesperada:', response);
                    // Fallback: usar valores padrão
                    this.estatisticas = {
                        sessoes_agendadas: 0,
                        sessoes_realizadas: 0,
                        sessoes_pendentes: 0,
                        total_anexos: 0
                    };
                }
                
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
                // Em caso de erro, usar valores padrão
                this.estatisticas = {
                    sessoes_agendadas: 0,
                    sessoes_realizadas: 0,
                    sessoes_pendentes: 0,
                    total_anexos: 0
                };
            }
        },
        calcularIdade(dataNascimento) {
            if (!dataNascimento) return null;
            
            let dataNascimentoFormatada;
            
            // Se a data já está no formato dd/mm/yyyy, converter para Date
            if (typeof dataNascimento === 'string' && dataNascimento.includes('/')) {
                const partes = dataNascimento.split('/');
                if (partes.length === 3) {
                    // Formato dd/mm/yyyy -> yyyy-mm-dd para Date
                    dataNascimentoFormatada = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
                } else {
                    dataNascimentoFormatada = new Date(dataNascimento);
                }
            } else {
                dataNascimentoFormatada = new Date(dataNascimento);
            }
            
            // Verificar se a data é válida
            if (isNaN(dataNascimentoFormatada.getTime())) {
                return null;
            }
            
            const hoje = new Date();
            let idade = hoje.getFullYear() - dataNascimentoFormatada.getFullYear();
            const mes = hoje.getMonth() - dataNascimentoFormatada.getMonth();
            
            if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimentoFormatada.getDate())) {
                idade--;
            }
            
            return idade;
        },
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        formatarCPF(cpf) {
            if (!cpf) return '-';
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        },
        formatarTamanho(bytes) {
            if (!bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        getStatusSeverity(status) {
            const severities = {
                'Em Tratamento': 'info',
                'Concluído': 'success',
                'Pausado': 'warning',
                'Cancelado': 'danger'
            };
            return severities[status] || 'info';
        },
        editarPaciente() {
            this.$router.push(`/pacientes/editar/${this.pacienteId}`);
        },
        confirmarExclusao(event) {
            this.$confirm.require({
                target: event?.currentTarget,
                group: 'headless',
                message: `Tem certeza que deseja excluir o paciente "${this.paciente?.nome}"?`,
                accept: () => this.excluirPaciente(),
                reject: () => { }
            });
        },
        async excluirPaciente() {
            try {
                await this.$pacientesService.excluir(this.pacienteId);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Paciente excluído com sucesso',
                    life: 3000
                });
                this.$router.push('/pacientes');
            } catch (error) {
                console.error('Erro ao excluir paciente:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir paciente',
                    life: 3000
                });
            }
        },

        // Métodos para Prontuários
        async carregarProntuarios() {
            this.loadingProntuarios = true;
            try {
                const response = await prontuariosService.listar(
                    this.pacienteId, 
                    this.currentPageProntuarios
                );
                
                // Ajustar para a estrutura do ProntuariosController
                if (response.prontuarios) {
                    this.prontuarios = response.prontuarios;
                    this.totalProntuarios = response.pagination.total;
                } else {
                    // Fallback para estrutura antiga
                    this.prontuarios = response.data?.data || [];
                    this.totalProntuarios = response.data?.total || 0;
                }
            } catch (error) {
                console.error('Erro ao carregar prontuários:', error);
            } finally {
                this.loadingProntuarios = false;
            }
        },

        // Método para lidar com mudança de página dos prontuários
        onPageChangeProntuarios(event) {
            this.currentPageProntuarios = event.page;
            this.carregarProntuarios();
        },

        // Métodos para Anexos
        async carregarAnexos() {
            this.loadingAnexos = true;
            try {
                const response = await anexosService.listar(this.pacienteId);

                // Ajustar para a estrutura do AnexosController
                if (response.anexos) {
                    this.anexos = response.anexos;
                    this.totalAnexos = response.anexos.length;
                } else {
                    // Fallback para estrutura antiga
                    this.anexos = response.data?.data || [];
                    this.totalAnexos = response.data?.total || 0;
                }
            } catch (error) {
                console.error('Erro ao carregar anexos:', error);
            } finally {
                this.loadingAnexos = false;
            }
        },

        // Métodos para Sessões
        async carregarSessoes() {
            // Emitir evento para o componente filho recarregar os dados
            this.$refs.listaSessoes?.carregarAgendamentos();
        },

        // Métodos para Anamnese
        async carregarAnamnese() {
            // Emitir evento para o componente filho recarregar os dados
            this.$refs.anamnese?.carregarAnamnese();
        },

        // Callback quando anexo é deletado
        onAnexoDeletado() {
            this.carregarAnexos();
            this.carregarEstatisticas();
        },
        
        // Callback quando anexo é feito upload
        onAnexoUploaded() {
            this.carregarAnexos();
            this.carregarEstatisticas();
        },
        onTabChange(tabIndex) {
            switch (tabIndex) {
                case 1: // Tab Prontuários
                    this.carregarProntuarios();
                    break;
                case 2: // Tab Sessões
                    this.carregarSessoes();
                    break;
                case 3: // Tab Anexos
                    this.carregarAnexos();
                    break;
                case 4: // Tab Anamnese
                    this.carregarAnamnese();
                    break;
                case 5: // Tab Evolução
                    this.carregarEvolucao();
                    break;
            }
        },



        // Validar se pode executar ação (verificar se status é "Concluído")
        validarStatusTratamento() {
            if (this.paciente && this.paciente.status_tratamento === 'Concluído') {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'O paciente está com status "Concluído". Altere o status para "Em Tratamento" para executar esta ação.',
                    life: 5000
                });
                return false;
            }
            return true;
        },

        // Abrir dialog para novo prontuário
        abrirDialogNovoProntuario() {
            if (!this.validarStatusTratamento()) {
                return;
            }
            this.dialogNovoProntuario = true;
        },

        // Exportar todos os prontuários do paciente
        async exportarTodosProntuarios() {
            try {
                if (!this.pacienteId) {
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'Atenção',
                        detail: 'Paciente não encontrado',
                        life: 3000
                    });
                    return;
                }

                await this.$prontuariosService.exportarTodosProntuariosPaciente(this.pacienteId);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'PDF exportado com sucesso',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao exportar PDF:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao exportar PDF',
                    life: 3000
                });
            }
        },

        // Abrir dialog para alterar status
        abrirDialogAlterarStatus() {
            this.dialogAlterarStatus = true;
        },

        // Callback quando prontuário é salvo
        onProntuarioSalvo() {
            this.dialogNovoProntuario = false;
            // Recarregar prontuários e estatísticas após salvar
            this.carregarProntuarios();
            this.carregarEstatisticas();
            // Recarregar evolução se estiver na tab de evolução
            if (this.activeTab === 5) {
                this.carregarEvolucao();
            }
        },

        // Callback quando status é alterado
        onStatusAlterado() {
            this.dialogAlterarStatus = false;
            // Recarregar dados do paciente para atualizar o status
            this.carregarDados();
            this.carregarEstatisticas();
        },

        async recarregarAssinatura() {
            try {
                console.log('🔄 Recarregando assinatura...');
                await this.planStore.carregarAssinatura();
                console.log('✅ Assinatura recarregada:', this.planStore.assinatura);
            } catch (error) {
                console.error('❌ Erro ao recarregar assinatura:', error);
            }
        },
        
        // Métodos para Evolução
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
                'melhorando': 'pi pi-arrow-up',
                'piorando': 'pi pi-arrow-down',
                'estavel': 'pi pi-minus',
                'sem_dados': 'pi pi-info-circle'
            };
            return icons[tendencia] || 'pi pi-info-circle';
        },
        getTendenciaTexto(tendencia) {
            const textos = {
                'melhorando': 'Melhorando',
                'piorando': 'Piorando',
                'estavel': 'Estável',
                'sem_dados': 'Sem dados'
            };
            return textos[tendencia] || 'Sem dados';
        },
        getTendenciaColor(tendencia) {
            const colors = {
                'melhorando': 'text-green-500',
                'piorando': 'text-red-500',
                'estavel': 'text-yellow-500',
                'sem_dados': 'text-gray-500'
            };
            return colors[tendencia] || 'text-gray-500';
        }
    }
};
</script>

<style scoped>
.space-y-3>*+* {
    margin-top: 0.75rem;
}

.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.bg-gradient-to-r {
    background: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-900 {
    --tw-gradient-from: #1e3a8a;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(30, 58, 138, 0));
}

.to-indigo-900 {
    --tw-gradient-to: #312e81;
}

/* Estilos para os inputs desabilitados */
:deep(.p-inputtext:disabled) {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    color: #495057;
    cursor: not-allowed;
    opacity: 0.8;
}

:deep(.p-calendar:not(.p-calendar-w-btn) .p-inputtext:disabled) {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    color: #495057;
    cursor: not-allowed;
    opacity: 0.8;
}

:deep(.p-inputmask:disabled) {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    color: #495057;
    cursor: not-allowed;
    opacity: 0.8;
}

/* Estilos para labels */
label {
    color: #6c757d;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
}

/* Espaçamento entre seções */
.grid.mb-4 {
    margin-bottom: 2rem;
}

.grid.mb-4:last-child {
    margin-bottom: 0;
}

/* Responsividade para telas pequenas */
@media (max-width: 768px) {

    .col-12.md\:col-6,
    .col-12.md\:col-3 {
        margin-bottom: 1rem;
    }

    .grid.mb-4 {
        margin-bottom: 1.5rem;
    }
}

/* Estilo para o Tag de status */
:deep(.p-tag) {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
}

/* Hover effect nos inputs (mesmo desabilitados) */
:deep(.p-inputtext:disabled:hover) {
    border-color: #dee2e6;
}

:deep(.p-calendar:not(.p-calendar-w-btn) .p-inputtext:disabled:hover) {
    border-color: #dee2e6;
}

:deep(.p-inputmask:disabled:hover) {
    border-color: #dee2e6;
}

/* Estilo para o cursor pointer no status */
.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    opacity: 0.8;
}
</style>
