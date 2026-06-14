<template>
    <div class="cadastro-page bg-surface-0 dark:bg-surface-900 min-h-screen">

        <!-- Main Content -->
        <main class="min-h-screen flex">
            <!-- Coluna Esquerda: Promocional -->
            <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
                <!-- Padrão de fundo -->
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                    <div class="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
                    <div class="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
                    <div class="absolute bottom-40 right-10 w-20 h-20 bg-white rounded-full"></div>
                </div>
                
                <!-- Card central -->
                <div class="relative z-10 flex items-center justify-center w-full p-12">
                    <div class="bg-purple-700 rounded-2xl p-8 max-w-md text-center">
                        
                        <!-- Título -->
                        <h2 class="text-white text-2xl font-bold mb-4">
                            A plataforma mais amada pelos Psicólogos
                        </h2>
                        
                        <!-- Descrição -->
                        <p class="text-purple-100 text-lg leading-relaxed">
                            Junte-se a milhares de profissionais que já transformaram sua prática clínica com nossa plataforma completa e intuitiva.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Coluna Direita: Formulário -->
            <div class="lg:w-1/2 bg-white flex items-center justify-center">
                <div class="w-full px-6 py-6">
                    <!-- Logo/Título -->
                    <div class="d-flex flex-column align-items-center justify-content-center">
                        <div class="d-flex flex-column align-items-center justify-content-center">
                            <img src="@/assets/img/logo.webp" alt="PsicoProntuários" class="logo">
                            <h1 class="text-3xl font-bold text-purple-600 mb-2">PsicoProntuários</h1>
                        </div>
                    </div>
                    <!-- Botão Google -->
                    <template v-if="!contaCriada && etapaAtual === 1">
                        <GoogleSignInButton 
                            button-text="Cadastrar com Google"
                            @success="handleGoogleSignUp"
                            @error="handleGoogleError"
                        />

                        <!-- Divisor -->
                        <div class="flex items-center my-2">
                            <div class="flex-1 border-t border-gray-300"></div>
                            <span class="px-3 text-600 text-sm">ou</span>
                            <div class="flex-1 border-t border-gray-300"></div>
                        </div>
                    </template>

                    <!-- Indicador de Progresso -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div style="width: 30px; height: 30px;" class="rounded-full flex items-center justify-center text-sm font-semibold"
                                     :class="etapaAtual >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'">
                                    1
                                </div>
                                <span class="text-sm text-600">Login</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div style="width: 30px; height: 30px;" class="rounded-full flex items-center justify-center text-sm font-semibold"
                                     :class="etapaAtual >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'">
                                    2
                                </div>
                                <span class="text-sm text-600">Dados Pessoais</span>
                            </div>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                 :style="{ width: (etapaAtual / totalEtapas) * 100 + '%' }"></div>
                        </div>
                    </div>

                    <!-- Formulário por Etapas -->
                    <form @submit.prevent="handleSubmit">
                        
                        <!-- Etapa 2: Dados Pessoais -->
                        <div v-show="etapaAtual === 2" class="space-y-6">
                            <div class="text-center mb-6">
                                <h2 class="text-xl font-semibold text-gray-900 mb-2">Dados Pessoais</h2>
                                <p class="text-600">Informações básicas sobre você</p>
                            </div>
                            
                        <!-- Nome completo -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="nomeCompleto" 
                                            v-model="form.nomeCompleto" 
                                            class="w-100 h-12 text-lg" 
                                            :class="{ 'p-invalid': errors.nome_completo }"
                                            @input="clearError('nome_completo')"
                                        />
                                        <label for="nomeCompleto">Nome completo</label>
                                    </IftaLabel>
                                    <small v-if="errors.nome_completo" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.nome_completo) }}</small>
                                    <small v-else class="text-gray-500 text-sm mt-1 block">Ex.: Lucas Silva</small>
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
                                        @update:modelValue="clearError('telefone')"
                                    />
                                    <label for="telefone">Telefone</label>
                                    </IftaLabel>
                                    <small v-if="errors.telefone" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.telefone) }}</small>
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
                                        @update:modelValue="clearError('cpf')"
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
                                            @update:modelValue="clearError('crp')"
                                        />
                                        <label for="crp">CRP</label>
                                    </IftaLabel>
                                    <small v-if="errors.crp" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.crp) }}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Etapa 1: Dados de Login -->
                        <div v-show="etapaAtual === 1" class="space-y-6">
                            <div class="text-center mb-6">
                                <h2 class="text-xl font-semibold text-gray-900 mb-2">Dados de Login</h2>
                                <p class="text-600">Email e senha para acessar sua conta</p>
                            </div>
                            
                            <!-- Email -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="email" 
                                            v-model="form.email" 
                                            type="email" 
                                            class="w-100 h-12 text-lg" 
                                            :class="{ 'p-invalid': errors.email }" 
                                        />
                                        <label for="email">Email</label>
                                    </IftaLabel>
                                    <small v-if="errors.email" class="text-red-500 text-sm mt-1 block">{{ formatarErro(errors.email) }}</small>
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
                        </div>

                        <!-- Termos e Condições (etapa 1) -->
                        <div v-show="etapaAtual === 1" class="flex items-start space-x-3 mt-6">
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

                        <!-- Botões de Navegação -->
                        <div class="flex justify-between mt-8">
                            <!-- Botão Voltar -->
                            <Button 
                                v-if="etapaAtual > 1"
                                type="button"
                                @click="voltarEtapa"
                                label="Voltar" 
                                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold border-0 rounded-lg" 
                            />
                            <div v-else></div>

                            <!-- Botão Próximo/Finalizar -->
                            <Button 
                                v-if="etapaAtual < totalEtapas"
                                type="button"
                                @click="proximoEtapa"
                                :loading="loading && etapaAtual === 1"
                                :label="etapaAtual === 1 ? 'Criar conta e continuar' : 'Próximo'" 
                                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold border-0 rounded-lg" 
                            />
                            <Button 
                                v-else
                                type="submit" 
                                :loading="loading" 
                                label="Finalizar cadastro" 
                                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold border-0 rounded-lg" 
                            />
                        </div>

                        <!-- Mensagens de Erro -->
                        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <p class="text-red-800">{{ error }}</p>
                        </div>
                    </form>

                    <!-- Link de Login -->
                    <div class="mt-6 text-center">
                        <p class="text-sm text-600">
                            Já possui conta? 
                            <router-link to="/login" class="text-purple-600 hover:text-purple-500 font-medium">
                                Faça login aqui!
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Dialog de Sucesso -->
        <DialogCadastroSucesso 
            :visible="showSuccessDialog" 
            :countdown="countdown"
            @update:visible="showSuccessDialog = $event"
        />

        <!-- Dialog Conta Já Cadastrada -->
        <DialogContaExistente 
            :visible="showExistingUserDialog" 
            @update:visible="showExistingUserDialog = $event"
            @access-system="goToSystem"
        />

        <ChatAtendimento :webhook-url="n8nChatWebhookUrl" />
    </div>
