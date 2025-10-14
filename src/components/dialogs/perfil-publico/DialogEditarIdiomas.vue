<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Idiomas" :style="{ width: '600px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Idiomas de Atendimento</label>
            <MultiSelect 
                v-model="idiomas" 
                :options="opcoesIdiomas" 
                optionLabel="nome" 
                optionValue="id" 
                placeholder="Selecione os idiomas" 
                class="w-full"
                :loading="loading"
                :disabled="loading"
            />
            <small class="text-500">Selecione os idiomas em que você pode atender</small>
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
    name: 'DialogEditarIdiomas',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'idiomas-atualizados'],
    data() {
        return {
            idiomas: [],
            opcoesIdiomas: [],
            loading: false
        };
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil && newPerfil.idiomas) {
                    this.idiomas = newPerfil.idiomas.map(i => i.id || i);
                }
            },
            immediate: true
        }
    },
    methods: {
        async carregarIdiomas() {
            this.loading = true;
            try {
                const idiomas = await perfilPublicoService.buscarIdiomas();
                this.opcoesIdiomas = idiomas;
            } catch (error) {
                console.error('Erro ao carregar idiomas:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar idiomas',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        async salvar() {
            try {
                await perfilPublicoService.atualizarPerfil({
                    idiomas: this.idiomas
                });
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Idiomas atualizados com sucesso',
                    life: 3000
                });
                
                this.$emit('idiomas-atualizados');
                this.$emit('update:visible', false);
            } catch (error) {
                console.error('Erro ao salvar idiomas:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar idiomas',
                    life: 3000
                });
            }
        }
    },
    mounted() {
        this.carregarIdiomas();
    }
};
</script>
