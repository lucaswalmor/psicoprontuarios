import axios from '@/utils/axios';

class AnexosService {
    async listar(idPaciente) {
        try {
            const response = await axios.get(`/anexos/paciente/${idPaciente}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async upload(idPaciente, arquivo) {
        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);

            const response = await axios.post(`/anexos/paciente/${idPaciente}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async uploadMultiple(idPaciente, arquivos) {
        try {
            const formData = new FormData();
            
            // Adicionar cada arquivo ao FormData
            arquivos.forEach((arquivo, index) => {
                formData.append(`arquivos[${index}]`, arquivo);
            });

            const response = await axios.post(`/anexos/paciente/${idPaciente}/multiple`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async download(idAnexo) {
        try {
            const response = await axios.get(`/anexos/${idAnexo}/download`, {
                responseType: 'blob'
            });
            
            // Extrair o nome do arquivo do header Content-Disposition
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'anexo';
            
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
            
            // Se não conseguiu extrair o nome, usar um nome padrão com extensão
            if (filename === 'anexo') {
                // Tentar obter a extensão do Content-Type
                const contentType = response.headers['content-type'];
                if (contentType) {
                    if (contentType.includes('pdf')) {
                        filename = 'anexo.pdf';
                    } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
                        filename = 'anexo.jpg';
                    } else if (contentType.includes('png')) {
                        filename = 'anexo.png';
                    } else if (contentType.includes('gif')) {
                        filename = 'anexo.gif';
                    } else if (contentType.includes('excel') || contentType.includes('spreadsheet')) {
                        filename = 'anexo.xlsx';
                    } else if (contentType.includes('word') || contentType.includes('document')) {
                        filename = 'anexo.docx';
                    }
                }
            }
            
            // Determinar o tipo MIME baseado na extensão do arquivo
            const extension = filename.split('.').pop().toLowerCase();
            const mimeType = this.getMimeType(extension);
            
            // Criar blob com o tipo MIME correto
            const blob = new Blob([response.data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            
            // Log para debug
            console.log('Download info:', {
                filename,
                extension,
                mimeType,
                blobSize: blob.size,
                responseHeaders: response.headers,
                contentDisposition,
                extractedFilename: filename
            });
            
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

    getMimeType(extension) {
        const mimeTypes = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        
        return mimeTypes[extension] || 'application/octet-stream';
    }

    async deletar(idAnexo) {
        try {
            const response = await axios.delete(`/anexos/${idAnexo}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new AnexosService(); 