</template>

<script>
import logo from '@/assets/img/logo.webp';
import ChatAtendimento from '@/components/ChatAtendimento.vue';
import { getN8nChatWebhookUrl } from '@/config/environment.js';
import GoogleSignInButton from '@/components/GoogleSignInButton.vue';
import DialogCadastroSucesso from '@/components/dialogs/DialogCadastroSucesso.vue';
import DialogContaExistente from '@/components/dialogs/DialogContaExistente.vue';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { registrarMarketingLog, capturarUtms } from '@/services/marketingLogService.js';
import { trackCadastroEtapa, trackCompleteRegistration } from '@/utils/metaPixel';
import { trackGaSignUp } from '@/utils/googleAnalytics';
import { validarNomeCompleto } from '@/utils/nomeCompleto';

const CADASTRO_ETAPA_NOMES = {
    1: 'login',
    2: 'dados_pessoais',
};

export default {
    name: 'Cadastro',
    components: {
        ChatAtendimento,
        GoogleSignInButton,
        DialogCadastroSucesso,
        DialogContaExistente,
        InputText,
        InputMask,
        Password,
        Checkbox,
        Button,
        Dialog,
        IconField,
        InputIcon,
    },
    data() {
        return {
            logo,
            loading: false,
            error: '',
            n8nChatWebhookUrl: getN8nChatWebhookUrl(),
            showSuccessDialog: false,
            showExistingUserDialog: false,
            countdown: 3,
            contaCriada: false,
            etapaAtual: 1,
            totalEtapas: 2,
            form: {
                nomeCompleto: '',
                telefone: '',
                cpf: '',
                crp: '',
                email: '',
                password: '',
                password_confirmation: '',
                codigo_cupom: '',
                politica_privacidade: false,
                tipo_usuario: 'psicologo'
            },
            errors: {}
        };
    },
    mounted() {
        registrarMarketingLog('cadastro_view', { utms: capturarUtms() });
        trackCadastroEtapa(1, CADASTRO_ETAPA_NOMES[1]);
        const plano = this.$route?.query?.plano;
        if (plano === 'pro' || plano === 'simples') {
            localStorage.setItem('planoPreferidoSlug', plano);
        }
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

        validateForm() {
            // Usar a validação por etapas para validar tudo
            return this.validarEtapaAtual();
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        async handleSubmit() {
            this.error = '';

            if (!this.validarEtapaAtual()) {
                return;
            }

            this.loading = true;

            try {
                const formData = {
                    nome_completo: this.form.nomeCompleto,
                    cpf: this.form.cpf,
                    crp: this.form.crp,
                    telefone: this.form.telefone,
                    politica_privacidade: Boolean(this.form.politica_privacidade),
                };

                await registrarMarketingLog('cadastro_etapa_2', this.snapshotEtapaMarketing(2));
                await registrarMarketingLog('cadastro_etapa_3_submit', {
                    email: this.form.email,
                    nome_completo: this.form.nomeCompleto,
                    telefone: this.form.telefone,
                });

                await this.$authService.completarCadastro(formData);

                trackCompleteRegistration({ method: 'email' });
                trackGaSignUp({ method: 'email' });

                const userData = await this.$authService.validarToken();
                const destino = userData.usuario
                    ? this.rotaAposCadastroOk(userData.usuario)
                    : '/dashboard';
                this.$router.push(destino);

            } catch (err) {
                if (err.response?.data?.errors) {
                    this.aplicarErrosBackend(err.response.data.errors);
                } else if (err.response?.data?.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
                }
            } finally {
                this.loading = false;
            }
        },

        rotaAposCadastroOk(usuario) {
            if (usuario && !usuario.usuario_vitalicio && this.precisaContratarPlano(usuario)) {
                return '/upgrade';
            }
            return '/dashboard';
        },

        startCountdown() {
            this.countdown = 3;
            const timer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(timer);
                    this.redirectToLogin();
                }
            }, 1000);
        },

        redirectToLogin() {
            this.$router.push('/login');
        },

        clearForm() {
            Object.keys(this.form).forEach(key => {
                if (key !== 'tipo_usuario') {
                    if (typeof this.form[key] === 'boolean') {
                        this.form[key] = false;
                    } else {
                        this.form[key] = '';
                    }
                }
            });
            this.errors = {};
        },

        // Método para preparar dados antes do envio
        prepareFormData() {
            const formData = { ...this.form };

            // Converter string vazia para null para campos opcionais
            if (formData.codigo_cupom === '') {
                formData.codigo_cupom = null;
            }

            // Garantir que politica_privacidade seja boolean
            formData.politica_privacidade = Boolean(formData.politica_privacidade);

            return formData;
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

        async handleGoogleSignUp(credential) {
            this.loading = true;
            this.error = '';

            try {
                const response = await this.$authService.entrarComGoogle(credential);

                if (response.status === 'inativo') {
                    this.$router.push('/pagamento');
                    return;
                }

                if (response.is_new_user === false) {
                    if (response.cadastroCompleto === false || response.cadastro_completo === false || response.user?.cadastro_completo === false) {
                        this.$router.push('/completar-cadastro');
                        return;
                    }
                    if (this.precisaContratarPlano(response.user)) {
                        this.$router.push('/upgrade');
                        return;
                    }
                    this.showExistingUserDialog = true;
                    return;
                }

                if (response.cadastroCompleto === false || response.cadastro_completo === false || response.user?.cadastro_completo === false) {
                    this.$router.push('/completar-cadastro');
                } else {
                    trackCompleteRegistration({ method: 'google' });
                    trackGaSignUp({ method: 'google' });
                    this.showSuccessDialog = true;
                    this.startCountdown();
                }
            } catch (err) {
                console.error('Erro no cadastro Google:', err);

                if (err.response?.data?.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = 'Erro ao cadastrar com Google. Tente novamente.';
                }
            } finally {
                this.loading = false;
            }
        },

        goToSystem() {
            // Redirecionar para o sistema
            this.$router.push('/pacientes');
        },

        handleGoogleError(error) {
            console.error('Erro no Google Sign-In:', error);
            this.error = 'Erro ao conectar com Google. Tente novamente.';
        },

        async proximoEtapa() {
            if (!this.validarEtapaAtual()) {
                return;
            }

            const step = this.etapaAtual;

            if (step === 1) {
                this.loading = true;
                this.error = '';
                try {
                    await this.$authService.cadastroInicial({
                        email: this.form.email,
                        password: this.form.password,
                        password_confirmation: this.form.password_confirmation,
                        politica_privacidade: Boolean(this.form.politica_privacidade),
                        tipo_usuario: this.form.tipo_usuario,
                    });
                    this.contaCriada = true;
                    registrarMarketingLog('cadastro_etapa_1', this.snapshotEtapaMarketing(1));
                } catch (err) {
                    if (err.response?.data?.errors) {
                        this.aplicarErrosBackend(err.response.data.errors);
                    } else if (err.response?.data?.error) {
                        this.error = err.response.data.error;
                    } else {
                        this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
                    }
                    return;
                } finally {
                    this.loading = false;
                }
            } else if (step === 2) {
                // etapa 2 usa handleSubmit (type="submit"), não proximoEtapa;
                // o log cadastro_etapa_2 é disparado dentro de handleSubmit
            }

            this.etapaAtual++;
            const nome = CADASTRO_ETAPA_NOMES[this.etapaAtual];
            if (nome) {
                trackCadastroEtapa(this.etapaAtual, nome);
            }
        },

        /** Dados do formulário por etapa para logs (sem senhas). */
        snapshotEtapaMarketing(etapa) {
            const f = this.form;
            if (etapa === 1) {
                const pwd = f.password;
                return {
                    email: f.email,
                    politica_privacidade: Boolean(f.politica_privacidade),
                    senha_definida: Boolean(pwd && String(pwd).length > 0)
                };
            }
            if (etapa === 2) {
                return {
                    nome_completo: f.nomeCompleto,
                    telefone: f.telefone,
                    cpf: f.cpf,
                    crp: f.crp
                };
            }
            return {};
        },

        voltarEtapa() {
            if (this.etapaAtual > 1) {
                const novaEtapa = this.etapaAtual - 1;
                if (this.contaCriada && novaEtapa < 2) {
                    return;
                }
                this.etapaAtual = novaEtapa;
            }
        },

        clearError(field) {
            if (this.errors[field]) {
                delete this.errors[field];
            }
        },

        validarNumeroSequencial(valor) {
            // Remove caracteres não numéricos
            const numeros = valor.replace(/\D/g, '');
            
            // Verifica se todos os dígitos são iguais ou sequenciais
            if (/^(\d)\1{4,}$/.test(numeros)) {
                return true; // Números sequenciais detectados
            }
            
            return false; // Número válido
        },

        validarEtapaAtual() {
            this.errors = {};

            if (this.etapaAtual === 1) {
                if (!this.form.email.trim()) {
                    this.errors.email = 'Email é obrigatório';
                } else if (!this.isValidEmail(this.form.email)) {
                    this.errors.email = 'Email inválido';
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
                    this.errors.politica_privacidade = 'Você deve aceitar os termos de uso';
                }
            }

            if (this.etapaAtual === 2) {
                const nomeValidacao = validarNomeCompleto(this.form.nomeCompleto);
                if (!nomeValidacao.valido) {
                    this.errors.nome_completo = nomeValidacao.mensagem;
                }
                if (!this.form.telefone.trim()) {
                    this.errors.telefone = 'Telefone é obrigatório';
                }
                if (!this.form.cpf.trim()) {
                    this.errors.cpf = 'CPF é obrigatório';
                } else if (this.validarNumeroSequencial(this.form.cpf)) {
                    this.errors.cpf = 'CPF não pode conter números sequenciais ou repetitivos';
                }
                if (!this.form.crp.trim()) {
                    this.errors.crp = 'CRP é obrigatório';
                } else if (this.validarNumeroSequencial(this.form.crp)) {
                    this.errors.crp = 'CRP não pode conter números sequenciais ou repetitivos';
                }
            }

            return Object.keys(this.errors).length === 0;
        },

    }
};
</script>

