import { ref } from 'vue';
import { usePlanStore } from '@/store/plan';
import { asaasService } from '@/services';
import authService from '@/services/authService';

/**
 * Checkout e assinatura Asaas (backend Laravel)
 */
export function useAsaas() {
    const planStore = usePlanStore();
    const loading = ref(false);
    const error = ref(null);

    const criarCheckout = async (planoId, dadosCartao) => {
        try {
            loading.value = true;
            error.value = null;

            const resultado = await asaasService.iniciarAssinatura(planoId, dadosCartao);
            const assinatura = resultado.assinatura;
            if (assinatura) {
                planStore.setAssinatura(assinatura);
            }
            await authService.sincronizarSessaoComApi();
            window.dispatchEvent(new CustomEvent('plan-updated', { detail: planStore }));
            return resultado;
        } catch (err) {
            console.error('Erro ao criar checkout Asaas:', err);
            error.value = err.message || 'Erro ao processar pagamento';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const pausarAssinatura = async () => {
        return cancelarAssinatura();
    };

    const cancelarAssinatura = async (motivo = null) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await asaasService.cancelarAssinatura(motivo);
            const assinatura = response.assinatura;
            if (assinatura) {
                planStore.setAssinatura(assinatura);
            }
            if (assinatura?.status === 'cancelada_definitiva') {
                authService.marcarComoInativo('assinatura_cancelada');
            } else {
                await authService.sincronizarSessaoComApi();
            }
            return response;
        } catch (err) {
            console.error('Erro ao cancelar assinatura:', err);
            error.value = err.message || 'Erro ao cancelar assinatura';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const reativarAssinatura = async () => {
        try {
            loading.value = true;
            error.value = null;

            const response = await asaasService.reativarAssinatura();
            const assinatura = response.assinatura;
            if (assinatura) {
                planStore.setAssinatura(assinatura);
            }
            authService.marcarComoAtivoLocal();
            await authService.sincronizarSessaoComApi();
            return response;
        } catch (err) {
            console.error('Erro ao reativar assinatura:', err);
            error.value = err.message || 'Erro ao reativar assinatura';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        criarCheckout,
        pausarAssinatura,
        reativarAssinatura,
        cancelarAssinatura
    };
}
