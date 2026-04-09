import api from '@/utils/axios';

class MensagemComemorativaService {
    async getPaginated(page = 1, perPage = 10) {
        const response = await api.get('/notificacoes/datas-comemorativas', {
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

    async getDatasDisponiveis() {
        const response = await api.get('/notificacoes/datas-comemorativas/datas-disponiveis');
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
        const response = await api.post('/notificacoes/datas-comemorativas', payload);
        return response.data;
    }

    async update(id, payload) {
        const response = await api.put(`/notificacoes/datas-comemorativas/${id}`, payload);
        return response.data;
    }

    async delete(id) {
        const response = await api.delete(`/notificacoes/datas-comemorativas/${id}`);
        return response.data;
    }
}

export default new MensagemComemorativaService();
