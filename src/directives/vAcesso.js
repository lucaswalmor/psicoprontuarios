// Diretiva para controlar acesso a elementos baseado em módulos
export const vAcesso = {
    mounted(el, binding) {
        const { value } = binding;
        
        // Se não há valor, não faz nada
        if (!value) {
            return;
        }

        // Verificar se o usuário tem acesso ao módulo
        const checkAccess = () => {
            // Importar o store dinamicamente para evitar dependências circulares
            import('@/store/plan').then(({ usePlanStore }) => {
                const planStore = usePlanStore();
                
                let hasAccess = false;
                
                if (typeof value === 'string') {
                    // Valor é uma string (chave do módulo)
                    hasAccess = planStore.podeAcessarModulo(value);
                } else if (typeof value === 'object' && value.modulo) {
                    // Valor é um objeto com propriedade modulo
                    hasAccess = planStore.podeAcessarModulo(value.modulo);
                } else if (typeof value === 'function') {
                    // Valor é uma função
                    hasAccess = value(planStore);
                }

                // Se não tem acesso, ocultar o elemento
                if (!hasAccess) {
                    el.style.display = 'none';
                } else {
                    el.style.display = '';
                }
            }).catch(error => {
                console.error('Erro ao verificar acesso:', error);
                // Em caso de erro, ocultar o elemento por segurança
                el.style.display = 'none';
            });
        };

        // Verificar acesso inicialmente
        checkAccess();

        // Adicionar listener para mudanças no store
        const handleStoreChange = () => {
            checkAccess();
        };

        // Escutar mudanças no store (se disponível)
        if (window.addEventListener) {
            window.addEventListener('plan-store-updated', handleStoreChange);
        }

        // Armazenar a função de limpeza
        el._cleanupAcesso = () => {
            if (window.removeEventListener) {
                window.removeEventListener('plan-store-updated', handleStoreChange);
            }
        };
    },

    updated(el, binding) {
        // Re-executar verificação quando o binding muda
        const { value } = binding;
        
        if (!value) {
            el.style.display = '';
            return;
        }

        import('@/store/plan').then(({ usePlanStore }) => {
            const planStore = usePlanStore();
            
            let hasAccess = false;
            
            if (typeof value === 'string') {
                hasAccess = planStore.podeAcessarModulo(value);
            } else if (typeof value === 'object' && value.modulo) {
                hasAccess = planStore.podeAcessarModulo(value.modulo);
            } else if (typeof value === 'function') {
                hasAccess = value(planStore);
            }

            if (!hasAccess) {
                el.style.display = 'none';
            } else {
                el.style.display = '';
            }
        }).catch(error => {
            console.error('Erro ao verificar acesso:', error);
            el.style.display = 'none';
        });
    },

    unmounted(el) {
        // Limpar listeners quando o elemento é removido
        if (el._cleanupAcesso) {
            el._cleanupAcesso();
        }
    }
};

// Plugin para registrar a diretiva globalmente
export default {
    install(app) {
        app.directive('acesso', vAcesso);
    }
};
