<template>
    <div class="card-form">
        <h3 v-if="!hideSubmit" class="text-xl font-semibold mb-4">Informações do Cartão</h3>
        
        <form @submit.prevent="handleSubmit">
            <!-- Nome no Cartão -->
            <div class="field mb-4">
                <label for="holder_name" class="block mb-2 font-medium">
                    Nome no Cartão *
                </label>
                <InputText
                    id="holder_name"
                    v-model="dadosCartao.holder_name"
                    placeholder="Nome como está no cartão"
                    :class="{ 'p-invalid': errors.holder_name }"
                    class="w-full"
                />
                <small v-if="errors.holder_name" class="p-error">{{ errors.holder_name }}</small>
            </div>

            <!-- Número do Cartão -->
            <div class="field mb-4">
                <label for="number" class="block mb-2 font-medium">
                    Número do Cartão *
                </label>
                <InputMask
                    id="number"
                    v-model="dadosCartao.number"
                    mask="9999 9999 9999 9999"
                    placeholder="0000 0000 0000 0000"
                    :class="{ 'p-invalid': errors.number }"
                    class="w-full"
                />
                <small v-if="errors.number" class="p-error">{{ errors.number }}</small>
            </div>

            <!-- Data de Validade e CVV -->
            <div class="grid grid-nogutter mb-4">
                <div class="col-7 pr-2">
                    <label for="expiry" class="block mb-2 font-medium">
                        Validade *
                    </label>
                    <div class="flex gap-2">
                        <InputMask
                            v-model="dadosCartao.expiry_month"
                            mask="99"
                            placeholder="MM"
                            :class="{ 'p-invalid': errors.expiry_month }"
                            class="w-full"
                        />
                        <span class="flex align-items-center">/</span>
                        <InputMask
                            v-model="dadosCartao.expiry_year"
                            mask="9999"
                            placeholder="AAAA"
                            :class="{ 'p-invalid': errors.expiry_year }"
                            class="w-full"
                        />
                    </div>
                    <small v-if="errors.expiry_month || errors.expiry_year" class="p-error">
                        {{ errors.expiry_month || errors.expiry_year }}
                    </small>
                </div>
                <div class="col-5 pl-2">
                    <label for="ccv" class="block mb-2 font-medium">
                        CVV *
                    </label>
                    <InputMask
                        id="ccv"
                        v-model="dadosCartao.ccv"
                        mask="999"
                        placeholder="000"
                        :class="{ 'p-invalid': errors.ccv }"
                        class="w-full"
                    />
                    <small v-if="errors.ccv" class="p-error">{{ errors.ccv }}</small>
                </div>
            </div>

            <!-- Informações do Titular -->
            <div class="field mb-4">
                <label for="cpf" class="block mb-2 font-medium">
                    CPF *
                </label>
                <InputMask
                    id="cpf"
                    v-model="dadosUsuario.cpf"
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
                    :class="{ 'p-invalid': errors.cpf }"
                    class="w-full"
                />
                <small v-if="errors.cpf" class="p-error">{{ errors.cpf }}</small>
            </div>

            <div class="field mb-4">
                <label for="phone" class="block mb-2 font-medium">
                    Telefone *
                </label>
                <InputMask
                    id="phone"
                    v-model="dadosUsuario.phone"
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                    :class="{ 'p-invalid': errors.phone }"
                    class="w-full"
                />
                <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
            </div>

            <!-- Botão de Pagamento -->
            <template v-if="!hideSubmit">
                <Button
                    type="submit"
                    label="Confirmar Pagamento"
                    icon="pi pi-lock"
                    :loading="loading"
                    :disabled="loading"
                    class="w-full p-button-primary p-button-lg"
                />

                <!-- Mensagem de Segurança -->
                <div class="security-notice mt-4 p-3 bg-blue-50 border-round">
                    <i class="pi pi-shield text-blue-600 mr-2"></i>
                    <span class="text-sm text-blue-600">
                        Seus dados estão protegidos. O pagamento é processado de forma segura pela Asaas.
                    </span>
                </div>
            </template>
        </form>
    </div>
</template>

