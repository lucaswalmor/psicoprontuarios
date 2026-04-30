<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Aparência</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">
                    Cores por seção da landing pública (cabeçalho, hero, CTA, contato, etc.).
                </p>
            </div>
            <Button
                data-tour="tour-meusite-apar-salvar"
                label="Salvar cores"
                icon="pi pi-check"
                :loading="salvando"
                @click="salvar"
            />
        </div>

        <Divider />

        <div class="grid mt-3">
            <div class="col-12 xl:col-7">
                <div
                    v-for="(grupo, idx) in gruposCores"
                    :key="grupo.titulo"
                    :class="{ 'mt-3': idx > 0 }"
                >
                    <Divider v-if="idx > 0" class="mb-3" />
                    <div class="text-xs font-semibold text-color-secondary uppercase letter-spacing-1 mb-3">
                        {{ grupo.titulo }}
                    </div>
                    <div class="grid">
                        <div
                            class="col-12 md:col-6 xl:col-4"
                            v-for="cor in grupo.campos"
                            :key="cor.campo"
                            :data-tour="'tour-meusite-apar-' + cor.campo"
                        >
                            <div class="field">
                                <label class="font-medium text-sm block mb-1">{{ cor.label }}</label>
                                <p class="text-color-secondary text-xs m-0 mb-2">{{ cor.descricao }}</p>
                                <div class="flex align-items-center gap-2 color-row">
                                    <input
                                        type="color"
                                        :value="form[cor.campo]"
                                        @input="form[cor.campo] = $event.target.value"
                                        class="color-picker"
                                    />
                                    <InputText
                                        v-model="form[cor.campo]"
                                        :placeholder="cor.padrao"
                                        class="flex-1 font-mono text-sm color-hex"
                                        maxlength="7"
                                    />
                                    <div
                                        class="color-preview border-round"
                                        :style="{ background: form[cor.campo] }"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 xl:col-5">
                <div class="preview-card surface-card border-1 border-round surface-border overflow-hidden" data-tour="tour-meusite-apar-preview">
                    <div class="flex align-items-center justify-content-between px-3 py-2 border-bottom-1 surface-border">
                        <span class="font-medium text-sm">Pré-visualização do site</span>
                        <Button
                            v-if="urlPreviewSite"
                            data-tour="tour-meusite-apar-refresh"
                            type="button"
                            icon="pi pi-refresh"
                            severity="secondary"
                            text
                            rounded
                            title="Recarregar pré-visualização"
                            :disabled="salvando"
                            @click="atualizarIframe"
                        />
                    </div>
                    <div v-if="!urlPreviewSite" class="p-4 text-center text-color-secondary text-sm">
                        Defina um slug em <strong>Geral</strong> e salve para ver o site aqui.
                    </div>
                    <div v-else class="preview-frame-wrap">
                        <iframe
                            :key="iframeKey"
                            :src="iframeSrc"
                            class="preview-iframe"
                            title="Pré-visualização do site público"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';

