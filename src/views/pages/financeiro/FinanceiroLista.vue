
<template>
    <div class="grid">
        <div class="col-12">
            <FinanceiroListaTour :tipo="tipoDetectado" />

            <div class="card">
                <!-- Cabeçalho único (responsivo): mesmos data-tour em desktop e mobile sem duplicar árvore -->
                <div class="financeiro-header-unified mb-4">
                    <div class="fh-left">
                        <h5 class="mb-0">{{ tipoDetectado === 'receita' ? 'Receitas' : 'Despesas' }}</h5>
                        <div data-tour="tour-fin-totais" class="fh-totais">
                            <div class="total-container-header">
                                <span class="total-label-header">
                                    {{ tipoDetectado === 'receita' ? 'Recebidas:' : 'Pagas:' }}
                                </span>
                                <span class="text-green-600 font-bold total-value-header">
                                    R$ {{ formatarValor(totalRecebidasPagas) }}
                                </span>
                            </div>
                            <div class="total-container-header">
                                <span class="total-label-header">Previstas:</span>
                                <span class="text-red-600 font-bold total-value-header">
                                    R$ {{ formatarValor(totalPrevistas) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="fh-actions">
                        <Button
                            v-if="selectedTransacoes && selectedTransacoes.length > 0"
                            :label="tipoDetectado === 'receita' ? 'Receber Todas' : 'Pagar Todas'"
                            icon="pi pi-check-circle"
                            severity="success"
                            @click="confirmarPagamentoLote"
                        />
                        <span data-tour="tour-fin-nova" class="fh-action-wrap">
                            <Button
                                :label="tipoDetectado === 'receita' ? 'Nova Receita' : 'Nova Despesa'"
                                icon="pi pi-plus"
                                @click="novaTransacao"
                            />
                        </span>
                        <span data-tour="tour-fin-filtros" class="fh-action-wrap">
                            <Button
                                v-if="!hasFiltros"
                                label="Filtros"
                                severity="secondary"
                                icon="pi pi-filter"
                                @click="drawerFilterFinanceiro = true"
                            />
                            <Button v-else label="Limpar Filtros" severity="danger" @click="limparFiltros" />
                        </span>
                        <span class="fh-action-wrap">
                            <Button
                                label="Exportar PDF"
                                icon="pi pi-file-pdf"
                                severity="help"
                                outlined
                                :loading="exportandoPdf"
                                v-tooltip.top="tipoDetectado === 'receita' ? 'Exportar receitas do período filtrado' : 'Exportar despesas do período filtrado'"
                                @click="exportarListaPdf"
                            />
                        </span>
                    </div>
                </div>

                <!-- Tabela -->
                <div data-tour="tour-fin-tabela" class="w-full">
                <DataTable
                    v-model:selection="selectedTransacoes"
                    :value="transacoes"
                    :loading="loading"
                    :paginator="true"
                    v-model:rows="rowsPerPage"
                    :rowsPerPageOptions="[10, 20, 50]"
                    :totalRecords="totalRecords"
                    :lazy="true"
                    @page="onPageChange"
                    dataKey="id"
                    class="p-datatable-sm"
                >
                    <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                    <Column field="data" header="Data" sortable>
                        <template #body="{ data }">
                            {{ formatarData(data.data) }}
                        </template>
                    </Column>

                    <Column field="paga" header="Status" sortable>
                        <template #body="{ data }">
                            <Tag v-if="data.tipo === 'receita'" :value="data.paga ? 'Recebido' : 'Não recebido'"
                                :severity="data.paga ? 'success' : 'danger'" />
                            <Tag v-else :value="data.paga ? 'Paga' : 'Não paga'"
                                :severity="data.paga ? 'success' : 'danger'" />
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

                    <template #empty>
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="pi pi-inbox text-4xl text-gray-400"></i>
                            </div>
                            <div class="empty-content">
                                <h3 class="empty-title">Nenhuma transação encontrada</h3>
                                <p class="empty-description">
                                    Você ainda não cadastrou {{ tipoDetectado === 'receita' ? 'nenhuma receita' : 'nenhuma despesa' }}.
                                    Clique em <strong>{{ tipoDetectado === 'receita' ? 'Nova Receita' : 'Nova Despesa' }}</strong> para começar.
                                </p>
                            </div>
                        </div>
                    </template>
                </DataTable>
                </div>
            </div>
        </div>
    </div>

    <!-- Drawer de Filtros -->
    <DrawerFilterFinanceiro :limparCampos="limparCampos" :visible="drawerFilterFinanceiro" :categorias="categorias"
        :dataInicial="filtros.data_inicial" :dataFinal="filtros.data_final"
        @update:visible="onUpdateDrawerFilterFinanceiro" @filtrarFinanceiro="filtrarFinanceiro"
        @limparFiltros="limparFiltrosDrawer" />

    <!-- Dialog de Confirmação de Exclusão -->
    <Dialog v-model:visible="dialogVisible" modal header="Confirmar Exclusão" :style="{ width: '450px' }">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Tem certeza que deseja excluir esta transação?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" outlined @click="dialogVisible = false" />
            <Button label="Sim" icon="pi pi-check" severity="danger"
                @click="excluirTransacao" />
        </template>
    </Dialog>

    <!-- Dialog de Confirmação de Pagamento em Lote -->
    <Dialog v-model:visible="dialogPagamentoLoteVisible" modal header="Confirmar Quitação em Lote"
        :style="{ width: '450px' }">
        <div class="confirmation-content">
            <i class="pi pi-question-circle mr-3" style="font-size: 2rem" />
            <span>
                Tem certeza que deseja quitar {{ selectedTransacoes.length }}
                {{ selectedTransacoes.length === 1 ? 'transação' : 'transações' }} em lote?
            </span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" outlined @click="dialogPagamentoLoteVisible = false" />
            <Button :label="tipoDetectado === 'receita' ? 'Receber Todas' : 'Pagar Todas'"
                icon="pi pi-check" severity="success" @click="pagarEmLote" />
        </template>
    </Dialog>
</template>

<script>
import DrawerFilterFinanceiro from '@/components/drawers/DrawerFilterFinanceiro.vue';
import FinanceiroListaTour from '@/components/tour/FinanceiroListaTour.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
export default {
    name: 'FinanceiroLista',
    components: {
        DrawerFilterFinanceiro,
        FinanceiroListaTour,
        DataTable,
        Column,
        Button,
        Tag,
        Dialog,
    },
    data() {
        return {
            loading: false,
            transacoes: [],
            totalRecords: 0,
            selectedTransacoes: [],
            dialogVisible: false,
            dialogPagamentoLoteVisible: false,
            transacaoParaExcluir: null,
            categorias: [],
            carregandoCategorias: false,
            drawerFilterFinanceiro: false,
            hasFiltros: false,
            limparCampos: false,
            rowsPerPage: 10,
            totalRecebidasPagas: 0,
            totalPrevistas: 0,
            exportandoPdf: false,
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
    },
    watch: {
        // Observar mudanças na rota para recarregar dados quando alternar entre receitas/despesas
        '$route.path'() {
            // Atualizar tipo no filtro quando a rota mudar
            this.filtros.tipo = this.tipoDetectado;
            // Resetar página para 1 e rows para padrão
            this.filtros.page = 1;
            this.rowsPerPage = 10;
            // Recarregar transações
            this.carregarTransacoes();
        },

        // Também observar mudanças no tipo detectado como backup
        tipoDetectado(newVal) {
            if (this.filtros.tipo !== newVal) {
                this.filtros.tipo = newVal;
                this.filtros.page = 1;
                this.rowsPerPage = 10;

                this.carregarTransacoes();
            }
        },

        // Validar seleção de transações - não permitir selecionar transações já pagas
        selectedTransacoes(newSelection, oldSelection) {
            if (!newSelection || newSelection.length === 0) {
                return;
            }

            // Verificar se alguma transação selecionada já está paga
            const transacoesPagas = newSelection.filter(transacao => {
                return transacao.paga === true || transacao.paga === 1;
            });

            if (transacoesPagas.length > 0) {
                // Remover transações pagas da seleção
                const transacoesNaoPagas = newSelection.filter(transacao => {
                    return !(transacao.paga === true || transacao.paga === 1);
                });

                // Atualizar seleção removendo as pagas
                this.$nextTick(() => {
                    this.selectedTransacoes = transacoesNaoPagas;
                });

                // Mostrar toast de aviso
                const tipoTexto = this.tipoDetectado === 'receita' ? 'recebida' : 'paga';
                const mensagem = transacoesPagas.length === 1
                    ? `Esta transação já está ${tipoTexto}`
                    : `Estas transações já estão ${tipoTexto === 'paga' ? 'pagas' : 'recebidas'}`;

                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: mensagem,
                    life: 4000
                });
            }
        }
    },
    async mounted() {
        // Definir tipo baseado na URL
        this.filtros.tipo = this.tipoDetectado;

        // Carregar categorias e transações sempre; não há mais bloqueio por módulo
        await this.carregarCategorias();
        await this.carregarTransacoes();
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

        /**
         * Parâmetros do PDF: sempre o tipo da tela atual (receitas → receita, despesas → despesa)
         * e o mesmo intervalo/categoria usados na listagem (mês vigente se não houver datas).
         */
        montarParamsExportacaoPdf() {
            const tipo = this.tipoDetectado;
            const padraoMes = this.getDataInicioFim();
            const di = this.filtros.data_inicial || padraoMes.dataInicial;
            const df = this.filtros.data_final || padraoMes.dataFinal;

            const params = {
                tipo,
                data_inicial: di instanceof Date ? di.toISOString().split('T')[0] : di,
                data_final: df instanceof Date ? df.toISOString().split('T')[0] : df
            };

            if (this.filtros.categoria) {
                params.categoria = this.filtros.categoria;
            }

            return params;
        },

        async exportarListaPdf() {
            this.exportandoPdf = true;
            try {
                const params = this.montarParamsExportacaoPdf();
                const response = await this.$financeirosService.exportarPdf(params);

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const cd = response.headers['content-disposition'];
                let nomeArquivo = params.tipo === 'receita' ? 'receitas.pdf' : 'despesas.pdf';
                if (cd) {
                    const m = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(cd);
                    if (m) {
                        nomeArquivo = decodeURIComponent((m[1] || m[2] || '').trim());
                    }
                }
                link.download = nomeArquivo || 'financeiro.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                this.$toast.add({
                    severity: 'success',
                    summary: 'PDF',
                    detail: params.tipo === 'receita'
                        ? 'Receitas exportadas com sucesso.'
                        : 'Despesas exportadas com sucesso.',
                    life: 3000
                });
            } catch (error) {
                let mensagem = 'Não foi possível gerar o PDF.';
                if (error.response?.data instanceof Blob) {
                    try {
                        const texto = await error.response.data.text();
                        const json = JSON.parse(texto);
                        mensagem = json.message || mensagem;
                    } catch {
                        /* manter mensagem padrão */
                    }
                }
                console.error('Erro ao exportar PDF:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: mensagem,
                    life: 4000
                });
            } finally {
                this.exportandoPdf = false;
            }
        },

        async carregarTransacoes() {
            this.loading = true;

            try {
                // Garantir que o tipo esteja definido
                const tipo = this.tipoDetectado;

                const params = {
                    page: this.filtros.page,
                    per_page: this.rowsPerPage,
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

                // Atualizar totais vindos do backend (calculados sobre TODAS as transações do período)
                if (response.data.totais) {
                    this.totalRecebidasPagas = response.data.totais.total_recebidas_pagas || 0;
                    this.totalPrevistas = response.data.totais.total_previstas || 0;
                } else {
                    // Fallback caso o backend não retorne os totais
                    this.totalRecebidasPagas = 0;
                    this.totalPrevistas = 0;
                }

                // Limpar seleção ao recarregar
                this.selectedTransacoes = [];
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
            // Atualizar rowsPerPage se mudou
            if (event.rows !== this.rowsPerPage) {
                this.rowsPerPage = event.rows;
            }
            this.selectedTransacoes = []; // Limpar seleção ao mudar de página
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
            this.rowsPerPage = 10; // Resetar para o padrão
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
        },

        confirmarPagamentoLote() {
            if (!this.selectedTransacoes || this.selectedTransacoes.length === 0) {
                return;
            }
            this.dialogPagamentoLoteVisible = true;
        },

        async pagarEmLote() {
            if (!this.selectedTransacoes || this.selectedTransacoes.length === 0) {
                return;
            }

            try {
                const ids = this.selectedTransacoes.map(t => t.id);
                await this.$financeirosService.pagarEmLote(ids);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `${this.selectedTransacoes.length} ${this.selectedTransacoes.length === 1 ? 'transação quitada' : 'transações quitadas'} com sucesso`,
                    life: 3000
                });

                this.dialogPagamentoLoteVisible = false;
                this.selectedTransacoes = [];
                this.carregarTransacoes();
            } catch (error) {
                console.error('Erro ao quitar transações em lote:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao quitar transações em lote',
                    life: 3000
                });
            }
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

.financeiro-header-unified {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.fh-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.fh-totais {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.fh-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.fh-action-wrap {
    display: inline-flex;
    align-items: center;
}

@media (max-width: 768px) {
    .financeiro-header-unified {
        flex-direction: column;
        align-items: stretch;
    }

    .fh-left {
        flex-direction: column;
        align-items: stretch;
    }

    .fh-totais {
        flex-direction: column;
        gap: 0.5rem;
    }

    .fh-actions {
        flex-direction: column;
        width: 100%;
    }

    .fh-actions :deep(.p-button) {
        width: 100%;
    }

    .total-container-header {
        justify-content: space-between;
        width: 100%;
    }

    .total-label-header,
    .total-value-header {
        font-size: 0.95rem;
    }
}
</style>