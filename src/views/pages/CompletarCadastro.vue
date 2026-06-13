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
                        <!-- Nome completo -->
                        <div v-if="mostrarCampoNomeCompleto" class="row mb-3">
                            <div class="col-md-12">
                                <IftaLabel>
                                    <InputText 
                                        id="nomeCompleto" 
                                        v-model="form.nomeCompleto" 
                                        class="w-100 h-12 text-lg" 
                                        :class="{ 'p-invalid': errors.nome_completo }" 
                                    />
                                    <label for="nomeCompleto">Nome completo</label>
                                </IftaLabel>
                                <small v-if="errors.nome_completo" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.nome_completo) }}</small>
                                <small v-else class="text-gray-500 text-sm mt-1 block">Ex.: Lucas Silva</small>
                            </div>
                        </div>

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
                                <small v-if="errors.cpf" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.cpf) }}</small>
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
                                <small v-if="errors.crp" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.crp) }}</small>
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
                                <small v-if="errors.telefone" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.telefone) }}</small>
                            </div>
                        </div>

                        <!-- Senha (apenas usuários Google) -->
                        <template v-if="precisaSenha">
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
                                <small v-if="errors.password" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.password) }}</small>
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
                                <small v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.password_confirmation) }}</small>
                            </div>
                        </div>
                        </template>

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
                        <small v-if="errors.politica_privacidade" class="text-red-500 text-sm block">{{ formatarErro(errors.politica_privacidade) }}</small>

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
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import IftaLabel from 'primevue/iftalabel';
import { trackCompleteRegistration } from '@/utils/metaPixel';
import { validarNomeCompleto, montarNomeCompleto } from '@/utils/nomeCompleto';

export default {
    name: 'CompletarCadastro',
    components: {
        InputText,
        InputMask,
        Button,
        Password,
        Checkbox,
        IftaLabel
    },
    data() {
        return {
            loading: false,
            error: '',
            precisaSenha: true,
            form: {
                nomeCompleto: '',
                cpf: '',
                crp: '',
                telefone: '',
                password: '',
                password_confirmation: '',
                politica_privacidade: false
            },
            errors: {},
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
                return;
            }
            if (userData.usuario) {
                const u = userData.usuario;
                this.precisaSenha = !!u.precisa_senha;
                this.form.nomeCompleto = montarNomeCompleto(u.nome, u.sobrenome);
                if (u.telefone) this.form.telefone = u.telefone;
            }
        } catch (error) {
            console.error('Erro ao validar token:', error);
            this.$router.push('/login');
        }
    },
    computed: {
        mostrarCampoNomeCompleto() {
            if (!this.form.nomeCompleto?.trim()) {
                return true;
            }
            return !validarNomeCompleto(this.form.nomeCompleto).valido;
        },
    },
    methods: {
        formatarErro(erro) {
            return Array.isArray(erro) ? erro[0] : erro;
        },

        aplicarErrosBackend(erros) {
            if (!erros || typeof erros !== 'object') {
                this.errors = {};
                return;
            }
            const normalizados = {};
            Object.keys(erros).forEach((campo) => {
                normalizados[campo] = this.formatarErro(erros[campo]);
            });
            this.errors = normalizados;
        },

        rotaAposCadastroOk(usuario) {
            if (usuario && !usuario.usuario_vitalicio && this.precisaContratarPlano(usuario)) {
                return '/upgrade';
            }
            return '/dashboard';
        },

        precisaContratarPlano(usuario) {
            if (!usuario || usuario.usuario_vitalicio) {
                return false;
            }
            if (usuario.preview_ativo === true) {
                return false;
            }
            if (usuario.precisa_ativar_plano === true) {
                return true;
            }
            return usuario.status_assinatura === 'sem_assinatura';
        },
        validateForm() {
            this.errors = {};

            if (this.mostrarCampoNomeCompleto || this.form.nomeCompleto?.trim()) {
                const nomeValidacao = validarNomeCompleto(this.form.nomeCompleto);
                if (!nomeValidacao.valido) {
                    this.errors.nome_completo = nomeValidacao.mensagem;
                }
            }

            if (!this.form.cpf.trim()) {
                this.errors.cpf = 'CPF é obrigatório';
            }

            if (!this.form.crp.trim()) {
                this.errors.crp = 'CRP é obrigatório';
            }

            if (!this.form.telefone.trim()) {
                this.errors.telefone = 'Telefone é obrigatório';
            }

            if (this.precisaSenha) {
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
            }

            if (!this.form.politica_privacidade) {
                this.errors.politica_privacidade = 'Você deve aceitar os termos de uso e política de privacidade';
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
                // Garantir que politica_privacidade seja boolean
                const formData = {
                    ...this.form,
                    nome_completo: this.form.nomeCompleto,
                    politica_privacidade: Boolean(this.form.politica_privacidade)
                };
                delete formData.nomeCompleto;
                if (!this.precisaSenha) {
                    delete formData.password;
                    delete formData.password_confirmation;
                }
                await this.$authService.completarCadastro(formData);

                trackCompleteRegistration({ method: this.precisaSenha ? 'google' : 'email' });

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
                    this.aplicarErrosBackend(err.response.data.errors);
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
