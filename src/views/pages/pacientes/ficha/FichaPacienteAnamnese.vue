<template>
    <div class="card ficha-page">
        <FichaPacienteAnamneseTour />

        <PacientePaginaHeader
            title="Anamnese"
            subtitle="Formulário inicial e histórico clínico"
            :paciente="paciente"
            @voltar="voltarParaFicha"
        />

        <Anamnese
            ref="anamnese"
            :paciente-id="pacienteId"
            :status-tratamento="paciente?.status_tratamento"
        />
    </div>
</template>

<script>
import Anamnese from '@/components/pacientes/Anamnese.vue';
import FichaPacienteAnamneseTour from '@/components/tour/pacientes/ficha/FichaPacienteAnamneseTour.vue';
import PacientePaginaHeader from './PacientePaginaHeader.vue';
import fichaPacienteMixin from './fichaPacienteMixin';

export default {
    name: 'FichaPacienteAnamnese',
    components: {
        Anamnese,
        FichaPacienteAnamneseTour,
        PacientePaginaHeader
    },
    mixins: [fichaPacienteMixin],
    async mounted() {
        await this.carregarPaciente();
        this.$refs.anamnese?.carregarAnamnese();
    }
};
</script>

<style scoped src="./fichaPacientePage.scss"></style>
