<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Contato</h5>
            <Button icon="pi pi-pencil" label="Editar" size="small" @click="$emit('editar-contato')" />
        </div>
        
        <div class="grid">
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">WhatsApp</label>
                <div class="p-3 bg-green-50 border-green-200 rounded border">
                    <div class="flex align-items-center">
                        <i class="pi pi-whatsapp text-green-600 mr-2"></i>
                        <span class="text-green-800 font-medium">{{ perfil.whatsapp_formatado || perfil.whatsapp }}</span>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">Telefone</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <span>{{ perfil.telefone_formatado || perfil.telefone || 'Não informado' }}</span>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <label class="block text-500 font-medium mb-2">Email</label>
            <div class="p-3 bg-gray-50 rounded border">
                <span>{{ perfil.email || 'Email não informado' }}</span>
            </div>
        </div>
        
        <div class="mt-3 p-3 bg-blue-50 border-blue-200 rounded">
            <div class="flex align-items-center">
                <i class="pi pi-info-circle text-blue-600 mr-2"></i>
                <span class="text-blue-800 text-sm">
                    O WhatsApp é obrigatório e será usado pelos pacientes para entrar em contato diretamente com você.
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardContato',
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
