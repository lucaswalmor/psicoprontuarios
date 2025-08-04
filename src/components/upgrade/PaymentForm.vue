<template>
    <div class="payment-form">
        <div class="payment-card">
            <div class="payment-header">
                <h3>Informações de Pagamento</h3>
                <p>Complete os dados para finalizar seu upgrade</p>
            </div>

            <form @submit.prevent="processPayment" class="form-content">
                <!-- Informações do Plano -->
                <div class="plan-summary">
                    <h4>Resumo do Plano</h4>
                    <div class="summary-row">
                        <span>Plano Selecionado:</span>
                        <span class="plan-name">{{ plan?.nome }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Valor:</span>
                        <span class="plan-price">{{ plan?.preco }}</span>
                    </div>
                </div>

                <!-- Seleção do Método de Pagamento -->
                <div class="form-section">
                    <h4>Método de Pagamento</h4>
                    <div class="payment-methods">
                        <div 
                            class="payment-method"
                            :class="{ 'selected': paymentMethod === 'credit' }"
                            @click="paymentMethod = 'credit'"
                        >
                            <i class="pi pi-credit-card"></i>
                            <span>Cartão de Crédito</span>
                            <small>Débito automático mensal</small>
                        </div>
                        <!-- <div 
                            class="payment-method"
                            :class="{ 'selected': paymentMethod === 'pix' }"
                            @click="paymentMethod = 'pix'"
                        >
                            <i class="pi pi-qrcode"></i>
                            <span>PIX</span>
                            <small>Pagamento único</small>
                        </div> -->
                    </div>
                </div>

                <!-- Formulário de Cartão de Crédito -->
                <div v-if="paymentMethod === 'credit'" class="form-section">
                    <h4>Dados Pessoais</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Nome Completo *</label>
                            <InputText 
                                id="name" 
                                v-model="formData.name" 
                                :class="{ 'p-invalid': errors.name }"
                                placeholder="Digite seu nome completo"
                            />
                            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
                        </div>
                        <div class="form-group">
                            <label for="cpf">CPF *</label>
                            <InputMask 
                                id="cpf" 
                                v-model="formData.cpf" 
                                :class="{ 'p-invalid': errors.cpf }"
                                placeholder="000.000.000-00"
                                mask="999.999.999-99"
                            />
                            <small v-if="errors.cpf" class="p-error">{{ errors.cpf }}</small>
                        </div>
                    </div>

                    <h4>Dados do Cartão</h4>
                    <div class="row mb-2">
                        <div class="form-group">
                            <label for="cardNumber">Número do Cartão *</label>
                            <InputMask 
                                id="cardNumber" 
                                v-model="formData.cardNumber" 
                                :class="{ 'p-invalid': errors.cardNumber }"
                                placeholder="0000 0000 0000 0000"
                                mask="9999 9999 9999 9999"
                            />
                            <small v-if="errors.cardNumber" class="p-error">{{ errors.cardNumber }}</small>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="form-group">
                            <label for="cardName">Nome no Cartão *</label>
                            <InputText 
                                id="cardName" 
                                v-model="formData.cardName" 
                                :class="{ 'p-invalid': errors.cardName }"
                                placeholder="Como está impresso no cartão"
                            />
                            <small v-if="errors.cardName" class="p-error">{{ errors.cardName }}</small>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Validade *</label>
                            <InputMask 
                                id="expiry" 
                                v-model="formData.expiry" 
                                :class="{ 'p-invalid': errors.expiry }"
                                placeholder="MM/AA"
                                mask="99/99"
                            />
                            <small v-if="errors.expiry" class="p-error">{{ errors.expiry }}</small>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV *</label>
                            <InputMask 
                                id="cvv" 
                                v-model="formData.cvv" 
                                :class="{ 'p-invalid': errors.cvv }"
                                placeholder="123"
                                mask="999"
                            />
                            <small v-if="errors.cvv" class="p-error">{{ errors.cvv }}</small>
                        </div>
                    </div>
                </div>

                <!-- PIX Payment Section -->
                <div v-if="paymentMethod === 'pix'" class="form-section">
                    <div class="pix-section">
                        <div class="pix-info">
                            <h4>Pagamento via PIX</h4>
                            <p>Escaneie o QR Code ou copie o código PIX para pagar</p>
                        </div>
                        
                        <div v-if="pixData" class="pix-content">
                            <div v-if="pixData.waitingForPix" class="pix-waiting">
                                <ProgressSpinner />
                                <h5>Aguarde um momento...</h5>
                                <p>Estamos preparando os dados PIX para você.</p>
                            </div>
                            
                            <div v-else-if="pixData.qrCode" class="pix-ready">
                                <div class="qr-code-container">
                                    <img :src="pixData.qrCode" alt="QR Code PIX" class="qr-code" />
                                </div>
                                
                                <div class="pix-copy-code">
                                    <h5>PIX Copia e Cola</h5>
                                    <div class="copy-input">
                                        <InputText 
                                            :value="pixData.copyCode" 
                                            readonly 
                                            class="copy-text"
                                        />
                                        <Button 
                                            icon="pi pi-copy" 
                                            @click="copyPixCode"
                                            class="p-button-secondary"
                                            size="small"
                                        />
                                    </div>
                                </div>
                                
                                <div class="pix-status">
                                    <ProgressSpinner v-if="checkingPixStatus" />
                                    <div v-else class="status-message">
                                        <i class="pi pi-clock"></i>
                                        <span>Aguardando pagamento...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-else class="pix-loading">
                            <ProgressSpinner />
                            <p>Gerando PIX...</p>
                        </div>
                    </div>
                </div>

                <!-- Termos e Condições -->
                <div class="form-section">
                    <div class="checkbox-group">
                        <Checkbox 
                            id="terms" 
                            v-model="formData.acceptTerms" 
                            :binary="true"
                            :class="{ 'p-invalid': errors.acceptTerms }"
                        />
                        <label for="terms" class="checkbox-label">
                            Li e aceito os <a href="#" @click.prevent="showTerms">termos de uso</a> e 
                            <a href="#" @click.prevent="showPrivacy">política de privacidade</a>
                        </label>
                    </div>
                    <small v-if="errors.acceptTerms" class="p-error">{{ errors.acceptTerms }}</small>
                </div>

                <!-- Botões de Ação -->
                <div class="form-actions">
                    <Button 
                        v-if="paymentMethod === 'credit'"
                        type="submit" 
                        label="Finalizar Pagamento" 
                        :loading="isProcessing"
                        :disabled="isProcessing"
                        class="p-button-primary"
                        size="large"
                    />
                </div>
            </form>
        </div>

        <!-- Modal de Termos -->
        <Dialog 
            v-model:visible="showTermsModal" 
            modal 
            header="Termos de Uso"
            :style="{ width: '50vw' }"
        >
            <div class="terms-content">
                <h4>Termos de Uso - Upgrade de Plano</h4>
                <p>1. O upgrade do plano será processado imediatamente após a confirmação do pagamento.</p>
                <p>2. O valor será cobrado mensalmente conforme o plano selecionado.</p>
                <p>3. Você pode cancelar sua assinatura a qualquer momento.</p>
                <p>4. Não há fidelidade mínima.</p>
                <p>5. O suporte técnico está disponível conforme o plano contratado.</p>
            </div>
        </Dialog>

        <!-- Modal de Política de Privacidade -->
        <Dialog 
            v-model:visible="showPrivacyModal" 
            modal 
            header="Política de Privacidade"
            :style="{ width: '50vw' }"
        >
            <div class="privacy-content">
                <h4>Política de Privacidade</h4>
                <p>Suas informações de pagamento são processadas de forma segura pela Asaas.</p>
                <p>Não armazenamos dados de cartão de crédito em nossos servidores.</p>
                <p>Todos os dados pessoais são protegidos conforme a LGPD.</p>
            </div>
        </Dialog>

        <!-- Modal de Sucesso -->
        <Dialog 
            v-model:visible="showSuccessModal" 
            modal 
            header="Pagamento Realizado com Sucesso!"
            :closable="false"
            :style="{ width: '40vw' }"
        >
            <div class="success-content">
                <div class="success-icon">
                    <i class="pi pi-check-circle"></i>
                </div>
                <h4>Upgrade Realizado!</h4>
                <p>Seu plano foi atualizado com sucesso. Você já pode aproveitar todos os recursos do seu novo plano.</p>
                <div class="success-details">
                    <p><strong>Plano:</strong> {{ plan?.nome }}</p>
                    <p><strong>Valor:</strong> {{ plan?.preco }}</p>
                </div>
            </div>
            <template #footer>
                <Button 
                    label="Ir para Dashboard" 
                    @click="goToDashboard"
                    class="p-button-primary"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { planService } from '@/services';
import InputMask from 'primevue/inputmask';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'PaymentForm',
    components: {
        InputMask,
        ProgressSpinner
    },
    props: {
        plan: {
            type: Object,
            required: true
        }
    },
    emits: ['payment-success', 'payment-error'],
    setup(props, { emit }) {
        const router = useRouter();
        const isProcessing = ref(false);
        const showTermsModal = ref(false);
        const showPrivacyModal = ref(false);
        const showSuccessModal = ref(false);
        const paymentMethod = ref('credit');
        const pixData = ref({
            waitingForPix: false,
            qrCode: null,
            copyCode: null,
            paymentId: null
        });
        const checkingPixStatus = ref(false);
        let pixStatusInterval = null;

        const formData = reactive({
            name: '',
            cpf: '',
            cardNumber: '',
            cardName: '',
            expiry: '',
            cvv: '',
            acceptTerms: false
        });

        const errors = reactive({
            name: '',
            cpf: '',
            cardNumber: '',
            cardName: '',
            expiry: '',
            cvv: '',
            acceptTerms: ''
        });

        const validateForm = () => {
            let isValid = true;
            
            // Limpar erros anteriores
            Object.keys(errors).forEach(key => errors[key] = '');

            if (paymentMethod.value === 'credit') {
                // Validações para cartão de crédito
                if (!formData.name.trim()) {
                    errors.name = 'Nome é obrigatório';
                    isValid = false;
                }

                if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
                    errors.cpf = 'CPF inválido';
                    isValid = false;
                }

                if (!formData.cardNumber || formData.cardNumber.replace(/\D/g, '').length < 13) {
                    errors.cardNumber = 'Número do cartão inválido';
                    isValid = false;
                }

                if (!formData.cardName.trim()) {
                    errors.cardName = 'Nome no cartão é obrigatório';
                    isValid = false;
                }

                if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
                    errors.expiry = 'Data de validade inválida';
                    isValid = false;
                }

                if (!formData.cvv || formData.cvv.length !== 3) {
                    errors.cvv = 'CVV inválido';
                    isValid = false;
                }
            }

            if (!formData.acceptTerms) {
                errors.acceptTerms = 'Você deve aceitar os termos';
                isValid = false;
            }

            return isValid;
        };

        const generatePixPayment = async () => {
            try {
                const response = await planService.generatePixPayment({
                    planId: props.plan.id.toString()
                });
                
                if (response.success) {
                    if (response.pix_available && response.pix_data) {
                        console.log('Dados PIX disponíveis imediatamente');
                        // Dados PIX disponíveis imediatamente
                        pixData.value = {
                            qrCode: `data:image/png;base64,${response.pix_data.qrCode}`,
                            copyCode: response.pix_data.copyCode,
                            paymentId: response.pix_data.paymentId,
                            waitingForPix: false
                        };
                        console.log('pixData atualizado:', pixData.value);
                        startPixStatusCheck();
                    } else {
                        console.log('Dados PIX não disponíveis imediatamente, aguardando...');
                        // Dados PIX não disponíveis imediatamente, aguardar e tentar buscar
                        pixData.value = {
                            paymentId: response.payment_id,
                            waitingForPix: true,
                            qrCode: null,
                            copyCode: null
                        };
                        console.log('pixData atualizado (aguardando):', pixData.value);
                        // Tentar buscar dados PIX após alguns segundos
                        setTimeout(async () => {
                            await tryGetPixData(response.payment_id);
                        }, 3000);
                    }
                } else {
                    emit('payment-error', response.message || 'Erro ao gerar PIX');
                }
            } catch (error) {
                console.error('Erro ao gerar PIX:', error);
                emit('payment-error', 'Erro ao gerar PIX');
            }
        };

        const tryGetPixData = async (paymentId) => {
            try {
                const response = await planService.checkPixStatus(paymentId);
                if (response.pix_data) {
                    pixData.value = {
                        qrCode: `data:image/png;base64,${response.pix_data.qrCode}`,
                        copyCode: response.pix_data.copyCode,
                        paymentId: paymentId,
                        waitingForPix: false
                    };
                    startPixStatusCheck();
                } else {
                    // Se ainda não tiver dados PIX, tentar novamente em 5 segundos
                    setTimeout(() => tryGetPixData(paymentId), 5000);
                }
            } catch (error) {
                console.error('Erro ao buscar dados PIX:', error);
                // Tentar novamente em 5 segundos
                setTimeout(() => tryGetPixData(paymentId), 5000);
            }
        };

        const startPixStatusCheck = () => {
            checkingPixStatus.value = true;
            pixStatusInterval = setInterval(async () => {
                try {
                    const response = await planService.checkPixStatus(pixData.value.paymentId);
                    if (response.status === 'CONFIRMED') {
                        clearInterval(pixStatusInterval);
                        checkingPixStatus.value = false;
                        showSuccessModal.value = true;
                        emit('payment-success', response);
                    }
                } catch (error) {
                    console.error('Erro ao verificar status PIX:', error);
                }
            }, 5000); // Verificar a cada 5 segundos
        };

        const copyPixCode = async () => {
            try {
                await navigator.clipboard.writeText(pixData.value.copyCode);
                // Mostrar feedback de sucesso
            } catch (error) {
                console.error('Erro ao copiar código PIX:', error);
            }
        };

        const processPayment = async () => {
            if (!validateForm()) {
                return;
            }

            isProcessing.value = true;

            try {
                if (paymentMethod.value === 'credit') {
                    // Processar pagamento com cartão
                    const paymentData = {
                        planId: props.plan.id.toString(),
                        paymentMethod: 'credit',
                        customerData: {
                            name: formData.name,
                            cpf: formData.cpf.replace(/\D/g, ''),
                            email: JSON.parse(sessionStorage.getItem('usuario'))?.email || ''
                        },
                        paymentData: {
                            cardNumber: formData.cardNumber.replace(/\D/g, ''),
                            cardName: formData.cardName,
                            expiry: formData.expiry,
                            cvv: formData.cvv
                        }
                    };

                    const response = await planService.processUpgrade(paymentData);

                    if (response.success) {
                        showSuccessModal.value = true;
                        emit('payment-success', response);
                    } else {
                        emit('payment-error', response.message || 'Erro no processamento do pagamento');
                    }
                }
            } catch (error) {
                console.error('Erro no pagamento:', error);
                emit('payment-error', error.message || 'Erro inesperado no pagamento');
            } finally {
                isProcessing.value = false;
            }
        };

        const goToDashboard = () => {
            router.push('/dashboard');
        };

        const showTerms = () => {
            showTermsModal.value = true;
        };

        const showPrivacy = () => {
            showPrivacyModal.value = true;
        };

        // Lifecycle
        onMounted(() => {
            // Não gerar PIX automaticamente no mount, apenas quando o método for selecionado
        });

        onUnmounted(() => {
            if (pixStatusInterval) {
                clearInterval(pixStatusInterval);
            }
        });

        // Watch payment method changes
        watch(paymentMethod, (newMethod) => {
            console.log('Método de pagamento alterado para:', newMethod);
            if (newMethod === 'pix') {
                console.log('Iniciando geração de PIX...');
                generatePixPayment();
            }
        });

        return {
            formData,
            errors,
            isProcessing,
            showTermsModal,
            showPrivacyModal,
            showSuccessModal,
            paymentMethod,
            pixData,
            checkingPixStatus,
            processPayment,
            showTerms,
            showPrivacy,
            goToDashboard,
            copyPixCode
        };
    }
};
</script>

