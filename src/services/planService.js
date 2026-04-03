import api from '@/utils/axios';

/** Catálogo público de planos (Asaas) — GET /api/planos */
export default {
    async listarPlanosPublicos() {
        const response = await api.get('/planos');
        const body = response.data;
        if (Array.isArray(body?.planos)) return body.planos;
        if (Array.isArray(body)) return body;
        return [];
    }
};
