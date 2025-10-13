<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Atendimento" :style="{ width: '600px' }">
        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Tipo de Atendimento</label>
                    <Select v-model="tipoAtendimento" :options="tiposAtendimento" placeholder="Selecione" class="w-full" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Público-alvo</label>
                    <Select v-model="publicoAlvo" :options="publicosAlvo" placeholder="Selecione" class="w-full" />
                </div>
            </div>
            <div class="grid mt-4">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Valor Mínimo (R$)</label>
                    <InputNumber v-model="valorMinimo" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Valor Máximo (R$)</label>
                    <InputNumber v-model="valorMaximo" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('atendimento-atualizado'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarAtendimento',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'atendimento-atualizado'],
    data() {
        return {
            tipoAtendimento: null,
            publicoAlvo: null,
            valorMinimo: null,
            valorMaximo: null,
            tiposAtendimento: [
                { label: 'Presencial', value: 'presencial' },
                { label: 'Online', value: 'online' },
                { label: 'Híbrido', value: 'híbrido' }
            ],
            publicosAlvo: [
                { label: 'Crianças', value: 'crianças' },
                { label: 'Adolescentes', value: 'adolescentes' },
                { label: 'Adultos', value: 'adultos' },
                { label: 'Casais', value: 'casais' },
                { label: 'Idosos', value: 'idosos' }
            ]
        };
    }
};
</script>
