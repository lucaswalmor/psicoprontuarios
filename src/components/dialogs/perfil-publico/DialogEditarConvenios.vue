<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Convênios" :style="{ width: '600px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Convênios Aceitos</label>
            <MultiSelect 
                v-model="convenios" 
                :options="opcoesConvenios" 
                optionLabel="nome" 
                optionValue="id" 
                placeholder="Selecione os convênios aceitos" 
                class="w-full"
                :loading="loading"
                :disabled="loading"
            />
            <small class="text-500">Selecione os convênios que você aceita para atendimento</small>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" :disabled="loading" />
                <Button label="Salvar" icon="pi pi-check" @click="salvar" :loading="loading" />
            </div>
        </template>
    </Dialog>
</template>

<script>
import perfilPublicoService from '@/services/perfilPublicoService';

export default {
    name: 'DialogEditarConvenios',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'convenios-atualizados'],
    data() {
        return {
            convenios: [],
            opcoesConvenios: [],
            loading: false
        };
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil && newPerfil.convenios) {
                    this.convenios = newPerfil.convenios.map(c => c.id || c);
                }
            },
            immediate: true
        }
    },
    methods: {
        async carregarConvenios() {
            this.loading = true;
            try {
                const convenios = await perfilPublicoService.buscarConvenios();
                this.opcoesConvenios = convenios;
            } catch (error) {
                console.error('Erro ao carregar convênios:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar convênios',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        async salvar() {
            try {
                await perfilPublicoService.atualizarPerfil({
                    convenios: this.convenios
                });
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Convênios atualizados com sucesso',
                    life: 3000
                });
                
                this.$emit('convenios-atualizados');
                this.$emit('update:visible', false);
            } catch (error) {
                console.error('Erro ao salvar convênios:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar convênios',
                    life: 3000
                });
            }
        }
    },
    mounted() {
        this.carregarConvenios();
    }
};
</script>
