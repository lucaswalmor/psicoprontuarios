<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Atendimento</h5>
            <Button icon="pi pi-pencil" label="Editar" size="small" @click="$emit('editar-atendimento')" />
        </div>
        
        <div class="grid">
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">Tipo de Atendimento</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <span>{{ formatarTipoAtendimento(perfil.tipo_atendimento) }}</span>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">Valores</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <span>{{ formatarValores(perfil.valor_minimo, perfil.valor_maximo) }}</span>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <label class="block text-500 font-medium mb-2">Convênios</label>
            <div v-if="perfil.aceita_convenio && perfil.convenios && perfil.convenios.length > 0" class="flex flex-wrap gap-2">
                <Tag v-for="convenio in perfil.convenios" :key="convenio.id" :value="convenio.nome" severity="info" />
            </div>
            <div v-else-if="perfil.aceita_convenio" class="p-3 bg-yellow-50 border-yellow-200 rounded border">
                <span class="text-yellow-800">Aceita convênios mas não especificou quais</span>
            </div>
            <div v-else class="p-3 bg-gray-50 rounded border">
                <span class="text-700">Não aceita convênios</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardAtendimento',
    props: {
        perfil: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatarTipoAtendimento(tipo) {
            const tipos = {
                'presencial': 'Presencial',
                'online': 'Online',
                'híbrido': 'Presencial e Online'
            };
            return tipos[tipo] || tipo || 'Não informado';
        },
        formatarValores(min, max) {
            if (min && max) {
                if (min === max) {
                    return `R$ ${min.toFixed(2).replace('.', ',')}`;
                } else {
                    return `R$ ${min.toFixed(2).replace('.', ',')} - R$ ${max.toFixed(2).replace('.', ',')}`;
                }
            } else if (min) {
                return `A partir de R$ ${min.toFixed(2).replace('.', ',')}`;
            } else if (max) {
                return `Até R$ ${max.toFixed(2).replace('.', ',')}`;
            }
            return 'Valor não informado';
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}
</style>