function buildFormDefaults() {
    const grupos = [
        {
            titulo: 'Página',
            campos: [
                {
                    campo: 'page_background_color',
                    label: 'Fundo geral',
                    descricao: 'Cor base atrás de todo o conteúdo.',
                    padrao: '#FFFFFF',
                },
            ],
        },
        {
            titulo: 'Cabeçalho (menu)',
            campos: [
                { campo: 'header_section_text_color', label: 'Texto do menu', descricao: 'Logo e links.', padrao: '#1E1B4B' },
                { campo: 'header_section_background_color', label: 'Fundo do menu', descricao: 'Barra fixa superior.', padrao: '#FFFFFF' },
                { campo: 'header_section_button_background_color', label: 'Fundo do botão', descricao: 'CTA “Agendar consulta”.', padrao: '#7C3AED' },
                { campo: 'header_section_button_text_color', label: 'Texto do botão', descricao: 'Texto sobre o botão do menu.', padrao: '#FFFFFF' },
                { campo: 'header_section_border_color', label: 'Linha inferior', descricao: 'Borda sob o menu.', padrao: '#E9D5FF' },
            ],
        },
        {
            titulo: 'Hero (primeira dobra)',
            campos: [
                { campo: 'hero_section_text_color', label: 'Título principal', descricao: 'Cor do H1 e texto principal.', padrao: '#1E1B4B' },
                { campo: 'hero_section_background_color', label: 'Fundo da seção', descricao: '', padrao: '#FFFFFF' },
                { campo: 'hero_section_accent_color', label: 'Destaques', descricao: 'Eyebrow, ênfase no título, fotos.', padrao: '#7C3AED' },
                { campo: 'hero_section_muted_text_color', label: 'Texto secundário', descricao: 'Subtítulo e descrição.', padrao: '#57534E' },
                { campo: 'hero_section_primary_button_background_color', label: 'Botão principal — fundo', descricao: '', padrao: '#7C3AED' },
                { campo: 'hero_section_primary_button_text_color', label: 'Botão principal — texto', descricao: '', padrao: '#FFFFFF' },
                { campo: 'hero_section_secondary_button_border_color', label: 'Botão secundário — borda', descricao: '“Conhecer mais”.', padrao: '#D8B4FE' },
                { campo: 'hero_section_secondary_button_text_color', label: 'Botão secundário — texto', descricao: '', padrao: '#1E1B4B' },
                { campo: 'hero_section_photo_gradient_start_color', label: 'Foto — gradiente (início)', descricao: 'Placeholders sem foto.', padrao: '#EDE9FE' },
                { campo: 'hero_section_photo_gradient_end_color', label: 'Foto — gradiente (fim)', descricao: '', padrao: '#DDD6FE' },
                { campo: 'hero_section_badge_background_color', label: 'Badge tipo atendimento — fundo', descricao: '', padrao: '#7C3AED' },
                { campo: 'hero_section_badge_text_color', label: 'Badge tipo atendimento — texto', descricao: '', padrao: '#FFFFFF' },
            ],
        },
        {
            titulo: 'Sobre mim',
            campos: [
                { campo: 'sobre_section_text_color', label: 'Títulos e texto', descricao: '', padrao: '#1E1B4B' },
                { campo: 'sobre_section_background_color', label: 'Fundo da seção', descricao: '', padrao: '#F5F3FF' },
                { campo: 'sobre_section_accent_color', label: 'Destaques', descricao: 'Rótulo “Sobre mim” e ênfases.', padrao: '#7C3AED' },
                { campo: 'sobre_section_body_muted_color', label: 'Biografia', descricao: 'Parágrafos e chips.', padrao: '#44403C' },
                { campo: 'sobre_section_photo_gradient_start_color', label: 'Foto — gradiente (início)', descricao: '', padrao: '#EDE9FE' },
                { campo: 'sobre_section_photo_gradient_end_color', label: 'Foto — gradiente (fim)', descricao: '', padrao: '#E9D5FF' },
                { campo: 'sobre_section_chip_background_color', label: 'Chips — fundo', descricao: '', padrao: '#FFFFFF' },
                { campo: 'sobre_section_chip_border_color', label: 'Chips — borda', descricao: '', padrao: '#E9D5FF' },
            ],
        },
        {
            titulo: 'Especialidades',
            campos: [
                { campo: 'especialidades_section_text_color', label: 'Títulos', descricao: '', padrao: '#1E1B4B' },
                { campo: 'especialidades_section_background_color', label: 'Fundo da seção', descricao: '', padrao: '#FFFFFF' },
                { campo: 'especialidades_section_accent_color', label: 'Destaques', descricao: 'Ênfase no título e ícones.', padrao: '#7C3AED' },
                { campo: 'especialidades_section_description_color', label: 'Descrição', descricao: 'Parágrafo introdutório.', padrao: '#57534E' },
                { campo: 'especialidades_section_card_background_color', label: 'Cards — fundo', descricao: '', padrao: '#FFFFFF' },
                { campo: 'especialidades_section_card_border_color', label: 'Cards — borda', descricao: '', padrao: '#E9D5FF' },
            ],
        },
        {
            titulo: 'Como funciona',
            campos: [
                { campo: 'como_funciona_section_text_color', label: 'Títulos', descricao: '', padrao: '#1E1B4B' },
                { campo: 'como_funciona_section_background_color', label: 'Fundo da seção', descricao: '', padrao: '#EDE9FE' },
                { campo: 'como_funciona_section_accent_color', label: 'Destaques', descricao: 'Números e detalhes.', padrao: '#7C3AED' },
                { campo: 'como_funciona_section_grid_border_color', label: 'Grade entre cards', descricao: '', padrao: '#DDD6FE' },
                { campo: 'como_funciona_section_card_background_color', label: 'Cards — fundo', descricao: '', padrao: '#FFFFFF' },
                { campo: 'como_funciona_section_step_muted_color', label: 'Texto dos passos', descricao: 'Descrições dos cards.', padrao: '#57534E' },
            ],
        },
        {
            titulo: 'Benefícios',
            campos: [
                { campo: 'beneficios_section_background_color', label: 'Fundo da seção', descricao: '', padrao: '#1E1B4B' },
                { campo: 'beneficios_section_label_color', label: 'Rótulo da seção', descricao: '“Por que fazer terapia”.', padrao: '#C4B5FD' },
                { campo: 'beneficios_section_heading_text_color', label: 'Título principal', descricao: '', padrao: '#FFFFFF' },
                { campo: 'beneficios_section_heading_em_color', label: 'Ênfase no título', descricao: 'Texto em itálico.', padrao: '#C4B5FD' },
                { campo: 'beneficios_section_quote_text_color', label: 'Citação', descricao: 'Bloco em itálico à esquerda.', padrao: '#A8A29E' },
                { campo: 'beneficios_section_quote_border_color', label: 'Borda da citação', descricao: '', padrao: '#7C3AED' },
                { campo: 'beneficios_section_item_title_color', label: 'Título de cada item', descricao: '', padrao: '#FFFFFF' },
                { campo: 'beneficios_section_item_text_color', label: 'Texto de cada item', descricao: '', padrao: '#A8A29E' },
                { campo: 'beneficios_section_icon_background_color', label: 'Fundo do ícone', descricao: '', padrao: '#4C1D95' },
            ],
        },
        {
            titulo: 'CTA (próximo passo)',
            campos: [
                { campo: 'cta_section_background_gradient_start_color', label: 'Fundo — gradiente (início)', descricao: '', padrao: '#7C3AED' },
                { campo: 'cta_section_background_gradient_end_color', label: 'Fundo — gradiente (fim)', descricao: '', padrao: '#5B21B6' },
                { campo: 'cta_section_heading_text_color', label: 'Título', descricao: '', padrao: '#FFFFFF' },
                { campo: 'cta_section_body_text_color', label: 'Subtítulo', descricao: '', padrao: '#E9D5FF' },
                { campo: 'cta_section_label_text_color', label: '“Próximo passo”', descricao: 'Linha e texto acima do título.', padrao: '#DDD6FE' },
                { campo: 'cta_section_button_background_color', label: 'Botão WhatsApp — fundo', descricao: '', padrao: '#FFFFFF' },
                { campo: 'cta_section_button_text_color', label: 'Botão WhatsApp — texto', descricao: '', padrao: '#5B21B6' },
            ],
        },
        {
            titulo: 'Contato',
            campos: [
                { campo: 'contato_section_background_color', label: 'Fundo da seção', descricao: '', padrao: '#FAF5FF' },
                { campo: 'contato_section_text_color', label: 'Títulos e valores', descricao: '', padrao: '#1E1B4B' },
                { campo: 'contato_section_accent_color', label: 'Destaques', descricao: 'Rótulos e ícones.', padrao: '#7C3AED' },
                { campo: 'contato_section_description_color', label: 'Parágrafo introdutório', descricao: '', padrao: '#57534E' },
                { campo: 'contato_section_card_background_color', label: 'Card horários — fundo', descricao: '', padrao: '#FFFFFF' },
                { campo: 'contato_section_card_border_color', label: 'Card horários — borda', descricao: '', padrao: '#E9D5FF' },
                { campo: 'contato_section_icon_background_color', label: 'Ícones de contato — fundo', descricao: '', padrao: '#EDE9FE' },
                { campo: 'contato_section_map_background_color', label: 'Área do mapa / endereço', descricao: '', padrao: '#EDE9FE' },
            ],
        },
        {
            titulo: 'Rodapé',
            campos: [
                { campo: 'footer_section_background_color', label: 'Fundo', descricao: '', padrao: '#1E1B4B' },
                { campo: 'footer_section_text_color', label: 'Texto secundário', descricao: 'Linhas legais e copyright.', padrao: '#A8A29E' },
                { campo: 'footer_section_accent_color', label: 'CRP e destaques', descricao: '', padrao: '#C4B5FD' },
                { campo: 'footer_section_name_color', label: 'Nome do psicólogo', descricao: '', padrao: '#F5F3FF' },
            ],
        },
    ];

    const form = {};
    grupos.forEach((g) => {
        g.campos.forEach((c) => {
            form[c.campo] = c.padrao;
        });
    });

    return { grupos, form };
}

