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
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputMask 
                                        id="cpf" 
                                        v-model="form.cpf" 
                                        mask="999.999.999-99" 
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.cpf }" 
                                    />
                                    <label for="cpf">CPF</label>
                                </IftaLabel>
                                <small v-if="errors.cpf" class="text-red-500 text-sm mt-1 block">{{ errors.cpf[0] }}</small>
                            </div>
                        </div>

                        <!-- CRP -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputMask 
                                        id="crp" 
                                        v-model="form.crp" 
                                        mask="99/99999" 
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.crp }" 
                                    />
                                    <label for="crp">CRP</label>
                                </IftaLabel>
                                <small v-if="errors.crp" class="text-red-500 text-sm mt-1 block">{{ errors.crp[0] }}</small>
                            </div>
                        </div>

                        <!-- Telefone -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputMask 
                                        id="telefone" 
                                        v-model="form.telefone" 
                                        mask="(99) 99999-9999"
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.telefone }" 
                                    />
                                    <label for="telefone">Telefone</label>
                                </IftaLabel>
                                <small v-if="errors.telefone" class="text-red-500 text-sm mt-1 block">{{ errors.telefone[0] }}</small>
                            </div>
                        </div>

                        <!-- CEP -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputMask 
                                        id="cep" 
                                        v-model="form.cep" 
                                        mask="99999-999"
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.cep }" 
                                        @blur="buscarCep"
                                    />
                                    <label for="cep">CEP</label>
                                </IftaLabel>
                                <small v-if="errors.cep" class="text-red-500 text-sm mt-1 block">{{ errors.cep[0] }}</small>
                                <small v-if="loadingCep" class="text-blue-500 text-sm mt-1 block">
                                    <i class="pi pi-spin pi-spinner mr-1"></i>
                                    Buscando endereço...
                                </small>
                            </div>
                        </div>

                        <!-- Cidade -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputText 
                                        id="cidade" 
                                        v-model="form.cidade" 
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.cidade, '': form.cidade && !errors.cidade }" 
                                    />
                                    <label for="cidade">Cidade</label>
                                </IftaLabel>
                                <small v-if="errors.cidade" class="text-red-500 text-sm mt-1 block">{{ errors.cidade[0] }}</small>
                                <small v-if="form.cidade && !errors.cidade" class="text-green-600 text-sm mt-1 block">
                                    <i class="pi pi-check-circle mr-1"></i>
                                    Preenchido automaticamente
                                </small>
                            </div>
                        </div>

                        <!-- Estado -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <Select 
                                        id="estado" 
                                        v-model="form.estado" 
                                        :options="estados" 
                                        optionLabel="nome" 
                                        optionValue="sigla"
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.estado, '': form.estado && !errors.estado }" 
                                    />
                                    <label for="estado">Estado</label>
                                </IftaLabel>
                                <small v-if="errors.estado" class="text-red-500 text-sm mt-1 block">{{ errors.estado[0] }}</small>
                                <small v-if="form.estado && !errors.estado" class="text-green-600 text-sm mt-1 block">
                                    <i class="pi pi-check-circle mr-1"></i>
                                    Preenchido automaticamente
                                </small>
                            </div>
                        </div>

                        <!-- Rua -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputText 
                                        id="rua" 
                                        v-model="form.rua" 
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.rua, '': form.rua && !errors.rua }" 
                                    />
                                    <label for="rua">Rua</label>
                                </IftaLabel>
                                <small v-if="errors.rua" class="text-red-500 text-sm mt-1 block">{{ errors.rua[0] }}</small>
                                <small v-if="form.rua && !errors.rua" class="text-green-600 text-sm mt-1 block">
                                    <i class="pi pi-check-circle mr-1"></i>
                                    Preenchido automaticamente
                                </small>
                            </div>
                        </div>

                        <!-- Bairro -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputText 
                                        id="bairro" 
                                        v-model="form.bairro" 
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.bairro, '': form.bairro && !errors.bairro }" 
                                    />
                                    <label for="bairro">Bairro</label>
                                </IftaLabel>
                                <small v-if="errors.bairro" class="text-red-500 text-sm mt-1 block">{{ errors.bairro[0] }}</small>
                                <small v-if="form.bairro && !errors.bairro" class="text-green-600 text-sm mt-1 block">
                                    <i class="pi pi-check-circle mr-1"></i>
                                    Preenchido automaticamente
                                </small>
                            </div>
                        </div>

                        <!-- Senha -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <Password 
                                        id="password" 
                                        v-model="form.password" 
                                        class="w-100"
                                        inputClass="w-100 h-12 text-lg"
                                        :feedback="false"
                                        :toggleMask="true"
                                        :class="{ 'p-invalid': errors.password }" 
                                    />
                                    <label for="password">Senha</label>
                                </IftaLabel>
                                <small v-if="errors.password" class="text-red-500 text-sm mt-1 block">{{ errors.password[0] }}</small>
                            </div>
                        </div>

                        <!-- Confirmar Senha -->
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <Password 
                                        id="password_confirmation" 
                                        v-model="form.password_confirmation"
                                        class="w-100"
                                        inputClass="w-100 h-12 text-lg" 
                                        :feedback="false"
                                        :toggleMask="true"
                                        :class="{ 'p-invalid': errors.password_confirmation }" 
                                    />
                                    <label for="password_confirmation">Confirmar Senha</label>
                                </IftaLabel>
                                <small v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1 block">{{ errors.password_confirmation[0] }}</small>
                            </div>
                        </div>

                        <!-- Termos e Condições -->
                        <div class="flex items-start space-x-3 mt-6">
                            <Checkbox 
                                id="politica_privacidade" 
                                v-model="form.politica_privacidade"
                                :binary="true" 
                                :class="{ 'p-invalid': errors.politica_privacidade }" 
                            />
                            <label for="politica_privacidade" class="text-sm text-600 leading-relaxed">
                                Li e aceito os
                                <router-link to="/termos-uso" class="text-purple-600 hover:text-purple-500 underline" target="_blank">
                                    Termos de Uso
                                </router-link>
                                e a
                                <router-link to="/politica-privacidade" class="text-purple-600 hover:text-purple-500 underline" target="_blank">
                                    Política de Privacidade
                                </router-link>
                            </label>
                        </div>
                        <small v-if="errors.politica_privacidade" class="text-red-500 text-sm block">{{ errors.politica_privacidade[0] }}</small>

                        <!-- Botão de Envio -->
                        <Button 
                            type="submit" 
                            :loading="loading" 
                            label="Completar Cadastro" 
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
import Button from 'primevue/button';
import Select from 'primevue/select';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import IftaLabel from 'primevue/iftalabel';

