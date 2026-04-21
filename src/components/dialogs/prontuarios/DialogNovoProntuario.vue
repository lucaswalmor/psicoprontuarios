<template>
    <Dialog :visible="visible" modal header="Novo Prontuário" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <InputText id="nome" :modelValue="paciente?.nome || ''" @update:modelValue="paciente.nome = $event" disabled class="w-full" />
                    <label for="nome">Nome do Paciente</label>
                </div>
            </div>
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <InputMask id="basic" :modelValue="prontuario.data_prontuario" @update:modelValue="prontuario.data_prontuario = $event" mask="99/99/9999" placeholder="00/00/0000" class="w-full" />
                    <label for="data_prontuario">Data do Prontuário</label>
                </div>
            </div>

            <!-- Métricas de Evolução (Opcionais) -->
            <div class="col-12 mt-4">
                <h6 class="text-500 font-semibold mb-3">Métricas de Evolução (Opcionais)</h6>
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="humor">Humor (1-10)</label>
                            <InputNumber 
                                id="humor"
                                :modelValue="prontuario.humor" 
                                @update:modelValue="validarValor('humor', $event, 1, 10)" 
                                :min="1" 
                                :max="10" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="avaliacao_progresso">Avaliação de Progresso (1-10)</label>
                            <InputNumber 
                                id="avaliacao_progresso"
                                :modelValue="prontuario.avaliacao_progresso" 
                                @update:modelValue="validarValor('avaliacao_progresso', $event, 1, 10)" 
                                :min="1" 
                                :max="10" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="escala_ansiedade">Escala de Ansiedade - GAD-7 (0-21)</label>
                            <InputNumber 
                                id="escala_ansiedade"
                                :modelValue="prontuario.escala_ansiedade" 
                                @update:modelValue="validarValor('escala_ansiedade', $event, 0, 21)" 
                                :min="0"
                                :max="21"
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="escala_depressao">Escala de Depressão - PHQ-9 (0-27)</label>
                            <InputNumber 
                                id="escala_depressao"
                                :modelValue="prontuario.escala_depressao" 
                                @update:modelValue="validarValor('escala_depressao', $event, 0, 27)" 
                                :min="0" 
                                :max="27" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 mt-2">
                <label class="block text-500 font-medium mb-2">Descrição *</label>
                <Message severity="warn" class="mb-3" :closable="false">
                    Por privacidade, não inclua o nome nem outros dados que identifiquem o paciente neste texto. Prefira expressões como "o paciente" ou "a pessoa atendida".
                </Message>

                <div v-if="previewMelhoriaIa" ref="refIaPreview" class="ia-preview">
                    <h6 class="ia-preview__title">Comparar com a sugestão da I.A.</h6>
                    <p class="ia-preview__hint">Revise os textos abaixo e escolha se deseja substituir o conteúdo do editor.</p>
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <span class="ia-preview__label">Seu texto (enviado)</span>
                            <div class="ia-preview__box">{{ previewMelhoriaIa.textoOriginal }}</div>
                        </div>
                        <div class="col-12 md:col-6">
                            <span class="ia-preview__label">Sugestão da I.A.</span>
                            <div class="ia-preview__box ia-preview__box--sugestao">{{ previewMelhoriaIa.textoSugerido }}</div>
                        </div>
                    </div>
                    <div class="ia-preview__actions">
                        <Button label="Manter o que digitei" severity="secondary" outlined @click="rejeitarMelhoriaIa" />
                        <Button label="Aceitar mudança" severity="success" @click="aceitarMelhoriaIa" />
                    </div>
                </div>

                <div class="editor-com-ia-wrap mt-3">
                    <Editor
                        :key="editorDescricaoKey"
                        :modelValue="prontuario.descricao"
                        @update:modelValue="prontuario.descricao = $event"
                        editorStyle="height: 320px"
                    />
                    <button
                        type="button"
                        class="editor-com-ia-fab"
                        :class="{ 'editor-com-ia-fab--locked': !isPlanoPro }"
                        :aria-disabled="!isPlanoPro"
                        :disabled="isPlanoPro && (melhorarIaLoading || !podeMelhorarTextoComIa || !!previewMelhoriaIa)"
                        :title="tituloBotaoMelhoriaIa"
                        @click="onClickMelhorarTextoIA"
                    >
                        <span v-if="melhorarIaLoading" class="editor-com-ia-fab__spinner" aria-hidden="true" />
                        <span class="editor-com-ia-fab__label">
                            {{ melhorarIaLoading ? 'Melhorando…' : 'Melhorar texto com I.A' }}
                        </span>
                        <Tag v-if="!isPlanoPro" value="PRO" severity="warning" class="editor-com-ia-fab__tag" />
                    </button>
                </div>
            </div>

            <div v-if="erroSalvar" class="col-12 mt-2">
                <Message severity="error" :closable="true" @close="erroSalvar = null">
                    {{ erroSalvar }}
                </Message>
            </div>

            <div class="col-12 mt-2 d-flex gap-2 justify-content-end">
                <Button label="Cancelar" severity="secondary" @click="onUpdateVisible(false)" />
                <Button label="Salvar" severity="success" @click="salvarProntuario" />
            </div>
        </div>
    </Dialog>

    <DialogPlanoPro :visible="dialogPlanoProVisible" @update:visible="dialogPlanoProVisible = $event" />
