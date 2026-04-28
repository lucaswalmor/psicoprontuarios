<template>
    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        :header="isEdicao ? 'Editar Notificação' : 'Nova Notificação'"
        :style="{ width: '640px' }"
    >
        <div class="p-2">
            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Data Comemorativa</label>
                <Select
                    v-model="form.data_comemorativa_id"
                    :options="datasDisponiveis"
                    optionLabel="nomeExibicao"
                    optionValue="id"
                    placeholder="Selecione uma data comemorativa"
                    class="w-full"
                    :disabled="isEdicao || loadingDados"
                />
            </div>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Mensagem</label>
                <Textarea
                    v-model="form.mensagem"
                    rows="5"
                    maxlength="500"
                    autoResize
                    class="w-full"
                />
                <div class="ia-row">
                    <small class="text-600">{{ (form.mensagem || '').length }}/500</small>
                    <button
                        type="button"
                        class="ia-btn"
                        :disabled="iaLoading || !form.data_comemorativa_id || iaBloqueado"
                        :title="iaTooltip"
                        @click="gerarMensagemComIa"
                    >
                        <span v-if="iaLoading" class="ia-btn__spinner" aria-hidden="true" />
                        <span class="ia-btn__label">
                            {{ iaLoading ? 'Gerando…' : (mensagemVazia ? 'Criar com I.A' : 'Melhorar com I.A') }}
                        </span>
                    </button>
                </div>
            </div>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Pacientes</label>
                <MultiSelect
                    v-model="form.pacientes_ids"
                    :options="pacientesDisponiveis"
                    optionLabel="nome"
                    optionValue="id"
                    placeholder="Selecionar pacientes"
                    class="w-full"
                    filter
                    :loading="loadingDados"
                />
            </div>

            <div class="field flex align-items-center gap-2">
                <InputSwitch v-model="form.ativo" inputId="ativo_mensagem_comemorativa" />
                <label for="ativo_mensagem_comemorativa" class="m-0">Ativo</label>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="$emit('update:visible', false)" :disabled="saving" />
                <Button label="Salvar" icon="pi pi-save" @click="salvar" :loading="saving" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import mensagemComemorativaService from '@/services/mensagemComemorativaService';

const WEBHOOK_IA_DATAS_COMEMORATIVAS =
    'https://petgre-n8n-petgre.irkqjy.easypanel.host/webhook/datas-comemorativas';

const IA_COOLDOWN_MS = 60 * 1000;
const IA_JANELA_MS = 10 * 60 * 1000;
const IA_LIMITE_JANELA = 3;
const LS_KEY_IA_DATAS_COMEMORATIVAS = 'psico_prontuario_ia_datas_comemorativas_v1';

