<template>
    <DataTable :value="prontuarios" :loading="loading" tableStyle="min-width: 50rem" paginator :rows="perPage"
        :totalRecords="totalRecords" :lazy="true" @page="onPageChange"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
        <Column field="data_prontuario" header="Data"></Column>
        <Column header="Ações">
            <template #body="slotProps">
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"
                    @click="verProntuario($event, slotProps.data)" v-tooltip.top="'Ações'" />
            </template>
        </Column>

        <template #empty>
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="pi pi-file-edit text-6xl text-gray-400"></i>
                </div>
                <div class="empty-content">
                    <h3 class="empty-title">Nenhum prontuário encontrado</h3>
                    <p class="empty-description">
                        Este paciente ainda não possui prontuários registrados. Crie o primeiro prontuário para começar
                        a documentar os atendimentos.
                    </p>
                    <Button label="Criar Primeiro Prontuário" icon="pi pi-file-plus" @click="criarPrimeiroProntuario"
                        class="mt-3" />
                </div>
            </div>
        </template>
    </DataTable>

    <Popover ref="acoes" id="overlay_panel" style="width: 350px">
        <ul class="rounded-md overflow-hidden">
            <li v-if="!planStore.isPlanPaused" class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                @click="dialogEditarProntuario = true">
                <i class="fa-solid fa-pen-to-square me-2"></i>
                Prontuário
            </li>
            <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2" @click="exportarParaPdf">
                <i class="fa-solid fa-file-export me-2"></i>
                Exportar Prontuário
            </li>
            <li v-if="!planStore.isPlanPaused" class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                @click="requireConfirmation($event)">
                <i class="fa-solid fa-trash me-2"></i>
                Excluir Prontuário
            </li>
        </ul>
    </Popover>

    <DialogEditarProntuario :prontuario="prontuarioSelecionado" :visible="dialogEditarProntuario"
        @update:visible="onUpdateDialogEditarProntuario" @salvarProntuario="salvarProntuario" />

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
</template>
<script>
import DialogEditarProntuario from '@/components/dialogs/prontuarios/DialogEditarProntuario.vue';
import logoUrl from '@/assets/img/logo3_semfundo.png';
import jsPDF from 'jspdf';
import { usePlanStore } from '@/store/plan';

export default {
    name: 'ListaProntuarios',
    components: {
        DialogEditarProntuario
    },
    computed: {
        planStore() {
            return usePlanStore();
        }
    },
    props: {
        pacienteId: {
            type: String,
            required: true
        },
        prontuarios: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        totalRecords: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            perPage: 10,
            dialogEditarProntuario: false,
            prontuarioSelecionado: null,
            logoUrl: logoUrl
        }
    },

    methods: {



        onPageChange(event) {
            const page = Math.floor(event.first / event.rows) + 1;
            // Emitir evento para o componente pai buscar os dados
            this.$emit('pageChange', { page, perPage: event.rows });
        },

        onUpdateDialogEditarProntuario(visible) {
            this.dialogEditarProntuario = visible;
        },

        salvarProntuario() {
            // Emitir evento para o componente pai recarregar os dados
            this.$emit('prontuarioSalvo');
        },

        async verProntuario(event, prontuario) {
            this.prontuarioSelecionado = prontuario;
            this.$refs.acoes.show(event);
        },

        requireConfirmation(event) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: 'Deseja excluir o prontuário?',
                accept: () => {
                    this.excluirProntuario(this.prontuarioSelecionado);
                    this.$refs.acoes.hide();
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Rejeitado', detail: 'Você rejeitou a exclusão do prontuário', life: 3000 });
                }
            });
        },

        async excluirProntuario(prontuario) {
            try {
                await this.$prontuariosService.deletar(prontuario.id);
                this.$emit('prontuarioSalvo');
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Prontuário excluído com sucesso',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao excluir prontuário:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir prontuário',
                    life: 3000
                });
            }
        },

        async exportarParaPdf() {
            try {
                if (!this.prontuarioSelecionado) {
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'Atenção',
                        detail: 'Selecione um prontuário para exportar',
                        life: 3000
                    });
                    return;
                }

                await this.$prontuariosService.exportarProntuario(this.prontuarioSelecionado.id);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'PDF exportado com sucesso',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao exportar PDF:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao exportar PDF',
                    life: 3000
                });
            }
        },
        removeHtmlTags(text) {
            const div = document.createElement('div');
            div.innerHTML = text;

            return div.textContent || div.innerText || '';
        },

        criarPrimeiroProntuario() {
            // Abrir o dialog para criar o primeiro prontuário
            this.dialogEditarProntuario = true;
            this.prontuarioSelecionado = {
                paciente_id: this.pacienteId,
                data_prontuario: new Date().toISOString().split('T')[0],
                descricao: ''
            };
        }
    }
}
</script>
<style scoped>
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