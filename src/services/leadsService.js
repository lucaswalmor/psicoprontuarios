import api from '@/utils/axios';

/**
 * Lead da landing: POST público na API Laravel; o backend persiste e dispara e-mail interno.
 */
const leadsService = {
    async cadastrarLead(dados) {
        const response = await api.post('/leads', {
            nome: dados.nome,
            telefone: dados.telefone,
            email: dados.email
        });
        return response.data;
    }
};

export default leadsService; 