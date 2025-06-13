<template>
    <div class="registration-page">
        <!-- Navigation Header -->
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-brand">
                    <h2>✨ PsicoProntuários</h2>
                </div>
                <div class="nav-actions">
                    <Button label="Voltar ao Site" class="back-btn" outlined @click="$emit('back', false)" />
                </div>
            </div>
        </nav>

        <!-- Registration Section -->
        <section class="registration-section">
            <div class="registration-container">
                <div class="registration-header mt-3">
                    <h1>Criar Conta</h1>
                    <p>Junte-se à comunidade exclusiva da PsicoProntuários</p>
                </div>

                <Card class="registration-card">
                    <template #content>
                        <form @submit.prevent="submitRegistration" class="registration-form">
                            <!-- Dados Pessoais -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="pi pi-user"></i>
                                    Dados Pessoais
                                </h3>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="nome">Nome *</label>
                                        <InputText id="nome" v-model="usuario.nome" placeholder="Seu nome"
                                            :class="{ 'p-invalid': errors.nome }" @blur="validateField('nome')" />
                                        <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="sobrenome">Sobrenome *</label>
                                        <InputText id="sobrenome" v-model="usuario.sobrenome"
                                            placeholder="Seu sobrenome" :class="{ 'p-invalid': errors.sobrenome }"
                                            @blur="validateField('sobrenome')" />
                                        <small v-if="errors.sobrenome" class="p-error">{{ errors.sobrenome }}</small>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="cpf">CPF *</label>
                                        <InputMask id="cpf" v-model="usuario.cpf" mask="999.999.999-99"
                                            placeholder="000.000.000-00" :class="{ 'p-invalid': errors.cpf }"
                                            @blur="validateField('cpf')" />
                                        <small v-if="errors.cpf" class="p-error">{{ errors.cpf }}</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="crp">CRP</label>
                                        <InputText id="crp" v-model="usuario.crp"
                                            placeholder="Número do CRP (opcional)" />
                                    </div>
                                </div>
                            </div>

                            <!-- Dados de Contato -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="pi pi-phone"></i>
                                    Dados de Contato
                                </h3>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="email">Email *</label>
                                        <InputText id="email" v-model="usuario.email" type="email"
                                            placeholder="seu@email.com" :class="{ 'p-invalid': errors.email }"
                                            @blur="validateField('email')" />
                                        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="telefone">Telefone *</label>
                                        <InputMask id="telefone" v-model="usuario.telefone" mask="(99) 99999-9999"
                                            placeholder="(00) 00000-0000" :class="{ 'p-invalid': errors.telefone }"
                                            @blur="validateField('telefone')" />
                                        <small v-if="errors.telefone" class="p-error">{{ errors.telefone }}</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Endereço -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="pi pi-map-marker"></i>
                                    Endereço
                                </h3>

                                <div class="form-row">
                                    <div class="form-group cep-group">
                                        <label for="cep">CEP *</label>
                                        <div class="cep-input-group">
                                            <InputMask id="cep" v-model="usuario.cep" mask="99999-999"
                                                placeholder="00000-000" :class="{ 'p-invalid': errors.cep }"
                                                @blur="validateField('cep')" @complete="buscarCep" />
                                            <Button icon="pi pi-search" class="cep-btn" type="button"
                                                :loading="loadingCep" @click="buscarCep" />
                                        </div>
                                        <small v-if="errors.cep" class="p-error">{{ errors.cep }}</small>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="estado">Estado *</label>
                                        <InputText id="estado" v-model="usuario.estado" placeholder="Estado"
                                            :class="{ 'p-invalid': errors.estado }" @blur="validateField('estado')" />
                                        <small v-if="errors.estado" class="p-error">{{ errors.estado }}</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="cidade">Cidade *</label>
                                        <InputText id="cidade" v-model="usuario.cidade" placeholder="Cidade"
                                            :class="{ 'p-invalid': errors.cidade }" @blur="validateField('cidade')" />
                                        <small v-if="errors.cidade" class="p-error">{{ errors.cidade }}</small>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="bairro">Bairro *</label>
                                        <InputText id="bairro" v-model="usuario.bairro" placeholder="Bairro"
                                            :class="{ 'p-invalid': errors.bairro }" @blur="validateField('bairro')" />
                                        <small v-if="errors.bairro" class="p-error">{{ errors.bairro }}</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="rua">Rua *</label>
                                        <InputText id="rua" v-model="usuario.rua" placeholder="Nome da rua"
                                            :class="{ 'p-invalid': errors.rua }" @blur="validateField('rua')" />
                                        <small v-if="errors.rua" class="p-error">{{ errors.rua }}</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Segurança -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="pi pi-lock"></i>
                                    Segurança
                                </h3>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="password">Senha *</label>
                                        <Password id="password" v-model="usuario.password" placeholder="Sua senha"
                                            :class="{ 'p-invalid': errors.password }" toggleMask :feedback="false"
                                            @blur="validateField('password')" />
                                        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="confirmPassword">Confirmar Senha *</label>
                                        <Password id="confirmPassword" v-model="confirmPassword"
                                            placeholder="Confirme sua senha"
                                            :class="{ 'p-invalid': errors.confirmPassword }" toggleMask
                                            :feedback="false" @blur="validateField('confirmPassword')" />
                                        <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword
                                            }}</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Tipo de Usuário -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="pi pi-users"></i>
                                    Tipo de Conta
                                </h3>

                                <div class="user-type-selection">
                                    <div class="user-type-option"
                                        :class="{ 'selected': usuario.tipo_usuario === 'psicologo' }"
                                        @click="usuario.tipo_usuario = 'psicologo'">
                                        <i class="pi pi-user-plus"></i>
                                        <h4>Psicólogo</h4>
                                        <p>Profissional da área de psicologia</p>
                                    </div>

                                    <!-- <div class="user-type-option"
                                        :class="{ 'selected': usuario.tipo_usuario === 'cliente' }"
                                        @click="usuario.tipo_usuario = 'cliente'">
                                        <i class="pi pi-user"></i>
                                        <h4>Cliente</h4>
                                        <p>Usuário interessado nos serviços</p>
                                    </div> -->
                                </div>
                            </div>

                            <!-- Termos e Políticas -->
                            <div class="form-section">
                                <div class="checkbox-group">
                                    <Checkbox id="politica_privacidade" v-model="usuario.politica_privacidade"
                                        :binary="true" :class="{ 'p-invalid': errors.politica_privacidade }" />
                                    <label for="politica_privacidade" class="checkbox-label">
                                        Eu concordo com os
                                        <a href="#" @click.prevent="showPrivacyPolicy">Termos de Uso</a>
                                        e
                                        <a href="#" @click.prevent="showPrivacyPolicy">Política de Privacidade</a> *
                                    </label>
                                </div>
                                <small v-if="errors.politica_privacidade" class="p-error">{{ errors.politica_privacidade
                                    }}</small>
                            </div>

                            <!-- Botões de Ação -->
                            <div class="form-actions">
                                <Button type="submit" label="Criar Conta" class="submit-btn" :loading="isSubmitting"
                                    :disabled="!isFormValid" />

                                <div class="login-link">
                                    <p>Já tem uma conta? <a href="#" @click.prevent="goToLogin">Fazer login</a></p>
                                </div>
                            </div>
                        </form>
                    </template>
                </Card>
            </div>
        </section>

        <!-- Privacy Policy Dialog -->
        <Dialog v-model:visible="showPrivacyDialog" header="Política de Privacidade" :style="{ width: '50vw' }"
            :modal="true">
            <div class="privacy-content">
                <h3>Termos de Uso e Política de Privacidade</h3>
                <p>
                    Ao criar uma conta em nossa plataforma, você concorda com nossos termos de uso
                    e política de privacidade. Seus dados pessoais serão tratados com total segurança
                    e confidencialidade.
                </p>
                <p>
                    <strong>Coleta de Dados:</strong> Coletamos apenas as informações necessárias
                    para o funcionamento da plataforma e prestação dos serviços.
                </p>
                <p>
                    <strong>Uso dos Dados:</strong> Seus dados são utilizados exclusivamente para
                    identificação, comunicação e prestação dos serviços contratados.
                </p>
                <p>
                    <strong>Segurança:</strong> Implementamos medidas de segurança para proteger
                    suas informações pessoais contra acesso não autorizado.
                </p>
            </div>

            <template #footer>
                <Button label="Entendi" @click="showPrivacyDialog = false" class="privacy-btn" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'

