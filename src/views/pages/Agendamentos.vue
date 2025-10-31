<template>
    <div class="grid">
        <!-- Loading -->
        <div v-if="isLoading" class="col-12 flex justify-content-center p-4">
            <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <!-- Content -->
        <template v-else>
            <div class="col-12 agendamentos-layout">
                <div class="grid">
                    <!-- Coluna Esquerda: Calendário -->
                    <div class="col-12 md:col-4">
                        <div class="calendar-wrapper">
                            <DatePicker 
                                v-model="dataSelecionada" 
                                inline 
                                class="w-full sm:w-[30rem] custom-datepicker"
                                @update:modelValue="onDataSelecionada"
                            />
                        </div>
                    </div>

                    <!-- Coluna Direita: Lista de Agendamentos -->
                    <div class="col-12 md:col-8">
                        <div class="card agendamentos-card">
                            <div class="flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                                <h6 class="text-900 font-semibold mb-0">
                                    Agendamentos - {{ dataFormatada }}
                                </h6>
                                <Button 
                                    label="Novo Agendamento" 
                                    icon="pi pi-plus"
                                    severity="success"
                                    @click="abrirDialogNovoAgendamento"
                                />
                            </div>

                            <!-- Lista vazia -->
                            <div v-if="agendamentosDoDia.length === 0" class="empty-state">
                                <i class="pi pi-calendar-times text-4xl text-600 mb-3"></i>
                                <p class="text-600">Nenhum agendamento para este dia</p>
                            </div>

                            <!-- Lista de agendamentos -->
                            <div v-else class="agendamentos-list">
                                <div 
                                    v-for="agendamento in agendamentosDoDia" 
                                    :key="agendamento.publicId"
                                    class="agendamento-card"
                                    @click="abrirDialogEditarAgendamento(agendamento)"
                                >
                                    <div class="agendamento-card-content">
                                        <div class="flex align-items-center justify-content-between">
                                            <div class="flex align-items-center gap-3">
                                                <div class="agendamento-time">
                                                    <i class="pi pi-clock"></i>
                                                    <span>{{ formatarHorario(agendamento) }}</span>
                                                </div>
                                                <div class="agendamento-patient">
                                                    <h6 class="text-900 font-semibold mb-1">{{ agendamento.title }}</h6>
                                                </div>
                                            </div>
                                            <i class="pi pi-chevron-right text-400"></i>
                                        </div>
                                    </div>
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

