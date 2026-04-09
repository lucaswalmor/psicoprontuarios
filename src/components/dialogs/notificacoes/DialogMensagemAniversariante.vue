<template>
    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        :header="isEdicao ? 'Editar Notificação de Aniversário' : 'Nova Notificação de Aniversário'"
        :style="{ width: '680px' }"
    >
        <div class="p-2">
            <div v-if="isEdicao" class="field mb-3">
                <label class="block text-900 font-medium mb-2">Paciente</label>
                <InputText :modelValue="registro?.paciente?.nome || '-'" class="w-full" readonly />
            </div>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Mensagem de Aniversário</label>
                <Select
                    v-model="form.mensagem_template_aniversario_id"
                    :options="templatesDisponiveis"
                    optionLabel="resumo"
                    optionValue="id"
                    placeholder="Selecione uma mensagem"
                    class="w-full"
                    :loading="loadingDados"
                />
            </div>

            <div class="surface-100 p-3 border-round mb-3">
                <small class="text-600 d-block mb-1">Preview da mensagem</small>
                <p class="m-0">{{ previewMensagem }}</p>
            </div>

            <div v-if="!isEdicao" class="field mb-3">
                <label class="block text-900 font-medium mb-2">Pacientes</label>
                <MultiSelect
                    v-model="form.pacientes_ids"
                    :options="pacientesDisponiveis"
                    optionLabel="nome"
                    optionValue="id"
                    filter
                    placeholder="Selecionar pacientes"
                    class="w-full"
                    :loading="loadingDados"
                />
            </div>

            <div class="field flex align-items-center gap-2">
                <InputSwitch v-model="form.ativo" inputId="ativo_aniversariante" />
                <label for="ativo_aniversariante" class="m-0">Ativo</label>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="$emit('update:visible', false)" :disabled="saving" />
                <Button label="Salvar" icon="pi pi-save" @click="salvar" :loading="saving" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import mensagemAniversarianteService from '@/services/mensagemAniversarianteService';

export default {
    name: 'DialogMensagemAniversariante',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        registro: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:visible', 'salvo'],
    data() {
        return {
            loadingDados: false,
            saving: false,
            templatesDisponiveis: [],
            pacientesDisponiveis: [],
            form: {
                mensagem_template_aniversario_id: null,
                pacientes_ids: [],
                ativo: true,
            },
        };
    },
    computed: {
        isEdicao() {
            return !!this.registro;
        },
        templateSelecionado() {
            return this.templatesDisponiveis.find((item) => item.id === this.form.mensagem_template_aniversario_id) || null;
        },
        previewMensagem() {
            const mensagem = this.templateSelecionado?.mensagem || 'Selecione um template para visualizar a mensagem.';
            return mensagem.replace('{nome_paciente}', 'Nome do Paciente');
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.inicializarDialog();
                }
            },
        },
        registro: {
            immediate: true,
            handler() {
                if (this.visible) {
                    this.preencherFormulario();
                }
            },
        },
    },
    methods: {
        async inicializarDialog() {
            this.loadingDados = true;
            try {
                await this.carregarTemplates();
                if (!this.isEdicao) {
                    await this.carregarPacientesDisponiveis();
                }
                this.preencherFormulario();
            } finally {
                this.loadingDados = false;
            }
        },
        async carregarTemplates() {
            const templates = await mensagemAniversarianteService.getTemplates();
            this.templatesDisponiveis = templates.map((item) => ({
                ...item,
                resumo: item.mensagem.length > 80 ? `${item.mensagem.slice(0, 80)}...` : item.mensagem,
            }));
        },
        async carregarPacientesDisponiveis() {
            this.pacientesDisponiveis = await mensagemAniversarianteService.getPacientesDisponiveis();
        },
        preencherFormulario() {
            if (this.isEdicao) {
                this.form = {
                    mensagem_template_aniversario_id: this.registro.mensagem_template_aniversario_id,
                    pacientes_ids: [],
                    ativo: !!this.registro.ativo,
                };
                return;
            }

            this.form = {
                mensagem_template_aniversario_id: null,
                pacientes_ids: [],
                ativo: true,
            };
        },
        validarFormulario() {
            if (!this.form.mensagem_template_aniversario_id) {
                this.showToast('warn', 'Atenção', 'Selecione um template de mensagem.');
                return false;
            }

            if (!this.isEdicao && (!this.form.pacientes_ids || this.form.pacientes_ids.length === 0)) {
                this.showToast('warn', 'Atenção', 'Selecione ao menos 1 paciente.');
                return false;
            }

            return true;
        },
        async salvar() {
            if (!this.validarFormulario()) return;

            this.saving = true;
            try {
                if (this.isEdicao) {
                    await mensagemAniversarianteService.update(this.registro.id, {
                        mensagem_template_aniversario_id: this.form.mensagem_template_aniversario_id,
                        ativo: this.form.ativo,
                    });
                } else {
                    await mensagemAniversarianteService.create({
                        mensagem_template_aniversario_id: this.form.mensagem_template_aniversario_id,
                        pacientes_ids: this.form.pacientes_ids,
                        ativo: this.form.ativo,
                    });
                }

                this.showToast('success', 'Sucesso', 'Notificação(ões) de aniversário configurada(s) com sucesso!');
                this.$emit('salvo');
                this.$emit('update:visible', false);
            } catch (error) {
                const detail = error?.response?.data?.message || 'Erro ao salvar notificação de aniversário.';
                this.showToast('error', 'Erro', detail);
            } finally {
                this.saving = false;
            }
        },
        showToast(severity, summary, detail) {
            this.$toast.add({
                severity,
                summary,
                detail,
                life: 3000,
            });
        },
    },
};
</script>
