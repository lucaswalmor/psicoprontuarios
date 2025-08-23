<template>
    <div class="card">
        <div class="d-flex align-items-center gap-3 mb-4">
            <div>
                <h1 class="mb-0">Gerar Carne Leão</h1>
                <p class="text-600 mb-0">Calcule e gere sua declaração de imposto de renda</p>
            </div>
        </div>

        <div class="grid">
            <!-- Formulário de Geração -->
            <div class="col-12 lg:col-6">
                <div class="card">
                    <h5 class="mb-3">Configurações do Cálculo</h5>
                    
                    <div class="flex flex-column gap-3">
                        <!-- Data de Referência -->
                        <div class="flex flex-column gap-2">
                            <label for="data_referencia" class="font-medium">Mês/Ano de Referência *</label>
                            <Calendar 
                                v-model="form.data_referencia" 
                                view="month" 
                                dateFormat="mm/yy" 
                                placeholder="Selecione o período"
                                class="w-full"
                                :minDate="minDate"
                                :maxDate="maxDate"
                                @date-select="onDataSelecionada"
                            />
                            <small class="text-500">
                                Selecione o mês para o qual deseja gerar o Carne Leão
                            </small>
                        </div>

                        <!-- Observações -->
                        <div class="flex flex-column gap-2">
                            <label for="observacoes" class="font-medium">Observações</label>
                            <Textarea 
                                v-model="form.observacoes" 
                                rows="3" 
                                placeholder="Observações sobre o período (opcional)"
                                class="w-full"
                            />
                        </div>

                        <!-- Botões de Ação -->
                        <div class="flex gap-2 mt-3">
                            <Button 
                                label="Simular Cálculo" 
                                icon="pi pi-calculator" 
                                @click="simularCalculo"
                                :loading="simulando"
                                :disabled="!form.data_referencia"
                                class="flex-1"
                            />
                            <Button 
                                label="Salvar Declaração" 
                                icon="pi pi-save" 
                                severity="success"
                                @click="salvarDeclaracao"
                                :loading="salvando"
                                :disabled="!form.data_referencia || !resultadoSimulacao"
                                class="flex-1"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resultado da Simulação -->
            <div class="col-12 lg:col-6">
                <div class="card">
                    <h5 class="mb-3">Resultado da Simulação</h5>
                    
                    <div v-if="!resultadoSimulacao" class="text-center p-4">
                        <i class="pi pi-calculator text-4xl text-400 mb-3"></i>
                        <p class="text-600">Clique em "Simular Cálculo" para ver os resultados</p>
                    </div>
                    
                    <div v-else class="flex flex-column gap-3">
                        <!-- 🚨 VALOR A PAGAR - DESTAQUE PRINCIPAL -->
                        <div class="p-4 surface-100 border-round border-red-300 bg-red-50">
                            <div class="text-center">
                                <div class="flex align-items-center justify-content-center gap-2 mb-3">
                                    <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
                                    <h4 class="m-0 text-red-700">🚨 CARNE LEÃO - VALOR A PAGAR 💰</h4>
                                </div>
                                
                                <!-- VALOR PRINCIPAL - CARNE LEÃO (IR) -->
                                <div v-if="resultadoSimulacao.ir_devido > 0" class="mb-3">
                                    <div class="text-4xl font-bold text-red-600 mb-2">
                                        R$ {{ formatCurrency(resultadoSimulacao.ir_devido) }}
                                    </div>
                                    <div class="text-lg text-red-700 mb-2">
                                        <strong>CARNE LEÃO (Imposto de Renda)</strong>
                                    </div>
                                    <div class="text-sm text-red-600">
                                        ⚠️ Este valor deve ser pago até o dia 20 do próximo mês
                                    </div>
                                </div>
                                
                                <!-- VALOR PRINCIPAL - ISENTO -->
                                <div v-else class="mb-3">
                                    <div class="text-4xl font-bold text-green-600 mb-2">
                                        R$ 0,00
                                    </div>
                                    <div class="text-lg text-green-700 mb-2">
                                        <strong>✅ CARNE LEÃO: ISENTO</strong>
                                    </div>
                                    <div class="text-sm text-green-600">
                                        Base de cálculo negativa - não há IR a pagar
                                    </div>
                                </div>
                                
                                <!-- VALOR SECUNDÁRIO - INSS -->
                                <div class="p-3 surface-200 border-round mt-3">
                                    <div class="text-sm text-600 mb-1">
                                        <strong>Contribuição INSS (Secundário):</strong>
                                    </div>
                                    <div class="text-lg font-medium text-blue-600">
                                        R$ {{ formatCurrency(resultadoSimulacao.inss) }}
                                    </div>
                                    <div class="text-xs text-500">
                                        Pagamento separado via DARF/PGDAS
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 📊 RESUMO FINANCEIRO -->
                        <div class="p-3 surface-100 border-round">
                            <h6 class="m-0 mb-2 text-900 flex align-items-center gap-2">
                                <i class="pi pi-chart-line text-blue-500"></i>
                                Resumo Financeiro
                            </h6>
                            <div class="grid">
                                <div class="col-6">
                                    <div class="text-sm text-600">Receitas Brutas</div>
                                    <div class="font-medium text-green-600">
                                        R$ {{ formatCurrency(resultadoSimulacao.receitas_brutas) }}
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="text-sm text-600">Despesas Dedutíveis</div>
                                    <div class="font-medium text-blue-600">
                                        R$ {{ formatCurrency(resultadoSimulacao.despesas_dedutiveis) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 🧮 DETALHAMENTO DOS IMPOSTOS -->
                        <div class="p-3 surface-100 border-round">
                            <h6 class="m-0 mb-2 text-900 flex align-items-center gap-2">
                                <i class="pi pi-calculator text-purple-500"></i>
                                Detalhamento dos Impostos
                            </h6>
                            <div class="flex flex-column gap-2">
                                <div class="flex justify-content-between">
                                    <span class="text-sm text-600">INSS (20%)</span>
                                    <span class="font-medium text-red-600">
                                        R$ {{ formatCurrency(resultadoSimulacao.inss) }}
                                    </span>
                                </div>
                                <div class="flex justify-content-between">
                                    <span class="text-sm text-600">Deduções por Dependentes</span>
                                    <span class="font-medium text-blue-600">
                                        R$ {{ formatCurrency(resultadoSimulacao.deducoes_dependentes) }}
                                    </span>
                                </div>
                                <div class="flex justify-content-between">
                                    <span class="text-sm text-600">Base de Cálculo</span>
                                    <span :class="[
                                        'font-medium',
                                        resultadoSimulacao.base_calculo >= 0 ? 'text-900' : 'text-red-600'
                                    ]">
                                        R$ {{ formatCurrency(resultadoSimulacao.base_calculo) }}
                                    </span>
                                </div>
                                <div class="flex justify-content-between">
                                    <span class="text-sm text-600">Imposto de Renda</span>
                                    <span :class="[
                                        'font-medium',
                                        resultadoSimulacao.ir_devido > 0 ? 'text-red-600' : 'text-green-600'
                                    ]">
                                        R$ {{ formatCurrency(resultadoSimulacao.ir_devido) }}
                                        <span v-if="resultadoSimulacao.ir_devido === 0" class="text-xs">(Isento)</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- 💰 RESULTADO FINAL -->
                        <div class="p-3 surface-100 border-round">
                            <h6 class="m-0 mb-2 text-900 flex align-items-center gap-2">
                                <i class="pi pi-dollar text-green-500"></i>
                                Resultado Final
                            </h6>
                            <div class="flex justify-content-between align-items-center">
                                <span class="text-lg font-medium text-900">Total de Impostos</span>
                                <span class="text-xl font-bold text-red-600">
                                    R$ {{ formatCurrency(resultadoSimulacao.total_impostos) }}
                                </span>
                            </div>
                            <div class="flex justify-content-between align-items-center mt-2">
                                <span class="text-lg font-medium text-900">Lucro Líquido</span>
                                <span :class="[
                                    'text-xl font-bold',
                                    resultadoSimulacao.lucro_liquido >= 0 ? 'text-green-600' : 'text-red-600'
                                ]">
                                    R$ {{ formatCurrency(resultadoSimulacao.lucro_liquido) }}
                                </span>
                            </div>
                        </div>

                        <!-- 📋 DETALHAMENTO TÉCNICO -->
                        <div v-if="resultadoSimulacao.detalhamento_impostos" class="p-3 surface-100 border-round">
                            <h6 class="m-0 mb-2 text-900 flex align-items-center gap-2">
                                <i class="pi pi-info-circle text-500"></i>
                                Detalhamento Técnico
                            </h6>
                            <div class="text-sm text-600">
                                <div class="mb-1">
                                    <strong>INSS:</strong> {{ resultadoSimulacao.detalhamento_impostos.inss?.aliquota || 'N/A' }}
                                </div>
                                <div>
                                    <strong>IR:</strong> Alíquota efetiva de {{ resultadoSimulacao.detalhamento_impostos.ir?.aliquota_efetiva?.toFixed(2) || '0' }}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabela Progressiva -->
        <div class="col-12 mt-4">
            <TabelaProgressivaIR :tributos="tributos" />
        </div>

        <!-- Avisos -->
        <div class="col-12 mt-4">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <div class="p-3 surface-100 border-round border-orange-200 bg-orange-50">
                        <div class="flex align-items-center gap-2 mb-2">
                            <i class="pi pi-info-circle text-orange-500"></i>
                            <span class="font-medium text-orange-700">Importante</span>
                        </div>
                        <p class="text-sm text-orange-700 m-0">
                            • Verifique se suas configurações tributárias estão corretas no perfil<br>
                            • O cálculo é baseado nos dados financeiros do mês selecionado<br>
                            • Você pode simular quantas vezes quiser antes de salvar
                        </p>
                    </div>
                </div>
                
                <div class="col-12 md:col-6">
                    <div class="p-3 surface-100 border-round border-blue-200 bg-blue-50">
                        <div class="flex align-items-center gap-2 mb-2">
                            <i class="pi pi-lightbulb text-blue-500"></i>
                            <span class="font-medium text-blue-700">Dica</span>
                        </div>
                        <p class="text-sm text-blue-700 m-0">
                            • Use a simulação para planejar seus impostos<br>
                            • Compare com meses anteriores para identificar tendências<br>
                            • Salve apenas quando estiver satisfeito com o resultado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TabelaProgressivaIR from './components/TabelaProgressivaIR.vue';
