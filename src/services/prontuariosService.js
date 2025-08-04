import api from '@/utils/axios';

class ProntuariosService {
    // Buscar todos os prontuários
    async getAll(params = {}) {
        try {
            const response = await api.get('/prontuario', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar prontuário por ID
    async getById(id) {
        try {
            const response = await api.get(`/prontuario/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar prontuário por paciente
    async getByPaciente(pacienteId) {
        try {
            const response = await api.get(`/prontuario/paciente/${pacienteId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Criar novo prontuário
    async create(data) {
        try {
            const response = await api.post(`/prontuario/paciente/${data.paciente.id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Atualizar prontuário
    async update(id, data) {
        try {
            const response = await api.put(`/prontuario/paciente/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Deletar prontuário
    async delete(id) {
        try {
            const response = await api.delete(`/prontuario/paciente/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Exportar prontuário para PDF
    async exportarParaPdf(id) {
        try {
            const response = await api.get(`/prontuario/${id}/exportar`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar prontuários com paginação
    async getPaginatedByPaciente(pacienteId, page = 1, perPage = 10, filters = {}) {
        try {
            const params = {
                page,
                per_page: perPage,
                ...filters
            };
            const response = await api.get(`/prontuario/paciente/${pacienteId}`, { params });
            
            // Retorna o formato do backend: { prontuarios: [...], pagination: {...} }
            return {
                data: response.data.prontuarios || [],
                pagination: response.data.pagination || {}
            };
        } catch (error) {
            throw error;
        }
    }

    // Buscar prontuários com paginação
    async getPaginated(page = 1, perPage = 10, filters = {}) {
        try {
            const params = {
                page,
                per_page: perPage,
                ...filters
            };
            const response = await api.get(`/prontuario/paciente/${pacienteId}`, { params });
            
            // Retorna o formato do backend: { prontuarios: [...], pagination: {...} }
            return {
                data: response.data.prontuarios || [],
                pagination: response.data.pagination || {}
            };
        } catch (error) {
            throw error;
        }
    }

    // Adicionar anotação ao prontuário
    async addAnotacao(id, anotacao) {
        try {
            const response = await api.post(`/prontuario/${id}/anotacoes`, anotacao);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProntuariosService(); 