export default {
    name: 'Agendamentos2',
    components: {
        DatePicker,
        DialogNovoAgendamento,
        DialogEditarAgendamento
    },
    data() {
        return {
            isLoading: false,
            dataSelecionada: new Date(),
            todosAgendamentos: [],
            dialogNovoAgendamento: false,
            dialogEditarAgendamento: false,
            agendamentoSelecionado: {}
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
        
        agendamentosDoDia() {
            if (!this.dataSelecionada || this.todosAgendamentos.length === 0) {
                return [];
            }
            
            const dataSelecionadaStr = this.dataSelecionadaFormatada;
            
            return this.todosAgendamentos.filter(agendamento => {
                return agendamento.date === dataSelecionadaStr;
            }).sort((a, b) => {
                // Ordenar por horário (se disponível)
                if (a.time && b.time) {
                    return a.time.localeCompare(b.time);
                }
                return 0;
            });
        },
        
        datasComAgendamento() {
            // Retorna um Set com todas as datas que têm agendamentos (formato YYYY-MM-DD)
            return new Set(this.todosAgendamentos.map(agendamento => agendamento.date));
        }
    },
    async mounted() {
        await this.carregarAgendamentos();
        this.$nextTick(() => {
            this.marcarDatasComAgendamento();
            this.observarCalendario();
        });
    },
    
    updated() {
        // Reaplicar marcações quando o componente for atualizado
        this.$nextTick(() => {
            this.marcarDatasComAgendamento();
        });
    },
    
    beforeUnmount() {
        // Limpar observer ao desmontar componente
        if (this._calendarObserver) {
            this._calendarObserver.disconnect();
        }
    },
    methods: {
        async carregarAgendamentos() {
            this.isLoading = true;
            
            try {
                const response = await this.$agendamentosService.getAll();
                
                // Verifica se a resposta tem a estrutura esperada
                let agendamentos = [];
                if (response && response.data) {
                    agendamentos = response.data;
                } else if (Array.isArray(response)) {
                    agendamentos = response;
                }
                
                this.todosAgendamentos = this.formatarAgendamentos(agendamentos);
                
                // Marcar datas com agendamento após carregar
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
                
                // O backend retorna apenas a data no formato YYYY-MM-DD (sem hora)
                // Não há horário disponível no formato retornado pelo método buscar()
                // Se precisar do horário, seria necessário buscar detalhes de cada agendamento
                
                return {
                    title: agendamento.title || 'Agendamento',
                    date: date.split('T')[0].split(' ')[0], // Apenas a data YYYY-MM-DD
                    time: '', // Não disponível no formato atual do backend
                    publicId: agendamento.publicId
                };
            });
        },
        
        onDataSelecionada() {
            // Lista é atualizada automaticamente pelo computed agendamentosDoDia
            this.$nextTick(() => {
                this.marcarDatasComAgendamento();
            });
        },
        
        temAgendamento(dateObj) {
            if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
                return false;
            }
            
            const dateStr = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
            return this.datasComAgendamento.has(dateStr);
        },
        
        marcarDatasComAgendamento() {
            // Marcar células do calendário que têm agendamentos
            this.$nextTick(() => {
                const cells = document.querySelectorAll('.custom-datepicker .p-datepicker-calendar td');
                if (cells.length === 0) return;
                
                const datasComAgendamento = this.datasComAgendamento;
                const currentDate = this.dataSelecionada instanceof Date ? this.dataSelecionada : new Date(this.dataSelecionada);
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth(); // 0-indexed
                
                cells.forEach(cell => {
                    const span = cell.querySelector('span');
                    if (!span) return;
                    
                    const dayText = span.textContent.trim();
                    if (!dayText || isNaN(dayText)) return;
                    
                    const day = parseInt(dayText);
                    
                    // Verificar se a célula pertence ao mês atual (não é dia de outro mês)
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
            // Observar mudanças no calendário para atualizar marcações quando o mês mudar
            const calendarElement = document.querySelector('.custom-datepicker .p-datepicker');
            if (!calendarElement) return;
            
            const observer = new MutationObserver(() => {
                this.marcarDatasComAgendamento();
            });
            
            observer.observe(calendarElement, {
                childList: true,
                subtree: true
            });
            
            // Guardar referência do observer para limpar quando componente for desmontado
            this._calendarObserver = observer;
        },
        
        formatarHorario(agendamento) {
            // Se o agendamento tem horário, usar ele
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
        }
    }
};
</script>

<style scoped>
.agendamentos-layout {
    min-height: 600px;
}

.calendar-wrapper {
    display: flex;
    justify-content: center;
    padding: 0;
    min-height: 600px;
}

/* Customização do DatePicker - aumentar tamanho dos números e altura */
:deep(.custom-datepicker .p-datepicker) {
    min-height: 600px;
    width: 100%;
}

:deep(.custom-datepicker .p-datepicker-calendar) {
    height: 100%;
}

:deep(.custom-datepicker .p-datepicker-table td) {
    padding: 0.5rem;
    height: 3.5rem;
    min-height: 5.5rem;
}

:deep(.custom-datepicker .p-datepicker-calendar td span) {
    width: 100%;
    height: 100%;
    min-height: 2.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.45rem;
    font-weight: 600;
}

/* Destacar datas com agendamento - usando JavaScript para adicionar classes após renderização */
:deep(.custom-datepicker .p-datepicker-calendar td) {
    position: relative;
}

:deep(.custom-datepicker .p-datepicker-weekday-cell) {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: var(--surface-card);
}

:deep(.custom-datepicker .p-datepicker-title) {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: var(--surface-card);
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

.agendamentos-card {
    min-height: 600px;
    display: flex;
    flex-direction: column;
}

.agendamentos-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    overflow-y: auto;
}

.agendamento-card {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.agendamento-card:hover {
    background: var(--surface-hover);
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.agendamento-card-content {
    width: 100%;
}

.agendamento-time {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    font-weight: 600;
    min-width: 80px;
}

.agendamento-time i {
    font-size: 1rem;
}

.agendamento-patient h6 {
    margin: 0;
    font-size: 1rem;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    color: var(--text-color-secondary);
}

.empty-state i {
    opacity: 0.5;
}

.empty-state p {
    margin: 0;
    font-size: 1rem;
}

/* Responsividade */
@media (max-width: 768px) {
    .calendar-wrapper {
        padding: 0;
        margin-bottom: 1rem;
    }
    
    .agendamento-card {
        padding: 0.75rem;
    }
}
</style>

