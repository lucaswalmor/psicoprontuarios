<template>
    <div class="card ficha-page">
        <FichaPacienteSessoesTour
            :key="'ficha-sess-tour-' + !planStore.isPlanPaused"
            :mostrar-nova-sessao="!planStore.isPlanPaused"
        />

        <PacientePaginaHeader
            title="Sessões"
            subtitle="Agendamentos e histórico de atendimentos"
            :paciente="paciente"
            @voltar="voltarParaFicha"
        />

        <ListaSessoesPacientes
            v-if="pacienteId && paciente"
            ref="listaSessoes"
            :paciente-id="pacienteId"
            :paciente="paciente"
            :status-tratamento="paciente?.status_tratamento"
            @agendamento-salvo="onAgendamentoSalvo"
        />
        <div v-else class="flex justify-content-center p-5">
            <ProgressSpinner />
        </div>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import ProgressSpinner from 'primevue/progressspinner';
import ListaSessoesPacientes from '../ListaSessoesPacientes.vue';
import FichaPacienteSessoesTour from '@/components/tour/pacientes/ficha/FichaPacienteSessoesTour.vue';
import PacientePaginaHeader from './PacientePaginaHeader.vue';
import fichaPacienteMixin from './fichaPacienteMixin';

export default {
    name: 'FichaPacienteSessoes',
    components: {
        ProgressSpinner,
        ListaSessoesPacientes,
        FichaPacienteSessoesTour,
        PacientePaginaHeader
    },
    mixins: [fichaPacienteMixin],
    computed: {
        planStore() {
            return usePlanStore();
        }
    },
    async mounted() {
        await this.carregarPaciente();
    },
    methods: {
        onAgendamentoSalvo() {
            this.$refs.listaSessoes?.carregarAgendamentos();
        }
    }
};
</script>

<style scoped src="./fichaPacientePage.scss"></style>
