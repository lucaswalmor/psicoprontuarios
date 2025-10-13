<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Temas" :style="{ width: '600px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Temas que Trabalha</label>
            <MultiSelect v-model="temas" :options="opcoesTemas" optionLabel="nome" optionValue="id" placeholder="Selecione os temas" class="w-full" />
            <small class="text-500">Mínimo 3 temas recomendado</small>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('temas-atualizados'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarTemas',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'temas-atualizados'],
    data() {
        return {
            temas: [],
            opcoesTemas: [
                { id: 1, nome: 'Ansiedade' },
                { id: 2, nome: 'Depressão' },
                { id: 3, nome: 'Relacionamentos' }
            ]
        };
    }
};
</script>
