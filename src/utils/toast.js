import { useToast } from 'primevue/usetoast';

export function showPlanErrorToast(feature, planName) {
    const toast = useToast();
    
    toast.add({
        severity: 'warn',
        summary: 'Recurso não disponível',
        detail: `O recurso "${feature}" não está disponível no seu plano atual (${planName}). Faça upgrade para acessá-lo.`,
        life: 5000
    });
}

export function showAccessDeniedToast(route, planName) {
    const toast = useToast();
    
    toast.add({
        severity: 'error',
        summary: 'Acesso Negado',
        detail: `Você não tem permissão para acessar "${route}" no seu plano atual (${planName}).`,
        life: 5000
    });
} 