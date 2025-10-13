<template>
    <Dialog 
        :visible="visible" 
        @update:visible="handleClose"
        modal 
        header="Editar Foto"
        :style="{ width: '500px' }"
        :closable="!loading"
    >
        <div class="text-center p-4">
            <i class="pi pi-image text-4xl text-blue-500 mb-3"></i>
            <h4 class="font-semibold mb-2">Upload de Foto</h4>
            <p class="text-600 mb-4">
                Faça upload de uma foto profissional para o seu perfil.
            </p>
            
            <!-- Preview da foto atual ou selecionada -->
            <div v-if="previewUrl" class="mb-3">
                <img :src="previewUrl" alt="Preview" class="max-w-full h-auto border-round" style="max-height: 200px;" />
            </div>
            
            <FileUpload 
                ref="fileUpload"
                mode="basic" 
                accept="image/jpeg,image/jpg,image/png"
                :maxFileSize="5242880"
                chooseLabel="Escolher Foto"
                class="mb-3"
                @select="onFileSelect"
                :disabled="loading"
            />
            
            <div class="p-3 surface-100 border-1 surface-border border-round">
                <div class="flex align-items-center">
                    <i class="pi pi-info-circle text-600 mr-2"></i>
                    <span class="text-600 text-sm">
                        Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.
                    </span>
                </div>
            </div>

            <div v-if="erro" class="p-3 bg-red-50 border-1 border-red-200 border-round mt-3">
                <div class="flex align-items-center">
                    <i class="pi pi-exclamation-circle text-red-600 mr-2"></i>
                    <span class="text-red-800 text-sm">{{ erro }}</span>
                </div>
            </div>
        </div>
        
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    severity="secondary"
                    @click="handleClose"
                    :disabled="loading"
                />
                <Button 
                    label="Salvar" 
                    icon="pi pi-check" 
                    @click="salvar"
                    :loading="loading"
                    :disabled="!fotoSelecionada || loading"
                />
            </div>
        </template>
    </Dialog>
</template>

<script>
import perfilPublicoService from '@/services/perfilPublicoService';

export default {
    name: 'DialogEditarFoto',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:visible', 'foto-atualizada'],
    data() {
        return {
            fotoSelecionada: null,
            previewUrl: null,
            loading: false,
            erro: null
        };
    },
    methods: {
        onFileSelect(event) {
            this.erro = null;
            const file = event.files[0];
            
            if (file) {
                // Validar tipo de arquivo
                const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!tiposPermitidos.includes(file.type)) {
                    this.erro = 'Formato de arquivo inválido. Use JPG ou PNG.';
                    this.fotoSelecionada = null;
                    this.previewUrl = null;
                    return;
                }

                // Validar tamanho (5MB)
                if (file.size > 5242880) {
                    this.erro = 'Arquivo muito grande. O tamanho máximo é 5MB.';
                    this.fotoSelecionada = null;
                    this.previewUrl = null;
                    return;
                }

                this.fotoSelecionada = file;
                
                // Criar preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async salvar() {
            if (!this.fotoSelecionada) {
                this.erro = 'Por favor, selecione uma foto.';
                return;
            }

            this.loading = true;
            this.erro = null;

            try {
                // Fazer upload da foto usando método específico
                const resultado = await perfilPublicoService.uploadFoto(this.fotoSelecionada);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Foto atualizada com sucesso!',
                    life: 3000
                });
                
                this.$emit('foto-atualizada');
                this.handleClose();
            } catch (error) {
                console.error('Erro ao atualizar foto:', error);
                const mensagem = error.response?.data?.message || 'Erro ao atualizar foto. Tente novamente.';
                this.erro = mensagem;
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: mensagem,
                    life: 5000
                });
            } finally {
                this.loading = false;
            }
        },

        handleClose() {
            if (!this.loading) {
                this.resetar();
                this.$emit('update:visible', false);
            }
        },

        resetar() {
            this.fotoSelecionada = null;
            this.previewUrl = null;
            this.erro = null;
            this.loading = false;
            
            // Limpar o FileUpload
            if (this.$refs.fileUpload) {
                this.$refs.fileUpload.clear();
            }
        }
    },
    watch: {
        visible(newVal) {
            if (!newVal) {
                this.resetar();
            }
        }
    }
};
</script>
