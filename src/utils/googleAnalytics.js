/**
 * Google Analytics 4 (GA4) — gratuito até altos volumes de tráfego.
 * Configure VITE_GA_MEASUREMENT_ID no .env (formato G-XXXXXXXXXX).
 * Crie a propriedade em: https://analytics.google.com/
 */
import { getGaMeasurementId } from '@/config/environment.js';

function gtag(...args) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
        return;
    }
    window.gtag(...args);
}

/**
 * Carrega gtag.js e inicializa GA4. Seguro chamar mais de uma vez.
 */
export function initGoogleAnalytics() {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }

    const measurementId = getGaMeasurementId();
    if (!measurementId) {
        return Promise.resolve();
    }

    if (window.__gaInitDone) {
        return Promise.resolve();
    }
    window.__gaInitDone = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtagFn() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    return Promise.resolve();
}

/** SPA: envia page_view manualmente a cada rota. */
export function trackGaPageView(route) {
    const measurementId = getGaMeasurementId();
    if (!measurementId) {
        return;
    }

    const path =
        route?.fullPath ||
        (typeof window !== 'undefined'
            ? `${window.location.pathname}${window.location.search}`
            : '/');

    gtag('event', 'page_view', {
        page_path: path,
        page_location: typeof window !== 'undefined' ? window.location.href : undefined,
        page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
}

/** Cadastro concluído — use como conversão de lead no Google Ads (importar do GA4). */
export function trackGaSignUp(extra = {}) {
    gtag('event', 'sign_up', {
        method: extra.method || 'email',
    });
}
