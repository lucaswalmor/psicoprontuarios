import api from '@/utils/axios';

class MensagemPersonalizadaService {
    async getPaginated(page = 1, perPage = 10) {
        const response = await api.get('/notificacoes/personalizadas', {
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

    async create(payload) {
        const response = await api.post('/notificacoes/personalizadas', payload);
        return response.data;
    }

    async update(id, payload) {
        const response = await api.put(`/notificacoes/personalizadas/${id}`, payload);
        return response.data;
    }

    async delete(id) {
        const response = await api.delete(`/notificacoes/personalizadas/${id}`);
        return response.data;
    }
}

export default new MensagemPersonalizadaService();

