<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        header="Editar CRP" 
        :style="{ width: '400px' }"
        class="p-fluid"
    >
        <div class="field">
            <label for="crp" class="font-bold">CRP</label>
            <InputText 
                id="crp"
                v-model="form.crp" 
                placeholder="Ex: 00/123456"
                :class="{ 'p-invalid': errors.crp }"
            />
            <small v-if="errors.crp" class="p-error">{{ errors.crp }}</small>
            <small class="text-500">Digite seu número de registro no Conselho Regional de Psicologia</small>
        </div>

        <template #footer>
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                @click="$emit('update:visible', false)" 
                severity="secondary" 
            />
            <Button 
                label="Salvar" 
                icon="pi pi-check" 
                @click="salvar" 
                :loading="loading"
            />
        </template>
    </Dialog>
</template>

<script>
import userService from '@/services/userService';

export default {
    name: 'DialogEditarCrp',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        psicologo: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            form: {
                crp: ''
            },
            errors: {}
        };
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.carregarDados();
            }
        }
    },
    methods: {
        carregarDados() {
            this.form.crp = this.psicologo?.crp || '';
            this.errors = {};
        },
        async salvar() {
            this.loading = true;
            this.errors = {};

            try {
                // Validação básica
                if (!this.form.crp.trim()) {
                    this.errors.crp = 'CRP é obrigatório';
                }

                if (Object.keys(this.errors).length > 0) {
                    return;
                }

                await userService.updateProfile({
                    crp: this.form.crp.trim()
                });

                this.$emit('crp-atualizado');
                this.$emit('update:visible', false);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'CRP atualizado com sucesso!',
                    life: 3000
                });

            } catch (error) {
                console.error('Erro ao atualizar CRP:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar CRP',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
