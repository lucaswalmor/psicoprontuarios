<template>
    <div class="leads-section py-10 lg:py-12">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                    Interessado em nossa plataforma?
                </h2>
                <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                    Deixe seus dados e entraremos em contato para demonstrar como podemos ajudar você a gerenciar seus pacientes de forma mais eficiente.
                </p>
            </div>

            <div class="max-w-md mx-auto">
                <form @submit.prevent="enviarLead" class="space-y-6">
                    <div>
                        <label for="nome" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Nome completo
                        </label>
                        <InputText
                            id="nome"
                            v-model="formData.nome"
                            class="w-full"
                            :class="{ 'p-invalid': errors.nome }"
                            placeholder="Digite seu nome completo"
                            required
                        />
                        <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
                    </div>

                    <div>
                        <label for="telefone" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Telefone
                        </label>
                        <InputText
                            id="telefone"
                            v-model="formData.telefone"
                            class="w-full"
                            :class="{ 'p-invalid': errors.telefone }"
                            placeholder="(11) 99999-9999"
                            required
                            @input="formatarTelefone"
                        />
                        <small v-if="errors.telefone" class="p-error">{{ errors.telefone }}</small>
                    </div>

                    <Button
                        type="submit"
                        :loading="loading"
                        class="w-full"
                        size="large"
                        :disabled="loading"
                    >
                        <template #icon>
                            <i class="pi pi-send"></i>
                        </template>
                        {{ loading ? 'Enviando...' : 'Enviar dados' }}
                    </Button>
                </form>

                <div v-if="mensagemSucesso" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div class="flex items-center">
                        <i class="pi pi-check-circle text-green-600 dark:text-green-400 mr-2"></i>
                        <span class="text-green-800 dark:text-green-200">{{ mensagemSucesso }}</span>
                    </div>
                </div>

                <div v-if="mensagemErro" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div class="flex items-center">
                        <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 mr-2"></i>
                        <span class="text-red-800 dark:text-red-200">{{ mensagemErro }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
import { useToast } from 'primevue/usetoast';
import leadsService from '@/services/leadsService';

const toast = useToast();
const { proxy } = getCurrentInstance();

const formData = reactive({
    nome: '',
    telefone: ''
});

const errors = reactive({
    nome: '',
    telefone: ''
});

const loading = ref(false);
const mensagemSucesso = ref('');
const mensagemErro = ref('');

const formatarTelefone = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length > 0) {
            value = `(${value}`;
        }
        if (value.length > 3) {
            value = `${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }
    }
    
    formData.telefone = value;
};

const validarFormulario = () => {
    let valido = true;
    
    // Limpar erros anteriores
    errors.nome = '';
    errors.telefone = '';
    
    if (!formData.nome.trim()) {
        errors.nome = 'Nome é obrigatório';
        valido = false;
    }
    
    if (!formData.telefone.trim()) {
        errors.telefone = 'Telefone é obrigatório';
        valido = false;
    } else {
        const telefoneLimpo = formData.telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) {
            errors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
            valido = false;
        }
    }
    
    return valido;
};

const enviarLead = async () => {
    if (!validarFormulario()) {
        return;
    }
    
    loading.value = true;
    mensagemSucesso.value = '';
    mensagemErro.value = '';
    
    try {
        const dados = {
            nome: formData.nome.trim(),
            telefone: formData.telefone
        };
        
        await leadsService.cadastrarLead(dados);
        
        // Limpar formulário
        formData.nome = '';
        formData.telefone = '';
        
        mensagemSucesso.value = 'Dados enviados com sucesso! Entraremos em contato em breve.';
        
        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Lead cadastrado com sucesso!',
            life: 3000
        });
        
    } catch (error) {
        console.error('Erro ao enviar lead:', error);
        
        let mensagem = 'Erro ao enviar dados. Tente novamente.';
        
        if (error.response?.data?.message) {
            mensagem = error.response.data.message;
        } else if (error.message) {
            mensagem = error.message;
        }
        
        mensagemErro.value = mensagem;
        
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagem,
            life: 5000
        });
        
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.leads-section {
    /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
    /* color: white; */
}

.leads-section h2,
.leads-section p {
    color: white;
}

.leads-section label {
    color: white;
}

/* Estilização dos inputs para o tema escuro */
:deep(.p-inputtext) {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
}

:deep(.p-inputtext::placeholder) {
    color: rgba(255, 255, 255, 0.7);
}

:deep(.p-inputtext:focus) {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

:deep(.p-inputtext.p-invalid) {
    border-color: #f87171;
}

:deep(.p-button:disabled) {
    opacity: 0.6;
    transform: none;
}
</style> 