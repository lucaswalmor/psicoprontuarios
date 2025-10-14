<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Localização" :style="{ width: '600px' }">
        <div class="p-4">
            <div class="grid">
                <div class="col-12 md:col-4">
                    <label class="block text-500 font-medium mb-2">CEP</label>
                    <div class="relative">
                        <InputText 
                            v-model="cep" 
                            placeholder="00000-000" 
                            class="w-full" 
                            @input="formatarCep"
                            @blur="buscarCep"
                            :disabled="loading"
                        />
                        <i v-if="loading" class="pi pi-spin pi-spinner absolute right-3 top-50 text-500" style="transform: translateY(-50%);"></i>
                    </div>
                </div>
                <div class="col-12 md:col-4">
                    <label class="block text-500 font-medium mb-2">Cidade</label>
                    <InputText v-model="cidade" placeholder="Sua cidade" class="w-full" />
                </div>
                <div class="col-12 md:col-4">
                    <label class="block text-500 font-medium mb-2">Estado</label>
                    <InputText v-model="estado" placeholder="UF" class="w-full" />
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-500 font-medium mb-2">Endereço</label>
                <InputText v-model="endereco" placeholder="Endereço completo" class="w-full" />
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
    name: 'DialogEditarLocalizacao',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'localizacao-atualizada'],
    data() {
        return {
            cep: '',
            cidade: '',
            estado: '',
            endereco: '',
            loading: false
        };
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil) {
                    this.cep = newPerfil.cep || '';
                    this.cidade = newPerfil.cidade || '';
                    this.estado = newPerfil.estado || '';
                    this.endereco = newPerfil.endereco || '';
                }
            },
            immediate: true
        }
    },
    methods: {
        formatarCep(event) {
            let value = event.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            this.cep = value;
        },
        async buscarCep() {
            const cepLimpo = this.cep.replace(/\D/g, '');
            
            if (cepLimpo.length === 8) {
                this.loading = true;
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        this.cidade = data.localidade;
                        this.estado = data.uf;
                        this.endereco = `${data.logradouro}, ${data.bairro}`;
                    } else {
                        this.$toast.add({
                            severity: 'warn',
                            summary: 'CEP não encontrado',
                            detail: 'Verifique o CEP digitado',
                            life: 3000
                        });
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao buscar CEP',
                        life: 3000
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
        async salvar() {
            try {
                await perfilPublicoService.atualizarPerfil({
                    cep: this.cep,
                    cidade: this.cidade,
                    estado: this.estado,
                    endereco: this.endereco
                });
                
                this.$emit('localizacao-atualizada');
                this.$emit('update:visible', false);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Localização atualizada com sucesso!',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao atualizar localização:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar localização',
                    life: 3000
                });
            }
        }
    }
};
</script>
