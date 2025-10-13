<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Localização" :style="{ width: '600px' }">
        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-4">
                    <label class="block text-500 font-medium mb-2">CEP</label>
                    <InputText v-model="cep" placeholder="00000-000" class="w-full" />
                </div>
                <div class="col-12 md:col-4">
                    <label class="block text-500 font-medium mb-2">Cidade</label>
                    <InputText v-model="cidade" placeholder="Sua cidade" class="w-full" />
                </div>
                <div class="col-12 md:col-4">
                    <label class="block text-500 font-medium mb-2">Estado</label>
                    <InputText v-model="estado" placeholder="UF" class="w-full" />
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-500 font-medium mb-2">Endereço</label>
                <InputText v-model="endereco" placeholder="Endereço completo" class="w-full" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('localizacao-atualizada'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarLocalizacao',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'localizacao-atualizada'],
    data() {
        return {
            cep: '',
            cidade: '',
            estado: '',
            endereco: ''
        };
    }
};
</script>