import { usePlanStore } from '@/store/plan';

export default {
    name: 'CadastroCarneLeao',
    components: {
        TabelaProgressivaIR
    },
    computed: {
        planStore() {
            return usePlanStore();
        },
        minDate() {
            const hoje = new Date();
            return new Date(hoje.getFullYear() - 2, 0, 1); // 2 anos atrás
        },
        maxDate() {
            const hoje = new Date();
            return new Date(hoje.getFullYear(), hoje.getMonth(), 0); // Último dia do mês anterior
        }
    },
    data() {
        return {
            form: {
                data_referencia: null,
                observacoes: ''
            },
            resultadoSimulacao: null,
            simulando: false,
            salvando: false,
            tributos: []
        };
    },
    async mounted() {
        await this.carregarTributos();
    },
    methods: {
        async carregarTributos() {
            try {
                const response = await this.$carneLeaoService.getTributos();
                this.tributos = response.data || [];
            } catch (error) {
                console.error('Erro ao carregar tributos:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar tabela de tributos',
                    life: 3000
                });
            }
        },

        onDataSelecionada() {
            // Limpar resultado anterior quando mudar a data
            this.resultadoSimulacao = null;
        },

        async simularCalculo() {
            if (!this.form.data_referencia) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione uma data de referência',
                    life: 3000
                });
                return;
            }

            try {
                this.simulando = true;
                
                const data = {
                    data_referencia: this.form.data_referencia.toISOString().split('T')[0],
                    observacoes: this.form.observacoes
                };

                const response = await this.$carneLeaoService.simular(data);
                this.resultadoSimulacao = response.data;
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Simulação Concluída',
                    detail: 'Cálculo simulado com sucesso! Revise os resultados antes de salvar.',
                    life: 5000
                });

            } catch (error) {
                console.error('Erro na simulação:', error);
                
                let mensagem = 'Erro ao realizar simulação';
                if (error.response?.data?.message) {
                    mensagem = error.response.data.message;
                }
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: mensagem,
                    life: 5000
                });
            } finally {
                this.simulando = false;
            }
        },

        async salvarDeclaracao() {
            if (!this.resultadoSimulacao) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Simule o cálculo antes de salvar',
                    life: 3000
                });
                return;
            }

            try {
                this.salvando = true;
                
                const data = {
                    data_referencia: this.form.data_referencia.toISOString().split('T')[0],
                    observacoes: this.form.observacoes
                };

                const response = await this.$carneLeaoService.calcular(data);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Declaração salva com sucesso! Redirecionando para a lista...',
                    life: 3000
                });

                // Aguardar um pouco e redirecionar
                setTimeout(() => {
                    this.$router.push('/carne-leao');
                }, 2000);

            } catch (error) {
                console.error('Erro ao salvar:', error);
                
                let mensagem = 'Erro ao salvar declaração';
                if (error.response?.data?.message) {
                    mensagem = error.response.data.message;
                }
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: mensagem,
                    life: 5000
                });
            } finally {
                this.salvando = false;
            }
        },

        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
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

