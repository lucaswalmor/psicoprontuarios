<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Descrição" :style="{ width: '800px' }">
        <div class="p-4">
            <label class="block text-500 font-medium mb-2">Descrição do Perfil</label>
            <Editor 
                v-model="descricao" 
                editorStyle="height: 320px"
                placeholder="Descreva sua experiência, abordagem e como você pode ajudar os pacientes..."
            />
            <div class="flex justify-content-between align-items-center mt-2">
                <span class="text-sm text-500">{{ contadorCaracteres }}/1000 caracteres</span>
                <span v-if="contadorCaracteres < 200" class="text-sm text-orange-600">
                    Mínimo 200 caracteres recomendado
                </span>
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
    name: 'DialogEditarDescricao',
    props: {
        visible: { type: Boolean, default: false },
        perfil: { type: Object, default: null }
    },
    emits: ['update:visible', 'descricao-atualizada'],
    data() {
        return {
            descricao: ''
        };
    },
    computed: {
        contadorCaracteres() {
            // Remove tags HTML para contar apenas o texto
            const textoLimpo = this.descricao.replace(/<[^>]*>/g, '');
            return textoLimpo.length;
        }
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil) {
                    this.descricao = newPerfil.descricao || '';
                }
            },
            immediate: true
        }
    },
    methods: {
        async salvar() {
            // Verificar se há imagens na descrição
            const temImagem = this.descricao.includes('<img') || this.descricao.includes('<image');
            
            if (temImagem) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Imagem detectada',
                    detail: 'Por favor, remova as imagens da descrição antes de salvar.',
                    life: 5000
                });
                return;
            }

            try {
                await perfilPublicoService.atualizarPerfil({
                    descricao: this.descricao
                });
                
                this.$emit('descricao-atualizada');
                this.$emit('update:visible', false);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Descrição atualizada com sucesso!',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao atualizar descrição:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar descrição',
                    life: 3000
                });
            }
        }
    }
};
</script>
