<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Redes Sociais</h5>
            <Button icon="pi pi-pencil" label="Editar" size="small" @click="$emit('editar-redes')" />
        </div>
        
        <div class="grid">
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">Instagram</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <div v-if="perfil.link_instagram" class="flex align-items-center">
                        <i class="pi pi-instagram text-pink-500 mr-2"></i>
                        <a :href="perfil.link_instagram" target="_blank" class="text-blue-600 hover:underline">
                            {{ perfil.link_instagram }}
                        </a>
                    </div>
                    <span v-else class="text-gray-500">Não informado</span>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">Facebook</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <div v-if="perfil.link_facebook" class="flex align-items-center">
                        <i class="pi pi-facebook text-blue-600 mr-2"></i>
                        <a :href="perfil.link_facebook" target="_blank" class="text-blue-600 hover:underline">
                            {{ perfil.link_facebook }}
                        </a>
                    </div>
                    <span v-else class="text-gray-500">Não informado</span>
                </div>
            </div>
        </div>
        
        <div class="grid mt-4">
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">LinkedIn</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <div v-if="perfil.link_linkedin" class="flex align-items-center">
                        <i class="pi pi-linkedin text-blue-700 mr-2"></i>
                        <a :href="perfil.link_linkedin" target="_blank" class="text-blue-600 hover:underline">
                            {{ perfil.link_linkedin }}
                        </a>
                    </div>
                    <span v-else class="text-gray-500">Não informado</span>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <label class="block text-500 font-medium mb-2">Twitter/X</label>
                <div class="p-3 bg-gray-50 rounded border">
                    <div v-if="perfil.link_twitter" class="flex align-items-center">
                        <i class="pi pi-twitter text-blue-400 mr-2"></i>
                        <a :href="perfil.link_twitter" target="_blank" class="text-blue-600 hover:underline">
                            {{ perfil.link_twitter }}
                        </a>
                    </div>
                    <span v-else class="text-gray-500">Não informado</span>
                </div>
            </div>
        </div>
        
        <div class="mt-3 p-3 bg-orange-50 border-orange-200 rounded">
            <div class="flex align-items-center">
                <i class="pi pi-info-circle text-orange-600 mr-2"></i>
                <span class="text-orange-800 text-sm">
                    As redes sociais são opcionais mas ajudam a aumentar a confiança dos pacientes.
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardRedesSociais',
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
