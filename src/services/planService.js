import api from '@/utils/axios';

class PlanService {
    // === MÉTODOS PRINCIPAIS ===
    
    // Obter módulos de acesso do usuário (novo endpoint)
    async getModulosAcesso() {
        try {
            const response = await api.get('/user/modulos-acesso');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter módulos de acesso:', error);
            throw error;
        }
    }

    // Verificar acesso a módulo específico
    async verificarAcessoModulo(moduloChave) {
        try {
            const response = await api.get(`/user/verificar-acesso/${moduloChave}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao verificar acesso ao módulo:', error);
            throw error;
        }
    }

    /** Catálogo público de planos ativos (tabela `planos`) — `GET /planos` */
    async listarPlanosPublicos() {
        const response = await api.get('/planos');
        const body = response.data;
        if (Array.isArray(body?.planos)) return body.planos;
        if (Array.isArray(body)) return body;
        return [];
    }

    // === MÉTODOS STRIPE ===

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

    // === MÉTODOS DE COMPATIBILIDADE (para código antigo) ===
    
    // Manter para compatibilidade com código antigo
    async getUserPlanInfo() {
        return this.getModulosAcesso();
    }

    async getUserStats() {
        try {
            const response = await this.getModulosAcesso();
            return response.stats;
        } catch (error) {
            return {
                pacientes_count: 0,
                anexos_count: 0,
                can_add_paciente: false,
                can_add_anexo: false
            };
        }
    }

    // Métodos auxiliares simplificados (delegam para o store)
    async canAccessDashboard() {
        try {
            const response = await this.verificarAcessoModulo('dashboard');
            return response.has_access;
        } catch (error) {
            return false;
        }
    }

    async canAccessGestaoFinanceira() {
        try {
            const response = await this.verificarAcessoModulo('gestao_financeira');
            return response.has_access;
        } catch (error) {
            return false;
        }
    }

    async canAccessProntuariosPDF() {
        try {
            const response = await this.verificarAcessoModulo('prontuarios_pdf');
            return response.has_access;
        } catch (error) {
            return false;
        }
    }

    async canAddPaciente() {
        try {
            const response = await this.getModulosAcesso();
            return response.stats.can_add_paciente;
        } catch (error) {
            return false;
        }
    }

    async isVitalicio() {
        try {
            const response = await this.getModulosAcesso();
            return response.plano_id === 4;
        } catch (error) {
            return false;
        }
    }
}

export default new PlanService();