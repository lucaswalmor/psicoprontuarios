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
                
                // Salvar dados do plano no localStorage (nova estrutura)
                if (response.data.usuario.plano_id) {
                    localStorage.setItem('planoId', response.data.usuario.plano_id);
                }
                if (response.data.usuario.plano_nome) {
                    localStorage.setItem('planoNome', response.data.usuario.plano_nome);
                }
                if (response.data.usuario.modulos_plano) {
                    localStorage.setItem('modulosPlano', JSON.stringify(response.data.usuario.modulos_plano));
                }
                if (response.data.usuario.status_assinatura) {
                    localStorage.setItem('statusAssinatura', response.data.usuario.status_assinatura);
                }
                if (response.data.usuario.assinatura_ativa !== undefined) {
                    localStorage.setItem('assinaturaAtiva', response.data.usuario.assinatura_ativa);
                }
                
                // Manter compatibilidade com dados antigos (será removido posteriormente)
                if (response.data.usuario.assinatura) {
                    localStorage.setItem('userAssinatura', JSON.stringify(response.data.usuario.assinatura));
                }
                if (response.data.usuario.usuario_vitalicio !== undefined) {
                    localStorage.setItem('usuarioVitalicio', response.data.usuario.usuario_vitalicio);
                }
                if (response.data.usuario.tem_assinatura_ativa !== undefined) {
                    localStorage.setItem('temAssinaturaAtiva', response.data.usuario.tem_assinatura_ativa);
                }
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
            // Limpar dados da nova estrutura
            localStorage.removeItem('planoId');
            localStorage.removeItem('planoNome');
            localStorage.removeItem('modulosPlano');
            localStorage.removeItem('statusAssinatura');
            localStorage.removeItem('assinaturaAtiva');
            // Limpar dados antigos (compatibilidade)
            localStorage.removeItem('userAssinatura');
            localStorage.removeItem('usuarioVitalicio');
            localStorage.removeItem('temAssinaturaAtiva');
            sessionStorage.removeItem('usuario');
            sessionStorage.removeItem('sessionTime');
            sessionStorage.removeItem('isAutenticated');
        } catch (error) {
            // Mesmo se der erro, remove o token local
            localStorage.removeItem('token');
            localStorage.removeItem('planoId');
            localStorage.removeItem('planoNome');
            localStorage.removeItem('modulosPlano');
            localStorage.removeItem('statusAssinatura');
            localStorage.removeItem('assinaturaAtiva');
            localStorage.removeItem('userAssinatura');
            localStorage.removeItem('usuarioVitalicio');
            localStorage.removeItem('temAssinaturaAtiva');
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

    // Enviar código de reset de senha
    async sendResetCode(data) {
        try {
            const response = await api.post('/user/send-reset-code', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Verificar código de reset
    async verifyResetCode(data) {
        try {
            const response = await api.post('/user/verify-reset-code', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Resetar senha com código
    async resetPassword(data) {
        try {
            const response = await api.post('/user/reset-password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Alterar senha do usuário (método antigo mantido para compatibilidade)
    async changePassword(passwordData) {
        try {
            const response = await api.post('/user/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Login com Google
    async googleLogin(credential) {
        try {
            const response = await api.post('/auth/google', { token: credential });
            
            if (response.data.usuario.token) {
                localStorage.setItem('token', response.data.usuario.token);
                sessionStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                sessionStorage.setItem('sessionTime', 1800);
                sessionStorage.setItem('isAutenticated', true);
                
                // Salvar dados do plano no localStorage (nova estrutura)
                if (response.data.usuario.plano_id) {
                    localStorage.setItem('planoId', response.data.usuario.plano_id);
                }
                if (response.data.usuario.plano_nome) {
                    localStorage.setItem('planoNome', response.data.usuario.plano_nome);
                }
                if (response.data.usuario.modulos_plano) {
                    localStorage.setItem('modulosPlano', JSON.stringify(response.data.usuario.modulos_plano));
                }
                if (response.data.usuario.status_assinatura) {
                    localStorage.setItem('statusAssinatura', response.data.usuario.status_assinatura);
                }
                if (response.data.usuario.assinatura_ativa !== undefined) {
                    localStorage.setItem('assinaturaAtiva', response.data.usuario.assinatura_ativa);
                }
                
                // Manter compatibilidade com dados antigos (será removido posteriormente)
                if (response.data.usuario.assinatura) {
                    localStorage.setItem('userAssinatura', JSON.stringify(response.data.usuario.assinatura));
                }
                if (response.data.usuario.usuario_vitalicio !== undefined) {
                    localStorage.setItem('usuarioVitalicio', response.data.usuario.usuario_vitalicio);
                }
                if (response.data.usuario.tem_assinatura_ativa !== undefined) {
                    localStorage.setItem('temAssinaturaAtiva', response.data.usuario.tem_assinatura_ativa);
                }
            }
            
            return {
                ...response.data,
                user: response.data.usuario,
                cadastroCompleto: response.data.cadastro_completo
            };
        } catch (error) {
            throw error;
        }
    }

    // Completar cadastro (para usuários sociais)
    async completarCadastro(dados) {
        try {
            const response = await api.put('/user/completar-cadastro', dados);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService(); 