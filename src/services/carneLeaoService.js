import api from '@/utils/axios';

class CarneLeaoService {
    // Listar carne leão com filtros
    async getList(filters = {}) {
        try {
            const response = await api.get('/carne-leao', { params: filters });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar carne leão por ID
    async getById(id) {
        try {
            const response = await api.get(`/carne-leao/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Simular cálculo (não salva na tabela)
    async simular(data) {
        try {
            const response = await api.post('/carne-leao/simular', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Calcular e salvar na tabela
    async calcular(data) {
        try {
            const response = await api.post('/carne-leao/calcular', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Exportar PDF
    async exportarPDF(id) {
        try {
            const response = await api.post(`/carne-leao/${id}/exportar-pdf`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Download PDF
    async downloadPDF(id) {
        try {
            const response = await api.get(`/carne-leao/${id}/download-pdf`, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Deletar carne leão
    async delete(id) {
        try {
            const response = await api.delete(`/carne-leao/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar tributos
    async getTributos() {
        try {
            const response = await api.get('/tributos');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new CarneLeaoService();
