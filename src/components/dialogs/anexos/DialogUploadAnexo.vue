<template>
    <Dialog :visible="visible" modal header="Upload de Anexos" :style="{ width: '600px' }" :closable="true"
        @hide="onHide">
        <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
                <label for="arquivo" class="font-medium">Selecionar Arquivos</label>

                <!-- Aviso quando plano está pausado -->
                <div v-if="isPlanPaused" class="p-3 border-round surface-100 border-orange-200 bg-orange-50">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-exclamation-triangle text-orange-500"></i>
                        <span class="text-sm text-orange-700">
                            Seu plano está pausado. Você não pode fazer novos uploads de anexos.
                        </span>
                    </div>
                </div>

                <!-- Aviso quando limite de anexos atingido -->
                <div v-else-if="!planStore.canUploadAnexos"
                    class="p-3 border-round surface-100 border-red-200 bg-red-50">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-exclamation-triangle text-red-500"></i>
                        <span class="text-sm text-red-700">
                            Limite de anexos atingido.
                            <span v-if="planStore.anexosLimite !== -1">
                                Você usou {{ planStore.anexosCount }} de {{ planStore.anexosLimite }} anexos.
                            </span>
                            Faça upgrade do seu plano para mais anexos.
                        </span>
                    </div>
                </div>

                <FileUpload v-model="arquivosSelecionados" :multiple="true" :auto="false"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.doc,.docx" :maxFileSize="10485760"
                    chooseLabel="Escolher Arquivos" cancelLabel="Cancelar" :showCancelButton="false"
                    :showUploadButton="false" :disabled="isPlanPaused || !planStore.canUploadAnexos"
                    @select="onFileSelect" class="w-full">
                    <template #empty>
                        <div class="flex flex-column align-items-center p-4">
                            <i class="pi pi-file-upload text-4xl text-gray-400 mb-3"></i>
                            <span class="text-gray-600">Arraste arquivos aqui ou clique para selecionar</span>
                            <small class="text-gray-500 mt-2">
                                Tipos aceitos: PDF, imagens (JPG, PNG, GIF) e planilhas (XLSX, XLS, DOC, DOCX)<br>
                                Tamanho máximo por arquivo: 10MB<br>
                                Você pode selecionar múltiplos arquivos
                            </small>
                        </div>
                    </template>
                </FileUpload>
            </div>

            <!-- Lista de arquivos selecionados -->
            <div v-if="arquivosSelecionados && arquivosSelecionados.length > 0" class="flex flex-column gap-2">
                <h6 class="m-0">Arquivos Selecionados ({{ arquivosSelecionados.length }})</h6>
                
                <div v-for="(arquivo, index) in arquivosSelecionados" :key="index" 
                     class="flex align-items-center justify-content-between p-3 border-round surface-100">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-file text-primary"></i>
                        <div class="flex flex-column">
                            <span class="font-medium">{{ arquivo.name }}</span>
                            <small class="text-gray-600">{{ formatFileSize(arquivo.size) }}</small>
                        </div>
                    </div>
                    <Button 
                        icon="pi pi-times" 
                        severity="danger" 
                        text 
                        size="small"
                        @click="removerArquivo(index)"
                        :disabled="loading"
                    />
                </div>

                <!-- Progresso do upload -->
                <div v-if="uploadProgress.length > 0" class="flex flex-column gap-2">
                    <h6 class="m-0">Progresso do Upload</h6>
                    <div v-for="(progress, index) in uploadProgress" :key="index" class="flex flex-column gap-1">
                        <div class="flex align-items-center justify-content-between">
                            <small class="text-gray-600">{{ progress.fileName }}</small>
                            <small class="text-gray-600">{{ progress.percentage }}%</small>
                        </div>
                        <ProgressBar :value="progress.percentage" :showValue="false" />
                        <small v-if="progress.status === 'success'" class="text-green-600">
                            <i class="pi pi-check"></i> Upload concluído
                        </small>
                        <small v-else-if="progress.status === 'error'" class="text-red-600">
                            <i class="pi pi-times"></i> {{ progress.error }}
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="onHide" :disabled="loading" />
                <Button label="Upload de Todos" @click="fazerUploadMultiplo" :loading="loading"
                    :disabled="!arquivosSelecionados || arquivosSelecionados.length === 0 || isPlanPaused || !planStore.canUploadAnexos" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import { usePlanStore } from '@/store/plan';

