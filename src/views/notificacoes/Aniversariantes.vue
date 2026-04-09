<template>
    <div class="card">
        <h1>Notificações de Aniversariantes</h1>

        <div class="col-md-12 d-flex gap-2 mb-3">
            <Button label="Nova Notificação" icon="pi pi-plus" @click="abrirCriacao" />
        </div>

        <DataTable
            :value="registros"
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
            <Column header="Paciente" sortable>
                <template #body="slotProps">
                    {{ slotProps.data.paciente?.nome || '-' }}
                </template>
            </Column>

            <Column header="Aniversário">
                <template #body="slotProps">
                    {{ formatarAniversario(slotProps.data.paciente?.data_nascimento) }}
                </template>
            </Column>

            <Column header="Template">
                <template #body="slotProps">
                    {{ truncarMensagem(slotProps.data.template?.mensagem) }}
                </template>
            </Column>

            <Column header="Ativo">
                <template #body="slotProps">
                    <Tag :severity="slotProps.data.ativo ? 'success' : 'danger'" :value="slotProps.data.ativo ? 'Ativo' : 'Inativo'" />
                </template>
            </Column>

            <Column header="Ações">
                <template #body="slotProps">
                    <div class="d-flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="abrirEdicao(slotProps.data)" />
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
                        <i class="pi pi-gift text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhuma notificação de aniversário configurada</h3>
                        <p class="empty-description">
                            Adicione pacientes para receberem mensagens automáticas no aniversário.
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

        <DialogMensagemAniversariante
            v-model:visible="dialogVisible"
            :registro="registroSelecionado"
            @salvo="carregarRegistros"
        />
    </div>
</template>

<script>
import DialogMensagemAniversariante from '@/components/dialogs/notificacoes/DialogMensagemAniversariante.vue';
import mensagemAniversarianteService from '@/services/mensagemAniversarianteService';

export default {
    name: 'Aniversariantes',
    components: {
        DialogMensagemAniversariante,
    },
    data() {
        return {
            registros: [],
            loading: false,
            totalRecords: 0,
            currentPage: 1,
            perPage: 10,
            dialogVisible: false,
            registroSelecionado: null,
        };
    },
    async mounted() {
        await this.carregarRegistros();
    },
    methods: {
        async carregarRegistros() {
            try {
                this.loading = true;
                const response = await mensagemAniversarianteService.getPaginated(this.currentPage, this.perPage);
                this.registros = response.data || [];
                this.totalRecords = response.pagination.total || 0;
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar notificações de aniversariantes.',
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        formatarAniversario(dataNascimento) {
            if (!dataNascimento) return '-';
            const data = new Date(dataNascimento);
            if (Number.isNaN(data.getTime())) return '-';
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            return `${dia}/${mes}`;
        },
        truncarMensagem(texto) {
            if (!texto) return '-';
            if (texto.length <= 60) return texto;
            return `${texto.slice(0, 60)}...`;
        },
        abrirCriacao() {
            this.registroSelecionado = null;
            this.dialogVisible = true;
        },
        abrirEdicao(registro) {
            this.registroSelecionado = registro;
            this.dialogVisible = true;
        },
        confirmarExclusao(event, registro) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: 'Tem certeza que deseja remover a notificação de aniversário deste paciente?',
                accept: async () => {
                    await this.excluir(registro.id);
                },
            });
        },
        async excluir(id) {
            try {
                await mensagemAniversarianteService.delete(id);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Notificação removida com sucesso.',
                    life: 3000,
                });
                await this.carregarRegistros();
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao remover notificação de aniversário.',
                    life: 3000,
                });
            }
        },
        async onPageChange(event) {
            this.currentPage = event.page + 1;
            this.perPage = event.rows;
            await this.carregarRegistros();
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
    max-width: 430px;
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
