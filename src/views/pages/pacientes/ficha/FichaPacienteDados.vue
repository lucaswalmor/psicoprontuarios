<template>
    <div class="card ficha-page">
        <FichaPacienteDadosTour :pode-editar="podeEditar" />

        <PacientePaginaHeader
            title="Dados Pessoais"
            subtitle="Informações cadastrais do paciente"
            :paciente="paciente"
            @voltar="voltarParaFicha"
        />

        <div v-if="loadingPaciente" class="flex justify-content-center p-5">
            <ProgressSpinner />
        </div>

        <div v-else-if="paciente" class="p-fluid" data-tour="tour-ficha-dados-form">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <label class="text-600 mb-2 block">Nome Completo</label>
                    <InputText :model-value="paciente.nome || ''" disabled class="w-full" placeholder="Nome não informado" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="text-600 mb-2 block">Telefone</label>
                    <InputMask
                        :model-value="paciente.telefone || ''"
                        disabled
                        class="w-full"
                        mask="(99) 99999-9999"
                        placeholder="Telefone não informado"
                    />
                </div>
                <div class="col-12 md:col-6">
                    <label class="text-600 mb-2 block">E-mail</label>
                    <InputText :model-value="paciente.email || ''" disabled class="w-full" placeholder="E-mail não informado" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="text-600 mb-2 block">Data de Nascimento</label>
                    <InputMask
                        :model-value="paciente.data_nascimento ? formatarData(paciente.data_nascimento) : ''"
                        disabled
                        class="w-full"
                        mask="99/99/9999"
                        placeholder="Data não informada"
                    />
                </div>
                <div class="col-12 md:col-6">
                    <label class="text-600 mb-2 block">Status do Tratamento</label>
                    <div>
                        <Tag
                            :severity="getStatusSeverity(paciente.status_tratamento)"
                            :value="paciente.status_tratamento || 'Não informado'"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressSpinner from 'primevue/progressspinner';
import FichaPacienteDadosTour from '@/components/tour/pacientes/ficha/FichaPacienteDadosTour.vue';
import PacientePaginaHeader from './PacientePaginaHeader.vue';
import fichaPacienteMixin from './fichaPacienteMixin';

export default {
    name: 'FichaPacienteDados',
    components: {
        ProgressSpinner,
        FichaPacienteDadosTour,
        PacientePaginaHeader
    },
    mixins: [fichaPacienteMixin],
    async mounted() {
        await this.carregarPaciente();
    }
};
</script>

<style scoped src="./fichaPacientePage.scss"></style>
