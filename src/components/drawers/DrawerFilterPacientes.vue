<template>
    <Drawer :visible="visible" header="Filtro de Pacientes" position="right" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12 mb-2">
                <InputText type="text" placeholder="Nome" v-model="filtro.nome" class="w-full" />
            </div>
            <div class="col-12 mb-2">
                <InputText type="text" placeholder="Email" v-model="filtro.email" class="w-full" />
            </div>
            <div class="col-12 mb-2">
                <InputText type="text" placeholder="Telefone" v-model="filtro.telefone" class="w-full" />
            </div>
        </div>
        <div class="flex mt-4 justify-between">
            <Button label="Filtrar" @click="filtrarPacientes" />
        </div>
    </Drawer>
</template>
<script>
export default {
    name: 'DrawerFilterPacientes',
    props: {
        limparCampos: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: false,
            filtro: {
                nome: '',
                email: '',
                telefone: ''
            }
        }
    },
    methods: {
        onUpdateVisible(event) {
            this.visible = event;
        },
        filtrarPacientes() {
            this.$emit('filtrarPacientes', this.filtro);
            this.visible = false;
        },
    },  
    watch: {
        limparCampos(newVal) {
            if (newVal) {
                this.filtro = {
                    nome: '',
                    email: '',
                    telefone: ''
                };
            }
        }
    }
}
</script>
<style>
    
</style>