<style scoped>
.cadastro-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

img {
    width: 100px;
    height: 100px;
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

.cadastro-page {
    animation: fadeIn 0.6s ease-out;
}

/* Layout de duas colunas */
.grid {
    display: grid;
    gap: 2rem;
}

.grid-cols-1 {
    grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
    .lg\:grid-cols-2 {
        grid-template-columns: 1fr 1fr;
    }
}

/* Responsividade */
@media (max-width: 1023px) {
    .cadastro-page {
        padding: 0 1rem;
    }

    /* Ajustar container principal em mobile */
    .container.mx-auto {
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }

    /* Remover margens laterais dos inputs em mobile */
    .p-inputtext,
    .p-inputmask,
    .p-dropdown {
        width: 100% !important;
        max-width: none !important;
    }

    /* Ajustar espaçamento entre campos */
    .row {
        margin: 0;
    }

    .row>div {
        padding: 0;
        margin-bottom: 1rem;
    }

    /* Ajustar formulário em mobile */
    .mobile-form {
        padding: 1.5rem !important;
        margin: 0 0.5rem;
    }

    /* Garantir que todos os inputs ocupem 100% da largura */
    .p-component {
        box-sizing: border-box;
    }

    /* Ajustar coluna esquerda em mobile */
    .space-y-8 > * + * {
        margin-top: 1.5rem;
    }
}

@media (max-width: 480px) {

    /* Ajustes para telas muito pequenas */
    .cadastro-page {
        padding: 0 0.5rem;
    }

    .bg-surface-0.dark\\:bg-surface-800 {
        padding: 1rem !important;
    }
}


/* Solução simples para o problema do CRP */
.crp-text {
    font-family: inherit !important;
    font-weight: inherit !important;
    letter-spacing: inherit !important;
    display: inline-block !important;
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: clip !important;
}

/* Garantir que o label seja visível */
label[for="crp"] {
    display: flex !important;
    align-items: center !important;
    gap: 0.25rem !important;
}

/* Garantir que o texto dos termos seja sempre visível */
.termos-container label {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    color: inherit !important;
}

.termos-container label a {
    color: var(--primary-color) !important;
    text-decoration: underline !important;
}

/* Ajustar layout dos termos em mobile */
@media (max-width: 768px) {
    .termos-container {
        justify-content: flex-start !important;
        align-items: flex-start !important;
        gap: 0.75rem !important;
        flex-wrap: wrap !important;
    }

    .termos-container .p-checkbox {
        flex-shrink: 0 !important;
        margin-top: 0.125rem !important;
    }

    .termos-container label {
        flex: 1 !important;
        min-width: 0 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        line-height: 1.5 !important;
        font-size: 0.875rem !important;
    }
}

/* Estilos das seções do formulário */
.form-section {
    background: var(--surface-50);
    border: 1px solid var(--surface-200);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
}

.form-section:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-200);
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--primary-100);
}