const { grupos: GRUPOS_PADRAO, form: FORM_PADRAO } = buildFormDefaults();

export default {
    name: 'AparenciaTab',
    components: { Button, Divider, InputText },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            salvando: false,
            iframeKey: 0,
            gruposCores: GRUPOS_PADRAO,
            form: { ...FORM_PADRAO },
        };
    },

    computed: {
        urlPreviewSite() {
            const slug = this.dados?.slug?.trim();
            if (!slug) return '';
            return `https://${slug}.psicoprontuarios.com.br/`;
        },
        iframeSrc() {
            if (!this.urlPreviewSite) return '';
            const bust = `_pv=${this.iframeKey}`;
            const sep = this.urlPreviewSite.includes('?') ? '&' : '?';
            return `${this.urlPreviewSite}${sep}${bust}`;
        },
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (!val) return;
                Object.keys(this.form).forEach((campo) => {
                    if (val[campo]) this.form[campo] = val[campo];
                });
            },
        },
    },

    methods: {
        atualizarIframe() {
            this.iframeKey += 1;
        },

        async salvar() {
            try {
                this.salvando = true;
                await meuSiteService.updateCores(this.form);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Cores atualizadas com sucesso.', life: 3000 });
                this.$emit('salvo', this.form);
                this.atualizarIframe();
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar as cores.', life: 4000 });
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>

<style scoped>
.color-picker {
    width: 40px;
    height: 40px;
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    padding: 2px;
    cursor: pointer;
    background: transparent;
    flex-shrink: 0;
}

.color-preview {
    width: 36px;
    height: 36px;
    border: 1px solid var(--surface-border);
    flex-shrink: 0;
}

.color-row {
    min-width: 0;
    flex-wrap: wrap;
}

.color-hex {
    min-width: 8.5rem;
    flex: 1 1 9.5rem;
}

.preview-card {
    min-width: 0;
}

.preview-frame-wrap {
    position: relative;
    width: 100%;
    min-height: 420px;
    height: min(70vh, 720px);
    background: var(--surface-ground);
}

.preview-iframe {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 420px;
    border: 0;
}
</style>
