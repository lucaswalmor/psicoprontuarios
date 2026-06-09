<template>
    <Drawer
        :visible="visible"
        header="Filtro de Logs"
        position="right"
        @update:visible="onUpdateVisible"
    >
        <div class="flex flex-column gap-3">
            <div>
                <label class="block text-900 font-medium mb-2">Data inicial</label>
                <DatePicker
                    v-model="filtro.dataInicio"
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/aaaa"
                    showIcon
                    fluid
                    :showClear="true"
                />
            </div>
            <div>
                <label class="block text-900 font-medium mb-2">Data final</label>
                <DatePicker
                    v-model="filtro.dataFim"
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/aaaa"
                    showIcon
                    fluid
                    :showClear="true"
                />
            </div>
        </div>

        <div class="flex mt-4 justify-between">
            <Button label="Limpar" severity="secondary" @click="limparCamposDrawer" />
            <Button label="Filtrar" @click="aplicarFiltro" />
        </div>
    </Drawer>
</template>

<script>
import Drawer from 'primevue/drawer';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';

export default {
    name: 'DrawerFilterLogsPerfil',
    components: {
        Drawer,
        DatePicker,
        Button,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        limparCampos: {
            type: Boolean,
            default: false,
        },
        filtrosIniciais: {
            type: Object,
            default: () => ({ dataInicio: null, dataFim: null }),
        },
    },
    emits: ['update:visible', 'filtrarLogs'],
    data() {
        return {
            filtro: {
                dataInicio: null,
                dataFim: null,
            },
        };
    },
    watch: {
        visible(open) {
            if (open) {
                this.filtro = {
                    dataInicio: this.filtrosIniciais.dataInicio ?? null,
                    dataFim: this.filtrosIniciais.dataFim ?? null,
                };
            }
        },
        limparCampos(clear) {
            if (clear) {
                this.filtro = { dataInicio: null, dataFim: null };
            }
        },
    },
    methods: {
        onUpdateVisible(value) {
            this.$emit('update:visible', value);
        },
        aplicarFiltro() {
            this.$emit('filtrarLogs', { ...this.filtro });
            this.$emit('update:visible', false);
        },
        limparCamposDrawer() {
            this.filtro = { dataInicio: null, dataFim: null };
        },
    },
};
</script>
