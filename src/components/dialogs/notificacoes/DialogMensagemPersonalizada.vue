<template>
    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        :header="isEdicao ? 'Editar Mensagem Personalizada' : 'Nova Mensagem Personalizada'"
        :style="{ width: '680px' }"
    >
        <div class="p-2">
            <Message severity="info" class="mb-3" :closable="false">
                Esta mensagem será enviada para <strong>todos os seus pacientes com telefone</strong> na data escolhida.
            </Message>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Enviar em</label>
                <DatePicker
                    v-model="form.enviar_em"
                    class="w-full"
                    :disabled="saving || !!mensagemEnviada"
                    :manualInput="false"
                    dateFormat="dd/mm/yy"
                    showIcon
                />
                <small v-if="mensagemEnviada" class="text-600">Esta mensagem já foi enviada e não pode ser editada.</small>
            </div>

            <div class="field mb-3">
                <label class="block text-900 font-medium mb-2">Mensagem</label>
                <Textarea
                    v-model="form.mensagem"
                    rows="6"
                    maxlength="500"
                    autoResize
                    class="w-full"
                    :disabled="saving || !!mensagemEnviada"
                />
                <small class="text-600">{{ (form.mensagem || '').length }}/500</small>
            </div>

            <div class="field flex align-items-center gap-2">
                <InputSwitch v-model="form.ativo" inputId="ativo_personalizada" :disabled="saving || !!mensagemEnviada" />
                <label for="ativo_personalizada" class="m-0">Ativo</label>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button
                    label="Cancelar"
                    severity="secondary"
                    outlined
                    @click="$emit('update:visible', false)"
                    :disabled="saving"
                />
                <Button
                    label="Salvar"
                    icon="pi pi-save"
                    @click="salvar"
                    :loading="saving"
                    :disabled="!!mensagemEnviada"
                />
            </div>
        </template>
    </Dialog>
</template>

<script>
import mensagemPersonalizadaService from '@/services/mensagemPersonalizadaService';

export default {
    name: 'DialogMensagemPersonalizada',
    components: {
        DatePicker: () => import('primevue/datepicker'),
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        mensagem: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:visible', 'salvo'],
    data() {
        return {
            saving: false,
            form: {
                enviar_em: null,
                mensagem: '',
                ativo: true,
            },
        };
    },
    computed: {
        isEdicao() {
            return !!this.mensagem;
        },
        mensagemEnviada() {
            return !!this.mensagem?.enviado_em;
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(val) {
                if (val) this.preencherFormulario();
            },
        },
        mensagem: {
            immediate: true,
            handler() {
                if (this.visible) this.preencherFormulario();
            },
        },
    },
    methods: {
        toDateOnly(value) {
            if (!value) return null;
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return null;
            d.setHours(0, 0, 0, 0);
            return d;
        },
        formatarDataISO(dateObj) {
            if (!dateObj) return null;
            const d = new Date(dateObj);
            if (Number.isNaN(d.getTime())) return null;
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        },
        preencherFormulario() {
            if (this.isEdicao) {
                this.form = {
                    enviar_em: this.toDateOnly(this.mensagem.enviar_em),
                    mensagem: this.mensagem.mensagem || '',
                    ativo: !!this.mensagem.ativo,
                };
                return;
            }
            this.form = {
                enviar_em: null,
                mensagem: '',
                ativo: true,
            };
        },
        validarFormulario() {
            if (!this.form.enviar_em) {
                this.showToast('warn', 'Atenção', 'Informe a data de envio.');
                return false;
            }
            if (!this.form.mensagem || !this.form.mensagem.trim()) {
                this.showToast('warn', 'Atenção', 'A mensagem é obrigatória.');
                return false;
            }
            return true;
        },
        async salvar() {
            if (this.mensagemEnviada) return;
            if (!this.validarFormulario()) return;

            this.saving = true;
            try {
                const enviarEm = this.formatarDataISO(this.form.enviar_em);
                if (!enviarEm) {
                    this.showToast('warn', 'Atenção', 'Informe uma data de envio válida.');
                    return;
                }
                const payload = {
                    enviar_em: enviarEm,
                    mensagem: this.form.mensagem,
                    ativo: this.form.ativo,
                };
                if (this.isEdicao) {
                    await mensagemPersonalizadaService.update(this.mensagem.id, payload);
                } else {
                    await mensagemPersonalizadaService.create(payload);
                }
                this.showToast('success', 'Sucesso', `Mensagem personalizada ${this.isEdicao ? 'atualizada' : 'criada'} com sucesso.`);
                this.$emit('salvo');
                this.$emit('update:visible', false);
            } catch (error) {
                const detail = error?.response?.data?.message || 'Erro ao salvar mensagem personalizada.';
                this.showToast('error', 'Erro', detail);
            } finally {
                this.saving = false;
            }
        },
        showToast(severity, summary, detail) {
            this.$toast.add({ severity, summary, detail, life: 3000 });
        },
    },
};
</script>

