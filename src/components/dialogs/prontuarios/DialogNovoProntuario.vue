<template>
    <Dialog :visible="visible" modal header="Novo Prontuário" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12">
                <IftaLabel>
                    <InputText id="nome" v-model="paciente.nome" disabled class="w-full" />
                    <label for="nome">Nome do Paciente</label>
                </IftaLabel>
            </div>
            <div class="col-12">
                <IftaLabel>
                    <InputMask id="basic" v-model="prontuario.data_prontuario" mask="99/99/9999" placeholder="00/00/0000" class="w-full" />
                    <label for="data_prontuario">Data do Prontuário</label>
                </IftaLabel>
            </div>
            <div class="col-12 mt-2">
                <Editor v-model="prontuario.descricao" editorStyle="height: 320px" />
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
    },
    props: {
        paciente: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            visible: false,
            prontuario: {
                paciente: {},
                data_prontuario: '',
                descricao: '',
            }
        }
    },
    methods: {
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible)
        },
        salvarProntuario() {
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