<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Informações Profissionais</h5>
            <Button 
                icon="pi pi-pencil" 
                label="Editar" 
                size="small"
                @click="editar"
            />
        </div>
        
        <!-- Especialidades -->
        <div class="mb-4">
            <label class="block text-500 font-medium mb-2">Especialidades/Abordagens</label>
            <div v-if="perfil.especialidades && perfil.especialidades.length > 0" class="flex flex-wrap gap-2 mb-2">
                <Tag 
                    v-for="especialidade in perfil.especialidades" 
                    :key="especialidade.id"
                    :value="especialidade.nome"
                    severity="info"
                />
            </div>
            <div v-else class="p-3 bg-yellow-50 border-yellow-200 rounded border">
                <div class="flex align-items-center">
                    <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                    <span class="text-yellow-800">Nenhuma especialidade informada</span>
                </div>
            </div>
        </div>
        
        <!-- Público-alvo -->
        <div class="mb-4">
            <label class="block text-500 font-medium mb-2">Público-alvo</label>
            <div v-if="perfil.publico_alvo" class="p-3 bg-gray-50 rounded border">
                <span class="text-gray-700">{{ formatarPublicoAlvo(perfil.publico_alvo) }}</span>
            </div>
            <div v-else class="p-3 bg-yellow-50 border-yellow-200 rounded border">
                <div class="flex align-items-center">
                    <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                    <span class="text-yellow-800">Público-alvo não informado</span>
                </div>
            </div>
        </div>
        
        <!-- Temas Tratados -->
        <div>
            <label class="block text-500 font-medium mb-2">Temas que Trabalha</label>
            <div v-if="perfil.temas && perfil.temas.length > 0" class="flex flex-wrap gap-2 mb-2">
                <Tag 
                    v-for="tema in perfil.temas" 
                    :key="tema.id"
                    :value="tema.nome"
                    severity="success"
                />
            </div>
            <div v-else class="p-3 bg-yellow-50 border-yellow-200 rounded border">
                <div class="flex align-items-center">
                    <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                    <span class="text-yellow-800">Nenhum tema informado</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardInformacoesProfissionais',
    props: {
        perfil: {
            type: Object,
            required: true
        }
    },
    methods: {
        editar() {
            // Por enquanto, abrir edição de especialidades como padrão
            this.$emit('editar-especialidades');
        },
        formatarPublicoAlvo(publico) {
            const publicos = {
                'crianças': 'Crianças',
                'adolescentes': 'Adolescentes',
                'adultos': 'Adultos',
                'casais': 'Casais',
                'idosos': 'Idosos'
            };
            return publicos[publico] || publico;
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
