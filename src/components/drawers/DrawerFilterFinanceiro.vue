<template>
    <Drawer :visible="visibleProp" header="Filtro Financeiro" position="right" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12 mb-3">
                <label class="block text-900 font-medium mb-2">Categoria</label>
                <Dropdown 
                    v-model="filtro.categoria" 
                    :options="categorias" 
                    optionLabel="nome" 
                    optionValue="nome"
                    placeholder="Todas as categorias" 
                    class="w-full"
                    :showClear="true"
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-900 font-medium mb-2">Data Inicial</label>
                <Calendar 
                    v-model="filtro.data_inicial" 
                    dateFormat="dd/mm/yy" 
                    placeholder="dd/mm/aaaa"
                    class="w-full"
                    :showClear="true"
                />
            </div>
            
            <div class="col-12 mb-3">
                <label class="block text-900 font-medium mb-2">Data Final</label>
                <Calendar 
                    v-model="filtro.data_final" 
                    dateFormat="dd/mm/yy" 
                    placeholder="dd/mm/aaaa"
                    class="w-full"
                    :showClear="true"
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
        visible: {
            type: Boolean,
            default: false
        },
        limparCampos: {
            type: Boolean,
            default: false
        },
        categorias: {
            type: Array,
            default: () => []
        },
        dataInicial: {
            type: Date,
            default: null
        },
        dataFinal: {
            type: Date,
            default: null
        }
    },
    computed: {
        visibleProp() {
            return this.visible;
        }
    },
    data() {
        return {
            filtro: {
                categoria: null,
                data_inicial: null,
                data_final: null
            }
        }
    },
    watch: {
        visible(newVal) {
            // Quando o drawer é aberto, sincronizar as datas dos filtros
            if (newVal) {
                this.filtro.data_inicial = this.dataInicial;
                this.filtro.data_final = this.dataFinal;
            }
        },
        dataInicial(newVal) {
            // Atualizar apenas se o drawer estiver visível e a data mudar
            if (this.visible && newVal) {
                this.filtro.data_inicial = newVal;
            }
        },
        dataFinal(newVal) {
            // Atualizar apenas se o drawer estiver visível e a data mudar
            if (this.visible && newVal) {
                this.filtro.data_final = newVal;
            }
        },
        limparCampos(newVal) {
            if (newVal) {
                this.filtro = {
                    categoria: null,
                    data_inicial: this.dataInicial,
                    data_final: this.dataFinal
                };
            }
        }
    },
    mounted() {
        // Inicializar com as datas fornecidas
        if (this.dataInicial) {
            this.filtro.data_inicial = this.dataInicial;
        }
        if (this.dataFinal) {
            this.filtro.data_final = this.dataFinal;
        }
    },
    methods: {
        onUpdateVisible(event) {
            this.$emit('update:visible', event);
        },
        
        filtrarFinanceiro() {
            this.$emit('filtrarFinanceiro', this.filtro);
            this.$emit('update:visible', false);
        },
        
        limparFiltros() {
            this.filtro = {
                categoria: null,
                data_inicial: this.dataInicial,
                data_final: this.dataFinal
            };
            this.$emit('limparFiltros');
        }
    }
}
</script>

<style scoped>
    
</style> 