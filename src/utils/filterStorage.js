const PREFIX = 'psicoprontuarios:filtros:';

function parseStoredDates(obj, dateKeys = []) {
    const out = { ...obj };
    dateKeys.forEach((key) => {
        if (out[key]) {
            const d = new Date(out[key]);
            out[key] = Number.isNaN(d.getTime()) ? null : d;
        }
    });
    return out;
}

function serializeDates(obj, dateKeys = []) {
    const out = { ...obj };
    dateKeys.forEach((key) => {
        if (out[key] instanceof Date) {
            out[key] = out[key].toISOString();
        }
    });
    return out;
}

export function loadStoredFilters(key, defaults = {}, dateKeys = []) {
    try {
        const raw = localStorage.getItem(`${PREFIX}${key}`);
        if (!raw) {
            return { ...defaults };
        }
        const parsed = JSON.parse(raw);
        return parseStoredDates({ ...defaults, ...parsed }, dateKeys);
    } catch {
        return { ...defaults };
    }
}

export function saveStoredFilters(key, filters, dateKeys = []) {
    try {
        localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(serializeDates(filters, dateKeys)));
    } catch {
        // ignore quota / private mode
    }
}

export function clearStoredFilters(key) {
    try {
        localStorage.removeItem(`${PREFIX}${key}`);
    } catch {
        // ignore
    }
}

export function hasActiveFilters(filters, ignoreKeys = []) {
    return Object.entries(filters).some(([k, v]) => {
        if (ignoreKeys.includes(k)) return false;
        if (v === null || v === undefined || v === '') return false;
        return true;
    });
}
