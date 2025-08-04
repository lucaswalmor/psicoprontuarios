<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5 class="text-600 mb-0">Agendamentos</h5>
                </div>

                <!-- Loading -->
                <div v-if="isLoading" class="flex justify-content-center p-4">
                    <ProgressSpinner style="width: 50px; height: 50px" />
                </div>

                <!-- Calendar -->
                <div v-else class="calendar-container">
                    <FullCalendar :options="calendarOptions" />
                </div>
            </div>
        </div>

        <!-- Dialog Novo Agendamento -->
        <DialogNovoAgendamento 
            v-model:visible="dialogNovoAgendamento"
            :dataSelecionada="dataSelecionada"
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
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptLocale from '@fullcalendar/core/locales/pt-br';

import DialogNovoAgendamento from '@/components/dialogs/agendamentos/DialogNovoAgendamento.vue';
import DialogEditarAgendamento from '@/components/dialogs/agendamentos/DialogEditarAgendamento.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';

export default {
    name: 'Agendamentos',
    components: {
        FullCalendar,
        DialogNovoAgendamento,
        DialogEditarAgendamento,
        Breadcrumb
    },
    data() {
        return {
            breadcrumbItems: [
                { label: "Agendamentos" },
            ],
            isLoading: false,
            dialogNovoAgendamento: false,
            dialogEditarAgendamento: false,
            dataSelecionada: '',
            agendamentoSelecionado: {},
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                locale: ptLocale,
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                buttonText: {
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia'
                },
                height: 'auto',
                editable: false,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                events: [],
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventContent: this.customEventContent,
                eventDidMount: this.handleEventDidMount
            }
        };
    },
    async mounted() {
        await this.carregarAgendamentos();
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
                
                this.calendarOptions.events = this.formatarEventos(agendamentos);
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
        
        formatarEventos(agendamentos) {
            return agendamentos.map(agendamento => {
                // Usa apenas os campos que existem no JSON
                const title = agendamento.title || 'Agendamento';
                const date = agendamento.date;
                const publicId = agendamento.publicId;
                
                // Cor padrão azul para todos os eventos
                const backgroundColor = '#3b82f6';
                
                return {
                    id: publicId,
                    title: title,
                    start: date,
                    end: date,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    textColor: '#ffffff',
                    extendedProps: {
                        publicId: publicId
                    }
                };
            });
        },
        

        
        handleDateSelect(selectInfo) {
            this.dataSelecionada = selectInfo.startStr;
            this.dialogNovoAgendamento = true;
        },
        
        async handleEventClick(clickInfo) {
            try {
                const response = await this.$agendamentosService.getById(clickInfo.event.extendedProps.publicId);
                
                // Verifica se os dados foram carregados corretamente
                if (response && Object.keys(response).length > 0) {
                    // Atribui os dados primeiro
                    this.agendamentoSelecionado = response;
                    
                    // Aguarda um tick para garantir que os dados foram atribuídos
                    await this.$nextTick();
                    
                    // Abre o dialog somente após os dados estarem prontos
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
        
        customEventContent(eventInfo) {
            return {
                html: `
                    <div class="fc-event-main-content">
                        <div class="fc-event-title">${eventInfo.event.title}</div>
                    </div>
                `
            };
        },
        
        handleEventDidMount(info) {
            // Adicionar tooltip ou outras funcionalidades se necessário
        }
    }
};
</script>

<style scoped>
.calendar-container {
    min-height: 600px;
}

/* Customização do FullCalendar */
:deep(.fc) {
    font-family: var(--font-family);
}

:deep(.fc-toolbar-title) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
}

/* Estilos gerais dos botões */
:deep(.fc-button) {
    font-weight: 500;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease;
}

:deep(.fc-button:focus) {
    box-shadow: 0 0 0 2px var(--primary-color), 0 0 0 4px var(--primary-color);
}

:deep(.fc-daygrid-day) {
    background-color: var(--surface-card);
    border-color: var(--surface-border);
}

:deep(.fc-daygrid-day:hover) {
    background-color: var(--surface-hover);
}

:deep(.fc-daygrid-day.fc-day-today) {
    background-color: var(--primary-50);
}

/* Cor do texto dos dias para tema dark */
:deep(.fc-daygrid-day-number) {
    color: var(--text-color) !important;
    font-weight: 500;
}

:deep(.fc-daygrid-day.fc-day-today .fc-daygrid-day-number) {
    color: var(--primary-color) !important;
    font-weight: 600;
}

/* Cabeçalhos dos dias da semana */
:deep(.fc-col-header-cell) {
    background-color: var(--surface-card);
    border-color: var(--surface-border);
}

:deep(.fc-col-header-cell-cushion) {
    color: var(--text-color) !important;
    font-weight: 600;
}

/* Header da toolbar */
:deep(.fc-toolbar) {
    background-color: var(--surface-card);
    border-color: var(--surface-border);
}

:deep(.fc-toolbar-chunk) {
    background-color: var(--surface-card);
}

/* Botões do header */
:deep(.fc-button-group) {
    background-color: var(--surface-card);
}

:deep(.fc-button-primary) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-color-text);
}

:deep(.fc-button-primary:hover) {
    background-color: var(--primary-600);
    border-color: var(--primary-600);
}

:deep(.fc-button-primary:focus) {
    box-shadow: 0 0 0 2px var(--primary-color), 0 0 0 4px var(--primary-color);
}

:deep(.fc-button-primary:active) {
    background-color: var(--primary-700);
    border-color: var(--primary-700);
}

/* Título do calendário */
:deep(.fc-toolbar-title) {
    color: var(--text-color) !important;
    font-weight: 600;
}

/* Botões de navegação */
:deep(.fc-prev-button),
:deep(.fc-next-button),
:deep(.fc-today-button) {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
    color: var(--primary-color-text) !important;
}

:deep(.fc-prev-button:hover),
:deep(.fc-next-button:hover),
:deep(.fc-today-button:hover) {
    background-color: var(--primary-600) !important;
    border-color: var(--primary-600) !important;
}

/* Botões de visualização */
:deep(.fc-dayGridMonth-button),
:deep(.fc-timeGridWeek-button),
:deep(.fc-timeGridDay-button) {
    background-color: var(--surface-card) !important;
    border-color: var(--surface-border) !important;
    color: var(--text-color) !important;
}

:deep(.fc-dayGridMonth-button:hover),
:deep(.fc-timeGridWeek-button:hover),
:deep(.fc-timeGridDay-button:hover) {
    background-color: var(--surface-hover) !important;
    border-color: var(--surface-border) !important;
}

:deep(.fc-dayGridMonth-button.fc-button-active),
:deep(.fc-timeGridWeek-button.fc-button-active),
:deep(.fc-timeGridDay-button.fc-button-active) {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
    color: var(--primary-color-text) !important;
}

/* Dias do mês anterior/próximo */
:deep(.fc-daygrid-day.fc-day-other .fc-daygrid-day-number) {
    color: var(--text-color-secondary) !important;
    opacity: 0.6;
}

:deep(.fc-event) {
    border-radius: 6px;
    border: none;
    font-weight: 500;
    padding: 2px 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

:deep(.fc-event:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

:deep(.fc-event-main-content) {
    font-size: 0.875rem;
}

:deep(.fc-event-title) {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Responsividade */
@media (max-width: 768px) {
    :deep(.fc-toolbar) {
        flex-direction: column;
        gap: 1rem;
    }
    
    :deep(.fc-toolbar-chunk) {
        display: flex;
        justify-content: center;
    }
    
    .flex.gap-2 {
        flex-wrap: wrap;
    }
}
</style> 