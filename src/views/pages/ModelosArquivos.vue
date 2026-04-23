<template>
    <div class="modelos-wrapper">

        <!-- Page header -->
        <div class="page-header">
            <div class="page-header__left">
                <div class="page-header__icon">
                    <i class="pi pi-folder-open"></i>
                </div>
                <div>
                    <div class="page-header__label">Biblioteca</div>
                    <h1 class="page-header__title">Modelos de Arquivos</h1>
                </div>
            </div>
            <p class="page-header__desc">
                Documentos prontos para uso na sua prática clínica. Clique em qualquer modelo para baixar.
            </p>
        </div>

        <!-- Stats bar -->
        <div class="stats-bar">
            <div class="stat-item">
                <span class="stat-value">{{ arquivos.length }}</span>
                <span class="stat-label">Modelos disponíveis</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-value">{{ categorias.length }}</span>
                <span class="stat-label">Categorias</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <i class="pi pi-download stat-icon"></i>
                <span class="stat-label">Download gratuito</span>
            </div>
        </div>

        <!-- File grid -->
        <div class="files-grid">
            <div
                v-for="arquivo in arquivos"
                :key="arquivo.nome"
                class="file-card"
                :class="{ 'file-card--loading': downloadingId === arquivo.nome }"
                @click="downloadArquivo(arquivo)"
            >
                <!-- Left accent strip -->
                <div class="file-card__accent" :style="{ background: arquivo.color }"></div>

                <!-- Icon -->
                <div class="file-card__icon" :style="{ background: arquivo.colorLight, color: arquivo.color }">
                    <i :class="arquivo.icon"></i>
                </div>

                <!-- Content -->
                <div class="file-card__body">
                    <div class="file-card__meta">
                        <span class="file-card__category" :style="{ color: arquivo.color, background: arquivo.colorLight }">
                            {{ arquivo.categoria }}
                        </span>
                        <span class="file-card__format">.docx</span>
                    </div>
                    <h3 class="file-card__title">{{ arquivo.titulo }}</h3>
                    <p class="file-card__desc">{{ arquivo.descricao }}</p>
                </div>

                <!-- Download action -->
                <div class="file-card__action">
                    <div v-if="downloadingId === arquivo.nome" class="file-card__spinner">
                        <i class="pi pi-spin pi-spinner"></i>
                    </div>
                    <div v-else class="file-card__download-btn">
                        <i class="pi pi-download"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Info footer -->
        <div class="info-footer">
            <i class="pi pi-info-circle"></i>
            <span>Todos os modelos estão no formato <strong>.docx</strong> e podem ser editados no Microsoft Word, Google Docs ou LibreOffice.</span>
        </div>

    </div>
</template>

<script>
export default {
    name: 'ModelosArquivos',
    data() {
        return {
            downloadingId: null,
            arquivos: [
                {
                    nome: 'decalaracao_comparecimento.docx',
                    titulo: 'Declaração de Comparecimento',
                    descricao: 'Documento oficial para comprovar a presença do paciente em consulta psicológica.',
                    categoria: 'Documentação',
                    icon: 'pi pi-verified',
                    color: '#6366f1',
                    colorLight: 'rgba(99, 102, 241, 0.1)'
                },
                {
                    nome: 'contrato_prestacao_servico.docx',
                    titulo: 'Contrato de Prestação de Serviço',
                    descricao: 'Modelo de contrato completo para formalizar a relação entre psicólogo e paciente.',
                    categoria: 'Jurídico',
                    icon: 'pi pi-file-edit',
                    color: '#0ea5e9',
                    colorLight: 'rgba(14, 165, 233, 0.1)'
                },
                {
                    nome: 'receituario_psicologico.docx',
                    titulo: 'Receituário Psicológico',
                    descricao: 'Modelo de receituário para prescrição de atividades, exercícios e orientações terapêuticas.',
                    categoria: 'Clínico',
                    icon: 'pi pi-heart',
                    color: '#ec4899',
                    colorLight: 'rgba(236, 72, 153, 0.1)'
                },
                {
                    nome: 'modelo_encaminhamento.docx',
                    titulo: 'Modelo de Encaminhamento',
                    descricao: 'Documento para encaminhar pacientes a outros profissionais de saúde ou especialistas.',
                    categoria: 'Clínico',
                    icon: 'pi pi-send',
                    color: '#f59e0b',
                    colorLight: 'rgba(245, 158, 11, 0.1)'
                },
                {
                    nome: 'ficha_evolucao.docx',
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

                const response = await fetch(`/src/assets/arquivos/${arquivo.nome}`);

                if (!response.ok) throw new Error('Arquivo não encontrado');

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
                    link.href = `/src/assets/arquivos/${arquivo.nome}`;
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
/* ─── Wrapper ─────────────────────────────────────────────────── */
.modelos-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 4px 0 32px;
    animation: fadeSlideIn 0.4s ease both;
}

/* ─── Page header ─────────────────────────────────────────────── */
.page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.page-header__left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.page-header__icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: color-mix(in srgb, var(--primary-color) 12%, var(--surface-ground));
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.page-header__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-color-secondary);
    opacity: 0.7;
    margin-bottom: 4px;
}

.page-header__title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    line-height: 1.2;
}

.page-header__desc {
    font-size: 14px;
    color: var(--text-color-secondary);
    max-width: 380px;
    line-height: 1.6;
    margin: 0;
    align-self: center;
}

/* ─── Stats bar ───────────────────────────────────────────────── */
.stats-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    padding: 16px 28px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    justify-content: center;
}