<script>
export default {
    name: 'CartaoAsaas',
    emits: ['submit', 'cancel'],
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        hideSubmit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dadosCartao: {
                holder_name: '',
                number: '',
                expiry_month: '',
                expiry_year: '',
                ccv: ''
            },
            dadosUsuario: {
                cpf: '',
                phone: ''
            },
            errors: {}
        };
    },
    methods: {
        /**
         * Limpar CPF
         */
        limparCPF(cpf) {
            return cpf.replace(/\D/g, '');
        },
        
        /**
         * Limpar telefone
         */
        limparTelefone(phone) {
            return phone.replace(/\D/g, '');
        },

        /**
         * Limpar número do cartão
         */
        limparNumeroCartao(number) {
            return number.replace(/\s/g, '');
        },

        /**
         * Validar formulário
         */
        validar() {
            this.errors = {};

            if (!this.dadosCartao.holder_name || this.dadosCartao.holder_name.trim().length < 3) {
                this.errors.holder_name = 'Nome deve ter pelo menos 3 caracteres';
            }

            const numeroCartao = this.dadosCartao.number.replace(/\s/g, '');
            if (!numeroCartao || numeroCartao.length !== 16) {
                this.errors.number = 'Número do cartão inválido';
            }

            const mes = parseInt(this.dadosCartao.expiry_month);
            if (!this.dadosCartao.expiry_month || this.dadosCartao.expiry_month.length !== 2 || mes < 1 || mes > 12) {
                this.errors.expiry_month = 'Mês inválido (use 01 a 12)';
            }

            const ano = parseInt(this.dadosCartao.expiry_year);
            const anoAtual = new Date().getFullYear();
            const anoMaximo = anoAtual + 20;
            
            if (!this.dadosCartao.expiry_year || this.dadosCartao.expiry_year.length !== 4) {
                this.errors.expiry_year = 'Ano inválido';
            } else if (ano < anoAtual || ano > anoMaximo) {
                this.errors.expiry_year = `Ano inválido (use ${anoAtual} a ${anoMaximo})`;
            }

            if (!this.dadosCartao.ccv || this.dadosCartao.ccv.length !== 3) {
                this.errors.ccv = 'CVV inválido';
            }

            const cpf = this.dadosUsuario.cpf.replace(/\D/g, '');
            if (!cpf || cpf.length !== 11) {
                this.errors.cpf = 'CPF inválido';
            }

            const telefone = this.dadosUsuario.phone.replace(/\D/g, '');
            if (!telefone || telefone.length < 10) {
                this.errors.phone = 'Telefone inválido';
            }

            return Object.keys(this.errors).length === 0;
        },

        /**
         * Handler de submit
         */
        handleSubmit() {
            if (!this.validar()) {
                return;
            }

            // Enviar ano completo (backend converte automaticamente para 2 dígitos)
            this.$emit('submit', {
                cartao: {
                    holder_name: this.dadosCartao.holder_name,
                    number: this.limparNumeroCartao(this.dadosCartao.number),
                    expiry_month: this.dadosCartao.expiry_month,
                    expiry_year: this.dadosCartao.expiry_year, // Envia 4 dígitos, backend converte
                    ccv: this.dadosCartao.ccv
                },
                usuario: {
                    cpf: this.limparCPF(this.dadosUsuario.cpf),
                    phone: this.limparTelefone(this.dadosUsuario.phone)
                }
            });
        },

        getDadosCartao() {
            if (!this.validar()) return null;
            return {
                cartao: {
                    holder_name: this.dadosCartao.holder_name,
                    number: this.limparNumeroCartao(this.dadosCartao.number),
                    expiry_month: this.dadosCartao.expiry_month,
                    expiry_year: this.dadosCartao.expiry_year,
                    ccv: this.dadosCartao.ccv
                },
                usuario: {
                    cpf: this.limparCPF(this.dadosUsuario.cpf),
                    phone: this.limparTelefone(this.dadosUsuario.phone)
                }
            };
        }
    }
};
</script>

<style scoped>
.card-form {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 2rem;
}

.field label {
    color: var(--text-color);
}

.security-notice {
    border: 1px solid var(--blue-200);
}

@media (max-width: 768px) {
    .card-form {
        padding: 1.5rem;
    }
}
</style>

