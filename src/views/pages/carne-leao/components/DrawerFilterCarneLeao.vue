<template>
    <Drawer :visible="visible" header="Filtro de Carne Leão" position="right" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12 mb-2">
                <label class="block text-900 font-medium mb-2">Período</label>
                <Calendar 
                    v-model="filtro.periodo" 
                    view="month" 
                    dateFormat="mm/yy" 
                    placeholder="Selecione o período"
                    class="w-full"
                />
            </div>
            <div class="col-12 mb-2">
                <label class="block text-900 font-medium mb-2">Ano</label>
                <Dropdown 
                    v-model="filtro.ano" 
                    :options="anosDisponiveis" 
                    placeholder="Selecione o ano"
                    class="w-full"
                />
            </div>
            <div class="col-12 mb-2">
                <label class="block text-900 font-medium mb-2">Mês</label>
            </div>
            <div class="col-12 mb-2">
                <div class="grid">
                    <div v-for="mes in meses" :key="mes.value" class="col-3">
                        <div class="flex align-items-center">
                            <Checkbox 
                                :value="mes.value" 
                                v-model="filtro.meses" 
                                :inputId="'mes-' + mes.value"
                            />
                            <label :for="'mes-' + mes.value" class="ml-2 text-sm">
                                {{ mes.label }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex mt-4 justify-between">
            <Button label="Limpar" severity="secondary" outlined @click="limparFiltros" />
            <Button label="Filtrar" @click="filtrarCarneLeao" />
        </div>
    </Drawer>
</template>

<script>
export default {
    name: 'DrawerFilterCarneLeao',
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
                periodo: null,
                ano: null,
                meses: []
            },
            meses: [
                { value: 1, label: 'Jan' },
                { value: 2, label: 'Fev' },
                { value: 3, label: 'Mar' },
                { value: 4, label: 'Abr' },
                { value: 5, label: 'Mai' },
                { value: 6, label: 'Jun' },
                { value: 7, label: 'Jul' },
                { value: 8, label: 'Ago' },
                { value: 9, label: 'Set' },
                { value: 10, label: 'Out' },
                { value: 11, label: 'Nov' },
                { value: 12, label: 'Dez' }
            ]
        }
    },
    computed: {
        anosDisponiveis() {
            const anoAtual = new Date().getFullYear();
            const anos = [];
            for (let i = anoAtual; i >= anoAtual - 5; i--) {
                anos.push(i);
            }
            return anos;
        }
    },
    methods: {
        onUpdateVisible(event) {
            this.visible = event;
        },
        filtrarCarneLeao() {
            const filtros = {};
            
            if (this.filtro.periodo) {
                filtros.data_inicial = this.filtro.periodo.toISOString().split('T')[0];
                filtros.data_final = new Date(this.filtro.periodo.getFullYear(), this.filtro.periodo.getMonth() + 1, 0).toISOString().split('T')[0];
            }
            
            if (this.filtro.ano) {
                filtros.ano = this.filtro.ano;
            }
            
            if (this.filtro.meses.length > 0) {
                filtros.meses = this.filtro.meses;
            }
            
            this.$emit('filtrarCarneLeao', filtros);
            this.visible = false;
        },
        limparFiltros() {
            this.filtro = {
                periodo: null,
                ano: null,
                meses: []
            };
            this.$emit('limparFiltros');
        }
    },
    watch: {
        limparCampos(newVal) {
            if (newVal) {
                this.limparFiltros();
            }
        }
    }
}
</script>
