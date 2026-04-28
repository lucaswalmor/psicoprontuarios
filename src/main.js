import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import { loadThemeConfig, applyThemeConfig } from '@/utils/themeStorage';
import '/node_modules/primeflex/primeflex.css';
import { primeVueOptions } from '@/config/primevue';
import services from '@/services';
import authService from '@/services/authService';
import money from 'v-money3';

import { VOnboardingWrapper } from 'v-onboarding';
import 'v-onboarding/dist/style.css';

// Carregar configurações iniciais do localStorage
const loadInitialConfig = () => {
    const config = loadThemeConfig();
    applyThemeConfig(config);
};

// Carregar configurações antes de montar o app
loadInitialConfig();

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(PrimeVue, primeVueOptions);
app.use(ToastService);
app.use(ConfirmationService);
app.use(money);
app.component('VOnboardingWrapper', VOnboardingWrapper);

// Configurar services globalmente
app.config.globalProperties.$pacientesService = services.pacientesService;
app.config.globalProperties.$prontuariosService = services.prontuariosService;
app.config.globalProperties.$agendamentosService = services.agendamentosService;
app.config.globalProperties.$authService = services.authService;
app.config.globalProperties.$dashboardService = services.dashboardService;
app.config.globalProperties.$financeirosService = services.financeirosService;
app.config.globalProperties.$userService = services.userService;
app.config.globalProperties.$leadsService = services.leadsService;
app.config.globalProperties.$anexosService = services.anexosService;
app.config.globalProperties.$npsService = services.npsService;
app.config.globalProperties.$mensagemComemorativaService = services.mensagemComemorativaService;
app.config.globalProperties.$mensagemAniversarianteService = services.mensagemAniversarianteService;
app.config.globalProperties.$chamadosService = services.chamadosService;
app.config.globalProperties.$planService = services.planService;
app.config.globalProperties.$psicologoService = services.psicologoService;
app.config.globalProperties.$mensagemPersonalizadaService = services.mensagemPersonalizadaService;

(async () => {
    if (localStorage.getItem('token')) {
        try {
            await authService.sincronizarSessaoComApi();
        } catch (e) {
            console.warn('Não foi possível sincronizar a sessão com o servidor.');
        }
    }
    app.mount('#app');
})();