export default {
    name: 'RegistrationForm',
    components: {
        Button,
        Card,
        InputText,
        InputMask,
        Password,
        Checkbox,
        Dialog,
        Textarea
    },
    data() {
        return {
            usuario: {
                email: '',
                telefone: '',
                password: '',
                nome: '',
                sobrenome: '',
                cpf: '',
                crp: '',
                cep: '',
                estado: '',
                cidade: '',
                bairro: '',
                rua: '',
                politica_privacidade: false,
                tipo_usuario: 'psicologo',
            },
            confirmPassword: '',
            errors: {},
            isSubmitting: false,
            loadingCep: false,
            showPrivacyDialog: false
        }
    },
    computed: {
        isFormValid() {
            const requiredFields = [
                'nome', 'sobrenome', 'cpf', 'email', 'telefone',
                'cep', 'estado', 'cidade', 'bairro', 'rua', 'password'
            ]

            const hasRequiredFields = requiredFields.every(field => this.usuario[field])
            const hasValidPassword = this.usuario.password === this.confirmPassword
            const acceptedPolicy = this.usuario.politica_privacidade
            const noErrors = Object.keys(this.errors).length === 0

            return hasRequiredFields && hasValidPassword && acceptedPolicy && noErrors
        }
    },
    methods: {
        validateField(fieldName) {
            this.errors = { ...this.errors }
            delete this.errors[fieldName]

            const value = fieldName === 'confirmPassword' ? this.confirmPassword : this.usuario[fieldName]

            switch (fieldName) {
                case 'nome':
                case 'sobrenome':
                    if (!value || value.length < 2) {
                        this.errors[fieldName] = 'Campo obrigatório (mínimo 2 caracteres)'
                    }
                    break

                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!value) {
                        this.errors[fieldName] = 'Email é obrigatório'
                    } else if (!emailRegex.test(value)) {
                        this.errors[fieldName] = 'Email inválido'
                    }
                    break

                case 'cpf':
                    if (!value) {
                        this.errors[fieldName] = 'CPF é obrigatório'
                    } else if (!this.isValidCPF(value)) {
                        this.errors[fieldName] = 'CPF inválido'
                    }
                    break

                case 'telefone':
                    if (!value) {
                        this.errors[fieldName] = 'Telefone é obrigatório'
                    } else if (value.replace(/\D/g, '').length < 10) {
                        this.errors[fieldName] = 'Telefone inválido'
                    }
                    break

                case 'cep':
                    if (!value) {
                        this.errors[fieldName] = 'CEP é obrigatório'
                    } else if (value.replace(/\D/g, '').length !== 8) {
                        this.errors[fieldName] = 'CEP inválido'
                    }
                    break

                case 'password':
                    if (!value) {
                        this.errors[fieldName] = 'Senha é obrigatória'
                    } else if (value.length < 6) {
                        this.errors[fieldName] = 'Senha deve ter pelo menos 6 caracteres'
                    }
                    break

                case 'confirmPassword':
                    if (!value) {
                        this.errors[fieldName] = 'Confirmação de senha é obrigatória'
                    } else if (value !== this.usuario.password) {
                        this.errors[fieldName] = 'Senhas não coincidem'
                    }
                    break

                case 'politica_privacidade':
                    if (!this.usuario.politica_privacidade) {
                        this.errors[fieldName] = 'Você deve aceitar os termos'
                    }
                    break

                default:
                    if (!value && ['estado', 'cidade', 'bairro', 'rua'].includes(fieldName)) {
                        this.errors[fieldName] = 'Campo obrigatório'
                    }
            }
        },

        isValidCPF(cpf) {
            cpf = cpf.replace(/\D/g, '')

            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                return false
            }

            let sum = 0
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i)
            }
            let remainder = (sum * 10) % 11
            if (remainder === 10 || remainder === 11) remainder = 0
            if (remainder !== parseInt(cpf.charAt(9))) return false

            sum = 0
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i)
            }
            remainder = (sum * 10) % 11
            if (remainder === 10 || remainder === 11) remainder = 0
            if (remainder !== parseInt(cpf.charAt(10))) return false

            return true
        },

        async buscarCep() {
            const cep = this.usuario.cep.replace(/\D/g, '')

            if (cep.length !== 8) {
                return
            }

            this.loadingCep = true

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const data = await response.json()

                if (!data.erro) {
                    this.usuario.estado = data.uf
                    this.usuario.cidade = data.localidade
                    this.usuario.bairro = data.bairro
                    this.usuario.rua = data.logradouro
                } else {
                    this.errors.cep = 'CEP não encontrado'
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error)
                this.errors.cep = 'Erro ao buscar CEP'
            } finally {
                this.loadingCep = false
            }
        },

        async submitRegistration() {
            // Validar todos os campos
            const requiredFields = [
                'nome', 'sobrenome', 'cpf', 'email', 'telefone',
                'cep', 'estado', 'cidade', 'bairro', 'rua', 'password'
            ]

            requiredFields.forEach(field => this.validateField(field))
            this.validateField('confirmPassword')
            this.validateField('politica_privacidade')

            if (!this.isFormValid) {
                return
            }

            this.isSubmitting = true

            try {
                // Simular envio para API
                await new Promise(resolve => setTimeout(resolve, 2000))

                // Aqui você faria a chamada real para sua API
                console.log('Dados do usuário:', this.usuario)

                alert('Conta criada com sucesso! Bem-vindo à comunidade exclusiva da PsicoProntuários!')

                // Redirecionar para login ou dashboard
                this.goToLogin()

            } catch (error) {
                console.error('Erro ao criar conta:', error)
                alert('Erro ao criar conta. Tente novamente.')
            } finally {
                this.isSubmitting = false
            }
        },

        goBack() {
            // Voltar para a landing page
            this.$router.go(-1)
        },

        goToLogin() {
            alert('Redirecionando para página de login...')
            // Aqui você redirecionaria para a página de login
        },

        showPrivacyPolicy() {
            this.showPrivacyDialog = true
        }
    }
}
</script>

