export default {
    hasAccessToModule(module) {
        const modulosPlano = JSON.parse(localStorage.getItem('modulosPlano') || '{}');
        console.log('modulosPlano: ', modulosPlano);
        return modulosPlano[module] === true;
    },
    
    tipoPlano() {
        return parseInt(localStorage.getItem('planoId') || '{}');
    },

    isPlanPaused() {
        console.log('assinatura_ativa: ', localStorage.getItem('assinatura_ativa'));
        return localStorage.getItem('assinatura_ativa');
    }
};