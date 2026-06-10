import { usePlanStore } from '@/store/plan';

export default {
    computed: {
        planStore() {
            return usePlanStore();
        },
        pacienteId() {
            return this.$route.params.id;
        },
        podeEditar() {
            if (this.planStore.isGratuito || this.planStore.isVitalicio) {
                return true;
            }
            return this.planStore.podeEditarDados;
        }
    },
    data() {
        return {
            paciente: null,
            loadingPaciente: false,
            estatisticas: {
                sessoes_agendadas: 0,
                sessoes_realizadas: 0,
                sessoes_pendentes: 0,
                total_anexos: 0
            }
        };
    },
    methods: {
        async carregarPaciente() {
            if (!this.pacienteId) return;
            this.loadingPaciente = true;
            try {
                this.paciente = await this.$pacientesService.getById(this.pacienteId);
            } catch (error) {
                console.error('Erro ao carregar dados do paciente:', error);
                this.$toast?.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do paciente',
                    life: 3000
                });
            } finally {
                this.loadingPaciente = false;
            }
        },
        async carregarEstatisticas() {
            if (!this.pacienteId) return;
            try {
                const response = await this.$pacientesService.buscarEstatisticas(this.pacienteId);
                if (response.sessoes_agendadas !== undefined) {
                    this.estatisticas = response;
                } else if (response.data) {
                    this.estatisticas = response.data;
                }
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        },
        recarregarEstatisticas() {
            return this.carregarEstatisticas();
        },
        recarregarDadosPaciente() {
            return this.carregarPaciente();
        },
        voltarParaFicha() {
            this.$router.push(`/pacientes/ficha/${this.pacienteId}`);
        },
        getStatusSeverity(status) {
            const severities = {
                'Em Tratamento': 'info',
                'Concluído': 'success',
                'Pausado': 'warning',
                'Cancelado': 'danger'
            };
            return severities[status] || 'info';
        },
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        }
    }
};
