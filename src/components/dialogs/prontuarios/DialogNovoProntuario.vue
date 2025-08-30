<template>
    <Dialog :visible="visible" modal header="Novo Prontuário" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <InputText id="nome" :modelValue="paciente?.nome || ''" @update:modelValue="paciente.nome = $event" disabled class="w-full" />
                    <label for="nome">Nome do Paciente</label>
                </div>
            </div>
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <InputMask id="basic" :modelValue="prontuario.data_prontuario" @update:modelValue="prontuario.data_prontuario = $event" mask="99/99/9999" placeholder="00/00/0000" class="w-full" />
                    <label for="data_prontuario">Data do Prontuário</label>
                </div>
            </div>
            <div class="col-12 mt-2">
                <Editor :modelValue="prontuario.descricao" @update:modelValue="prontuario.descricao = $event" editorStyle="height: 320px" />
            </div>
            <div class="col-12 mt-2 d-flex gap-2 justify-content-end">
                <Button label="Cancelar" severity="secondary" @click="onUpdateVisible(false)" />
                <Button label="Salvar" severity="success" @click="salvarProntuario" />
            </div>
        </div>
    </Dialog>
</template>
<script>

export default {
    name: 'DialogNovoProntuario',
    components: {
        Dialog: () => import('primevue/dialog'),
        InputMask: () => import('primevue/inputmask'),
        InputText: () => import('primevue/inputtext'),
        Editor: () => import('primevue/editor'),
        Button: () => import('primevue/button')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        paciente: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            prontuario: {
                paciente: {},
                data_prontuario: new Date().toLocaleDateString('pt-BR'),
                descricao: '',
            }
        }
    },
    methods: {
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible)
        },
        salvarProntuario() {
            if (!this.paciente) {
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Paciente não encontrado",
                    life: 3000,
                });
                return;
            }

            const data = {
                paciente: this.paciente,
                data_prontuario: this.prontuario.data_prontuario,
                descricao: this.prontuario.descricao,
            }

            this.$prontuariosService.create(data).then((res) => {
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso ao cadastrar!",
                    detail: `Prontuario do paciente ${this.paciente.nome} criado com sucesso!`,
                    life: 3000,
                });

                this.prontuario = {
                    paciente: {},
                    data_prontuario: '',
                    descricao: '',
                }
                
                this.$emit('salvarProntuario');
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.onUpdateVisible(false);
            });
        }
    },
}
</script>
<style></style>