import api from '@/utils/axios';

const dashboardService = {
    buscarDados() {
        return api.get('/dashboard');
    }
};

export default dashboardService; 