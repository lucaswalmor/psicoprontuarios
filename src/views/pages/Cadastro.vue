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
                <div class="w-full max-w-md">
                    <!-- Logo/Título -->
                    <div class="mb-8">
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">PsicoProntuários</h1>
                        <p class="text-gray-600">Não precisa de cartão de crédito para testar.</p>
                    </div>
                    <!-- Formulário -->
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Nome -->
                        <div>
                            <InputText 
                                id="nome" 
                                v-model="form.nome" 
                                class="w-full h-12 text-lg" 
                                placeholder="Digite seu NOME"
                                :class="{ 'p-invalid': errors.nome }" 
                            />
                            <small v-if="errors.nome" class="text-red-500 text-sm mt-1 block">{{ errors.nome }}</small>
                        </div>

                        <!-- Email -->
                        <div>
                            <InputText 
                                id="email" 
                                v-model="form.email" 
                                type="email" 
                                class="w-full h-12 text-lg" 
                                placeholder="Digite seu E-MAIL"
                                :class="{ 'p-invalid': errors.email }" 
                            />
                            <small v-if="errors.email" class="text-red-500 text-sm mt-1 block">{{ errors.email }}</small>
                        </div>

                        <!-- Telefone -->
                        <div>
                            <InputMask 
                                id="telefone" 
                                v-model="form.telefone" 
                                mask="(99) 99999-9999"
                                class="w-full h-12 text-lg" 
                                placeholder="+55 Digite seu WHATSAPP"
                                :class="{ 'p-invalid': errors.telefone }" 
                            />
                            <small v-if="errors.telefone" class="text-red-500 text-sm mt-1 block">{{ errors.telefone }}</small>
                        </div>

                        <!-- CPF -->
                        <div>
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

                        <!-- Senha -->
                        <div>
                            <InputText 
                                id="password" 
                                v-model="form.password" 
                                type="password" 
                                class="w-full h-12 text-lg"
                                placeholder="Sua SENHA"
                                :class="{ 'p-invalid': errors.password }" 
                            />
                            <small v-if="errors.password" class="text-red-500 text-sm mt-1 block">{{ errors.password }}</small>
                        </div>

                        <!-- Confirmar Senha -->
                        <div>
                            <InputText 
                                id="password_confirmation" 
                                v-model="form.password_confirmation"
                                type="password" 
                                class="w-full h-12 text-lg" 
                                placeholder="Confirme sua SENHA"
                                :class="{ 'p-invalid': errors.password_confirmation }" 
                            />
                            <small v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1 block">{{ errors.password_confirmation }}</small>
                        </div>

                        <!-- Termos e Condições -->
                        <div class="flex items-start space-x-3 mt-6">
                            <Checkbox 
                                id="politica_privacidade" 
                                v-model="form.politica_privacidade"
                                :binary="true" 
                                :class="{ 'p-invalid': errors.politica_privacidade }" 
                            />
                            <label for="politica_privacidade" class="text-sm text-gray-600 leading-relaxed">
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

                        <!-- Botão de Envio -->
                        <Button 
                            type="submit" 
                            :loading="loading" 
                            label="CRIAR MINHA CONTA" 
                            class="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg border-0 rounded-lg mt-6" 
                        />

                        <!-- Mensagens de Erro -->
                        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <p class="text-red-800">{{ error }}</p>
                        </div>
                    </form>

                    <!-- Link de Login -->
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-600">
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
        <Dialog v-model:visible="showSuccessDialog" :dismissable="false" :closable="false" modal class="success-dialog">
            <template #header>
                <div class="flex items-center">
                    <i class="pi pi-check-circle text-green-500 text-2xl mr-3"></i>
                    <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100">
                        Cadastro Realizado com Sucesso!
                    </h3>
                </div>
            </template>

            <div class="text-center py-6">
                <div class="mb-4">
                    <i class="pi pi-check-circle text-green-500 text-6xl mb-4"></i>
                    <h4 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                        Parabéns pelo seu cadastro!
                    </h4>
                    <p class="text-surface-600 dark:text-surface-400 mb-4">
                        Sua conta foi criada com sucesso. Você será redirecionado para a página de login em alguns
                        segundos.
                    </p>
                </div>

                <div class="flex items-center justify-center space-x-2 mb-4">
                    <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" fill="var(--surface-ground)"
                        animationDuration=".5s" />
                    <span class="text-surface-600 dark:text-surface-400">
                        Redirecionando...
                    </span>
                </div>

                <div class="text-sm text-surface-500 dark:text-surface-400">
                    <i class="pi pi-clock mr-1"></i>
                    Aguarde {{ countdown }} segundos
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import logo from '@/assets/img/no-bg.webp';
import userService from '@/services/userService';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

export default {
    name: 'Cadastro',
    components: {
        InputText,
        InputMask,
        Checkbox,
        Button,
        Dialog,
        ProgressSpinner,
        IconField,
        InputIcon
    },
    data() {
        return {
            logo,
            loading: false,
            loadingCep: false,
            error: '',
            showSuccessDialog: false,
            countdown: 3,
            form: {
                nome: '',
                sobrenome: '',
                email: '',
                telefone: '',
                cpf: '',
                crp: '',
                password: '',
                password_confirmation: '',
                codigo_cupom: '',
                politica_privacidade: false,
                tipo_usuario: 'psicologo'
            },
            errors: {}
        };
    },
    methods: {
        validateForm() {
            this.errors = {};

            // Validações básicas
            if (!this.form.nome.trim()) {
                this.errors.nome = 'Nome é obrigatório';
            }

            if (!this.form.sobrenome.trim()) {
                this.errors.sobrenome = 'Sobrenome é obrigatório';
            }

            if (!this.form.email.trim()) {
                this.errors.email = 'Email é obrigatório';
            } else if (!this.isValidEmail(this.form.email)) {
                this.errors.email = 'Email inválido';
            }

            if (!this.form.telefone.trim()) {
                this.errors.telefone = 'Telefone é obrigatório';
            }

            if (!this.form.cpf.trim()) {
                this.errors.cpf = 'CPF é obrigatório';
            }

            if (!this.form.crp.trim()) {
                this.errors.crp = 'CRP é obrigatório';
            }

            if (!this.form.cep.trim()) {
                this.errors.cep = 'CEP é obrigatório';
            }

            if (!this.form.estado) {
                this.errors.estado = 'Estado é obrigatório';
            }

            if (!this.form.cidade.trim()) {
                this.errors.cidade = 'Cidade é obrigatória';
            }

            if (!this.form.bairro.trim()) {
                this.errors.bairro = 'Bairro é obrigatório';
            }

            if (!this.form.rua.trim()) {
                this.errors.rua = 'Rua é obrigatória';
            }

            if (!this.form.numero.trim()) {
                this.errors.numero = 'Número é obrigatório';
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

            return Object.keys(this.errors).length === 0;
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
                const response = await userService.cadastrar(formData);

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

    /* Garantir que inputs usem 100% da largura em mobile */
    .row .col-md-6,
    .row .col-md-12 {
        width: 100% !important;
        margin-bottom: 1rem;
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

/* Dialog de Sucesso */
.success-dialog .p-dialog {
    max-width: 500px;
    width: 90%;
}

.success-dialog .p-dialog-header {
    border-bottom: 1px solid var(--surface-border);
    padding: 1.5rem 1.5rem 1rem;
}

.success-dialog .p-dialog-content {
    padding: 0 1.5rem 1.5rem;
}

.success-dialog .p-dialog-header-icon {
    display: none;
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