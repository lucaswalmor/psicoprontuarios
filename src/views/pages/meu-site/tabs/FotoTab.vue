<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-1">
            <div>
                <h6 class="m-0">Foto de Perfil</h6>
                <small class="text-color-secondary">Esta foto aparece na sua landing page no lugar das iniciais.</small>
            </div>
            <Button label="Salvar foto" icon="pi pi-check" :loading="salvando" :disabled="!arquivoSelecionado" @click="salvar" />
        </div>

        <Divider />

        <div class="grid">
            <!-- Preview -->
            <div class="col-12 md:col-4 flex flex-column align-items-center gap-3">
                <div class="foto-preview" :class="{ 'tem-foto': previewUrl }">
                    <img v-if="previewUrl" :src="previewUrl" alt="Foto de perfil" class="foto-img" />
                    <div v-else class="foto-placeholder">
                        <i class="pi pi-user" style="font-size: 3rem; color: var(--surface-400)" />
                        <span class="text-color-secondary text-sm mt-2">Sem foto</span>
                    </div>
                </div>

                <Button
                    v-if="fotoAtual && !arquivoSelecionado"
                    label="Remover foto"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    size="small"
                    :loading="removendo"
                    @click="remover"
                />
            </div>

            <!-- Upload -->
            <div class="col-12 md:col-8 flex flex-column gap-3">
                <!-- Área de drop -->
                <div
                    class="upload-area"
                    :class="{ 'drag-over': isDragging }"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="onDrop"
                    @click="$refs.inputFile.click()"
                >
                    <i class="pi pi-cloud-upload" style="font-size: 2rem; color: var(--surface-400)" />
                    <p class="m-0 mt-2 font-medium">Clique ou arraste sua foto aqui</p>
                    <small class="text-color-secondary">JPG, PNG ou WebP · Máximo 5 MB</small>
                </div>

                <input
                    ref="inputFile"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    style="display: none"
                    @change="onFileChange"
                />

                <!-- Info do arquivo selecionado -->
                <div v-if="arquivoSelecionado" class="arquivo-info flex align-items-center gap-2 p-3 border-round surface-100">
                    <i class="pi pi-image text-primary" />
                    <div class="flex-1">
                        <div class="font-medium text-sm">{{ arquivoSelecionado.name }}</div>
                        <small class="text-color-secondary">{{ tamanhoFormatado }}</small>
                    </div>
                    <Button icon="pi pi-times" text rounded severity="secondary" size="small" @click="limparSelecao" />
                </div>

                <Message v-if="erro" severity="error" :closable="false">{{ erro }}</Message>
                <Message v-if="sucesso" severity="success" :closable="false">{{ sucesso }}</Message>
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Message from 'primevue/message';

const MAX_SIZE_MB = 5;

export default {
    name: 'FotoTab',
    components: { Button, Divider, Message },

    props: {
        dados: {
            type: Object,
            default: () => ({}),
        },
    },

    emits: ['salvo'],

    data() {
        return {
            arquivoSelecionado: null,
            previewUrl:         null,
            fotoAtual:          null,
            isDragging:         false,
            salvando:           false,
            removendo:          false,
            erro:               null,
            sucesso:            null,
        };
    },

    computed: {
        tamanhoFormatado() {
            if (!this.arquivoSelecionado) return '';
            const kb = this.arquivoSelecionado.size / 1024;
            return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
        },
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (val?.foto_url) {
                    this.fotoAtual  = val.foto_url;
                    this.previewUrl = val.foto_url;
                }
            },
        },
    },

    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) this.selecionarArquivo(file);
        },

        onDrop(event) {
            this.isDragging = false;
            const file = event.dataTransfer.files[0];
            if (file) this.selecionarArquivo(file);
        },

        selecionarArquivo(file) {
            this.erro    = null;
            this.sucesso = null;

            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                this.erro = `A imagem deve ter no máximo ${MAX_SIZE_MB} MB.`;
                return;
            }

            const tipos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!tipos.includes(file.type)) {
                this.erro = 'Formato não permitido. Use JPG, PNG, GIF ou WebP.';
                return;
            }

            this.arquivoSelecionado = file;
            this.previewUrl = URL.createObjectURL(file);
        },

        limparSelecao() {
            this.arquivoSelecionado = null;
            this.previewUrl = this.fotoAtual || null;
            this.$refs.inputFile.value = '';
            this.erro    = null;
            this.sucesso = null;
        },

        async salvar() {
            if (!this.arquivoSelecionado) return;
            this.salvando = true;
            this.erro     = null;
            this.sucesso  = null;
            try {
                const res = await meuSiteService.uploadFoto(this.arquivoSelecionado);
                this.fotoAtual  = res.foto_url;
                this.previewUrl = res.foto_url;
                this.sucesso    = 'Foto atualizada com sucesso!';
                this.arquivoSelecionado = null;
                this.$emit('salvo', { foto_url: res.foto_url });
            } catch (e) {
                this.erro = e?.response?.data?.message || 'Erro ao salvar a foto.';
            } finally {
                this.salvando = false;
            }
        },

        async remover() {
            this.removendo = true;
            this.erro      = null;
            this.sucesso   = null;
            try {
                await meuSiteService.deleteFoto();
                this.fotoAtual  = null;
                this.previewUrl = null;
                this.sucesso    = 'Foto removida com sucesso.';
                this.$emit('salvo', { foto_url: null });
            } catch (e) {
                this.erro = e?.response?.data?.message || 'Erro ao remover a foto.';
            } finally {
                this.removendo = false;
            }
        },
    },
};
</script>

<style scoped>
.foto-preview {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 2px dashed var(--surface-300);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--surface-50);
}
.foto-preview.tem-foto {
    border-style: solid;
    border-color: var(--primary-color);
}
.foto-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.foto-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.upload-area {
    border: 2px dashed var(--surface-300);
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: var(--surface-50);
}
.upload-area:hover,
.upload-area.drag-over {
    border-color: var(--primary-color);
    background: var(--primary-50, #f0f9ff);
}
</style>
