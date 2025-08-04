import api from '@/utils/axios';

const leadsService = {
    async cadastrarLead(dados) {
        try {
            const response = await api.post('/leads', dados);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default leadsService; 