<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Sobre Você</h5>
            <Button 
                icon="pi pi-pencil" 
                label="Editar" 
                size="small"
                @click="editar"
            />
        </div>
        
        <!-- Foto Profissional -->
        <div class="mb-4">
            <label class="block text-500 font-medium mb-2">Foto Profissional</label>
            <div class="flex align-items-center gap-3">
                <div v-if="perfil.foto_url" class="flex-shrink-0">
                    <img 
                        :src="perfil.foto_url" 
                        :alt="`Foto de ${perfil.psicologo?.nome}`"
                        class="w-20 h-20 rounded-lg object-cover border"
                    />
                </div>
                <div v-else class="flex-shrink-0">
                    <div class="w-20 h-20 rounded-lg bg-gray-100 border flex align-items-center justify-content-center">
                        <i class="pi pi-user text-gray-400 text-2xl"></i>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <Button 
                        icon="pi pi-upload" 
                        label="Alterar Foto" 
                        size="small"
                        @click="$emit('editar-foto')"
                    />
                    <p class="text-sm text-500 mt-1">
                        Foto profissional que aparece no marketplace
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Descrição -->
        <div class="mb-4">
            <label class="block text-500 font-medium mb-2">Descrição do Perfil</label>
            <div v-if="perfil.descricao" class="p-3 bg-gray-50 rounded border">
                <p class="text-gray-700 mb-2">{{ perfil.descricao }}</p>
                <div class="flex justify-content-between align-items-center">
                    <span class="text-sm text-500">
                        {{ perfil.descricao.length }}/1000 caracteres
                    </span>
                    <Button 
                        icon="pi pi-pencil" 
                        label="Editar" 
                        size="small"
                        text
                        @click="$emit('editar-descricao')"
                    />
                </div>
            </div>
            <div v-else class="p-3 bg-yellow-50 border-yellow-200 rounded border">
                <div class="flex align-items-center">
                    <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
                    <span class="text-yellow-800">Descrição não informada</span>
                </div>
                <Button 
                    icon="pi pi-plus" 
                    label="Adicionar Descrição" 
                    size="small"
                    class="mt-2"
                    @click="$emit('editar-descricao')"
                />
            </div>
        </div>
        
        <!-- Vídeo de Apresentação -->
        <div>
            <label class="block text-500 font-medium mb-2">Vídeo de Apresentação</label>
            <div v-if="perfil.video_url" class="p-3 bg-gray-50 rounded border">
                <div class="flex align-items-center gap-3">
                    <i class="pi pi-video text-blue-500 text-xl"></i>
                    <div class="flex-grow-1">
                        <p class="text-gray-700 mb-1">Vídeo de apresentação disponível</p>
                        <p class="text-sm text-500">Os pacientes podem assistir antes de entrar em contato</p>
                    </div>
                    <Button 
                        icon="pi pi-pencil" 
                        label="Alterar" 
                        size="small"
                        @click="$emit('editar-video')"
                    />
                </div>
            </div>
            <div v-else class="p-3 bg-gray-50 border-gray-200 rounded border">
                <div class="flex align-items-center gap-3">
                    <i class="pi pi-video text-gray-400 text-xl"></i>
                    <div class="flex-grow-1">
                        <p class="text-gray-600 mb-1">Nenhum vídeo adicionado</p>
                        <p class="text-sm text-500">Adicione um vídeo para aumentar a conversão</p>
                    </div>
                    <Button 
                        icon="pi pi-plus" 
                        label="Adicionar Vídeo" 
                        size="small"
                        @click="$emit('editar-video')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardSobreVoce',
    props: {
        perfil: {
            type: Object,
            required: true
        }
    },
    methods: {
        editar() {
            // Por enquanto, abrir edição de descrição como padrão
            this.$emit('editar-descricao');
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
