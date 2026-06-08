<template>
    <Dialog :visible="visible" @update:visible="handleVisibilityChange" modal header="Excluir minha conta"
        :style="{ width: '520px' }" :closable="!isLoading">
        <div class="flex flex-column gap-4">
            <Message severity="error" :closable="false">
                <p class="m-0 mb-2"><strong>Atenção:</strong> esta ação solicita a exclusão permanente da sua conta.</p>
                <ul class="m-0 pl-3 text-sm line-height-3">
                    <li>Seus dados pessoais serão anonimizados após 30 dias.</li>
                    <li>Prontuários permanecem anonimizados por exigência do CFP (20 anos).</li>
                    <li>Registros financeiros são retidos por obrigação fiscal, sem identificação pessoal.</li>
                    <li>Você pode cancelar a solicitação dentro dos 30 dias.</li>
                </ul>
            </Message>

            <div v-if="contaSemSenha" class="field">
                <div class="flex align-items-center justify-content-between gap-2 mb-2">
                    <label for="codigoExclusao" class="block text-900 font-medium m-0">
                        Código de confirmação
                    </label>
                    <Button label="Enviar código" size="small" outlined :loading="enviandoCodigo"
                        :disabled="isLoading" @click="enviarCodigo" />
                </div>
                <InputText id="codigoExclusao" v-model="codigoConfirmacao" placeholder="000000" maxlength="6"
                    class="w-full" :class="{ 'p-invalid': errorMessage }" />
            </div>

            <div v-else class="field">
                <label for="senhaExclusao" class="block text-900 font-medium mb-2">
                    Senha atual
                </label>
                <Password id="senhaExclusao" v-model="senhaConfirmacao" placeholder="Digite sua senha atual"
                    :toggleMask="true" :feedback="false" class="w-full" :class="{ 'p-invalid': errorMessage }"
                    @keyup.enter="confirmar" />
            </div>

            <small v-if="errorMessage" class="p-error block">{{ errorMessage }}</small>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="closeModal" :disabled="isLoading" />
                <Button label="Confirmar exclusão" severity="danger" @click="confirmar" :loading="isLoading"
                    :disabled="!podeConfirmar" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import exclusaoContaService from '@/services/exclusaoContaService';

export default {
    name: 'DialogExclusaoConta',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        contaSemSenha: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:visible', 'exclusao-solicitada'],
    data() {
        return {
            isLoading: false,
            enviandoCodigo: false,
            senhaConfirmacao: '',
            codigoConfirmacao: '',
            errorMessage: ''
        };
    },
    computed: {
        podeConfirmar() {
            if (this.contaSemSenha) {
                return this.codigoConfirmacao.trim().length === 6;
            }
            return this.senhaConfirmacao.trim().length > 0;
        }
    },
    methods: {
        async enviarCodigo() {
            this.enviandoCodigo = true;
            this.errorMessage = '';
            try {
                await exclusaoContaService.enviarCodigo();
                this.$toast.add({
                    severity: 'success',
                    summary: 'Código enviado',
                    detail: 'Verifique seu e-mail.',
                    life: 4000
                });
            } catch (error) {
                this.errorMessage = error.response?.data?.error || 'Não foi possível enviar o código.';
            } finally {
                this.enviandoCodigo = false;
            }
        },

        async confirmar() {
            if (!this.podeConfirmar) {
                return;
            }

            this.isLoading = true;
            this.errorMessage = '';

            try {
                const payload = this.contaSemSenha
                    ? { codigo_confirmacao: this.codigoConfirmacao.trim() }
                    : { current_password: this.senhaConfirmacao };

                await exclusaoContaService.solicitarExclusao(payload);
                this.$emit('exclusao-solicitada');
                this.closeModal();
            } catch (error) {
                this.errorMessage = error.response?.data?.error || 'Não foi possível solicitar a exclusão.';
            } finally {
                this.isLoading = false;
            }
        },

        handleVisibilityChange(value) {
            this.$emit('update:visible', value);
        },

        closeModal() {
            this.senhaConfirmacao = '';
            this.codigoConfirmacao = '';
            this.errorMessage = '';
            this.$emit('update:visible', false);
        }
    },
    watch: {
        visible(value) {
            if (!value) {
                this.errorMessage = '';
            }
        }
    }
};
</script>

<style scoped>
:deep(.p-password-input) {
    width: 100%;
}
</style>
