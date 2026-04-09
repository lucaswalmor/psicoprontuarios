<template>
    <div>
        <h6 class="mb-3 text-800 font-bold">Configurar WhatsApp</h6>
        <p class="text-600 mb-4">Informe o número que será usado para conectar o WhatsApp.</p>

        <div class="mb-3">
            <label for="evolution-phone" class="form-label">Número de WhatsApp</label>
            <InputText
                id="evolution-phone"
                v-model="phoneMasked"
                class="w-full"
                placeholder="(00) 00000-0000"
                maxlength="15"
                @input="onPhoneInput"
            />
            <small v-if="errorMessage" class="p-error d-block mt-1">{{ errorMessage }}</small>
        </div>

        <small class="text-600 d-block mb-4">
            Identificador: {{ instanceName || '-' }}
        </small>

        <Button label="Salvar" icon="pi pi-save" :loading="loading" @click="handleSalvar" />
    </div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

export default {
    name: 'EvolutionForm',
    components: {
        Button,
        InputText,
    },
    props: {
        instanceName: {
            type: String,
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            phoneMasked: '',
            errorMessage: '',
        };
    },
    methods: {
        onPhoneInput() {
            const digits = this.onlyDigits(this.phoneMasked).slice(0, 11);
            this.phoneMasked = this.applyMask(digits);
            this.errorMessage = '';
        },
        onlyDigits(value) {
            return (value || '').replace(/\D/g, '');
        },
        applyMask(digits) {
            if (!digits) return '';
            if (digits.length <= 2) return `(${digits}`;
            if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
        },
        validate() {
            const digits = this.onlyDigits(this.phoneMasked);
            if (!digits) {
                this.errorMessage = 'O número de WhatsApp é obrigatório.';
                return false;
            }
            if (!/^[0-9]+$/.test(digits)) {
                this.errorMessage = 'Informe apenas números.';
                return false;
            }
            if (digits.length < 10) {
                this.errorMessage = 'Informe um número válido com DDD.';
                return false;
            }
            return true;
        },
        handleSalvar() {
            if (!this.validate()) return;
            this.$emit('salvar', this.onlyDigits(this.phoneMasked));
        },
    },
};
</script>
