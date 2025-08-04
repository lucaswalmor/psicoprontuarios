import api from '@/utils/axios';

class PacientesService {
    // Buscar todos os pacientes
    async getAll(params = {}) {
        try {
            const response = await api.get('/pacientes', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar paciente por ID
    async getById(id) {
        try {
            const response = await api.get(`/paciente/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Criar novo paciente
    async create(pacienteData) {
        try {
            const response = await api.post('/paciente', pacienteData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Atualizar paciente
    async update(id, pacienteData) {
        try {
            const response = await api.put(`/paciente/${id}`, pacienteData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Deletar paciente
    async delete(id) {
        try {
            const response = await api.delete(`/paciente/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar pacientes com paginação
    async getPaginated(page = 1, perPage = 10, filters = {}) {
        try {
            const params = {
                page,
                per_page: perPage,
                ...filters
            };
            const response = await api.get('/paciente', { params });
            
            // Retorna o formato do backend: { pacientes: [...], pagination: {...} }
            return {
                data: response.data.pacientes || [],
                pagination: response.data.pagination || {}
            };
        } catch (error) {
            throw error;
        }
    }

    // Alterar status de tratamento do paciente
    async alterarStatus(id, status, psicologoId) {
        try {
            const response = await api.put(`paciente/status/${id}`, {
                status_tratamento: status,
                psicologo: psicologoId
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new PacientesService(); 