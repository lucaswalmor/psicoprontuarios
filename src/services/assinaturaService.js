import api from '@/utils/axios';

/** Assinatura Asaas + faturas (painel do usuário) */
export default {
    async getPainel() {
        const { data } = await api.get('/assinatura/painel');
        return data;
    }
};
