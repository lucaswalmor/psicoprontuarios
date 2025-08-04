<template>
    <Dialog :visible="visible" modal header="Novo Prontuário" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12">
                <IftaLabel>
                    <DatePicker v-model="prontuario.data_prontuario" class="w-full" />
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
        <Toast />
    </Dialog>
</template>
<script>
import { Toast } from 'primevue';


export default {
    name: 'DialogEditarProntuario',
    components: {
        Toast
    },
    props: {
        prontuario: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            visible: false,
        }
    },
    methods: {
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible)
        },
        salvarProntuario() {
            const data = {
                data_prontuario: this.prontuario.data_prontuario,
                descricao: this.prontuario.descricao,
            }

            this.$prontuariosService.update(this.prontuario.id, data).then((res) => {
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso!",
                    detail: res.success,
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