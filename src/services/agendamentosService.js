import api from '@/utils/axios';

class AgendamentosService {
    // Buscar todos os agendamentos
    async getAll(params = {}) {
        try {
            const response = await api.get('/agendamentos', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar agendamento por ID
    async getById(id) {
        try {
            const response = await api.get(`/agendamento/${id}`);
            // O backend retorna os dados diretamente, não dentro de response.data
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Criar novo agendamento
    async create(agendamentoData) {
        try {
            const response = await api.post('/agendamento', agendamentoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Atualizar agendamento
    async update(id, agendamentoData) {
        try {
            const response = await api.put(`/agendamento/${id}`, agendamentoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Deletar agendamento
    async delete(id) {
        try {
            const response = await api.delete(`/agendamento/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Deletar todas as consultas de um paciente
    async deleteAllByPatient(codigoAgendamento) {
        try {
            const response = await api.delete(`/agendamentos/${codigoAgendamento}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new AgendamentosService(); 