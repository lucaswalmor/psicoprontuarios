<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        header="Editar Nome Completo" 
        :style="{ width: '450px' }"
        class="p-fluid"
    >
        <div class="field">
            <label for="nome" class="font-bold">Nome</label>
            <InputText 
                id="nome"
                v-model="form.nome" 
                placeholder="Digite seu nome"
                :class="{ 'p-invalid': errors.nome }"
            />
            <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
        </div>

        <div class="field">
            <label for="sobrenome" class="font-bold">Sobrenome</label>
            <InputText 
                id="sobrenome"
                v-model="form.sobrenome" 
                placeholder="Digite seu sobrenome"
                :class="{ 'p-invalid': errors.sobrenome }"
            />
            <small v-if="errors.sobrenome" class="p-error">{{ errors.sobrenome }}</small>
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
    name: 'DialogEditarNome',
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
                nome: '',
                sobrenome: ''
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
            this.form.nome = this.psicologo?.nome || '';
            this.form.sobrenome = this.psicologo?.sobrenome || '';
            this.errors = {};
        },
        async salvar() {
            this.loading = true;
            this.errors = {};

            try {
                // Validação básica
                if (!this.form.nome.trim()) {
                    this.errors.nome = 'Nome é obrigatório';
                }
                if (!this.form.sobrenome.trim()) {
                    this.errors.sobrenome = 'Sobrenome é obrigatório';
                }

                if (Object.keys(this.errors).length > 0) {
                    return;
                }

                await userService.updateProfile({
                    nome: this.form.nome.trim(),
                    sobrenome: this.form.sobrenome.trim()
                });

                this.$emit('nome-atualizado');
                this.$emit('update:visible', false);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Nome atualizado com sucesso!',
                    life: 3000
                });

            } catch (error) {
                console.error('Erro ao atualizar nome:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar nome',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
