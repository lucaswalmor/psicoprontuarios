<template>
    <template v-if="$hasAccessToModule('gestao_financeira')">
        <div class="grid">
            <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>{{ tipoDetectado === 'receita' ? 'Receitas' : 'Despesas' }}</h5>
                    <div class="flex gap-2">
                        <Button 
                            v-if="!$isPlanPaused()"
                            :label="tipoDetectado === 'receita' ? 'Nova Receita' : 'Nova Despesa'" 
                            icon="pi pi-plus" 
                            @click="novaTransacao" 
                        />
                    </div>
                </div>

                <!-- Filtros -->
                <div class="grid mb-4">
                    <div class="col-12 md:col-4">
                        <label for="categoria" class="block text-900 font-medium mb-2">Categoria</label>
                        <Dropdown 
                            v-model="filtros.categoria" 
                            :options="categorias" 
                            optionLabel="nome" 
                            optionValue="nome"
                            placeholder="Todas as categorias" 
                            class="w-full"
                            :loading="carregandoCategorias"
                            @change="onFiltroChange" 
                        />
                    </div>
                    <div class="col-12 md:col-4">
                        <label for="data_inicial" class="block text-900 font-medium mb-2">Data Inicial</label>
                        <Calendar v-model="filtros.data_inicial" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa"
                            class="w-full" @date-select="onFiltroChange" />
                    </div>
                    <div class="col-12 md:col-4">
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

                    <Column field="paga" header="Status" sortable>
                        <template #body="{ data }">
                            <Tag 
                                v-if="data.tipo === 'receita'"
                                :value="data.paga ? 'Recebido' : 'Não recebido'"
                                :severity="data.paga ? 'success' : 'danger'" 
                            />
                            <Tag 
                                v-else
                                :value="data.paga ? 'Paga' : 'Não paga'"
                                :severity="data.paga ? 'success' : 'danger'" 
                            />
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
                            <Button 
                                v-if="!$isPlanPaused()"
                                icon="pi pi-pencil" 
                                rounded 
                                outlined 
                                class="mr-2"
                                @click="editarTransacao(data.id)" 
                            />
                            <Button 
                                v-if="!$isPlanPaused()"
                                icon="pi pi-trash" 
                                rounded 
                                outlined 
                                severity="danger"
                                @click="confirmarExclusao(data)" 
                            />
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
            <Button 
                v-if="!$isPlanPaused()"
                label="Sim" 
                icon="pi pi-check" 
                severity="danger" 
                @click="excluirTransacao" 
            />
        </template>
    </Dialog>
    </template>

    <div class="card" v-else>
        <div class="empty-state">
            <div class="empty-icon">
                <i class="pi pi-exclamation-triangle text-6xl text-gray-400"></i>
            </div>
            <div class="empty-content">
                <h3 class="empty-title">Módulo indisponível</h3>
                <p class="empty-description">
                    Este módulo não está disponível para o seu plano.
                </p>
                <Button label="Clique aqui para atualizar seu plano" @click="$router.push('/upgrade')" />
            </div>
        </div>
    </div>
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
            categorias: [],
            carregandoCategorias: false,
            filtros: {
                tipo: null,
                categoria: null,
                data_inicial: this.getDataInicioFim().dataInicial,
                data_final: this.getDataInicioFim().dataFinal,
                page: 1
            }
        };
    },
    computed: {
        tipoDetectado() {
            // Detectar tipo pela URL
            const path = this.$route.path;
            if (path.includes('/receitas')) {
                return 'receita';
            } else if (path.includes('/despesas')) {
                return 'despesa';
            }
            return 'receita'; // default
        }
    },
    watch: {
        // Observar mudanças na rota para recarregar dados quando alternar entre receitas/despesas
        '$route.path'() {
            // Atualizar tipo no filtro quando a rota mudar
            this.filtros.tipo = this.tipoDetectado;
            // Resetar página para 1
            this.filtros.page = 1;
            // Recarregar transações
            this.carregarTransacoes();
        },
        
        // Também observar mudanças no tipo detectado como backup
        tipoDetectado(newVal) {
            if (this.filtros.tipo !== newVal) {
                this.filtros.tipo = newVal;
                this.filtros.page = 1;
                this.carregarTransacoes();
            }
        }
    },
    async mounted() {
        // Definir tipo baseado na URL
        this.filtros.tipo = this.tipoDetectado;
        
        if (this.$hasAccessToModule('gestao_financeira')) {
            // Carregar categorias
            await this.carregarCategorias();
            
            // Carregar transações
            await this.carregarTransacoes();
        }
    },
    methods: {
        getDataInicioFim() {
            const hoje = new Date();
            
            // Definindo o primeiro dia do mês
            const dataInicial = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            
            // Definindo o último dia do mês
            const dataFinal = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            
            // Retornando as duas datas
            return {
                dataInicial,
                dataFinal
            };
        },


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
                // Garantir que o tipo esteja definido
                const tipo = this.tipoDetectado;
                
                const params = {
                    page: this.filtros.page,
                    tipo: tipo, // Sempre enviar o tipo detectado pela URL
                    ...this.filtros
                };

                // Converter datas para formato YYYY-MM-DD
                if (this.filtros.data_inicial) {
                    params.data_inicial = this.filtros.data_inicial.toISOString().split('T')[0];
                }
                if (this.filtros.data_final) {
                    params.data_final = this.filtros.data_final.toISOString().split('T')[0];
                }

                // Remover categoria se for null
                if (!params.categoria) {
                    delete params.categoria;
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

        async carregarCategorias() {
            this.carregandoCategorias = true;
            try {
                const response = await this.$financeirosService.buscarCategorias();
                if (response.data.success) {
                    this.categorias = response.data.data;
                }
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            } finally {
                this.carregandoCategorias = false;
            }
        },

        novaTransacao() {
            const tipo = this.tipoDetectado;
            this.$router.push(`/financeiro/novo?tipo=${tipo}`);
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
                tipo: this.tipoDetectado,
                categoria: null,
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

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
}

.empty-icon {
    margin-bottom: 1.5rem;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.empty-description {
    font-size: 1rem;
    color: var(--text-color-secondary);
    margin-bottom: 1.5rem;
}
</style>