import { defineStore } from 'pinia';

export const usePlanStore = defineStore('plan', {
    state: () => ({
        // Dados básicos do usuário e assinatura (vindos do login)
        assinatura: null,
        stats: null,
        userInfo: null,
        loading: false,
        error: null
    }),

    getters: {
        // Getters simplificados usando dados do localStorage
        isVitalicio: () => localStorage.getItem('usuarioVitalicio') === 'true',
        
        // Getters para assinatura
        temAssinaturaAtiva: () => localStorage.getItem('temAssinaturaAtiva') === 'true',
        statusAssinatura: () => localStorage.getItem('statusAssinatura') || 'sem_assinatura',
        
        // Getters para estatísticas (mantidos para compatibilidade)
        canAddPaciente: (state) => state.stats?.can_add_paciente || false,
        pacientesCount: (state) => state.stats?.pacientes_count || 0,
        limitePacientes: (state) => state.stats?.limite_pacientes || 0,
        
        // Getters para módulos específicos (compatibilidade)
        canAccessDashboard: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            if (isVitalicio) return true;
            
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('dashboard');
        },
        
        canAccessGestaoFinanceira: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            if (isVitalicio) return true;
            
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('gestao_financeira');
        },
        
        canAccessAgendamentos: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            if (isVitalicio) return true;
            
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('agendamentos');
        },
        
        canAccessProntuariosPDF: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            if (isVitalicio) return true;
            
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('prontuarios_pdf');
        },
        
        canAccessBackupAutomatico: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            if (isVitalicio) return true;
            
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('backup_automatico');
        },
        
        // Getters para status de pausa (compatibilidade com código antigo)
        isPlanPaused: () => {
            const status = localStorage.getItem('statusAssinatura') || 'sem_assinatura';
            return ['pausada', 'cancelada', 'vencida'].includes(status);
        },
        
        // Getters para funcionalidades com restrições de pausa
        canAccessGestaoFinanceiraWithPause: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            const temAssinaturaAtiva = localStorage.getItem('temAssinaturaAtiva') === 'true';
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            
            if (isVitalicio) return true;
            if (!temAssinaturaAtiva) return false;
            
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('gestao_financeira');
        },
        
        canAccessAgendamentosWithPause: () => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            const temAssinaturaAtiva = localStorage.getItem('temAssinaturaAtiva') === 'true';
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            
            if (isVitalicio) return true;
            if (!temAssinaturaAtiva) return false;
            
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes('agendamentos');
        },
        
        canAddPacienteWithPause: (state) => {
            const temAssinaturaAtiva = localStorage.getItem('temAssinaturaAtiva') === 'true';
            const canAdd = state.stats?.can_add_paciente || false;
            return canAdd && temAssinaturaAtiva;
        },
        
        canUploadAnexos: (state) => {
            const temAssinaturaAtiva = localStorage.getItem('temAssinaturaAtiva') === 'true';
            if (!temAssinaturaAtiva) return false;
            
            return state.stats?.can_add_anexo || false;
        },
        
        anexosCount: (state) => state.stats?.anexos_count || 0,
        anexosLimite: (state) => state.stats?.anexos_limite || 0,
        anexosRestantes: (state) => {
            const limite = state.stats?.anexos_limite || 0;
            const count = state.stats?.anexos_count || 0;
            if (limite === -1) return 'Ilimitado';
            return Math.max(0, limite - count);
        },

        // Getter para verificar acesso a módulo específico
        podeAcessarModulo: () => (moduloChave) => {
            const isVitalicio = localStorage.getItem('usuarioVitalicio') === 'true';
            if (isVitalicio) return true;
            
            const assinatura = JSON.parse(localStorage.getItem('userAssinatura') || 'null');
            const modulosDisponiveis = assinatura?.plano?.modulos?.map(modulo => modulo.chave) || [];
            return modulosDisponiveis.includes(moduloChave);
        },

        // Getter para verificar se tem dados carregados (compatibilidade)
        hasPlanData: (state) => {
            const hasAssinatura = localStorage.getItem('userAssinatura') !== null;
            const hasStats = state.stats !== null;
            const hasUserInfo = state.userInfo !== null;
            return hasAssinatura || hasStats || hasUserInfo;
        }
    },

    actions: {
        // Actions simplificadas - apenas para compatibilidade com código existente
        loadPlanFromStorage() {
            try {
                const stats = localStorage.getItem('userStats');
                const userInfo = localStorage.getItem('userInfo');
                const assinatura = localStorage.getItem('userAssinatura');
                
                if (stats) this.stats = JSON.parse(stats);
                if (userInfo) this.userInfo = JSON.parse(userInfo);
                if (assinatura) this.assinatura = JSON.parse(assinatura);
                
            } catch (error) {
                console.error('Erro ao carregar dados do plano do localStorage:', error);
            }
        },

        // Método para compatibilidade - agora apenas carrega do localStorage
        async fetchPlanInfo() {
            try {
                this.loading = true;
                this.error = null;
                
                // Carregar dados do localStorage (vindos do login)
                this.loadPlanFromStorage();
                
            } catch (error) {
                console.error('Erro ao buscar informações do plano:', error);
                this.error = error.message || 'Erro ao carregar informações do plano';
            } finally {
                this.loading = false;
            }
        },

        // Métodos para compatibilidade com código existente
        async carregarAssinatura() {
            // Dados já vêm do login, apenas carregar do localStorage
            this.loadPlanFromStorage();
        },

        async carregarModulosAcesso() {
            // Dados já vêm do login, apenas carregar do localStorage
            this.loadPlanFromStorage();
        },

        clearPlanData() {
            this.assinatura = null;
            this.stats = null;
            this.userInfo = null;
            this.error = null;
            
            // Limpar dados específicos do plano (mantidos para compatibilidade)
            localStorage.removeItem('userStats');
            localStorage.removeItem('userInfo');
        }
    }
});