import api from '@/utils/axios';

/**
 * Service para integração com Mercado Pago
 * Endpoints da API para checkout e gestão de assinaturas
 */
class MercadoPagoService {
    /**
     * Criar checkout para assinatura
     */
    async criarCheckout(planoId) {
        try {
            const response = await api.post('/assinaturas/checkout', { plano_id: planoId });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar checkout:', error);
            throw error;
        }
    }

    /**
     * Validar pagamento e criar assinatura
     */
    async validarCheckout(preApprovalId, planoId, externalReference = null) {
        try {
            const response = await api.post('/assinaturas/validar', {
                preapproval_id: preApprovalId,
                plano_id: planoId,
                external_reference: externalReference
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao validar checkout:', error);
            throw error;
        }
    }

    /**
     * Obter assinatura ativa
     */
    async getAssinaturaAtiva() {
        try {
            const response = await api.get('/assinaturas/ativa');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter assinatura ativa:', error);
            throw error;
        }
    }

    /**
     * Pausar assinatura
     */
    async pausarAssinatura() {
        try {
            const response = await api.post('/assinaturas/pausar');
            return response.data;
        } catch (error) {
            console.error('Erro ao pausar assinatura:', error);
            throw error;
        }
    }

    /**
     * Reativar assinatura
     */
    async reativarAssinatura() {
        try {
            const response = await api.post('/assinaturas/reativar');
            return response.data;
        } catch (error) {
            console.error('Erro ao reativar assinatura:', error);
            throw error;
        }
    }

    /**
     * Cancelar assinatura
     */
    async cancelarAssinatura(motivo = null) {
        try {
            const response = await api.delete('/assinaturas/cancelar', {
                data: { motivo_cancelamento: motivo }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao cancelar assinatura:', error);
            throw error;
        }
    }
}

export default new MercadoPagoService();

