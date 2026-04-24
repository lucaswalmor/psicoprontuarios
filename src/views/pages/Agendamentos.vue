<template>
    <div class="agendamentos-wrapper">
        <AgendamentosTour />

        <!-- Loading -->
        <div v-if="isLoading" class="loading-state">
            <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <template v-else>
            <div class="agendamentos-layout">

                <!-- LEFT PANEL -->
                <div class="left-panel">

                    <!-- Calendar Card -->
                    <div class="cal-card" data-tour="tour-ag-calendario">
                        <DatePicker
                            v-model="dataSelecionada"
                            inline
                            class="w-full custom-datepicker"
                            @update:modelValue="onDataSelecionada"
                            @month-change="onMonthChange($event)"
                        />
                    </div>

                    <!-- Holidays Card -->
                    <div class="holidays-card" data-tour="tour-ag-feriados">
                        <div class="holidays-title">Feriados do Mês</div>

                        <div v-if="feriadosDoMes.length === 0" class="holidays-empty">
                            <i class="pi pi-info-circle"></i>
                            <span>Nenhum feriado neste mês</span>
                        </div>

                        <div v-else class="holiday-list">
                            <div
                                v-for="feriado in feriadosDoMes"
                                :key="feriado.data"
                                class="holiday-item"
                            >
                                <div
                                    class="holiday-date-badge"
                                    :class="{ 'badge-facultativo': feriado.tipo === 'facultativo' }"
                                >
                                    <div class="holiday-date-num">{{ formatarDiaFeriado(feriado.data) }}</div>
                                    <div class="holiday-date-month">{{ formatarMesFeriado(feriado.data) }}</div>
                                </div>
                                <div class="holiday-info">
                                    <div class="holiday-name">{{ feriado.nome }}</div>
                                    <span
                                        class="holiday-tag"
                                        :class="{ 'tag-facultativo': feriado.tipo === 'facultativo' }"
                                    >
                                        {{ feriado.tipo === 'nacional' ? 'Nacional' : 'Facultativo' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- RIGHT PANEL -->
                <div class="right-panel">
                    <div class="agenda-card">

                        <!-- Header -->
                        <div class="agenda-header" data-tour="tour-ag-header">
                            <div class="agenda-date-info">
                                <div class="agenda-label">Agendamentos</div>
                                <div class="agenda-title-text">{{ dataFormatada }}</div>
                            </div>
                            <button
                                type="button"
                                class="btn-new"
                                data-tour="tour-ag-novo"
                                @click="abrirDialogNovoAgendamento"
                            >
                                <span class="btn-plus">+</span>
                                Novo Agendamento
                            </button>
                        </div>

                        <div data-tour="tour-ag-area-dia" class="tour-ag-area-dia">
                        <!-- Time indicator (somente quando for o dia de hoje) -->
                        <div v-if="isHoje" class="time-indicator">
                            <div class="time-dot"></div>
                            <div class="time-text">Agora: {{ horaAtual }}</div>
                        </div>

                        <!-- Empty state -->
                        <div v-if="agendamentosDoDia.length === 0" class="empty-state">
                            <div class="empty-icon">
                                <i class="pi pi-calendar"></i>
                            </div>
                            <div class="empty-title">Nenhum agendamento</div>
                            <div class="empty-sub">Clique em "+ Novo Agendamento" para adicionar</div>
                        </div>

                        <!-- Appointment list -->
                        <div v-else class="appointments">
                            <div
                                v-for="agendamento in agendamentosDoDia"
                                :key="agendamento.publicId"
                                class="appt-item"
                                @click="abrirDialogEditarAgendamento(agendamento)"
                            >
                                <div class="appt-time-block">
                                    <div class="appt-clock-icon">
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
                                            <path d="M8 4v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        </svg>
                                    </div>
                                    <div class="appt-time">{{ formatarHorario(agendamento) }}</div>
                                </div>
                                <div class="appt-divider"></div>
                                <div class="appt-info">
                                    <div class="appt-name">{{ agendamento.title }}</div>
                                </div>
                                <i class="pi pi-angle-right appt-arrow"></i>
                            </div>
                        </div>
                        </div>

                    </div>
                </div>

            </div>
        </template>

        <!-- Dialog Novo Agendamento -->
        <DialogNovoAgendamento
            v-model:visible="dialogNovoAgendamento"
            :dataSelecionada="dataSelecionadaFormatada"
            @agendamentoSalvo="carregarAgendamentos"
        />

        <!-- Dialog Editar Agendamento -->
        <DialogEditarAgendamento
            v-model:visible="dialogEditarAgendamento"
            :agendamentoData="agendamentoSelecionado"
            @agendamentoAtualizado="carregarAgendamentos"
            @agendamentoExcluido="carregarAgendamentos"
        />
    </div>
</template>

<script>
import DatePicker from 'primevue/datepicker';
import DialogNovoAgendamento from '@/components/dialogs/agendamentos/DialogNovoAgendamento.vue';
import DialogEditarAgendamento from '@/components/dialogs/agendamentos/DialogEditarAgendamento.vue';
import AgendamentosTour from '@/components/tour/AgendamentosTour.vue';

export default {
    name: 'Agendamentos2',
    components: {
        DatePicker,
        DialogNovoAgendamento,
        DialogEditarAgendamento,
        AgendamentosTour
    },
    data() {
        const hoje = new Date();
        return {
            isLoading: false,
            dataSelecionada: new Date(),
            todosAgendamentos: [],
            dialogNovoAgendamento: false,
            dialogEditarAgendamento: false,
            agendamentoSelecionado: {},
            feriados: [],
            mesVisualizado: hoje.getMonth() + 1,
            anoVisualizado: hoje.getFullYear(),
            horaAtual: '',
            horaAtualInterval: null
        };
    },
    computed: {
        dataSelecionadaFormatada() {
            if (!this.dataSelecionada) return '';
            const date = this.dataSelecionada instanceof Date ? this.dataSelecionada : new Date(this.dataSelecionada);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        dataFormatada() {
            if (!this.dataSelecionada) return '';
            const date = new Date(this.dataSelecionada);
            return date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        isHoje() {
            if (!this.dataSelecionada) return false;
            const hoje = new Date();
            const sel = this.dataSelecionada instanceof Date ? this.dataSelecionada : new Date(this.dataSelecionada);
            return (
                sel.getFullYear() === hoje.getFullYear() &&
                sel.getMonth() === hoje.getMonth() &&
                sel.getDate() === hoje.getDate()
            );
        },

        agendamentosDoDia() {
            if (!this.dataSelecionada || this.todosAgendamentos.length === 0) {
                return [];
            }

            const dataSelecionadaStr = this.dataSelecionadaFormatada;

            return this.todosAgendamentos.filter(agendamento => {
                return agendamento.date === dataSelecionadaStr;
            }).sort((a, b) => {
                if (a.time && b.time) {
                    return a.time.localeCompare(b.time);
                }
                return 0;
            });
        },

        datasComAgendamento() {
            return new Set(this.todosAgendamentos.map(agendamento => agendamento.date));
        },

        mesSelecionado() {
            if (!this.dataSelecionada) return null;
            const date = this.dataSelecionada instanceof Date ? this.dataSelecionada : new Date(this.dataSelecionada);
            return date.getMonth() + 1;
        },

        anoSelecionado() {
            if (!this.dataSelecionada) return null;
            const date = this.dataSelecionada instanceof Date ? this.dataSelecionada : new Date(this.dataSelecionada);
            return date.getFullYear();
        },

        feriadosDoMes() {
            if (!this.mesVisualizado || !this.anoVisualizado) return [];

            const feriadosAtualizados = this.obterFeriadosBrasileiros(this.anoVisualizado);

            return feriadosAtualizados.filter(feriado => {
                const feriadoDate = new Date(feriado.data);
                const feriadoMes = feriadoDate.getMonth() + 1;
                const feriadoAno = feriadoDate.getFullYear();

                if (feriado.fixo) {
                    return feriadoMes === this.mesVisualizado;
                } else {
                    return feriadoMes === this.mesVisualizado && feriadoAno === this.anoVisualizado;
                }
            }).sort((a, b) => {
                const dataA = new Date(a.data);
                const dataB = new Date(b.data);
                return dataA.getDate() - dataB.getDate();
            });
        }
    },
    async mounted() {
        this.feriados = this.obterFeriadosBrasileiros();
        this.atualizarHoraAtual();
        this.horaAtualInterval = setInterval(this.atualizarHoraAtual, 60000);
        await this.carregarAgendamentos();
        this.$nextTick(() => {
            this.marcarDatasComAgendamento();
            this.observarCalendario();
        });
    },

    updated() {
        this.$nextTick(() => {
            this.marcarDatasComAgendamento();
        });
    },

    beforeUnmount() {
        if (this._calendarObserver) {
            this._calendarObserver.disconnect();
        }
        if (this.horaAtualInterval) {
            clearInterval(this.horaAtualInterval);
        }
    },
    methods: {
        atualizarHoraAtual() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            this.horaAtual = `${h}:${m}`;
        },

        async carregarAgendamentos() {
            this.isLoading = true;

            try {
                const response = await this.$agendamentosService.getAll();

                let agendamentos = [];
                if (response && response.data) {
                    agendamentos = response.data;
                } else if (Array.isArray(response)) {
                    agendamentos = response;
                }

                this.todosAgendamentos = this.formatarAgendamentos(agendamentos);

                this.$nextTick(() => {
                    this.marcarDatasComAgendamento();
                });
            } catch (error) {
                console.error('Erro ao carregar agendamentos:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar agendamentos',
                    life: 3000
                });
            } finally {
                this.isLoading = false;
            }
        },

        formatarAgendamentos(agendamentos) {
            return agendamentos.map(agendamento => {
                const date = agendamento.date || '';

                return {
                    title: agendamento.title || 'Agendamento',
                    date: date.split('T')[0].split(' ')[0],
                    time: agendamento.time || '',
                    publicId: agendamento.publicId
                };
            });
        },

        onDataSelecionada() {
            this.$nextTick(() => {
                this.marcarDatasComAgendamento();
            });
        },

        onMonthChange(event) {
            if (event && event.month !== undefined && event.year !== undefined) {
                this.mesVisualizado = event.month;
                this.anoVisualizado = event.year;

                setTimeout(() => {
                    this.marcarDatasComAgendamento();
                }, 100);
            }
        },

        temAgendamento(dateObj) {
            if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
                return false;
            }

            const dateStr = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
            return this.datasComAgendamento.has(dateStr);
        },

        marcarDatasComAgendamento() {
            this.$nextTick(() => {
                const cells = document.querySelectorAll('.custom-datepicker .p-datepicker-calendar td');
                if (cells.length === 0) return;

                const datasComAgendamento = this.datasComAgendamento;

                const currentYear = this.anoVisualizado || new Date().getFullYear();
                const currentMonth = (this.mesVisualizado || new Date().getMonth() + 1) - 1;

                cells.forEach(cell => {
                    const span = cell.querySelector('span');
                    if (!span) return;

                    const dayText = span.textContent.trim();
                    if (!dayText || isNaN(dayText)) return;

                    const day = parseInt(dayText);

                    if (cell.classList.contains('p-datepicker-other-month')) {
                        cell.classList.remove('has-appointment');
                        return;
                    }

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    if (datasComAgendamento.has(dateStr)) {
                        cell.classList.add('has-appointment');
                    } else {
                        cell.classList.remove('has-appointment');
                    }
                });
            });
        },

        observarCalendario() {
            const calendarElement = document.querySelector('.custom-datepicker .p-datepicker');
            if (!calendarElement) return;

            let timeoutId = null;
            const debouncedMark = () => {
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    this.marcarDatasComAgendamento();
                }, 150);
            };

            const observer = new MutationObserver(debouncedMark);

            observer.observe(calendarElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });

            this._calendarObserver = observer;
        },

        formatarHorario(agendamento) {
            if (agendamento && agendamento.time) {
                return agendamento.time;
            }
            return '--:--';
        },

        abrirDialogNovoAgendamento() {
            this.dialogNovoAgendamento = true;
        },

        async abrirDialogEditarAgendamento(agendamento) {
            try {
                const response = await this.$agendamentosService.getById(agendamento.publicId);

                if (response && Object.keys(response).length > 0) {
                    this.agendamentoSelecionado = response;

                    await this.$nextTick();

                    this.dialogEditarAgendamento = true;
                } else {
                    throw new Error('Dados do agendamento não encontrados');
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do agendamento:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar detalhes do agendamento',
                    life: 3000
                });
            }
        },

        obterFeriadosBrasileiros(ano = null) {
            if (!ano) {
                ano = new Date().getFullYear();
            }
            const feriados = [];

            const calcularPascoa = (ano) => {
                const a = ano % 19;
                const b = Math.floor(ano / 100);
                const c = ano % 100;
                const d = Math.floor(b / 4);
                const e = b % 4;
                const f = Math.floor((b + 8) / 25);
                const g = Math.floor((b - f + 1) / 3);
                const h = (19 * a + b - d - g + 15) % 30;
                const i = Math.floor(c / 4);
                const k = c % 4;
                const l = (32 + 2 * e + 2 * i - h - k) % 7;
                const m = Math.floor((a + 11 * h + 22 * l) / 451);
                const mes = Math.floor((h + l - 7 * m + 114) / 31);
                const dia = ((h + l - 7 * m + 114) % 31) + 1;
                return new Date(ano, mes - 1, dia);
            };

            const calcularCarnaval = (ano) => {
                const pascoa = calcularPascoa(ano);
                const carnaval = new Date(pascoa);
                carnaval.setDate(pascoa.getDate() - 47);
                return carnaval;
            };

            const calcularSextaFeiraSanta = (ano) => {
                const pascoa = calcularPascoa(ano);
                const sextaFeiraSanta = new Date(pascoa);
                sextaFeiraSanta.setDate(pascoa.getDate() - 2);
                return sextaFeiraSanta;
            };

            const calcularCorpusChristi = (ano) => {
                const pascoa = calcularPascoa(ano);
                const corpusChristi = new Date(pascoa);
                corpusChristi.setDate(pascoa.getDate() + 60);
                return corpusChristi;
            };

            feriados.push(
                { data: `${ano}-01-01`, nome: 'Confraternização Universal', tipo: 'nacional', fixo: true },
                { data: `${ano}-04-21`, nome: 'Tiradentes', tipo: 'nacional', fixo: true },
                { data: `${ano}-05-01`, nome: 'Dia do Trabalhador', tipo: 'nacional', fixo: true },
                { data: `${ano}-09-07`, nome: 'Independência do Brasil', tipo: 'nacional', fixo: true },
                { data: `${ano}-10-12`, nome: 'Nossa Senhora Aparecida', tipo: 'nacional', fixo: true },
                { data: `${ano}-11-02`, nome: 'Finados', tipo: 'nacional', fixo: true },
                { data: `${ano}-11-15`, nome: 'Proclamação da República', tipo: 'nacional', fixo: true },
                { data: `${ano}-11-20`, nome: 'Dia Nacional de Zumbi e da Consciência Negra', tipo: 'facultativo', fixo: true },
                { data: `${ano}-12-25`, nome: 'Natal', tipo: 'nacional', fixo: true }
            );

            for (let y = ano; y <= ano + 1; y++) {
                const pascoa = calcularPascoa(y);
                const carnaval = calcularCarnaval(y);
                const sextaFeiraSanta = calcularSextaFeiraSanta(y);
                const corpusChristi = calcularCorpusChristi(y);

                feriados.push(
                    {
                        data: `${y}-${String(carnaval.getMonth() + 1).padStart(2, '0')}-${String(carnaval.getDate()).padStart(2, '0')}`,
                        nome: 'Carnaval',
                        tipo: 'facultativo',
                        fixo: false
                    },
                    {
                        data: `${y}-${String(sextaFeiraSanta.getMonth() + 1).padStart(2, '0')}-${String(sextaFeiraSanta.getDate()).padStart(2, '0')}`,
                        nome: 'Sexta-feira Santa',
                        tipo: 'nacional',
                        fixo: false
                    },
                    {
                        data: `${y}-${String(pascoa.getMonth() + 1).padStart(2, '0')}-${String(pascoa.getDate()).padStart(2, '0')}`,
                        nome: 'Páscoa',
                        tipo: 'nacional',
                        fixo: false
                    },
                    {
                        data: `${y}-${String(corpusChristi.getMonth() + 1).padStart(2, '0')}-${String(corpusChristi.getDate()).padStart(2, '0')}`,
                        nome: 'Corpus Christi',
                        tipo: 'facultativo',
                        fixo: false
                    }
                );
            }

            return feriados;
        },

        formatarDiaFeriado(dataStr) {
            const date = new Date(dataStr);
            date.setDate(date.getDate() + 1);
            return String(date.getDate()).padStart(2, '0');
        },

        formatarMesFeriado(dataStr) {
            const date = new Date(dataStr);
            date.setDate(date.getDate() + 1);
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            return meses[date.getMonth()];
        }
    }
};
</script>

