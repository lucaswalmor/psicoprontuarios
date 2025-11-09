<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0">{{ tituloFormulario }}</h5>
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
                                <div class="flex align-items-center gap-2 mb-2">
                                    <label for="categoria" class="block text-900 font-medium">Categoria *</label>
                                    <span 
                                        class="text-blue-500 text-sm cursor-pointer hover:text-blue-700"
                                        @click="abrirModalNovaCategoria"
                                    >
                                        criar
                                    </span>
                                </div>
                                <!-- Dropdown Customizado com Botões nas Opções -->
                                <div class="relative">
                                    <Dropdown 
                                        v-model="form.categoria" 
                                        :options="categoriasComAcoes" 
                                        optionLabel="nome" 
                                        optionValue="nome"
                                        placeholder="Selecione uma categoria"
                                        class="w-full"
                                        :class="{ 'p-invalid': errors.categoria }"
                                        :loading="carregandoCategorias"
                                        @change="onCategoriaChange"
                                    >
                                        <template #option="slotProps">
                                            <div class="flex align-items-center justify-content-between w-full">
                                                <span>{{ slotProps.option.nome }}</span>
                                                <div class="flex gap-1 ml-2" @click.stop>
                                                    <Button 
                                                        icon="pi pi-pencil" 
                                                        size="small" 
                                                        severity="info"
                                                        text
                                                        rounded
                                                        @click="editarCategoria(slotProps.option)"
                                                        v-tooltip.top="'Editar categoria'"
                                                    />
                                                    <Button 
                                                        icon="pi pi-trash" 
                                                        size="small" 
                                                        severity="danger"
                                                        text
                                                        rounded
                                                        @click="excluirCategoria(slotProps.option)"
                                                        v-tooltip.top="'Excluir categoria'"
                                                    />
                                                </div>
                                            </div>
                                        </template>
                                    </Dropdown>
                                </div>
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
                        
                        <!-- Campo Receita/Despesa Paga -->
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label class="block text-900 font-medium mb-2">
                                    {{ form.tipo === 'receita' ? 'Receita recebida?' : 'Despesa Paga?' }}
                                </label>
                                <div class="flex align-items-center gap-2">
                                    <ToggleSwitch v-model="form.paga" />
                                    <span class="text-600">{{ form.paga ? 'Sim' : 'Não' }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Campo Data de Pagamento -->
                        <div class="col-12 md:col-6" v-if="form.paga">
                            <div class="field">
                                <label for="data_pagamento" class="block text-900 font-medium mb-2">Data de Pagamento</label>
                                <InputMask 
                                    v-model="form.data_pagamento" 
                                    mask="99/99/9999" 
                                    placeholder="dd/mm/aaaa"
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

    <!-- Modal para criar nova categoria -->
    <Dialog 
        v-model:visible="showModalNovaCategoria" 
        modal 
        header="Nova Categoria"
        :style="{ width: '400px' }"
    >
        <div class="flex flex-column gap-3">
            <div class="field">
                <label for="novaCategoria" class="block text-900 font-medium mb-2">Nome da Categoria *</label>
                <InputText 
                    v-model="novaCategoria.nome" 
                    placeholder="Ex: Consulta, Material, Aluguel..."
                    class="w-full"
                    :class="{ 'p-invalid': errorsNovaCategoria.nome }"
                    @keyup.enter="salvarNovaCategoria"
                />
                <small v-if="errorsNovaCategoria.nome" class="p-error">{{ errorsNovaCategoria.nome }}</small>
            </div>
        </div>
        
        <template #footer>
            <div class="flex gap-2">
                <Button 
                    label="Cancelar" 
                    severity="secondary"
                    @click="fecharModalNovaCategoria"
                />
                <Button 
                    label="Salvar" 
                    :loading="salvandoNovaCategoria"
                    @click="salvarNovaCategoria"
                />
            </div>
        </template>
    </Dialog>

    <!-- Modal para editar categoria -->
    <Dialog 
        v-model:visible="showModalEditarCategoria" 
        modal 
        header="Editar Categoria"
        :style="{ width: '400px' }"
    >
        <div class="flex flex-column gap-3">
            <div class="field">
                <label for="categoriaEditada" class="block text-900 font-medium mb-2">Nome da Categoria *</label>
                <InputText 
                    v-model="categoriaEditada.nome" 
                    placeholder="Ex: Consulta, Material, Aluguel..."
                    class="w-full"
                    :class="{ 'p-invalid': errorsCategoriaEditada.nome }"
                    @keyup.enter="salvarCategoriaEditada"
                />
                <small v-if="errorsCategoriaEditada.nome" class="p-error">{{ errorsCategoriaEditada.nome }}</small>
            </div>
        </div>
        
        <template #footer>
            <div class="flex gap-2">
                <Button 
                    label="Cancelar" 
                    severity="secondary"
                    @click="fecharModalEditarCategoria"
                />
                <Button 
                    label="Salvar" 
                    :loading="salvandoCategoriaEditada"
                    @click="salvarCategoriaEditada"
                />
            </div>
        </template>
    </Dialog>

    <!-- Modal de confirmação para excluir categoria -->
    <Dialog 
        v-model:visible="showModalExcluirCategoria" 
        modal 
        header="Confirmar Exclusão"
        :style="{ width: '400px' }"
    >
        <div class="flex flex-column gap-3">
            <div class="flex align-items-center gap-3">
                <i class="pi pi-exclamation-triangle text-orange-500 text-2xl"></i>
                <div>
                    <p class="mb-2">Tem certeza que deseja excluir a categoria <strong>"{{ categoriaParaExcluir?.nome }}"</strong>?</p>
                    <p class="text-sm text-600">Esta ação não pode ser desfeita.</p>
                </div>
            </div>
        </div>
        
        <template #footer>
            <div class="flex gap-2">
                <Button 
                    label="Cancelar" 
                    severity="secondary"
                    @click="fecharModalExcluirCategoria"
                />
                <Button 
                    label="Excluir" 
                    severity="danger"
                    :loading="excluindoCategoria"
                    @click="confirmarExclusaoCategoria"
                />
            </div>
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
            categorias: [],
            carregandoCategorias: false,
            showModalNovaCategoria: false,
            salvandoNovaCategoria: false,
            novaCategoria: {
                nome: ''
            },
            errorsNovaCategoria: {},
            // Novos modais para editar e excluir
            showModalEditarCategoria: false,
            showModalExcluirCategoria: false,
            salvandoCategoriaEditada: false,
            excluindoCategoria: false,
            categoriaSelecionada: null,
            categoriaEditada: {
                id: null,
                nome: ''
            },
            categoriaParaExcluir: null,
            errorsCategoriaEditada: {},
            form: {
                tipo: null,
                categoria: '',
                valor: null,
                data: null,
                descricao: '',
                tipo_pagamento: null,
                qtd_parcelas: 1,
                forma_divisao: 'manter',
                paga: false,
                data_pagamento: null
            },
            tiposPagamento: [
                { label: 'À Vista', value: 'avista' },
                { label: 'À Prazo', value: 'aprazo' }
            ]
        };
    },
    computed: {
        isEditing() {
            return this.$route.params.id !== undefined;
        },
        
        categoriasComAcoes() {
            // Retorna as categorias com os dados necessários para os botões
            return this.categorias.map(categoria => ({
                ...categoria,
                nome: categoria.nome
            }));
        },
        
        tituloFormulario() {
            if (this.isEditing) {
                return this.form.tipo === 'receita' ? 'Editar Receita' : 'Editar Despesa';
            } else {
                return this.form.tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa';
            }
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
        await this.carregarCategorias();
        
        // Se não está editando, definir tipo pela query parameter ou rota
        if (!this.isEditing) {
            const tipoParam = this.$route.query.tipo;
            if (tipoParam === 'receita' || tipoParam === 'despesa') {
                this.form.tipo = tipoParam;
            } else {
                // Fallback: verificar pela URL
                const path = this.$route.path;
                if (path.includes('/receitas')) {
                    this.form.tipo = 'receita';
                } else if (path.includes('/despesas')) {
                    this.form.tipo = 'despesa';
                }
            }
        } else {
            // Ao editar, carregar a transação que já tem o tipo definido
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
            this.form.paga = false;
            this.form.data_pagamento = null;
            this.errors = {};
            this.parcelas = [];
        },
        
        validarForm() {
            this.errors = {};
            
            if (!this.form.tipo) {
                this.errors.tipo = 'Tipo é obrigatório';
                return false;
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
                const response = await this.$financeirosService.buscarPorId(id);
                if (response.data) {
                    const transacao = response.data;
                    this.form.tipo = transacao.tipo;
                    this.form.categoria = transacao.categoria;
                    this.form.valor = transacao.valor;
                    this.form.data = new Date(transacao.data);
                    this.form.descricao = transacao.descricao || '';
                    this.form.tipo_pagamento = transacao.tipo_pagamento || 'avista';
                    this.form.qtd_parcelas = transacao.qtd_parcelas || 1;
                    this.form.forma_divisao = transacao.forma_divisao || 'manter';
                    this.form.paga = transacao.paga || false;
                    // Formatar data_pagamento para o InputMask (dd/mm/yyyy)
                    if (transacao.data_pagamento) {
                        const dataPagamento = new Date(transacao.data_pagamento);
                        this.form.data_pagamento = `${dataPagamento.getDate().toString().padStart(2, '0')}/${(dataPagamento.getMonth() + 1).toString().padStart(2, '0')}/${dataPagamento.getFullYear()}`;
                    } else {
                        this.form.data_pagamento = null;
                    }
                    
                    // Se for uma transação parcelada, carregar todas as parcelas
                    if (transacao.recorrencia_id) {
                        await this.carregarParcelas(transacao.recorrencia_id);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar transação:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar transação',
                    life: 3000
                });
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
                // Converter data_pagamento de dd/mm/yyyy para yyyy-mm-dd
                let dataPagamentoFormatada = null;
                if (this.form.paga && this.form.data_pagamento) {
                    const partes = this.form.data_pagamento.split('/');
                    if (partes.length === 3) {
                        dataPagamentoFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
                    }
                }
                
                const dados = {
                    tipo: this.form.tipo,
                    tipo_pagamento: this.form.tipo_pagamento,
                    qtd_parcelas: this.form.qtd_parcelas,
                    forma_divisao: this.form.forma_divisao,
                    categoria: this.form.categoria.trim(),
                    valor: this.form.valor,
                    data: this.form.data.toISOString().split('T')[0],
                    descricao: this.form.descricao.trim(),
                    paga: this.form.paga,
                    data_pagamento: dataPagamentoFormatada
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
                
                // Redirecionar para a lista baseada no tipo
                if (this.form.tipo === 'receita') {
                    this.$router.push('/financeiro/receitas');
                } else if (this.form.tipo === 'despesa') {
                    this.$router.push('/financeiro/despesas');
                } else {
                    this.$router.push('/financeiro/receitas');
                }
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
            // Retornar para a lista baseada no tipo
            if (this.form.tipo === 'receita') {
                this.$router.push('/financeiro/receitas');
            } else if (this.form.tipo === 'despesa') {
                this.$router.push('/financeiro/despesas');
            } else {
                this.$router.push('/financeiro/receitas');
            }
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
        },

        // === MÉTODOS PARA CATEGORIAS ===
        
        async carregarCategorias() {
            this.carregandoCategorias = true;
            try {
                const response = await this.$financeirosService.buscarCategorias();
                if (response.data.success) {
                    this.categorias = response.data.data;
                }
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar categorias',
                    life: 3000
                });
            } finally {
                this.carregandoCategorias = false;
            }
        },

        abrirModalNovaCategoria() {
            this.showModalNovaCategoria = true;
            this.novaCategoria.nome = '';
            this.errorsNovaCategoria = {};
        },

        fecharModalNovaCategoria() {
            this.showModalNovaCategoria = false;
            this.novaCategoria.nome = '';
            this.errorsNovaCategoria = {};
        },

        validarNovaCategoria() {
            this.errorsNovaCategoria = {};
            
            if (!this.novaCategoria.nome.trim()) {
                this.errorsNovaCategoria.nome = 'Nome da categoria é obrigatório';
                return false;
            }
            
            // Verificar se já existe uma categoria com o mesmo nome
            const categoriaExistente = this.categorias.find(
                cat => cat.nome.toLowerCase() === this.novaCategoria.nome.trim().toLowerCase()
            );
            
            if (categoriaExistente) {
                this.errorsNovaCategoria.nome = 'Já existe uma categoria com este nome';
                return false;
            }
            
            return true;
        },

        async salvarNovaCategoria() {
            if (!this.validarNovaCategoria()) {
                return;
            }
            
            this.salvandoNovaCategoria = true;
            
            try {
                const response = await this.$financeirosService.cadastrarCategoria({
                    nome: this.novaCategoria.nome.trim()
                });
                
                if (response.data.success) {
                    // Adicionar a nova categoria à lista
                    this.categorias.push(response.data.data);
                    
                    // Selecionar automaticamente a nova categoria
                    this.form.categoria = response.data.data.nome;
                    
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Categoria criada com sucesso',
                        life: 3000
                    });
                    
                    this.fecharModalNovaCategoria();
                }
            } catch (error) {
                console.error('Erro ao salvar categoria:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao criar categoria',
                    life: 3000
                });
            } finally {
                this.salvandoNovaCategoria = false;
            }
        },

        // === MÉTODOS PARA EDITAR E EXCLUIR CATEGORIA ===
        
        onCategoriaChange() {
            // Encontrar a categoria selecionada pelos dados completos
            this.categoriaSelecionada = this.categorias.find(cat => cat.nome === this.form.categoria);
        },

        editarCategoria(categoria) {
            this.categoriaEditada = {
                id: categoria.id,
                nome: categoria.nome
            };
            this.errorsCategoriaEditada = {};
            this.showModalEditarCategoria = true;
        },

        excluirCategoria(categoria) {
            this.categoriaParaExcluir = categoria;
            this.showModalExcluirCategoria = true;
        },

        fecharModalEditarCategoria() {
            this.showModalEditarCategoria = false;
            this.categoriaEditada = { id: null, nome: '' };
            this.errorsCategoriaEditada = {};
        },

        fecharModalExcluirCategoria() {
            this.showModalExcluirCategoria = false;
            this.categoriaParaExcluir = null;
        },

        validarCategoriaEditada() {
            this.errorsCategoriaEditada = {};
            
            if (!this.categoriaEditada.nome.trim()) {
                this.errorsCategoriaEditada.nome = 'Nome é obrigatório';
            }
            
            return Object.keys(this.errorsCategoriaEditada).length === 0;
        },

        async salvarCategoriaEditada() {
            if (!this.validarCategoriaEditada()) {
                return;
            }
            
            this.salvandoCategoriaEditada = true;
            
            try {
                const response = await this.$financeirosService.atualizarCategoria(this.categoriaEditada.id, {
                    nome: this.categoriaEditada.nome.trim()
                });
                
                if (response.data.success) {
                    // Atualizar a categoria na lista
                    const index = this.categorias.findIndex(cat => cat.id === this.categoriaEditada.id);
                    if (index !== -1) {
                        this.categorias[index].nome = this.categoriaEditada.nome.trim();
                    }
                    
                    // Atualizar a categoria selecionada no formulário
                    this.form.categoria = this.categoriaEditada.nome.trim();
                    this.categoriaSelecionada = this.categorias[index];
                    
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Categoria atualizada com sucesso',
                        life: 3000
                    });
                    
                    this.fecharModalEditarCategoria();
                }
            } catch (error) {
                console.error('Erro ao atualizar categoria:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao atualizar categoria',
                    life: 3000
                });
            } finally {
                this.salvandoCategoriaEditada = false;
            }
        },

        async confirmarExclusaoCategoria() {
            this.excluindoCategoria = true;
            
            try {
                const response = await this.$financeirosService.excluirCategoria(this.categoriaParaExcluir.id);
                
                if (response.data.success) {
                    // Remover a categoria da lista
                    const index = this.categorias.findIndex(cat => cat.id === this.categoriaParaExcluir.id);
                    if (index !== -1) {
                        this.categorias.splice(index, 1);
                    }
                    
                    // Limpar a categoria selecionada se for a mesma que foi excluída
                    if (this.form.categoria === this.categoriaParaExcluir.nome) {
                        this.form.categoria = '';
                        this.categoriaSelecionada = null;
                    }
                    
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Categoria excluída com sucesso',
                        life: 3000
                    });
                    
                    this.fecharModalExcluirCategoria();
                }
            } catch (error) {
                console.error('Erro ao excluir categoria:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao excluir categoria',
                    life: 3000
                });
            } finally {
                this.excluindoCategoria = false;
            }
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Estilos para o dropdown customizado */
:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
    padding: 0.75rem 1rem;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item:hover) {
    background-color: var(--p-content-hover-background);
}

/* Estilos para os botões dentro das opções */
:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item .p-button) {
    width: 2rem;
    height: 2rem;
    padding: 0;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item .p-button .p-button-icon) {
    font-size: 0.875rem;
}

/* Garantir que os botões não interfiram na seleção */
:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item .flex.gap-1) {
    pointer-events: auto;
}

:deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item .flex.gap-1 .p-button) {
    pointer-events: auto;
}
</style> 