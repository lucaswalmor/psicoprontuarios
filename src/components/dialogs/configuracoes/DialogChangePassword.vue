<template>
    <Dialog :visible="visible" @update:visible="handleVisibilityChange" modal header="Alterar Senha"
        :style="{ width: '500px' }" :closable="!isLoading">
        <div class="flex flex-column gap-4">
            <!-- Senha Atual -->
            <div class="field">
                <label for="currentPassword" class="block text-900 font-medium mb-2">
                    Senha Atual
                </label>
                <Password id="currentPassword" v-model="form.currentPassword" placeholder="Digite sua senha atual"
                    :toggleMask="true" :feedback="false" class="w-full" :class="{ 'p-invalid': errors.currentPassword }"
                    @keyup.enter="handleSubmit" />
                <small v-if="errors.currentPassword" class="p-error">{{ errors.currentPassword }}</small>
            </div>

            <!-- Nova Senha -->
            <div class="field">
                <label for="newPassword" class="block text-900 font-medium mb-2">
                    Nova Senha
                </label>
                <Password id="newPassword" v-model="form.newPassword" placeholder="Digite sua nova senha"
                    :toggleMask="true" :feedback="false" class="w-full" :class="{ 'p-invalid': errors.newPassword }"
                    @keyup.enter="handleSubmit" />
                <small v-if="errors.newPassword" class="p-error">{{ errors.newPassword }}</small>
            </div>

            <!-- Confirmar Nova Senha -->
            <div class="field">
                <label for="confirmPassword" class="block text-900 font-medium mb-2">
                    Confirmar Nova Senha
                </label>
                <Password id="confirmPassword" v-model="form.confirmPassword" placeholder="Confirme sua nova senha"
                    :toggleMask="true" :feedback="false" class="w-full" :class="{ 'p-invalid': errors.confirmPassword }"
                    @keyup.enter="handleSubmit" />
                <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
            </div>

            <!-- Dicas de Segurança -->
            <div class="surface-100 p-3 border-round">
                <h6 class="mb-2 text-800">Dicas para uma senha segura:</h6>
                <ul class="m-0 pl-3 text-sm text-600">
                    <li>Use pelo menos 8 caracteres</li>
                    <li>Combine letras maiúsculas e minúsculas</li>
                    <li>Inclua números e símbolos</li>
                    <li>Evite informações pessoais</li>
                </ul>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="closeModal" :disabled="isLoading" />
                <Button label="Alterar Senha" @click="handleSubmit" :loading="isLoading" :disabled="!isFormValid" />
            </div>
        </template>
    </Dialog>
</template>

<script>
// Component: DialogChangePassword
export default {
    name: 'DialogChangePassword',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:visible', 'success'],
    data() {
        return {
            isLoading: false,
            form: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            errors: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        };
    },
    computed: {
        isFormValid() {
            return this.form.currentPassword &&
                this.form.newPassword &&
                this.form.confirmPassword &&
                this.form.newPassword === this.form.confirmPassword &&
                this.form.newPassword.length >= 8;
        }
    },
    methods: {
        validateForm() {
            this.errors = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };

            let isValid = true;

            if (!this.form.currentPassword) {
                this.errors.currentPassword = 'Senha atual é obrigatória';
                isValid = false;
            }

            if (!this.form.newPassword) {
                this.errors.newPassword = 'Nova senha é obrigatória';
                isValid = false;
            } else if (this.form.newPassword.length < 8) {
                this.errors.newPassword = 'A nova senha deve ter pelo menos 8 caracteres';
                isValid = false;
            }

            if (!this.form.confirmPassword) {
                this.errors.confirmPassword = 'Confirmação da senha é obrigatória';
                isValid = false;
            } else if (this.form.newPassword !== this.form.confirmPassword) {
                this.errors.confirmPassword = 'As senhas não coincidem';
                isValid = false;
            }

            return isValid;
        },

        async handleSubmit() {
            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;

            try {
                // Debug: verificar token
                const token = localStorage.getItem('token');
                console.log('Token disponível:', !!token);
                console.log('Token:', token ? token.substring(0, 20) + '...' : 'Nenhum token');
                
                // Usar o userService global configurado no main.js
                const response = await this.$userService.changePassword({
                    current_password: this.form.currentPassword,
                    new_password: this.form.newPassword,
                    new_password_confirmation: this.form.confirmPassword
                });

                this.$emit('success');
                this.closeModal();
            } catch (error) {
                console.error('Erro ao alterar senha:', error);
                
                let errorMessage = 'Erro ao alterar senha. Tente novamente.';
                
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    if (errors.current_password) {
                        errorMessage = errors.current_password[0];
                    } else if (errors.new_password) {
                        errorMessage = errors.new_password[0];
                    } else if (errors.new_password_confirmation) {
                        errorMessage = errors.new_password_confirmation[0];
                    }
                }

                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorMessage,
                    life: 5000
                });
            } finally {
                this.isLoading = false;
            }
        },

        handleVisibilityChange(value) {
            this.$emit('update:visible', value);
        },

        closeModal() {
            // Limpar formulário
            this.form = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            this.errors = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };

            this.$emit('update:visible', false);
        }
    },
    watch: {
        visible(newValue) {
            if (!newValue) {
                this.errors = {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
            }
        }
    }
};
</script>

<style scoped>
.p-password {
    width: 100%;
}

:deep(.p-password-input) {
    width: 100%;
}
</style>