<style scoped>
/* ─── Wrapper ────────────────────────────────────────────────── */
.agendamentos-wrapper {
    min-height: 100%;
}

.loading-state {
    display: flex;
    justify-content: center;
    padding: 4rem 1rem;
}

/* ─── Layout grid ────────────────────────────────────────────── */
.agendamentos-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;
    padding: 4px 0 28px;
    animation: fadeSlideIn 0.4s ease both;
}

/* ─── Left panel ─────────────────────────────────────────────── */
.left-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Calendar Card */
.cal-card {
    background: var(--surface-card);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--surface-border);
    overflow: hidden;
}

/* Holidays Card */
.holidays-card {
    background: var(--surface-card);
    border-radius: 16px;
    padding: 22px 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--surface-border);
    animation: fadeSlideIn 0.5s ease both;
    color: var(--text-color);
}

.holidays-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-color-secondary);
    opacity: 0.75;
    margin-bottom: 16px;
}

.holidays-empty {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-color-secondary);
    font-size: 13px;
    padding: 8px 0;
}

.holiday-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.holiday-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 14px;
    border-radius: 10px;
    background-color: var(--surface-ground) !important;
    border: 1px solid var(--surface-border);
    transition: all 0.2s;
    color: var(--text-color) !important;
}

.holiday-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/*
 * Badge usa --p-primary-500 (token primitivo do PrimeVue 4),
 * que sempre aponta para a cor real da paleta (ex: emerald-500, purple-500),
 * independente do light/dark mode semântico.
 * Em dark mode (classe .app-dark no html), usa --p-primary-600 para garantir
 * contraste com texto branco, já que alguns temas (noir) mapeiam --primary-color
 * para tonalidades claras como surface.50.
 */
