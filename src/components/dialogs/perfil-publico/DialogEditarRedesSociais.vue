<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Redes Sociais" :style="{ width: '600px' }">
        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Instagram</label>
                    <InputText v-model="instagram" placeholder="https://instagram.com/seu_usuario" class="w-full" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Facebook</label>
                    <InputText v-model="facebook" placeholder="https://facebook.com/seu_usuario" class="w-full" />
                </div>
            </div>
            <div class="grid mt-4">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">LinkedIn</label>
                    <InputText v-model="linkedin" placeholder="https://linkedin.com/in/seu_usuario" class="w-full" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Twitter/X</label>
                    <InputText v-model="twitter" placeholder="https://twitter.com/seu_usuario" class="w-full" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('redes-atualizadas'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarRedesSociais',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'redes-atualizadas'],
    data() {
        return {
            instagram: '',
            facebook: '',
            linkedin: '',
            twitter: ''
        };
    }
};
</script>
