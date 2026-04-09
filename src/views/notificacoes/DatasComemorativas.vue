<template>
    <div class="card">
        <h1>Notificações de Datas Comemorativas</h1>

        <div class="col-md-12 d-flex gap-2 mb-3">
            <Button label="Nova Notificação" icon="pi pi-plus" @click="abrirCriacao" />
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
            <Column header="Data Comemorativa" sortable>
                <template #body="slotProps">
                    <span>{{ slotProps.data.data_comemorativa?.icone }} {{ slotProps.data.data_comemorativa?.nome }}</span>
                </template>
            </Column>

            <Column header="Mensagem">
                <template #body="slotProps">
                    {{ truncarMensagem(slotProps.data.mensagem) }}
                </template>
            </Column>

            <Column header="Pacientes">
                <template #body="slotProps">
                    <Badge :value="`${slotProps.data.pacientes?.length || 0} paciente(s)`" />
                </template>
            </Column>

            <Column header="Ativo">
                <template #body="slotProps">
                    <Tag
                        :severity="slotProps.data.ativo ? 'success' : 'danger'"
                        :value="slotProps.data.ativo ? 'Ativo' : 'Inativo'"
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
                        <i class="pi pi-bell text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhuma notificação configurada</h3>
                        <p class="empty-description">
                            Crie sua primeira notificação para datas comemorativas.
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
                        <Button label="Não" variant="outlined" @click="rejectCallback" severity="secondary" size="small" text></Button>
                        <Button label="Sim" @click="acceptCallback" size="small"></Button>
                    </div>
                </div>
            </template>
        </ConfirmPopup>

        <DialogMensagemComemorativa
            v-model:visible="dialogVisible"
            :mensagem="mensagemSelecionada"
            @salvo="carregarMensagens"
        />
    </div>
</template>

<script>
import DialogMensagemComemorativa from '@/components/dialogs/notificacoes/DialogMensagemComemorativa.vue';
import mensagemComemorativaService from '@/services/mensagemComemorativaService';

export default {
    name: 'DatasComemorativas',
    components: {
        DialogMensagemComemorativa,
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
                const response = await mensagemComemorativaService.getPaginated(this.currentPage, this.perPage);
                this.mensagens = response.data || [];
                this.totalRecords = response.pagination.total || 0;
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar notificações comemorativas.',
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
                message: 'Tem certeza que deseja excluir esta configuração de notificação?',
                accept: async () => {
                    await this.excluir(mensagem.id);
                },
            });
        },
        async excluir(id) {
            try {
                await mensagemComemorativaService.delete(id);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Notificação excluída com sucesso.',
                    life: 3000,
                });
                await this.carregarMensagens();
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir notificação.',
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
