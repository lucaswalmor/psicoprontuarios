<template>
    <Dialog :visible="visible" modal header="Novo Prontuário" @update:visible="onUpdateVisible">
        <div class="row">
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
        <Toast />
    </Dialog>
</template>
<script>
import { Toast } from 'primevue';


export default {
    name: 'DialogEditarProntuario',
    components: {
        Toast,
        InputMask: () => import('primevue/inputmask'),
        Editor: () => import('primevue/editor'),
        Button: () => import('primevue/button')
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