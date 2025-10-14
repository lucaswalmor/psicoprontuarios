<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Temas" :style="{ width: '600px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Temas que Trabalha</label>
            <MultiSelect 
                v-model="temas" 
                :options="opcoesTemas" 
                optionLabel="nome" 
                optionValue="id" 
                placeholder="Selecione os temas" 
                class="w-full"
                :loading="loading"
                :disabled="loading"
            />
            <small class="text-500">Mínimo 3 temas recomendado para melhor posicionamento</small>
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
    name: 'DialogEditarTemas',
    props: { visible: { type: Boolean, default: false }, perfil: { type: Object, default: null } },
    emits: ['update:visible', 'temas-atualizados'],
    data() {
        return {
            temas: [],
            opcoesTemas: [],
            loading: false
        };
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil && newPerfil.temas) {
                    this.temas = newPerfil.temas.map(t => t.id || t);
                }
            },
            immediate: true
        }
    },
    methods: {
        async carregarTemas() {
            this.loading = true;
            try {
                const temas = await perfilPublicoService.buscarTemas();
                this.opcoesTemas = temas;
            } catch (error) {
                console.error('Erro ao carregar temas:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar temas',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },
        async salvar() {
            try {
                await perfilPublicoService.atualizarPerfil({
                    temas: this.temas
                });
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Temas atualizados com sucesso',
                    life: 3000
                });
                
                this.$emit('temas-atualizados');
                this.$emit('update:visible', false);
            } catch (error) {
                console.error('Erro ao salvar temas:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar temas',
                    life: 3000
                });
            }
        }
    },
    mounted() {
        this.carregarTemas();
    }
};
</script>
