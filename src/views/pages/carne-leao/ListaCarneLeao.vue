<template>
    <div class="card">
        <div class="d-flex align-items-center gap-3 mb-4">
            <div>
                <h1 class="mb-0">Carne Leão</h1>
                <p class="text-gray-600 mb-0">Gestão de declarações de imposto de renda</p>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-2">Lista de Declarações</h2>
                <p class="text-gray-600 mb-0">
                    {{ carneLeaoList.length }} declaração(ões) gerada(s)
                </p>
            </div>
            <div class="flex gap-2">
                <Button 
                    label="Filtros" 
                    severity="secondary" 
                    icon="pi pi-filter" 
                    v-if="!hasFiltros"
                    @click="drawerFilterCarneLeao = true" 
                />
                <Button 
                    label="Limpar Filtros" 
                    severity="danger" 
                    @click="limparFiltros" 
                    v-else 
                />
                <Button 
                    label="Configurações" 
                    icon="pi pi-cog" 
                    severity="info" 
                    outlined
                    @click="irParaConfiguracoes" 
                />
                <Button 
                    v-if="!planStore.isPlanPaused" 
                    label="Gerar Carne Leão" 
                    icon="pi pi-plus" 
                    @click="$router.push('/carne-leao/gerar')" 
                />
            </div>
        </div>

        <DataTable :value="carneLeaoList" :loading="loading" tableStyle="min-width: 50rem" 
            :emptyMessage="'Nenhuma declaração encontrada'">
            <Column field="data_referencia" header="Período" sortable>
                <template #body="slotProps">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-calendar text-primary"></i>
                        <span class="font-medium">{{ formatDate(slotProps.data.data_referencia) }}</span>
                    </div>
                </template>
            </Column>
            
            <Column field="receitas_brutas" header="Receitas Brutas" sortable>
                <template #body="slotProps">
                    <span class="font-medium text-green-600">
                        R$ {{ formatCurrency(slotProps.data.receitas_brutas) }}
                    </span>
                </template>
            </Column>
            
            <Column field="total_impostos" header="Total Impostos" sortable>
                <template #body="slotProps">
                    <span class="font-medium text-red-600">
                        R$ {{ formatCurrency(slotProps.data.total_impostos) }}
                    </span>
                </template>
            </Column>
            
            <Column field="lucro_liquido" header="Lucro Líquido" sortable>
                <template #body="slotProps">
                    <span class="font-medium text-blue-600">
                        R$ {{ formatCurrency(slotProps.data.lucro_liquido) }}
                    </span>
                </template>
            </Column>
            
            <Column header="Status PDF">
                <template #body="slotProps">
                    <Tag 
                        :value="slotProps.data.arquivo_pdf ? 'Disponível' : 'Não gerado'"
                        :severity="slotProps.data.arquivo_pdf ? 'success' : 'warning'"
                    />
                </template>
            </Column>
            
            <Column header="Ações">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-eye" 
                            class="p-button-text p-button-sm"
                            @click="verDetalhes(slotProps.data)" 
                            v-tooltip.top="'Ver Detalhes'" 
                        />
                        <Button 
                            v-if="slotProps.data.arquivo_pdf"
                            icon="pi pi-download" 
                            class="p-button-text p-button-sm p-button-success"
                            @click="downloadPDF(slotProps.data)" 
                            v-tooltip.top="'Download PDF'" 
                        />
                        <Button 
                            v-else
                            icon="pi pi-file-pdf" 
                            class="p-button-text p-button-sm p-button-info"
                            @click="gerarPDF(slotProps.data)" 
                            v-tooltip.top="'Gerar PDF'" 
                        />
                        <Button 
                            icon="pi pi-trash" 
                            class="p-button-text p-button-sm p-button-danger"
                            @click="deletarCarneLeao(slotProps.data)" 
                            v-tooltip.top="'Excluir'" 
                        />
                    </div>
                </template>
            </Column>
            
            <template #empty>
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="pi pi-calculator text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhuma declaração encontrada</h3>
                        <p class="empty-description">
                            {{ hasFiltros ? 'Nenhuma declaração corresponde aos filtros aplicados.' : 'Comece gerando sua primeira declaração de Carne Leão para organizar seus impostos.' }}
                        </p>
                        <Button 
                            v-if="!hasFiltros"
                            label="Gerar Primeira Declaração" 
                            icon="pi pi-plus" 
                            @click="$router.push('/carne-leao/gerar')"
                            class="mt-3"
                        />
                        <Button 
                            v-else
                            label="Limpar Filtros" 
                            icon="pi pi-filter-slash" 
                            severity="secondary"
                            @click="limparFiltros"
                            class="mt-3"
                        />
                    </div>
                </div>
            </template>
        </DataTable>

        <DrawerFilterCarneLeao 
            :limparCampos="limparCampos" 
            :visible="drawerFilterCarneLeao"
            @update:visible="onUpdateDrawerFilterCarneLeao" 
            @filtrarCarneLeao="filtrarCarneLeao" 
        />

        <ConfirmPopup group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="rounded p-4">
                    <span>{{ message.message }}</span>
                    <div class="flex items-center gap-2 mt-4">
                        <Button label="Não" variant="outlined" @click="rejectCallback" severity="secondary" size="small"
                            text></Button>
                        <Button label="Sim" @click="acceptCallback" size="small"></Button>
                    </div>
                </div>
            </template>
        </ConfirmPopup>
    </div>