.stat-value {
    font-size: 22px;
    font-weight: 800;
    color: var(--primary-color);
    line-height: 1;
}

.stat-label {
    font-size: 13px;
    color: var(--text-color-secondary);
    font-weight: 500;
}

.stat-icon {
    font-size: 18px;
    color: var(--primary-color);
}

.stat-divider {
    width: 1px;
    height: 32px;
    background: var(--surface-border);
    flex-shrink: 0;
}

/* ─── Files grid ──────────────────────────────────────────────── */
.files-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* ─── File card ───────────────────────────────────────────────── */
.file-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--surface-card);
    border: 1.5px solid var(--surface-border);
    border-radius: 14px;
    padding: 18px 20px 18px 22px;
    cursor: pointer;
    transition: all 0.22s ease;
    overflow: hidden;
}

.file-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.09);
    transform: translateX(3px);
    background: color-mix(in srgb, var(--primary-color) 2%, var(--surface-card));
}

.file-card--loading {
    opacity: 0.75;
    pointer-events: none;
}

/* Left accent strip */
.file-card__accent {
    position: absolute;
    left: 0;
    top: 10%;
    bottom: 10%;
    width: 3px;
    border-radius: 0 2px 2px 0;
}

/* Icon */
.file-card__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

.file-card:hover .file-card__icon {
    transform: scale(1.08);
}

/* Body */
.file-card__body {
    flex: 1;
    min-width: 0;
}

.file-card__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.file-card__category {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 5px;
}

.file-card__format {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-color-secondary);
    opacity: 0.6;
    letter-spacing: 0.04em;
}

.file-card__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 4px;
    line-height: 1.3;
}

.file-card__desc {
    font-size: 13px;
    color: var(--text-color-secondary);
    margin: 0;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Action */
.file-card__action {
    flex-shrink: 0;
    margin-left: 8px;
}

.file-card__download-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-ground));
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s ease;
}

.file-card:hover .file-card__download-btn {
    background: var(--primary-color);
    color: #ffffff;
    box-shadow: 0 4px 14px color-mix(in srgb, var(--primary-color) 40%, transparent);
}

.file-card__spinner {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-ground));
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

/* ─── Info footer ─────────────────────────────────────────────── */
.info-footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    background: color-mix(in srgb, var(--primary-color) 6%, var(--surface-ground));
    border: 1px solid color-mix(in srgb, var(--primary-color) 18%, var(--surface-border));
    border-radius: 10px;
    font-size: 13px;
    color: var(--text-color-secondary);
    line-height: 1.5;
}

.info-footer .pi {
    color: var(--primary-color);
    font-size: 15px;
    flex-shrink: 0;
}

.info-footer strong {
    color: var(--text-color);
    font-weight: 600;
}

/* ─── Animation ───────────────────────────────────────────────── */
@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ─── Responsive ──────────────────────────────────────────────── */
@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        padding: 20px;
    }

    .page-header__desc {
        max-width: 100%;
    }

    .page-header__title {
        font-size: 18px;
    }

    .stats-bar {
        padding: 14px 16px;
    }

    .stat-value {
        font-size: 18px;
    }

    .file-card {
        padding: 14px 16px 14px 18px;
        gap: 14px;
    }

    .file-card__desc {
        display: none;
    }

    .file-card__icon {
        width: 40px;
        height: 40px;
        font-size: 17px;
    }
}

@media (max-width: 480px) {
    .stats-bar {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
        padding: 16px;
    }

    .stat-divider {
        width: 100%;
        height: 1px;
    }

    .stat-item {
        justify-content: flex-start;
    }

    .page-header__left {
        gap: 14px;
    }

    .page-header__icon {
        width: 46px;
        height: 46px;
        font-size: 18px;
    }
}
</style>
