import api from '@/utils/axios';

class UserService {
    // Cadastrar novo usuário
    async cadastrar(userData) {
        try {
            const response = await api.post('/cadastro', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Fazer login
    async login(credentials) {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Fazer logout
    async logout() {
        try {
            const response = await api.post('/logout');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Buscar dados do usuário logado
    async getProfile() {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Atualizar perfil do usuário
    async updateProfile(userData) {
        try {
            const response = await api.put('/user/profile', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Alterar senha
    async changePassword(passwordData) {
        try {
            const response = await api.put('/user/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se email já existe
    async checkEmail(email) {
        try {
            const response = await api.get(`/user/check-email?email=${email}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se CPF já existe
    async checkCpf(cpf) {
        try {
            const response = await api.get(`/user/check-cpf?cpf=${cpf}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se CRP já existe
    async checkCrp(crp) {
        try {
            const response = await api.get(`/user/check-crp?crp=${crp}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se telefone já existe
    async checkTelefone(telefone) {
        try {
            const response = await api.get(`/user/check-telefone?telefone=${telefone}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService(); 