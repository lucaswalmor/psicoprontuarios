<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Horários de Atendimento</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Configure os dias e horários que você atende. Apenas os dias ativos aparecem na landing page.</p>
            </div>
            <Button label="Salvar horários" icon="pi pi-check" :loading="salvando" @click="salvar" />
        </div>

        <Divider />

        <div class="horarios-grid mt-3">
            <div
                v-for="dia in horarios"
                :key="dia.dia_semana"
                class="horario-row"
                :class="{ inativo: !dia.ativo }"
            >
                <!-- Toggle + nome do dia -->
                <div class="flex align-items-center gap-3" style="min-width:140px">
                    <InputSwitch v-model="dia.ativo" />
                    <span class="font-medium" :class="dia.ativo ? 'text-color' : 'text-color-secondary'">
                        {{ dia.dia_nome }}
                    </span>
                </div>

                <!-- Hora início -->
                <div class="flex align-items-center gap-2 flex-1" :class="{ 'opacity-40': !dia.ativo }">
                    <span class="text-color-secondary text-sm">das</span>
                    <InputText
                        v-model="dia.hora_inicio"
                        placeholder="08:00"
                        class="w-6rem text-center"
                        :disabled="!dia.ativo"
                        maxlength="5"
                        @blur="formatarHora(dia, 'hora_inicio')"
                    />
                    <span class="text-color-secondary text-sm">às</span>
                    <InputText
                        v-model="dia.hora_fim"
                        placeholder="18:00"
                        class="w-6rem text-center"
                        :disabled="!dia.ativo"
                        maxlength="5"
                        @blur="formatarHora(dia, 'hora_fim')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';

const DIAS_BASE = [
    { dia_semana: 1, dia_nome: 'Segunda-feira',  hora_inicio: '08:00', hora_fim: '18:00', ativo: false },
    { dia_semana: 2, dia_nome: 'Terça-feira',    hora_inicio: '08:00', hora_fim: '18:00', ativo: false },
    { dia_semana: 3, dia_nome: 'Quarta-feira',   hora_inicio: '08:00', hora_fim: '18:00', ativo: false },
    { dia_semana: 4, dia_nome: 'Quinta-feira',   hora_inicio: '08:00', hora_fim: '18:00', ativo: false },
    { dia_semana: 5, dia_nome: 'Sexta-feira',    hora_inicio: '08:00', hora_fim: '18:00', ativo: false },
    { dia_semana: 6, dia_nome: 'Sábado',         hora_inicio: '08:00', hora_fim: '13:00', ativo: false },
    { dia_semana: 0, dia_nome: 'Domingo',        hora_inicio: '08:00', hora_fim: '12:00', ativo: false },
];

export default {
    name: 'HorariosTab',
    components: { Button, Divider, InputSwitch, InputText },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            salvando: false,
            horarios: DIAS_BASE.map((d) => ({ ...d })),
        };
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (!val?.horarios) return;
                const apiPorDia = Object.fromEntries(val.horarios.map((h) => [h.dia_semana, h]));
                this.horarios = DIAS_BASE.map((d) => {
                    const api = apiPorDia[d.dia_semana];
                    return api
                        ? { ...d, hora_inicio: api.hora_inicio, hora_fim: api.hora_fim, ativo: api.ativo }
                        : { ...d };
                });
            },
        },
    },

    methods: {
        formatarHora(dia, campo) {
            const val = dia[campo].replace(/\D/g, '').padStart(4, '0');
            if (val.length >= 4) {
                dia[campo] = `${val.slice(0, 2)}:${val.slice(2, 4)}`;
            }
        },

        async salvar() {
            const payload = this.horarios.map(({ dia_semana, hora_inicio, hora_fim, ativo }) => ({
                dia_semana,
                hora_inicio,
                hora_fim,
                ativo,
            }));

            try {
                this.salvando = true;
                await meuSiteService.syncHorarios(payload);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Horários atualizados com sucesso.', life: 3000 });
                this.$emit('salvo');
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar os horários.', life: 4000 });
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>

<style scoped>
.horarios-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.horario-row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1.5px solid var(--surface-border);
    background: var(--surface-card);
    transition: border-color 0.2s, background 0.2s;
    flex-wrap: wrap;
}

.horario-row:not(.inativo) {
    border-color: var(--primary-color);
    background: var(--surface-ground);
}

@media (max-width: 600px) {
    .horario-row {
        gap: 12px;
    }
}
</style>
