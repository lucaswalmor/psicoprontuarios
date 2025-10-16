<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="mb-4">
                    <i class="pi pi-file-word mr-2"></i>
                    Modelos de Arquivos
                </h5>
                <p class="text-600 mb-4">
                    Baixe os modelos de documentos essenciais para sua prática profissional.
                </p>

                <div class="grid">
                    <div class="col-12 md:col-6 lg:col-4" v-for="arquivo in arquivos" :key="arquivo.nome">
                        <div class="arquivo-card" @click="downloadArquivo(arquivo)">
                            <div class="flex align-items-center justify-content-between p-3">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-word text-primary text-2xl"></i>
                                    <div>
                                        <h6 class="m-0 text-800">{{ arquivo.titulo }}</h6>
                                        <small class="text-600">{{ arquivo.descricao }}</small>
                                    </div>
                                </div>
                                <i class="pi pi-download text-primary text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';

export default {
    name: 'ModelosArquivos',
    data() {
        return {
            arquivos: [
                {
                    nome: 'decalaracao_comparecimento.docx',
                    titulo: 'Declaração de Comparecimento',
                    descricao: 'Modelo para declaração de comparecimento em consultas'
                },
                {
                    nome: 'contrato_prestacao_servico.docx',
                    titulo: 'Contrato de Prestação de Serviço',
                    descricao: 'Modelo de contrato para prestação de serviços psicológicos'
                },
                {
                    nome: 'receituario_psicologico.docx',
                    titulo: 'Receituário Psicológico',
                    descricao: 'Modelo de receituário para prescrição de atividades'
                },
                {
                    nome: 'modelo_encaminhamento.docx',
                    titulo: 'Modelo de Encaminhamento',
                    descricao: 'Modelo para encaminhamento de pacientes'
                },
                {
                    nome: 'ficha_evolucao.docx',
                    titulo: 'Ficha de Evolução',
                    descricao: 'Modelo de ficha para acompanhamento da evolução do paciente'
                }
            ]
        };
    },
    methods: {
        async downloadArquivo(arquivo) {
            try {
                // Mostrar loading
                this.$toast.add({
                    severity: 'info',
                    summary: 'Preparando Download',
                    detail: `Preparando ${arquivo.titulo}...`,
                    life: 2000
                });

                // Tentar fazer download usando fetch
                const response = await fetch(`/src/assets/arquivos/${arquivo.nome}`);
                
                if (!response.ok) {
                    throw new Error('Arquivo não encontrado');
                }
                
                const blob = await response.blob();
                
                // Criar URL temporária para o blob
                const url = window.URL.createObjectURL(blob);
                
                // Criar link de download
                const link = document.createElement('a');
                link.href = url;
                link.download = arquivo.nome;
                
                // Adicionar ao DOM temporariamente e clicar
                document.body.appendChild(link);
                link.click();
                
                // Limpar
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                // Mostrar toast de sucesso
                this.$toast.add({
                    severity: 'success',
                    summary: 'Download Concluído',
                    detail: `${arquivo.titulo} foi baixado com sucesso!`,
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao fazer download:', error);
                
                // Fallback: tentar download direto
                try {
                    const link = document.createElement('a');
                    link.href = `/src/assets/arquivos/${arquivo.nome}`;
                    link.download = arquivo.nome;
                    link.target = '_blank';
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Download Iniciado',
                        detail: `${arquivo.titulo} está sendo baixado`,
                        life: 3000
                    });
                } catch (fallbackError) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível fazer download do arquivo',
                        life: 3000
                    });
                }
            }
        }
    },
    setup() {
        const toast = useToast();
        
        return {
            toast
        };
    }
};
</script>

<style scoped>
.arquivo-card {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
}

.arquivo-card:hover {
    background: var(--surface-hover);
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.arquivo-card:active {
    transform: translateY(0);
}
</style>
