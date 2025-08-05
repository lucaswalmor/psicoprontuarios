<template>
    <Dialog :visible="visible" @update:visible="handleVisibilityChange" modal header="Alterar Senha" :style="{ width: '500px' }" :closable="!isLoading">
        <div class="flex flex-column gap-4">
            <!-- Senha Atual -->
            <div class="field">
                <label for="currentPassword" class="block text-900 font-medium mb-2">
                    Senha Atual
                </label>
                <Password 
                    id="currentPassword" 
                    v-model="form.currentPassword" 
                    placeholder="Digite sua senha atual" 
                    :toggleMask="true"
                    :feedback="false"
                    class="w-full"
                    :class="{ 'p-invalid': errors.currentPassword }"
                    @keyup.enter="handleSubmit"
                />
                <small v-if="errors.currentPassword" class="p-error">{{ errors.currentPassword }}</small>
            </div>

            <!-- Nova Senha -->
            <div class="field">
                <label for="newPassword" class="block text-900 font-medium mb-2">
                    Nova Senha
                </label>
                <Password 
                    id="newPassword" 
                    v-model="form.newPassword" 
                    placeholder="Digite sua nova senha" 
                    :toggleMask="true"
                    :feedback="false"
                    class="w-full"
                    :class="{ 'p-invalid': errors.newPassword }"
                    @keyup.enter="handleSubmit"
                />
                <small v-if="errors.newPassword" class="p-error">{{ errors.newPassword }}</small>
            </div>

            <!-- Confirmar Nova Senha -->
            <div class="field">
                <label for="confirmPassword" class="block text-900 font-medium mb-2">
                    Confirmar Nova Senha
                </label>
                <Password 
                    id="confirmPassword" 
                    v-model="form.confirmPassword" 
                    placeholder="Confirme sua nova senha" 
                    :toggleMask="true"
                    :feedback="false"
                    class="w-full"
                    :class="{ 'p-invalid': errors.confirmPassword }"
                    @keyup.enter="handleSubmit"
                />
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
                <Button 
                    label="Cancelar" 
                    severity="secondary" 
                    outlined 
                    @click="closeModal" 
                    :disabled="isLoading" 
                />
                <Button 
                    label="Alterar Senha" 
                    @click="handleSubmit" 
                    :loading="isLoading"
                    :disabled="!isFormValid"
                />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
// Component: DialogChangePassword
import { ref, computed, watch, inject } from 'vue';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible', 'success']);

const toast = useToast();

// Estados reativos
const isLoading = ref(false);
const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const errors = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Computed properties
const isFormValid = computed(() => {
    return form.value.currentPassword && 
           form.value.newPassword && 
           form.value.confirmPassword &&
           form.value.newPassword === form.value.confirmPassword &&
           form.value.newPassword.length >= 8;
});

// Métodos
const validateForm = () => {
    errors.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    let isValid = true;

    if (!form.value.currentPassword) {
        errors.value.currentPassword = 'Senha atual é obrigatória';
        isValid = false;
    }

    if (!form.value.newPassword) {
        errors.value.newPassword = 'Nova senha é obrigatória';
        isValid = false;
    } else if (form.value.newPassword.length < 8) {
        errors.value.newPassword = 'A nova senha deve ter pelo menos 8 caracteres';
        isValid = false;
    }

    if (!form.value.confirmPassword) {
        errors.value.confirmPassword = 'Confirmação da senha é obrigatória';
        isValid = false;
    } else if (form.value.newPassword !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'As senhas não coincidem';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }

    isLoading.value = true;

    try {
        // Usar o authService injetado globalmente
        const authService = inject('$authService');
        const response = await authService.changePassword({
            current_password: form.value.currentPassword,
            new_password: form.value.newPassword,
            new_password_confirmation: form.value.confirmPassword
        });

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Senha alterada com sucesso!',
            life: 3000
        });

        emit('success');
        closeModal();
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

        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        isLoading.value = false;
    }
};

const handleVisibilityChange = (value) => {
    emit('update:visible', value);
};

const closeModal = () => {
    // Limpar formulário
    form.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    errors.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    
    emit('update:visible', false);
};

// Limpar erros quando o modal é fechado
watch(() => props.visible, (newValue) => {
    if (!newValue) {
        errors.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    }
});
</script>

<style scoped>
.p-password {
    width: 100%;
}

:deep(.p-password-input) {
    width: 100%;
}
</style> 