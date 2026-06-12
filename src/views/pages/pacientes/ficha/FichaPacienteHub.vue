<template>
    <div class="card ficha-hub">

        <!-- ───── CABEÇALHO ───── -->
        <div class="ficha-hub__header">
            <!-- Esquerda: Identidade -->
            <div class="ficha-hub__identity" data-tour="tour-ficha-hero-identidade">
                <h1 class="ficha-hub__nome">{{ paciente?.nome || 'Carregando...' }}</h1>
                <div class="ficha-hub__nome-line"></div>

                <div class="ficha-hub__status" data-tour="tour-ficha-hero-status">
                    <button
                        v-if="paciente?.status_tratamento && podeEditar"
                        class="ficha-hub__status-btn"
                        :class="`ficha-hub__status-btn--${getStatusSeverity(paciente.status_tratamento)}`"
                        @click="abrirDialogAlterarStatus"
                        title="Clique para alterar o status"
                    >
                        <span class="ficha-hub__status-dot"></span>
                        {{ paciente.status_tratamento }}
                        <i class="pi pi-pencil ficha-hub__status-edit-icon"></i>
                    </button>
                    <span
                        v-else-if="paciente?.status_tratamento"
                        class="ficha-hub__status-btn"
                        :class="`ficha-hub__status-btn--${getStatusSeverity(paciente.status_tratamento)}`"
                    >
                        <span class="ficha-hub__status-dot"></span>
                        {{ paciente.status_tratamento }}
                    </span>
                </div>
            </div>

            <!-- Direita: Botões no topo + Cartão de dados abaixo -->
            <div class="ficha-hub__right">
                <div v-if="podeEditar" class="ficha-hub__acoes" data-tour="tour-ficha-hero-editar">
                    <Button icon="pi pi-user-edit" label="Editar" @click="editarPaciente" />
                    <Button
                        icon="pi pi-trash"
                        label="Excluir"
                        severity="danger"
                        outlined
                        data-tour="tour-ficha-hero-excluir"
                        @click="confirmarExclusao($event)"
                    />
                </div>

                <!-- Sempre exibe os 3 campos, com traço quando vazio -->
                <div class="ficha-hub__info-card surface-card border-round-xl">
                    <div class="ficha-hub__info-avatar">
                        <i class="pi pi-user"></i>
                    </div>
                    <div class="ficha-hub__info-items">
                        <div class="ficha-hub__info-item">
                            <i class="pi pi-calendar ficha-hub__info-icon"></i>
                            <div>
                                <span class="ficha-hub__info-label">Data de nascimento</span>
                                <span class="ficha-hub__info-value">
                                    <template v-if="paciente?.data_nascimento">
                                        {{ formatarData(paciente.data_nascimento) }}
                                        <span v-if="calcularIdade(paciente.data_nascimento)"> ({{ calcularIdade(paciente.data_nascimento) }} anos)</span>
                                    </template>
                                    <template v-else>—</template>
                                </span>
                            </div>
                        </div>
                        <div class="ficha-hub__info-item">
                            <i class="pi pi-phone ficha-hub__info-icon"></i>
                            <div>
                                <span class="ficha-hub__info-label">Telefone</span>
                                <span class="ficha-hub__info-value">{{ paciente?.telefone || '—' }}</span>
                            </div>
                        </div>
                        <div class="ficha-hub__info-item">
                            <i class="pi pi-envelope ficha-hub__info-icon"></i>
                            <div>
                                <span class="ficha-hub__info-label">E-mail</span>
                                <span class="ficha-hub__info-value">{{ paciente?.email || '—' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ───── CARDS DE NAVEGAÇÃO ───── -->
        <div class="ficha-hub__section-title">
            <h5 class="m-0 mb-1">Áreas do Paciente</h5>
            <p class="text-color-secondary m-0">Acesse prontuários, sessões, anexos e demais informações do paciente.</p>
        </div>

        <div class="grid">
            <div v-for="secao in secoes" :key="secao.rota" class="col-12 md:col-6 xl:col-4">
                <router-link :to="secao.rota" class="ficha-nav-card no-underline">
                    <div
                        class="ficha-nav-card__inner surface-card border-round-xl"
                        :style="{ borderLeft: `4px solid ${secao.cor}` }"
                    >
                        <!-- Linha principal: ícone com bg + título + chevron -->
                        <div class="ficha-nav-card__header">
                            <div
                                class="ficha-nav-card__icon-wrap"
                                :style="{ background: secao.corFundo }"
                            >
                                <img :src="secao.imagem" :alt="secao.titulo" class="ficha-nav-card__icon-img" />
                            </div>
                            <h6 class="ficha-nav-card__title">{{ secao.titulo }}</h6>
                            <i class="pi pi-chevron-right ficha-nav-card__chevron"></i>
                        </div>

                        <!-- Descrição e badge -->
                        <p class="ficha-nav-card__desc">{{ secao.descricao }}</p>
                        <p v-if="secao.badge" class="ficha-nav-card__badge">{{ secao.badge }}</p>

                        <!-- Imagem decorativa fundo direito -->
                        <img :src="secao.imagem" :alt="''" class="ficha-nav-card__deco" aria-hidden="true" />
                    </div>
                </router-link>
            </div>
        </div>

        <DialogAlterarStatus
            :visible="dialogAlterarStatus"
            :paciente="paciente || {}"
            @update:visible="dialogAlterarStatus = false"
            @status-alterado="onStatusAlterado"
        />

        <ConfirmPopup group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="rounded p-4">
                    <span>{{ message.message }}</span>
                    <div class="flex items-center gap-2 mt-4">
                        <Button label="Não" variant="outlined" @click="rejectCallback" severity="secondary" size="small" text />
                        <Button label="Sim" @click="acceptCallback" size="small" />
                    </div>
                </div>
            </template>
        </ConfirmPopup>
    </div>
</template>

<script>
import DialogAlterarStatus from '@/components/dialogs/pacientes/DialogAlterarStatus.vue';
import fichaPacienteMixin from './fichaPacienteMixin';

import imgDados      from '@/assets/icones/icon_dados_pessoais.png';
import imgProntuario from '@/assets/icones/icone_prontuarios.png';
import imgSessoes    from '@/assets/icones/icone_sessoes.png';
import imgAnexos     from '@/assets/icones/icone_anexos.png';
import imgAnamnese   from '@/assets/icones/icone_anamnese.png';
import imgEvolucao   from '@/assets/icones/icone_evolucao.png';

export default {
    name: 'FichaPacienteHub',
    components: { DialogAlterarStatus },
    mixins: [fichaPacienteMixin],
    data() {
        return { dialogAlterarStatus: false };
    },
    computed: {
        secoes() {
            const stats = this.estatisticas || {};
            const base  = `/pacientes/ficha/${this.pacienteId}`;
            return [
                {
                    rota: `${base}/dados`,
                    titulo: 'Dados Pessoais',
                    descricao: 'Informações de contato, nascimento e status do tratamento.',
                    imagem: imgDados,
                    cor: '#3b82f6',
                    corFundo: 'rgba(59,130,246,0.10)'
                },
                {
                    rota: `${base}/prontuarios`,
                    titulo: 'Prontuários',
                    descricao: 'Registros clínicos, relatórios e notas das sessões.',
                    imagem: imgProntuario,
                    cor: '#7c3aed',
                    corFundo: 'rgba(124,58,237,0.10)'
                },
                {
                    rota: `${base}/sessoes`,
                    titulo: 'Sessões',
                    descricao: 'Agendamentos, histórico e notas das sessões e presenças.',
                    imagem: imgSessoes,
                    cor: '#16a34a',
                    corFundo: 'rgba(22,163,74,0.10)',
                    badge: `${stats.sessoes_agendadas || 0} agendadas · ${stats.sessoes_pendentes || 0} pendentes`
                },
                {
                    rota: `${base}/anexos`,
                    titulo: 'Anexos',
                    descricao: 'Arquivos, documentos e materiais enviados pelo paciente.',
                    imagem: imgAnexos,
                    cor: '#9333ea',
                    corFundo: 'rgba(147,51,234,0.10)',
                    badge: `${stats.total_anexos || 0} arquivo(s)`
                },
                {
                    rota: `${base}/anamnese`,
                    titulo: 'Anamnese',
                    descricao: 'Formulários e histórico clínico do paciente.',
                    imagem: imgAnamnese,
                    cor: '#0891b2',
                    corFundo: 'rgba(8,145,178,0.10)'
                },
                {
                    rota: `${base}/evolucao`,
                    titulo: 'Evolução',
                    descricao: 'Gráficos, métricas e insights sobre o progresso do tratamento.',
                    imagem: imgEvolucao,
                    cor: '#ea580c',
                    corFundo: 'rgba(234,88,12,0.10)'
                }
            ];
        }
    },
    async mounted() {
        await this.carregarPaciente();
        await this.carregarEstatisticas();
    },
    methods: {
        calcularIdade(dataNascimento) {
            if (!dataNascimento) return null;
            let d;
            if (typeof dataNascimento === 'string' && dataNascimento.includes('/')) {
                const p = dataNascimento.split('/');
                d = p.length === 3 ? new Date(`${p[2]}-${p[1]}-${p[0]}`) : new Date(dataNascimento);
            } else {
                d = new Date(dataNascimento);
            }
            if (isNaN(d.getTime())) return null;
            const hoje = new Date();
            let idade = hoje.getFullYear() - d.getFullYear();
            const mes = hoje.getMonth() - d.getMonth();
            if (mes < 0 || (mes === 0 && hoje.getDate() < d.getDate())) idade--;
            return idade;
        },
        editarPaciente() {
            this.$router.push(`/pacientes/editar/${this.pacienteId}`);
        },
        confirmarExclusao(event) {
            this.$confirm.require({
                target: event?.currentTarget,
                group: 'headless',
                message: `Tem certeza que deseja excluir o paciente "${this.paciente?.nome}"?`,
                accept: () => this.excluirPaciente(),
                reject: () => {}
            });
        },
        async excluirPaciente() {
            try {
                await this.$pacientesService.excluir(this.pacienteId);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente excluído com sucesso', life: 3000 });
                this.$router.push('/pacientes');
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir paciente', life: 3000 });
            }
        },
        abrirDialogAlterarStatus() { this.dialogAlterarStatus = true; },
        onStatusAlterado() {
            this.dialogAlterarStatus = false;
            this.carregarPaciente();
            this.carregarEstatisticas();
        }
    }
};
</script>

<style scoped>
/* ── Wrapper ── */
.ficha-hub {
    padding: 2rem;
}

/* ── Cabeçalho ── */
.ficha-hub__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.ficha-hub__identity { flex: 1; min-width: 0; }

.ficha-hub__nome {
    margin: 0 0 0.35rem 0;
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-color);
}

.ficha-hub__status { margin-bottom: 0; }

/* Linha decorativa abaixo do nome */
.ficha-hub__nome-line {
    width: 2.5rem;
    height: 3px;
    border-radius: 2px;
    background: var(--primary-color);
    margin: 0.5rem 0 0.75rem 0;
}

/* Botão de status clicável */
.ficha-hub__status-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.85rem 0.35rem 0.65rem;
    border-radius: 2rem;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid currentColor;
    background: transparent;
    font-family: inherit;
    transition: background 0.15s ease, opacity 0.15s ease;
    line-height: 1;
}

