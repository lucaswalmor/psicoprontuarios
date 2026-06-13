import api from '@/utils/axios';
import { usePlanStore } from '@/store/plan';

const TOUR_STORAGE_PREFIX = 'psico_prontuario_tour_';

function sincronizarAssinaturaNoPlanStore() {
    try {
        const planStore = usePlanStore();
        const raw = localStorage.getItem('userAssinatura');
        planStore.setAssinatura(raw ? JSON.parse(raw) : null);
        planStore.sincronizarMetaDoLocalStorage();
    } catch {
        /* pinia pode não estar pronto em testes */
    }
}

function sincronizarPreviewNoLocalStorage(usuario) {
    if (!usuario || typeof usuario !== 'object') return;

    const setBool = (key, value) => {
        if (value === undefined) return;
        localStorage.setItem(key, value ? 'true' : 'false');
    };

    setBool('previewAtivo', usuario.preview_ativo);
    setBool('precisaAtivarPlano', usuario.precisa_ativar_plano);
    setBool('mostrarPromptAtivacao', usuario.mostrar_prompt_ativacao);

    if (usuario.preview_expira_em !== undefined) {
        if (usuario.preview_expira_em) {
            localStorage.setItem('previewExpiraEm', String(usuario.preview_expira_em));
        } else {
            localStorage.removeItem('previewExpiraEm');
        }
    }
    if (usuario.preview_max_pacientes !== undefined) {
        localStorage.setItem('previewMaxPacientes', String(usuario.preview_max_pacientes));
    }
    if (usuario.preview_pacientes_usados !== undefined) {
        localStorage.setItem('previewPacientesUsados', String(usuario.preview_pacientes_usados));
    }
}

function limparPreviewDoLocalStorage() {
    localStorage.removeItem('previewAtivo');
    localStorage.removeItem('previewExpiraEm');
    localStorage.removeItem('precisaAtivarPlano');
    localStorage.removeItem('mostrarPromptAtivacao');
    localStorage.removeItem('previewMaxPacientes');
    localStorage.removeItem('previewPacientesUsados');
}

function sincronizarToursFinalizados(toursFinalizados) {
    if (!Array.isArray(toursFinalizados)) return;

    toursFinalizados.forEach((tourKey) => {
        if (typeof tourKey !== 'string' || !tourKey.startsWith(TOUR_STORAGE_PREFIX)) return;
        try {
            localStorage.setItem(tourKey, '1');
        } catch {
            /* ignore */
        }
    });
}

function limparToursFinalizadosLocais() {
    try {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(TOUR_STORAGE_PREFIX))
            .forEach((key) => localStorage.removeItem(key));
    } catch {
        /* ignore */
    }
}

class AuthService {
    persistirSessaoInativa(data, usuarioToken) {
        const u = data.usuario;
        if (usuarioToken || u?.token) {
            localStorage.setItem('token', usuarioToken || u.token);
        }
        const prev = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        sessionStorage.setItem('usuario', JSON.stringify({ ...prev, ...u }));
        sessionStorage.setItem('sessionTime', '1800');
        sessionStorage.setItem('isAutenticated', 'true');
        sessionStorage.removeItem('nps_respondido');

        localStorage.setItem('userAtivo', 'false');
        localStorage.setItem('motivoBloqueio', data.motivo || 'pagamento_atrasado');

        if (data.assinatura) {
            localStorage.setItem('userAssinatura', JSON.stringify(data.assinatura));
        } else {
            localStorage.removeItem('userAssinatura');
        }
        sincronizarAssinaturaNoPlanStore();

        if (u.status_assinatura) {
            localStorage.setItem('statusAssinatura', u.status_assinatura);
        }
        if (u.assinatura_ativa !== undefined) {
            localStorage.setItem('assinaturaAtiva', String(u.assinatura_ativa));
        }
        sincronizarToursFinalizados(u.tours_finalizados);
    }

    persistirSessaoAtiva(usuario, extra = {}) {
        if (usuario.token) {
            localStorage.setItem('token', usuario.token);
        }
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        sessionStorage.setItem('sessionTime', '1800');
        sessionStorage.setItem('isAutenticated', 'true');
        sessionStorage.removeItem('nps_respondido');

        localStorage.setItem('userAtivo', 'true');
        localStorage.removeItem('motivoBloqueio');

        if (usuario.plano_id) {
            localStorage.setItem('planoId', String(usuario.plano_id));
        }
        if (usuario.plano_nome) {
            localStorage.setItem('planoNome', usuario.plano_nome);
        }
        if (usuario.status_assinatura) {
            localStorage.setItem('statusAssinatura', usuario.status_assinatura);
        }
        if (usuario.assinatura_ativa !== undefined) {
            localStorage.setItem('assinaturaAtiva', String(usuario.assinatura_ativa));
        }
        if (extra.menu) {
            localStorage.setItem('menu', JSON.stringify(extra.menu));
        }

        if (usuario.assinatura) {
            localStorage.setItem('userAssinatura', JSON.stringify(usuario.assinatura));
        }
        sincronizarAssinaturaNoPlanStore();
        if (usuario.usuario_vitalicio !== undefined) {
            localStorage.setItem('usuarioVitalicio', String(usuario.usuario_vitalicio));
        }
        if (usuario.tem_assinatura_ativa !== undefined) {
            localStorage.setItem('temAssinaturaAtiva', String(usuario.tem_assinatura_ativa));
        }
        sincronizarPreviewNoLocalStorage(usuario);
        sincronizarToursFinalizados(usuario.tours_finalizados);
    }