</template>
<script>
import DialogPlanoPro from '@/components/dialogs/DialogPlanoPro.vue';

const WEBHOOK_MELHORAR_TEXTO_IA =
    'https://petgre-n8n-petgre.irkqjy.easypanel.host/webhook/b43537a5-c313-485e-814f-d993f2d359dc';

const MIN_CARACTERES_MELHORIA_IA = 100;

export default {
    name: 'DialogNovoProntuario',
    components: {
        DialogPlanoPro,
        Dialog: () => import('primevue/dialog'),
        InputMask: () => import('primevue/inputmask'),
        InputText: () => import('primevue/inputtext'),
        InputNumber: () => import('primevue/inputnumber'),
        Editor: () => import('primevue/editor'),
        Button: () => import('primevue/button'),
        Message: () => import('primevue/message'),
        Tag: () => import('primevue/tag'),
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        paciente: {
            type: Object,
            default: null
        },
        pacienteId: {
            type: [String, Number],
            default: null
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.erroSalvar = null;
                this.previewMelhoriaIa = null;
            } else {
                this.previewMelhoriaIa = null;
            }
        },
    },
    computed: {
        isPlanoPro() {
            return ['pro', 'vitalicio'].includes(this.$planService.resolverTipoPlanoUsuario());
        },
        textoDescricaoPlano() {
            return this.extrairTextoPlano(this.prontuario?.descricao);
        },
        podeMelhorarTextoComIa() {
            return this.textoDescricaoPlano.length >= MIN_CARACTERES_MELHORIA_IA;
        },
        tituloBotaoMelhoriaIa() {
            if (this.melhorarIaLoading || this.previewMelhoriaIa) return '';
            if (!this.isPlanoPro) {
                return 'Disponível apenas no Plano Pro.';
            }
            if (!this.podeMelhorarTextoComIa) {
                return `É necessário pelo menos ${MIN_CARACTERES_MELHORIA_IA} caracteres na descrição para usar a melhoria por I.A.`;
            }
            return '';
        },
    },
    data() {
        return {
            erroSalvar: null,
            melhorarIaLoading: false,
            editorDescricaoKey: 0,
            previewMelhoriaIa: null,
            dialogPlanoProVisible: false,
            prontuario: {
                paciente: {},
                data_prontuario: new Date().toLocaleDateString('pt-BR'),
                descricao: '',
                humor: null,
                avaliacao_progresso: null,
                escala_ansiedade: null,
                escala_depressao: null,
            }
        }
    },
    methods: {
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible)
        },
        onClickMelhorarTextoIA() {
            if (!this.isPlanoPro) {
                this.dialogPlanoProVisible = true;
                return;
            }
            this.melhorarTextoIA();
        },
        validarValor(campo, valor, min, max) {
            // Se o valor for null ou undefined, permite (campo opcional)
            if (valor === null || valor === undefined) {
                this.prontuario[campo] = null;
                return;
            }
            
            // Converte para número
            const numValor = Number(valor);
            
            // Se não for um número válido, define como null
            if (isNaN(numValor)) {
                this.prontuario[campo] = null;
                return;
            }
            
            // Limita o valor entre min e max
            if (numValor < min) {
                this.prontuario[campo] = min;
            } else if (numValor > max) {
                this.prontuario[campo] = max;
            } else {
                this.prontuario[campo] = Math.round(numValor); // Garante que é inteiro
            }
        },
        extrairTextoPlano(html) {
            if (!html || typeof html !== 'string') return '';
            const div = document.createElement('div');
            div.innerHTML = html;
            return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
        },
        obterIdPsicologo() {
            try {
                const raw = sessionStorage.getItem('usuario');
                if (!raw) return null;
                const u = JSON.parse(raw);
                return u.id ?? null;
            } catch {
                return null;
            }
        },
        async melhorarTextoIA() {
            const mensagem = this.textoDescricaoPlano;
            if (!mensagem) return;
            if (mensagem.length < MIN_CARACTERES_MELHORIA_IA) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Texto curto demais',
                    detail: `Escreva pelo menos ${MIN_CARACTERES_MELHORIA_IA} caracteres na descrição para usar a melhoria por I.A.`,
                    life: 4000,
                });
                return;
            }

            const psicologo = this.obterIdPsicologo();
            if (psicologo == null) {
                alert('Erro ao melhorar texto');
                return;
            }

            this.melhorarIaLoading = true;
            try {
                const res = await fetch(WEBHOOK_MELHORAR_TEXTO_IA, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({ mensagem, psicologo }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const bodyText = await res.text();
                let data;
                try {
                    data = bodyText ? JSON.parse(bodyText) : null;
                } catch (parseErr) {
                    console.error(parseErr);
                    throw new Error('Resposta não é JSON válido');
                }
                const texto = this.normalizarMensagemMelhoradaIa(data);
                if (!texto) throw new Error('Resposta inválida');
                const html = this.descricaoMelhoradaParaEditor(texto);
                this.previewMelhoriaIa = {
                    textoOriginal: mensagem,
                    textoSugerido: texto,
                    htmlSugerido: html,
                };
                this.$nextTick(() => {
                    try {
                        const el = this.$refs.refIaPreview;
                        const node = Array.isArray(el) ? el[0] : el;
                        node?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
                    } catch (scrollErr) {
                        console.warn(scrollErr);
                    }
                });
            } catch (e) {
                console.error(e);
                alert('Erro ao melhorar texto');
            } finally {
                this.melhorarIaLoading = false;
            }
        },
        aceitarMelhoriaIa() {
            if (!this.previewMelhoriaIa) return;
            this.prontuario.descricao = this.previewMelhoriaIa.htmlSugerido;
            this.editorDescricaoKey += 1;
            this.previewMelhoriaIa = null;
        },
        rejeitarMelhoriaIa() {
            this.previewMelhoriaIa = null;
        },
        normalizarPayloadRespostaN8n(data) {
            if (data == null) return null;
            if (Array.isArray(data)) {
                return data.length ? data[0] : null;
            }
            if (typeof data === 'object') {
                return data;
            }
            return null;
        },
        normalizarMensagemMelhoradaIa(data) {
            const payload = this.normalizarPayloadRespostaN8n(data) ?? data;
            let raw = payload?.mensagem;
            if (raw == null) return null;
            if (typeof raw === 'object' && raw !== null && typeof raw.mensagem === 'string') {
                raw = raw.mensagem;
            }
            if (typeof raw === 'number' || typeof raw === 'boolean') {
                raw = String(raw);
            }
            if (typeof raw !== 'string') return null;

            let s = raw.trim();
            if (!s) return null;

            const fence = s.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/im);
            if (fence) {
                s = fence[1].trim();
            }

            try {
                const parsed = JSON.parse(s);
                if (typeof parsed === 'string' && parsed.trim()) {
                    return parsed.trim();
                }
                if (parsed && typeof parsed.mensagem === 'string' && parsed.mensagem.trim()) {
                    return parsed.mensagem.trim();
                }
            } catch {
                /* não é JSON */
            }

            return raw.trim();
        },
        descricaoMelhoradaParaEditor(texto) {
            if (texto.includes('<') && texto.includes('>')) {
                return texto;
            }
            const esc = (s) =>
                s
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            return `<p>${esc(texto).split(/\n+/).filter(Boolean).join('</p><p>')}</p>`;
        },
        mensagemErroApi(err) {
            const data = err.response?.data;
            if (data && typeof data.error === 'string') {
                return data.error;
            }
            if (data && typeof data.message === 'string') {
                return data.message;
            }
            return 'Não foi possível salvar. Verifique os dados e tente novamente.';
        },
        salvarProntuario() {
            this.erroSalvar = null;

            // Usar pacienteId da prop ou do paciente.id
            const pacienteId = this.pacienteId || (this.paciente && this.paciente.id);
            
            if (!pacienteId) {
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "ID do paciente não encontrado",
                    life: 3000,
                });
                return;
            }

            // Garantir que o paciente tenha o id para o backend
            const pacienteComId = {
                ...this.paciente,
                id: pacienteId
            };

            const data = {
                paciente: pacienteComId,
                data_prontuario: this.prontuario.data_prontuario,
                descricao: this.prontuario.descricao,
                humor: this.prontuario.humor !== null && this.prontuario.humor !== undefined ? this.prontuario.humor : null,
                avaliacao_progresso: this.prontuario.avaliacao_progresso !== null && this.prontuario.avaliacao_progresso !== undefined ? this.prontuario.avaliacao_progresso : null,
                escala_ansiedade: this.prontuario.escala_ansiedade !== null && this.prontuario.escala_ansiedade !== undefined ? this.prontuario.escala_ansiedade : null,
                escala_depressao: this.prontuario.escala_depressao !== null && this.prontuario.escala_depressao !== undefined ? this.prontuario.escala_depressao : null,
            }

            this.$prontuariosService.create(data).then((res) => {
                this.erroSalvar = null;
                this.previewMelhoriaIa = null;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso ao cadastrar!",
                    detail: `Prontuario do paciente ${this.paciente.nome} criado com sucesso!`,
                    life: 3000,
                });

                this.prontuario = {
                    paciente: {},
                    data_prontuario: new Date().toLocaleDateString('pt-BR'),
                    descricao: '',
                    humor: null,
                    avaliacao_progresso: null,
                    escala_ansiedade: null,
                    escala_depressao: null,
                }
                
                this.$emit('salvarProntuario');
                this.onUpdateVisible(false);
            }).catch((err) => {
                console.log(err);
                this.erroSalvar = this.mensagemErroApi(err);
            });
        }
    },
}
</script>
<style scoped>
.editor-com-ia-wrap {
    position: relative;
    isolation: isolate;
    transform: translateZ(0);
}

