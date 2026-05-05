/**
 * Meta Pixel (Facebook) — carrega uma vez, fila eventos antes do script async.
 * Para trocar de pixel, altere apenas META_PIXEL_ID abaixo (Gerenciador de Eventos do Meta).
 */
export const META_PIXEL_ID = '1661519011719519';

function fbq(...args) {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
        return;
    }
    window.fbq(...args);
}

/**
 * Injeta fbevents.js, inicializa o pixel. Seguro chamar mais de uma vez.
 */
export function initMetaPixel() {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }

    if (!META_PIXEL_ID) {
        return Promise.resolve();
    }

    if (window.__metaPixelInitDone) {
        return Promise.resolve();
    }
    window.__metaPixelInitDone = true;

    !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', META_PIXEL_ID);
    return Promise.resolve();
}

/** SPA: uma PageView por navegação (Vue Router). */
export function trackPageView() {
    fbq('track', 'PageView');
}

/** Formulário de contato da landing (LeadsWidget). */
export function trackLead(extra = {}) {
    fbq('track', 'Lead', {
        content_name: 'Landing Contato',
        ...extra
    });
}

/** Clique em CTA “teste grátis” / cadastro (placement = origem do clique). */
export function trackStartTrialClick(placement) {
    fbq('trackCustom', 'StartTrialClick', {
        placement: placement || 'unknown'
    });
}

/**
 * Funil do cadastro em etapas (1–3). Ver no Gerenciador de Eventos como evento personalizado CadastroEtapa.
 */
export function trackCadastroEtapa(step, stepName) {
    const n = Number(step);
    fbq('trackCustom', 'CadastroEtapa', {
        step: n,
        step_name: stepName || `etapa_${n}`
    });
}

/** Cadastro com e-mail/senha ou fluxo equivalente concluído com sucesso. */
export function trackCompleteRegistration(extra = {}) {
    fbq('track', 'CompleteRegistration', {
        content_name: 'Cadastro Psicologo',
        ...extra
    });
}
