<template>
    <Dialog :visible="visible" modal header="Upload de Anexo" :style="{ width: '500px' }" :closable="true"
        @hide="onHide">
        <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
                <label for="arquivo" class="font-medium">Selecionar Arquivo</label>

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

                <FileUpload v-model="arquivoSelecionado" :multiple="false" :auto="false"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.doc,.docx" :maxFileSize="10485760"
                    chooseLabel="Escolher Arquivo" cancelLabel="Cancelar" :showCancelButton="false"
                    :showUploadButton="false" :disabled="isPlanPaused || !planStore.canUploadAnexos"
                    @select="onFileSelect" class="w-full">
                    <template #empty>
                        <div class="flex flex-column align-items-center p-4">
                            <i class="pi pi-file-upload text-4xl text-gray-400 mb-3"></i>
                            <span class="text-gray-600">Arraste um arquivo aqui ou clique para selecionar</span>
                            <small class="text-gray-500 mt-2">
                                Tipos aceitos: PDF, imagens (JPG, PNG, GIF) e planilhas (XLSX, XLS, DOC, DOCX)<br>
                                Tamanho máximo: 10MB
                            </small>
                        </div>
                    </template>
                </FileUpload>
            </div>

            <div v-if="arquivoSelecionado" class="flex flex-column gap-2">
                <div class="flex align-items-center gap-2 p-3 border-round surface-100">
                    <i class="pi pi-file text-primary"></i>
                    <div class="flex flex-column">
                        <span class="font-medium">{{ arquivoSelecionado.name }}</span>
                        <small class="text-gray-600">{{ formatFileSize(arquivoSelecionado.size) }}</small>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="onHide" />
                <Button label="Upload" @click="fazerUpload" :loading="loading"
                    :disabled="!arquivoSelecionado || isPlanPaused || !planStore.canUploadAnexos" />
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
            arquivoSelecionado: null,
            loading: false
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
            this.arquivoSelecionado = event.files[0];
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        async fazerUpload() {
            if (!this.arquivoSelecionado) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um arquivo',
                    life: 3000
                });
                return;
            }

            try {
                this.loading = true;

                await this.$anexosService.upload(
                    this.paciente.id,
                    this.arquivoSelecionado
                );

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Arquivo anexado com sucesso',
                    life: 3000
                });

                this.$emit('anexo-uploaded');
                this.onHide();
            } catch (error) {
                console.error('Erro ao fazer upload:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao fazer upload do arquivo',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        onHide() {
            this.arquivoSelecionado = null;
            this.$emit('update:visible', false);
        }
    }
};
</script>