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
                            <img src="@/assets/img/no-bg.webp" alt="PsicoProntuários" class="logo">
                            <h1 class="text-3xl font-bold text-purple-600 mb-2">PsicoProntuários</h1>
                        </div>
                    </div>
                    <!-- Botão Google -->
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

                    <!-- Indicador de Progresso -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div style="width: 30px; height: 30px;" class="rounded-full flex items-center justify-center text-sm font-semibold"
                                     :class="etapaAtual >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'">
                                    1
                                </div>
                                <span class="text-sm text-600">Dados Pessoais</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div style="width: 30px; height: 30px;" class="rounded-full flex items-center justify-center text-sm font-semibold"
                                     :class="etapaAtual >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'">
                                    2
                                </div>
                                <span class="text-sm text-600">Endereço</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div style="width: 30px; height: 30px;" class="rounded-full flex items-center justify-center text-sm font-semibold"
                                     :class="etapaAtual >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'">
                                    3
                                </div>
                                <span class="text-sm text-600">Login</span>
                            </div>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                 :style="{ width: (etapaAtual / totalEtapas) * 100 + '%' }"></div>
                        </div>
                    </div>

                    <!-- Formulário por Etapas -->
                    <form @submit.prevent="handleSubmit">
                        
                        <!-- Etapa 1: Dados Pessoais -->
                        <div v-show="etapaAtual === 1" class="space-y-6">
                            <div class="text-center mb-6">
                                <h2 class="text-xl font-semibold text-gray-900 mb-2">Dados Pessoais</h2>
                                <p class="text-600">Informações básicas sobre você</p>
                            </div>
                            
                            <!-- Nome -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="nome" 
                                            v-model="form.nome" 
                                            class="w-100 h-12 text-lg" 
                                            :class="{ 'p-invalid': errors.nome }"
                                            @input="clearError('nome')"
                                        />
                                        <label for="nome">Nome</label>
                                    </IftaLabel>
                                    <small v-if="errors.nome" class="text-red-500 text-sm mt-1 block">{{ errors.nome }}</small>
                                </div>
                            </div>

                            <!-- Sobrenome -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="sobrenome" 
                                            v-model="form.sobrenome" 
                                            class="w-100 h-12 text-lg" 
                                            :class="{ 'p-invalid': errors.sobrenome }"
                                            @input="clearError('sobrenome')"
                                        />
                                        <label for="sobrenome">Sobrenome</label>
                                    </IftaLabel>
                                    <small v-if="errors.sobrenome" class="text-red-500 text-sm mt-1 block">{{ errors.sobrenome }}</small>
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
                                    <small v-if="errors.telefone" class="text-red-500 text-sm mt-1 block">{{ errors.telefone }}</small>
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
                                    <small v-if="errors.cpf" class="text-red-500 text-sm mt-1 block">{{ errors.cpf }}</small>
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
                                    <small v-if="errors.crp" class="text-red-500 text-sm mt-1 block">{{ errors.crp }}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Etapa 2: Endereço -->
                        <div v-show="etapaAtual === 2" class="space-y-6">
                            <div class="text-center mb-6">
                                <h2 class="text-xl font-semibold text-gray-900 mb-2">Endereço</h2>
                                <p class="text-600">Localização do seu consultório</p>
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
                                            @update:modelValue="clearError('cep')"
                                            :loading="loadingCep"
                                        />
                                        <label for="cep">CEP</label>
                                    </IftaLabel>
                                    <small v-if="errors.cep" class="text-red-500 text-sm mt-1 block">{{ errors.cep }}</small>
                                    <small v-if="loadingCep" class="text-blue-500 text-sm mt-1 block">
                                        <i class="pi pi-spin pi-spinner mr-1"></i>
                                        Buscando endereço...
                                    </small>
                                </div>
                            </div>

                            <!-- Estado -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="estado" 
                                            v-model="form.estado" 
                                            class="w-100 h-12 text-lg"
                                            :class="{ 'p-invalid': errors.estado, 'bg-green-50': form.estado && !errors.estado }"
                                            @input="clearError('estado')"
                                        />
                                        <label for="estado">Estado</label>
                                    </IftaLabel>
                                    <small v-if="errors.estado" class="text-red-500 text-sm mt-1 block">{{ errors.estado }}</small>
                                    <small v-if="form.estado && !errors.estado" class="text-green-600 text-sm mt-1 block">
                                        <i class="pi pi-check-circle mr-1"></i>
                                        Preenchido automaticamente
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
                                            :class="{ 'p-invalid': errors.cidade, 'bg-green-50': form.cidade && !errors.cidade }"
                                            @input="clearError('cidade')"
                                        />
                                        <label for="cidade">Cidade</label>
                                    </IftaLabel>
                                    <small v-if="errors.cidade" class="text-red-500 text-sm mt-1 block">{{ errors.cidade }}</small>
                                    <small v-if="form.cidade && !errors.cidade" class="text-green-600 text-sm mt-1 block">
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
                                            :class="{ 'p-invalid': errors.bairro, 'bg-green-50': form.bairro && !errors.bairro }"
                                            @input="clearError('bairro')"
                                        />
                                        <label for="bairro">Bairro</label>
                                    </IftaLabel>
                                    <small v-if="errors.bairro" class="text-red-500 text-sm mt-1 block">{{ errors.bairro }}</small>
                                    <small v-if="form.bairro && !errors.bairro" class="text-green-600 text-sm mt-1 block">
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
                                            :class="{ 'p-invalid': errors.rua, 'bg-green-50': form.rua && !errors.rua }"
                                            @input="clearError('rua')"
                                        />
                                        <label for="rua">Rua</label>
                                    </IftaLabel>
                                    <small v-if="errors.rua" class="text-red-500 text-sm mt-1 block">{{ errors.rua }}</small>
                                    <small v-if="form.rua && !errors.rua" class="text-green-600 text-sm mt-1 block">
                                        <i class="pi pi-check-circle mr-1"></i>
                                        Preenchido automaticamente
                                    </small>
                                </div>
                            </div>

                            <!-- Número -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="numero" 
                                            v-model="form.numero" 
                                            class="w-100 h-12 text-lg"
                                            :class="{ 'p-invalid': errors.numero }"
                                            @input="clearError('numero')"
                                        />
                                        <label for="numero">Número *</label>
                                    </IftaLabel>
                                    <small v-if="errors.numero" class="text-red-500 text-sm mt-1 block">{{ errors.numero }}</small>
                                </div>
                            </div>

                            <!-- Complemento -->
                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <IftaLabel>
                                        <InputText 
                                            id="complemento" 
                                            v-model="form.complemento" 
                                            class="w-100 h-12 text-lg"
                                            :class="{ 'p-invalid': errors.complemento }"
                                            @input="clearError('complemento')"
                                        />
                                        <label for="complemento">Complemento</label>
                                    </IftaLabel>
                                    <small v-if="errors.complemento" class="text-red-500 text-sm mt-1 block">{{ errors.complemento }}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Etapa 3: Dados de Login -->
                        <div v-show="etapaAtual === 3" class="space-y-6">
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
                                    <small v-if="errors.email" class="text-red-500 text-sm mt-1 block">{{ errors.email }}</small>
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
                                    <small v-if="errors.password" class="text-red-500 text-sm mt-1 block">{{ errors.password }}</small>
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
                                    <small v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1 block">{{ errors.password_confirmation }}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Termos e Condições (só na última etapa) -->
                        <div v-show="etapaAtual === 3" class="flex items-start space-x-3 mt-6">
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
                        <small v-if="errors.politica_privacidade" class="text-red-500 text-sm block">{{ errors.politica_privacidade }}</small>

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
                                label="Próximo" 
                                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold border-0 rounded-lg" 
                            />
                            <Button 
                                v-else
                                type="submit" 
                                :loading="loading" 
                                label="Criar Minha Conta" 
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
import logo from '@/assets/img/no-bg.webp';
import userService from '@/services/userService';
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
import { trackCadastroEtapa, trackCompleteRegistration } from '@/utils/metaPixel';