.ficha-hub__status-btn:hover {
    opacity: 0.85;
    filter: brightness(0.96);
}

.ficha-hub__status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
}

.ficha-hub__status-edit-icon {
    font-size: 0.65rem;
    opacity: 0.7;
    margin-left: 0.1rem;
}

/* Variantes por severity */
.ficha-hub__status-btn--info {
    color: #3b82f6;
    border-color: #93c5fd;
    background: rgba(59, 130, 246, 0.07);
}
.ficha-hub__status-btn--success {
    color: #16a34a;
    border-color: #86efac;
    background: rgba(22, 163, 74, 0.07);
}
.ficha-hub__status-btn--warning {
    color: #d97706;
    border-color: #fcd34d;
    background: rgba(217, 119, 6, 0.07);
}
.ficha-hub__status-btn--danger {
    color: #dc2626;
    border-color: #fca5a5;
    background: rgba(220, 38, 38, 0.07);
}

/* Coluna direita */
.ficha-hub__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.875rem;
    flex-shrink: 0;
}

.ficha-hub__acoes {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}

/* ── Cartão de dados rápidos ── */
.ficha-hub__info-card {
    display: flex;
    align-items: center;
    gap: 1.75rem;
    padding: 1.5rem 2rem;
    border: 1px solid var(--surface-border);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
    width: 100%;
    max-width: 680px;
}