.section-icon {
    background: var(--primary-50);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
}

.section-icon i {
    font-size: 1.25rem;
}

.section-title h3 {
    margin: 0;
    color: var(--surface-900);
    font-weight: 600;
}

.section-title p {
    margin: 0.25rem 0 0 0;
    color: var(--surface-600);
    font-size: 0.875rem;
}

.section-content {
    padding-left: 0.5rem;
}

/* Dark mode para as seções */
.dark .form-section {
    background: var(--surface-800);
    border-color: var(--surface-700);
}

.dark .form-section:hover {
    border-color: var(--primary-600);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .section-header {
    border-bottom-color: var(--primary-800);
}

.dark .section-icon {
    background: var(--primary-900);
}

.dark .section-title h3 {
    color: var(--surface-100);
}

.dark .section-title p {
    color: var(--surface-400);
}

/* Responsividade das seções */
@media (max-width: 1023px) {
    .form-section {
        padding: 1rem;
        margin-bottom: 1.5rem;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        gap: 0.75rem;
    }

    .section-icon {
        margin-right: 0;
        margin-bottom: 0.5rem;
    }

    .section-content {
        padding-left: 0;
    }
}

/* Ajustes específicos para o layout de duas colunas */
@media (min-width: 1024px) {
    .grid {
        align-items: stretch;
        gap: 3rem;
        min-height: 80vh;
    }
    
    .space-y-8 > * + * {
        margin-top: 2rem;
    }
    
    /* Garantir que a coluna esquerda tenha altura adequada */
    .h-100 {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

/* Estilos para a coluna esquerda */
.space-y-8 h1 {
    line-height: 1.2;
    margin-bottom: 1.5rem;
    text-align: center;
}

.space-y-8 p {
    line-height: 1.6;
    margin-bottom: 2rem;
    text-align: center;
}

.space-y-8 h3 {
    text-align: center;
}

@media (min-width: 1024px) {
    .space-y-8 h1 {
        text-align: left;
    }
    
    .space-y-8 p {
        text-align: left;
    }
    
    .space-y-8 h3 {
        text-align: left;
    }
}

/* Centralização responsiva */
.text-center.lg\:text-left {
    text-align: center !important;
}

@media (min-width: 1024px) {
    .text-center.lg\:text-left {
        text-align: left !important;
    }
}

/* Centralização vertical e horizontal */
.h-100 {
    height: 100%;
}

.flex.flex-col.justify-center.align-middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

@media (min-width: 1024px) {
    .flex.flex-col.justify-center.align-middle {
        align-items: flex-start;
    }
}

/* Lista de benefícios */
.space-y-3 > * + * {
    margin-top: 0.75rem;
}

.flex.items-start.space-x-3 {
    align-items: flex-start;
    gap: 0.75rem;
}

/* Centralização dos itens da lista */
.justify-center.lg\:justify-start {
    justify-content: center;
}

@media (min-width: 1024px) {
    .justify-center.lg\:justify-start {
        justify-content: flex-start;
    }
}

.flex.items-start.space-x-3 i {
    color: var(--primary-color);
    margin-top: 0.125rem;
}

.flex.items-start.space-x-3 span {
    line-height: 1.5;
    color: var(--surface-700);
}

.dark .flex.items-start.space-x-3 span {
    color: var(--surface-300);
}

/* Ajustar formulário na coluna direita */
.bg-surface-0.dark\:bg-surface-800 {
    border-radius: 1rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .bg-surface-0.dark\:bg-surface-800 {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

</style>