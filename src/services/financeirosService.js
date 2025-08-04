import api from '@/utils/axios';

const financeirosService = {
    // Buscar transações com filtros
    buscar(params = {}) {
        return api.get('/financeiros', { params });
    },

    // Cadastrar nova transação
    cadastrar(data) {
        return api.post('/financeiros', data);
    },

    // Atualizar transação
    atualizar(id, data) {
        return api.put(`/financeiros/${id}`, data);
    },

    // Excluir transação
    excluir(id) {
        return api.delete(`/financeiros/${id}`);
    },

    // Buscar dados do dashboard
    dashboard(params = {}) {
        return api.get('/financeiros/dashboard', { params });
    }
};

export default financeirosService; 