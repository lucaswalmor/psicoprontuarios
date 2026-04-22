/**
 * Cores do tema Prime / AppConfigurator, lidas do DOM em tempo de execução.
 */

export function readThemeResolvedColor(names, fallback = '#8b5cf6') {
    if (typeof document === 'undefined') {
        return fallback;
    }
    const cs = getComputedStyle(document.documentElement);
    for (const name of names) {
        const raw = cs.getPropertyValue(name).trim();
        if (raw) {
            return raw;
        }
    }
    return fallback;
}

export function readPrimaryColor(fallback = '#8b5cf6') {
    return readThemeResolvedColor(['--p-primary-color', '--primary-color'], fallback);
}

export function readTextColor(fallback = '#0f172a') {
    return readThemeResolvedColor(['--p-text-color', '--text-color'], fallback);
}

export function readTextMutedColor(fallback = '#64748b') {
    return readThemeResolvedColor(['--p-text-muted-color', '--text-color-secondary'], fallback);
}

/**
 * Converte qualquer cor CSS computável para triplo RGB (via elemento temporário).
 */
export function cssColorToRgbTriplet(color, fallback = { r: 139, g: 92, b: 246 }) {
    if (typeof document === 'undefined') {
        return fallback;
    }
    const el = document.createElement('div');
    el.style.color = color;
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    const rgbStr = getComputedStyle(el).color;
    el.remove();
    const m = rgbStr.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (m) {
        return { r: +m[1], g: +m[2], b: +m[3] };
    }
    return fallback;
}

export function rgbaFromCssColor(color, alpha) {
    const { r, g, b } = cssColorToRgbTriplet(color);
    return `rgba(${r},${g},${b},${alpha})`;
}

/** Escurece uma cor (mistura em direção ao preto). ratio 0..1 */
export function darkenCssColor(color, ratio = 0.22) {
    const { r, g, b } = cssColorToRgbTriplet(color);
    const t = Math.min(1, Math.max(0, ratio));
    const nr = Math.round(r * (1 - t));
    const ng = Math.round(g * (1 - t));
    const nb = Math.round(b * (1 - t));
    return `rgb(${nr},${ng},${nb})`;
}

/** Variações do primary para gráficos (barras, roscas). */
export function primaryChartPalette(count = 5) {
    const p = readPrimaryColor();
    const steps = [1, 0.82, 0.64, 0.46, 0.3].slice(0, Math.max(1, count));
    return steps.map((a) => rgbaFromCssColor(p, a));
}
