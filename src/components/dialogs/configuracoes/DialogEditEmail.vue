<template>
    <Dialog :visible="visible" @update:visible="handleVisibilityChange" modal header="Editar Email" :style="{ width: '500px' }" :closable="!isLoading">
        <div class="flex flex-column gap-4">
            <div class="field">
                <label for="email" class="block text-900 font-medium mb-2">
                    Novo Email
                </label>
                <InputText 
                    id="email" 
                    v-model="form.email" 
                    type="email"
                    placeholder="Digite seu novo email" 
                    class="w-full"
                    :class="{ 'p-invalid': errors.email }"
                    @keyup.enter="handleSubmit"
                />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <div class="surface-100 p-3 border-round">
                <h6 class="mb-2 text-800">Importante:</h6>
                <ul class="m-0 pl-3 text-sm text-600">
                    <li>O email será usado para login no sistema</li>
                    <li>Você receberá um email de confirmação</li>
                    <li>Certifique-se de que o email está correto</li>
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
                    label="Salvar" 
                    @click="handleSubmit" 
                    :loading="isLoading"
                    :disabled="!isFormValid"
                />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
// Component: DialogEditEmail
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import userService from '@/services/userService';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    currentEmail: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:visible', 'success']);

const toast = useToast();

// Estados reativos
const isLoading = ref(false);
const form = ref({
    email: ''
});

const errors = ref({
    email: ''
});

// Computed properties
const isFormValid = computed(() => {
    return form.value.email && 
           form.value.email !== props.currentEmail &&
           form.value.email.includes('@');
});

// Métodos
const validateForm = () => {
    errors.value = {
        email: ''
    };

    let isValid = true;

    if (!form.value.email) {
        errors.value.email = 'Email é obrigatório';
        isValid = false;
    } else if (!form.value.email.includes('@')) {
        errors.value.email = 'Digite um email válido';
        isValid = false;
    } else if (form.value.email === props.currentEmail) {
        errors.value.email = 'O novo email deve ser diferente do atual';
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
        const response = await userService.updateProfile({
            email: form.value.email
        });

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Email atualizado com sucesso!',
            life: 3000
        });

        emit('success');
        closeModal();
    } catch (error) {
        console.error('Erro ao atualizar email:', error);
        
        let errorMessage = 'Erro ao atualizar email. Tente novamente.';
        
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
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
        email: ''
    };
    errors.value = {
        email: ''
    };
    
    emit('update:visible', false);
};

// Limpar erros quando o modal é fechado
watch(() => props.visible, (newValue) => {
    if (!newValue) {
        errors.value = {
            email: ''
        };
    }
});
</script>

<style scoped>
.p-inputtext {
    width: 100%;
}
</style> 