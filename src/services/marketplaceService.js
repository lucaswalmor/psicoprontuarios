import axios from '@/utils/axios';

class MarketplaceService {
    /**
     * Listar psicólogos com filtros
     */
    async listarPsicologos(filtros = {}) {
        try {
            const response = await axios.get('/marketplace/psicologos', {
                params: filtros
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao listar psicólogos:', error);
            throw error;
        }
    }

    /**
     * Buscar psicólogo por slug
     */
    async buscarPorSlug(slug) {
        try {
            const response = await axios.get(`/marketplace/psicologo/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar psicólogo:', error);
            throw error;
        }
    }

    /**
     * Incrementar visualizações
     */
    async incrementarVisualizacao(slug) {
        try {
            const response = await axios.post(`/marketplace/psicologo/${slug}/visualizacao`);
            return response.data;
        } catch (error) {
            console.error('Erro ao incrementar visualizações:', error);
            throw error;
        }
    }

    /**
     * Buscar estatísticas do marketplace
     */
    async buscarEstatisticas() {
        try {
            const response = await axios.get('/marketplace/estatisticas');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
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
     * Buscar em todos os lookups
     */
    async buscarLookups(termo) {
        try {
            const response = await axios.get('/lookups/buscar', {
                params: { q: termo }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lookups:', error);
            throw error;
        }
    }

    /**
     * Formatar WhatsApp para link
     */
    formatarWhatsAppLink(whatsapp) {
        const whatsappLimpo = whatsapp.replace(/\D/g, '');
        return `https://wa.me/55${whatsappLimpo}`;
    }

    /**
     * Formatar valores para exibição
     */
    formatarValores(valorMinimo, valorMaximo) {
        if (valorMinimo && valorMaximo) {
            if (valorMinimo === valorMaximo) {
                return `R$ ${valorMinimo.toFixed(2).replace('.', ',')}`;
            } else {
                return `R$ ${valorMinimo.toFixed(2).replace('.', ',')} - R$ ${valorMaximo.toFixed(2).replace('.', ',')}`;
            }
        } else if (valorMinimo) {
            return `A partir de R$ ${valorMinimo.toFixed(2).replace('.', ',')}`;
        } else if (valorMaximo) {
            return `Até R$ ${valorMaximo.toFixed(2).replace('.', ',')}`;
        }
        return 'Valor não informado';
    }

    /**
     * Formatar tipo de atendimento
     */
    formatarTipoAtendimento(tipo) {
        const tipos = {
            'presencial': 'Presencial',
            'online': 'Online',
            'híbrido': 'Presencial e Online'
        };
        return tipos[tipo] || tipo;
    }

    /**
     * Formatar público-alvo
     */
    formatarPublicoAlvo(publico) {
        const publicos = {
            'crianças': 'Crianças',
            'adolescentes': 'Adolescentes',
            'adultos': 'Adultos',
            'casais': 'Casais',
            'idosos': 'Idosos'
        };
        return publicos[publico] || publico;
    }

    /**
     * Gerar URL do perfil
     */
    gerarUrlPerfil(slug) {
        return `/psicologo/${slug}`;
    }

    /**
     * Gerar meta tags para SEO
     */
    gerarMetaTags(psicologo) {
        const nome = psicologo.psicologo.nome;
        const crp = psicologo.psicologo.crp;
        const cidade = psicologo.cidade;
        const estado = psicologo.estado;
        const especialidades = psicologo.especialidades.map(e => e.nome).join(', ');
        
        return {
            title: `${nome} - Psicólogo CRP ${crp}${cidade ? ` em ${cidade}/${estado}` : ''}`,
            description: `Psicólogo ${nome} CRP ${crp}${cidade ? ` em ${cidade}/${estado}` : ''}. Especialidades: ${especialidades}. ${psicologo.descricao ? psicologo.descricao.substring(0, 150) + '...' : ''}`,
            keywords: `psicólogo, ${nome}, CRP ${crp}, ${especialidades}${cidade ? `, ${cidade}, ${estado}` : ''}`,
            ogTitle: `${nome} - Psicólogo CRP ${crp}`,
            ogDescription: `Psicólogo ${nome} CRP ${crp}${cidade ? ` em ${cidade}/${estado}` : ''}. Especialidades: ${especialidades}.`,
            ogImage: psicologo.foto_url
        };
    }
}

export default new MarketplaceService();
