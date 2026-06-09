import api from '@/utils/axios';

class PreferenciasPsicologoService {
    async obter() {
        const response = await api.get('/preferencias-psicologo');
        return response.data;
    }

    async atualizar(dados) {
        const response = await api.put('/preferencias-psicologo', dados);
        return response.data;
    }
}

export default new PreferenciasPsicologoService();
