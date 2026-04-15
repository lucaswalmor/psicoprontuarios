<script>
export default {
    name: 'DetalheChamado',
    data() {
        return {
            chamado: null,
            mensagens: [],
            novaMensagem: '',
            anexo: null,
            loading: false,
            loadingResponder: false,
            isAdmin: false
        };
    },
    mounted() {
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        this.isAdmin = String(usuario.tipo_usuario || '').toLowerCase() === 'admin';
        this.carregarChamado();
    },
    methods: {
        async carregarChamado() {
            this.loading = true;
            try {
                const response = await this.$chamadosService.buscarPorId(this.$route.params.id);
                this.chamado = response.data;
                this.mensagens = response.data?.mensagens || [];
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar o chamado.',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        onSelectFile(event) {
            this.anexo = event?.target?.files?.[0] || null;
        },
        async enviarResposta() {
            if (!this.novaMensagem.trim()) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Digite uma mensagem antes de enviar.',
                    life: 3000
                });
                return;
            }

            this.loadingResponder = true;
            try {
                await this.$chamadosService.responder(this.$route.params.id, {
                    mensagem: this.novaMensagem,
                    anexo: this.anexo
                });

                this.novaMensagem = '';
                this.anexo = null;
                await this.carregarChamado();
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Resposta enviada com sucesso.',
                    life: 3000
                });
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível enviar a resposta.',
                    life: 3000
                });
            } finally {
                this.loadingResponder = false;
            }
        },
        async alterarStatus(status) {
            try {
                await this.$chamadosService.atualizarStatus(this.$route.params.id, status);
                await this.carregarChamado();
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Status atualizado.',
                    life: 3000
                });
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível atualizar o status.',
                    life: 3000
                });
            }
        },
        async excluirChamado() {
            try {
                await this.$chamadosService.excluir(this.$route.params.id);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Chamado excluído com sucesso.',
                    life: 3000
                });
                this.$router.push('/chamados');
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível excluir o chamado.',
                    life: 3000
                });
            }
        },
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value.replace(' ', 'T'));
            if (Number.isNaN(date.getTime())) return value;
            return date.toLocaleString('pt-BR');
        },
        statusSeverity(status) {
            if (status === 'aberto') return 'info';
            if (status === 'em_andamento') return 'warn';
            if (status === 'respondido') return 'secondary';
            if (status === 'fechado') return 'success';
            return null;
        }
    }
};
</script>

<template>
    <div class="card">
        <div class="header-row">
            <div>
                <h1 class="page-title">{{ chamado?.titulo || 'Chamado' }}</h1>
                <div class="meta-row">
                    <Tag :value="chamado?.status || '-'" :severity="statusSeverity(chamado?.status)" />
                    <span class="text-muted">Tema: {{ chamado?.tema?.nome || '-' }}</span>
                </div>
            </div>
            <div class="header-actions">
                <Button text icon="pi pi-arrow-left" label="Voltar" @click="$router.push('/chamados')" />
                <Button
                    v-if="isAdmin"
                    label="Fechar"
                    icon="pi pi-lock"
                    severity="warn"
                    text
                    :disabled="chamado?.status === 'fechado'"
                    @click="alterarStatus('fechado')"
                />
                <Button
                    v-if="isAdmin"
                    label="Excluir"
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    @click="excluirChamado"
                />
            </div>
        </div>

        <div class="chat-box">
            <div v-if="mensagens.length === 0" class="empty-chat">
                Nenhuma mensagem no chamado.
            </div>

            <div
                v-for="mensagem in mensagens"
                :key="mensagem.id"
                class="message-row"
                :class="mensagem.is_admin ? 'left' : 'right'"
            >
                <div class="bubble" :class="mensagem.is_admin ? 'bubble-admin' : 'bubble-user'">
                    <div class="bubble-author">
                        {{ mensagem.is_admin ? 'Suporte' : 'Você' }}
                    </div>
                    <div class="bubble-text">{{ mensagem.mensagem }}</div>
                    <a v-if="mensagem.anexo_url" :href="mensagem.anexo_url" target="_blank" rel="noopener" class="anexo-link">
                        Ver anexo
                    </a>
                    <div class="bubble-time">{{ formatDate(mensagem.created_at) }}</div>
                </div>
            </div>
        </div>

        <div class="reply-box">
            <Textarea
                v-model="novaMensagem"
                rows="4"
                autoResize
                fluid
                placeholder="Digite sua resposta..."
                :disabled="chamado?.status === 'fechado'"
            />
            <input
                type="file"
                class="p-inputtext p-component w-full"
                :disabled="chamado?.status === 'fechado'"
                @change="onSelectFile"
            />
            <div class="reply-actions">
                <Button
                    label="Enviar resposta"
                    icon="pi pi-send"
                    :loading="loadingResponder"
                    :disabled="chamado?.status === 'fechado'"
                    @click="enviarResposta"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.meta-row {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.text-muted {
    color: #6b7280;
}

.chat-box {
    margin-top: 1rem;
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    padding: 1rem;
    min-height: 220px;
    max-height: 520px;
    overflow-y: auto;
    background: var(--surface-ground);
}

.message-row {
    display: flex;
    margin-bottom: 0.75rem;
}

.message-row.left {
    justify-content: flex-start;
}

.message-row.right {
    justify-content: flex-end;
}

.bubble {
    max-width: min(75%, 600px);
    border-radius: 10px;
    padding: 0.75rem;
}

.bubble-admin {
    background: #f1f5f9;
}

.bubble-user {
    background: #dbeafe;
}

.bubble-author {
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.bubble-time {
    margin-top: 0.4rem;
    font-size: 0.75rem;
    color: #6b7280;
}

.anexo-link {
    display: inline-block;
    margin-top: 0.35rem;
    text-decoration: underline;
}

.reply-box {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.reply-actions {
    display: flex;
    justify-content: flex-end;
}

.empty-chat {
    color: #6b7280;
}

@media (max-width: 768px) {
    .header-row {
        flex-direction: column;
    }

    .bubble {
        max-width: 100%;
    }
}
</style>
