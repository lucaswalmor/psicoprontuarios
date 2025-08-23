<template>
    <div class="card">
        <!-- Header -->
        <div class="d-flex align-items-center gap-3 mb-4">
            <Button 
                icon="pi pi-arrow-left" 
                class="p-button-text p-button-sm"
                @click="$router.go(-1)"
                v-tooltip.top="'Voltar'"
            />
            <div>
                <h1 class="mb-0">Detalhes do Carne Leão</h1>
                <p class="text-gray-600 mb-0">
                    Período: {{ formatDate(carneLeao?.data_referencia) }}
                </p>
            </div>
        </div>

        <div v-if="loading" class="flex justify-content-center p-4">
            <ProgressSpinner />
        </div>

        <div v-else-if="carneLeao" class="grid">
            <!-- Resumo Principal -->
            <div class="col-12">
                <div class="surface-card p-4 border-round shadow-1">
                    <div class="text-center mb-4">
                        <h2 class="text-2xl font-bold text-primary mb-2">
                            🚨 CARNE LEÃO - VALOR A PAGAR 💰
                        </h2>
                        <div class="text-4xl font-bold" :class="getValorClass()">
                            {{ formatCurrency(carneLeao.ir_devido) }}
                        </div>
                        <div class="text-lg text-600 mt-2">
                            {{ getStatusText() }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grid de Informações -->
            <div class="col-12 md:col-6">
                <!-- Receitas e Despesas -->
                <div class="surface-card p-4 border-round shadow-1 mb-3">
                    <h3 class="text-xl font-semibold mb-3 text-800">
                        <i class="pi pi-chart-line text-primary mr-2"></i>
                        Dados Financeiros
                    </h3>
                    
                    <div class="grid">
                        <div class="col-12">
                            <div class="flex align-items-center justify-content-between p-3 surface-100 border-round mb-2">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-arrow-up text-success text-xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">Receitas Brutas</h6>
                                        <small class="text-600">Total de receitas do período</small>
                                    </div>
                                </div>
                                <span class="text-xl font-bold text-success">
                                    {{ formatCurrency(carneLeao.receitas_brutas) }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="flex align-items-center justify-content-between p-3 surface-100 border-round mb-2">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-arrow-down text-danger text-xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">Despesas Dedutíveis</h6>
                                        <small class="text-600">Despesas que reduzem a base de cálculo</small>
                                    </div>
                                </div>
                                <span class="text-xl font-bold text-danger">
                                    {{ formatCurrency(carneLeao.despesas_dedutiveis) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- INSS -->
                <div class="surface-card p-4 border-round shadow-1 mb-3">
                    <h3 class="text-xl font-semibold mb-3 text-800">
                        <i class="pi pi-shield text-warning mr-2"></i>
                        Contribuição INSS
                    </h3>
                    
                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                        <div class="flex align-items-center gap-3">
                            <i class="pi pi-info-circle text-warning text-xl"></i>
                            <div>
                                <h6 class="m-0 text-800">INSS (Secundário)</h6>
                                <small class="text-600">Pagamento separado via DARF/PGDAS</small>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-warning">
                            {{ formatCurrency(carneLeao.inss) }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-12 md:col-6">
                <!-- Base de Cálculo e IR -->
                <div class="surface-card p-4 border-round shadow-1 mb-3">
                    <h3 class="text-xl font-semibold mb-3 text-800">
                        <i class="pi pi-calculator text-info mr-2"></i>
                        Cálculo do IR
                    </h3>
                    
                    <div class="grid">
                        <div class="col-12">
                            <div class="flex align-items-center justify-content-between p-3 surface-100 border-round mb-2">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-chart-bar text-info text-xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">Base de Cálculo</h6>
                                        <small class="text-600">Receitas - Despesas - INSS - Deduções</small>
                                    </div>
                                </div>
                                <span class="text-xl font-bold text-info">
                                    {{ formatCurrency(carneLeao.base_calculo) }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="flex align-items-center justify-content-between p-3 surface-100 border-round mb-2">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-dollar text-danger text-xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">IR Devido</h6>
                                        <small class="text-600">Imposto de Renda calculado</small>
                                    </div>
                                </div>
                                <span class="text-xl font-bold text-danger">
                                    {{ formatCurrency(carneLeao.ir_devido) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deduções e Resultado Final -->
                <div class="surface-card p-4 border-round shadow-1 mb-3">
                    <h3 class="text-xl font-semibold mb-3 text-800">
                        <i class="pi pi-percentage text-purple mr-2"></i>
                        Deduções e Resultado
                    </h3>
                    
                    <div class="grid">
                        <div class="col-12">
                            <div class="flex align-items-center justify-content-between p-3 surface-100 border-round mb-2">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-users text-purple text-xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">Deduções por Dependentes</h6>
                                        <small class="text-600">Deduções legais aplicadas</small>
                                    </div>
                                </div>
                                <span class="text-xl font-bold text-purple">
                                    {{ formatCurrency(carneLeao.deducoes_dependentes) }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="flex align-items-center justify-content-between p-3 surface-100 border-round mb-2">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-chart-pie text-success text-xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">Lucro Líquido</h6>
                                        <small class="text-600">Valor após todos os impostos</small>
                                    </div>
                                </div>
                                <span class="text-xl font-bold text-success">
                                    {{ formatCurrency(carneLeao.lucro_liquido) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resumo Final -->
            <div class="col-12">
                <div class="surface-card p-4 border-round shadow-1">
                    <h3 class="text-xl font-semibold mb-3 text-800">
                        <i class="pi pi-chart-line text-primary mr-2"></i>
                        Resumo Final
                    </h3>
                    
                    <div class="grid">
                        <div class="col-12 md:col-4">
                            <div class="text-center p-3 surface-100 border-round">
                                <div class="text-2xl font-bold text-red-600">
                                    {{ formatCurrency(carneLeao.total_impostos) }}
                                </div>
                                <div class="text-600">Total de Impostos</div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-4">
                            <div class="text-center p-3 surface-100 border-round">
                                <div class="text-2xl font-bold text-green-600">
                                    {{ formatCurrency(carneLeao.lucro_liquido) }}
                                </div>
                                <div class="text-600">Lucro Líquido</div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-4">
                            <div class="text-center p-3 surface-100 border-round">
                                <div class="text-2xl font-bold text-blue-600">
                                    {{ formatCurrency(carneLeao.receitas_brutas) }}
                                </div>
                                <div class="text-600">Receitas Brutas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ações -->
            <div class="col-12">
                <div class="surface-card p-4 border-round shadow-1">
                    <h3 class="text-xl font-semibold mb-3 text-800">
                        <i class="pi pi-cog text-primary mr-2"></i>
                        Ações
                    </h3>
                    
                    <div class="flex gap-3 flex-wrap">
                        <Button 
                            v-if="carneLeao.arquivo_pdf"
                            label="Download PDF" 
                            icon="pi pi-download" 
                            severity="success"
                            @click="downloadPDF"
                        />
                        <Button 
                            v-else
                            label="Gerar PDF" 
                            icon="pi pi-file-pdf" 
                            severity="info"
                            @click="gerarPDF"
                            :loading="gerandoPDF"
                        />
                        <Button 
                            label="Voltar à Lista" 
                            icon="pi pi-arrow-left" 
                            severity="secondary"
                            outlined
                            @click="$router.push('/carne-leao')"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado vazio -->
        <div v-else class="empty-state">
            <div class="empty-icon">
                <i class="pi pi-exclamation-triangle text-6xl text-gray-400"></i>
            </div>
            <div class="empty-content">
                <h3 class="empty-title">Carne Leão não encontrado</h3>
                <p class="empty-description">
                    O registro solicitado não foi encontrado ou foi removido.
                </p>
                <Button 
                    label="Voltar à Lista" 
                    icon="pi pi-arrow-left" 
                    @click="$router.push('/carne-leao')"
                    class="mt-3"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';

export default {
    name: 'DetalhesCarneLeao',
    computed: {
        planStore() {
            return usePlanStore();
        }
    },
    data() {
        return {
            carneLeao: null,
            loading: true,
            gerandoPDF: false
        };
    },
    async mounted() {
        await this.carregarCarneLeao();
    },
    methods: {
        async carregarCarneLeao() {
            try {
                this.loading = true;
                const id = this.$route.params.id;
                const response = await this.$carneLeaoService.getById(id);
                this.carneLeao = response.data;
            } catch (error) {
                console.error('Erro ao carregar carne leão:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar detalhes do Carne Leão',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric'
            });
        },

        formatCurrency(value) {
            if (value === null || value === undefined) return '0,00';
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        },

        getValorClass() {
            if (this.carneLeao.ir_devido === 0) {
                return 'text-success';
            } else if (this.carneLeao.ir_devido > 1000) {
                return 'text-red-600';
            } else {
                return 'text-orange-600';
            }
        },

        getStatusText() {
            if (this.carneLeao.ir_devido === 0) {
                return '✅ CARNE LEÃO: ISENTO - Base de cálculo negativa - não há IR a pagar';
            } else {
                return '⚠️ Este valor deve ser pago até o dia 20 do próximo mês';
            }
        },

        async gerarPDF() {
            try {
                this.gerandoPDF = true;
                
                this.$toast.add({
                    severity: 'info',
                    summary: 'Gerando PDF',
                    detail: 'Aguarde, estamos gerando o PDF...',
                    life: 3000
                });

                await this.$carneLeaoService.exportarPDF(this.carneLeao.id);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'PDF gerado com sucesso!',
                    life: 3000
                });

                // Recarregar dados para atualizar status
                await this.carregarCarneLeao();
                
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao gerar PDF',
                    life: 3000
                });
            } finally {
                this.gerandoPDF = false;
            }
        },

        async downloadPDF() {
            try {
                const response = await this.$carneLeaoService.downloadPDF(this.carneLeao.id);
                
                // Criar link para download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `carne-leao-${this.formatDate(this.carneLeao.data_referencia)}.pdf`);
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

h3 {
    margin-bottom: 0;
    color: var(--text-color);
}

.surface-card {
    border: 1px solid var(--surface-border);
    transition: all 0.2s ease;
}

.surface-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.shadow-1 {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.text-2xl {
    font-size: 1.5rem;
}

.text-4xl {
    font-size: 2.25rem;
}

.text-xl {
    font-size: 1.25rem;
}
</style>
