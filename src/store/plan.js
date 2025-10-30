import { defineStore } from 'pinia';
import api from '@/utils/axios';

export const usePlanStore = defineStore('plan', {
    state: () => ({
        planoId: null,
        planoNome: null,
        modulosPlano: null,
        statusAssinatura: null,
        assinaturaAtiva: false,
        stats: null,
        loading: false,
        error: null
    }),

    getters: {
        // Verificação de plano vitalício
        isVitalicio: (state) => state.planoId === 4,
        
        // Verificação de plano gratuito
        isGratuito: (state) => state.planoId === 1,
        
        // Verificação de plano pago
        isPlanoPago: (state) => [2, 3].includes(state.planoId),
        
        // Verificação de assinatura ativa (apenas para planos pagos)
        temAssinaturaAtiva: (state) => {
            if (state.planoId === 1 || state.planoId === 4) return true;
            return state.assinaturaAtiva && state.statusAssinatura === 'ativa';
        },
        
        // Verificação se pode editar dados (não está com assinatura inativa)
        podeEditarDados: (state) => {
            if (state.planoId === 1 || state.planoId === 4) return true;
            return state.statusAssinatura === 'ativa';
        },
        
        // Verificação de acesso a módulos específicos
        temAcessoModulo: (state) => (chave) => {
            if (state.planoId === 4) return true;
            if (!state.modulosPlano) return false;
            
            // Para planos pagos, verificar se assinatura está ativa
            if ([2, 3].includes(state.planoId) && state.statusAssinatura !== 'ativa') {
                return false;
            }
            
            return state.modulosPlano[chave] === true;
        },
        
        // Stats de limites
        canAddPaciente: (state, getters) => {
            if (!state.stats) return false;
            // Verificação de segurança para evitar erro durante atualização
            if (!getters || !getters.podeEditarDados) {
                // Se getters não está disponível, usar a lógica direta
                if (state.planoId === 1 || state.planoId === 4) return state.stats.can_add_paciente;
                return state.stats.can_add_paciente && state.statusAssinatura === 'ativa';
            }
            return state.stats.can_add_paciente && getters.podeEditarDados;
        },
        
        canAddAnexo: (state, getters) => {
            if (!state.stats) return false;
            const canAdd = !!state.stats.can_add_anexo;
            // Verificação de segurança para evitar erro durante atualização
            if (!getters || !getters.podeEditarDados) {
                // Se getters não está disponível, usar a lógica direta
                if (state.planoId === 1 || state.planoId === 4) return canAdd;
                return canAdd && state.statusAssinatura === 'ativa';
            }
            console.log('canAddAnexo: ', canAdd && getters.podeEditarDados);
            return canAdd;
        },
        
        pacientesCount: (state) => state.stats?.pacientes_count || 0,
        limitePacientes: (state) => state.modulosPlano?.limite_pacientes || 0,
        anexosCount: (state) => state.stats?.anexos_count || 0,
        limiteAnexos: (state) => state.modulosPlano?.limite_anexos || 0,

        // Getters para compatibilidade com código antigo
        isPlanPaused: (state) => {
            return ['pausada', 'cancelada', 'vencida'].includes(state.statusAssinatura);
        },

        // Getter para verificar se tem dados carregados
        hasPlanData: (state) => {
            return state.planoId !== null && state.modulosPlano !== null;
        }
    },

    actions: {
        // Carregar do localStorage (após login)
        loadFromStorage() {
            const planoId = localStorage.getItem('planoId');
            const planoNome = localStorage.getItem('planoNome');
            const modulosPlano = localStorage.getItem('modulosPlano');
            const statusAssinatura = localStorage.getItem('statusAssinatura');
            const assinaturaAtiva = localStorage.getItem('assinaturaAtiva');
            
            if (planoNome) this.planoNome = planoNome;
            if (modulosPlano) this.modulosPlano = JSON.parse(modulosPlano);
            if (statusAssinatura) this.statusAssinatura = statusAssinatura;
            if (assinaturaAtiva) this.assinaturaAtiva = assinaturaAtiva === 'true';
        },
        
        // Buscar informações atualizadas do servidor
        async fetchModulosAcesso() {
            try {
                this.loading = true;
                this.error = null;
                
                const response = await api.get('/user/modulos-acesso');
                
                this.planoId = response.data.plano_id;
                this.planoNome = response.data.plano_nome;
                this.modulosPlano = response.data.modulos;
                this.stats = response.data.stats;
                this.statusAssinatura = response.data.assinatura?.status || null;
                this.assinaturaAtiva = response.data.assinatura?.ativa || false;
                
                // Salvar no localStorage
                this.saveToStorage();
                
            } catch (error) {
                console.error('Erro ao buscar módulos:', error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        
        // Atualizar dados após mudança de plano/assinatura
        atualizarDados(dadosAtualizados) {
            this.planoId = dadosAtualizados.plano_id;
            this.planoNome = dadosAtualizados.plano_nome;
            this.modulosPlano = dadosAtualizados.modulos_plano;
            this.stats = dadosAtualizados.stats;
            this.statusAssinatura = dadosAtualizados.status_assinatura;
            this.assinaturaAtiva = dadosAtualizados.assinatura_ativa;
            
            // Salvar no localStorage
            this.saveToStorage();
            
            // Disparar evento global para que componentes reajam
            window.dispatchEvent(new CustomEvent('plan-updated', { 
                detail: dadosAtualizados 
            }));
        },
        
        saveToStorage() {
            localStorage.setItem('planoId', this.planoId);
            localStorage.setItem('planoNome', this.planoNome);
            localStorage.setItem('modulosPlano', JSON.stringify(this.modulosPlano));
            localStorage.setItem('statusAssinatura', this.statusAssinatura);
            localStorage.setItem('assinaturaAtiva', this.assinaturaAtiva);
            localStorage.setItem('stats', JSON.stringify(this.stats));
        },
        
        clearPlanData() {
            this.planoId = null;
            this.planoNome = null;
            this.modulosPlano = null;
            this.statusAssinatura = null;
            this.assinaturaAtiva = false;
            this.stats = null;
            this.error = null;
            
            localStorage.removeItem('planoId');
            localStorage.removeItem('planoNome');
            localStorage.removeItem('modulosPlano');
            localStorage.removeItem('statusAssinatura');
            localStorage.removeItem('assinaturaAtiva');
        },

        // Métodos para compatibilidade com código antigo
        loadPlanFromStorage() {
            this.loadFromStorage();
        },

        async fetchPlanInfo() {
            return this.fetchModulosAcesso();
        },

        async carregarAssinatura() {
            return this.fetchModulosAcesso();
        },

        async carregarModulosAcesso() {
            return this.fetchModulosAcesso();
        },

        // Método para atualizar apenas as stats (quando paciente é editado/adicionado)
        async atualizarStats() {
            try {
                const response = await api.get('/user/modulos-acesso');
                
                // Atualizar apenas as stats sem tocar no loading para evitar conflitos
                if (response.data.stats) {
                    this.stats = response.data.stats;
                }
                
            } catch (error) {
                console.error('Erro ao atualizar stats:', error);
                // Não atualizar error global para evitar problemas com a UI
            }
        }
    }
});