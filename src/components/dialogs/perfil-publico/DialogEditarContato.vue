<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Contato" :style="{ width: '600px' }">
        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">WhatsApp *</label>
                    <InputText v-model="whatsapp" placeholder="(11) 99999-9999" class="w-full" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Telefone</label>
                    <InputText v-model="telefone" placeholder="(11) 9999-9999" class="w-full" />
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-500 font-medium mb-2">Email</label>
                <InputText v-model="email" placeholder="seu@email.com" class="w-full" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('contato-atualizado'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarContato',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'contato-atualizado'],
    data() {
        return {
            whatsapp: '',
            telefone: '',
            email: ''
        };
    }
};
</script>
