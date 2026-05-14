import api from '@/utils/axios';

const financeirosService = {
    // Buscar transações com filtros
    buscar(params = {}) {
        return api.get('/financeiros', { params });
    },

    // Buscar transação por ID
    buscarPorId(id) {
        return api.get(`/financeiros/${id}`);
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
    },

    // === CATEGORIAS FINANCEIRAS ===
    
    // Buscar categorias do usuário
    buscarCategorias() {
        return api.get('/categoria-financeiro');
    },

    // Cadastrar nova categoria
    cadastrarCategoria(data) {
        return api.post('/categoria-financeiro', data);
    },

    // Atualizar categoria
    atualizarCategoria(id, data) {
        return api.put(`/categoria-financeiro/${id}`, data);
    },

    // Excluir categoria
    excluirCategoria(id) {
        return api.delete(`/categoria-financeiro/${id}`);
    },

    // Pagar/Receber transações em lote
    pagarEmLote(ids) {
        return api.post('/financeiros/pagar-lote', { ids });
    },

    /**
     * PDF da listagem (receita ou despesa), mesmo período/filtros da tela.
     * @param {Object} params — obrigatório: tipo 'receita'|'despesa'; opcional: data_inicial, data_final, categoria
     */
    exportarPdf(params) {
        return api.get('/financeiros/exportar-pdf', {
            params,
            responseType: 'blob',
            headers: { Accept: 'application/pdf' }
        });
    }
};

export default financeirosService; 