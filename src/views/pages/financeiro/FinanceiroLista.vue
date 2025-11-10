<template>
    <template v-if="$hasAccessToModule('gestao_financeira')">
        <div class="grid">
            <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>{{ tipoDetectado === 'receita' ? 'Receitas' : 'Despesas' }}</h5>
                    <div class="flex gap-2 align-items-center">
                        <div class="flex gap-2 align-items-center">
                            <Button 
                                label="Filtros" 
                                severity="secondary" 
                                icon="pi pi-filter" 
                                v-if="!hasFiltros"
                                @click="drawerFilterFinanceiro = true" 
                            />
                            <Button 
                                label="Limpar Filtros" 
                                severity="danger" 
                                @click="limparFiltros" 
                                v-else 
                            />
                        </div>
                        <div class="flex gap-3 align-items-center">
                            <div class="total-container-header">
                                <span class="total-label-header">
                                    {{ tipoDetectado === 'receita' ? 'Recebidas:' : 'Pagas:' }}
                                </span>
                                <span 
                                    class="text-green-600 font-bold total-value-header">
                                    R$ {{ formatarValor(totalRecebidasPagas) }}
                                </span>
                            </div>
                            <div class="total-container-header">
                                <span class="total-label-header">Previstas:</span>
                                <span 
                                    class="text-red-600 font-bold total-value-header">
                                    R$ {{ formatarValor(totalPrevistas) }}
                                </span>
                            </div>
                        </div>
                        <Button 
                            v-if="!$isPlanPaused()"
                            :label="tipoDetectado === 'receita' ? 'Nova Receita' : 'Nova Despesa'" 
                            icon="pi pi-plus" 
                            @click="novaTransacao" 
                        />
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

    <!-- Drawer de Filtros -->
    <DrawerFilterFinanceiro 
        :limparCampos="limparCampos" 
        :visible="drawerFilterFinanceiro"
        :categorias="categorias"
        :dataInicial="filtros.data_inicial"
        :dataFinal="filtros.data_final"
        @update:visible="onUpdateDrawerFilterFinanceiro" 
        @filtrarFinanceiro="filtrarFinanceiro" 
        @limparFiltros="limparFiltrosDrawer"
    />

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
import DrawerFilterFinanceiro from '@/components/drawers/DrawerFilterFinanceiro.vue';

export default {
    name: 'FinanceiroLista',
    components: {
        DrawerFilterFinanceiro
    },
    data() {
        return {
            loading: false,
            transacoes: [],
            totalRecords: 0,
            dialogVisible: false,
            transacaoParaExcluir: null,
            categorias: [],
            carregandoCategorias: false,
            drawerFilterFinanceiro: false,
            hasFiltros: false,
            limparCampos: false,
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
        },
        totalRecebidasPagas() {
            if (!this.transacoes || this.transacoes.length === 0) {
                return 0;
            }
            return this.transacoes
                .filter(transacao => transacao.paga === true || transacao.paga === 1)
                .reduce((total, transacao) => {
                    return total + (parseFloat(transacao.valor) || 0);
                }, 0);
        },
        totalPrevistas() {
            if (!this.transacoes || this.transacoes.length === 0) {
                return 0;
            }
            return this.transacoes
                .filter(transacao => !transacao.paga || transacao.paga === false || transacao.paga === 0)
                .reduce((total, transacao) => {
                    return total + (parseFloat(transacao.valor) || 0);
                }, 0);
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

        filtrarFinanceiro(filtro) {
            // Garantir que o tipo seja sempre definido pela página atual
            this.filtros.tipo = this.tipoDetectado;
            this.filtros.categoria = filtro.categoria || null;
            
            // Manter as datas escolhidas pelo usuário
            // Se o usuário escolheu uma data, usar ela; caso contrário, manter a atual ou usar padrão
            if (filtro.data_inicial !== null && filtro.data_inicial !== undefined) {
                // Converter para Date se for string ou manter se já for Date
                this.filtros.data_inicial = filtro.data_inicial instanceof Date 
                    ? filtro.data_inicial 
                    : new Date(filtro.data_inicial);
            } else {
                // Se não foi escolhida uma data, manter a atual ou usar padrão do mês
                if (!this.filtros.data_inicial) {
                    this.filtros.data_inicial = this.getDataInicioFim().dataInicial;
                }
            }
            
            if (filtro.data_final !== null && filtro.data_final !== undefined) {
                // Converter para Date se for string ou manter se já for Date
                this.filtros.data_final = filtro.data_final instanceof Date 
                    ? filtro.data_final 
                    : new Date(filtro.data_final);
            } else {
                // Se não foi escolhida uma data, manter a atual ou usar padrão do mês
                if (!this.filtros.data_final) {
                    this.filtros.data_final = this.getDataInicioFim().dataFinal;
                }
            }
            
            this.filtros.page = 1;
            // Verificar se há filtros ativos (categoria ou datas diferentes do mês atual)
            const datasPadrao = this.getDataInicioFim();
            const dataInicialDiferente = this.filtros.data_inicial && 
                this.filtros.data_inicial.getTime() !== datasPadrao.dataInicial.getTime();
            const dataFinalDiferente = this.filtros.data_final && 
                this.filtros.data_final.getTime() !== datasPadrao.dataFinal.getTime();
            
            this.hasFiltros = !!(this.filtros.categoria || dataInicialDiferente || dataFinalDiferente);
            this.carregarTransacoes();
        },

        limparFiltros() {
            this.filtros = {
                tipo: this.tipoDetectado,
                categoria: null,
                data_inicial: this.getDataInicioFim().dataInicial,
                data_final: this.getDataInicioFim().dataFinal,
                page: 1
            };
            this.hasFiltros = false;
            this.limparCampos = true;
            // Resetar limparCampos após um pequeno delay para permitir que o drawer detecte
            setTimeout(() => {
                this.limparCampos = false;
            }, 100);
            this.carregarTransacoes();
        },

        limparFiltrosDrawer() {
            this.limparFiltros();
        },

        onUpdateDrawerFilterFinanceiro(event) {
            this.drawerFilterFinanceiro = event;
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

.total-container-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--surface-ground);
    border-radius: 8px;
}

.total-label-header {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
}

.total-value-header {
    font-size: 1.1rem;
}
</style>