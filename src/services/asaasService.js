import api from '@/utils/axios';

/**
 * Service para integração com Asaas
 * API endpoints para tokenização de cartão e criação de assinaturas
 */
class AsaasService {
    /**
     * Tokenizar cartão de crédito
     */
    async tokenizarCartao(dados) {
        try {
            const response = await api.post('/assinaturas/asaas/tokenizar', dados);
            return response.data;
        } catch (error) {
            console.error('Erro ao tokenizar cartão:', error);
            throw error;
        }
    }

    /**
     * Criar ou buscar cliente na Asaas
     */
    async criarOuBuscarCliente(dadosCliente) {
        try {
            const response = await api.post('/assinaturas/asaas/cliente', dadosCliente);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar/buscar cliente:', error);
            throw error;
        }
    }

    /**
     * Criar assinatura com cartão tokenizado
     */
    async criarAssinatura(dados) {
        try {
            const response = await api.post('/assinaturas/asaas/criar', dados);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar assinatura:', error);
            throw error;
        }
    }

    /**
     * Obter assinatura ativa
     */
    async getAssinaturaAtiva() {
        try {
            const response = await api.get('/assinaturas/asaas/ativa');
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
            const response = await api.post('/assinaturas/asaas/pausar');
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
            const response = await api.post('/assinaturas/asaas/reativar');
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
            const response = await api.post('/assinaturas/asaas/cancelar', {
                motivo_cancelamento: motivo
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao cancelar assinatura:', error);
            throw error;
        }
    }
}

export default new AsaasService();

