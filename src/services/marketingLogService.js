import api from '@/utils/axios';
import { getOrCreateVisitanteUuid } from '@/utils/visitanteUuid';

const SESSION_KEY = 'pp_utms';

/**
 * Captura parâmetros UTM + fbclid da URL atual.
 * Persiste no sessionStorage para sobreviver a navegações internas.
 * Se a URL não tiver UTMs, tenta recuperar os do sessionStorage (ex: usuário
 * clicou no link com UTMs, foi para /cadastro e F5'd a página).
 *
 * @returns {{ utm_source?: string, utm_medium?: string, utm_campaign?: string, utm_content?: string, utm_term?: string, fbclid?: string }}
 */
export function capturarUtms() {
    try {
        const params = new URLSearchParams(window.location.search);
        const chaves = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
        const utmsDaUrl = {};
        for (const chave of chaves) {
            const valor = params.get(chave);
            if (valor) utmsDaUrl[chave] = valor;
        }

        if (Object.keys(utmsDaUrl).length > 0) {
            try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(utmsDaUrl)); } catch {}
            return utmsDaUrl;
        }

        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) return JSON.parse(stored);
    } catch {}
    return {};
}

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
    return registrarMarketingLog('landing_view', { utms: capturarUtms() });
}

export default {
    registrar: registrarMarketingLog,
    registrarLandingViewUmaVez,
    capturarUtms,
};
