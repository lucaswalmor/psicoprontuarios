import { ref } from 'vue';
import { usePlanStore } from '@/store/plan';
import { planService } from '@/services';

export function useStripe() {
    const planStore = usePlanStore();
    const loading = ref(false);
    const error = ref(null);

    /**
     * Criar checkout session para assinatura
     */
    const criarCheckout = async (planoId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.criarCheckoutSession(planoId);
            
            if (response.checkout_url) {
                // Redirecionar para Stripe Checkout
                window.location.href = response.checkout_url;
            } else {
                throw new Error('URL de checkout não recebida');
            }

        } catch (err) {
            console.error('Erro ao criar checkout:', err);
            error.value = err.message || 'Erro ao criar checkout';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Validar checkout bem-sucedido
     */
    const validarCheckout = async (sessionId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.validarCheckoutSucesso(sessionId);
            
            if (response.success) {
                // Atualizar store com nova assinatura
                planStore.assinatura = response.assinatura;
                planStore.modulosAcesso = response.assinatura.plano.modulos.map(m => m.chave);
                
                // Salvar no localStorage
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                localStorage.setItem('userModulosAcesso', JSON.stringify(planStore.modulosAcesso));
                
                return response;
            } else {
                throw new Error('Checkout não foi validado com sucesso');
            }

        } catch (err) {
            console.error('Erro ao validar checkout:', err);
            error.value = err.message || 'Erro ao validar checkout';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Pausar assinatura
     */
    const pausarAssinatura = async (assinaturaId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.pausarAssinatura(assinaturaId);
            
            if (response.success) {
                // Atualizar store
                planStore.assinatura = response.assinatura;
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                
                return response;
            } else {
                throw new Error('Erro ao pausar assinatura');
            }

        } catch (err) {
            console.error('Erro ao pausar assinatura:', err);
            error.value = err.message || 'Erro ao pausar assinatura';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Reativar assinatura
     */
    const reativarAssinatura = async (assinaturaId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.reativarAssinatura(assinaturaId);
            
            if (response.success) {
                // Atualizar store
                planStore.assinatura = response.assinatura;
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                
                return response;
            } else {
                throw new Error('Erro ao reativar assinatura');
            }

        } catch (err) {
            console.error('Erro ao reativar assinatura:', err);
            error.value = err.message || 'Erro ao reativar assinatura';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atualizar método de pagamento
     */
    const atualizarMetodoPagamento = async (assinaturaId, paymentMethodId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.atualizarMetodoPagamento(assinaturaId, paymentMethodId);
            
            if (response.success) {
                // Atualizar store
                planStore.assinatura = response.assinatura;
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                
                return response;
            } else {
                throw new Error('Erro ao atualizar método de pagamento');
            }

        } catch (err) {
            console.error('Erro ao atualizar método de pagamento:', err);
            error.value = err.message || 'Erro ao atualizar método de pagamento';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Cancelar assinatura
     */
    const cancelarAssinatura = async (assinaturaId, motivo = null) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.cancelarAssinatura(assinaturaId, motivo);
            
            if (response.success) {
                // Atualizar store
                planStore.assinatura = response.assinatura;
                planStore.modulosAcesso = []; // Limpar módulos após cancelamento
                
                // Salvar no localStorage
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                localStorage.setItem('userModulosAcesso', JSON.stringify([]));
                
                return response;
            } else {
                throw new Error('Erro ao cancelar assinatura');
            }

        } catch (err) {
            console.error('Erro ao cancelar assinatura:', err);
            error.value = err.message || 'Erro ao cancelar assinatura';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Carregar status atualizado da assinatura
     */
    const carregarStatusAtualizado = async (assinaturaId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await planService.checkStatusAssinatura(assinaturaId);
            
            if (response.assinatura) {
                // Atualizar store
                planStore.assinatura = response.assinatura;
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                
                return response;
            } else {
                throw new Error('Erro ao carregar status da assinatura');
            }

        } catch (err) {
            console.error('Erro ao carregar status da assinatura:', err);
            error.value = err.message || 'Erro ao carregar status da assinatura';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        criarCheckout,
        validarCheckout,
        pausarAssinatura,
        reativarAssinatura,
        atualizarMetodoPagamento,
        cancelarAssinatura,
        carregarStatusAtualizado
    };
}
