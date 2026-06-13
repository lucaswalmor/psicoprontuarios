export function normalizarNomeCompleto(valor) {
    return String(valor || '').trim().replace(/\s+/g, ' ');
}

export function validarNomeCompleto(valor) {
    const normalizado = normalizarNomeCompleto(valor);

    if (!normalizado) {
        return { valido: false, mensagem: 'Nome completo é obrigatório' };
    }

    const partes = normalizado.split(' ');

    if (partes.length < 2) {
        return {
            valido: false,
            mensagem: 'Informe nome e sobrenome (ex.: Lucas Silva)',
        };
    }

    for (const parte of partes) {
        if (parte.length < 2) {
            return {
                valido: false,
                mensagem: 'Cada parte do nome deve ter pelo menos 2 letras',
            };
        }
        if (!/^[\p{L}'-]+$/u.test(parte)) {
            return {
                valido: false,
                mensagem: 'Use apenas letras no nome completo',
            };
        }
    }

    return { valido: true, mensagem: '' };
}

export function separarNomeCompleto(valor) {
    const normalizado = normalizarNomeCompleto(valor);
    const partes = normalizado.split(' ');
    const nome = partes[0] || '';
    const sobrenome = partes.slice(1).join(' ');

    return { nome, sobrenome };
}

export function montarNomeCompleto(nome, sobrenome) {
    return normalizarNomeCompleto(`${nome || ''} ${sobrenome || ''}`);
}
