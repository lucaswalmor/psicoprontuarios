import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import AOS from 'aos';

import 'aos/dist/aos.css';

// custom css
import '../src/assets/css/style.css';

// Bootstrap 5.3
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// PRIMEVUE
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/aura-light-purple/theme.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'

// VUE THE MASK
import VueTheMask from 'vue-the-mask'

// AXIOS BASE URL
axios.defaults.baseURL = 'https://psicoprontuarios.lksoftware.com.br/api/';
// axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.use(router);
app.use(VueTheMask);
app.use(AOS.init())
app.use(PrimeVue, {
    locale: {
        dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar',
    }
});
app.use(ToastService);
app.mount('#app');
