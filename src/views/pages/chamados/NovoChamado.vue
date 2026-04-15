<script>
export default {
    name: 'NovoChamado',
    data() {
        return {
            loading: false,
            temas: [],
            form: {
                tema_suporte_id: null,
                titulo: '',
                mensagem: '',
                prioridade: null,
                anexo: null
            },
            prioridadeOptions: [
                { label: 'Baixa', value: 'baixa' },
                { label: 'Média', value: 'media' },
                { label: 'Alta', value: 'alta' }
            ]
        };
    },
    mounted() {
        this.carregarTemas();
    },
    methods: {
        async carregarTemas() {
            try {
                const response = await this.$chamadosService.listarTemas();
                this.temas = response.data || [];
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os temas de suporte.',
                    life: 3000
                });
            }
        },
        onSelectFile(event) {
            this.form.anexo = event?.target?.files?.[0] || null;
        },
        async salvar() {
            if (!this.form.tema_suporte_id || !this.form.titulo.trim() || !this.form.mensagem.trim()) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Preencha tema, título e mensagem.',
                    life: 3000
                });
                return;
            }

            this.loading = true;
            try {
                const response = await this.$chamadosService.criar(this.form);
                const chamadoId = response?.data?.id;

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Chamado criado com sucesso.',
                    life: 3000
                });

                if (chamadoId) {
                    this.$router.push(`/chamados/${chamadoId}`);
                } else {
                    this.$router.push('/chamados');
                }
            } catch (error) {
                const message = error?.response?.data?.message || error?.response?.data?.errors?.message || 'Erro ao abrir chamado.';
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: Array.isArray(message) ? message[0] : message,
                    life: 3500
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<template>
    <div class="card">
        <div class="header-row">
            <h1 class="page-title">Novo Chamado</h1>
            <Button text icon="pi pi-arrow-left" label="Voltar" @click="$router.push('/chamados')" />
        </div>

        <div class="form-grid">
            <div class="field">
                <label for="tema">Tema</label>
                <Select
                    id="tema"
                    v-model="form.tema_suporte_id"
                    :options="temas"
                    optionLabel="nome"
                    optionValue="id"
                    placeholder="Selecione o tema"
                    fluid
                />
            </div>

            <div class="field">
                <label for="titulo">Título</label>
                <InputText id="titulo" v-model="form.titulo" maxlength="255" fluid />
            </div>

            <div class="field full-width">
                <label for="mensagem">Mensagem</label>
                <Textarea id="mensagem" v-model="form.mensagem" rows="6" autoResize fluid />
            </div>

            <div class="field full-width">
                <label for="anexo">Anexo (opcional)</label>
                <input id="anexo" type="file" class="p-inputtext p-component w-full" @change="onSelectFile" />
            </div>
        </div>

        <div class="actions-row">
            <Button label="Cancelar" severity="secondary" text @click="$router.push('/chamados')" />
            <Button label="Abrir Chamado" icon="pi pi-send" :loading="loading" @click="salvar" />
        </div>
    </div>
</template>

<style scoped>
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.full-width {
    grid-column: 1 / -1;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.actions-row {
    margin-top: 1.25rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