<style scoped>
.registration-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--neutral-200);
    padding: 0;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h2 {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin: 0;
}

.back-btn {
    border: 2px solid var(--primary) !important;
    color: var(--primary) !important;
    background: transparent !important;
    font-weight: 600 !important;
    border-radius: var(--radius-xl) !important;
    transition: all var(--transition-fast) !important;
}

.back-btn:hover {
    background: var(--primary) !important;
    color: white !important;
}

.registration-section {
    padding: var(--spacing-16) 0;
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
}

.registration-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
    width: 100%;
}

.registration-header {
    text-align: center;
    margin-bottom: var(--spacing-8);
    color: white;
}

.registration-header h1 {
    font-size: var(--font-size-4xl);
    font-weight: 800;
    margin-bottom: var(--spacing-2);
}

.registration-header p {
    font-size: var(--font-size-xl);
    opacity: 0.9;
}

.registration-card {
    background: white !important;
    border-radius: var(--radius-2xl) !important;
    box-shadow: var(--shadow-xl) !important;
    border: none !important;
}

.registration-form {
    padding: var(--spacing-8);
}

.form-section {
    margin-bottom: var(--spacing-8);
    padding-bottom: var(--spacing-6);
    border-bottom: 1px solid var(--neutral-200);
}

.form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--primary);
    margin-bottom: var(--spacing-6);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-4);
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.cep-group {
    grid-column: 1;
}

