<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-3 d-flex flex-column align-items-center">
                        <img :src="logo" alt="PsicoProntuários" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3">
                            {{ welcomeMessage }}
                        </div>
                        <span class="text-muted-color font-medium">{{ subtitleMessage }}</span>
                    </div>

                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email" class="w-full md:w-[30rem] mb-3"
                            v-model="email" @keyup.enter="login" />

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="mb-4" fluid :feedback="false" @keyup.enter="login"></Password>

                        <!-- Mensagem de erro -->
                        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {{ errorMessage }}
                        </div>

                        <div class="flex justify-end mb-4">
                            <span class="font-medium no-underline cursor-pointer text-primary hover:text-primary-600 transition-colors"
                                @click="goToChangePassword">
                                Esqueci minha senha
                            </span>
                        </div>
                        <Button label="Entrar" class="w-full" @click="login" :disabled="isLoading">
                            <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="8" fill="transparent"
                                animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="isLoading" />
                        </Button>

                        <!-- Divisor -->
                        <div class="flex items-center my-4">
                            <div class="flex-1 border-t border-surface-300"></div>
                            <span class="px-3 text-surface-600 text-sm">ou</span>
                            <div class="flex-1 border-t border-surface-300"></div>
                        </div>

                        <!-- Botão Google -->
                        <GoogleSignInButton 
                            button-text="Continuar com Google"
                            @success="handleGoogleLogin"
                            @error="handleGoogleError"
                        />

                        <!-- Link para cadastro -->
                        <div class="flex justify-center items-center mt-6">
                            <span class="text-surface-600 dark:text-surface-400 mr-2">
                                Não tem uma conta?
                            </span>
                            <span 
                                class="font-medium no-underline cursor-pointer text-primary hover:text-primary-600 transition-colors"
                                @click="goToRegister">
                                Cadastre-se
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import logo from '@/assets/img/logo.webp';
import GoogleSignInButton from '@/components/GoogleSignInButton.vue';

export default {
    name: 'Login',
    components: {
        GoogleSignInButton
    },
    data() {
        return {
            isLoading: false,
            email: '',
            password: '',
            telefone: '',
            checked: false,
            userName: '',
            errorMessage: '',
            logo: logo
        }
    },
    computed: {
        welcomeMessage() {
            if (this.userName) {
                return `Bem-vindo(a), ${this.userName}!`;
            }
            return 'Bem-vindo(a) ao PsicoProntuários!';
        },
        subtitleMessage() {
            if (this.userName) {
                return 'Faça login para continuar';
            }
            return 'Faça login para acessar sua conta';
        }
    },
    mounted() {
        // Carregar nome do usuário se existir
        this.userName = localStorage.getItem('userName') || '';
        
    },
    methods: {

        async login() {
            this.isLoading = true;
            this.errorMessage = ''; // Limpar mensagens de erro anteriores
            
            try {
                const response = await this.$authService.entrar({ 
                    email: this.email, 
                    password: this.password, 
                    telefone: this.telefone 
                });
                
                if (response.status === 'inativo') {
                    if (response.user && response.user.nome) {
                        localStorage.setItem('userName', response.user.nome);
                        this.userName = response.user.nome;
                    }
                    this.$router.push('/pagamento');
                    return;
                }
                // Salvar nome do usuário no localStorage
                if (response.user && response.user.nome) {
                    localStorage.setItem('userName', response.user.nome);
                    this.userName = response.user.nome;
                }
                // Se cadastro não está completo, redirecionar para completar cadastro
                if (response.cadastroCompleto === false || response.cadastro_completo === false || response.user?.cadastro_completo === false) {
                    this.$router.push('/completar-cadastro');
                    return;
                }

                // Ainda sem assinatura: fluxo de plano + cartão + trial (não é o mesmo que /pagamento, que é bloqueio por inadimplência/pausa)
                if (this.precisaContratarPlano(response.user)) {
                    this.$router.push('/upgrade');
                    return;
                }
                
                // Buscar informações do plano e redirecionar
                await this.redirectBasedOnPlan();
                
            } catch (err) {
                console.log(err);
                
                // Exibir mensagem de erro apropriada
                if (err.response) {
                    // Erro da API
                    if (err.response.status === 401) {
                        this.errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
                    } else if (err.response.status === 422) {
                        // Erro de validação
                        const errors = err.response.data.errors;
                        if (errors && errors.email) {
                            this.errorMessage = errors.email[0];
                        } else if (errors && errors.password) {
                            this.errorMessage = errors.password[0];
                        } else {
                            this.errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
                        }
                    } else if (err.response.status === 429) {
                        this.errorMessage = 'Muitas tentativas de login. Tente novamente em alguns minutos.';
                    } else {
                        this.errorMessage = err.response.data.error || 'Erro ao fazer login. Tente novamente.';
                    }
                } else if (err.request) {
                    // Erro de rede
                    this.errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
                } else {
                    // Outros erros
                    this.errorMessage = 'Erro inesperado. Tente novamente.';
                }
            } finally {
                this.isLoading = false;
            }
        },

        precisaContratarPlano(usuario) {
            if (!usuario || usuario.usuario_vitalicio) {
                return false;
            }
            return usuario.status_assinatura === 'sem_assinatura';
        },

        redirectBasedOnPlan() {
            this.$router.push('/dashboard');
        },

        goToChangePassword() {
            this.$router.push('/change-password');
        },

        goToRegister() {
            this.$router.push('/cadastro');
        },

        async handleGoogleLogin(credential) {
            this.isLoading = true;
            this.errorMessage = '';
            
            try {
                const response = await this.$authService.entrarComGoogle(credential);

                if (response.status === 'inativo') {
                    if (response.user && response.user.nome) {
                        localStorage.setItem('userName', response.user.nome);
                        this.userName = response.user.nome;
                    }
                    this.$router.push('/pagamento');
                    return;
                }

                if (response.user && response.user.nome) {
                    localStorage.setItem('userName', response.user.nome);
                    this.userName = response.user.nome;
                }

                if (response.cadastroCompleto === false || response.cadastro_completo === false || response.user?.cadastro_completo === false) {
                    this.$router.push('/completar-cadastro');
                    return;
                }

                if (this.precisaContratarPlano(response.user)) {
                    this.$router.push('/upgrade');
                    return;
                }

                await this.redirectBasedOnPlan();
                
            } catch (err) {
                console.log(err);

                if (err.response) {
                    if (err.response.status === 400) {
                        this.errorMessage = err.response.data.error || 'Não foi possível entrar com Google. Tente novamente.';
                    } else if (err.response.status === 401) {
                        this.errorMessage = 'Erro na autenticação com Google. Tente novamente.';
                    } else if (err.response.status === 422) {
                        this.errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
                    } else {
                        this.errorMessage = err.response.data.error || 'Erro ao fazer login com Google. Tente novamente.';
                    }
                } else if (err.request) {
                    this.errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
                } else {
                    this.errorMessage = 'Erro inesperado. Tente novamente.';
                }
            } finally {
                this.isLoading = false;
            }
        },

        handleGoogleError(error) {
            console.error('Erro no Google Sign-In:', error);
            this.errorMessage = 'Erro ao conectar com Google. Tente novamente.';
        }
    }
}
</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

img {
    width: 100px;
    height: 100px;
    text-align: center;
}
</style>
