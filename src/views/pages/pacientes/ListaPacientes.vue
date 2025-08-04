<template>
    <div class="card">
        <h1>Lista de Pacientes</h1>

        <div class="col-md-12 d-flex gap-2 mb-3">
            <Button label="Filtros" severity="secondary" icon="pi pi-filter" v-if="!hasFiltros"
                @click="drawerFilterPaciente = true" />
            <Button label="Limpar Filtros" severity="danger" @click="limparFiltros" v-else />
            <Button label="Novo Paciente" icon="pi pi-user-plus" @click="$router.push('/pacientes/cadastro')" />
        </div>

        <DataTable :value="pacientes" :loading="loading" tableStyle="min-width: 50rem" paginator :rows="perPage"
            :totalRecords="totalRecords" :lazy="true" @page="onPageChange"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
            <Column field="nome" header="Nome" sortable></Column>
            <Column field="telefone" header="Telefone"></Column>
            <Column field="status_tratamento" header="Status" sortable>
                <template #body="slotProps">
                    <Tag :severity="getStatusTratamento(slotProps.data.status_tratamento)"
                        :value="slotProps.data.status_tratamento"></Tag>
                </template>
            </Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"
                        @click="verPaciente($event, slotProps.data)" v-tooltip.top="'Ações'" />
                </template>
            </Column>
            
            <template #empty>
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="pi pi-users text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhum paciente encontrado</h3>
                        <p class="empty-description">
                            {{ hasFiltros ? 'Nenhum paciente corresponde aos filtros aplicados.' : 'Comece adicionando seu primeiro paciente para organizar seus atendimentos.' }}
                        </p>
                        <Button 
                            v-if="!hasFiltros"
                            label="Adicionar Primeiro Paciente" 
                            icon="pi pi-user-plus" 
                            @click="$router.push('/pacientes/cadastro')"
                            class="mt-3"
                        />
                        <Button 
                            v-else
                            label="Limpar Filtros" 
                            icon="pi pi-filter-slash" 
                            severity="secondary"
                            @click="limparFiltros"
                            class="mt-3"
                        />
                    </div>
                </div>
            </template>
        </DataTable>

        <Popover ref="acoes" id="overlay_panel" style="width: 350px">
            <ul class="rounded-md overflow-hidden">
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="$router.push(`/pacientes/prontuarios/${pacienteSelecionado.id}`)">
                    <i class="fa-solid fa-folder-tree me-2"></i>
                    Prontuários
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="dialogNovoProntuario = true">
                    <i class="fa-solid fa-folder-plus me-2"></i>
                    Novo Prontuário
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="$router.push(`/pacientes/anexos/${pacienteSelecionado.id}`)">
                    <i class="fa-solid fa-paperclip me-2"></i>
                    Anexar Arquivo
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="dialogAlterarStatus = true">
                    <i class="fa-solid fa-edit me-2"></i>
                    Alterar Status
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="editarPaciente(pacienteSelecionado.id)">
                    <i class="fa-solid fa-user-pen me-2"></i>
                    Editar Paciente
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="requireConfirmation($event)">
                    <i class="fa-solid fa-user-xmark me-2"></i>
                    Excluir Paciente
                </li>
            </ul>
        </Popover>

        <ConfirmPopup group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="rounded p-4">
                    <span>{{ message.message }}</span>
                    <div class="flex items-center gap-2 mt-4">
                        <Button label="Não" variant="outlined" @click="rejectCallback" severity="secondary" size="small"
                            text></Button>
                        <Button label="Sim" @click="acceptCallback" size="small"></Button>
                    </div>
                </div>
            </template>
        </ConfirmPopup>

        <DrawerFilterPacientes :limparCampos="limparCampos" :visible="drawerFilterPaciente"
            @update:visible="onUpdateDrawerFilterPaciente" @filtrarPacientes="filtrarPacientes" />

        <DialogNovoProntuario :visible="dialogNovoProntuario" @update:visible="onUpdateDialogNovoProntuario"
            :paciente="pacienteSelecionado" @salvarProntuario="salvarProntuario" />

        <DialogAlterarStatus 
            :visible="dialogAlterarStatus" 
            :paciente="pacienteSelecionado"
            @update:visible="onUpdateDialogAlterarStatus"
            @status-alterado="onStatusAlterado" 
        />
    </div>
