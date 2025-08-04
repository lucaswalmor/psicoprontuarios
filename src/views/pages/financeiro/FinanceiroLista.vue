<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>Transações Financeiras</h5>
                    <div class="flex gap-2">
                        <Button label="Nova Transação" icon="pi pi-plus" @click="novaTransacao" />
                    </div>
                </div>

                <!-- Filtros -->
                <div class="grid mb-4">
                    <div class="col-12 md:col-3">
                        <label for="tipo" class="block text-900 font-medium mb-2">Tipo</label>
                        <Dropdown v-model="filtros.tipo" :options="tipos" optionLabel="label" optionValue="value"
                            placeholder="Todos os tipos" class="w-full" @change="onFiltroChange" />
                    </div>
                    <div class="col-12 md:col-3">
                        <label for="categoria" class="block text-900 font-medium mb-2">Categoria</label>
                        <InputText v-model="filtros.categoria" placeholder="Buscar por categoria" class="w-full"
                            @input="onFiltroChange" />
                    </div>
                    <div class="col-12 md:col-3">
                        <label for="data_inicial" class="block text-900 font-medium mb-2">Data Inicial</label>
                        <Calendar v-model="filtros.data_inicial" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa"
                            class="w-full" @date-select="onFiltroChange" />
                    </div>
                    <div class="col-12 md:col-3">
                        <label for="data_final" class="block text-900 font-medium mb-2">Data Final</label>
                        <Calendar v-model="filtros.data_final" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa"
                            class="w-full" @date-select="onFiltroChange" />
                    </div>
                </div>

                <!-- Tabela -->
                <DataTable :value="transacoes" :loading="loading" :paginator="true" :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]" :totalRecords="totalRecords" :lazy="true" @page="onPageChange"
                    class="p-datatable-sm">
                    <Column field="data" header="Data" sortable>
                        <template #body="{ data }">
                            {{ formatarData(data.data) }}
                        </template>
                    </Column>

                    <Column field="tipo" header="Tipo" sortable>
                        <template #body="{ data }">
                            <Tag :value="data.tipo === 'receita' ? 'Receita' : 'Despesa'"
                                :severity="data.tipo === 'receita' ? 'success' : 'danger'" />
                        </template>
                    </Column>

                    <Column field="categoria" header="Categoria" sortable>
                        <template #body="{ data }">
                            {{ data.categoria }}
                        </template>
                    </Column>

                    <Column field="valor" header="Valor" sortable>
                        <template #body="{ data }">
                            <span
                                :class="data.tipo === 'receita' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                                R$ {{ formatarValor(data.valor) }}
                            </span>
                        </template>
                    </Column>

                    <Column field="descricao" header="Descrição">
                        <template #body="{ data }">
                            {{ data.descricao || '-' }}
                        </template>
                    </Column>

                    <Column header="Ações" :exportable="false" style="min-width:8rem">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" rounded outlined class="mr-2"
                                @click="editarTransacao(data.id)" />
                            <Button icon="pi pi-trash" rounded outlined severity="danger"
                                @click="confirmarExclusao(data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <!-- Dialog de Confirmação -->
    <Dialog v-model:visible="dialogVisible" modal header="Confirmar Exclusão" :style="{ width: '450px' }">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Tem certeza que deseja excluir esta transação?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" outlined @click="dialogVisible = false" />
            <Button label="Sim" icon="pi pi-check" severity="danger" @click="excluirTransacao" />
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'FinanceiroLista',
    data() {
        return {
            loading: false,
            transacoes: [],
            totalRecords: 0,
            dialogVisible: false,
            transacaoParaExcluir: null,
            filtros: {
                tipo: 'todos',
                categoria: '',
                data_inicial: null,
                data_final: null,
                page: 1
            },
            tipos: [
                { label: 'Receita', value: 'receita' },
                { label: 'Despesa', value: 'despesa' },
                { label: 'Todos', value: 'todos' }
            ]
        };
    },
    async mounted() {
        await this.carregarTransacoes();
    },
    methods: {
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },

        formatarValor(valor) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(valor);
        },

        async carregarTransacoes() {
            this.loading = true;

            try {
                const params = {
                    page: this.filtros.page,
                    ...this.filtros
                };

                // Converter datas para formato YYYY-MM-DD
                if (this.filtros.data_inicial) {
                    params.data_inicial = this.filtros.data_inicial.toISOString().split('T')[0];
                }
                if (this.filtros.data_final) {
                    params.data_final = this.filtros.data_final.toISOString().split('T')[0];
                }

                const response = await this.$financeirosService.buscar(params);

                this.transacoes = response.data.data;
                this.totalRecords = response.data.pagination.total;
            } catch (error) {
                console.error('Erro ao carregar transações:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar transações',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        onPageChange(event) {
            this.filtros.page = event.page + 1;
            this.carregarTransacoes();
        },

        novaTransacao() {
            this.$router.push('/financeiro/novo');
        },

        editarTransacao(id) {
            this.$router.push(`/financeiro/editar/${id}`);
        },

        confirmarExclusao(transacao) {
            this.transacaoParaExcluir = transacao;
            this.dialogVisible = true;
        },

        async excluirTransacao() {
            if (!this.transacaoParaExcluir) return;

            try {
                await this.$financeirosService.excluir(this.transacaoParaExcluir.id);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Transação excluída com sucesso',
                    life: 3000
                });

                this.dialogVisible = false;
                this.transacaoParaExcluir = null;
                this.carregarTransacoes();
            } catch (error) {
                console.error('Erro ao excluir transação:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir transação',
                    life: 3000
                });
            }
        },

        onFiltroChange() {
            this.filtros.page = 1; // Reset para primeira página
            this.carregarTransacoes();
        },

        limparFiltros() {
            this.filtros = {
                tipo: 'todos',
                categoria: '',
                data_inicial: null,
                data_final: null,
                page: 1
            };
            this.carregarTransacoes();
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>