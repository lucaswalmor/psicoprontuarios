<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        :closable="false"
        :dismissableMask="false"
        :style="{ width: '500px' }"
        class="nps-dialog"
    >
        <template #header>
            <div class="flex align-items-center gap-2">
                <i class="pi pi-star-fill text-primary text-xl"></i>
                <h4 class="m-0 text-800">Pesquisa de Satisfação</h4>
            </div>
        </template>

        <div class="nps-content">
            <div class="text-center mb-4">
                <p class="text-600 mb-2">
                    Como você avalia nossa plataforma?
                </p>
                <p class="text-500 text-sm">
                    Sua opinião é muito importante para nós!
                </p>
            </div>

            <!-- Seleção de Nota -->
            <div class="nota-selection mb-4">
                <div class="flex justify-content-center gap-2 mb-3">
                    <button 
                        v-for="nota in notas" 
                        :key="nota"
                        :class="['nota-button', { 'selected': notaSelecionada === nota }]"
                        @click="selecionarNota(nota)"
                    >
                        {{ nota }}
                    </button>
                </div>
                
                <div class="flex justify-content-between text-xs text-500">
                    <span>Muito Insatisfeito</span>
                    <span>Muito Satisfeito</span>
                </div>
            </div>

            <!-- Textarea para Descrição (aparece após selecionar nota) -->
            <div v-if="notaSelecionada" class="descricao-section">
                <label class="block text-600 font-medium mb-2">
                    Comentários (opcional)
                </label>
                <Textarea 
                    v-model="descricao"
                    placeholder="Conte-nos mais sobre sua experiência..."
                    :rows="3"
                    class="w-full"
                />
            </div>
        </div>

        <template #footer>
            <div v-if="notaSelecionada" class="flex justify-content-end gap-2">
                <Button 
                    label="Cancelar" 
                    severity="secondary" 
                    outlined 
                    @click="cancelar"
                />
                <Button 
                    label="Salvar" 
                    :loading="salvando"
                    @click="salvar"
                />
            </div>
        </template>
    </Dialog>
</template>

<script>
import { useToast } from 'primevue/usetoast';

export default {
    name: 'DialogNps',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:visible', 'success'],
    data() {
        return {
            notaSelecionada: null,
            descricao: '',
            salvando: false,
            notas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        };
    },
    methods: {
        selecionarNota(nota) {
            this.notaSelecionada = nota;
        },

        async salvar() {
            if (!this.notaSelecionada) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Atenção',
                    detail: 'Por favor, selecione uma nota',
                    life: 3000
                });
                return;
            }

            try {
                this.salvando = true;

                const dadosPesquisa = {
                    nota: this.notaSelecionada,
                    descricao: this.descricao || null
                };

                await this.$npsService.salvarPesquisa(dadosPesquisa);

                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Obrigado pela sua avaliação!',
                    life: 3000
                });

                this.$emit('success');
                this.fecharDialog();

            } catch (error) {
                console.error('Erro ao salvar pesquisa NPS:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar sua avaliação. Tente novamente.',
                    life: 3000
                });
            } finally {
                this.salvando = false;
            }
        },

        cancelar() {
            this.fecharDialog();
        },

        fecharDialog() {
            this.$emit('update:visible', false);
            this.resetarFormulario();
        },

        resetarFormulario() {
            this.notaSelecionada = null;
            this.descricao = '';
            this.salvando = false;
        }
    },
    setup() {
        const toast = useToast();
        
        return {
            toast
        };
    }
};
</script>

<style scoped>
.nps-dialog :deep(.p-dialog-header) {
    border-bottom: 1px solid var(--surface-border);
    padding: 1.5rem 1.5rem 1rem 1.5rem;
}

.nps-dialog :deep(.p-dialog-content) {
    padding: 1.5rem;
}

.nps-dialog :deep(.p-dialog-footer) {
    border-top: 1px solid var(--surface-border);
    padding: 1rem 1.5rem 1.5rem 1.5rem;
}

.nps-content {
    min-height: 200px;
}

.nota-selection {
    padding: 1rem 0;
}

.nota-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid var(--surface-border);
    background: var(--surface-card);
    color: var(--text-color);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nota-button:hover {
    border-color: var(--primary-color);
    background: var(--primary-50);
    transform: scale(1.05);
}

.nota-button.selected {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
    transform: scale(1.1);
}

.descricao-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--surface-border);
}

/* Animações */
.nota-button {
    animation: fadeInUp 0.3s ease forwards;
}

.nota-button:nth-child(1) { animation-delay: 0.05s; }
.nota-button:nth-child(2) { animation-delay: 0.1s; }
.nota-button:nth-child(3) { animation-delay: 0.15s; }
.nota-button:nth-child(4) { animation-delay: 0.2s; }
.nota-button:nth-child(5) { animation-delay: 0.25s; }
.nota-button:nth-child(6) { animation-delay: 0.3s; }
.nota-button:nth-child(7) { animation-delay: 0.35s; }
.nota-button:nth-child(8) { animation-delay: 0.4s; }
.nota-button:nth-child(9) { animation-delay: 0.45s; }
.nota-button:nth-child(10) { animation-delay: 0.5s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.descricao-section {
    animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