.holiday-date-badge {
    background-color: var(--p-primary-500, var(--primary-color, #6366f1)) !important;
    color: #ffffff !important;
    border-radius: 8px;
    width: 38px;
    min-width: 38px;
    text-align: center;
    padding: 5px 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

:global(.app-dark) .holiday-date-badge {
    background-color: var(--p-primary-600, var(--p-primary-500, #4f46e5)) !important;
}

.holiday-date-badge.badge-facultativo {
    background-color: #3b82f6 !important;
}

:global(.app-dark) .holiday-date-badge.badge-facultativo {
    background-color: #2563eb !important;
}

.holiday-date-num {
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    color: #ffffff !important;
    display: block;
}

.holiday-date-month {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.85) !important;
    display: block;
}

.holiday-info {
    flex: 1;
}

.holiday-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color) !important;
}

.holiday-tag {
    display: inline-block;
    margin-top: 3px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--primary-color) !important;
    background: rgba(var(--primary-color-rgb, 99, 102, 241), 0.12);
    border-radius: 4px;
    padding: 1px 6px;
}

.holiday-tag.tag-facultativo {
    color: var(--blue-500, #3b82f6) !important;
    background: rgba(59, 130, 246, 0.12);
}

/* ─── Right panel ────────────────────────────────────────────── */
.right-panel {
    animation: fadeSlideIn 0.45s ease both;
}

.agenda-card {
    background: var(--surface-card);
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--surface-border);
    min-height: 500px;
}

/* Agenda header */
.agenda-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--surface-border);
}

