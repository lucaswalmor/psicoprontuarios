<template>
    <Dialog :visible="visible" modal header="Editar Agendamento" :style="{ width: '600px' }"
        @update:visible="onUpdateVisible">
        <div class="grid">
            <!-- Loading dos dados -->
            <div v-if="isLoadingDados" class="col-12 flex justify-content-center p-4">
                <ProgressSpinner style="width: 50px; height: 50px" />
                <span class="ml-3">Carregando dados do agendamento...</span>
            </div>

            <!-- Conteúdo do formulário -->
            <div class="col-12" v-else>
                <div class="col-12">
                    <label class="block text-900 font-medium mb-2">Paciente</label>
                    <InputText v-model="agendamentoData.nome_paciente" class="w-full" readonly />
                </div>

                <div class="col-12">
                    <label class="block text-900 font-medium mb-2">Data da Consulta</label>
                    <Calendar v-model="agendamento.data_consulta" dateFormat="dd/mm/yy" class="w-full" />
                </div>

                <div class="col-12">
                    <label class="block text-900 font-medium mb-2">Hora da Consulta</label>
                    <Dropdown v-model="agendamentoData.hora_consulta" :options="horasMinutos" optionLabel="label"
                        optionValue="value" placeholder="Selecione o horário" class="w-full" />
                </div>
            </div>

            <div class="col-12 flex gap-2">
                <Button severity="warning" outlined @click="excluirAgendamento" :loading="isLoadingExcluir"
                    class="flex-1">
                    <i class="pi pi-trash mr-2"></i>
                    Excluir esta consulta
                </Button>

                <Button severity="danger" outlined @click="excluirTodasConsultas" :loading="isLoadingExcluirTodos"
                    class="flex-1">
                    <i class="pi pi-trash mr-2"></i>
                    Excluir todas as consultas
                </Button>
            </div>
        </div>

        <div class="flex gap-2 mt-3 w-full">
            <Button label="Cancelar" severity="secondary" outlined @click="onUpdateVisible(false)" class="w-full" />
            <Button :label="isLoading ? 'Salvando...' : 'Salvar Alterações'" severity="success"
                @click="salvarAlteracoes" :loading="isLoading" class="w-full" />
        </div>
    </Dialog>
</template>

<script>
import horasMinutosMixin from '@/mixins/horasMinutosMixin';

export default {
    name: 'DialogEditarAgendamento',
    mixins: [horasMinutosMixin],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        agendamentoData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isLoading: false,
            isLoadingExcluir: false,
            isLoadingExcluirTodos: false,
            isLoadingDados: false,
            agendamento: {
                id: '',
                nome_paciente: '',
                data_consulta: '',
                hora_consulta: '',
                codigo_agendamento: '',
                data_notificacao: '',
                hora_notificacao: '',
                tipo_notificacao: [],
                enviar_notificacoes_para: 'psicologo'
            }
        };
    },
    watch: {
        visible(newVal) {
            if (newVal && this.agendamentoData && Object.keys(this.agendamentoData).length > 0) {
                // Aguarda um tick para garantir que o dialog está completamente renderizado
                this.$nextTick(() => {
                    this.carregarDadosAgendamento();
                });
            }
        },
        agendamentoData: {
            handler(newVal) {
                if (newVal && Object.keys(newVal).length > 0 && this.visible) {
                    this.carregarDadosAgendamento();
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible);
            if (!visible) {
                this.limparFormulario();
            }
        },

        carregarDadosAgendamento() {
            // Mostra loading
            this.isLoadingDados = true;

            // Verifica se os dados existem
            if (!this.agendamentoData || Object.keys(this.agendamentoData).length === 0) {
                this.isLoadingDados = false;
                return;
            }

            // Aguarda um tick para garantir que o DOM foi atualizado
            this.$nextTick(() => {
                // Atribui diretamente os dados como na V1
                this.agendamento = { ...this.agendamentoData };

                // Converte a data do formato dd/mm/yyyy para Date object se necessário
                if (this.agendamento.data_consulta && typeof this.agendamento.data_consulta === 'string') {
                    const [dia, mes, ano] = this.agendamento.data_consulta.split('/');
                    this.agendamento.data_consulta = new Date(ano, mes - 1, dia);
                }

                // Esconde loading após carregar os dados
                this.isLoadingDados = false;
            });
        },

        limparFormulario() {
            this.agendamento = {
                id: '',
                nome_paciente: '',
                data_consulta: '',
                hora_consulta: '',
                codigo_agendamento: ''
            };
        },

        async salvarAlteracoes() {
            if (!this.validarFormulario()) {
                return;
            }

            this.isLoading = true;

            try {
                const dadosAgendamento = {
                    data_consulta: this.formatarDataParaAPI(this.agendamento.data_consulta),
                    hora_consulta: this.agendamentoData.hora_consulta,
                    data_notificacao: this.formatarDataNotificacao(this.agendamento.data_consulta),
                    hora_notificacao: "",
                    financeiro: {
                        consulta_paga: false,
                        valor: "",
                        data_pagamento: "",
                        forma_pagamento: ""
                    },
                    tipo_notificacao: [],
                    deseja_receber_notificacoes: false,
                    enviar_notificacoes_para: "psicologo"
                };

                await this.$agendamentosService.update(this.agendamentoData.id, dadosAgendamento);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agendamento atualizado com sucesso!',
                    life: 3000
                });

                this.$emit('agendamentoAtualizado');
                this.onUpdateVisible(false);

            } catch (error) {
                console.error('Erro ao atualizar agendamento:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao atualizar agendamento',
                    life: 3000
                });
            } finally {
                this.isLoading = false;
            }
        },

        async excluirAgendamento() {
            this.isLoadingExcluir = true;

            try {
                await this.$agendamentosService.delete(this.agendamentoData.id);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agendamento excluído com sucesso!',
                    life: 3000
                });

                this.$emit('agendamentoExcluido');
                this.onUpdateVisible(false);

            } catch (error) {
                console.error('Erro ao excluir agendamento:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao excluir agendamento',
                    life: 3000
                });
            } finally {
                this.isLoadingExcluir = false;
            }
        },

        async excluirTodasConsultas() {
            this.isLoadingExcluirTodos = true;

            try {
                await this.$agendamentosService.deleteAllByPatient(this.agendamentoData.codigo_agendamento);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Todas as consultas foram excluídas!',
                    life: 3000
                });

                this.$emit('agendamentoExcluido');
                this.onUpdateVisible(false);

            } catch (error) {
                console.error('Erro ao excluir todas as consultas:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao excluir todas as consultas',
                    life: 3000
                });
            } finally {
                this.isLoadingExcluirTodos = false;
            }
        },

        validarFormulario() {
            if (!this.agendamento.data_consulta) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione uma data',
                    life: 3000
                });
                return false;
            }

            if (!this.agendamentoData.hora_consulta) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um horário',
                    life: 3000
                });
                return false;
            }

            return true;
        },

        formatarDataParaAPI(data) {
            if (!data) return '';
            const date = new Date(data);
            return date.toISOString().split('T')[0];
        },

        formatarDataNotificacao(data) {
            if (!data) return '';
            const date = new Date(data);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }
    }
};
</script>

<style scoped>
.p-dialog {
    border-radius: 12px;
}

.p-dialog .p-dialog-header {
    border-bottom: 1px solid var(--surface-border);
    padding: 1.5rem;
}

.p-dialog .p-dialog-content {
    padding: 1.5rem;
}

.p-dialog .p-dialog-footer {
    border-top: 1px solid var(--surface-border);
    padding: 1.5rem;
}
</style>