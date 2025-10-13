<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Preview do Perfil" :style="{ width: '90vw', maxWidth: '1000px' }">
        <div class="p-4">
            <div class="text-center mb-4">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Como seu perfil aparece no marketplace</h3>
                <p class="text-gray-600">Esta é uma prévia de como os pacientes verão seu perfil</p>
            </div>
            
            <div class="border rounded-lg p-6 bg-white shadow-sm">
                <div class="grid">
                    <div class="col-12 md:col-4 text-center">
                        <div v-if="perfil?.foto_url" class="mb-3">
                            <img :src="perfil.foto_url" :alt="perfil.psicologo?.nome" class="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-200" />
                        </div>
                        <div v-else class="mb-3">
                            <div class="w-32 h-32 rounded-full bg-gray-200 border-4 border-blue-200 mx-auto flex align-items-center justify-content-center">
                                <i class="pi pi-user text-gray-400 text-4xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-8">
                        <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ perfil?.psicologo?.nome }}</h2>
                        <p class="text-blue-600 font-medium mb-3">CRP {{ perfil?.psicologo?.crp }}</p>
                        
                        <div v-if="perfil?.descricao" class="mb-4">
                            <p class="text-gray-700">{{ perfil.descricao }}</p>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-3">
                            <Tag v-for="especialidade in perfil?.especialidades" :key="especialidade.id" :value="especialidade.nome" severity="info" />
                        </div>
                        
                        <div class="flex align-items-center gap-4">
                            <div class="flex align-items-center">
                                <i class="pi pi-whatsapp text-green-500 mr-1"></i>
                                <span class="text-sm">{{ perfil?.whatsapp_formatado }}</span>
                            </div>
                            <div v-if="perfil?.cidade" class="flex align-items-center">
                                <i class="pi pi-map-marker text-blue-500 mr-1"></i>
                                <span class="text-sm">{{ perfil.cidade }}/{{ perfil.estado }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <template #footer>
            <div class="flex justify-content-end">
                <Button label="Fechar" icon="pi pi-times" @click="$emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogPreviewPerfil',
    props: {
        visible: { type: Boolean, default: false },
        perfil: { type: Object, default: null }
    },
    emits: ['update:visible']
};
</script>
