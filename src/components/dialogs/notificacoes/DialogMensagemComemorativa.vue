<template>
    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        :header="isEdicao ? 'Editar Notificação' : 'Nova Notificação'"
        :style="{ width: '640px' }"
    >
        <div class="p-2">
            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Data Comemorativa</label>
                <Select
                    v-model="form.data_comemorativa_id"
                    :options="datasDisponiveis"
                    optionLabel="nomeExibicao"
                    optionValue="id"
                    placeholder="Selecione uma data comemorativa"
                    class="w-full"
                    :disabled="isEdicao || loadingDados"
                />
            </div>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Mensagem</label>
                <Textarea
                    v-model="form.mensagem"
                    rows="5"
                    maxlength="500"
                    autoResize
                    class="w-full"
                />
                <small class="text-600">{{ (form.mensagem || '').length }}/500</small>
            </div>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Pacientes</label>
                <MultiSelect
                    v-model="form.pacientes_ids"
                    :options="pacientesDisponiveis"
                    optionLabel="nome"
                    optionValue="id"
                    placeholder="Selecionar pacientes"
                    class="w-full"
                    filter
                    :loading="loadingDados"
                />
            </div>

            <div class="field flex align-items-center gap-2">
                <InputSwitch v-model="form.ativo" inputId="ativo_mensagem_comemorativa" />
                <label for="ativo_mensagem_comemorativa" class="m-0">Ativo</label>
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
import mensagemComemorativaService from '@/services/mensagemComemorativaService';

export default {
    name: 'DialogMensagemComemorativa',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        mensagem: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:visible', 'salvo'],
    data() {
        return {
            loadingDados: false,
            saving: false,
            datasDisponiveis: [],
            pacientesDisponiveis: [],
            form: {
                data_comemorativa_id: null,
                mensagem: '',
                pacientes_ids: [],
                ativo: true,
            },
        };
    },
    computed: {
        isEdicao() {
            return !!this.mensagem;
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
        mensagem: {
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
                await Promise.all([
                    this.carregarDatasDisponiveis(),
                    this.carregarPacientesDisponiveis(),
                ]);
                this.preencherFormulario();
            } finally {
                this.loadingDados = false;
            }
        },
        async carregarDatasDisponiveis() {
            const datas = await mensagemComemorativaService.getDatasDisponiveis();
            this.datasDisponiveis = datas.map((item) => ({
                ...item,
                nomeExibicao: `${item.icone} ${item.nome}`,
            }));
        },
        async carregarPacientesDisponiveis() {
            this.pacientesDisponiveis = await mensagemComemorativaService.getPacientesDisponiveis();
        },
        preencherFormulario() {
            if (this.isEdicao) {
                this.form = {
                    data_comemorativa_id: this.mensagem.data_comemorativa_id,
                    mensagem: this.mensagem.mensagem || '',
                    pacientes_ids: (this.mensagem.pacientes || []).map((item) => item.paciente_id),
                    ativo: !!this.mensagem.ativo,
                };
                return;
            }

            this.form = {
                data_comemorativa_id: null,
                mensagem: '',
                pacientes_ids: [],
                ativo: true,
            };
        },
        validarFormulario() {
            if (!this.form.data_comemorativa_id) {
                this.showToast('warn', 'Atenção', 'Selecione uma data comemorativa.');
                return false;
            }

            if (!this.form.mensagem || !this.form.mensagem.trim()) {
                this.showToast('warn', 'Atenção', 'A mensagem é obrigatória.');
                return false;
            }

            if (!this.form.pacientes_ids || this.form.pacientes_ids.length === 0) {
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
                    await mensagemComemorativaService.update(this.mensagem.id, this.form);
                } else {
                    await mensagemComemorativaService.create(this.form);
                }

                this.showToast('success', 'Sucesso', `Notificação ${this.isEdicao ? 'atualizada' : 'criada'} com sucesso.`);
                this.$emit('salvo');
                this.$emit('update:visible', false);
            } catch (error) {
                const detail = error?.response?.data?.message || 'Erro ao salvar notificação.';
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
