<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Localização</h5>
            <Button icon="pi pi-pencil" label="Editar" size="small" @click="$emit('editar-localizacao')" />
        </div>
        
        <div class="grid">
            <div class="col-12 md:col-4">
                <label class="block text-500 font-medium mb-2">CEP</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <span>{{ perfil.cep_formatado || 'Não informado' }}</span>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <label class="block text-500 font-medium mb-2">Cidade</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <span>{{ perfil.cidade || 'Não informada' }}</span>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <label class="block text-500 font-medium mb-2">Estado</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <span>{{ perfil.estado || 'Não informado' }}</span>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <label class="block text-500 font-medium mb-2">Endereço</label>
            <div class="p-3 bg-gray-50 rounded border">
                <span>{{ perfil.endereco || 'Endereço não informado' }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardLocalizacao',
    props: {
        perfil: {
            type: Object,
            required: true
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
