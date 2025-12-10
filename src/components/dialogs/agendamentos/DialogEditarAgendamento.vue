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
                    <InputText v-model="agendamento.nome_paciente" class="w-full" readonly />
                </div>

                <div class="col-12">
                    <label class="block text-900 font-medium mb-2">Data da Consulta *</label>
                    <InputMask 
                        id="basic" 
                        v-model="agendamento.data_consulta" 
                        mask="99/99/9999" 
                        placeholder="dd/mm/aaaa" 
                        class="w-full"
                        :class="{ 'p-invalid': errors.data_consulta }"
                    />
                    <small v-if="errors.data_consulta" class="p-error">{{ errors.data_consulta }}</small>
                </div>

                <div class="col-12">
                    <label class="block text-900 font-medium mb-2">Hora da Consulta</label>
                    <Dropdown v-model="agendamento.hora_consulta" :options="horasMinutos" optionLabel="label"
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
                    Excluir todas as consultas relacionadas a este agendamento
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
            errors: {},
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

                // Garantir que a data está no formato dd/mm/yyyy para o InputMask
                if (this.agendamento.data_consulta) {
                    if (typeof this.agendamento.data_consulta === 'string') {
                        // Se já está no formato dd/mm/yyyy, manter
                        if (this.agendamento.data_consulta.includes('/')) {
                            // Já está no formato correto
                        } 
                        // Se está no formato Y-m-d, converter para dd/mm/yyyy
                        else if (this.agendamento.data_consulta.includes('-')) {
                            const [ano, mes, dia] = this.agendamento.data_consulta.split('-');
                            this.agendamento.data_consulta = `${dia}/${mes}/${ano}`;
                        }
                    } else if (this.agendamento.data_consulta instanceof Date) {
                        // Se for Date object, converter para dd/mm/yyyy
                        const dia = String(this.agendamento.data_consulta.getDate()).padStart(2, '0');
                        const mes = String(this.agendamento.data_consulta.getMonth() + 1).padStart(2, '0');
                        const ano = this.agendamento.data_consulta.getFullYear();
                        this.agendamento.data_consulta = `${dia}/${mes}/${ano}`;
                    }
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
            this.errors = {};
        },

        async salvarAlteracoes() {
            if (!this.validarFormulario()) {
                return;
            }

            this.isLoading = true;

            try {
                // Converter data de dd/mm/yyyy para Y-m-d
                const dataFormatada = this.formatarDataParaAPI(this.agendamento.data_consulta);
                
                const dadosAgendamento = {
                    data_consulta: dataFormatada,
                    hora_consulta: this.agendamento.hora_consulta,
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

                await this.$agendamentosService.update(this.agendamento.id, dadosAgendamento);

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
                await this.$agendamentosService.delete(this.agendamento.id);

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
                await this.$agendamentosService.deleteAllByPatient(this.agendamento.codigo_agendamento);

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
            this.errors = {};
            let valido = true;
            
            // Validar data
            if (!this.agendamento.data_consulta || this.agendamento.data_consulta.length < 10) {
                this.errors.data_consulta = 'Data da consulta é obrigatória';
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Informe a data da consulta',
                    life: 3000
                });
                valido = false;
            } else {
                // Validar formato da data
                const dataValida = this.validarData(this.agendamento.data_consulta);
                if (!dataValida) {
                    this.errors.data_consulta = 'Data inválida. Use o formato dd/mm/aaaa';
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'Atenção',
                        detail: 'Data inválida. Use o formato dd/mm/aaaa',
                        life: 3000
                    });
                    valido = false;
                }
            }

            if (!this.agendamento.hora_consulta) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um horário',
                    life: 3000
                });
                valido = false;
            }

            return valido;
        },
        
        validarData(data) {
            if (!data || data.length !== 10) return false;
            const [dia, mes, ano] = data.split('/');
            if (!dia || !mes || !ano) return false;
            const diaNum = parseInt(dia);
            const mesNum = parseInt(mes);
            const anoNum = parseInt(ano);
            
            if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) return false;
            if (mesNum < 1 || mesNum > 12) return false;
            if (diaNum < 1 || diaNum > 31) return false;
            if (anoNum < 1900 || anoNum > 2100) return false;
            
            // Validar se a data é válida (ex: 31/02 não existe)
            const dataObj = new Date(anoNum, mesNum - 1, diaNum);
            if (dataObj.getDate() !== diaNum || dataObj.getMonth() !== mesNum - 1 || dataObj.getFullYear() !== anoNum) {
                return false;
            }
            
            return true;
        },

        formatarDataParaAPI(data) {
            if (!data) return '';
            
            // Se já está no formato Y-m-d, retornar como está
            if (data.includes('-') && !data.includes('/')) {
                return data.split(' ')[0]; // Remove hora se houver
            }
            
            // Se está no formato dd/mm/yyyy, converter para Y-m-d
            if (data.includes('/')) {
                const [dia, mes, ano] = data.split('/');
                return `${ano}-${mes}-${dia}`;
            }
            
            // Se for Date object ou outra coisa, tentar converter
            let date;
            if (typeof data === 'string' && data.includes('/')) {
                const [dia, mes, ano] = data.split('/');
                date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
            } else {
                date = new Date(data);
            }
            
            return date.toISOString().split('T')[0];
        },

        formatarDataNotificacao(data) {
            if (!data) return '';
            
            // Se já está no formato dd/mm/yyyy, retornar como está
            if (data.includes('/')) {
                return data;
            }
            
            // Se está no formato Y-m-d, converter para dd/mm/yyyy
            if (data.includes('-')) {
                const [ano, mes, dia] = data.split('-');
                return `${dia}/${mes}/${ano}`;
            }
            
            // Se for Date object, converter
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