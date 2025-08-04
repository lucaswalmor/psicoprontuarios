import api from '@/utils/axios';

class AuthService {
    // Login do usuário
    async login(credentials) {
        try {
            const response = await api.post('/login', credentials);
            if (response.data.usuario.token) {
                localStorage.setItem('token', response.data.usuario.token);
                sessionStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                sessionStorage.setItem('sessionTime', 1800)
                sessionStorage.setItem('isAutenticated', true)
            }
            return {
                ...response.data,
                user: response.data.usuario // Adicionar user para facilitar acesso
            };
        } catch (error) {
            throw error;
        }
    }

    // Logout do usuário
    async logout() {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            sessionStorage.removeItem('usuario');
            sessionStorage.removeItem('sessionTime');
            sessionStorage.removeItem('isAutenticated');
        } catch (error) {
            // Mesmo se der erro, remove o token local
            localStorage.removeItem('token');
            throw error;
        }
    }

    // Verificar se o usuário está autenticado
    async checkAuth() {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    }

    // Validar token (método para login automático)
    async validateToken() {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Renovar token
    async refreshToken() {
        try {
            const response = await api.post('/token/refresh');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se há token no localStorage
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Obter token atual
    getToken() {
        return localStorage.getItem('token');
    }
}

export default new AuthService(); 