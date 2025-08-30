<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <div class="flex align-items-center gap-3">
                <h5 class="text-500 mb-0">Lista de Sessões</h5>
                <div class="flex align-items-center gap-2">
                    <Button 
                        icon="pi pi-chevron-left" 
                        class="p-button-text p-button-sm"
                        @click="mesAnterior"
                        v-tooltip.top="'Mês anterior'"
                    />
                    <span class="text-500 font-medium">{{ periodoAtual }}</span>
                    <Button 
                        icon="pi pi-chevron-right" 
                        class="p-button-text p-button-sm"
                        @click="mesProximo"
                        v-tooltip.top="'Próximo mês'"
                    />
                </div>
            </div>
            <Button 
                v-if="!planStore.isPlanPaused"
                label="Nova Sessão" 
                icon="pi pi-plus" 
                @click="abrirDialogNovaSessao"
            />
        </div>
        
        <DataTable :value="agendamentos" :loading="loading" tableStyle="min-width: 50rem" 
                   paginator :rows="perPage" :totalRecords="totalAgendamentos" :lazy="true" 
                   @page="onPageChange">
            <Column field="data_consulta" header="Data da Consulta" sortable>
                <template #body="slotProps">
                    {{ formatarData(slotProps.data.data_consulta) }}
                </template>
            </Column>
            <Column field="hora_consulta" header="Hora" sortable>
                <template #body="slotProps">
                    {{ slotProps.data.hora_consulta }}
                </template>
            </Column>
            <Column field="nome_paciente" header="Paciente" sortable>
                <template #body="slotProps">
                    {{ slotProps.data.nome_paciente }}
                </template>
            </Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button v-if="!planStore.isPlanPaused" icon="pi pi-trash" 
                        class="p-button-text p-button-sm p-button-danger" 
                        @click="excluirAgendamento(slotProps.data, $event)"
                        v-tooltip.top="'Excluir'" />
                </template>
            </Column>
            
            <template #empty>
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="pi pi-calendar text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhuma sessão encontrada</h3>
                        <p class="empty-description">
                            Este paciente ainda não possui sessões agendadas. Clique no botão "Nova Sessão" para
                            agendar a primeira consulta.
                        </p>
                        <Button v-if="!planStore.isPlanPaused" label="Nova Sessão" icon="pi pi-calendar-plus"
                            @click="abrirDialogNovaSessao" class="mt-3" />
                    </div>
                </div>
            </template>
        </DataTable>

        <!-- Dialog Nova Sessão -->
        <DialogNovoAgendamento 
            v-model:visible="dialogNovaSessao"
            :dataSelecionada="dataAtual"
            @agendamentoSalvo="onAgendamentoSalvo"
        />
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import DialogNovoAgendamento from '@/components/dialogs/agendamentos/DialogNovoAgendamento.vue';

export default {
    name: 'ListaSessoesPacientes',
    components: {
        DialogNovoAgendamento
    },
    props: {
        pacienteId: {
            type: [String, Number],
            required: true
        }
    },
    computed: {
        planStore() {
            return usePlanStore();
        },
        dataAtual() {
            return new Date().toISOString().split('T')[0]; // Formato Y-m-d
        },
        periodoAtual() {
            const meses = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            return `${meses[this.mesAtual]} ${this.anoAtual}`;
        }
    },
    data() {
        return {
            agendamentos: [],
            loading: false,
            totalAgendamentos: 0,
            currentPage: 1,
            perPage: 10,
            dialogNovaSessao: false,
            mesAtual: new Date().getMonth(),
            anoAtual: new Date().getFullYear()
        };
    },
    mounted() {
        // Os dados serão carregados pelo componente pai quando a tab for selecionada
    },
    methods: {
        async carregarAgendamentos() {
            this.loading = true;
            try {
                const response = await this.$agendamentosService.buscarTodosAgendamentos(
                    this.pacienteId, 
                    this.currentPage,
                    this.perPage,
                    this.mesAtual + 1, // +1 porque getMonth() retorna 0-11
                    this.anoAtual
                );
                
                if (response.agendamentos) {
                    this.agendamentos = response.agendamentos;
                    this.totalAgendamentos = response.pagination.total;
                } else {
                    this.agendamentos = [];
                    this.totalAgendamentos = 0;
                }
            } catch (error) {
                console.error('Erro ao carregar agendamentos:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar agendamentos',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        
        onPageChange(event) {
            this.currentPage = event.page + 1;
            this.carregarAgendamentos();
        },
        
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        
        excluirAgendamento(agendamento, event) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: `Tem certeza que deseja excluir a sessão de ${this.formatarData(agendamento.data_consulta)} às ${agendamento.hora_consulta}?`,
                accept: async () => {
                    try {
                        await this.$agendamentosService.delete(agendamento.id);
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Sessão excluída com sucesso',
                            life: 3000
                        });
                        this.carregarAgendamentos();
                    } catch (error) {
                        console.error('Erro ao excluir sessão:', error);
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir sessão',
                            life: 3000
                        });
                    }
                },
                reject: () => {}
            });
        },
        
        abrirDialogNovaSessao() {
            this.dialogNovaSessao = true;
        },
        
        onAgendamentoSalvo() {
            this.dialogNovaSessao = false;
            this.carregarAgendamentos();
            // Emitir evento para o componente pai recarregar estatísticas
            this.$emit('agendamento-salvo');
        },
        
        mesAnterior() {
            if (this.mesAtual === 0) {
                this.mesAtual = 11;
                this.anoAtual--;
            } else {
                this.mesAtual--;
            }
            this.currentPage = 1;
            this.carregarAgendamentos();
        },
        
        mesProximo() {
            if (this.mesAtual === 11) {
                this.mesAtual = 0;
                this.anoAtual++;
            } else {
                this.mesAtual++;
            }
            this.currentPage = 1;
            this.carregarAgendamentos();
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