<style scoped>
.payment-form {
    max-width: 600px;
    margin: 0 auto;
}

.payment-card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-header {
    text-align: center;
    margin-bottom: 2rem;
}

.payment-header h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
}

.payment-header p {
    margin: 0;
    color: var(--text-color-secondary);
}

.plan-summary {
    background: var(--surface-ground);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
}

.plan-summary h4 {
    margin: 0 0 1rem 0;
    color: var(--text-color);
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
}

.plan-name {
    font-weight: 600;
    color: var(--primary-color);
}

.plan-price {
    font-weight: 700;
    color: var(--primary-color);
    font-size: 1.1rem;
}

.payment-methods {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.payment-method {
    border: 2px solid var(--surface-border);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.payment-method:hover {
    border-color: var(--primary-color);
    background: var(--surface-hover);
}

.payment-method.selected {
    border-color: var(--primary-color);
    background: rgba(var(--primary-color-rgb), 0.1);
}

.payment-method i {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    display: block;
}

.payment-method span {
    display: block;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.25rem;
}

.payment-method small {
    color: var(--text-color-secondary);
    font-size: 0.75rem;
}

.pix-section {
    text-align: center;
}

.pix-info h4 {
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.pix-info p {
    color: var(--text-color-secondary);
    margin-bottom: 2rem;
}

.qr-code-container {
    margin-bottom: 2rem;
}

.qr-code {
    max-width: 200px;
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    padding: 1rem;
}

.pix-copy-code {
    margin-bottom: 2rem;
}

.pix-copy-code h5 {
    margin-bottom: 1rem;
    color: var(--text-color);
}

.copy-input {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.copy-text {
    flex: 1;
}

.pix-status {
    margin-top: 2rem;
}

.status-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--text-color-secondary);
}

.pix-loading {
    text-align: center;
    padding: 2rem;
}

.pix-loading p {
    margin-top: 1rem;
    color: var(--text-color-secondary);
}

.pix-waiting {
    text-align: center;
    padding: 2rem;
}

.pix-waiting h5 {
    margin: 1rem 0 0.5rem 0;
    color: var(--text-color);
}

.pix-waiting p {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.pix-ready {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.success-content {
    text-align: center;
}

.success-icon {
    margin-bottom: 1rem;
}

.success-icon i {
    font-size: 4rem;
    color: var(--green-500);
}

.success-content h4 {
    margin-bottom: 1rem;
    color: var(--text-color);
}

.success-content p {
    color: var(--text-color-secondary);
    margin-bottom: 1.5rem;
}

.success-details {
    background: var(--surface-ground);
    border-radius: 8px;
    padding: 1rem;
    text-align: left;
}

.success-details p {
    margin: 0.5rem 0;
    color: var(--text-color);
}

.form-section {
    margin-bottom: 2rem;
}

.form-section h4 {
    margin: 0 0 1rem 0;
    color: var(--text-color);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
}

.checkbox-group {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.checkbox-label {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
    line-height: 1.4;
}

.checkbox-label a {
    color: var(--primary-color);
    text-decoration: none;
}

.checkbox-label a:hover {
    text-decoration: underline;
}

.form-actions {
    text-align: center;
    margin-top: 2rem;
}

.terms-content,
.privacy-content {
    max-height: 400px;
    overflow-y: auto;
}

.terms-content h4,
.privacy-content h4 {
    margin-bottom: 1rem;
    color: var(--text-color);
}

.terms-content p,
.privacy-content p {
    margin-bottom: 0.75rem;
    color: var(--text-color-secondary);
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
    .payment-card {
        padding: 1.5rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .payment-methods {
        grid-template-columns: 1fr;
    }
}
</style> 