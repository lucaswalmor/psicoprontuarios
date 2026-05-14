<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <ModelosArquivosTour :arquivos="arquivos" />

                <div class="col-12 mb-4 p-4 pb-0" data-tour="tour-modelos-intro">
                    <h5>Modelos de Arquivos</h5>
                    <p class="text-color-secondary m-0">
                        Documentos prontos para uso na sua prática clínica. Clique em um card ou use o botão <strong>Baixar</strong>.
                    </p>
                </div>

                <div class="p-4 pt-0" data-tour="tour-modelos-grid">
                    <div class="row">
                        <div
                            v-for="arquivo in arquivos"
                            :key="arquivo.nome"
                            class="col-12 md:col-6 lg:col-4 mb-3"
                        >
                            <div
                                class="card h-100 modelos-card"
                                :class="{ 'modelos-card--loading': downloadingId === arquivo.nome }"
                                :data-tour="`tour-modelos-card-${arquivo.tourId}`"
                                role="button"
                                tabindex="0"
                                @click="downloadArquivo(arquivo)"
                                @keydown.enter.prevent="downloadArquivo(arquivo)"
                                @keydown.space.prevent="downloadArquivo(arquivo)"
                            >
                                <div class="card-body text-center d-flex flex-column">
                                    <div class="fs-1 mb-2 modelos-icone" :style="{ color: arquivo.color }">
                                        <i :class="arquivo.icon"></i>
                                    </div>

                                    <div class="d-flex justify-content-center gap-2 mb-2 flex-wrap">
                                        <span
                                            class="badge modelos-badge"
                                            :style="{ color: arquivo.color, background: arquivo.colorLight }"
                                        >
                                            {{ arquivo.categoria }}
                                        </span>
                                    </div>

                                    <h6 class="card-title modelos-titulo">{{ arquivo.titulo }}</h6>
                                    <p class="card-text small modelos-descricao">
                                        {{ arquivo.descricao }}
                                    </p>

                                    <div class="mt-auto">
                                        <Button
                                            label="Baixar"
                                            icon="pi pi-download"
                                            :loading="downloadingId === arquivo.nome"
                                            :data-tour="`tour-modelos-btn-${arquivo.tourId}`"
                                            @click.stop="downloadArquivo(arquivo)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 d-flex align-items-center gap-2 text-color-secondary small" data-tour="tour-modelos-footer">
                        <i class="pi pi-info-circle"></i>
                        <span>
                            Todos os modelos estão no formato <strong>.docx</strong> e podem ser editados no Microsoft Word, Google Docs ou LibreOffice.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import ModelosArquivosTour from '@/components/tour/ModelosArquivosTour.vue';

export default {
    name: 'ModelosArquivos',
    components: { Button, ModelosArquivosTour },
    data() {
        return {
            downloadingId: null,
            arquivos: [
                {
                    nome: 'decalaracao_comparecimento.docx',
                    tourId: 'comparecimento',
                    titulo: 'Declaração de Comparecimento',
                    descricao: 'Documento oficial para comprovar a presença do paciente em consulta psicológica.',
                    categoria: 'Documentação',
                    icon: 'pi pi-verified',
                    color: '#6366f1',
                    colorLight: 'rgba(99, 102, 241, 0.1)'
                },
                {
                    nome: 'contrato_prestacao_servico.docx',
                    tourId: 'contrato',
                    titulo: 'Contrato de Prestação de Serviço',
                    descricao: 'Modelo de contrato completo para formalizar a relação entre psicólogo e paciente.',
                    categoria: 'Jurídico',
                    icon: 'pi pi-file-edit',
                    color: '#0ea5e9',
                    colorLight: 'rgba(14, 165, 233, 0.1)'
                },
                {
                    nome: 'receituario_psicologico.docx',
                    tourId: 'receituario',
                    titulo: 'Receituário Psicológico',
                    descricao: 'Modelo de receituário para prescrição de atividades, exercícios e orientações terapêuticas.',
                    categoria: 'Clínico',
                    icon: 'pi pi-heart',
                    color: '#ec4899',
                    colorLight: 'rgba(236, 72, 153, 0.1)'
                },
                {
                    nome: 'modelo_encaminhamento.docx',
                    tourId: 'encaminhamento',
                    titulo: 'Modelo de Encaminhamento',
                    descricao: 'Documento para encaminhar pacientes a outros profissionais de saúde ou especialistas.',
                    categoria: 'Clínico',
                    icon: 'pi pi-send',
                    color: '#f59e0b',
                    colorLight: 'rgba(245, 158, 11, 0.1)'
                },
                {
                    nome: 'ficha_evolucao.docx',
                    tourId: 'evolucao',
                    titulo: 'Ficha de Evolução',
                    descricao: 'Ficha estruturada para registrar e acompanhar a evolução clínica do paciente ao longo do tratamento.',
                    categoria: 'Prontuário',
                    icon: 'pi pi-chart-line',
                    color: '#10b981',
                    colorLight: 'rgba(16, 185, 129, 0.1)'
                }
            ]
        };
    },
    computed: {
        categorias() {
            return [...new Set(this.arquivos.map(a => a.categoria))];
        }
    },
    methods: {
        /** URL pública dos modelos (pasta public/arquivos) — /src/... não existe no build e pode devolver HTML da SPA. */
        urlPublicaArquivo(nome) {
            const base = import.meta.env.BASE_URL || '/';
            const prefix = base.endsWith('/') ? base : `${base}/`;
            return `${prefix}arquivos/${encodeURIComponent(nome)}`;
        },
        async downloadArquivo(arquivo) {
            if (this.downloadingId === arquivo.nome) return;

            this.downloadingId = arquivo.nome;

            try {
                this.$toast.add({
                    severity: 'info',
                    summary: 'Preparando download',
                    detail: `Baixando ${arquivo.titulo}...`,
                    life: 2000
                });

                const response = await fetch(this.urlPublicaArquivo(arquivo.nome));

                if (!response.ok) throw new Error('Arquivo não encontrado');

                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('text/html')) {
                    throw new Error('Resposta inválida (HTML em vez do documento)');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = arquivo.nome;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Download concluído',
                    detail: `${arquivo.titulo} baixado com sucesso!`,
                    life: 3000
                });
            } catch {
                try {
                    const link = document.createElement('a');
                    link.href = this.urlPublicaArquivo(arquivo.nome);
                    link.download = arquivo.nome;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    this.$toast.add({
                        severity: 'success',
                        summary: 'Download iniciado',
                        detail: `${arquivo.titulo} está sendo baixado.`,
                        life: 3000
                    });
                } catch {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível fazer o download. Tente novamente.',
                        life: 4000
                    });
                }
            } finally {
                this.downloadingId = null;
            }
        }
    }
};
</script>

<style scoped>
.modelos-card {
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    border: 1px solid var(--surface-border);
}

.modelos-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    border-color: color-mix(in srgb, var(--primary-color) 35%, var(--surface-border));
}

.modelos-card--loading {
    opacity: 0.75;
    pointer-events: none;
}

.modelos-icone {
    line-height: 1;
}

.modelos-badge {
    font-weight: 600;
}

.modelos-titulo {
    color: var(--text-color);
}

.modelos-descricao {
    color: var(--text-color-secondary);
}
</style>
