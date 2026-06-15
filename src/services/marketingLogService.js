import api from '@/utils/axios';
import { getOrCreateVisitanteUuid } from '@/utils/visitanteUuid';

const SESSION_KEY = 'pp_utms';
const SESSION_REFERRER_TRIED = 'pp_referrer_origem_tentado';

/** Chaves repassadas na query string (UTMs de campanha). Metadados de referrer ficam só no log. */
const UTM_QUERY_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

/** Motores de busca conhecidos → UTM sintética (pesquisa orgânica, sem params na URL). */
const REFERRER_BUSCA = [
    {
        test: (host) => /(^|\.)google\./i.test(host),
        utm_source: 'google',
        utm_medium: 'organic',
        utm_campaign: 'pesquisa_organica',
    },
    {
        test: (host) => /(^|\.)bing\./i.test(host),
        utm_source: 'bing',
        utm_medium: 'organic',
        utm_campaign: 'pesquisa_organica',
    },
    {
        test: (host) => host.includes('duckduckgo.'),
        utm_source: 'duckduckgo',
        utm_medium: 'organic',
        utm_campaign: 'pesquisa_organica',
    },
    {
        test: (host) => /(^|\.)yahoo\./i.test(host),
        utm_source: 'yahoo',
        utm_medium: 'organic',
        utm_campaign: 'pesquisa_organica',
    },
];

function hostAtual() {
    try {
        return window.location.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
        return '';
    }
}

function salvarUtmsSession(utms) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(utms));
    } catch {
        /* ignore */
    }
}

function lerUtmsSession() {
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) return JSON.parse(stored);
    } catch {
        /* ignore */
    }
    return null;
}

/**
 * Infere origem a partir de document.referrer (ex.: Google orgânico).
 * Só roda na primeira visita da sessão, quando não há UTMs na URL.
 *
 * @returns {Record<string, string>|null}
 */
function inferirOrigemReferrer() {
    if (typeof document === 'undefined') {
        return null;
    }

    const ref = (document.referrer || '').trim();
    if (!ref) {
        return null;
    }

    let refUrl;
    try {
        refUrl = new URL(ref);
    } catch {
        return null;
    }

    const refHost = refUrl.hostname.replace(/^www\./, '').toLowerCase();
    const siteHost = hostAtual();

    // Ignora navegação interna (SPA ou mesmo domínio)
    if (refHost === siteHost || refHost.endsWith(`.${siteHost}`)) {
        return null;
    }

    for (const motor of REFERRER_BUSCA) {
        if (!motor.test(refHost)) {
            continue;
        }

        return {
            utm_source: motor.utm_source,
            utm_medium: motor.utm_medium,
            utm_campaign: motor.utm_campaign,
            origem_tipo: 'referrer_organico',
            referrer_host: refHost,
        };
    }

    // Outros sites externos (opcional — ajuda a ver links genéricos)
    return {
        utm_source: refHost,
        utm_medium: 'referral',
        origem_tipo: 'referrer',
        referrer_host: refHost,
    };
}

/** URL digitada, bookmark ou navegação sem referrer e sem UTMs na query. */
function inferirAcessoDireto() {
    return {
        utm_source: 'direct',
        utm_medium: 'direct',
        utm_campaign: 'acesso_direto',
        origem_tipo: 'acesso_direto',
    };
}

/**
 * Captura parâmetros UTM + fbclid da URL, sessionStorage ou referrer (orgânico).
 * Prioridade: URL > sessionStorage > referrer (1x por sessão) > acesso direto.
 *
 * @returns {{ utm_source?: string, utm_medium?: string, utm_campaign?: string, utm_content?: string, utm_term?: string, fbclid?: string, origem_tipo?: string, referrer_host?: string }}
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
            salvarUtmsSession(utmsDaUrl);
            return utmsDaUrl;
        }

        const stored = lerUtmsSession();
        if (stored && Object.keys(stored).length > 0) {
            return stored;
        }

        // Referrer: tenta uma vez por sessão (antes de navegar e perder o Google como referer)
        if (sessionStorage.getItem(SESSION_REFERRER_TRIED) !== '1') {
            try {
                sessionStorage.setItem(SESSION_REFERRER_TRIED, '1');
            } catch {
                /* ignore */
            }

            const doReferrer = inferirOrigemReferrer();
            if (doReferrer) {
                salvarUtmsSession(doReferrer);
                return doReferrer;
            }
        }

        const direct = inferirAcessoDireto();
        salvarUtmsSession(direct);
        return direct;
    } catch {
        /* ignore */
    }
    return inferirAcessoDireto();
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

/**
 * Navega para /cadastro preservando UTMs na query string e no sessionStorage.
 * @param {import('vue-router').Router} router
 * @param {Record<string, string>} [extraQuery] ex.: { plano: 'pro' }
 */
export function irParaCadastroComUtms(router, extraQuery = {}) {
    const utms = capturarUtms();
    const query = { ...extraQuery };
    for (const chave of UTM_QUERY_KEYS) {
        if (utms[chave]) query[chave] = utms[chave];
    }
    const limpo = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== '' && v != null)
    );
    router.push({ path: '/cadastro', query: limpo });
}

export default {
    registrar: registrarMarketingLog,
    registrarLandingViewUmaVez,
    capturarUtms,
    irParaCadastroComUtms,
};
