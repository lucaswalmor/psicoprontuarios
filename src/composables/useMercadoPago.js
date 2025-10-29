import { ref } from 'vue';
import { usePlanStore } from '@/store/plan';
import { mercadoPagoService } from '@/services';

/**
 * Composable para integração com Mercado Pago
 * Usa Pre-Approval (Assinatura Recorrente) para débito automático mensal
 */
export function useMercadoPago() {
    const planStore = usePlanStore();
    const loading = ref(false);
    const error = ref(null);

    /**
     * Criar checkout para assinatura recorrente
     * Redireciona para o Pre-Approval do Mercado Pago
     */
    const criarCheckout = async (planoId) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await mercadoPagoService.criarCheckout(planoId);
            
            if (response.checkout_url) {
                // Salvar dados para validação posterior
                sessionStorage.setItem('mercadopago_preapproval_id', response.preapproval_id);
                sessionStorage.setItem('mercadopago_plano_id', planoId);
                sessionStorage.setItem('mercadopago_external_reference', response.external_reference || '');
                
                // Redirecionar para Mercado Pago Checkout
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
     * Validar pagamento e criar assinatura
     * Chamado quando retorna do Mercado Pago após pagar
     */
    const validarCheckout = async () => {
        try {
            loading.value = true;
            error.value = null;

            // Obter dados salvos no sessionStorage
            const preApprovalId = sessionStorage.getItem('mercadopago_preapproval_id');
            const planoId = sessionStorage.getItem('mercadopago_plano_id');
            const externalReference = sessionStorage.getItem('mercadopago_external_reference');

            if (!preApprovalId || !planoId) {
                throw new Error('Dados de checkout não encontrados');
            }

            const response = await mercadoPagoService.validarCheckout(
                preApprovalId, 
                planoId,
                externalReference
            );
            
            if (response.success) {
                // Atualizar store com nova assinatura
                planStore.assinatura = response.assinatura;
                
                // Salvar no localStorage
                localStorage.setItem('userAssinatura', JSON.stringify(response.assinatura));
                
                // Limpar session storage
                sessionStorage.removeItem('mercadopago_preapproval_id');
                sessionStorage.removeItem('mercadopago_plano_id');
                sessionStorage.removeItem('mercadopago_external_reference');
                
                return response;
            } else {
                throw new Error('Assinatura não foi criada com sucesso');
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
    const pausarAssinatura = async () => {
        try {
            loading.value = true;
            error.value = null;

            const response = await mercadoPagoService.pausarAssinatura();
            
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
    const reativarAssinatura = async () => {
        try {
            loading.value = true;
            error.value = null;

            const response = await mercadoPagoService.reativarAssinatura();
            
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
     * Cancelar assinatura
     */
    const cancelarAssinatura = async (motivo = null) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await mercadoPagoService.cancelarAssinatura(motivo);
            
            if (response.success) {
                // Atualizar store
                planStore.assinatura = response.assinatura;
                planStore.modulosAcesso = [];
                
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

    return {
        loading,
        error,
        criarCheckout,
        validarCheckout,
        pausarAssinatura,
        reativarAssinatura,
        cancelarAssinatura
    };
}