</template>

<script>
import DrawerFilterPacientes from '@/components/drawers/DrawerFilterPacientes.vue';
import DialogNovoProntuario from '@/components/dialogs/prontuarios/DialogNovoProntuario.vue';
import DialogAlterarStatus from '@/components/dialogs/pacientes/DialogAlterarStatus.vue';

export default {
    name: 'ListaPacientes',
    components: {
        DrawerFilterPacientes,
        DialogNovoProntuario,
        DialogAlterarStatus
    },
    data() {
        return {
            pacientes: [],
            loading: false,
            totalRecords: 0,
            currentPage: 1,
            perPage: 10,
            drawerFilterPaciente: false,
            hasFiltros: false,
            limparCampos: false,
            dialogNovoProntuario: false,
            dialogAlterarStatus: false,
            pacienteSelecionado: null
        };
    },
    async mounted() {
        await this.carregarPacientes();
    },
    methods: {
        async carregarPacientes(filtros = {}) {
            try {
                this.loading = true;
                const response = await this.$pacientesService.getPaginated(
                    this.currentPage,
                    this.perPage,
                    filtros
                );
                this.pacientes = response.data || [];
                this.totalRecords = response.pagination.total || 0;
            } catch (error) {
                console.error('Erro ao carregar pacientes:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar lista de pacientes',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        filtrarPacientes(filtro) {
            const filtros = {
                nome: filtro.nome || '',
                email: filtro.email || '',
                telefone: filtro.telefone || ''
            };
            this.carregarPacientes(filtros);
            this.hasFiltros = true;
            this.drawerFilterPaciente = false;
        },

        limparFiltros() {
            this.hasFiltros = false;
            this.drawerFilterPaciente = false;
            this.limparCampos = true;
            this.carregarPacientes();
        },

        async onPageChange(event) {
            this.currentPage = event.page + 1;
            this.perPage = event.rows;
            await this.carregarPacientes();
        },

        async verPaciente(event, paciente) {
            this.pacienteSelecionado = paciente;
            this.$refs.acoes.show(event);
        },

        async editarPaciente(id) {
            // Navegar para página de edição
            this.$router.push(`/pacientes/editar/${id}`);
        },
        getStatusTratamento(status) {
            switch (status) {
                case 'Concluído':
                    return 'success';
                case 'Recesso':
                    return 'warn';
                default:
                    return 'help';
            }
        },
        onUpdateDrawerFilterPaciente(event) {
            this.drawerFilterPaciente = event;
        },
        onUpdateDialogNovoProntuario(event) {
            this.dialogNovoProntuario = event;
            this.pacienteSelecionado = null;
        },

        onUpdateDialogAlterarStatus(event) {
            this.dialogAlterarStatus = event;
            this.$refs.acoes.hide();
        },

        onStatusAlterado() {
            this.carregarPacientes();
        },

        salvarProntuario() {
            this.dialogNovoProntuario = false;
            this.carregarPacientes();
        },

        requireConfirmation(event) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: 'Tem certeza que deseja excluir este paciente?',
                accept: () => {
                    this.deletarPaciente(this.pacienteSelecionado.id);
                    this.$refs.acoes.hide();
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Rejeitado', detail: 'Você rejeitou a exclusão do prontuário', life: 3000 });
                }
            });
        },

        async deletarPaciente(id) {
            await this.$pacientesService.delete(id);
            this.carregarPacientes();
            this.$toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Paciente excluído com sucesso',
                life: 3000
            });
        },
    }
};
</script>

<style scoped>
.card {
    padding: 2rem;
}

h1 {
    margin-bottom: 2rem;
    color: var(--text-color);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
}

.empty-icon {
    margin-bottom: 1rem;
}

.empty-content {
    max-width: 400px;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.empty-description {
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.mt-3 {
    margin-top: 0.75rem;
}
</style>