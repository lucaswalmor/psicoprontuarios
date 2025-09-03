<template>
    <div class="card">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6 mb-6">
            <div class="flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h1 class="text-light text-4xl font-bold mb-2">{{ paciente?.nome || 'Carregando...' }}</h1>
                    <div class="flex align-items-center gap-4 text-blue-100">
                        <div v-if="paciente?.data_nascimento" class="flex align-items-center">
                            <i class="pi pi-calendar mr-2"></i>
                            <span>{{ calcularIdade(paciente.data_nascimento) }} anos</span>
                        </div>
                        <div v-if="paciente?.email" class="flex align-items-center">
                            <i class="pi pi-envelope mr-2"></i>
                            <span>{{ paciente.email }}</span>
                        </div>
                        <div class="flex align-items-center">
                            <i class="pi pi-info-circle mr-2" v-tooltip.top="'Ao clicar no status é possivel alterar o status do tratamento do paciente'"></i>
                            <Tag :severity="getStatusSeverity(paciente?.status_tratamento)"
                                :value="paciente?.status_tratamento || 'N/A'" 
                                class="cursor-pointer"
                                @click="abrirDialogAlterarStatus"
                                v-if="!planStore.isPlanPaused" />
                            <Tag :severity="getStatusSeverity(paciente?.status_tratamento)"
                                :value="paciente?.status_tratamento || 'N/A'" 
                                v-else />
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button icon="pi pi-user-edit" label="Editar" @click="editarPaciente"
                        v-if="!planStore.isPlanPaused" />
                    <Button icon="pi pi-trash" label="Excluir" severity="danger" @click="confirmarExclusao($event)"
                        v-if="!planStore.isPlanPaused" />
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
                            <Button v-if="!planStore.isPlanPaused && paciente" label="Novo Prontuário" icon="pi pi-plus"
                                @click="abrirDialogNovoProntuario" />
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
                            @anexo-deletado="onAnexoDeletado"
                            @anexo-uploaded="onAnexoUploaded"
                        />
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <DialogNovoProntuario :visible="dialogNovoProntuario" :paciente="paciente || {}"
            @update:visible="dialogNovoProntuario = false" @salvarProntuario="onProntuarioSalvo" />
        
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
import ListaSessoesPacientes from './ListaSessoesPacientes.vue';
import ListaProntuarios from './ListaProntuarios.vue';
import ListaAnexos from './ListaAnexos.vue';
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
        DialogNovoProntuario,
        DialogAlterarStatus,
    },
    computed: {
        planStore() {
            return usePlanStore();
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
            activeTab: 0
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
        this.activeTab = 0;
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
                console.log('Carregando estatísticas para paciente:', this.pacienteId);
                const response = await this.$pacientesService.buscarEstatisticas(this.pacienteId);
                console.log('Resposta da API de estatísticas:', response);
                
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
                
                console.log('Estatísticas atualizadas:', this.estatisticas);
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
            }
        },



        // Abrir dialog para novo prontuário
        abrirDialogNovoProntuario() {
            this.dialogNovoProntuario = true;
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
        },

        // Callback quando status é alterado
        onStatusAlterado() {
            this.dialogAlterarStatus = false;
            // Recarregar dados do paciente para atualizar o status
            this.carregarDados();
            this.carregarEstatisticas();
        },


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
