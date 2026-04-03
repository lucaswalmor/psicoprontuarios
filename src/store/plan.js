import { defineStore } from 'pinia';

function assinaturaFromStorage() {
    try {
        const raw = localStorage.getItem('userAssinatura');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export const usePlanStore = defineStore('plan', {
    state: () => ({
        planoId: 4,
        planoNome: 'Livre',
        modulosPlano: {
            limite_pacientes: -1,
            limite_anexos: -1,
            agendamentos: true,
            prontuarios_pdf: true,
            dashboard: true,
            gestao_financeira: true,
            perfil_publico: true,
            suporte_email: true,
            suporte_whatsapp: true,
            arquivos: true,
            anamnese: true,
            anexos: true
        },
        statusAssinatura: 'sem_assinatura',
        assinaturaAtiva: true,
        assinatura: assinaturaFromStorage(),
        stats: {
            pacientes_count: 0,
            anexos_count: 0,
            can_add_paciente: true,
            can_add_anexo: true
        },
        loading: false,
        error: null
    }),

    getters: {
        isVitalicio: () => true,
        isGratuito: () => false,
        isPlanoPago: () => false,
        temAssinaturaAtiva: () => true,
        podeEditarDados: () => true,
        temAcessoModulo: () => () => true,
        canAddPaciente: () => true,
        canAddAnexo: () => true,
        pacientesCount: (state) => state.stats?.pacientes_count || 0,
        limitePacientes: () => -1,
        anexosCount: (state) => state.stats?.anexos_count || 0,
        limiteAnexos: () => -1,
        isPlanPaused: (state) => state.assinatura?.status === 'pausada',
        hasPlanData: () => true,
        diasRestantes: () => null,
        planInfo: (state) => ({
            nome: state.planoNome,
            id: state.planoId
        })
    },

    actions: {
        setAssinatura(assinatura) {
            this.assinatura = assinatura;
            if (assinatura) {
                localStorage.setItem('userAssinatura', JSON.stringify(assinatura));
            } else {
                localStorage.removeItem('userAssinatura');
            }
        },
        loadFromStorage() {},
        async fetchModulosAcesso() {},
        atualizarDados() {},
        saveToStorage() {},
        clearPlanData() {},
        loadPlanFromStorage() {},
        async fetchPlanInfo() {},
        async carregarAssinatura() {
            const { default: authService } = await import('@/services/authService');
            await authService.sincronizarSessaoComApi();
            this.assinatura = assinaturaFromStorage();
        },
        async atualizarStats() {}
    }
});
