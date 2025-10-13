import axios from '@/utils/axios';

class PerfilPublicoService {
    /**
     * Buscar perfil do psicólogo logado
     */
    async buscarPerfil() {
        try {
            const response = await axios.get('/perfil-publico');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            throw error;
        }
    }

    /**
     * Criar perfil público
     */
    async criarPerfil(dadosPerfil) {
        try {
            const formData = new FormData();
            
            // Adicionar campos básicos
            Object.keys(dadosPerfil).forEach(key => {
                if (key === 'foto_profissional' || key === 'video_apresentacao') {
                    if (dadosPerfil[key]) {
                        formData.append(key, dadosPerfil[key]);
                    }
                } else if (Array.isArray(dadosPerfil[key])) {
                    dadosPerfil[key].forEach(item => {
                        formData.append(`${key}[]`, item);
                    });
                } else if (dadosPerfil[key] !== null && dadosPerfil[key] !== undefined) {
                    // Converter boolean para string para FormData
                    const value = typeof dadosPerfil[key] === 'boolean' ? dadosPerfil[key].toString() : dadosPerfil[key];
                    formData.append(key, value);
                }
            });

            const response = await axios.post('/perfil-publico', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar perfil:', error);
            throw error;
        }
    }

    /**
     * Atualizar perfil público
     */
    async atualizarPerfil(dadosPerfil) {
        try {
            const formData = new FormData();
            
            // Adicionar campos básicos
            Object.keys(dadosPerfil).forEach(key => {
                if (key === 'foto_profissional' || key === 'video_apresentacao') {
                    if (dadosPerfil[key]) {
                        formData.append(key, dadosPerfil[key]);
                    }
                } else if (Array.isArray(dadosPerfil[key])) {
                    dadosPerfil[key].forEach(item => {
                        formData.append(`${key}[]`, item);
                    });
                } else if (dadosPerfil[key] !== null && dadosPerfil[key] !== undefined) {
                    // Converter boolean para string para FormData
                    const value = typeof dadosPerfil[key] === 'boolean' ? dadosPerfil[key].toString() : dadosPerfil[key];
                    formData.append(key, value);
                }
            });

            const response = await axios.put('/perfil-publico', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            throw error;
        }
    }

    /**
     * Upload de foto
     */
    async uploadFoto(foto) {
        try {
            const formData = new FormData();
            formData.append('foto', foto);

            const response = await axios.post('/perfil-publico/foto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            throw error;
        }
    }

    /**
     * Upload de vídeo
     */
    async uploadVideo(video) {
        try {
            const formData = new FormData();
            formData.append('video', video);

            const response = await axios.post('/perfil-publico/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer upload do vídeo:', error);
            throw error;
        }
    }

    /**
     * Toggle status do perfil
     */
    async toggleStatus() {
        try {
            const response = await axios.put('/perfil-publico/toggle-status');
            return response.data;
        } catch (error) {
            console.error('Erro ao alterar status do perfil:', error);
            throw error;
        }
    }

    /**
     * Buscar preview do perfil
     */
    async buscarPreview() {
        try {
            const response = await axios.get('/perfil-publico/preview');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar preview do perfil:', error);
            throw error;
        }
    }

    /**
     * Buscar especialidades
     */
    async buscarEspecialidades(search = '') {
        try {
            const response = await axios.get('/especialidades', {
                params: { search }
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar especialidades:', error);
            throw error;
        }
    }

    /**
     * Buscar temas tratados
     */
    async buscarTemas(search = '') {
        try {
            const response = await axios.get('/temas', {
                params: { search }
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar temas:', error);
            throw error;
        }
    }

    /**
     * Buscar convênios
     */
    async buscarConvenios(search = '') {
        try {
            const response = await axios.get('/convenios', {
                params: { search }
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar convênios:', error);
            throw error;
        }
    }

    /**
     * Buscar idiomas
     */
    async buscarIdiomas(search = '') {
        try {
            const response = await axios.get('/idiomas', {
                params: { search }
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar idiomas:', error);
            throw error;
        }
    }

    /**
     * Buscar dados do ViaCEP
     */
    async buscarCEP(cep) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            throw error;
        }
    }

    /**
     * Validar WhatsApp brasileiro
     */
    validarWhatsApp(whatsapp) {
        const whatsappLimpo = whatsapp.replace(/\D/g, '');
        return whatsappLimpo.length >= 10 && whatsappLimpo.length <= 11;
    }

    /**
     * Formatar WhatsApp para exibição
     */
    formatarWhatsApp(whatsapp) {
        const whatsappLimpo = whatsapp.replace(/\D/g, '');
        
        if (whatsappLimpo.length === 11) {
            return `(${whatsappLimpo.slice(0, 2)}) ${whatsappLimpo.slice(2, 7)}-${whatsappLimpo.slice(7)}`;
        } else if (whatsappLimpo.length === 10) {
            return `(${whatsappLimpo.slice(0, 2)}) ${whatsappLimpo.slice(2, 6)}-${whatsappLimpo.slice(6)}`;
        }
        
        return whatsapp;
    }

    /**
     * Formatar telefone para exibição
     */
    formatarTelefone(telefone) {
        const telefoneLimpo = telefone.replace(/\D/g, '');
        
        if (telefoneLimpo.length === 10) {
            return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 6)}-${telefoneLimpo.slice(6)}`;
        } else if (telefoneLimpo.length === 11) {
            return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 7)}-${telefoneLimpo.slice(7)}`;
        }
        
        return telefone;
    }

    /**
     * Formatar CEP para exibição
     */
    formatarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length === 8) {
            return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
        }
        
        return cep;
    }

    /**
     * Calcular completude do perfil
     */
    calcularCompletude(perfil) {
        let pontos = 0;
        const totalPontos = 100;

        // Foto profissional (20 pontos)
        if (perfil.foto_profissional) {
            pontos += 20;
        }

        // Descrição (20 pontos)
        if (perfil.descricao && perfil.descricao.length >= 200) {
            pontos += 20;
        }

        // Especialidades (15 pontos)
        if (perfil.especialidades && perfil.especialidades.length > 0) {
            pontos += 15;
        }

        // Temas (15 pontos)
        if (perfil.temas && perfil.temas.length >= 3) {
            pontos += 15;
        }

        // Vídeo (15 pontos)
        if (perfil.video_apresentacao) {
            pontos += 15;
        }

        // Redes sociais (15 pontos)
        if (perfil.link_instagram || perfil.link_facebook || perfil.link_linkedin) {
            pontos += 15;
        }

        return Math.round((pontos / totalPontos) * 100);
    }
}

export default new PerfilPublicoService();
