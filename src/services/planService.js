import api from '@/utils/axios';

class PlanService {
    async getUserPlanInfo() {
        try {
            const response = await api.get('/user/plan-info');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter informações do plano:', error);
            throw error;
        }
    }

    async checkFeatureAccess(feature) {
        try {
            const response = await api.post('/user/check-feature', { feature });
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar acesso à feature:', error);
            throw error;
        }
    }

    // Métodos auxiliares para verificar recursos específicos
    async canAccessDashboard() {
        try {
            const response = await this.checkFeatureAccess('dashboard');
            return response.has_access;
        } catch (error) {
            return false;
        }
    }

    async canAccessGestaoFinanceira() {
        try {
            const response = await this.checkFeatureAccess('gestao_financeira');
            return response.has_access;
        } catch (error) {
            return false;
        }
    }

    async canAccessProntuariosPDF() {
        try {
            const response = await this.checkFeatureAccess('prontuarios_pdf');
            return response.has_access;
        } catch (error) {
            return false;
        }
    }

    async canAddPaciente() {
        try {
            const response = await this.getUserPlanInfo();
            return response.stats.can_add_paciente;
        } catch (error) {
            return false;
        }
    }

    // Obter estatísticas do usuário
    async getUserStats() {
        try {
            const response = await this.getUserPlanInfo();
            return response.stats;
        } catch (error) {
            return {
                pacientes_count: 0,
                limite_pacientes: 0,
                can_add_paciente: false,
                plano: {
                    nome: 'Sem plano',
                    limite_pacientes: 0,
                    features: {
                        dashboard: false,
                        gestao_financeira: false,
                        prontuarios_pdf: false,
                        agendamentos: false,
                        backup_automatico: false
                    }
                }
            };
        }
    }

    // Verificar se é usuário vitalício
    async isVitalicio() {
        try {
            const response = await this.getUserPlanInfo();
            return response.plano.nome === 'Vitalício';
        } catch (error) {
            return false;
        }
    }

    // Processar upgrade de plano
    async processUpgrade(paymentData) {
        try {
            const response = await api.post('/user/upgrade-plan', paymentData);
            return response.data;
        } catch (error) {
            console.error('Erro ao processar upgrade:', error);
            throw error;
        }
    }

    // Obter planos disponíveis para upgrade
    async getAvailablePlans() {
        try {
            const response = await api.get('/user/available-plans');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter planos disponíveis:', error);
            throw error;
        }
    }

    async generatePixPayment(paymentData) {
        try {
            const response = await api.post('/user/generate-pix-payment', paymentData);
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar PIX:', error);
            throw error;
        }
    }

    async checkPixStatus(paymentId) {
        try {
            const response = await api.get(`/user/pix-payment-status/${paymentId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar status PIX:', error);
            throw error;
        }
    }
}

export default new PlanService(); 