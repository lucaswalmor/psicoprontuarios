import { ref } from 'vue';
import { usePlanStore } from '@/store/plan';
import { asaasService } from '@/services';

/**
 * Composable para integração com Asaas
 * Checkout direto no sistema com formulário de cartão
 */
export function useAsaas() {
    const planStore = usePlanStore();
    const loading = ref(false);
    const error = ref(null);

    /**
     * Criar checkout e processar pagamento
     */
    const criarCheckout = async (planoId, dadosCartao, dadosUsuario) => {
        try {
            loading.value = true;
            error.value = null;

            // 1. Criar ou buscar cliente na Asaas
            const cliente = await asaasService.criarOuBuscarCliente({
                cpf: dadosUsuario.cpf,
                phone: dadosUsuario.phone,
            });

            if (!cliente.success || !cliente.customer?.id) {
                const erroCliente = cliente.error || cliente.errors?.[0]?.description || 'Erro ao criar cliente na Asaas';
                throw new Error(erroCliente);
            }

            const customerId = cliente.customer.id;

            // 2. Tokenizar cartão
            const tokenizacao = await asaasService.tokenizarCartao({
                customer_id: customerId,
                holder_name: dadosCartao.holder_name,
                number: dadosCartao.number,
                expiry_month: dadosCartao.expiry_month,
                expiry_year: dadosCartao.expiry_year,
                ccv: dadosCartao.ccv,
            });

            if (!tokenizacao.success || !tokenizacao.token) {
                const erroToken = tokenizacao.error || tokenizacao.errors?.[0]?.description || 'Erro ao tokenizar cartão';
                throw new Error(erroToken);
            }

            const token = tokenizacao.token;

            // 3. Criar assinatura (name e email vêm automaticamente do usuário autenticado)
            const resultado = await asaasService.criarAssinatura({
                plano_id: planoId,
                token: token,
                customer_id: customerId,
            });

            if (!resultado.success || !resultado.assinatura) {
                const erroAssinatura = resultado.error || resultado.errors?.[0]?.description || 'Erro ao criar assinatura na Asaas';
                throw new Error(erroAssinatura);
            }

            // 4. Atualizar store com assinatura
            planStore.assinatura = resultado.assinatura;
            localStorage.setItem('userAssinatura', JSON.stringify(resultado.assinatura));

            // 5. Recarregar dados completos do plano (módulos, status, etc)
            await planStore.fetchPlanInfo();

            // 6. Disparar evento global para atualizar menu automaticamente
            window.dispatchEvent(new CustomEvent('plan-updated', { 
                detail: planStore 
            }));

            return resultado;

        } catch (err) {
            console.error('Erro ao criar checkout Asaas:', err);
            error.value = err.message || 'Erro ao processar pagamento';
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

            const response = await asaasService.pausarAssinatura();
            
            if (response.success) {
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

            const response = await asaasService.reativarAssinatura();
            
            if (response.success) {
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

            const response = await asaasService.cancelarAssinatura(motivo);
            
            if (response.success) {
                planStore.assinatura = response.assinatura;
                planStore.modulosAcesso = [];
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
        pausarAssinatura,
        reativarAssinatura,
        cancelarAssinatura
    };
}

