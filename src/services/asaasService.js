import api from '@/utils/axios';

/** Resposta Laravel JsonResource: { data: { ... } } */
function extrairRecurso(body) {
    if (!body) return null;
    if (body.data && typeof body.data === 'object' && body.data.id !== undefined) {
        return body.data;
    }
    if (body.id !== undefined) {
        return body;
    }
    return body.data ?? body;
}

/**
 * Assinaturas via API Laravel (Asaas no backend)
 */
class AsaasService {
    async pausarAssinatura() {
        const response = await api.post('/assinatura/pausar');
        return { ...response.data, assinatura: extrairRecurso(response.data) };
    }

    async reativarAssinatura() {
        const response = await api.post('/assinatura/reativar');
        return { ...response.data, assinatura: extrairRecurso(response.data) };
    }

    async cancelarAssinatura(motivo = null) {
        const response = await api.post('/assinatura/cancelar', motivo != null ? { motivo_cancelamento: motivo } : {});
        return { ...response.data, assinatura: extrairRecurso(response.data) };
    }

    async atualizarCartao(cartao) {
        const response = await api.post('/assinatura/atualizar-cartao', {
            cartao: {
                holder_name: cartao.holder_name,
                number: cartao.number,
                expiry_month: cartao.expiry_month,
                expiry_year: cartao.expiry_year,
                ccv: cartao.ccv
            }
        });
        return response.data;
    }

    async iniciarAssinatura(planoId, cartao) {
        const response = await api.post('/assinatura/iniciar', {
            plano_id: planoId,
            cartao: {
                holder_name: cartao.holder_name,
                number: cartao.number,
                expiry_month: cartao.expiry_month,
                expiry_year: cartao.expiry_year,
                ccv: cartao.ccv
            }
        });
        return { ...response.data, assinatura: extrairRecurso(response.data) };
    }
}

export default new AsaasService();
