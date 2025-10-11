// Configuração do Google Identity Services
export const GOOGLE_CONFIG = {
    client_id: '594742730494-gnt2br1prntohpppk7i96bcapjjdccrv.apps.googleusercontent.com', // Substitua pelo seu Client ID do Google
    callback: (response) => {
        // Este callback será sobrescrito pelos componentes que usam o botão
        console.log('Google Sign-In response:', response);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
};

export default GOOGLE_CONFIG;
        