export default {
    name: 'CompletarCadastro',
    components: {
        InputText,
        InputMask,
        Button,
        Select,
        Password,
        Checkbox,
        IftaLabel
    },
    data() {
        return {
            loading: false,
            loadingCep: false,
            error: '',
            form: {
                cpf: '',
                crp: '',
                telefone: '',
                cep: '',
                cidade: '',
                estado: '',
                rua: '',
                bairro: '',
                password: '',
                password_confirmation: '',
                politica_privacidade: false
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
        if (!this.$authService.estaAutenticado()) {
            this.$router.push('/login');
            return;
        }

        // Verificar se o usuário realmente precisa completar o cadastro
        try {
            const userData = await this.$authService.validarToken();
            if (userData.status === 'inativo') {
                this.$router.push('/pagamento');
                return;
            }
            // Se o usuário já tem cadastro completo, ir para upgrade (sem plano) ou dashboard
            if (userData.usuario && userData.usuario.cadastro_completo) {
                this.$router.push(this.rotaAposCadastroOk(userData.usuario));
            }
        } catch (error) {
            console.error('Erro ao validar token:', error);
            this.$router.push('/login');
        }
    },
    methods: {
        rotaAposCadastroOk(usuario) {
            if (usuario && !usuario.usuario_vitalicio && usuario.status_assinatura === 'sem_assinatura') {
                return '/upgrade';
            }
            return '/dashboard';
        },
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

            if (!this.form.cep.trim()) {
                this.errors.cep = 'CEP é obrigatório';
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

            if (!this.form.password) {
                this.errors.password = 'Senha é obrigatória';
            } else if (this.form.password.length < 6) {
                this.errors.password = 'Senha deve ter pelo menos 6 caracteres';
            }

            if (!this.form.password_confirmation) {
                this.errors.password_confirmation = 'Confirmação de senha é obrigatória';
            } else if (this.form.password !== this.form.password_confirmation) {
                this.errors.password_confirmation = 'As senhas não coincidem';
            }

            if (!this.form.politica_privacidade) {
                this.errors.politica_privacidade = 'Você deve aceitar os termos de uso e política de privacidade';
            }

            return Object.keys(this.errors).length === 0;
        },

        async buscarCep() {
            // Remover caracteres não numéricos do CEP
            const cep = this.form.cep.replace(/\D/g, '');
            
            // Verificar se o CEP tem 8 dígitos
            if (cep.length !== 8) {
                return;
            }

            this.loadingCep = true;
            this.error = '';

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    this.error = 'CEP não encontrado. Verifique o número digitado.';
                    this.$toast.add({
                        severity: 'error',
                        summary: 'CEP não encontrado',
                        detail: 'Verifique o número digitado e tente novamente.',
                        life: 3000
                    });
                    return;
                }

                // Preencher automaticamente os campos de endereço
                this.form.cidade = data.localidade || '';
                this.form.estado = data.uf || '';
                this.form.rua = data.logradouro || '';
                this.form.bairro = data.bairro || '';

                // Limpar erros dos campos preenchidos automaticamente
                if (this.errors.cidade) delete this.errors.cidade;
                if (this.errors.estado) delete this.errors.estado;
                if (this.errors.rua) delete this.errors.rua;
                if (this.errors.bairro) delete this.errors.bairro;

                // Mostrar mensagem de sucesso
                this.$toast.add({
                    severity: 'success',
                    summary: 'Endereço encontrado!',
                    detail: 'Os campos de endereço foram preenchidos automaticamente.',
                    life: 3000
                });

            } catch (err) {
                console.error('Erro ao buscar CEP:', err);
                this.error = 'Erro ao buscar endereço. Tente novamente.';
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro na busca',
                    detail: 'Não foi possível buscar o endereço. Tente novamente.',
                    life: 3000
                });
            } finally {
                this.loadingCep = false;
            }
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
                // Garantir que politica_privacidade seja boolean
                const formData = {
                    ...this.form,
                    politica_privacidade: Boolean(this.form.politica_privacidade)
                };
                const response = await this.$authService.completarCadastro(formData);
                
                // Sucesso - redirecionar para dashboard
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cadastro completado com sucesso!',
                    life: 3000
                });

                setTimeout(async () => {
                    try {
                        const userData = await this.$authService.validarToken();
                        const destino = userData.usuario
                            ? this.rotaAposCadastroOk(userData.usuario)
                            : '/dashboard';
                        this.$router.push(destino);
                    } catch {
                        this.$router.push('/upgrade');
                    }
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