</template>

<script>
import DrawerFilterCarneLeao from './components/DrawerFilterCarneLeao.vue';
import { usePlanStore } from '@/store/plan';

export default {
    name: 'ListaCarneLeao',
    components: {
        DrawerFilterCarneLeao
    },
    computed: {
        planStore() {
            return usePlanStore();
        }
    },
    data() {
        return {
            carneLeaoList: [],
            loading: false,
            drawerFilterCarneLeao: false,
            hasFiltros: false,
            limparCampos: false
        };
    },
    async mounted() {
        await this.carregarCarneLeao();
    },
    methods: {
        async carregarCarneLeao(filtros = {}) {
            try {
                this.loading = true;
                const response = await this.$carneLeaoService.getList(filtros);
                this.carneLeaoList = response.data || [];
            } catch (error) {
                console.error('Erro ao carregar carne leão:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar lista de declarações',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        filtrarCarneLeao(filtro) {
            this.carregarCarneLeao(filtro);
            this.hasFiltros = true;
            this.drawerFilterCarneLeao = false;
        },

        limparFiltros() {
            this.hasFiltros = false;
            this.drawerFilterCarneLeao = false;
            this.limparCampos = true;
            this.carregarCarneLeao();
        },

        onUpdateDrawerFilterCarneLeao(event) {
            this.drawerFilterCarneLeao = event;
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric'
            });
        },

        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        },

        verDetalhes(carneLeao) {
            this.$router.push(`/carne-leao/detalhes/${carneLeao.id}`);
        },

        async gerarPDF(carneLeao) {
            try {
                this.$toast.add({
                    severity: 'info',
                    summary: 'Gerando PDF',
                    detail: 'Aguarde, estamos gerando o PDF...',
                    life: 3000
                });

                await this.$carneLeaoService.exportarPDF(carneLeao.id);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'PDF gerado com sucesso!',
                    life: 3000
                });

                // Recarregar lista para atualizar status
                await this.carregarCarneLeao();
                
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao gerar PDF',
                    life: 3000
                });
            }
        },

        async downloadPDF(carneLeao) {
            try {
                const response = await this.$carneLeaoService.downloadPDF(carneLeao.id);
                
                // Criar link para download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `carne-leao-${this.formatDate(carneLeao.data_referencia)}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                
            } catch (error) {
                console.error('Erro ao fazer download:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao fazer download do PDF',
                    life: 3000
                });
            }
        },

        deletarCarneLeao(carneLeao) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: `Tem certeza que deseja excluir a declaração de ${this.formatDate(carneLeao.data_referencia)}?`,
                accept: async () => {
                    try {
                        await this.$carneLeaoService.delete(carneLeao.id);
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Declaração excluída com sucesso',
                            life: 3000
                        });
                        await this.carregarCarneLeao();
                    } catch (error) {
                        console.error('Erro ao excluir:', error);
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir declaração',
                            life: 3000
                        });
                    }
                },
                reject: () => {
                    this.$toast.add({ 
                        severity: 'info', 
                        summary: 'Cancelado', 
                        detail: 'Exclusão cancelada', 
                        life: 3000 
                    });
                }
            });
        },

        irParaConfiguracoes() {
            this.$router.push('/perfil?tab=2');
        }
    }
};
</script>

<style scoped>
.card {
    padding: 2rem;
}

h1 {
    margin-bottom: 0;
    color: var(--text-color);
}

h2 {
    margin-bottom: 0;
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
    max-width: 400px;
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

.mt-3 {
    margin-top: 0.75rem;
}
</style>
