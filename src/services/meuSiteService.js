import api from '@/utils/axios';

class MeuSiteService {
    async getMeuSite() {
        const response = await api.get('/site/meu-site');
        return response.data;
    }

    async updateConfiguracoes(data) {
        const response = await api.put('/site/configuracoes', data);
        return response.data;
    }

    async updateCores(data) {
        const response = await api.put('/site/cores', data);
        return response.data;
    }

    async updateInformacoes(data) {
        const response = await api.put('/site/informacoes', data);
        return response.data;
    }

    async syncTemas(temas) {
        const response = await api.put('/site/temas', { temas });
        return response.data;
    }

    async syncEspecialidades(especialidades) {
        const response = await api.put('/site/especialidades', { especialidades });
        return response.data;
    }

    async syncHorarios(horarios) {
        const response = await api.put('/site/horarios', { horarios });
        return response.data;
    }

    async getTodosOsTemas() {
        const response = await api.get('/temas');
        return response.data?.data ?? response.data;
    }

    async getTodasAsEspecialidades() {
        const response = await api.get('/especialidades');
        return response.data?.data ?? response.data;
    }
}

export default new MeuSiteService();
