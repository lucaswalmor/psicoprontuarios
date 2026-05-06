/** Cookie com UUID anônimo do visitante (não substitui login; uso em logs de marketing). */

const COOKIE_NAME = 'pp_visitante_uuid';
const DIAS = 400;

function getCookie(name) {
    const prefix = `${name}=`;
    const partes = `; ${document.cookie}`.split(`; ${name}=`);
    if (partes.length === 2) {
        return partes.pop().split(';').shift() || '';
    }
    return '';
}

function setCookie(name, value, dias) {
    const maxAge = dias * 24 * 60 * 60;
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getOrCreateVisitanteUuid() {
    if (typeof window === 'undefined' || !window.crypto?.randomUUID) {
        return '';
    }
    let uuid = decodeURIComponent(getCookie(COOKIE_NAME) || '').trim();
    if (!uuid || !UUID_REGEX.test(uuid)) {
        uuid = window.crypto.randomUUID();
        setCookie(COOKIE_NAME, uuid, DIAS);
    }
    return uuid;
}