.ficha-hub__info-avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--primary-color) 12%, var(--surface-ground));
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    flex-shrink: 0;
}

/* Itens em linha, com divisores verticais entre eles */
.ficha-hub__info-items {
    display: flex;
    flex: 1;
    min-width: 0;
}

.ficha-hub__info-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex: 1;
    padding: 0 1.25rem;
    border-left: 1px solid var(--surface-border);
}

.ficha-hub__info-item:first-child {
    border-left: none;
    padding-left: 0;
}

.ficha-hub__info-icon {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    margin-top: 0.2rem;
    flex-shrink: 0;
}

.ficha-hub__info-label {
    display: block;
    font-size: 0.72rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1;
    margin-bottom: 0.35rem;
    white-space: nowrap;
}

.ficha-hub__info-value {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-color);
    white-space: nowrap;
}

/* ── Título da seção ── */
.ficha-hub__section-title { margin-bottom: 1.25rem; }

/* ── Cards de navegação ── */
.ficha-nav-card {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
}

.ficha-nav-card__inner {
    position: relative;
    overflow: hidden;
    padding: 1.25rem 1.25rem 1.25rem 1rem;
    height: 100%;
    min-height: 150px;
    border: 1px solid var(--surface-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    cursor: pointer;
    background: var(--surface-card);
}

.ficha-nav-card:hover .ficha-nav-card__inner {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.11);
    transform: translateY(-2px);
}

/* Linha de cabeçalho do card: ícone + título + chevron */
.ficha-nav-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 1;
}

/* Fundo colorido do ícone */
.ficha-nav-card__icon-wrap {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.ficha-nav-card__icon-img {
    width: 1.75rem;
    height: 1.75rem;
    object-fit: contain;
}

.ficha-nav-card__title {
    flex: 1;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
}

.ficha-nav-card__chevron {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    opacity: 0.6;
    flex-shrink: 0;
}

.ficha-nav-card__desc {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-color-secondary);
    line-height: 1.5;
    position: relative;
    z-index: 1;
    max-width: 72%;
}

.ficha-nav-card__badge {
    margin: 0.4rem 0 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-color-secondary);
    position: relative;
    z-index: 1;
}

/* Imagem decorativa — canto inferior direito, semitransparente */
.ficha-nav-card__deco {
    position: absolute;
    bottom: -8px;
    right: -8px;
    width: 100px;
    height: 100px;
    object-fit: contain;
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
}

.cursor-pointer { cursor: pointer; }
</style>
