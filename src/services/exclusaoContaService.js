import api from '@/utils/axios';

class ExclusaoContaService {
    async enviarCodigo() {
        const response = await api.post('/user/enviar-codigo-exclusao');
        return response.data;
    }

    async solicitarExclusao(payload) {
        const response = await api.post('/user/solicitar-exclusao', payload);
        return response.data;
    }

    async cancelarExclusao() {
        const response = await api.post('/user/cancelar-exclusao');
        return response.data;
    }
}

export default new ExclusaoContaService();
