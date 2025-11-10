import axios from '@/utils/axios';

class ProntuariosService {
    async listar(idPaciente, page = 1, filters = {}) {
        try {
            const params = new URLSearchParams({
                page,
                ...filters
            });
            
            const response = await axios.get(`/prontuario/paciente/${idPaciente}?${params}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async create(prontuarioData) {
        try {
            const response = await axios.post(`/prontuario/paciente/${prontuarioData.paciente.id}`, prontuarioData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async update(idProntuario, prontuarioData) {
        try {
            const response = await axios.put(`/prontuario/${idProntuario}`, prontuarioData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deletar(idProntuario) {
        try {
            const response = await axios.delete(`/prontuario/${idProntuario}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async exportarTodosProntuariosPaciente(idPaciente) {
        try {
            const response = await axios.get(`/prontuario/paciente/${idPaciente}/exportar`, {
                responseType: 'blob'
            });
            
            // Extrair o nome do arquivo do header Content-Disposition
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'prontuarios.pdf';
            
            if (contentDisposition) {
                // Tentar extrair o nome do arquivo de diferentes formatos
                let filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                if (!filenameMatch) {
                    filenameMatch = contentDisposition.match(/filename=([^;]+)/);
                }
                if (filenameMatch) {
                    filename = filenameMatch[1].trim();
                    // Remover aspas se existirem
                    if (filename.startsWith('"') && filename.endsWith('"')) {
                        filename = filename.slice(1, -1);
                    }
                    // Decodificar URL encoding se necessário
                    try {
                        filename = decodeURIComponent(filename);
                    } catch (e) {
                        // Se falhar na decodificação, usar como está
                    }
                }
            }
            
            // Criar blob com o tipo MIME correto para PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Criar link para download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async exportarProntuario(idProntuario) {
        try {
            const response = await axios.get(`/prontuario/${idProntuario}/exportar`, {
                responseType: 'blob'
            });
            
            // Extrair o nome do arquivo do header Content-Disposition
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'prontuario.pdf';
            
            if (contentDisposition) {
                // Tentar extrair o nome do arquivo de diferentes formatos
                let filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                if (!filenameMatch) {
                    filenameMatch = contentDisposition.match(/filename=([^;]+)/);
                }
                if (filenameMatch) {
                    filename = filenameMatch[1].trim();
                    // Remover aspas se existirem
                    if (filename.startsWith('"') && filename.endsWith('"')) {
                        filename = filename.slice(1, -1);
                    }
                    // Decodificar URL encoding se necessário
                    try {
                        filename = decodeURIComponent(filename);
                    } catch (e) {
                        // Se falhar na decodificação, usar como está
                    }
                }
            }
            
            // Criar blob com o tipo MIME correto para PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Criar link para download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async buscarEvolucao(idPaciente) {
        try {
            const response = await axios.get(`/paciente/${idPaciente}/evolucao`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProntuariosService(); 