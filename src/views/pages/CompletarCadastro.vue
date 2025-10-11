<template>
    <div class="completar-cadastro-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="mb-4">
                        <i class="pi pi-user-plus text-primary text-4xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                        Complete seu cadastro
                    </h1>
                    <p class="text-surface-600 dark:text-surface-400">
                        Para finalizar sua conta, precisamos de algumas informações adicionais
                    </p>
                </div>

                <!-- Formulário -->
                <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6 shadow-sm">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- CPF -->
                        <div>
                            <label for="cpf" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                CPF <span class="text-red-500">*</span>
                            </label>
                            <InputMask 
                                id="cpf" 
                                v-model="form.cpf" 
                                mask="999.999.999-99" 
                                class="w-full h-12 text-lg"
                                placeholder="Digite seu CPF" 
                                :class="{ 'p-invalid': errors.cpf }" 
                            />
                            <small v-if="errors.cpf" class="text-red-500 text-sm mt-1 block">{{ errors.cpf }}</small>
                        </div>

                        <!-- CRP -->
                        <div>
                            <label for="crp" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                CRP <span class="text-red-500">*</span>
                            </label>
                            <InputMask 
                                id="crp" 
                                v-model="form.crp" 
                                mask="99/99999" 
                                class="w-full h-12 text-lg"
                                placeholder="Digite seu CRP" 
                                :class="{ 'p-invalid': errors.crp }" 
                            />
                            <small v-if="errors.crp" class="text-red-500 text-sm mt-1 block">{{ errors.crp }}</small>
                        </div>

                        <!-- Telefone -->
                        <div>
                            <label for="telefone" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                Telefone/WhatsApp <span class="text-red-500">*</span>
                            </label>
                            <InputMask 
                                id="telefone" 
                                v-model="form.telefone" 
                                mask="(99) 99999-9999"
                                class="w-full h-12 text-lg" 
                                placeholder="+55 Digite seu telefone"
                                :class="{ 'p-invalid': errors.telefone }" 
                            />
                            <small v-if="errors.telefone" class="text-red-500 text-sm mt-1 block">{{ errors.telefone }}</small>
                        </div>

                        <!-- Cidade -->
                        <div>
                            <label for="cidade" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                Cidade <span class="text-red-500">*</span>
                            </label>
                            <InputText 
                                id="cidade" 
                                v-model="form.cidade" 
                                class="w-full h-12 text-lg"
                                placeholder="Digite sua cidade" 
                                :class="{ 'p-invalid': errors.cidade }" 
                            />
                            <small v-if="errors.cidade" class="text-red-500 text-sm mt-1 block">{{ errors.cidade }}</small>
                        </div>

                        <!-- Estado -->
                        <div>
                            <label for="estado" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                Estado <span class="text-red-500">*</span>
                            </label>
                            <Select 
                                id="estado" 
                                v-model="form.estado" 
                                :options="estados" 
                                optionLabel="nome" 
                                optionValue="sigla"
                                class="w-full h-12 text-lg"
                                placeholder="Selecione seu estado"
                                :class="{ 'p-invalid': errors.estado }" 
                            />
                            <small v-if="errors.estado" class="text-red-500 text-sm mt-1 block">{{ errors.estado }}</small>
                        </div>

                        <!-- Rua -->
                        <div>
                            <label for="rua" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                Rua <span class="text-red-500">*</span>
                            </label>
                            <InputText 
                                id="rua" 
                                v-model="form.rua" 
                                class="w-full h-12 text-lg"
                                placeholder="Digite sua rua" 
                                :class="{ 'p-invalid': errors.rua }" 
                            />
                            <small v-if="errors.rua" class="text-red-500 text-sm mt-1 block">{{ errors.rua }}</small>
                        </div>

                        <!-- Bairro -->
                        <div>
                            <label for="bairro" class="block text-surface-900 dark:text-surface-100 font-medium mb-2">
                                Bairro <span class="text-red-500">*</span>
                            </label>
                            <InputText 
                                id="bairro" 
                                v-model="form.bairro" 
                                class="w-full h-12 text-lg"
                                placeholder="Digite seu bairro" 
                                :class="{ 'p-invalid': errors.bairro }" 
                            />
                            <small v-if="errors.bairro" class="text-red-500 text-sm mt-1 block">{{ errors.bairro }}</small>
                        </div>

                        <!-- Botão de Envio -->
                        <Button 
                            type="submit" 
                            :loading="loading" 
                            label="COMPLETAR CADASTRO" 
                            class="w-full h-12 bg-primary hover:bg-primary-600 text-white font-semibold text-lg border-0 rounded-lg mt-6" 
                        />

                        <!-- Mensagens de Erro -->
                        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <p class="text-red-800">{{ error }}</p>
                        </div>
                    </form>
                </div>

                <!-- Informações adicionais -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-surface-500 dark:text-surface-400">
                        <i class="pi pi-shield mr-1"></i>
                        Suas informações estão protegidas e serão usadas apenas para identificação profissional
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Select from 'primevue/select';
import Button from 'primevue/button';

