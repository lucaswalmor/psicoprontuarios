import api from '@/utils/axios';

class FaqService {
    /**
     * Buscar todas as FAQs
     */
    async getAll() {
        try {
            const response = await api.get('/faq');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar FAQs:', error);
            throw error;
        }
    }

    /**
     * Buscar FAQs por categoria
     */
    async getByCategory(categoria) {
        try {
            const response = await api.get(`/faq/categoria/${categoria}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar FAQs por categoria:', error);
            throw error;
        }
    }

    /**
     * Buscar FAQs por termo
     */
    async search(termo) {
        try {
            const response = await api.get(`/faq/buscar?termo=${encodeURIComponent(termo)}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar FAQs:', error);
            throw error;
        }
    }

    /**
     * Buscar FAQ específica
     */
    async getById(id) {
        try {
            const response = await api.get(`/faq/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar FAQ:', error);
            throw error;
        }
    }
}

export default new FaqService(); 