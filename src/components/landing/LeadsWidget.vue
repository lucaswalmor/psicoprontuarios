<template>
    <div class="leads-section py-10 lg:py-12">
        <div class="container mx-auto px-4">
            <div class="row align-items-center">
                <!-- Formulário à esquerda -->
                <div class="col-lg-6 mb-8 lg:mb-0">
                    <div class="card shadow-lg border-0 bg-surface-0 dark:bg-surface-900">
                        <div class="card-body p-6 lg:p-8">
                            <div class="text-center mb-6">
                                <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-3">
                                    Entre em Contato
                                </h3>
                                <p class="text-surface-600 dark:text-surface-400">
                                    Envie seus dados; nossa equipe usa essas informações para retornar por e-mail ou telefone.
                                </p>
                            </div>
                            
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

                    <div>
                        <label for="email" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Email
                        </label>
                        <InputText
                            id="email"
                            v-model="formData.email"
                            class="w-full"
                            :class="{ 'p-invalid': errors.email }"
                            placeholder="seu@email.com"
                            type="email"
                            required
                        />
                        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
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

                <!-- Texto à direita -->
                <div class="col-lg-6">
                    <div class="text-content">
                        <h2 class="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-0 mb-6">
                            Interessado em nossa plataforma?
                        </h2>
                        <p class="text-lg text-surface-600 dark:text-surface-400 mb-6 leading-relaxed">
                            Quer falar com alguém antes de criar a conta? Deixe nome, telefone e e-mail — o envio é registrado no nosso fluxo de atendimento (integração automatizada) para retorno o mais rápido possível.
                        </p>
                        
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <div class="w-2 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                                    <i class="pi pi-check text-primary-600 dark:text-primary-400 text-sm"></i>
                                </div>
                                <span class="text-surface-700 dark:text-surface-300">Demonstração personalizada</span>
                            </div>
                            
                            <div class="flex items-center">
                                <div class="w-2 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                                    <i class="pi pi-check text-primary-600 dark:text-primary-400 text-sm"></i>
                                </div>
                                <span class="text-surface-700 dark:text-surface-300">Suporte completo na implementação</span>
                            </div>
                            
                            <div class="flex items-center">
                                <div class="w-2 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                                    <i class="pi pi-check text-primary-600 dark:text-primary-400 text-sm"></i>
                                </div>
                                <span class="text-surface-700 dark:text-surface-300">Período de teste gratuito</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import leadsService from '@/services/leadsService';
import { trackLead } from '@/utils/metaPixel';

export default {
    name: 'LeadsWidget',
    data() {
        return {
            formData: {
                nome: '',
                telefone: '',
                email: ''
            },
            errors: {
                nome: '',
                telefone: '',
                email: ''
            },
            loading: false,
            mensagemSucesso: '',
            mensagemErro: ''
        };
    },
    methods: {
        formatarTelefone(event) {
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
            
            this.formData.telefone = value;
        },

        validarFormulario() {
            let valido = true;
            
            // Limpar erros anteriores
            this.errors.nome = '';
            this.errors.telefone = '';
            this.errors.email = '';
            
            if (!this.formData.nome.trim()) {
                this.errors.nome = 'Nome é obrigatório';
                valido = false;
            }
            
            if (!this.formData.telefone.trim()) {
                this.errors.telefone = 'Telefone é obrigatório';
                valido = false;
            } else {
                const telefoneLimpo = this.formData.telefone.replace(/\D/g, '');
                if (telefoneLimpo.length < 10) {
                    this.errors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
                    valido = false;
                }
            }

            if (!this.formData.email.trim()) {
                this.errors.email = 'Email é obrigatório';
                valido = false;
            } else {
                // Validação básica de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.formData.email.trim())) {
                    this.errors.email = 'Email inválido';
                    valido = false;
                }
            }
            
            return valido;
        },

        async enviarLead() {
            if (!this.validarFormulario()) {
                return;
            }
            
            this.loading = true;
            this.mensagemSucesso = '';
            this.mensagemErro = '';
            
            try {
                const dados = {
                    nome: this.formData.nome.trim(),
                    telefone: this.formData.telefone,
                    email: this.formData.email.trim()
                };
                
                await leadsService.cadastrarLead(dados);

                trackLead();
                
                // Limpar formulário
                this.formData.nome = '';
                this.formData.telefone = '';
                this.formData.email = '';
                
                this.mensagemSucesso = 'Dados enviados com sucesso! Entraremos em contato em breve.';
                
                this.$toast.add({
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
                
                this.mensagemErro = mensagem;
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: mensagem,
                    life: 5000
                });
                
            } finally {
                this.loading = false;
            }
        }
    },
    setup() {
        const toast = useToast();
        return {
            toast
        };
    }
};
</script>

<style scoped>
.leads-section {
    background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
}

.card {
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.text-content {
    padding-left: 2rem;
}

@media (max-width: 992px) {
    .text-content {
        padding-left: 0;
        text-align: center;
    }
    
    .card {
        margin-bottom: 2rem;
    }
}

:deep(.p-inputtext.p-invalid) {
    border-color: #f87171;
}

:deep(.p-button:disabled) {
    opacity: 0.6;
    transform: none;
}

.space-y-4 > * + * {
    margin-top: 1rem;
}

.space-y-6 > * + * {
    margin-top: 1.5rem;
}
</style> 