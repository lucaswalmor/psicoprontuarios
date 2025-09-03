<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0">{{ isEditing ? 'Editar Transação' : 'Nova Transação' }}</h5>
                    <div class="flex gap-2">
                        <Button 
                            type="button" 
                            label="Cancelar" 
                            severity="secondary" 
                            @click="cancelar"
                        />
                        <Button 
                            type="button" 
                            :label="isEditing ? 'Atualizar' : 'Cadastrar'" 
                            :loading="loading"
                            @click="salvar"
                        />
                    </div>
                </div>
                
                <form @submit.prevent="salvar" class="p-fluid">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="tipo" class="block text-900 font-medium mb-2">Tipo *</label>
                                <Dropdown 
                                    v-model="form.tipo" 
                                    :options="tipos" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Selecione o tipo"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.tipo }"
                                />
                                <small v-if="errors.tipo" class="p-error">{{ errors.tipo }}</small>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="categoria" class="block text-900 font-medium mb-2">Categoria *</label>
                                <InputText 
                                    v-model="form.categoria" 
                                    placeholder="Ex: Consulta, Material, Aluguel..."
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.categoria }"
                                />
                                <small v-if="errors.categoria" class="p-error">{{ errors.categoria }}</small>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="valor" class="block text-900 font-medium mb-2">Valor *</label>
                                <InputNumber 
                                    v-model="form.valor" 
                                    mode="currency" 
                                    currency="BRL" 
                                    locale="pt-BR"
                                    placeholder="0,00"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.valor }"
                                    :minFractionDigits="2"
                                    :maxFractionDigits="2"
                                />
                                <small v-if="errors.valor" class="p-error">{{ errors.valor }}</small>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="data" class="block text-900 font-medium mb-2">Data *</label>
                                <Calendar 
                                    v-model="form.data" 
                                    dateFormat="dd/mm/yy"
                                    placeholder="dd/mm/aaaa"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.data }"
                                />
                                <small v-if="errors.data" class="p-error">{{ errors.data }}</small>
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="field">
                                <label for="descricao" class="block text-900 font-medium mb-2">Descrição</label>
                                <Textarea 
                                    v-model="form.descricao" 
                                    rows="3" 
                                    placeholder="Descreva a transação..."
                                    class="w-full"
                                />
                            </div>
                        </div>
                        
                        <!-- Campos de Parcelamento -->
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="tipo_pagamento" class="block text-900 font-medium mb-2">Tipo de Pagamento *</label>
                                <Select 
                                    v-model="form.tipo_pagamento" 
                                    :options="tiposPagamento" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Selecione o tipo de pagamento"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.tipo_pagamento }"
                                    :disabled="!form.data || !form.valor"
                                />
                                <small v-if="errors.tipo_pagamento" class="p-error">{{ errors.tipo_pagamento }}</small>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6" v-if="form.tipo_pagamento === 'aprazo'">
                            <div class="field">
                                <label for="qtd_parcelas" class="block text-900 font-medium mb-2">Quantidade de Parcelas *</label>
                                <InputNumber 
                                    v-model="form.qtd_parcelas" 
                                    :min="1" 
                                    :max="200"
                                    placeholder="1"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.qtd_parcelas }"
                                />
                                <small v-if="errors.qtd_parcelas" class="p-error">{{ errors.qtd_parcelas }}</small>
                            </div>
                        </div>
                    </div>
                </form>
                
                <!-- Tabela de Parcelas -->
                <div v-if="form.tipo_pagamento === 'aprazo' && form.qtd_parcelas > 1 && parcelas.length > 0" class="mt-4">
                    <h6 class="text-900 font-bold mb-3">Parcelas Geradas ({{ parcelas.length }} parcelas)</h6>
                    <DataTable 
                        :value="parcelas" 
                        paginator 
                        :rows="10" 
                        :rowsPerPageOptions="[5, 10, 20, 50, 100]"
                        tableStyle="min-width: 50rem"
                        class="p-datatable-sm"
                    >
                        <Column field="nro_parcela" header="Parcela" style="width: 20%">
                            <template #body="slotProps">
                                <span class="font-semibold">{{ slotProps.data.nro_parcela }}/{{ form.qtd_parcelas }}</span>
                            </template>
                        </Column>
                        <Column field="data" header="Data de Vencimento" style="width: 30%">
                            <template #body="slotProps">
                                {{ formatarData(slotProps.data.data) }}
                            </template>
                        </Column>
                        <Column field="valor" header="Valor da Parcela" style="width: 30%">
                            <template #body="slotProps">
                                <span class="font-semibold text-green-600">R$ {{ formatarValor(slotProps.data.valor) }}</span>
                            </template>
                        </Column>
                        <Column field="total" header="Total Acumulado" style="width: 20%">
                            <template #body="slotProps">
                                <span class="text-blue-600">R$ {{ formatarValor(slotProps.data.valor * slotProps.data.nro_parcela) }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Dialog para escolha da forma de divisão -->
    <Dialog 
        v-model:visible="showDialogDivisao" 
        modal 
        header="Forma de Divisão do Valor"
        :style="{ width: '400px' }"
    >
        <div class="flex flex-column gap-3">
            <p class="text-900">Como deseja dividir o valor de <strong>R$ {{ formatarValor(form.valor) }}</strong> em <strong>{{ form.qtd_parcelas }} parcelas</strong>?</p>
            
            <div class="flex flex-column gap-2">
                <div class="flex align-items-center">
                    <RadioButton 
                        v-model="form.forma_divisao" 
                        inputId="manter" 
                        value="manter" 
                    />
                    <label for="manter" class="ml-2">
                        <strong>Manter valor</strong> - Cada parcela terá R$ {{ formatarValor(form.valor) }}
                    </label>
                </div>
                
                <div class="flex align-items-center">
                    <RadioButton 
                        v-model="form.forma_divisao" 
                        inputId="dividir" 
                        value="dividir" 
                    />
                    <label for="dividir" class="ml-2">
                        <strong>Dividir valor</strong> - Cada parcela terá R$ {{ formatarValor(form.valor / form.qtd_parcelas) }}
                    </label>
                </div>
            </div>
        </div>
        
        <template #footer>
            <Button 
                label="Confirmar" 
                @click="confirmarDivisao"
                class="p-button-primary"
            />
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'FinanceiroForm',
    data() {
        return {
            loading: false,
            errors: {},
            showDialogDivisao: false,
            parcelas: [],
            form: {
                tipo: null,
                categoria: '',
                valor: null,
                data: null,
                descricao: '',
                tipo_pagamento: null,
                qtd_parcelas: 1,
                forma_divisao: 'manter'
            },
            tipos: [
                { label: 'Receita', value: 'receita' },
                { label: 'Despesa', value: 'despesa' }
            ],
            tiposPagamento: [
                { label: 'À Vista', value: 'avista' },
                { label: 'À Prazo', value: 'aprazo' }
            ]
        };
    },
    computed: {
        isEditing() {
            return this.$route.params.id !== undefined;
        }
    },
    watch: {
        'form.qtd_parcelas'(newVal, oldVal) {
            if (newVal > 1 && this.form.tipo_pagamento === 'aprazo' && this.form.valor && this.form.data) {
                this.showDialogDivisao = true;
            }
            this.atualizarParcelas();
        },
        'form.valor'() {
            this.atualizarParcelas();
        },
        'form.tipo_pagamento'() {
            if (this.form.tipo_pagamento === 'avista') {
                this.form.qtd_parcelas = 1;
                this.form.forma_divisao = 'manter';
            }
            this.atualizarParcelas();
        },
        'form.forma_divisao'() {
            this.atualizarParcelas();
        }
    },
    async mounted() {
        if (this.isEditing) {
            await this.carregarTransacao(this.$route.params.id);
        }
    },
    methods: {
        limparForm() {
            this.form.tipo = null;
            this.form.categoria = '';
            this.form.valor = null;
            this.form.data = null;
            this.form.descricao = '';
            this.form.tipo_pagamento = null;
            this.form.qtd_parcelas = 1;
            this.form.forma_divisao = 'manter';
            this.errors = {};
            this.parcelas = [];
        },
        
        validarForm() {
            this.errors = {};
            
            if (!this.form.tipo) {
                this.errors.tipo = 'Tipo é obrigatório';
            }
            
            if (!this.form.categoria.trim()) {
                this.errors.categoria = 'Categoria é obrigatória';
            }
            
            if (!this.form.valor || this.form.valor <= 0) {
                this.errors.valor = 'Valor deve ser maior que zero';
            }
            
            if (!this.form.data) {
                this.errors.data = 'Data é obrigatória';
            }
            
            if (!this.form.tipo_pagamento) {
                this.errors.tipo_pagamento = 'Tipo de pagamento é obrigatório';
            }
            
            if (this.form.tipo_pagamento === 'aprazo' && (!this.form.qtd_parcelas || this.form.qtd_parcelas < 1)) {
                this.errors.qtd_parcelas = 'Quantidade de parcelas deve ser maior que zero';
            }
            
            return Object.keys(this.errors).length === 0;
        },
        
        async carregarTransacao(id) {
            try {
                const response = await this.$financeirosService.buscar({ id });
                if (response.data.data && response.data.data.length > 0) {
                    const transacao = response.data.data[0];
                    this.form.tipo = transacao.tipo;
                    this.form.categoria = transacao.categoria;
                    this.form.valor = transacao.valor;
                    this.form.data = new Date(transacao.data);
                    this.form.descricao = transacao.descricao || '';
                    this.form.tipo_pagamento = transacao.tipo_pagamento || 'avista';
                    this.form.qtd_parcelas = transacao.qtd_parcelas || 1;
                    this.form.forma_divisao = transacao.forma_divisao || 'manter';
                    
                    // Se for uma transação parcelada, carregar todas as parcelas
                    if (transacao.recorrencia_id) {
                        await this.carregarParcelas(transacao.recorrencia_id);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar transação:', error);
            }
        },
        
        async carregarParcelas(recorrenciaId) {
            try {
                const response = await this.$financeirosService.buscar({ recorrencia_id: recorrenciaId });
                if (response.data.data) {
                    this.parcelas = response.data.data.sort((a, b) => a.nro_parcela - b.nro_parcela);
                }
            } catch (error) {
                console.error('Erro ao carregar parcelas:', error);
            }
        },
        
        async salvar() {
            if (!this.validarForm()) {
                return;
            }
            
            this.loading = true;
            
            try {
                const dados = {
                    tipo: this.form.tipo,
                    tipo_pagamento: this.form.tipo_pagamento,
                    qtd_parcelas: this.form.qtd_parcelas,
                    forma_divisao: this.form.forma_divisao,
                    categoria: this.form.categoria.trim(),
                    valor: this.form.valor,
                    data: this.form.data.toISOString().split('T')[0],
                    descricao: this.form.descricao.trim()
                };
                
                if (this.isEditing) {
                    await this.$financeirosService.atualizar(this.$route.params.id, dados);
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Transação atualizada com sucesso',
                        life: 3000
                    });
                } else {
                    await this.$financeirosService.cadastrar(dados);
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Transação cadastrada com sucesso',
                        life: 3000
                    });
                }
                
                this.$router.push('/financeiro/lista');
            } catch (error) {
                console.error('Erro ao salvar:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar transação',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        
        cancelar() {
            this.$router.push('/financeiro/lista');
        },
        
        atualizarParcelas() {
            if (!this.form.data || !this.form.valor || !this.form.tipo_pagamento) {
                this.parcelas = [];
                return;
            }
            
            if (this.form.tipo_pagamento === 'avista') {
                this.parcelas = [{
                    nro_parcela: 1,
                    data: this.form.data,
                    valor: this.form.valor
                }];
                return;
            }
            
            if (this.form.tipo_pagamento === 'aprazo' && this.form.qtd_parcelas > 0) {
                this.parcelas = [];
                const dataInicial = new Date(this.form.data);
                const valorParcela = this.form.forma_divisao === 'dividir' 
                    ? this.form.valor / this.form.qtd_parcelas 
                    : this.form.valor;
                
                for (let i = 1; i <= this.form.qtd_parcelas; i++) {
                    const dataParcela = new Date(dataInicial);
                    dataParcela.setMonth(dataParcela.getMonth() + (i - 1));
                    
                    this.parcelas.push({
                        nro_parcela: i,
                        data: dataParcela,
                        valor: valorParcela
                    });
                }
            }
        },
        
        confirmarDivisao() {
            this.showDialogDivisao = false;
            this.atualizarParcelas();
        },
        
        formatarValor(valor) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(valor);
        },
        
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style> 