.agenda-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-color-secondary);
    opacity: 0.75;
    margin-bottom: 4px;
}

.agenda-title-text {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-color);
    line-height: 1.3;
    text-transform: capitalize;
}

/* New appointment button */
.btn-new {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--green-500, #22c55e);
    color: #ffffff !important;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
    letter-spacing: 0.01em;
    white-space: nowrap;
}

.btn-new:hover {
    background: var(--green-600, #16a34a);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-new:active {
    transform: translateY(0);
}

.btn-plus {
    font-size: 18px;
    line-height: 1;
}

/* ─── Time indicator ─────────────────────────────────────────── */
.time-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}

.time-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-50);
    animation: pulse 2s infinite;
}

.time-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-color-secondary);
}

/* ─── Appointment list ───────────────────────────────────────── */
.appointments {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.appt-item {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 16px 20px;
    border-radius: 10px;
    border: 1.5px solid var(--surface-border);
    background: var(--surface-ground);
    cursor: pointer;
    transition: all 0.22s;
    position: relative;
    overflow: hidden;
}

.appt-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--primary-color);
    border-radius: 2px;
}

.appt-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transform: translateX(2px);
    background: var(--surface-card);
}

.appt-time-block {
    text-align: center;
    min-width: 52px;
}

.appt-clock-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-secondary);
    opacity: 0.5;
    margin-bottom: 2px;
}

