import { defineStore } from 'pinia';

function assinaturaFromStorage() {
    try {
        const raw = localStorage.getItem('userAssinatura');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function readMetaFromLocalStorage() {
    return {
        planoId: parseInt(localStorage.getItem('planoId') || '0', 10) || 0,
        planoNome: localStorage.getItem('planoNome') || '—',
        statusAssinatura: localStorage.getItem('statusAssinatura') || 'sem_assinatura',
        usuarioVitalicio: localStorage.getItem('usuarioVitalicio') === 'true'
    };
}

export const usePlanStore = defineStore('plan', {
    state: () => ({
        ...readMetaFromLocalStorage(),
        assinatura: assinaturaFromStorage(),
        stats: {
            pacientes_count: 0,
            anexos_count: 0
        },
        loading: false,
        error: null
    }),

    getters: {
        isVitalicio: (state) => state.usuarioVitalicio === true,
        isGratuito: () => false,
        temAssinaturaAtiva: (state) => state.statusAssinatura !== 'sem_assinatura',
        planInfo: (state) => ({
            id: state.planoId,
            nome: state.planoNome
        }),
        podeEditarDados: () => true,
        canAddPaciente: () => true,
        canAddAnexo: () => true,
        pacientesCount: (state) => state.stats?.pacientes_count || 0,
        limitePacientes: () => -1,
        anexosCount: (state) => state.stats?.anexos_count || 0,
        limiteAnexos: () => -1,
        isPlanPaused: (state) => state.assinatura?.status === 'pausada',
        hasPlanData: () => true,
        diasRestantes: () => null
    },

    actions: {
        /** Chamar após login / GET user para refletir localStorage no Pinia */
        sincronizarMetaDoLocalStorage() {
            const m = readMetaFromLocalStorage();
            this.planoId = m.planoId;
            this.planoNome = m.planoNome;
            this.statusAssinatura = m.statusAssinatura;
            this.usuarioVitalicio = m.usuarioVitalicio;
        },
        setAssinatura(assinatura) {
            this.assinatura = assinatura;
            if (assinatura) {
                localStorage.setItem('userAssinatura', JSON.stringify(assinatura));
            } else {
                localStorage.removeItem('userAssinatura');
            }
        },
        async carregarAssinatura() {
            const { default: authService } = await import('@/services/authService');
            await authService.sincronizarSessaoComApi();
            this.assinatura = assinaturaFromStorage();
            this.sincronizarMetaDoLocalStorage();
        },
        async atualizarStats() {
            /* Reservado para métricas futuras */
        }
    }
});