export default {
    name: 'DialogMensagemComemorativa',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        mensagem: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:visible', 'salvo'],
    data() {
        return {
            loadingDados: false,
            saving: false,
            iaLoading: false,
            iaNow: Date.now(),
            iaTickTimer: null,
            datasDisponiveis: [],
            pacientesDisponiveis: [],
            form: {
                data_comemorativa_id: null,
                mensagem: '',
                pacientes_ids: [],
                ativo: true,
            },
        };
    },
    computed: {
        isEdicao() {
            return !!this.mensagem;
        },
        mensagemVazia() {
            return !String(this.form.mensagem || '').trim();
        },
        dataComemorativaSelecionada() {
            const id = this.form.data_comemorativa_id;
            if (!id) return null;
            return (this.datasDisponiveis || []).find((d) => d.id === id) || null;
        },
        /**
         * Envia um identificador estável para o n8n.
         * Preferimos chaves semânticas (ex.: "ano_novo") quando existir.
         */
        dataComemorativaTipo() {
            const d = this.dataComemorativaSelecionada;
            if (!d) return null;
            return (
                d.tipo ??
                d.chave ??
                d.codigo ??
                d.slug ??
                d.identificador ??
                d.nome ??
                d.id ??
                null
            );
        },
        iaState() {
            return this.lerIaState();
        },
        iaBloqueado() {
            const now = this.iaNow || Date.now();
            const { cooldownUntil, history } = this.iaState;
            if (cooldownUntil && now < cooldownUntil) return true;
            const jan = this.filtrarJanela(history, now);
            return jan.length >= IA_LIMITE_JANELA;
        },
        iaTooltip() {
            if (this.iaLoading) return '';
            if (!this.form.data_comemorativa_id) return 'Selecione uma data comemorativa para usar a I.A.';

            const now = this.iaNow || Date.now();
            const { cooldownUntil, history } = this.iaState;

            if (cooldownUntil && now < cooldownUntil) {
                const s = Math.ceil((cooldownUntil - now) / 1000);
                return `Aguarde ${s}s para gerar novamente.`;
            }

            const jan = this.filtrarJanela(history, now);
            if (jan.length >= IA_LIMITE_JANELA) {
                const oldest = Math.min(...jan);
                const waitMs = oldest + IA_JANELA_MS - now;
                const s = Math.max(1, Math.ceil(waitMs / 1000));
                return `Limite de ${IA_LIMITE_JANELA} gerações a cada 10 minutos. Aguarde ${s}s para tentar novamente.`;
            }

            return '';
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.inicializarDialog();
                    this.iniciarTickerIa();
                }
                if (!newValue) {
                    this.pararTickerIa();
                }
            },
        },
        mensagem: {
            immediate: true,
            handler() {
                if (this.visible) {
                    this.preencherFormulario();
                }
            },
        },
    },
    beforeUnmount() {
        this.pararTickerIa();
    },
    methods: {
        iniciarTickerIa() {
            this.pararTickerIa();
            this.iaNow = Date.now();
            this.iaTickTimer = setInterval(() => {
                this.iaNow = Date.now();
            }, 500);
        },
        pararTickerIa() {
            if (this.iaTickTimer) {
                clearInterval(this.iaTickTimer);
                this.iaTickTimer = null;
            }
        },
        lerIaState() {
            try {
                const raw = localStorage.getItem(LS_KEY_IA_DATAS_COMEMORATIVAS);
                const parsed = raw ? JSON.parse(raw) : null;
                const cooldownUntil = Number(parsed?.cooldownUntil) || 0;
                const history = Array.isArray(parsed?.history)
                    ? parsed.history.map((t) => Number(t)).filter((t) => Number.isFinite(t) && t > 0)
                    : [];
                return { cooldownUntil, history };
            } catch {
                return { cooldownUntil: 0, history: [] };
            }
        },
        salvarIaState(next) {
            try {
                localStorage.setItem(
                    LS_KEY_IA_DATAS_COMEMORATIVAS,
                    JSON.stringify({
                        cooldownUntil: Number(next?.cooldownUntil) || 0,
                        history: Array.isArray(next?.history) ? next.history : [],
                    })
                );
            } catch {
                /* ignore */
            }
        },
        filtrarJanela(history, now) {
            const list = Array.isArray(history) ? history : [];
            const lim = now - IA_JANELA_MS;
            return list.filter((t) => Number.isFinite(t) && t >= lim && t <= now);
        },
        normalizarPayloadRespostaN8n(data) {
            if (data == null) return null;
            if (Array.isArray(data)) return data.length ? data[0] : null;
            if (typeof data === 'object') return data;
            return null;
        },
        normalizarMensagemIa(data) {
            const payload = this.normalizarPayloadRespostaN8n(data) ?? data;
            let raw = payload?.mensagem ?? payload?.message ?? payload?.texto;
            if (raw == null) return null;
            if (typeof raw === 'number' || typeof raw === 'boolean') raw = String(raw);
            if (typeof raw !== 'string') return null;

            let s = raw.trim();
            if (!s) return null;

            const fence = s.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/im);
            if (fence) s = fence[1].trim();

            try {
                const parsed = JSON.parse(s);
                if (typeof parsed === 'string' && parsed.trim()) return parsed.trim();
                if (parsed && typeof parsed.mensagem === 'string' && parsed.mensagem.trim()) return parsed.mensagem.trim();
            } catch {
                /* não é JSON */
            }

            return raw.trim();
        },
        async gerarMensagemComIa() {
            if (this.iaLoading) return;
            if (!this.form.data_comemorativa_id) {
                this.showToast('warn', 'Atenção', 'Selecione uma data comemorativa para usar a I.A.');
                return;
            }

            const now = Date.now();
            const state = this.lerIaState();
            const jan = this.filtrarJanela(state.history, now);

            if (state.cooldownUntil && now < state.cooldownUntil) {
                const s = Math.ceil((state.cooldownUntil - now) / 1000);
                this.showToast('warn', 'Aguarde', `Você poderá gerar novamente em ${s}s.`);
                return;
            }

            if (jan.length >= IA_LIMITE_JANELA) {
                const oldest = Math.min(...jan);
                const waitMs = oldest + IA_JANELA_MS - now;
                const s = Math.max(1, Math.ceil(waitMs / 1000));
                this.showToast('warn', 'Limite atingido', `Você atingiu o limite de ${IA_LIMITE_JANELA} gerações em 10 minutos. Aguarde ${s}s.`);
                return;
            }

            const tipo = this.dataComemorativaTipo;
            if (!tipo) {
                this.showToast('error', 'Erro', 'Não foi possível identificar a data comemorativa selecionada.');
                return;
            }

            const psicologo = this.$psicologoService?.obterIdPsicologo?.();
            if (psicologo == null) {
                this.showToast('error', 'Erro', 'Não foi possível identificar o psicólogo logado.');
                return;
            }

            this.iaLoading = true;
            try {
                const payload = {
                    mensagem: String(this.form.mensagem || ''),
                    data_comemorativa: tipo,
                    // compat: caso o fluxo do n8n esteja esperando "tipo"
                    tipo,
                    psicologo,
                };

                const res = await fetch(WEBHOOK_IA_DATAS_COMEMORATIVAS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(payload),
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

                const texto = this.normalizarMensagemIa(data);
                if (!texto) throw new Error('Resposta inválida');

                this.form.mensagem = texto.slice(0, 500);

                // registra uso: entra na janela de 10min e inicia cooldown de 1min após resposta
                const nextHistory = [...jan, now];
                this.salvarIaState({
                    history: nextHistory,
                    cooldownUntil: now + IA_COOLDOWN_MS,
                });
            } catch (e) {
                console.error(e);
                this.showToast('error', 'Erro', 'Não foi possível gerar a mensagem com I.A. Tente novamente mais tarde.');
            } finally {
                this.iaLoading = false;
            }
        },
        async inicializarDialog() {
            this.loadingDados = true;
            try {
                await Promise.all([
                    this.carregarDatasDisponiveis(),
                    this.carregarPacientesDisponiveis(),
                ]);
                this.preencherFormulario();
            } finally {
                this.loadingDados = false;
            }
        },
        async carregarDatasDisponiveis() {
            const datas = await mensagemComemorativaService.getDatasDisponiveis();
            this.datasDisponiveis = datas.map((item) => ({
                ...item,
                nomeExibicao: `${item.icone} ${item.nome}`,
            }));
        },
        async carregarPacientesDisponiveis() {
            this.pacientesDisponiveis = await mensagemComemorativaService.getPacientesDisponiveis();
        },
        preencherFormulario() {
            if (this.isEdicao) {
                this.form = {
                    data_comemorativa_id: this.mensagem.data_comemorativa_id,
                    mensagem: this.mensagem.mensagem || '',
                    pacientes_ids: (this.mensagem.pacientes || []).map((item) => item.paciente_id),
                    ativo: !!this.mensagem.ativo,
                };
                return;
            }

            this.form = {
                data_comemorativa_id: null,
                mensagem: '',
                pacientes_ids: [],
                ativo: true,
            };
        },
        validarFormulario() {
            if (!this.form.data_comemorativa_id) {
                this.showToast('warn', 'Atenção', 'Selecione uma data comemorativa.');
                return false;
            }

            if (!this.form.mensagem || !this.form.mensagem.trim()) {
                this.showToast('warn', 'Atenção', 'A mensagem é obrigatória.');
                return false;
            }

            if (!this.form.pacientes_ids || this.form.pacientes_ids.length === 0) {
                this.showToast('warn', 'Atenção', 'Selecione ao menos 1 paciente.');
                return false;
            }

            return true;
        },
        async salvar() {
            if (!this.validarFormulario()) return;

            this.saving = true;
            try {
                if (this.isEdicao) {
                    await mensagemComemorativaService.update(this.mensagem.id, this.form);
                } else {
                    await mensagemComemorativaService.create(this.form);
                }

                this.showToast('success', 'Sucesso', `Notificação ${this.isEdicao ? 'atualizada' : 'criada'} com sucesso.`);
                this.$emit('salvo');
                this.$emit('update:visible', false);
            } catch (error) {
                const detail = error?.response?.data?.message || 'Erro ao salvar notificação.';
                this.showToast('error', 'Erro', detail);
            } finally {
                this.saving = false;
            }
        },
        showToast(severity, summary, detail) {
            this.$toast.add({
                severity,
                summary,
                detail,
                life: 3000,
            });
        },
    },
};
</script>

<style scoped>
.ia-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.35rem;
}

.ia-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.7rem;
    border-radius: 9999px;
    border: 1px solid rgba(99, 102, 241, 0.25);
    background: rgba(99, 102, 241, 0.08);
    color: #3730a3;
    font-weight: 700;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

.ia-btn:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.35);
}

.ia-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.ia-btn__label {
    white-space: nowrap;
}

.ia-btn__spinner {
    width: 14px;
    height: 14px;
    border-radius: 9999px;
    border: 2px solid rgba(55, 48, 163, 0.25);
    border-top-color: rgba(55, 48, 163, 0.95);
    animation: iaSpin 0.8s linear infinite;
}

@keyframes iaSpin {
    to {
        transform: rotate(360deg);
    }
}
</style>