.appt-time {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-color);
    letter-spacing: -0.01em;
}

.appt-divider {
    width: 1px;
    height: 36px;
    background: var(--surface-border);
    flex-shrink: 0;
}

.appt-info {
    flex: 1;
}

.appt-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-color);
    letter-spacing: 0.01em;
}

.appt-arrow {
    color: var(--text-color-secondary);
    font-size: 16px;
    opacity: 0.4;
    transition: transform 0.2s, opacity 0.2s, color 0.2s;
}

.appt-item:hover .appt-arrow {
    transform: translateX(3px);
    color: var(--primary-color);
    opacity: 1;
}

/* ─── Empty state ────────────────────────────────────────────── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    text-align: center;
}

.empty-icon {
    width: 56px;
    height: 56px;
    background: var(--primary-50);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    margin-bottom: 4px;
}

.empty-icon .pi {
    font-size: 24px;
}

.empty-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-color-secondary);
}

.empty-sub {
    font-size: 13px;
    color: var(--text-color-secondary);
    opacity: 0.7;
}

/* ─── Animations ─────────────────────────────────────────────── */
@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 0 0 3px var(--primary-50);
    }
    50% {
        box-shadow: 0 0 0 6px var(--primary-100, rgba(0, 0, 0, 0.04));
    }
}

