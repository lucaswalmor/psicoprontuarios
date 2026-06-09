import api from '@/utils/axios';

class LogsPsicologosService {
    async listar(params = {}) {
        const response = await api.get('/logs-psicologos', { params });
        return response.data;
    }

    async buscarPorId(id) {
        const response = await api.get(`/logs-psicologos/${id}`);
        return response.data;
    }
}

export default new LogsPsicologosService();
