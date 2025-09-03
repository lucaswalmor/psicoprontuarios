<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Anamnese</h5>
            <div class="flex gap-2">
                <Button 
                    label="Salvar" 
                    icon="pi pi-save" 
                    :loading="loading"
                    @click="salvar"
                    v-if="!planStore.isPlanPaused"
                />
            </div>
        </div>

        <form @submit.prevent="salvar" class="p-fluid">
            <div class="grid">
                <!-- Motivo da Consulta -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Motivo da Consulta</label>
                        <Textarea 
                            v-model="form.motivo_consulta" 
                            rows="3" 
                            placeholder="Descreva o motivo principal da consulta..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- História do Problema Atual -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">História do Problema Atual</label>
                        <Textarea 
                            v-model="form.historia_problema_atual" 
                            rows="4" 
                            placeholder="Descreva como o problema começou e evoluiu..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Sintomas Principais -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Sintomas Principais</label>
                        <Textarea 
                            v-model="form.sintomas_principais" 
                            rows="3" 
                            placeholder="Liste os principais sintomas apresentados..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Duração dos Sintomas -->
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Duração dos Sintomas</label>
                        <Textarea 
                            v-model="form.duracao_sintomas" 
                            rows="2" 
                            placeholder="Há quanto tempo os sintomas estão presentes?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Intensidade dos Sintomas -->
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Intensidade dos Sintomas</label>
                        <Textarea 
                            v-model="form.intensidade_sintomas" 
                            rows="2" 
                            placeholder="Como você avalia a intensidade dos sintomas?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Fatores Desencadeantes -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Fatores Desencadeantes</label>
                        <Textarea 
                            v-model="form.fatores_desencadeantes" 
                            rows="3" 
                            placeholder="O que desencadeia ou piora os sintomas?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Fatores que Melhoram -->
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Fatores que Melhoram</label>
                        <Textarea 
                            v-model="form.fatores_melhoram" 
                            rows="2" 
                            placeholder="O que ajuda a aliviar os sintomas?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Fatores que Pioram -->
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Fatores que Pioram</label>
                        <Textarea 
                            v-model="form.fatores_pioram" 
                            rows="2" 
                            placeholder="O que piora os sintomas?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Impacto na Vida Diária -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Impacto na Vida Diária</label>
                        <Textarea 
                            v-model="form.impacto_vida_diaria" 
                            rows="3" 
                            placeholder="Como os sintomas afetam sua rotina, trabalho, relacionamentos?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Tentativas de Tratamento Anteriores -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Tentativas de Tratamento Anteriores</label>
                        <Textarea 
                            v-model="form.tentativas_tratamento_anteriores" 
                            rows="3" 
                            placeholder="Já buscou ajuda anteriormente? Que tipo de tratamento?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Medicamentos Atuais -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Medicamentos Atuais</label>
                        <Textarea 
                            v-model="form.medicamentos_atuais" 
                            rows="2" 
                            placeholder="Está tomando algum medicamento atualmente?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Histórico Psiquiátrico -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Histórico Psiquiátrico</label>
                        <Textarea 
                            v-model="form.historico_psiquiatrico" 
                            rows="3" 
                            placeholder="Já teve diagnóstico ou tratamento psiquiátrico anterior?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Histórico Médico -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Histórico Médico</label>
                        <Textarea 
                            v-model="form.historico_medico" 
                            rows="3" 
                            placeholder="Doenças, cirurgias, internações anteriores..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Histórico Familiar -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Histórico Familiar</label>
                        <Textarea 
                            v-model="form.historico_familiar" 
                            rows="3" 
                            placeholder="Histórico de doenças mentais na família..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Uso de Substâncias -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Uso de Substâncias</label>
                        <Textarea 
                            v-model="form.substancia_uso" 
                            rows="2" 
                            placeholder="Uso de álcool, tabaco, drogas..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Relacionamentos -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Relacionamentos</label>
                        <Textarea 
                            v-model="form.relacionamentos" 
                            rows="3" 
                            placeholder="Como estão seus relacionamentos familiares, amorosos, sociais?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Trabalho/Estudo -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Trabalho/Estudo</label>
                        <Textarea 
                            v-model="form.trabalho_estudo" 
                            rows="2" 
                            placeholder="Situação profissional e acadêmica atual..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Atividades de Lazer -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Atividades de Lazer</label>
                        <Textarea 
                            v-model="form.atividades_lazer" 
                            rows="2" 
                            placeholder="Hobbies, atividades que gosta de fazer..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Suporte Social -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Suporte Social</label>
                        <Textarea 
                            v-model="form.suporte_social" 
                            rows="2" 
                            placeholder="Pessoas que oferecem apoio e suporte..."
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Expectativas do Tratamento -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Expectativas do Tratamento</label>
                        <Textarea 
                            v-model="form.expectativas_tratamento" 
                            rows="3" 
                            placeholder="O que espera alcançar com o tratamento psicológico?"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Observações Adicionais -->
                <div class="col-12">
                    <div class="field">
                        <label class="block text-500 font-medium mb-2">Observações Adicionais</label>
                        <Textarea 
                            v-model="form.observacoes_adicionais" 
                            rows="3" 
                            placeholder="Outras informações relevantes..."
                            class="w-full"
                        />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';

