import pacientesService from './pacientesService';
import prontuariosService from './prontuariosService';
import agendamentosService from './agendamentosService';
import authService from './authService';
import dashboardService from './dashboardService';
import financeirosService from './financeirosService';
import userService from './userService';
import planService from './planService';
import leadsService from './leadsService';
import anexosService from './anexosService';
import carneLeaoService from './carneLeaoService';

export {
    pacientesService,
    prontuariosService,
    agendamentosService,
    authService,
    dashboardService,
    financeirosService,
    userService,
    planService,
    leadsService,
    anexosService,
    carneLeaoService
};

// Exportar como objeto para uso global
export default {
    pacientesService,
    prontuariosService,
    agendamentosService,
    authService,
    dashboardService,
    financeirosService,
    userService,
    planService,
    leadsService,
    anexosService,
    carneLeaoService
}; 