import api from '@/utils/axios';

class NpsService {
    // Salvar pesquisa NPS
    async salvarPesquisa(dadosPesquisa) {
        try {
            const response = await api.post('/nps', dadosPesquisa);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se precisa responder pesquisa NPS
    async verificarNpsRequired() {
        try {
            const response = await api.get('/nps/check');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar histórico de pesquisas NPS
    async buscarHistorico() {
        try {
            const response = await api.get('/nps/historico');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new NpsService();