export default {
    name: 'Anamnese',
    props: {
        pacienteId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            loading: false,
            isEditing: false,
            anamneseId: null,
            form: {
                motivo_consulta: '',
                historia_problema_atual: '',
                sintomas_principais: '',
                duracao_sintomas: '',
                intensidade_sintomas: '',
                fatores_desencadeantes: '',
                fatores_melhoram: '',
                fatores_pioram: '',
                impacto_vida_diaria: '',
                tentativas_tratamento_anteriores: '',
                medicamentos_atuais: '',
                historico_psiquiatrico: '',
                historico_medico: '',
                historico_familiar: '',
                substancia_uso: '',
                relacionamentos: '',
                trabalho_estudo: '',
                atividades_lazer: '',
                suporte_social: '',
                expectativas_tratamento: '',
                observacoes_adicionais: ''
            }
        };
    },
    computed: {
        planStore() {
            return usePlanStore();
        }
    },
    mounted() {
        // Não carrega automaticamente - será chamado quando a tab for acessada
    },
    methods: {
        async carregarAnamnese() {
            try {
                const response = await this.$pacientesService.buscarAnamnese(this.pacienteId);
                
                if (response && response.id) {
                    // Anamnese existe, preencher formulário para edição
                    this.isEditing = true;
                    this.anamneseId = response.id;
                    this.form = {
                        motivo_consulta: response.motivo_consulta || '',
                        historia_problema_atual: response.historia_problema_atual || '',
                        sintomas_principais: response.sintomas_principais || '',
                        duracao_sintomas: response.duracao_sintomas || '',
                        intensidade_sintomas: response.intensidade_sintomas || '',
                        fatores_desencadeantes: response.fatores_desencadeantes || '',
                        fatores_melhoram: response.fatores_melhoram || '',
                        fatores_pioram: response.fatores_pioram || '',
                        impacto_vida_diaria: response.impacto_vida_diaria || '',
                        tentativas_tratamento_anteriores: response.tentativas_tratamento_anteriores || '',
                        medicamentos_atuais: response.medicamentos_atuais || '',
                        historico_psiquiatrico: response.historico_psiquiatrico || '',
                        historico_medico: response.historico_medico || '',
                        historico_familiar: response.historico_familiar || '',
                        substancia_uso: response.substancia_uso || '',
                        relacionamentos: response.relacionamentos || '',
                        trabalho_estudo: response.trabalho_estudo || '',
                        atividades_lazer: response.atividades_lazer || '',
                        suporte_social: response.suporte_social || '',
                        expectativas_tratamento: response.expectativas_tratamento || '',
                        observacoes_adicionais: response.observacoes_adicionais || ''
                    };
                } else {
                    // Anamnese não existe, formulário em branco para cadastro
                    this.isEditing = false;
                    this.anamneseId = null;
                }
            } catch (error) {
                console.error('Erro ao carregar anamnese:', error);
                // Se não encontrar anamnese, deixar formulário em branco para cadastro
                this.isEditing = false;
                this.anamneseId = null;
            }
        },

        async salvar() {
            this.loading = true;
            
            try {
                if (this.isEditing) {
                    // Editar anamnese existente
                    await this.$pacientesService.editarAnamnese(this.anamneseId, this.form);
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Anamnese atualizada com sucesso',
                        life: 3000
                    });
                } else {
                    // Cadastrar nova anamnese
                    const response = await this.$pacientesService.cadastrarAnamnese(this.pacienteId, this.form);
                    this.isEditing = true;
                    this.anamneseId = response.data.id;
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Anamnese cadastrada com sucesso',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Erro ao salvar anamnese:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar anamnese',
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.field {
    margin-bottom: 1.5rem;
}

.field:last-child {
    margin-bottom: 0;
}

/* Estilos para os textareas */
:deep(.p-inputtextarea) {
    resize: vertical;
    min-height: 60px;
}

/* Responsividade */
@media (max-width: 768px) {
    .col-12.md\:col-6 {
        margin-bottom: 1rem;
    }
}
</style>
