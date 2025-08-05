<template>
    <Dialog :visible="visible" @update:visible="handleVisibilityChange" modal header="Editar Telefone" :style="{ width: '500px' }" :closable="!isLoading">
        <div class="flex flex-column gap-4">
            <div class="field">
                <label for="telefone" class="block text-900 font-medium mb-2">
                    Novo Telefone
                </label>
                <InputMask 
                    id="telefone" 
                    v-model="form.telefone" 
                    mask="(99) 99999-9999"
                    placeholder="(11) 99999-9999" 
                    class="w-full"
                    :class="{ 'p-invalid': errors.telefone }"
                    @keyup.enter="handleSubmit"
                />
                <small v-if="errors.telefone" class="p-error">{{ errors.telefone }}</small>
            </div>

            <div class="surface-100 p-3 border-round">
                <h6 class="mb-2 text-800">Importante:</h6>
                <ul class="m-0 pl-3 text-sm text-600">
                    <li>A máscara será aplicada automaticamente</li>
                    <li>Inclua o código da área (DDD)</li>
                    <li>Exemplo: (11) 99999-9999</li>
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
// Component: DialogEditPhone
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputMask from 'primevue/inputmask';
import userService from '@/services/userService';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    currentPhone: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:visible', 'success']);

const toast = useToast();

// Estados reativos
const isLoading = ref(false);
const form = ref({
    telefone: ''
});

const errors = ref({
    telefone: ''
});

// Computed properties
const isFormValid = computed(() => {
    return form.value.telefone && 
           form.value.telefone !== props.currentPhone &&
           form.value.telefone.replace(/\D/g, '').length >= 10;
});

// Métodos
const validateForm = () => {
    errors.value = {
        telefone: ''
    };

    let isValid = true;

    if (!form.value.telefone) {
        errors.value.telefone = 'Telefone é obrigatório';
        isValid = false;
    } else if (form.value.telefone.replace(/\D/g, '').length < 10) {
        errors.value.telefone = 'Telefone deve ter pelo menos 10 dígitos';
        isValid = false;
    } else if (form.value.telefone === props.currentPhone) {
        errors.value.telefone = 'O novo telefone deve ser diferente do atual';
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
            telefone: form.value.telefone
        });

        emit('success');
        closeModal();
    } catch (error) {
        console.error('Erro ao atualizar telefone:', error);
        
        let errorMessage = 'Erro ao atualizar telefone. Tente novamente.';
        
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
        telefone: ''
    };
    errors.value = {
        telefone: ''
    };
    
    emit('update:visible', false);
};

// Limpar erros quando o modal é fechado
watch(() => props.visible, (newValue) => {
    if (!newValue) {
        errors.value = {
            telefone: ''
        };
    }
});
</script>

<style scoped>
.p-inputtext {
    width: 100%;
}
</style> 