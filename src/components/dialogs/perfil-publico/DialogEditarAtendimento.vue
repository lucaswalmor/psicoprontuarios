<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal :header="tituloDialog" :style="{ width: '600px' }">
        <div class="p-4">
            <!-- Tipo de Atendimento -->
            <div v-if="campoEdicao === 'tipo_atendimento' || campoEdicao === 'todos'" class="mb-4">
                <label class="block text-500 font-medium mb-2">Tipo de Atendimento</label>
                <MultiSelect 
                    v-model="tipoAtendimento" 
                    :options="tiposAtendimento" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Selecione os tipos" 
                    class="w-full" 
                    :maxSelectedLabels="3"
                    selectedItemsLabel="{0} tipos selecionados"
                />
            </div>

            <!-- Público-alvo -->
            <div v-if="campoEdicao === 'publico_alvo' || campoEdicao === 'todos'" class="mb-4">
                <label class="block text-500 font-medium mb-2">Público-alvo</label>
                <MultiSelect 
                    v-model="publicoAlvo" 
                    :options="publicosAlvo" 
                    optionLabel="label" 
                    optionValue="value"
                    placeholder="Selecione os públicos" 
                    class="w-full" 
                    :maxSelectedLabels="3"
                    selectedItemsLabel="{0} públicos selecionados"
                />
            </div>

            <!-- Valores -->
            <div v-if="campoEdicao === 'valores' || campoEdicao === 'todos'" class="grid">
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Valor Mínimo (R$)</label>
                    <InputNumber v-model="valorMinimo" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
                </div>
                <div class="col-12 md:col-6">
                    <label class="block text-500 font-medium mb-2">Valor Máximo (R$)</label>
                    <InputNumber v-model="valorMaximo" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
                </div>
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
    name: 'DialogEditarAtendimento',
    props: { 
        visible: { type: Boolean, default: false }, 
        perfil: { type: Object, default: null },
        campoEdicao: { type: String, default: 'todos' } // 'tipo_atendimento', 'publico_alvo', 'valores', 'todos'
    },
    emits: ['update:visible', 'atendimento-atualizado'],
    data() {
        return {
            tipoAtendimento: [],
            publicoAlvo: [],
            valorMinimo: null,
            valorMaximo: null,
            tiposAtendimento: [
                { label: 'Presencial', value: 'presencial' },
                { label: 'Online', value: 'online' },
                { label: 'Híbrido', value: 'híbrido' }
            ],
            publicosAlvo: [
                { label: 'Crianças', value: 'crianças' },
                { label: 'Adolescentes', value: 'adolescentes' },
                { label: 'Adultos', value: 'adultos' },
                { label: 'Casais', value: 'casais' },
                { label: 'Idosos', value: 'idosos' }
            ]
        };
    },
    computed: {
        tituloDialog() {
            switch (this.campoEdicao) {
                case 'tipo_atendimento':
                    return 'Editar Tipo de Atendimento';
                case 'publico_alvo':
                    return 'Editar Público-alvo';
                case 'valores':
                    return 'Editar Valores';
                default:
                    return 'Editar Atendimento';
            }
        }
    },
    watch: {
        perfil: {
            handler(newPerfil) {
                if (newPerfil) {
                    // Tipo de atendimento - pode ser string ou array
                    if (Array.isArray(newPerfil.tipo_atendimento)) {
                        this.tipoAtendimento = newPerfil.tipo_atendimento;
                    } else if (newPerfil.tipo_atendimento) {
                        this.tipoAtendimento = [newPerfil.tipo_atendimento];
                    } else {
                        this.tipoAtendimento = [];
                    }

                    // Público-alvo - pode ser string ou array
                    if (Array.isArray(newPerfil.publico_alvo)) {
                        this.publicoAlvo = newPerfil.publico_alvo;
                    } else if (newPerfil.publico_alvo) {
                        this.publicoAlvo = [newPerfil.publico_alvo];
                    } else {
                        this.publicoAlvo = [];
                    }

                    this.valorMinimo = newPerfil.valor_minimo;
                    this.valorMaximo = newPerfil.valor_maximo;
                }
            },
            immediate: true
        }
    },
    methods: {
        async salvar() {
            try {
                const dadosAtualizacao = {};
                
                if (this.campoEdicao === 'tipo_atendimento' || this.campoEdicao === 'todos') {
                    dadosAtualizacao.tipo_atendimento = this.tipoAtendimento;
                }
                
                if (this.campoEdicao === 'publico_alvo' || this.campoEdicao === 'todos') {
                    dadosAtualizacao.publico_alvo = this.publicoAlvo;
                }
                
                if (this.campoEdicao === 'valores' || this.campoEdicao === 'todos') {
                    dadosAtualizacao.valor_minimo = this.valorMinimo;
                    dadosAtualizacao.valor_maximo = this.valorMaximo;
                }

                await perfilPublicoService.atualizarPerfil(dadosAtualizacao);
                
                this.$emit('atendimento-atualizado');
                this.$emit('update:visible', false);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Informações atualizadas com sucesso!',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao atualizar atendimento:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar informações',
                    life: 3000
                });
            }
        }
    }
};
</script>
