<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Especialidades" :style="{ width: '600px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Especialidades/Abordagens</label>
            <MultiSelect v-model="especialidades" :options="opcoesEspecialidades" optionLabel="nome" optionValue="id" placeholder="Selecione suas especialidades" class="w-full" />
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('especialidades-atualizadas'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarEspecialidades',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'especialidades-atualizadas'],
    data() {
        return {
            especialidades: [],
            opcoesEspecialidades: []
        };
    },
    methods: {
        async carregarEspecialidades() {
            // Simular carregamento de especialidades
            this.opcoesEspecialidades = [
                { id: 1, nome: 'Terapia Cognitivo-Comportamental (TCC)' },
                { id: 2, nome: 'Psicanálise' },
                { id: 3, nome: 'Gestalt-terapia' }
            ];
        }
    },
    mounted() {
        this.carregarEspecialidades();
    }
};
</script>
