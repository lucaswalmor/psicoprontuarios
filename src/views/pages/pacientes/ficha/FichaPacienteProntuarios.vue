<template>
    <div class="card ficha-page">
        <FichaPacienteProntuariosTour
            :key="
                'ficha-pront-tour-' +
                !!(paciente && totalProntuarios > 0) +
                '-' +
                !!(podeEditar && paciente)
            "
            :tem-prontuarios="!!(paciente && totalProntuarios > 0)"
            :pode-criar-prontuario="!!(podeEditar && paciente)"
        />

        <PacientePaginaHeader
            title="Prontuários"
            subtitle="Registros clínicos e documentação"
            :paciente="paciente"
            @voltar="voltarParaFicha"
        >
            <template #actions>
                <span
                    v-if="paciente && totalProntuarios > 0"
                    data-tour="tour-ficha-pront-exportar"
                >
                    <Button label="Exportar Todos" icon="pi pi-file-export" severity="help" @click="exportarTodosProntuarios" />
                </span>
                <span
                    v-if="paciente && totalProntuarios > 0"
                    data-tour="tour-ficha-pront-relatorio-ia"
                >
                    <Button
                        label="Gerar relatório com I.A"
                        icon="pi pi-sparkles"
                        severity="contrast"
                        :loading="relatorioIaLoading"
                        :disabled="isPlanoPro && relatorioIaLoading"
                        :badge="!isPlanoPro ? 'PRO' : null"
                        badgeClass="p-badge-warning"
                        @click="onClickRelatorioIA"
                    />
                </span>
                <span v-if="podeEditar && paciente" data-tour="tour-ficha-pront-novo">
                    <Button label="Novo Prontuário" icon="pi pi-plus" @click="dialogNovoProntuario = true" />
                </span>
            </template>
        </PacientePaginaHeader>

        <div data-tour="tour-ficha-pront-lista">
            <ListaProntuarios
                :paciente-id="pacienteId"
                :prontuarios="prontuarios"
                :loading="loadingProntuarios"
                :total-records="totalProntuarios"
                @page-change="onPageChangeProntuarios"
                @prontuario-salvo="onProntuarioSalvo"
            />
        </div>

        <DialogNovoProntuario
            :visible="dialogNovoProntuario"
            :paciente="paciente || {}"
            :paciente-id="pacienteId"
            @update:visible="dialogNovoProntuario = $event"
            @salvarProntuario="onProntuarioSalvo"
        />

        <Dialog
            v-model:visible="dialogRelatorioIa"
            modal
            :style="{ width: 'min(90vw, 850px)' }"
            header="Relatório geral com I.A"
        >
            <div v-if="relatorioIaLoading" class="text-center p-6">
                <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                <p class="text-500 mt-3">Gerando relatório com IA...</p>
            </div>
            <div v-else-if="relatorioProntuario && relatorioProntuario.conteudo_json" class="flex flex-column gap-4">
                <div>
                    <h6 class="mb-2">Resumo</h6>
                    <p class="m-0 line-height-3">{{ relatorioProntuario.conteudo_json.resumo || 'Sem conteúdo.' }}</p>
                </div>
                <div>
                    <h6 class="mb-2">Padrões</h6>
                    <ul class="m-0 pl-3">
                        <li v-for="(padrao, index) in (relatorioProntuario.conteudo_json.padroes || [])" :key="index" class="mb-2">
                            {{ padrao }}
                        </li>
                    </ul>
                    <p v-if="!(relatorioProntuario.conteudo_json.padroes || []).length" class="m-0 text-500">Nenhum padrão identificado.</p>
                </div>
                <div>
                    <h6 class="mb-2">Evolução</h6>
                    <p class="m-0 line-height-3">{{ relatorioProntuario.conteudo_json.evolucao || 'Sem conteúdo.' }}</p>
                </div>
                <div>
                    <h6 class="mb-2">Observações</h6>
                    <p class="m-0 line-height-3">{{ relatorioProntuario.conteudo_json.observacoes || 'Sem conteúdo.' }}</p>
                </div>
                <small class="text-500">
                    Última atualização: {{ relatorioProntuario.updated_at ? new Date(relatorioProntuario.updated_at).toLocaleString('pt-BR') : '-' }}
                </small>
            </div>
            <div v-else class="text-center p-4 text-500">Nenhum relatório disponível.</div>
            <template #footer>
                <Button label="Atualizar relatório" icon="pi pi-refresh" :loading="atualizandoRelatorioIa" @click="atualizarRelatorioIA" />
                <Button label="Baixar DOCX" icon="pi pi-file-word" severity="secondary" outlined :loading="baixandoRelatorioDocx" @click="baixarRelatorioDocx" />
            </template>
        </Dialog>

        <DialogPlanoPro :visible="dialogPlanoProVisible" @update:visible="dialogPlanoProVisible = $event" />
    </div>
