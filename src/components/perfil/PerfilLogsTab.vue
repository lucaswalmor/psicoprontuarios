<template>
    <div class="p-4">
        <div class="surface-card p-4 border-round">
            <div class="flex gap-2 mb-4">
                <Button
                    v-if="!hasFiltros"
                    label="Filtros"
                    severity="secondary"
                    icon="pi pi-filter"
                    @click="drawerFilterLogs = true"
                />
                <Button
                    v-else
                    label="Limpar Filtros"
                    severity="danger"
                    icon="pi pi-filter-slash"
                    @click="limparFiltros"
                />
            </div>

            <DataTable
                :value="logs"
                :loading="loading"
                tableStyle="min-width: 50rem"
                stripedRows
            >
                <Column field="usuario" header="Usuário" style="min-width: 10rem" />
                <Column header="Data" style="min-width: 11rem">
                    <template #body="{ data }">
                        {{ formatarData(data.data) }}
                    </template>
                </Column>
                <Column header="Descrição" style="min-width: 20rem">
                    <template #body="{ data }">
                        {{ data.descricao_resumida || data.descricao }}
                    </template>
                </Column>
                <Column header="Ações" style="width: 6rem">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-eye"
                            severity="secondary"
                            text
                            rounded
                            aria-label="Visualizar log"
                            @click="abrirDialog(data)"
                        />
                    </template>
                </Column>
                <template #empty>
                    <div class="text-center py-4 text-600">
                        {{ hasFiltros ? 'Nenhum log encontrado com os filtros aplicados.' : 'Nenhum registro de atividade ainda.' }}
                    </div>
                </template>
            </DataTable>

            <Paginator
                v-if="meta.total > 0"
                class="mt-3"
                :rows="meta.per_page"
                :totalRecords="meta.total"
                :first="(meta.current_page - 1) * meta.per_page"
                @page="onPage"
            />
        </div>

        <DrawerFilterLogsPerfil
            :visible="drawerFilterLogs"
            :limpar-campos="limparCamposDrawer"
            :filtros-iniciais="filtrosAplicados"
            @update:visible="drawerFilterLogs = $event"
            @filtrar-logs="filtrarLogs"
        />

        <Dialog
            v-model:visible="dialogVisible"
            header="Detalhes do log"
            modal
            :style="{ width: 'min(640px, 95vw)' }"
        >
            <div v-if="logSelecionado" class="flex flex-column gap-3">
                <div>
                    <span class="text-sm text-600">Usuário</span>
                    <p class="m-0 font-medium">{{ logSelecionado.usuario }}</p>
                </div>
                <div>
                    <span class="text-sm text-600">Data</span>
                    <p class="m-0">{{ formatarData(logSelecionado.data) }}</p>
                </div>
                <div>
                    <span class="text-sm text-600">Descrição</span>
                    <p class="m-0 white-space-pre-wrap">{{ logSelecionado.descricao }}</p>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import logsPsicologosService from '@/services/logsPsicologosService';
import DrawerFilterLogsPerfil from '@/components/drawers/DrawerFilterLogsPerfil.vue';
import {
    loadStoredFilters,
    saveStoredFilters,
    clearStoredFilters,
    hasActiveFilters,
} from '@/utils/filterStorage';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Paginator from 'primevue/paginator';

const FILTER_STORAGE_KEY = 'perfil-logs';
const FILTER_DATE_KEYS = ['dataInicio', 'dataFim'];

export default {
    name: 'PerfilLogsTab',
    components: {
        DrawerFilterLogsPerfil,
        DataTable,
        Column,
        Button,
        Dialog,
        Paginator,
    },
    data() {
        return {
            loading: false,
            logs: [],
            meta: {
                current_page: 1,
                last_page: 1,
                per_page: 25,
                total: 0,
            },
            page: 1,
            filtrosAplicados: {
                dataInicio: null,
                dataFim: null,
            },
            drawerFilterLogs: false,
            limparCamposDrawer: false,
            dialogVisible: false,
            logSelecionado: null,
        };
    },
    computed: {
        hasFiltros() {
            return hasActiveFilters(this.filtrosAplicados);
        },
    },
    mounted() {
        this.filtrosAplicados = loadStoredFilters(
            FILTER_STORAGE_KEY,
            { dataInicio: null, dataFim: null },
            FILTER_DATE_KEYS,
        );
        this.carregarLogs();
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    methods: {
        formatarData(iso) {
            if (!iso) return '—';
            try {
                return new Date(iso).toLocaleString('pt-BR');
            } catch {
                return iso;
            }
        },
        formatarDataParam(date) {
            if (!date) return undefined;
            const d = date instanceof Date ? date : new Date(date);
            if (Number.isNaN(d.getTime())) return undefined;
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        },
        async carregarLogs() {
            this.loading = true;
            try {
                const params = {
                    page: this.page,
                    per_page: 25,
                };
                const dataInicio = this.formatarDataParam(this.filtrosAplicados.dataInicio);
                const dataFim = this.formatarDataParam(this.filtrosAplicados.dataFim);
                if (dataInicio) params.data_inicio = dataInicio;
                if (dataFim) params.data_fim = dataFim;

                const response = await logsPsicologosService.listar(params);
                this.logs = response.data ?? [];
                this.meta = {
                    current_page: response.meta?.current_page ?? 1,
                    last_page: response.meta?.last_page ?? 1,
                    per_page: response.meta?.per_page ?? 25,
                    total: response.meta?.total ?? this.logs.length,
                };
            } catch (error) {
                this.logs = [];
                this.toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.message || 'Não foi possível carregar os logs.',
                    life: 4000,
                });
            } finally {
                this.loading = false;
            }
        },
        filtrarLogs(filtro) {
            this.filtrosAplicados = { ...filtro };
            saveStoredFilters(FILTER_STORAGE_KEY, this.filtrosAplicados, FILTER_DATE_KEYS);
            this.page = 1;
            this.carregarLogs();
        },
        limparFiltros() {
            this.filtrosAplicados = { dataInicio: null, dataFim: null };
            clearStoredFilters(FILTER_STORAGE_KEY);
            this.limparCamposDrawer = true;
            this.drawerFilterLogs = false;
            this.page = 1;
            this.carregarLogs();
            this.$nextTick(() => {
                this.limparCamposDrawer = false;
            });
        },
        onPage(event) {
            this.page = event.page + 1;
            this.carregarLogs();
        },
        abrirDialog(log) {
            this.logSelecionado = log;
            this.dialogVisible = true;
        },
    },
};
</script>