.form-group label {
    font-weight: 600;
    color: var(--neutral-700);
    margin-bottom: var(--spacing-2);
    font-size: var(--font-size-sm);
}

.cep-input-group {
    display: flex;
    gap: var(--spacing-2);
}

.cep-input-group .p-inputtext {
    flex: 1;
}

.cep-btn {
    background: var(--primary) !important;
    border: none !important;
    color: white !important;
    border-radius: var(--radius-lg) !important;
    padding: var(--spacing-2) var(--spacing-3) !important;
}

.user-type-selection {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
}

.user-type-option {
    padding: var(--spacing-6);
    border: 2px solid var(--neutral-200);
    border-radius: var(--radius-xl);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.user-type-option:hover {
    border-color: var(--primary);
    background: var(--neutral-50);
}

.user-type-option.selected {
    border-color: var(--primary);
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
}

.user-type-option i {
    font-size: 2rem;
    margin-bottom: var(--spacing-2);
}

.user-type-option h4 {
    margin-bottom: var(--spacing-1);
    font-size: var(--font-size-lg);
}

.user-type-option p {
    font-size: var(--font-size-sm);
    opacity: 0.8;
    margin: 0;
}

.checkbox-group {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-3);
}

.checkbox-label {
    font-size: var(--font-size-sm);
    color: var(--neutral-700);
    line-height: 1.5;
}

