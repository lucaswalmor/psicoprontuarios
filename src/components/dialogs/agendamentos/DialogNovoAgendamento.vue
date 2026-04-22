<template>
    <Dialog 
        :visible="visible" 
        modal 
        header="Agendar Consulta" 
        :style="{ width: '600px' }"
        @update:visible="onUpdateVisible"
    >
        <div class="grid">
            <div class="col-12" v-if="!paciente">
                <label for="paciente" class="block text-900 font-medium mb-2">Paciente</label>
                <Select 
                    v-model="agendamento.paciente" 
                    :options="pacientes" 
                    optionLabel="nome" 
                    placeholder="Selecione o paciente" 
                    class="w-full" 
                />
            </div>
            <div class="col-12" v-else>
                <label for="paciente" class="block text-900 font-medium mb-2">Paciente</label>
                <InputText 
                    :model-value="paciente.nome || ''" 
                    disabled 
                    class="w-full" 
                    placeholder="Nome do paciente" 
                />
            </div>

            <div class="col-12">
                <label for="data_consulta" class="block text-900 font-medium mb-2">Data da Consulta *</label>
                <InputMask 
                    v-model="agendamento.data_consulta" 
                    mask="99/99/9999" 
                    placeholder="dd/mm/aaaa" 
                    class="w-full"
                    :class="{ 'p-invalid': errors.data_consulta }"
                />
                <small v-if="errors.data_consulta" class="p-error">{{ errors.data_consulta }}</small>
            </div>

            <div class="col-12">
                <label for="hora_consulta" class="block text-900 font-medium mb-2">Hora da Consulta</label>
                <Select 
                    v-model="agendamento.hora_consulta" 
                    :options="horasMinutos" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Selecione o horário" 
                    class="w-full" 
                    @change="retroativoComIntervalo" 
                />
            </div>

            <div class="col-12" v-if="agendamento.hora_consulta">
                <div class="flex align-items-center gap-2 flex-wrap mb-2">
                    <InputSwitch
                        id="notificar_whatsapp_lembrete"
                        v-model="agendamento.deseja_receber_notificacoes"
                        :disabled="!evolutionWhatsappConectado || evolutionLembreteLoading"
                    />
                    <label for="notificar_whatsapp_lembrete" class="text-900 font-medium mb-0 cursor-pointer">
                        Notificar o paciente por WhatsApp no dia da consulta
                    </label>
                    <i
                        class="pi pi-info-circle text-primary cursor-pointer"
                        style="font-size: 1rem"
                        v-tooltip.top="'Para poder enviar este lembrete, conecte o seu WhatsApp em Configurações → aba WhatsApp.'"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div class="col-12" v-if="agendamento.hora_consulta">
                <label class="block text-900 font-medium mb-2">Deseja reagendar esta consulta para os próximos 12 meses?</label>
                <div class="flex align-items-center gap-3">
                    <label for="reagendar_nao">Não</label>
                    <InputSwitch v-model="agendamento.reagendar_consulta" />
                    <label for="reagendar_sim">Sim</label>
                </div>
            </div>

            <div class="col-12" v-if="agendamento.reagendar_consulta">
                <label class="block text-900 font-medium mb-2">Forma de Reagendamento</label>
                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                        <RadioButton 
                            v-model="agendamento.tipo_reagendamento" 
                            inputId="semanal" 
                            name="tipo_reagendamento" 
                            value="Semanal" 
                        />
                        <label for="semanal" class="ml-2">Semanal</label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton 
                            v-model="agendamento.tipo_reagendamento" 
                            inputId="quinzenal" 
                            name="tipo_reagendamento" 
                            value="Quinzenal" 
                        />
                        <label for="quinzenal" class="ml-2">Quinzenal</label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton 
                            v-model="agendamento.tipo_reagendamento" 
                            inputId="mensal" 
                            name="tipo_reagendamento" 
                            value="Mensal" 
                        />
                        <label for="mensal" class="ml-2">Mensal</label>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-2 w-full">
                <Button 
                    label="Cancelar" 
                    severity="secondary" 
                    outlined 
                    @click="onUpdateVisible(false)" 
                    class="w-full"
                />
                <Button 
                    :label="isLoading ? 'Salvando...' : 'Agendar Consulta'" 
                    severity="success" 
                    @click="salvarAgendamento" 
                    :loading="isLoading"
                    class="w-full"
                />
            </div>
        </template>
    </Dialog>
</template>

<script>
import api from '@/utils/axios';
import horasMinutosMixin from '@/mixins/horasMinutosMixin';
import InputSwitch from 'primevue/inputswitch';
import Select from 'primevue/select';

