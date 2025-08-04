<template>
    <Dialog 
        :visible="visible" 
        modal 
        header="Agendar Consulta" 
        :style="{ width: '600px' }"
        @update:visible="onUpdateVisible"
    >
        <div class="grid">
            <div class="col-12">
                <label for="paciente" class="block text-900 font-medium mb-2">Paciente</label>
                <Dropdown 
                    v-model="agendamento.paciente" 
                    :options="pacientes" 
                    optionLabel="nome" 
                    placeholder="Selecione o paciente" 
                    class="w-full" 
                />
            </div>

            <div class="col-12">
                <label for="hora_consulta" class="block text-900 font-medium mb-2">Hora da Consulta</label>
                <Dropdown 
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
import horasMinutosMixin from '@/mixins/horasMinutosMixin';

export default {
    name: 'DialogNovoAgendamento',
    mixins: [horasMinutosMixin],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataSelecionada: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: false,
            pacientes: [],
            agendamento: {
                data_consulta: '',
                paciente: null,
                hora_consulta: '',
                reagendar_consulta: false,
                tipo_reagendamento: ''
            }
        };
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.carregarPacientes();
                this.agendamento.data_consulta = this.dataSelecionada;
            }
        }
    },
    methods: {
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
        
        limparFormulario() {
            this.agendamento = {
                data_consulta: '',
                paciente: null,
                hora_consulta: '',
                reagendar_consulta: false,
                tipo_reagendamento: ''
            };
        },
        
        async salvarAgendamento() {
            if (!this.validarFormulario()) {
                return;
            }
            
            this.isLoading = true;
            
            try {
                const dadosAgendamento = {
                    data_consulta: this.agendamento.data_consulta,
                    paciente: this.agendamento.paciente,
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
                    deseja_receber_notificacoes: false,
                    enviar_notificacoes_para: "psicologo"
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
            if (!this.agendamento.paciente) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um paciente',
                    life: 3000
                });
                return false;
            }
            
            if (!this.agendamento.hora_consulta) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um horário',
                    life: 3000
                });
                return false;
            }
            
            if (this.agendamento.reagendar_consulta && !this.agendamento.tipo_reagendamento) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione o tipo de reagendamento',
                    life: 3000
                });
                return false;
            }
            
            return true;
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