import api from '@/utils/axios';

class MensagemAniversarianteService {
    async getPaginated(page = 1, perPage = 10) {
        const response = await api.get('/notificacoes/aniversariantes', {
            params: { page, per_page: perPage },
        });

        return {
            data: response.data?.data || [],
            pagination: {
                total: response.data?.total || 0,
                current_page: response.data?.current_page || 1,
                per_page: response.data?.per_page || perPage,
            },
        };
    }

    async getTemplates() {
        const response = await api.get('/notificacoes/aniversariantes/templates');
        return response.data?.data || [];
    }

    async getPacientesDisponiveis() {
        const response = await api.get('/pacientes', {
            params: {
                status: 'Em Andamento',
                com_telefone: 1,
                sem_paginacao: 1,
            },
        });
        return response.data || [];
    }

    async create(payload) {
        const response = await api.post('/notificacoes/aniversariantes', payload);
        return response.data;
    }

    async update(id, payload) {
        const response = await api.put(`/notificacoes/aniversariantes/${id}`, payload);
        return response.data;
    }

    async delete(id) {
        const response = await api.delete(`/notificacoes/aniversariantes/${id}`);
        return response.data;
    }
}

export default new MensagemAniversarianteService();
