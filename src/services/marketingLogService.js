import api from '@/utils/axios';
import { getOrCreateVisitanteUuid } from '@/utils/visitanteUuid';

/**
 * Sincroniza uma ação na única linha do visitante (visitante_uuid + IP no servidor).
 * Campo da requisição: `acao` (compatível com as constantes do Laravel).
 */
export function registrarMarketingLog(acao, dados = {}) {
    const visitante_uuid = getOrCreateVisitanteUuid();
    if (!visitante_uuid) {
        return Promise.resolve();
    }
    return api
        .post('/marketing-logs', {
            visitante_uuid,
            acao,
            dados: dados && typeof dados === 'object' ? dados : {}
        })
        .catch(() => {});
}

/** Alias semântico: primeira visita à landing (uma linha; próximos F5 só atualizam timestamps já gravados no servidor). */
export function registrarLandingViewUmaVez() {
    return registrarMarketingLog('landing_view');
}

export default {
    registrar: registrarMarketingLog,
    registrarLandingViewUmaVez
};
