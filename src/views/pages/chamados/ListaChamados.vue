<script>
export default {
    name: 'ListaChamados',
    data() {
        return {
            chamados: [],
            loading: false,
            busca: '',
            filtroStatus: null,
            rows: 10,
            page: 1,
            totalRecords: 0,
            statusOptions: [
                { label: 'Aberto', value: 'aberto' },
                { label: 'Em andamento', value: 'em_andamento' },
                { label: 'Respondido', value: 'respondido' },
                { label: 'Fechado', value: 'fechado' }
            ]
        };
    },
    mounted() {
        this.carregar();
    },
    methods: {
        async carregar() {
            this.loading = true;
            try {
                const response = await this.$chamadosService.listar({
                    page: this.page,
                    per_page: this.rows,
                    status: this.filtroStatus || undefined,
                    busca: this.busca || undefined
                });

                this.chamados = response.data || [];
                this.totalRecords = response.meta?.total || this.chamados.length;
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os chamados.',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        aplicarFiltros() {
            this.page = 1;
            this.carregar();
        },
        limparFiltros() {
            this.busca = '';
            this.filtroStatus = null;
            this.page = 1;
            this.carregar();
        },
        onPage(event) {
            this.page = event.page + 1;
            this.rows = event.rows;
            this.carregar();
        },
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value.replace(' ', 'T'));
            if (Number.isNaN(date.getTime())) return value;
            return date.toLocaleString('pt-BR');
        },
        statusSeverity(status) {
            if (status === 'aberto') return 'info';
            if (status === 'em_andamento') return 'warn';
            if (status === 'respondido') return 'secondary';
            if (status === 'fechado') return 'success';
            return null;
        }
    }
};
</script>

<template>
    <div class="card">
        <div class="header-row">
            <div>
                <h1 class="page-title">Meus Chamados</h1>
                <p class="page-subtitle">Acompanhe os atendimentos e respostas do suporte.</p>
            </div>
            <Button label="Novo Chamado" icon="pi pi-plus" @click="$router.push('/chamados/novo')" />
        </div>

        <div class="filters-row">
            <InputText v-model="busca" placeholder="Buscar por título ou mensagem..." @keyup.enter="aplicarFiltros" />
            <Dropdown
                v-model="filtroStatus"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Status"
                showClear
                class="w-full md:w-14rem"
            />
            <Button label="Filtrar" icon="pi pi-filter" severity="secondary" @click="aplicarFiltros" />
            <Button label="Limpar" text @click="limparFiltros" />
        </div>

        <DataTable
            :value="chamados"
            :loading="loading"
            paginator
            lazy
            :rows="rows"
            :totalRecords="totalRecords"
            tableStyle="min-width: 50rem"
            @page="onPage"
        >
            <Column field="titulo" header="Título" />
            <Column header="Tema">
                <template #body="slotProps">
                    {{ slotProps.data.tema?.nome || '-' }}
                </template>
            </Column>
            <Column header="Status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="statusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="Última resposta">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.ultima_resposta_em || slotProps.data.updated_at) }}
                </template>
            </Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button
                        label="Abrir"
                        size="small"
                        icon="pi pi-comments"
                        @click="$router.push(`/chamados/${slotProps.data.id}`)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.filters-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.page-title {
    margin: 0;
}

.page-subtitle {
    margin: 0.25rem 0 0;
    color: #6b7280;
}

@media (max-width: 768px) {
    .header-row {
        flex-direction: column;
        align-items: stretch;
    }

    .filters-row {
        grid-template-columns: 1fr;
    }
}
</style>