</template>

<script>
import ListaProntuarios from '../ListaProntuarios.vue';
import DialogNovoProntuario from '@/components/dialogs/prontuarios/DialogNovoProntuario.vue';
import DialogPlanoPro from '@/components/dialogs/DialogPlanoPro.vue';
import FichaPacienteProntuariosTour from '@/components/tour/pacientes/ficha/FichaPacienteProntuariosTour.vue';
import PacientePaginaHeader from './PacientePaginaHeader.vue';
import fichaPacienteMixin from './fichaPacienteMixin';
import prontuariosService from '@/services/prontuariosService';

export default {
    name: 'FichaPacienteProntuarios',
    components: {
        ListaProntuarios,
        DialogNovoProntuario,
        DialogPlanoPro,
        FichaPacienteProntuariosTour,
        PacientePaginaHeader
    },
    mixins: [fichaPacienteMixin],
    computed: {
        isPlanoPro() {
            return ['pro', 'vitalicio'].includes(this.$planService.resolverTipoPlanoUsuario());
        }
    },
    data() {
        return {
            prontuarios: [],
            loadingProntuarios: false,
            totalProntuarios: 0,
            currentPageProntuarios: 1,
            dialogNovoProntuario: false,
            dialogRelatorioIa: false,
            relatorioIaLoading: false,
            atualizandoRelatorioIa: false,
            relatorioProntuario: null,
            baixandoRelatorioDocx: false,
            dialogPlanoProVisible: false
        };
    },
    async mounted() {
        await this.carregarPaciente();
        this.carregarProntuarios();
    },
    methods: {
        onClickRelatorioIA() {
            if (!this.isPlanoPro) {
                this.dialogPlanoProVisible = true;
                return;
            }
            this.abrirRelatorioIA();
        },
        async carregarProntuarios() {
            this.loadingProntuarios = true;
            try {
                const response = await prontuariosService.listar(this.pacienteId, this.currentPageProntuarios);
                if (response.prontuarios) {
                    this.prontuarios = response.prontuarios;
                    this.totalProntuarios = response.pagination.total;
                } else {
                    this.prontuarios = response.data?.data || [];
                    this.totalProntuarios = response.data?.total || 0;
                }
            } catch (error) {
                console.error('Erro ao carregar prontuários:', error);
            } finally {
                this.loadingProntuarios = false;
            }
        },
        onPageChangeProntuarios(event) {
            this.currentPageProntuarios = event.page;
            this.carregarProntuarios();
        },
        onProntuarioSalvo() {
            this.dialogNovoProntuario = false;
            this.carregarProntuarios();
            this.recarregarEstatisticas();
        },
        async exportarTodosProntuarios() {
            try {
                await this.$prontuariosService.exportarTodosProntuariosPaciente(this.pacienteId);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'PDF exportado com sucesso', life: 3000 });
            } catch (error) {
                console.error('Erro ao exportar PDF:', error);
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao exportar PDF', life: 3000 });
            }
        },
        async abrirRelatorioIA() {
            this.dialogRelatorioIa = true;
            this.relatorioIaLoading = true;
            this.relatorioProntuario = null;
            try {
                const response = await this.$prontuariosService.buscarRelatorioProntuario(this.pacienteId);
                this.relatorioProntuario = response?.data || null;
            } catch (error) {
                if (error?.response?.status === 404) {
                    await this.gerarRelatorioIA();
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: error?.response?.data?.message || 'Erro ao carregar relatório.',
                        life: 5000
                    });
                    this.dialogRelatorioIa = false;
                }
            } finally {
                this.relatorioIaLoading = false;
            }
        },
        async gerarRelatorioIA() {
            const response = await this.$prontuariosService.gerarRelatorioProntuario(this.pacienteId);
            this.relatorioProntuario = response?.data || null;
            this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Relatório gerado com sucesso.', life: 3000 });
        },
        async atualizarRelatorioIA() {
            this.atualizandoRelatorioIa = true;
            try {
                await this.gerarRelatorioIA();
            } finally {
                this.atualizandoRelatorioIa = false;
            }
        },
        async baixarRelatorioDocx() {
            this.baixandoRelatorioDocx = true;
            try {
                await this.$prontuariosService.exportarRelatorioProntuarioDocx(this.pacienteId);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'DOCX exportado com sucesso.', life: 3000 });
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error?.response?.data?.message || 'Erro ao exportar DOCX.',
                    life: 5000
                });
            } finally {
                this.baixandoRelatorioDocx = false;
            }
        }
    }
};
</script>

<style scoped src="./fichaPacientePage.scss"></style>
