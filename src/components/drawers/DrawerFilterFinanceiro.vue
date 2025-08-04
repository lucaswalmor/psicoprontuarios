<template>
    <Drawer :visible="visible" header="Filtro Financeiro" position="right" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12 mb-3">
                <label class="block text-white mb-2">Tipo de Transação</label>
                <Select 
                    v-model="filtro.tipo" 
                    :options="tiposTransacao" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Selecione o tipo" 
                    class="w-full" 
                    :showClear="true"
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-white mb-2">Data Inicial</label>
                <DatePicker 
                    v-model="filtro.data_inicial" 
                    dateFormat="dd/mm/yy" 
                    placeholder="Data inicial"
                    class="w-full"
                    :showClear="true"
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-white mb-2">Data Final</label>
                <DatePicker 
                    v-model="filtro.data_final" 
                    dateFormat="dd/mm/yy" 
                    placeholder="Data final"
                    class="w-full"
                    :showClear="true"
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-white mb-2">Categoria</label>
                <Select 
                    v-model="filtro.categoria" 
                    :options="categorias" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Selecione a categoria" 
                    class="w-full" 
                    :showClear="true"
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-white mb-2">Valor Mínimo</label>
                <InputNumber 
                    v-model="filtro.valor_minimo" 
                    placeholder="Valor mínimo" 
                    class="w-full"
                    :minFractionDigits="2"
                    :maxFractionDigits="2"
                    prefix="R$ "
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-white mb-2">Valor Máximo</label>
                <InputNumber 
                    v-model="filtro.valor_maximo" 
                    placeholder="Valor máximo" 
                    class="w-full"
                    :minFractionDigits="2"
                    :maxFractionDigits="2"
                    prefix="R$ "
                />
            </div>
        </div>
        
        <div class="flex mt-4 justify-between">
            <Button label="Limpar Filtros" severity="secondary" @click="limparFiltros" />
            <Button label="Filtrar" @click="filtrarFinanceiro" />
        </div>
    </Drawer>
</template>

<script>
export default {
    name: 'DrawerFilterFinanceiro',
    props: {
        limparCampos: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: false,
            filtro: {
                tipo: null,
                data_inicial: null,
                data_final: null,
                categoria: null,
                valor_minimo: null,
                valor_maximo: null
            },
            tiposTransacao: [
                { label: 'Receitas', value: 'receita' },
                { label: 'Despesas', value: 'despesa' }
            ],
            categorias: [
                // Receitas
                { label: 'Consulta Individual', value: 'Consulta Individual' },
                { label: 'Consulta de Casal', value: 'Consulta de Casal' },
                { label: 'Terapia Familiar', value: 'Terapia Familiar' },
                { label: 'Avaliação Psicológica', value: 'Avaliação Psicológica' },
                { label: 'Workshop', value: 'Workshop' },
                { label: 'Palestra', value: 'Palestra' },
                { label: 'Supervisão Clínica', value: 'Supervisão Clínica' },
                { label: 'Atendimento Online', value: 'Atendimento Online' },
                // Despesas
                { label: 'Aluguel do Consultório', value: 'Aluguel do Consultório' },
                { label: 'Material de Escritório', value: 'Material de Escritório' },
                { label: 'Internet e Telefone', value: 'Internet e Telefone' },
                { label: 'Seguro Profissional', value: 'Seguro Profissional' },
                { label: 'Cursos e Treinamentos', value: 'Cursos e Treinamentos' },
                { label: 'Marketing e Publicidade', value: 'Marketing e Publicidade' },
                { label: 'Software e Ferramentas', value: 'Software e Ferramentas' },
                { label: 'Transporte', value: 'Transporte' },
                { label: 'Alimentação', value: 'Alimentação' },
                { label: 'Impostos', value: 'Impostos' }
            ]
        }
    },
    methods: {
        onUpdateVisible(event) {
            this.visible = event;
            this.$emit('update:visible', event);
        },
        
        filtrarFinanceiro() {
            console.log('🔧 Filtros antes da formatação:', this.filtro);
            
            // Formatar as datas para o formato esperado pela API
            const filtrosFormatados = {
                ...this.filtro,
                data_inicial: this.filtro.data_inicial ? this.formatarData(this.filtro.data_inicial) : null,
                data_final: this.filtro.data_final ? this.formatarData(this.filtro.data_final) : null
            };
            
            console.log('📤 Filtros formatados enviados:', filtrosFormatados);
            
            this.$emit('filtrarFinanceiro', filtrosFormatados);
            this.visible = false;
        },
        
        limparFiltros() {
            this.filtro = {
                tipo: null,
                data_inicial: null,
                data_final: null,
                categoria: null,
                valor_minimo: null,
                valor_maximo: null
            };
            this.$emit('limparFiltros');
        },
        
        formatarData(data) {
            if (!data) return null;
            const d = new Date(data);
            return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        }
    },
    
    watch: {
        limparCampos(newVal) {
            if (newVal) {
                this.filtro = {
                    tipo: null,
                    data_inicial: null,
                    data_final: null,
                    categoria: null,
                    valor_minimo: null,
                    valor_maximo: null
                };
            }
        }
    }
}
</script>

<style scoped>
label {
    font-weight: 500;
}
</style> 