<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>{{ isEditing ? 'Editar Transação' : 'Nova Transação' }}</h5>
                
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
                    </div>
                    
                    <div class="flex justify-content-end gap-2 mt-4">
                        <Button 
                            type="button" 
                            label="Cancelar" 
                            severity="secondary" 
                            @click="cancelar"
                        />
                        <Button 
                            type="submit" 
                            :label="isEditing ? 'Atualizar' : 'Cadastrar'" 
                            :loading="loading"
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FinanceiroForm',
    data() {
        return {
            loading: false,
            errors: {},
            form: {
                tipo: null,
                categoria: '',
                valor: null,
                data: null,
                descricao: ''
            },
            tipos: [
                { label: 'Receita', value: 'receita' },
                { label: 'Despesa', value: 'despesa' }
            ]
        };
    },
    computed: {
        isEditing() {
            return this.$route.params.id !== undefined;
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
            this.errors = {};
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
                }
            } catch (error) {
                console.error('Erro ao carregar transação:', error);
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