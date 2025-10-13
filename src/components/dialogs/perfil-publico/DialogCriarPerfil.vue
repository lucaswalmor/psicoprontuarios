<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        header="Criar Perfil Público"
        :style="{ width: '90vw', maxWidth: '800px' }"
        :closable="!loading"
    >
        <div v-if="!loading">
            <div class="text-center mb-4">
                <i class="pi pi-user-plus text-6xl text-blue-500 mb-3"></i>
                <h3 class="text-2xl font-bold text-800 mb-2">Crie seu Perfil Público</h3>
                <p class="text-600">
                    Configure seu perfil para aparecer no marketplace e receber pacientes diretamente via WhatsApp.
                </p>
            </div>
            
            <div class="grid">
                <div class="col-12 md:col-6">
                    <div class="text-center p-4 border rounded-lg">
                        <i class="pi pi-users text-3xl text-green-500 mb-2"></i>
                        <h4 class="font-semibold mb-2">Mais Pacientes</h4>
                        <p class="text-sm text-600">Apareça nas buscas do marketplace</p>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="text-center p-4 border rounded-lg">
                        <i class="pi pi-whatsapp text-3xl text-green-500 mb-2"></i>
                        <h4 class="font-semibold mb-2">Contato Direto</h4>
                        <p class="text-sm text-600">Pacientes entram em contato via WhatsApp</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 p-4 bg-blue-50 border-blue-200 rounded">
                <div class="flex align-items-center">
                    <i class="pi pi-info-circle text-blue-600 mr-2"></i>
                    <span class="text-blue-800 text-sm">
                        Você pode editar todas as informações do seu perfil a qualquer momento.
                    </span>
                </div>
            </div>
        </div>
        
        <div v-else class="text-center p-6">
            <ProgressSpinner />
            <p class="text-600 mt-3">Preparando formulário...</p>
        </div>
        
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    severity="secondary"
                    @click="$emit('update:visible', false)"
                    :disabled="loading"
                />
                <Button 
                    label="Começar" 
                    icon="pi pi-arrow-right" 
                    @click="comecar"
                    :loading="loading"
                />
            </div>
        </template>
    </Dialog>
</template>

<script>
import { perfilPublicoService } from '@/services';

export default {
    name: 'DialogCriarPerfil',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:visible', 'perfil-criado'],
    data() {
        return {
            loading: false
        };
    },
    methods: {
        async comecar() {
            this.loading = true;
            
            try {
                // Buscar especialidades e temas disponíveis
                const especialidades = await perfilPublicoService.buscarEspecialidades();
                const temas = await perfilPublicoService.buscarTemas();
                
                // Criar perfil público básico com dados mínimos obrigatórios
                const dadosBasicos = {
                    publico_alvo: 'Adultos',
                    valor_minimo: 50.00,
                    valor_maximo: 150.00,
                    aceita_convenio: 0, // Boolean será convertido para string pelo service
                    tipo_atendimento: 'online',
                    descricao: 'Psicólogo(a) clínico(a) com experiência em atendimento psicológico. Ofereço um espaço seguro e acolhedor para que você possa trabalhar suas questões pessoais e desenvolver seu potencial. Meu objetivo é ajudá-lo(a) a encontrar caminhos para uma vida mais plena e satisfatória.',
                    whatsapp: '11999999999',
                    especialidades: especialidades.slice(0, 1).map(e => e.id), // Primeira especialidade
                    temas: temas.slice(0, 3).map(t => t.id) // Primeiros 3 temas
                };

                await perfilPublicoService.criarPerfil(dadosBasicos);
                
                this.$emit('perfil-criado');
                this.$emit('update:visible', false);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Perfil público criado com sucesso!',
                    life: 3000
                });
                
            } catch (error) {
                console.error('Erro ao criar perfil:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar perfil público',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
:deep(.p-dialog-header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

:deep(.p-dialog-header .p-dialog-title) {
    color: white;
}

:deep(.p-dialog-header .p-dialog-header-icon) {
    color: white;
}
</style>