const CADASTRO_ETAPA_NOMES = {
    1: 'dados_pessoais',
    2: 'endereco',
    3: 'login'
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
            loadingCep: false,
            error: '',
            n8nChatWebhookUrl: getN8nChatWebhookUrl(),
            showSuccessDialog: false,
            showExistingUserDialog: false,
            countdown: 3,
            etapaAtual: 1,
            totalEtapas: 3,
            form: {
                nome: '',
                sobrenome: '',
                telefone: '',
                cpf: '',
                crp: '',
                cep: '',
                cidade: '',
                estado: '',
                rua: '',
                bairro: '',
                numero: '',
                complemento: '',
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
        trackCadastroEtapa(1, CADASTRO_ETAPA_NOMES[1]);
    },
    methods: {
        validateForm() {
            // Usar a validação por etapas para validar tudo
            return this.validarEtapaAtual();
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
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
                const formData = this.prepareFormData();
                await userService.cadastrar(formData);

                trackCompleteRegistration({ method: 'email' });

                // Limpar formulário após sucesso
                this.clearForm();

                // Mostrar dialog de sucesso
                this.showSuccessDialog = true;
                this.startCountdown();

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

        proximoEtapa() {
            if (this.validarEtapaAtual()) {
                this.etapaAtual++;
                const nome = CADASTRO_ETAPA_NOMES[this.etapaAtual];
                if (nome) {
                    trackCadastroEtapa(this.etapaAtual, nome);
                }
            }
        },

        voltarEtapa() {
            if (this.etapaAtual > 1) {
                this.etapaAtual--;
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

            // Sempre validar dados pessoais
            if (!this.form.nome.trim()) {
                this.errors.nome = 'Nome é obrigatório';
            }
            if (!this.form.sobrenome.trim()) {
                this.errors.sobrenome = 'Sobrenome é obrigatório';
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

            // Validar endereço se estiver na etapa 2 ou 3
            if (this.etapaAtual >= 2) {
                if (!this.form.cep.trim()) {
                    this.errors.cep = 'CEP é obrigatório';
                } else if (this.validarNumeroSequencial(this.form.cep)) {
                    this.errors.cep = 'CEP não pode conter números sequenciais ou repetitivos';
                }
                if (!this.form.cidade.trim()) {
                    this.errors.cidade = 'Cidade é obrigatória';
                }
                if (!this.form.estado.trim()) {
                    this.errors.estado = 'Estado é obrigatório';
                }
                if (!this.form.rua.trim()) {
                    this.errors.rua = 'Rua é obrigatória';
                }
                if (!this.form.bairro.trim()) {
                    this.errors.bairro = 'Bairro é obrigatório';
                }
                if (!this.form.numero.trim()) {
                    this.errors.numero = 'Número é obrigatório';
                }
            }

            // Validar dados de login se estiver na etapa 3
            if (this.etapaAtual >= 3) {
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
        }

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