export default {
    name: 'CompletarCadastro',
    components: {
        InputText,
        InputMask,
        Select,
        Button
    },
    data() {
        return {
            loading: false,
            error: '',
            form: {
                cpf: '',
                crp: '',
                telefone: '',
                cidade: '',
                estado: '',
                rua: '',
                bairro: ''
            },
            errors: {},
            estados: [
                { nome: 'Acre', sigla: 'AC' },
                { nome: 'Alagoas', sigla: 'AL' },
                { nome: 'Amapá', sigla: 'AP' },
                { nome: 'Amazonas', sigla: 'AM' },
                { nome: 'Bahia', sigla: 'BA' },
                { nome: 'Ceará', sigla: 'CE' },
                { nome: 'Distrito Federal', sigla: 'DF' },
                { nome: 'Espírito Santo', sigla: 'ES' },
                { nome: 'Goiás', sigla: 'GO' },
                { nome: 'Maranhão', sigla: 'MA' },
                { nome: 'Mato Grosso', sigla: 'MT' },
                { nome: 'Mato Grosso do Sul', sigla: 'MS' },
                { nome: 'Minas Gerais', sigla: 'MG' },
                { nome: 'Pará', sigla: 'PA' },
                { nome: 'Paraíba', sigla: 'PB' },
                { nome: 'Paraná', sigla: 'PR' },
                { nome: 'Pernambuco', sigla: 'PE' },
                { nome: 'Piauí', sigla: 'PI' },
                { nome: 'Rio de Janeiro', sigla: 'RJ' },
                { nome: 'Rio Grande do Norte', sigla: 'RN' },
                { nome: 'Rio Grande do Sul', sigla: 'RS' },
                { nome: 'Rondônia', sigla: 'RO' },
                { nome: 'Roraima', sigla: 'RR' },
                { nome: 'Santa Catarina', sigla: 'SC' },
                { nome: 'São Paulo', sigla: 'SP' },
                { nome: 'Sergipe', sigla: 'SE' },
                { nome: 'Tocantins', sigla: 'TO' }
            ]
        };
    },
    async mounted() {
        // Verificar se o usuário está autenticado
        if (!this.$authService.isAuthenticated()) {
            this.$router.push('/login');
            return;
        }

        // Verificar se o usuário realmente precisa completar o cadastro
        try {
            const userData = await this.$authService.validateToken();
            // Se o usuário já tem cadastro completo, redirecionar
            if (userData.usuario && userData.usuario.cadastro_completo) {
                this.$router.push('/dashboard');
            }
        } catch (error) {
            console.error('Erro ao validar token:', error);
            this.$router.push('/login');
        }
    },
    methods: {
        validateForm() {
            this.errors = {};

            if (!this.form.cpf.trim()) {
                this.errors.cpf = 'CPF é obrigatório';
            }

            if (!this.form.crp.trim()) {
                this.errors.crp = 'CRP é obrigatório';
            }

            if (!this.form.telefone.trim()) {
                this.errors.telefone = 'Telefone é obrigatório';
            }

            if (!this.form.cidade.trim()) {
                this.errors.cidade = 'Cidade é obrigatória';
            }

            if (!this.form.estado) {
                this.errors.estado = 'Estado é obrigatório';
            }

            if (!this.form.rua.trim()) {
                this.errors.rua = 'Rua é obrigatória';
            }

            if (!this.form.bairro.trim()) {
                this.errors.bairro = 'Bairro é obrigatório';
            }

            return Object.keys(this.errors).length === 0;
        },

        async handleSubmit() {
            // Reset de mensagens
            this.error = '';

            // Validação do formulário
            if (!this.validateForm()) {
                return;
            }

            this.loading = true;

            try {
                const response = await this.$authService.completarCadastro(this.form);
                
                // Sucesso - redirecionar para dashboard
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cadastro completado com sucesso!',
                    life: 3000
                });

                // Redirecionar para dashboard após um breve delay
                setTimeout(() => {
                    this.$router.push('/dashboard');
                }, 1500);

            } catch (err) {
                if (err.response?.data?.errors) {
                    // Erros de validação do backend
                    this.errors = err.response.data.errors;
                } else if (err.response?.data?.error) {
                    // Erro geral do backend
                    this.error = err.response.data.error;
                } else {
                    // Erro de conexão
                    this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
                }
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.completar-cadastro-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Animações */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.completar-cadastro-page {
    animation: fadeIn 0.6s ease-out;
}

/* Responsividade */
@media (max-width: 768px) {
    .completar-cadastro-page .container {
        padding: 1rem;
    }
    
    .completar-cadastro-page .max-w-2xl {
        max-width: 100%;
    }
}
</style>
