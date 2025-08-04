import { defineStore } from 'pinia';
import { planService } from '@/services';

export const usePlanStore = defineStore('plan', {
    state: () => ({
        planInfo: null,
        stats: null,
        loading: false,
        error: null
    }),

    getters: {
        // Getters para facilitar o acesso às features
        isVitalicio: (state) => state.planInfo?.nome === 'Vitalício',
        canAccessDashboard: (state) => state.planInfo?.features?.dashboard || false,
        canAccessGestaoFinanceira: (state) => state.planInfo?.features?.gestao_financeira || false,
        canAccessProntuariosPDF: (state) => state.planInfo?.features?.prontuarios_pdf || false,
        canAccessAgendamentos: (state) => state.planInfo?.features?.agendamentos || false,
        canAccessBackupAutomatico: (state) => state.planInfo?.features?.backup_automatico || false,
        
        // Getters para estatísticas
        canAddPaciente: (state) => state.stats?.can_add_paciente || false,
        pacientesCount: (state) => state.stats?.pacientes_count || 0,
        limitePacientes: (state) => state.stats?.limite_pacientes || 0,
        
        // Getter para verificar se tem dados carregados
        hasPlanData: (state) => state.planInfo !== null && state.stats !== null
    },

    actions: {
        async fetchPlanInfo() {
            try {
                this.loading = true;
                this.error = null;
                
                const response = await planService.getUserPlanInfo();
                
                this.planInfo = response.plano;
                this.stats = response.stats;
                
                // Salvar no localStorage para persistência
                localStorage.setItem('userPlanInfo', JSON.stringify(response.plano));
                localStorage.setItem('userStats', JSON.stringify(response.stats));
                
            } catch (error) {
                console.error('Erro ao buscar informações do plano:', error);
                this.error = error.message || 'Erro ao carregar informações do plano';
            } finally {
                this.loading = false;
            }
        },

        loadPlanFromStorage() {
            try {
                const planInfo = localStorage.getItem('userPlanInfo');
                const stats = localStorage.getItem('userStats');
                
                if (planInfo && stats) {
                    this.planInfo = JSON.parse(planInfo);
                    this.stats = JSON.parse(stats);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do plano do localStorage:', error);
            }
        },

        clearPlanData() {
            this.planInfo = null;
            this.stats = null;
            this.error = null;
            localStorage.removeItem('userPlanInfo');
            localStorage.removeItem('userStats');
        }
    }
}); 