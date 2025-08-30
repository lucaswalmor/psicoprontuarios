<template>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <Button v-if="!planStore.isPlanPaused" label="Upload de Anexo" icon="pi pi-upload"
            @click="dialogUploadAnexo = true" :disabled="!planStore.canUploadAnexos"
            :class="{ 'opacity-50': !planStore.canUploadAnexos }" />
    </div>

    <DataTable :value="anexos" :loading="loading" tableStyle="min-width: 50rem"
        :emptyMessage="'Nenhum anexo encontrado'">
        <Column field="nome_original" header="Nome do Arquivo" sortable>
            <template #body="slotProps">
                <div class="flex align-items-center gap-2">
                    <i :class="getFileIcon(slotProps.data.tipo)" class="text-primary"></i>
                    <span>{{ slotProps.data.nome_original }}</span>
                </div>
            </template>
        </Column>
        <Column field="tamanho" header="Tamanho" sortable>
            <template #body="slotProps">
                {{ formatFileSize(slotProps.data.tamanho) }}
            </template>
        </Column>
        <Column field="tipo" header="Tipo" sortable></Column>
        <Column field="created_at" header="Data de Upload" sortable></Column>
        <Column header="Ações">
            <template #body="slotProps">
                <div class="flex gap-2">
                    <Button icon="pi pi-download" class="p-button-text p-button-sm"
                        @click="downloadAnexo(slotProps.data)" v-tooltip.top="'Download'" />
                    <Button v-if="!planStore.isPlanPaused" icon="pi pi-trash"
                        class="p-button-text p-button-sm p-button-danger" @click="deletarAnexo(slotProps.data, $event)"
                        v-tooltip.top="'Excluir'" />
                </div>
            </template>
        </Column>

        <template #empty>
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="pi pi-file text-6xl text-gray-400"></i>
                </div>
                <div class="empty-content">
                    <h3 class="empty-title">Nenhum anexo encontrado</h3>
                    <p class="empty-description">
                        Este paciente ainda não possui arquivos anexados. Clique no botão "Upload de Anexo" para
                        adicionar o primeiro arquivo.
                    </p>
                    <Button v-if="!planStore.isPlanPaused" label="Upload de Anexo" icon="pi pi-upload"
                        @click="dialogUploadAnexo = true" class="mt-3" />
                </div>
            </div>
        </template>
    </DataTable>

    <DialogUploadAnexo :visible="dialogUploadAnexo" :paciente="paciente" @update:visible="onUpdateDialogUploadAnexo"
        @anexo-uploaded="onAnexoUploaded" />


</template>

<script>
import DialogUploadAnexo from '@/components/dialogs/anexos/DialogUploadAnexo.vue';
import { usePlanStore } from '@/store/plan';

export default {
    name: 'ListaAnexos',
    components: {
        DialogUploadAnexo
    },
    props: {
        pacienteId: {
            type: String,
            required: true
        },
        anexos: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        paciente: {
            type: Object,
            default: null
        }
    },
    computed: {
        planStore() {
            return usePlanStore();
        }
    },
    data() {
        return {
            dialogUploadAnexo: false
        };
    },

    methods: {
        getFileIcon(tipo) {
            const icons = {
                'pdf': 'pi pi-file-pdf',
                'jpg': 'pi pi-image',
                'jpeg': 'pi pi-image',
                'png': 'pi pi-image',
                'gif': 'pi pi-image',
                'xlsx': 'pi pi-file-excel',
                'xls': 'pi pi-file-excel',
                'doc': 'pi pi-file-word',
                'docx': 'pi pi-file-word'
            };
            return icons[tipo.toLowerCase()] || 'pi pi-file';
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        async downloadAnexo(anexo) {
            try {
                await this.$anexosService.download(anexo.id);
            } catch (error) {
                console.error('Erro ao fazer download:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao fazer download do arquivo',
                    life: 3000
                });
            }
        },

        deletarAnexo(anexo, event) {
            if (!event || !event.currentTarget) {
                return;
            }

            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: `Tem certeza que deseja excluir o arquivo "${anexo.nome_original}"?`,
                accept: async () => {
                    try {
                        await this.$anexosService.deletar(anexo.id);
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Anexo excluído com sucesso',
                            life: 3000
                        });
                        // Emitir evento para o componente pai recarregar os dados
                        this.$emit('anexoDeletado');
                    } catch (error) {
                        console.error('Erro ao excluir anexo:', error);
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir anexo',
                            life: 3000
                        });
                    }
                },
                reject: () => {
                    this.$toast.add({
                        severity: 'info',
                        summary: 'Cancelado',
                        detail: 'Exclusão cancelada',
                        life: 3000
                    });
                }
            });
        },

        onUpdateDialogUploadAnexo(event) {
            this.dialogUploadAnexo = event;
        },

        async onAnexoUploaded() {
            // Emitir evento para o componente pai recarregar os dados
            this.$emit('anexoUploaded');
        }
    }
};
</script>

<style scoped>
.card {
    padding: 2rem;
}

h1 {
    margin-bottom: 0;
    color: var(--text-color);
}

h2 {
    margin-bottom: 0;
    color: var(--text-color);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
}

.empty-icon {
    margin-bottom: 1rem;
}

.empty-content {
    max-width: 400px;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.empty-description {
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.mt-3 {
    margin-top: 0.75rem;
}
</style>
