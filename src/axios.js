import axios from 'axios';

axios.defaults.baseURL = 'https://psicoprontuarios.lksoftware.com.br/public/api/';
// axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

export const api = {
    get: (rota, dados = null) => axios.get(rota, dados = null),
    post: (rota, dados) => axios.post(rota, dados),
    put: (rota, dados) => axios.put(rota, dados),
    delete: (rota) => axios.delete(rota),
};
