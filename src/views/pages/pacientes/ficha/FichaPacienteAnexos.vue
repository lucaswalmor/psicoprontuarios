<template>
    <div class="card ficha-page">
        <FichaPacienteAnexosTour />

        <PacientePaginaHeader
            title="Anexos"
            subtitle="Arquivos e documentos do paciente"
            :paciente="paciente"
            @voltar="voltarParaFicha"
        />

        <ListaAnexos
            :paciente-id="pacienteId"
            :anexos="anexos"
            :loading="loadingAnexos"
            :paciente="paciente"
            :status-tratamento="paciente?.status_tratamento"
            @anexo-deletado="onAnexoDeletado"
            @anexo-uploaded="onAnexoUploaded"
        />
    </div>
</template>

<script>
import ListaAnexos from '../ListaAnexos.vue';
import FichaPacienteAnexosTour from '@/components/tour/pacientes/ficha/FichaPacienteAnexosTour.vue';
import PacientePaginaHeader from './PacientePaginaHeader.vue';
import fichaPacienteMixin from './fichaPacienteMixin';
import anexosService from '@/services/anexosService';

export default {
    name: 'FichaPacienteAnexos',
    components: {
        ListaAnexos,
        FichaPacienteAnexosTour,
        PacientePaginaHeader
    },
    mixins: [fichaPacienteMixin],
    data() {
        return {
            anexos: [],
            loadingAnexos: false
        };
    },
    async mounted() {
        await this.carregarPaciente();
        this.carregarAnexos();
    },
    methods: {
        async carregarAnexos() {
            this.loadingAnexos = true;
            try {
                const response = await anexosService.listar(this.pacienteId);
                if (response.anexos) {
                    this.anexos = response.anexos;
                } else {
                    this.anexos = response.data?.data || [];
                }
            } catch (error) {
                console.error('Erro ao carregar anexos:', error);
            } finally {
                this.loadingAnexos = false;
            }
        },
        onAnexoDeletado() {
            this.carregarAnexos();
        },
        onAnexoUploaded() {
            this.carregarAnexos();
        }
    }
};
</script>

<style scoped src="./fichaPacientePage.scss"></style>