.checkbox-label a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
}

.checkbox-label a:hover {
    text-decoration: underline;
}

.form-actions {
    margin-top: var(--spacing-8);
    text-align: center;
}

.submit-btn {
    background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
    border: none !important;
    color: white !important;
    font-weight: 600 !important;
    padding: var(--spacing-4) var(--spacing-8) !important;
    border-radius: var(--radius-xl) !important;
    font-size: var(--font-size-lg) !important;
    width: 100% !important;
    margin-bottom: var(--spacing-4) !important;
    transition: all var(--transition-fast) !important;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: var(--shadow-lg) !important;
}

.submit-btn:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
}

.login-link p {
    color: var(--neutral-600);
    margin: 0;
}

.login-link a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
}

.login-link a:hover {
    text-decoration: underline;
}

.privacy-content {
    line-height: 1.6;
}

.privacy-content h3 {
    color: var(--primary);
    margin-bottom: var(--spacing-4);
}

.privacy-content p {
    margin-bottom: var(--spacing-3);
    color: var(--neutral-700);
}

.privacy-btn {
    background: var(--primary) !important;
    border: none !important;
    color: white !important;
    border-radius: var(--radius-lg) !important;
}

/* Form Input Styles */
:deep(.p-inputtext),
:deep(.p-password-input),
:deep(.p-inputmask) {
    border: 2px solid var(--neutral-200) !important;
    border-radius: var(--radius-lg) !important;
    padding: var(--spacing-3) var(--spacing-4) !important;
    font-size: var(--font-size-base) !important;
    transition: all var(--transition-fast) !important;
}

:deep(.p-inputtext:focus),
:deep(.p-password-input:focus),
:deep(.p-inputmask:focus) {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
}

:deep(.p-invalid) {
    border-color: var(--error) !important;
}

:deep(.p-error) {
    color: var(--error);
    font-size: var(--font-size-xs);
    margin-top: var(--spacing-1);
}

:deep(.p-checkbox .p-checkbox-box) {
    border: 2px solid var(--neutral-300) !important;
    border-radius: var(--radius) !important;
    width: 20px !important;
    height: 20px !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
    background: var(--primary) !important;
    border-color: var(--primary) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
    .registration-container {
        padding: 0 var(--spacing-3);
    }

    .registration-form {
        padding: var(--spacing-6);
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-3);
    }

    .user-type-selection {
        grid-template-columns: 1fr;
    }

    .registration-header h1 {
        font-size: var(--font-size-3xl);
    }

    .section-title {
        font-size: var(--font-size-lg);
    }
}

@media (max-width: 480px) {
    .nav-container {
        padding: 0 var(--spacing-3);
    }

    .nav-brand h2 {
        font-size: var(--font-size-xl);
    }

    .back-btn {
        padding: var(--spacing-2) var(--spacing-3) !important;
        font-size: var(--font-size-sm) !important;
    }

    .registration-header h1 {
        font-size: var(--font-size-2xl);
    }

    .registration-header p {
        font-size: var(--font-size-lg);
    }
}
</style>