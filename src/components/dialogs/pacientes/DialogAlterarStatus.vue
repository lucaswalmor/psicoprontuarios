<template>
    <Dialog :visible="visible" modal header="Alterar Status de Tratamento" :style="{ width: '450px' }"
        :closable="true" @hide="onHide">
        <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
                <label for="status" class="font-medium">Status de Tratamento</label>
                <Select
                    v-model="statusSelecionado"
                    :options="opcoesStatus"
                    placeholder="Selecione o status"
                    class="w-full"
                    :loading="loading"
                />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="onHide" />
                <Button label="Salvar" @click="salvarStatus" :loading="loading" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogAlterarStatus',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        paciente: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            statusSelecionado: null,
            loading: false,
            opcoesStatus: ['Em Andamento', 'Concluído', 'Recesso']
        };
    },
    watch: {
        visible(newValue) {
            if (newValue && this.paciente) {
                this.statusSelecionado = this.paciente.status_tratamento;
            }
        }
    },
    methods: {
        async salvarStatus() {
            if (!this.statusSelecionado) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Selecione um status',
                    life: 3000
                });
                return;
            }

            try {
                this.loading = true;
                
                // Obter ID do usuário logado do sessionStorage como na v1
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || '{}');
                
                await this.$pacientesService.alterarStatus(
                    this.paciente.id,
                    this.statusSelecionado,
                    usuarioLogado.usuario?.id || usuarioLogado.id
                );

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Status alterado com sucesso',
                    life: 3000
                });

                this.$emit('status-alterado');
                this.onHide();
            } catch (error) {
                console.error('Erro ao alterar status:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.response?.data?.error || 'Erro ao alterar status',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        onHide() {
            this.statusSelecionado = null;
            this.$emit('update:visible', false);
        }
    }
};
</script> 