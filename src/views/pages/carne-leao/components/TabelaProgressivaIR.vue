<template>
    <div class="card">
        <h5 class="mb-3">Tabela Progressiva do IRPF 2025</h5>
        
        <div v-if="loading" class="flex justify-content-center p-4">
            <ProgressSpinner />
        </div>
        
        <div v-else>
            <DataTable :value="faixasIR" tableStyle="min-width: 50rem" class="p-datatable-sm">
                <Column field="faixa_inicial" header="Faixa Inicial" sortable>
                    <template #body="slotProps">
                        <span class="font-medium">
                            R$ {{ formatCurrency(slotProps.data.faixa_inicial) || '0,00' }}
                        </span>
                    </template>
                </Column>
                
                <Column field="faixa_final" header="Faixa Final" sortable>
                    <template #body="slotProps">
                        <span v-if="slotProps.data.faixa_final && !isNaN(slotProps.data.faixa_final)" class="font-medium">
                            R$ {{ formatCurrency(slotProps.data.faixa_final) }}
                        </span>
                        <span v-else class="text-500">Acima de</span>
                    </template>
                </Column>
                
                <Column field="aliquota" header="Alíquota" sortable>
                    <template #body="slotProps">
                        <Tag 
                            :value="formatAliquota(slotProps.data.aliquota)"
                            :severity="getAliquotaSeverity(slotProps.data.aliquota)"
                        />
                    </template>
                </Column>
                
                <Column field="deducao" header="Dedução" sortable>
                    <template #body="slotProps">
                        <span v-if="slotProps.data.deducao && !isNaN(slotProps.data.deducao)" class="font-medium text-green-600">
                            R$ {{ formatCurrency(slotProps.data.deducao) }}
                        </span>
                        <span v-else class="text-500">-</span>
                    </template>
                </Column>
                
                <Column header="Exemplo de Cálculo">
                    <template #body="slotProps">
                        <div class="text-sm text-600">
                            <div v-if="slotProps.data.aliquota > 0 && !isNaN(slotProps.data.aliquota)">
                                Base: R$ {{ formatCurrency(slotProps.data.faixa_inicial + 1000) || '0,00' }}
                                <br>
                                IR: R$ {{ formatCurrency(calcularExemplo(slotProps.data)) || '0,00' }}
                            </div>
                            <div v-else class="text-green-600">
                                <i class="pi pi-check-circle mr-1"></i>
                                Isento
                            </div>
                        </div>
                    </template>
                </Column>
            </DataTable>
            
            <div class="mt-3 p-3 surface-100 border-round">
                <div class="flex align-items-center gap-2 mb-2">
                    <i class="pi pi-info-circle text-blue-500"></i>
                    <span class="font-medium text-900">Como funciona o cálculo:</span>
                </div>
                <p class="text-sm text-600 m-0">
                    O imposto é calculado progressivamente. Para cada faixa, aplica-se a alíquota correspondente 
                    sobre a parte da base de cálculo que se enquadra naquela faixa, somando-se a dedução da faixa.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TabelaProgressivaIR',
    props: {
        tributos: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {
        faixasIR() {
            if (!this.tributos || this.tributos.length === 0) {
                console.log('TabelaProgressivaIR: Nenhum tributo encontrado');
                return [];
            }
            
            const faixas = this.tributos
                .filter(tributo => {
                    const isIRPF = tributo.nome && tributo.nome.includes('IRPF');
                    const isFederal = tributo.tipo === 'federal';
                    const isAtivo = tributo.ativo;
                    
                    if (!isIRPF || !isFederal || !isAtivo) {
                        console.log('TabelaProgressivaIR: Tributo filtrado:', {
                            nome: tributo.nome,
                            tipo: tributo.tipo,
                            ativo: tributo.ativo,
                            aliquota: tributo.aliquota,
                            faixa_inicial: tributo.faixa_inicial,
                            deducao: tributo.deducao
                        });
                    }
                    
                    return isIRPF && isFederal && isAtivo;
                })
                .sort((a, b) => a.faixa_inicial - b.faixa_inicial);
            
            console.log('TabelaProgressivaIR: Faixas filtradas:', faixas);
            return faixas;
        }
    },
    methods: {
        formatCurrency(value) {
            // Validações de segurança
            if (value === null || value === undefined || isNaN(value)) {
                return '0,00';
            }
            
            // Converter para número se for string
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            
            // Verificar se é um número válido
            if (isNaN(numValue)) {
                return '0,00';
            }
            
            try {
                return new Intl.NumberFormat('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(numValue);
            } catch (error) {
                console.warn('Erro ao formatar moeda:', error);
                return '0,00';
            }
        },
        
        formatAliquota(aliquota) {
            if (aliquota === 0) return 'Isento';
            return `${(aliquota * 100).toFixed(1)}%`;
        },
        
        getAliquotaSeverity(aliquota) {
            if (aliquota === 0) return 'success';
            if (aliquota <= 0.075) return 'info';
            if (aliquota <= 0.15) return 'warning';
            return 'danger';
        },
        
        calcularExemplo(faixa) {
            // Validações de segurança para evitar NaN
            if (!faixa || typeof faixa.aliquota !== 'number' || faixa.aliquota === 0) {
                return 0;
            }
            
            // Verificar se faixa_inicial é um número válido
            if (typeof faixa.faixa_inicial !== 'number' || isNaN(faixa.faixa_inicial)) {
                return 0;
            }
            
            const baseExemplo = faixa.faixa_inicial + 1000;
            
            // Verificar se a base de exemplo é válida
            if (isNaN(baseExemplo)) {
                return 0;
            }
            
            const imposto = (baseExemplo - faixa.faixa_inicial) * faixa.aliquota;
            
            // Verificar se o imposto calculado é válido
            if (isNaN(imposto)) {
                return 0;
            }
            
            // Adicionar dedução se existir e for válida
            if (faixa.deducao && typeof faixa.deducao === 'number' && !isNaN(faixa.deducao)) {
                const resultado = imposto + faixa.deducao;
                return isNaN(resultado) ? 0 : resultado;
            }
            
            return imposto;
        }
    }
};
</script>

<style scoped>
.card {
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    padding: 1.5rem;
}

.p-datatable-sm .p-datatable-thead > tr > th {
    padding: 0.75rem;
    font-size: 0.875rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
    padding: 0.75rem;
    font-size: 0.875rem;
}
</style>
