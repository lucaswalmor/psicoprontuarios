<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <ModelosArquivosTour :arquivos="arquivos" />

                <div class="col-12 mb-4 p-4 pb-0" data-tour="tour-modelos-intro">
                    <h5>Modelos de Arquivos</h5>
                    <p class="text-color-secondary m-0">
                        Documentos prontos para uso na sua prática clínica. Clique no card ou no ícone de download para baixar.
                    </p>
                </div>

                <div class="p-4 pt-0" data-tour="tour-modelos-grid">
                    <div class="grid">
                        <div
                            v-for="arquivo in arquivos"
                            :key="arquivo.nome"
                            class="col-12 md:col-6 xl:col-4"
                        >
                            <div
                                class="modelo-card surface-card border-round-xl"
                                :class="{ 'modelo-card--loading': downloadingId === arquivo.nome }"
                                :data-tour="`tour-modelos-card-${arquivo.tourId}`"
                                :style="{ borderLeft: `4px solid ${arquivo.cor}` }"
                                role="button"
                                tabindex="0"
                                @click="downloadArquivo(arquivo)"
                                @keydown.enter.prevent="downloadArquivo(arquivo)"
                                @keydown.space.prevent="downloadArquivo(arquivo)"
                            >
                                <div class="modelo-card__header">
                                    <div
                                        class="modelo-card__icon-wrap"
                                        :style="{ background: arquivo.corFundo }"
                                    >
                                        <i :class="arquivo.icon" :style="{ color: arquivo.cor }" />
                                    </div>
                                    <h6 class="modelo-card__title">{{ arquivo.titulo }}</h6>
                                    <Button
                                        icon="pi pi-download"
                                        rounded
                                        text
                                        severity="secondary"
                                        :loading="downloadingId === arquivo.nome"
                                        :aria-label="`Baixar ${arquivo.titulo}`"
                                        :data-tour="`tour-modelos-btn-${arquivo.tourId}`"
                                        class="modelo-card__action"
                                        @click.stop="downloadArquivo(arquivo)"
                                    />
                                </div>

                                <p class="modelo-card__desc">{{ arquivo.descricao }}</p>
                                <p class="modelo-card__badge">{{ arquivo.categoria }} · .docx</p>

                                <i
                                    :class="[arquivo.icon, 'modelo-card__deco']"
                                    aria-hidden="true"
                                />
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
                    cor: '#7c3aed',
                    corFundo: 'rgba(124, 58, 237, 0.10)'
                },
                {
                    nome: 'contrato_prestacao_servico.docx',
                    tourId: 'contrato',
                    titulo: 'Contrato de Prestação de Serviço',
                    descricao: 'Modelo de contrato completo para formalizar a relação entre psicólogo e paciente.',
                    categoria: 'Jurídico',
                    icon: 'pi pi-file-edit',
                    cor: '#0891b2',
                    corFundo: 'rgba(8, 145, 178, 0.10)'
                },
                {
                    nome: 'receituario_psicologico.docx',
                    tourId: 'receituario',
                    titulo: 'Receituário Psicológico',
                    descricao: 'Modelo de receituário para prescrição de atividades, exercícios e orientações terapêuticas.',
                    categoria: 'Clínico',
                    icon: 'pi pi-heart',
                    cor: '#9333ea',
                    corFundo: 'rgba(147, 51, 234, 0.10)'
                },
                {
                    nome: 'modelo_encaminhamento.docx',
                    tourId: 'encaminhamento',
                    titulo: 'Modelo de Encaminhamento',
                    descricao: 'Documento para encaminhar pacientes a outros profissionais de saúde ou especialistas.',
                    categoria: 'Clínico',
                    icon: 'pi pi-send',
                    cor: '#ea580c',
                    corFundo: 'rgba(234, 88, 12, 0.10)'
                },
                {
                    nome: 'ficha_evolucao.docx',
                    tourId: 'evolucao',
                    titulo: 'Ficha de Evolução',
                    descricao: 'Ficha estruturada para registrar e acompanhar a evolução clínica do paciente ao longo do tratamento.',
                    categoria: 'Prontuário',
                    icon: 'pi pi-chart-line',
                    cor: '#16a34a',
                    corFundo: 'rgba(22, 163, 74, 0.10)'
                }
            ]
        };
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
.modelo-card {
    position: relative;
    overflow: hidden;
    padding: 1.25rem 1.25rem 1.25rem 1rem;
    min-height: 150px;
    height: 100%;
    border: 1px solid var(--surface-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    background: var(--surface-card);
    cursor: pointer;
}

.modelo-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.11);
    transform: translateY(-2px);
}

.modelo-card--loading {
    opacity: 0.75;
    pointer-events: none;
}

.modelo-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 1;
}

.modelo-card__icon-wrap {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.25rem;
}

.modelo-card__title {
    flex: 1;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
    line-height: 1.3;
}

.modelo-card__action {
    flex-shrink: 0;
}

.modelo-card__desc {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-color-secondary);
    line-height: 1.5;
    position: relative;
    z-index: 1;
    max-width: 85%;
}

.modelo-card__badge {
    margin: 0.4rem 0 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-color-secondary);
    position: relative;
    z-index: 1;
}

.modelo-card__deco {
    position: absolute;
    bottom: -4px;
    right: 4px;
    font-size: 5rem;
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
    line-height: 1;
}
</style>
