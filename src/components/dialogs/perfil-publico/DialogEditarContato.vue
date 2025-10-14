<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Contato" :style="{ width: '600px' }">
        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">WhatsApp *</label>
                    <InputText v-model="whatsapp" placeholder="(00) 00000-0000" class="w-full" @input="formatarWhatsApp" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Telefone</label>
                    <InputText v-model="telefone" placeholder="(00) 0000-0000" class="w-full" @input="formatarTelefone" />
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-500 font-medium mb-2">Email</label>
                <InputText v-model="email" placeholder="seu@email.com" class="w-full" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="salvar" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import perfilPublicoService from '@/services/perfilPublicoService';

export default {
    name: 'DialogEditarContato',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'contato-atualizado'],
    data() {
        return {
            whatsapp: '',
            telefone: '',
            email: ''
        };
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil) {
                    this.whatsapp = newPerfil.whatsapp || '';
                    this.telefone = newPerfil.telefone || '';
                    this.email = newPerfil.email || '';
                }
            },
            immediate: true
        }
    },
    methods: {
        formatarWhatsApp(event) {
            let value = event.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            this.whatsapp = value;
        },
        formatarTelefone(event) {
            let value = event.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            this.telefone = value;
        },
        async salvar() {
            try {
                await perfilPublicoService.atualizarPerfil({
                    whatsapp: this.whatsapp.replace(/\D/g, ''),
                    telefone: this.telefone.replace(/\D/g, ''),
                    email: this.email
                });
                
                this.$emit('contato-atualizado');
                this.$emit('update:visible', false);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Contato atualizado com sucesso!',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao atualizar contato:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar contato',
                    life: 3000
                });
            }
        }
    }
};
</script>
