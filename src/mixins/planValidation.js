import { usePlanStore } from '@/store/plan';

export default {
    data() {
        return {
            planLoading: false
        };
    },
    computed: {
        planStore() {
            return usePlanStore();
        },
        planInfo() {
            return this.planStore.planInfo;
        },
        stats() {
            return this.planStore.stats;
        },
        isVitalicio() {
            return this.planStore.isVitalicio;
        },
        canAddPaciente() {
            return this.planStore.canAddPaciente;
        },
        canAccessDashboard() {
            return this.planStore.canAccessDashboard;
        },
        canAccessGestaoFinanceira() {
            return this.planStore.canAccessGestaoFinanceira;
        },
        canAccessProntuariosPDF() {
            return this.planStore.canAccessProntuariosPDF;
        },
        canAccessAgendamentos() {
            return this.planStore.canAccessAgendamentos;
        },
        canAccessBackupAutomatico() {
            return this.planStore.canAccessBackupAutomatico;
        },
        hasPlanData() {
            return this.planStore.hasPlanData;
        }
    },
    async mounted() {
        await this.loadPlanInfo();
    },
    methods: {
        async loadPlanInfo() {
            try {
                this.planLoading = true;
                
                // Se não tem dados no store, carregar do localStorage ou servidor
                if (!this.hasPlanData) {
                    this.planStore.loadPlanFromStorage();
                    
                    // Se ainda não tem dados, buscar do servidor
                    if (!this.hasPlanData) {
                        await this.planStore.fetchPlanInfo();
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar informações do plano:', error);
            } finally {
                this.planLoading = false;
            }
        },

        async checkFeatureAccess(feature) {
            try {
                // Usar dados do store para verificar acesso
                const planInfo = this.planInfo;
                if (!planInfo) return false;
                
                // Usuários vitalícios têm acesso total
                if (this.isVitalicio) return true;
                
                // Verificar se a feature está disponível
                return planInfo.features?.[feature] || false;
            } catch (error) {
                console.error('Erro ao verificar acesso à feature:', error);
                return false;
            }
        },

        showPlanUpgradeMessage(feature) {
            const planName = this.planInfo?.nome || 'seu plano atual';
            this.$toast.add({
                severity: 'warn',
                summary: 'Recurso não disponível',
                detail: `O recurso "${feature}" não está disponível no seu plano atual (${planName}). Faça upgrade para acessá-lo.`,
                life: 5000
            });
        },

        showPatientLimitMessage() {
            const limite = this.stats?.limite_pacientes || 0;
            const planName = this.planInfo?.nome || 'seu plano atual';
            this.$toast.add({
                severity: 'warn',
                summary: 'Limite de pacientes atingido',
                detail: `Você atingiu o limite de ${limite} pacientes do seu plano atual (${planName}). Faça upgrade para adicionar mais pacientes.`,
                life: 5000
            });
        },

        // Métodos para verificar acesso antes de executar ações
        async validateFeatureAccess(feature, action) {
            const hasAccess = await this.checkFeatureAccess(feature);
            if (!hasAccess) {
                this.showPlanUpgradeMessage(feature);
                return false;
            }
            return true;
        },

        async validatePatientLimit(action) {
            if (!this.canAddPaciente) {
                this.showPatientLimitMessage();
                return false;
            }
            return true;
        }
    }
}; 