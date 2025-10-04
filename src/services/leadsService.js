import axios from 'axios';

const leadsService = {
    async cadastrarLead(dados) {
        try {
            // Enviar para o webhook N8N
            const webhookResponse = await axios.post('https://n8n-n8n.ibn4qt.easypanel.host/webhook/lead', dados, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                timeout: 10000 // 10 segundos de timeout
            });
            
            return webhookResponse.data;
        } catch (error) {
            console.error('Erro ao enviar para N8N:', error);
            
            // Aqui você pode decidir se quer enviar também para sua API local como backup
            // try {
            //     const localResponse = await api.post('/leads', dados);
            //     return localResponse.data;
            // } catch (localError) {
            //     console.error('Erro ao enviar para API local:', localError);
            // }
            
            throw error;
        }
    }
};

export default leadsService; 