export default {
    name: 'DialogNovoAgendamento',
    components: {
        InputSwitch,
        Select
    },
    mixins: [horasMinutosMixin],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataSelecionada: {
            type: String,
            default: ''
        },
        paciente: {
            type: Object,
            default: null
        },
        pacienteId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            isLoading: false,
            pacientes: [],
            errors: {},
            evolutionWhatsappConectado: false,
            evolutionLembreteLoading: false,
            agendamento: {
                data_consulta: '',
                paciente: null,
                hora_consulta: '',
                reagendar_consulta: false,
                tipo_reagendamento: '',
                deseja_receber_notificacoes: false,
            }
        };
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.consultarEvolutionLembreteConsulta();
                // Se não tiver paciente pré-selecionado, carregar lista de pacientes
                if (!this.paciente && !this.pacienteId) {
                    this.carregarPacientes();
                } else {
                    // Se tiver paciente pré-selecionado, definir no agendamento
                    this.definirPacientePreSelecionado();
                }
                // Se tiver dataSelecionada, formatar para dd/mm/yyyy
                if (this.dataSelecionada) {
                    this.agendamento.data_consulta = this.formatarDataParaInput(this.dataSelecionada);
                } else {
                    // Se não tiver, usar data atual
                    const hoje = new Date();
                    this.agendamento.data_consulta = this.formatarDataParaInput(hoje.toISOString().split('T')[0]);
                }
            }
        },
        paciente(newVal) {
            if (newVal && this.visible) {
                this.definirPacientePreSelecionado();
            }
        },
        pacienteId(newVal) {
            if (newVal && this.visible && !this.paciente) {
                this.carregarPacientePorId(newVal);
            }
        },
        'agendamento.paciente'(newVal) {
            // Quando um paciente é selecionado no Select, validar o status
            // limparSelecao = false para não limpar a seleção, apenas mostrar o toast
            if (newVal && this.visible) {
                this.validarStatusTratamentoPaciente(newVal, false);
            }
        }
    },
    methods: {
        async consultarEvolutionLembreteConsulta() {
            this.evolutionLembreteLoading = true;
            try {
                const response = await api.get('/evolution/instancia/lembrete-consulta');
                this.evolutionWhatsappConectado = !!response?.data?.whatsapp_conectado;
                if (!this.evolutionWhatsappConectado) {
                    this.agendamento.deseja_receber_notificacoes = false;
                }
            } catch (error) {
                this.evolutionWhatsappConectado = false;
                this.agendamento.deseja_receber_notificacoes = false;
            } finally {
                this.evolutionLembreteLoading = false;
            }
        },
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible);
            if (!visible) {
                this.limparFormulario();
            }
        },
        
        async carregarPacientes() {
            try {
                const response = await this.$pacientesService.getAll();
                this.pacientes = response || [];
            } catch (error) {
                console.error('Erro ao carregar pacientes:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar lista de pacientes',
                    life: 3000
                });
            }
        },
        
        async carregarPacientePorId(pacienteId) {
            try {
                const response = await this.$pacientesService.getById(pacienteId);
                this.agendamento.paciente = response;
                // Validar status após carregar (limparSelecao = false porque veio de prop pacienteId)
                this.validarStatusTratamentoPaciente(response, false);
            } catch (error) {
                console.error('Erro ao carregar paciente:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do paciente',
                    life: 3000
                });
            }
        },
        
        definirPacientePreSelecionado() {
            // Usar paciente da prop ou buscar por pacienteId
            if (this.paciente) {
                this.agendamento.paciente = this.paciente;
                // Validar status após definir (limparSelecao = false porque veio de prop)
                this.validarStatusTratamentoPaciente(this.paciente, false);
            } else if (this.pacienteId) {
                this.carregarPacientePorId(this.pacienteId);
            }
        },
        
        validarStatusTratamentoPaciente(pacienteObj, limparSelecao = false) {
            if (pacienteObj && pacienteObj.status_tratamento === 'Concluído') {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'O paciente está com status "Concluído". Altere o status para "Em Tratamento" para executar esta ação.',
                    life: 5000
                });
                // Limpar a seleção do paciente apenas se foi especificado
                if (limparSelecao && !this.paciente && !this.pacienteId) {
                    this.agendamento.paciente = null;
                }
                return false;
            }
            return true;
        },
        
        limparFormulario() {
            this.agendamento = {
                data_consulta: '',
                paciente: null,
                hora_consulta: '',
                reagendar_consulta: false,
                tipo_reagendamento: '',
                deseja_receber_notificacoes: false,
            };
            this.evolutionWhatsappConectado = false;
            this.errors = {};
        },
        
        async salvarAgendamento() {
            if (!this.validarFormulario()) {
                return;
            }
            
            // Garantir que o paciente tenha o id e status_tratamento
            let pacienteComId = this.agendamento.paciente;
            
            // Se não tiver id, usar pacienteId da prop ou paciente.id
            if (!pacienteComId || !pacienteComId.id) {
                const pacienteId = this.pacienteId || (this.paciente && this.paciente.id);
                if (pacienteId) {
                    // Se tiver paciente da prop, usar ele (já tem status_tratamento)
                    const pacienteOrigem = this.paciente || pacienteComId;
                    pacienteComId = {
                        ...pacienteOrigem,
                        id: pacienteId
                    };
                }
            }
            
            if (!pacienteComId || !pacienteComId.id) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'ID do paciente não encontrado',
                    life: 3000
                });
                return;
            }
            
            // Se o paciente selecionado não tiver status_tratamento, buscar do backend
            if (!pacienteComId.status_tratamento && pacienteComId.id) {
                try {
                    const pacienteCompleto = await this.$pacientesService.getById(pacienteComId.id);
                    pacienteComId.status_tratamento = pacienteCompleto.status_tratamento;
                } catch (error) {
                    console.error('Erro ao buscar status do paciente:', error);
                }
            }
            
            // Validar status do tratamento antes de salvar
            if (!this.validarStatusTratamentoPaciente(pacienteComId, false)) {
                return;
            }
            
            // Se o paciente foi limpo pela validação, não prosseguir
            if (!this.agendamento.paciente) {
                return;
            }
            
            this.isLoading = true;
            
            try {
                
                // Converter data de dd/mm/yyyy para Y-m-d
                const dataFormatada = this.converterDataParaAPI(this.agendamento.data_consulta);
                
                const dadosAgendamento = {
                    data_consulta: dataFormatada,
                    paciente: pacienteComId,
                    hora_consulta: this.agendamento.hora_consulta,
                    data_notificacao: this.formatarDataNotificacao(this.agendamento.data_consulta),
                    hora_notificacao: "",
                    reagendar_consulta: this.agendamento.reagendar_consulta,
                    tipo_reagendamento: this.agendamento.tipo_reagendamento,
                    financeiro: {
                        consulta_paga: false,
                        valor: "",
                        data_pagamento: "",
                        forma_pagamento: ""
                    },
                    tipo_notificacao: [],
                    deseja_receber_notificacoes:
                        this.evolutionWhatsappConectado && !!this.agendamento.deseja_receber_notificacoes,
                    enviar_notificacoes_para: null,
                };
                
                await this.$agendamentosService.create(dadosAgendamento);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agendamento criado com sucesso!',
                    life: 3000
                });
                
                this.$emit('agendamentoSalvo');
                this.onUpdateVisible(false);
                
            } catch (error) {
                console.error('Erro ao salvar agendamento:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao criar agendamento',
                    life: 3000
                });
            } finally {
                this.isLoading = false;
            }
        },
        
        validarFormulario() {
            this.errors = {};
            let valido = true;
            
            // Verificar se tem paciente no agendamento ou nas props
            const temPaciente = this.agendamento.paciente || this.paciente || this.pacienteId;
            
            if (!temPaciente) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um paciente',
                    life: 3000
                });
                valido = false;
            } else {
                // Se tem paciente, validar o status antes de continuar
                const pacienteParaValidar = this.agendamento.paciente || this.paciente;
                if (pacienteParaValidar && pacienteParaValidar.status_tratamento === 'Concluído') {
                    // Mostrar toast e impedir o salvamento
                    this.validarStatusTratamentoPaciente(pacienteParaValidar, false);
                    valido = false;
                }
            }
            
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
            
            if (this.agendamento.reagendar_consulta && !this.agendamento.tipo_reagendamento) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione o tipo de reagendamento',
                    life: 3000
                });
                valido = false;
            }
            
            return valido;
        },
        
        formatarDataParaInput(data) {
            // Converter de Y-m-d para dd/mm/yyyy
            if (!data) return '';
            if (data.includes('/')) {
                // Já está no formato dd/mm/yyyy
                return data;
            }
            if (data.includes('-')) {
                // Formato Y-m-d
                const [ano, mes, dia] = data.split('-');
                return `${dia}/${mes}/${ano}`;
            }
            // Se for Date object
            const date = new Date(data);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano}`;
        },
        
        converterDataParaAPI(data) {
            // Converter de dd/mm/yyyy para Y-m-d
            if (!data) return '';
            if (data.includes('-')) {
                // Já está no formato Y-m-d
                return data.split(' ')[0]; // Remove hora se houver
            }
            if (data.includes('/')) {
                const [dia, mes, ano] = data.split('/');
                return `${ano}-${mes}-${dia}`;
            }
            return data;
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