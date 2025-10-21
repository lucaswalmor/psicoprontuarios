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

    // Verificar status de pagamento
    async verificarStatusPagamento() {
        try {
            const response = await api.get('/assinatura/verificar-status');
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar status de pagamento:', error);
            throw error;
        }
    }

    // Atualizar cartão de crédito
    async atualizarCartao(dadosCartao) {
        try {
            const response = await api.post('/assinatura/atualizar-cartao', dadosCartao);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar cartão:', error);
            throw error;
        }
    }

    // === NOVOS MÉTODOS STRIPE ===

    // Criar checkout session para assinatura
    async criarCheckoutSession(planoId) {
        try {
            const response = await api.post('/assinaturas/checkout-session', { plano_id: planoId });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar checkout session:', error);
            throw error;
        }
    }

    // Validar checkout bem-sucedido
    async validarCheckoutSucesso(sessionId) {
        try {
            const response = await api.get(`/assinaturas/validar-checkout?session_id=${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao validar checkout:', error);
            throw error;
        }
    }

    // Obter assinatura ativa
    async getAssinaturaAtiva() {
        try {
            const response = await api.get('/assinaturas/ativa');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter assinatura ativa:', error);
            throw error;
        }
    }

    // Verificar status da assinatura
    async checkStatusAssinatura(assinaturaId) {
        try {
            const response = await api.get(`/assinaturas/${assinaturaId}/status`);
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar status da assinatura:', error);
            throw error;
        }
    }

    // Pausar assinatura
    async pausarAssinatura(assinaturaId) {
        try {
            const response = await api.post(`/assinaturas/${assinaturaId}/pausar`);
            return response.data;
        } catch (error) {
            console.error('Erro ao pausar assinatura:', error);
            throw error;
        }
    }

    // Reativar assinatura
    async reativarAssinatura(assinaturaId) {
        try {
            const response = await api.post(`/assinaturas/${assinaturaId}/reativar`);
            return response.data;
        } catch (error) {
            console.error('Erro ao reativar assinatura:', error);
            throw error;
        }
    }

    // Atualizar método de pagamento
    async atualizarMetodoPagamento(assinaturaId, paymentMethodId) {
        try {
            const response = await api.put(`/assinaturas/${assinaturaId}/metodo-pagamento`, {
                payment_method_id: paymentMethodId
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar método de pagamento:', error);
            throw error;
        }
    }

    // Cancelar assinatura
    async cancelarAssinatura(assinaturaId, motivo = null) {
        try {
            const response = await api.delete(`/assinaturas/${assinaturaId}`, {
                data: { motivo_cancelamento: motivo }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao cancelar assinatura:', error);
            throw error;
        }
    }

    // Obter módulos de acesso
    async getModulosAcesso() {
        try {
            const response = await api.get('/modulos/acesso');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter módulos de acesso:', error);
            throw error;
        }
    }

    // Verificar acesso a módulo específico
    async verificarAcessoModulo(moduloChave) {
        try {
            const response = await api.post('/modulos/verificar-acesso', {
                modulo_chave: moduloChave
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar acesso ao módulo:', error);
            throw error;
        }
    }

    // Obter informações completas de acesso
    async getInformacoesAcesso() {
        try {
            const response = await api.get('/modulos/informacoes-acesso');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter informações de acesso:', error);
            throw error;
        }
    }
}

export default new PlanService();