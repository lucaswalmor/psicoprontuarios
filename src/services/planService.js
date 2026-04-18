import api from '@/utils/axios';
import { usePlanStore } from '@/store/plan';

/**
 * Interpreta `planos.descricao` do backend.
 * Formato esperado: um parágrafo de resumo, linha em branco, depois um recurso por linha.
 * Compatível com texto antigo em uma única linha (vira só resumo).
 *
 * @param {string|null|undefined} text
 * @returns {{ resumo: string, itens: string[] }}
 */
export function parseDescricaoPlano(text) {
    const raw = String(text ?? '')
        .replace(/\r\n/g, '\n')
        .trim();
    if (!raw) {
        return { resumo: '', itens: [] };
    }

    const blocos = raw.split(/\n\s*\n/);
    if (blocos.length >= 2) {
        const resumo = blocos[0].trim();
        const itens = blocos
            .slice(1)
            .join('\n')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        return { resumo, itens };
    }

    const linhas = raw.split('\n').map((s) => s.trim()).filter(Boolean);
    if (linhas.length === 0) {
        return { resumo: '', itens: [] };
    }
    if (linhas.length === 1) {
        return { resumo: linhas[0], itens: [] };
    }

    return { resumo: linhas[0], itens: linhas.slice(1) };
}

/**
 * O login / GET /user devolve o plano em `usuario.assinatura.plano`
 * (não existe `user.plan`). Vitalício vem em `usuario.usuario_vitalicio` e
 * `usuario.status_assinatura === 'vitalicio'` (sem objeto `assinatura` em alguns casos).
 */

/** Catálogo público de planos (Asaas) — GET /api/planos */
const planService = {
    async listarPlanosPublicos() {
        const response = await api.get('/planos');
        const body = response.data;
        if (Array.isArray(body?.planos)) return body.planos;
        if (Array.isArray(body)) return body;
        return [];
    },

    /**
     * Plano embutido na assinatura atual (Pinia + localStorage `userAssinatura`).
     * @param {number|string} id
     * @returns {object|null} objeto `plano` da API ou null
     */
    buscarPlanoPorId(id) {
        const planStore = usePlanStore();
        const assinatura = planStore.assinatura;
        const plano = assinatura?.plano;
        if (!plano || id == null) return null;
        const mesmoId = String(plano.id) === String(id);
        return mesmoId ? plano : null;
    },

    /**
     * Identifica o “tipo” do usuário para UI/regras.
     * @returns {'vitalicio'|'simples'|'pro'|'sem_plano'}
     */
    resolverTipoPlanoUsuario() {
        const planStore = usePlanStore();
        
        if (planStore.usuarioVitalicio || planStore.statusAssinatura === 'vitalicio') {
            return 'vitalicio';
        }

        const assinatura = planStore.assinatura;
        const slug = assinatura?.plano?.slug;
        
        if (slug === 'simples') return 'simples';
        
        if (slug === 'pro') return 'pro';
        
        const nome = (assinatura?.plano?.nome || '').toLowerCase();
        
        if (nome.includes('simples')) return 'simples';
        
        if (nome.includes('pro')) return 'pro';
        
        return 'sem_plano';
    }
};

export default planService;