    aplicarRespostaUsuario(data) {
        if (!data) return;

        if (data.status === 'inativo') {
            this.persistirSessaoInativa(data, null);
            return;
        }

        if (data.usuario) {
            localStorage.setItem('userAtivo', 'true');
            localStorage.removeItem('motivoBloqueio');

            const u = data.usuario;
            if (u.plano_id) {
                localStorage.setItem('planoId', String(u.plano_id));
            }
            if (u.plano_nome) {
                localStorage.setItem('planoNome', u.plano_nome);
            }
            if (u.status_assinatura) {
                localStorage.setItem('statusAssinatura', u.status_assinatura);
            }
            if (u.assinatura_ativa !== undefined) {
                localStorage.setItem('assinaturaAtiva', String(u.assinatura_ativa));
            }
            if (u.usuario_vitalicio !== undefined) {
                localStorage.setItem('usuarioVitalicio', String(u.usuario_vitalicio));
            }
            if (u.assinatura) {
                localStorage.setItem('userAssinatura', JSON.stringify(u.assinatura));
            } else {
                localStorage.removeItem('userAssinatura');
            }
            sincronizarAssinaturaNoPlanStore();
            sincronizarPreviewNoLocalStorage(u);
            const prev = JSON.parse(sessionStorage.getItem('usuario') || '{}');
            sessionStorage.setItem('usuario', JSON.stringify({ ...prev, ...u }));
            sincronizarToursFinalizados(u.tours_finalizados);
        }
    }

    marcarComoInativo(motivo = 'assinatura_pausada') {
        localStorage.setItem('userAtivo', 'false');
        localStorage.setItem('motivoBloqueio', motivo);
    }

    marcarComoAtivoLocal() {
        localStorage.setItem('userAtivo', 'true');
        localStorage.removeItem('motivoBloqueio');
    }

    async sincronizarSessaoComApi() {
        const response = await api.get('/user');
        this.aplicarRespostaUsuario(response.data);
        return response.data;
    }

    async entrar(credenciais) {
        try {
            const response = await api.post('/login', credenciais);
            const body = response.data;

            if (body.status === 'inativo' && body.usuario?.token) {
                this.persistirSessaoInativa(body, body.usuario.token);
                return {
                    ...body,
                    user: body.usuario,
                    cadastroCompleto: body.usuario?.cadastro_completo
                };
            }

            if (body.usuario?.token) {
                this.persistirSessaoAtiva(body.usuario, { menu: body.menu });
            }

            return {
                ...body,
                user: body.usuario,
                cadastroCompleto: body.cadastro_completo
            };
        } catch (error) {
            throw error;
        }
    }

    async sair() {
        try {
            await api.post('/logout');
        } catch (error) {
            // segue limpando local
        }
        localStorage.removeItem('token');
        localStorage.removeItem('planoId');
        localStorage.removeItem('planoNome');
        localStorage.removeItem('modulosPlano');
        localStorage.removeItem('statusAssinatura');
        localStorage.removeItem('assinaturaAtiva');
        localStorage.removeItem('menu');
        localStorage.removeItem('userAssinatura');
        localStorage.removeItem('usuarioVitalicio');
        localStorage.removeItem('temAssinaturaAtiva');
        localStorage.removeItem('userAtivo');
        localStorage.removeItem('motivoBloqueio');
        limparPreviewDoLocalStorage();
        limparToursFinalizadosLocais();
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('sessionTime');
        sessionStorage.removeItem('isAutenticated');
        sessionStorage.removeItem('nps_respondido');
        sincronizarAssinaturaNoPlanStore();
    }

    async verificarAutenticacao() {
        try {
            const response = await api.get('/user');
            this.aplicarRespostaUsuario(response.data);
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    }

    async validarToken() {
        try {
            const response = await api.get('/user');
            this.aplicarRespostaUsuario(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async renovarToken() {
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

    estaAutenticado() {
        return !!localStorage.getItem('token');
    }

    obterToken() {
        return localStorage.getItem('token');
    }

    contaEstaInativa() {
        return localStorage.getItem('userAtivo') === 'false';
    }

    obterMotivoBloqueio() {
        return localStorage.getItem('motivoBloqueio') || '';
    }

    async enviarCodigoRecuperacao(data) {
        const response = await api.post('/user/send-reset-code', data);
        return response.data;
    }

    async verificarCodigoRecuperacao(data) {
        const response = await api.post('/user/verify-reset-code', data);
        return response.data;
    }

    async redefinirSenha(data) {
        const response = await api.post('/user/reset-password', data);
        return response.data;
    }

    async alterarSenha(dadosSenha) {
        const response = await api.post('/user/change-password', dadosSenha);
        return response.data;
    }

    async entrarComGoogle(credential) {
        const response = await api.post('/auth/google', { token: credential });
        const body = response.data;

        if (body.status === 'inativo' && body.usuario?.token) {
            this.persistirSessaoInativa(body, body.usuario.token);
            return {
                ...body,
                user: body.usuario,
                cadastroCompleto: body.usuario?.cadastro_completo,
            };
        }

        if (body.usuario?.token) {
            this.persistirSessaoAtiva(body.usuario, {});
        }

        return {
            ...body,
            user: body.usuario,
            cadastroCompleto: body.cadastro_completo,
            is_new_user: body.is_new_user,
        };
    }

    async completarCadastro(dados) {
        const response = await api.put('/user/completar-cadastro', dados);
        return response.data;
    }
}

export default new AuthService();
