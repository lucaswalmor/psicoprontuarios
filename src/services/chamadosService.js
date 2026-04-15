import axios from '@/utils/axios';

class ChamadosService {
    async listar(params = {}) {
        const response = await axios.get('/chamados', { params });
        return response.data;
    }

    async listarTemas() {
        const response = await axios.get('/temas-suporte');
        return response.data;
    }

    async criar(payload) {
        const formData = new FormData();
        formData.append('tema_suporte_id', payload.tema_suporte_id);
        formData.append('titulo', payload.titulo);
        formData.append('mensagem', payload.mensagem);

        if (payload.prioridade) {
            formData.append('prioridade', payload.prioridade);
        }

        if (payload.anexo) {
            formData.append('anexo', payload.anexo);
        }

        const response = await axios.post('/chamados', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }

    async buscarPorId(id) {
        const response = await axios.get(`/chamados/${id}`);
        return response.data;
    }

    async responder(id, payload) {
        const formData = new FormData();
        formData.append('mensagem', payload.mensagem);

        if (payload.anexo) {
            formData.append('anexo', payload.anexo);
        }

        const response = await axios.post(`/chamados/${id}/mensagens`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }

    async atualizarStatus(id, status) {
        const response = await axios.patch(`/chamados/${id}/status`, { status });
        return response.data;
    }

    async excluir(id) {
        const response = await axios.delete(`/chamados/${id}`);
        return response.data;
    }
}

export default new ChamadosService();
