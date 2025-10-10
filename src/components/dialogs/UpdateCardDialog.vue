<template>
    <Dialog v-model:visible="dialogVisible" modal header="Atualizar Cartão de Crédito" :style="{ width: '500px' }">
        <div class="update-card-content">
            <Message severity="warn" :closable="false">
                Seu último pagamento foi recusado. Atualize seu cartão para reativar sua assinatura.
            </Message>

            <div class="mt-4">
                <div class="form-group mb-3">
                    <label>Número do Cartão *</label>
                    <InputMask 
                        v-model="formData.cardNumber"
                        mask="9999 9999 9999 9999"
                        placeholder="0000 0000 0000 0000"
                        :class="{ 'p-invalid': errors.cardNumber }"
                    />
                    <small v-if="errors.cardNumber" class="p-error">{{ errors.cardNumber }}</small>
                </div>

                <div class="form-group mb-3">
                    <label>Nome no Cartão *</label>
                    <InputText 
                        v-model="formData.cardName"
                        placeholder="Como está impresso no cartão"
                        :class="{ 'p-invalid': errors.cardName }"
                    />
                    <small v-if="errors.cardName" class="p-error">{{ errors.cardName }}</small>
                </div>

                <div class="grid">
                    <div class="col-6">
                        <div class="form-group">
                            <label>Validade *</label>
                            <InputMask 
                                v-model="formData.expiry"
                                mask="99/99"
                                placeholder="MM/AA"
                                :class="{ 'p-invalid': errors.expiry }"
                            />
                            <small v-if="errors.expiry" class="p-error">{{ errors.expiry }}</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label>CVV *</label>
                            <InputMask 
                                v-model="formData.cvv"
                                mask="999"
                                placeholder="123"
                                :class="{ 'p-invalid': errors.cvv }"
                            />
                            <small v-if="errors.cvv" class="p-error">{{ errors.cvv }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" @click="fechar" severity="secondary" />
            <Button label="Atualizar Cartão" @click="atualizarCartao" :loading="loading" />
        </template>
    </Dialog>
</template>

<script>
import { planService } from '@/services';
import { usePlanStore } from '@/store/plan';
import { useToast } from 'primevue/usetoast';

export default {
    name: 'UpdateCardDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        assinaturaInfo: {
            type: Object,
            default: null
        }
    },
    emits: ['update:visible', 'success'],
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            loading: false,
            formData: {
                cardNumber: '',
                cardName: '',
                expiry: '',
                cvv: ''
            },
            errors: {
                cardNumber: '',
                cardName: '',
                expiry: '',
                cvv: ''
            }
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible;
            },
            set(value) {
                this.$emit('update:visible', value);
            }
        }
    },
    methods: {
        validarFormulario() {
            let valido = true;
            
            // Limpar erros anteriores
            Object.keys(this.errors).forEach(key => {
                this.errors[key] = '';
            });
            
            if (!this.formData.cardNumber || this.formData.cardNumber.replace(/\D/g, '').length < 13) {
                this.errors.cardNumber = 'Número do cartão inválido';
                valido = false;
            }
            
            if (!this.formData.cardName.trim()) {
                this.errors.cardName = 'Nome é obrigatório';
                valido = false;
            }
            
            if (!this.formData.expiry || !/^\d{2}\/\d{2}$/.test(this.formData.expiry)) {
                this.errors.expiry = 'Validade inválida';
                valido = false;
            }
            
            if (!this.formData.cvv || this.formData.cvv.length !== 3) {
                this.errors.cvv = 'CVV inválido';
                valido = false;
            }
            
            return valido;
        },
        
        async atualizarCartao() {
            if (!this.validarFormulario()) return;
            
            this.loading = true;
            
            try {
                const response = await planService.atualizarCartao({
                    cardNumber: this.formData.cardNumber.replace(/\D/g, ''),
                    cardName: this.formData.cardName,
                    expiry: this.formData.expiry,
                    cvv: this.formData.cvv
                });
                
                this.toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message || 'Cartão atualizado com sucesso!',
                    life: 5000
                });
                
                // Recarregar informações do plano
                const planStore = usePlanStore();
                await planStore.fetchPlanInfo();
                
                this.$emit('success');
                this.fechar();
            } catch (error) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao atualizar cartão',
                    life: 5000
                });
            } finally {
                this.loading = false;
            }
        },
        
        fechar() {
            this.$emit('update:visible', false);
            this.limparFormulario();
        },
        
        limparFormulario() {
            this.formData = {
                cardNumber: '',
                cardName: '',
                expiry: '',
                cvv: ''
            };
            this.errors = {
                cardNumber: '',
                cardName: '',
                expiry: '',
                cvv: ''
            };
        }
    }
};
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
}
</style>
