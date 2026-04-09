import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import { loadThemeConfig, applyThemeConfig } from '@/utils/themeStorage';
import '/node_modules/primeflex/primeflex.css';
import services from '@/services';
import authService from '@/services/authService';
import money from 'v-money3';

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
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    locale: {
        dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar',
        emptyMessage: 'Nenhum registro encontrado',
        fileUpload: {
            choose: 'Escolher',
            upload: 'Enviar',
            cancel: 'Cancelar',
            empty: 'Nenhum arquivo escolhido',
            emptyMultiple: 'Nenhum arquivo escolhido',
            chooseMultiple: 'Escolher arquivos',
            chooseSingle: 'Escolher arquivo',
            uploadMultiple: 'Enviar arquivos',
            uploadSingle: 'Enviar arquivo',
            remove: 'Remover',
            removeAll: 'Remover todos',
            reject: 'Arquivo rejeitado',
            accept: 'Arquivo aceito',
            fileSizeLimit: 'Tamanho máximo do arquivo',
            fileTypeLimit: 'Tipo de arquivo não permitido',
            maxFileSize: 'Tamanho máximo',
            maxFiles: 'Número máximo de arquivos',
            fileSize: 'Tamanho do arquivo',
            files: 'arquivos',
            file: 'arquivo',
            drag: 'Arraste e solte os arquivos aqui',
            dragMultiple: 'Arraste e solte os arquivos aqui'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(money);

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