.editor-com-ia-fab {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 1100;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.65rem 1.1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
    border-radius: 9999px;
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.35);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.editor-com-ia-fab:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(79, 70, 229, 0.42);
}

.editor-com-ia-fab:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.editor-com-ia-fab__label {
    white-space: nowrap;
}

.editor-com-ia-fab__tag {
    margin-left: 0.25rem;
    font-size: 0.7rem;
    padding: 0.125rem 0.45rem;
    font-weight: 800;
    letter-spacing: 0.04em;
}

.editor-com-ia-fab--locked {
    opacity: 0.88;
    cursor: pointer;
}

.editor-com-ia-fab--locked:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(79, 70, 229, 0.42);
}

.editor-com-ia-fab__spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: editor-ia-spin 0.7s linear infinite;
}

@keyframes editor-ia-spin {
    to {
        transform: rotate(360deg);
    }
}

.ia-preview {
    padding: 1rem 1.1rem;
    border-radius: 12px;
    border: 1px solid var(--p-content-border-color, #e5e7eb);
    background: var(--p-content-background, #f9fafb);
}

.ia-preview__title {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-text-color, #111827);
}

.ia-preview__hint {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    color: var(--p-text-muted-color, #6b7280);
    line-height: 1.45;
}

.ia-preview__label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: var(--p-text-muted-color, #6b7280);
    margin-bottom: 0.35rem;
}

.ia-preview__box {
    min-height: 6rem;
    max-height: 14rem;
    overflow: auto;
    padding: 0.75rem 0.85rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--p-text-color, #374151);
    background: #fff;
    border: 1px solid var(--p-content-border-color, #e5e7eb);
    border-radius: 8px;
    white-space: pre-wrap;
    word-break: break-word;
}

.ia-preview__box--sugestao {
    border-color: rgba(79, 70, 229, 0.35);
    background: linear-gradient(180deg, #fafaff 0%, #fff 100%);
}

.ia-preview__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--p-content-border-color, #e5e7eb);
}
</style>