.surface-100 {
    background-color: var(--surface-100);
}

/* Estilos para o destaque principal - VALOR A PAGAR */
.border-red-300 {
    border-color: #fca5a5;
}

.bg-red-50 {
    background-color: #fef2f2;
}

.text-red-500 {
    color: #ef4444;
}

.text-red-600 {
    color: #dc2626;
}

.text-red-700 {
    color: #b91c1c;
}

/* Estilos para valores positivos/negativos */
.text-green-600 {
    color: #16a34a;
}

.text-green-700 {
    color: #15803d;
}

/* Estilos para base de cálculo negativa */
.text-red-600 {
    color: #dc2626;
}

/* Estilos para lucro líquido negativo */
.text-red-600 {
    color: #dc2626;
}

/* Estilos para seções com ícones */
.border-orange-200 {
    border-color: #fed7aa;
}

.bg-orange-50 {
    background-color: #fff7ed;
}

.text-orange-500 {
    color: #f97316;
}

.text-orange-700 {
    color: #c2410c;
}

.border-blue-200 {
    border-color: #bfdbfe;
}

.bg-blue-50 {
    background-color: #eff6ff;
}

.text-blue-500 {
    color: #3b82f6;
}

.text-blue-700 {
    color: #1d4ed8;
}

/* Estilos para ícones coloridos */
.text-purple-500 {
    color: #8b5cf6;
}

.text-500 {
    color: #6b7280;
}

/* Destaque para o valor principal */
.text-4xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
}

/* Hover effects para melhor interatividade */
.surface-100:hover {
    background-color: var(--surface-200);
    transition: background-color 0.2s ease;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
    .text-4xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    
    .card {
        padding: 1rem;
    }
}
</style>
