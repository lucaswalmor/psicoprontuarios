import api from '@/utils/axios';

class NpsService {
    // Salvar pesquisa NPS
    async salvarPesquisa(dadosPesquisa) {
        try {
            const response = await api.post('/nps', dadosPesquisa);
            
            // Atualizar o usuário no sessionStorage para não mostrar o modal novamente
            const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
            usuario.pesquisa_nps = false;
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            
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
