import { defineStore } from 'pinia';

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
        // Verificação de plano vitalício
        isVitalicio: () => true,
        
        // Verificação de plano gratuito
        isGratuito: () => false,
        
        // Verificação de plano pago
        isPlanoPago: () => false,
        
        // Verificação de assinatura ativa (apenas para planos pagos)
        temAssinaturaAtiva: () => true,
        
        // Verificação se pode editar dados (não está com assinatura inativa)
        podeEditarDados: () => true,
        
        // Verificação de acesso a módulos específicos
        temAcessoModulo: () => () => true,
        
        // Stats de limites
        canAddPaciente: () => true,
        
        canAddAnexo: () => true,
        
        pacientesCount: (state) => state.stats?.pacientes_count || 0,
        limitePacientes: () => -1,
        anexosCount: (state) => state.stats?.anexos_count || 0,
        limiteAnexos: () => -1,

        // Getters para compatibilidade com código antigo
        isPlanPaused: () => false,

        // Getter para verificar se tem dados carregados
        hasPlanData: () => true
    },

    actions: {
        // Mantidos para compatibilidade, mas agora não fazem chamadas HTTP nem alteram o estado livre
        loadFromStorage() {},
        async fetchModulosAcesso() {},
        atualizarDados() {},
        saveToStorage() {},
        clearPlanData() {},
        loadPlanFromStorage() {},
        async fetchPlanInfo() {},
        async carregarAssinatura() {},
        async carregarModulosAcesso() {},
        async atualizarStats() {}
    }
});