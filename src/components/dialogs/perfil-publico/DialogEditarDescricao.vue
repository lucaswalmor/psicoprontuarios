<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Descrição" :style="{ width: '600px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Descrição do Perfil</label>
            <Textarea 
                v-model="descricao" 
                rows="8" 
                class="w-full"
                placeholder="Descreva sua experiência, abordagem e como você pode ajudar os pacientes..."
            />
            <div class="flex justify-content-between align-items-center mt-2">
                <span class="text-sm text-500">{{ descricao.length }}/1000 caracteres</span>
                <span v-if="descricao.length < 200" class="text-sm text-orange-600">
                    Mínimo 200 caracteres recomendado
                </span>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="salvar" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarDescricao',
    props: {
        visible: { type: Boolean, default: false },
        perfil: { type: Object, default: null }
    },
    emits: ['update:visible', 'descricao-atualizada'],
    data() {
        return {
            descricao: ''
        };
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil) {
                    this.descricao = newPerfil.descricao || '';
                }
            },
            immediate: true
        }
    },
    methods: {
        salvar() {
            this.$emit('descricao-atualizada');
            this.$emit('update:visible', false);
        }
    }
};
</script>
