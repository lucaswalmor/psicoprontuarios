<template>
    <div class="card">
        <h1>Mensagens Personalizadas</h1>

        <div class="col-md-12 d-flex gap-2 mb-3">
            <Button label="Nova Mensagem" icon="pi pi-plus" @click="abrirCriacao" />
        </div>

        <DataTable
            :value="mensagens"
            :loading="loading"
            tableStyle="min-width: 50rem; cursor: pointer;"
            rowHover
            paginator
            :rows="perPage"
            :totalRecords="totalRecords"
            :lazy="true"
            @page="onPageChange"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        >
            <Column header="Agendada para">
                <template #body="slotProps">
                    {{ formatarDataHora(slotProps.data.enviar_em) }}
                </template>
            </Column>

            <Column header="Mensagem">
                <template #body="slotProps">
                    {{ truncarMensagem(slotProps.data.mensagem) }}
                </template>
            </Column>

            <Column header="Status">
                <template #body="slotProps">
                    <Tag
                        v-if="slotProps.data.enviado_em"
                        severity="success"
                        value="Enviada"
                    />
                    <Tag
                        v-else-if="slotProps.data.ativo"
                        severity="info"
                        value="Agendada"
                    />
                    <Tag
                        v-else
                        severity="danger"
                        value="Inativa"
                    />
                </template>
            </Column>

            <Column header="Ações">
                <template #body="slotProps">
                    <div class="d-flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-text p-button-sm"
                            @click="abrirEdicao(slotProps.data)"
                            :disabled="!!slotProps.data.enviado_em"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            class="p-button-text p-button-sm"
                            @click="confirmarExclusao($event, slotProps.data)"
                        />
                    </div>
                </template>
            </Column>

            <template #empty>
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="pi pi-send text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhuma mensagem agendada</h3>
                        <p class="empty-description">
                            Crie uma mensagem com texto livre e escolha a data/hora para envio.
                        </p>
                    </div>
                </div>
            </template>
        </DataTable>

        <ConfirmPopup group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="rounded p-4">
                    <span>{{ message.message }}</span>
                    <div class="flex items-center gap-2 mt-4">
                        <Button label="Não" variant="outlined" @click="rejectCallback" severity="secondary" size="small" text />
                        <Button label="Sim" @click="acceptCallback" size="small" />
                    </div>
                </div>
            </template>
        </ConfirmPopup>

        <DialogMensagemPersonalizada
            v-model:visible="dialogVisible"
            :mensagem="mensagemSelecionada"
            @salvo="carregarMensagens"
        />
    </div>
</template>

<script>
import DialogMensagemPersonalizada from '@/components/dialogs/notificacoes/DialogMensagemPersonalizada.vue';
import mensagemPersonalizadaService from '@/services/mensagemPersonalizadaService';

export default {
    name: 'Personalizadas',
    components: {
        DialogMensagemPersonalizada,
    },
    data() {
        return {
            mensagens: [],
            loading: false,
            totalRecords: 0,
            currentPage: 1,
            perPage: 10,
            dialogVisible: false,
            mensagemSelecionada: null,
        };
    },
    async mounted() {
        await this.carregarMensagens();
    },
    methods: {
        async carregarMensagens() {
            try {
                this.loading = true;
                const response = await mensagemPersonalizadaService.getPaginated(this.currentPage, this.perPage);
                this.mensagens = response.data || [];
                this.totalRecords = response.pagination.total || 0;
            } catch {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar mensagens personalizadas.',
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        truncarMensagem(texto) {
            if (!texto) return '-';
            if (texto.length <= 60) return texto;
            return `${texto.slice(0, 60)}...`;
        },
        formatarDataHora(value) {
            if (!value) return '-';
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return String(value);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} ${hh}:${mm}`;
        },
        abrirCriacao() {
            this.mensagemSelecionada = null;
            this.dialogVisible = true;
        },
        abrirEdicao(mensagem) {
            this.mensagemSelecionada = mensagem;
            this.dialogVisible = true;
        },
        confirmarExclusao(event, mensagem) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: 'Tem certeza que deseja excluir esta mensagem personalizada?',
                accept: async () => {
                    await this.excluir(mensagem.id);
                },
            });
        },
        async excluir(id) {
            try {
                await mensagemPersonalizadaService.delete(id);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Mensagem excluída com sucesso.',
                    life: 3000,
                });
                await this.carregarMensagens();
            } catch {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir mensagem.',
                    life: 3000,
                });
            }
        },
        async onPageChange(event) {
            this.currentPage = event.page + 1;
            this.perPage = event.rows;
            await this.carregarMensagens();
        },
    },
};
</script>

<style scoped>
.card {
    padding: 2rem;
}

h1 {
    margin-bottom: 2rem;
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
    max-width: 420px;
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
</style>

