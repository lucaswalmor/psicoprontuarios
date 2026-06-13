<template>
    <div class="endereco-form">
        <h3 class="text-xl font-semibold mb-4">Endereço de cobrança</h3>
        <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
            Informe seu CEP para preenchermos o endereço automaticamente.
        </p>

        <div class="field mb-4">
            <label for="cep" class="block mb-2 font-medium">CEP *</label>
            <div class="flex gap-2 flex-wrap">
                <InputMask
                    id="cep"
                    v-model="form.cep"
                    mask="99999-999"
                    placeholder="00000-000"
                    class="flex-1 min-w-0"
                    inputClass="w-full"
                    :class="{ 'p-invalid': errors.cep }"
                    @keyup.enter="buscarCep"
                />
                <Button
                    type="button"
                    label="Buscar"
                    icon="pi pi-search"
                    :loading="loadingCep"
                    :disabled="loadingCep"
                    @click="buscarCep"
                />
            </div>
            <small v-if="errors.cep" class="p-error">{{ errors.cep }}</small>
            <small v-if="loadingCep" class="text-blue-500 text-sm mt-1 block">
                <i class="pi pi-spin pi-spinner mr-1"></i>
                Buscando endereço...
            </small>
        </div>

        <div v-if="enderecoVisivel" class="endereco-campos">
            <div class="field mb-4">
                <label for="rua" class="block mb-2 font-medium">Rua *</label>
                <InputText
                    id="rua"
                    v-model="form.rua"
                    class="w-full"
                    :class="{ 'p-invalid': errors.rua }"
                />
                <small v-if="errors.rua" class="p-error">{{ errors.rua }}</small>
            </div>

            <div class="field mb-4">
                <label for="bairro" class="block mb-2 font-medium">Bairro *</label>
                <InputText
                    id="bairro"
                    v-model="form.bairro"
                    class="w-full"
                    :class="{ 'p-invalid': errors.bairro }"
                />
                <small v-if="errors.bairro" class="p-error">{{ errors.bairro }}</small>
            </div>

            <div class="grid grid-nogutter mb-4">
                <div class="col-8 pr-2">
                    <label for="cidade" class="block mb-2 font-medium">Cidade *</label>
                    <InputText
                        id="cidade"
                        v-model="form.cidade"
                        class="w-full"
                        :class="{ 'p-invalid': errors.cidade }"
                    />
                    <small v-if="errors.cidade" class="p-error">{{ errors.cidade }}</small>
                </div>
                <div class="col-4 pl-2">
                    <label for="estado" class="block mb-2 font-medium">UF *</label>
                    <InputText
                        id="estado"
                        v-model="form.estado"
                        maxlength="2"
                        class="w-full uppercase"
                        :class="{ 'p-invalid': errors.estado }"
                    />
                    <small v-if="errors.estado" class="p-error">{{ errors.estado }}</small>
                </div>
            </div>

            <div class="grid grid-nogutter mb-4">
                <div class="col-5 pr-2">
                    <label for="numero" class="block mb-2 font-medium">Número *</label>
                    <InputText
                        id="numero"
                        v-model="form.numero"
                        class="w-full"
                        :class="{ 'p-invalid': errors.numero }"
                        placeholder="Ex: 123"
                    />
                    <small v-if="errors.numero" class="p-error">{{ errors.numero }}</small>
                </div>
                <div class="col-7 pl-2">
                    <label for="complemento" class="block mb-2 font-medium">Complemento</label>
                    <InputText
                        id="complemento"
                        v-model="form.complemento"
                        class="w-full"
                        placeholder="Apto, sala (opcional)"
                    />
                </div>
            </div>

            <p v-if="cepNaoEncontrado" class="text-sm text-orange-600 mb-2">
                Não encontramos este CEP. Preencha os campos manualmente.
            </p>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';

export default {
    name: 'EnderecoCheckout',
    components: {
        InputText,
        InputMask,
        Button,
    },
    props: {
        initial: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            loadingCep: false,
            enderecoVisivel: false,
            cepNaoEncontrado: false,
            form: {
                cep: '',
                rua: '',
                bairro: '',
                cidade: '',
                estado: '',
                numero: '',
                complemento: '',
            },
            errors: {},
        };
    },
    mounted() {
        this.aplicarInitial(this.initial);
    },
    watch: {
        initial: {
            deep: true,
            handler(val) {
                this.aplicarInitial(val);
            },
        },
    },
    methods: {
        aplicarInitial(dados) {
            if (!dados) return;
            const campos = ['cep', 'rua', 'bairro', 'cidade', 'estado', 'numero', 'complemento'];
            campos.forEach((campo) => {
                if (dados[campo]) {
                    this.form[campo] = dados[campo];
                }
            });
            if (this.form.cep?.replace(/\D/g, '').length === 8) {
                this.enderecoVisivel = true;
            }
        },

        async buscarCep() {
            const cep = this.form.cep.replace(/\D/g, '');
            if (cep.length !== 8) {
                this.errors.cep = 'Informe um CEP válido com 8 dígitos';
                return;
            }

            this.loadingCep = true;
            this.errors.cep = '';
            this.cepNaoEncontrado = false;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                this.enderecoVisivel = true;

                if (data.erro) {
                    this.cepNaoEncontrado = true;
                    return;
                }

                this.form.cidade = data.localidade || '';
                this.form.estado = data.uf || '';
                this.form.rua = data.logradouro || '';
                this.form.bairro = data.bairro || '';
            } catch {
                this.enderecoVisivel = true;
                this.cepNaoEncontrado = true;
            } finally {
                this.loadingCep = false;
            }
        },

        validar() {
            this.errors = {};

            const cep = this.form.cep.replace(/\D/g, '');
            if (cep.length !== 8) {
                this.errors.cep = 'CEP inválido';
            }

            if (!this.enderecoVisivel) {
                this.errors.cep = this.errors.cep || 'Busque o CEP para continuar';
                return false;
            }

            if (!this.form.rua.trim()) {
                this.errors.rua = 'Rua é obrigatória';
            }
            if (!this.form.bairro.trim()) {
                this.errors.bairro = 'Bairro é obrigatório';
            }
            if (!this.form.cidade.trim()) {
                this.errors.cidade = 'Cidade é obrigatória';
            }
            if (!this.form.estado.trim() || this.form.estado.trim().length !== 2) {
                this.errors.estado = 'UF inválida';
            }
            if (!this.form.numero.trim()) {
                this.errors.numero = 'Número é obrigatório';
            }

            return Object.keys(this.errors).length === 0;
        },

        getDados() {
            return {
                cep: this.form.cep,
                rua: this.form.rua.trim(),
                bairro: this.form.bairro.trim(),
                cidade: this.form.cidade.trim(),
                estado: this.form.estado.trim().toUpperCase(),
                numero: this.form.numero.trim(),
                complemento: this.form.complemento?.trim() || null,
            };
        },
    },
};
</script>

<style scoped>
.endereco-form {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
}

.field label {
    color: var(--text-color);
}

@media (max-width: 768px) {
    .endereco-form {
        padding: 1.5rem;
    }
}
</style>
