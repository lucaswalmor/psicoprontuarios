<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Anexar Arquivo" :style="{ width: '50vw' }" modal>
        <div class="grid">
            <div class="col-12">
                <label class="block text-500 font-medium mb-2">Selecionar Arquivo</label>
                <FileUpload 
                    :multiple="false"
                    accept="*/*"
                    :maxFileSize="10000000"
                    chooseLabel="Escolher Arquivo"
                    cancelLabel="Cancelar"
                    class="w-full"
                    @select="onArquivoSelecionado"
                />
                <small class="text-400">Tamanho máximo: 10MB</small>
            </div>
            
            <div class="col-12" v-if="arquivoSelecionado">
                <div class="flex align-items-center gap-2 p-3 border-round bg-blue-50">
                    <i class="pi pi-file text-blue-500"></i>
                    <span class="text-blue-700 font-medium">{{ arquivoSelecionado.name }}</span>
                    <span class="text-blue-600 text-sm">({{ formatarTamanho(arquivoSelecionado.size) }})</span>
                </div>
            </div>
            
            <div class="col-12">
                <label class="block text-500 font-medium mb-2">Observações (opcional)</label>
                <Textarea 
                    :modelValue="observacoes"
                    @update:modelValue="observacoes = $event"
                    rows="3" 
                    placeholder="Digite observações sobre o arquivo anexado" 
                    class="w-full" 
                />
            </div>
        </div>
        
        <template #footer>
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                @click="fecharDialog" 
                class="p-button-text" 
            />
            <Button 
                label="Anexar" 
                icon="pi pi-paperclip" 
                @click="anexarArquivo" 
                :loading="enviando"
                :disabled="!arquivoSelecionado"
            />
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogAnexarArquivo',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        paciente: {
            type: Object,
            required: true
        }
    },
    emits: ['update:visible', 'arquivo-anexado'],
    data() {
        return {
            arquivoSelecionado: null,
            observacoes: '',
            enviando: false
        };
    },
    methods: {
        fecharDialog() {
            this.$emit('update:visible', false);
            this.limparFormulario();
        },
        onArquivoSelecionado(event) {
            if (event.files && event.files.length > 0) {
                this.arquivoSelecionado = event.files[0];
            }
        },
        formatarTamanho(bytes) {
            if (!bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        async anexarArquivo() {
            if (!this.arquivoSelecionado) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um arquivo para anexar',
                    life: 3000
                });
                return;
            }

            this.enviando = true;
            try {
                const formData = new FormData();
                formData.append('arquivo', this.arquivoSelecionado);
                formData.append('paciente_id', this.paciente.id);
                formData.append('observacoes', this.observacoes);

                await this.$anexosService.upload(this.paciente.id, this.arquivoSelecionado);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Arquivo anexado com sucesso',
                    life: 3000
                });

                this.$emit('arquivo-anexado');
                this.fecharDialog();
            } catch (error) {
                console.error('Erro ao anexar arquivo:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao anexar arquivo',
                    life: 3000
                });
            } finally {
                this.enviando = false;
            }
        },
        limparFormulario() {
            this.arquivoSelecionado = null;
            this.observacoes = '';
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