/* ─── DatePicker deep customizations ─────────────────────────── */
:deep(.custom-datepicker .p-datepicker) {
    width: 100%;
    border: none;
    border-radius: 16px;
    background: var(--surface-card);
    padding: 16px;
}

:deep(.custom-datepicker .p-datepicker-calendar) {
    width: 100%;
}

:deep(.custom-datepicker .p-datepicker-table) {
    width: 100%;
    table-layout: fixed;
}

:deep(.custom-datepicker .p-datepicker-table td) {
    padding: 0.3rem;
}

:deep(.custom-datepicker .p-datepicker-calendar td span) {
    width: 100%;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 50%;
}

:deep(.custom-datepicker .p-datepicker-weekday-cell) {
    text-align: center;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-color-secondary);
    padding: 0.3rem;
    opacity: 0.6;
}

:deep(.custom-datepicker .p-datepicker-title) {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
}

:deep(.custom-datepicker .p-datepicker-calendar td.has-appointment span) {
    border: 2px solid var(--primary-color) !important;
    border-radius: 50% !important;
    font-weight: 700 !important;
    color: var(--primary-color) !important;
    background-color: var(--primary-50) !important;
}

:deep(.custom-datepicker .p-datepicker-calendar td.p-datepicker-day-selected.has-appointment span) {
    background-color: var(--primary-color) !important;
    color: var(--primary-color-text) !important;
    border-color: var(--primary-color) !important;
}

/* ─── Responsive ─────────────────────────────────────────────── */
@media (max-width: 1024px) {
    .agendamentos-layout {
        grid-template-columns: 280px 1fr;
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .agendamentos-layout {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .agenda-card {
        padding: 20px 18px;
    }

    .agenda-title-text {
        font-size: 16px;
    }

    .btn-new {
        padding: 9px 14px;
        font-size: 12px;
    }

    .appt-item {
        padding: 12px 14px;
        gap: 12px;
    }

    :deep(.custom-datepicker .p-datepicker-calendar td span) {
        min-height: 2rem;
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .agenda-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .btn-new {
        width: 100%;
        justify-content: center;
    }

    :deep(.custom-datepicker .p-datepicker-calendar td span) {
        min-height: 1.75rem;
        font-size: 0.8rem;
    }
}
</style>