export default {
    name: 'DialogUploadAnexo',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        paciente: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            arquivosSelecionados: [],
            loading: false,
            uploadProgress: []
        };
    },
    computed: {
        planStore() {
            return usePlanStore();
        },
        isPlanPaused() {
            return this.planStore.isPlanPaused;
        }
    },
    methods: {
        onFileSelect(event) {
            this.arquivosSelecionados = event.files;
            this.uploadProgress = [];
        },

        removerArquivo(index) {
            this.arquivosSelecionados.splice(index, 1);
            this.uploadProgress.splice(index, 1);
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        async fazerUploadMultiplo() {
            if (!this.arquivosSelecionados || this.arquivosSelecionados.length === 0) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione pelo menos um arquivo',
                    life: 3000
                });
                return;
            }

            try {
                this.loading = true;
                this.uploadProgress = [];

                // Inicializar progresso para cada arquivo
                this.arquivosSelecionados.forEach((arquivo, index) => {
                    this.uploadProgress[index] = {
                        fileName: arquivo.name,
                        percentage: 0,
                        status: 'uploading'
                    };
                });

                // Simular progresso inicial
                for (let i = 0; i <= 80; i += 20) {
                    this.uploadProgress.forEach((progress, index) => {
                        this.uploadProgress[index].percentage = i;
                    });
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Fazer upload múltiplo usando o novo endpoint
                const response = await this.$anexosService.uploadMultiple(
                    this.paciente.id,
                    this.arquivosSelecionados
                );

                // Processar resultados
                if (response.success) {
                    // Atualizar progresso baseado nos resultados
                    response.resultados.forEach((resultado, index) => {
                        if (resultado.status === 'sucesso') {
                            this.uploadProgress[index].status = 'success';
                            this.uploadProgress[index].percentage = 100;
                        } else {
                            this.uploadProgress[index].status = 'error';
                            this.uploadProgress[index].error = resultado.mensagem;
                        }
                    });

                    // Mostrar mensagem de resultado
                    if (response.falhas === 0) {
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: `Todos os ${response.sucessos} arquivos foram anexados com sucesso!`,
                            life: 5000
                        });
                    } else if (response.sucessos > 0) {
                        this.$toast.add({
                            severity: 'warn',
                            summary: 'Upload Parcial',
                            detail: `${response.sucessos} arquivos anexados com sucesso, ${response.falhas} falharam.`,
                            life: 5000
                        });
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Nenhum arquivo foi anexado. Verifique os erros acima.',
                            life: 5000
                        });
                    }

                    // Emitir evento apenas se pelo menos um upload foi bem-sucedido
                    if (response.sucessos > 0) {
                        this.$emit('anexo-uploaded');
                    }
                } else {
                    throw new Error(response.error || 'Erro no upload múltiplo');
                }

                // Aguardar um pouco para mostrar o progresso final
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.onHide();

            } catch (error) {
                console.error('Erro geral no upload múltiplo:', error);
                
                // Marcar todos como erro
                this.uploadProgress.forEach((progress, index) => {
                    this.uploadProgress[index].status = 'error';
                    this.uploadProgress[index].error = error.response?.data?.error || 'Erro no upload';
                });

                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao processar uploads múltiplos',
                    life: 5000
                });
            } finally {
                this.loading = false;
            }
        },

        onHide() {
            this.arquivosSelecionados = [];
            this.uploadProgress = [];
            this.$emit('update:visible', false);
        }
    }
};
</script>