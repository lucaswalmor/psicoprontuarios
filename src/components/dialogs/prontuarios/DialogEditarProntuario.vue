<template>
    <Dialog :visible="visible" modal header="Editar Prontuário" @update:visible="onUpdateVisible">
        <div class="row">
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <InputMask id="basic" :modelValue="prontuario.data_prontuario" @update:modelValue="prontuario.data_prontuario = $event" mask="99/99/9999" placeholder="00/00/0000" class="w-full" />
                    <label for="data_prontuario">Data do Prontuário</label>
                </div>
            </div>

            <!-- Métricas de Evolução (Opcionais) -->
            <div class="col-12 mt-4">
                <h6 class="text-500 font-semibold mb-3">Métricas de Evolução (Opcionais)</h6>
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="humor">Humor (1-10)</label>
                            <InputNumber 
                                id="humor"
                                :modelValue="prontuario.humor" 
                                @update:modelValue="validarValor('humor', $event, 1, 10)" 
                                :min="1" 
                                :max="10" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="avaliacao_progresso">Avaliação de Progresso (1-10)</label>
                            <InputNumber 
                                id="avaliacao_progresso"
                                :modelValue="prontuario.avaliacao_progresso" 
                                @update:modelValue="validarValor('avaliacao_progresso', $event, 1, 10)" 
                                :min="1" 
                                :max="10" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="escala_ansiedade">Escala de Ansiedade - GAD-7 (0-21)</label>
                            <InputNumber 
                                id="escala_ansiedade"
                                :modelValue="prontuario.escala_ansiedade" 
                                @update:modelValue="validarValor('escala_ansiedade', $event, 0, 21)" 
                                :min="0" 
                                :max="21" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="flex flex-column gap-2">
                            <label for="escala_depressao">Escala de Depressão - PHQ-9 (0-27)</label>
                            <InputNumber 
                                id="escala_depressao"
                                :modelValue="prontuario.escala_depressao" 
                                @update:modelValue="validarValor('escala_depressao', $event, 0, 27)" 
                                :min="0" 
                                :max="27" 
                                :showButtons="true"
                                :useGrouping="false"
                                class="w-full" 
                                placeholder="Opcional" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 mt-2">
                <label class="block text-500 font-medium mb-2">Descrição *</label>
                <Message severity="warn" class="mb-3" :closable="false">
                    Por privacidade, não inclua o nome nem outros dados que identifiquem o paciente neste texto. Prefira expressões como "o paciente" ou "a pessoa atendida".
                </Message>
                <Editor :modelValue="prontuario.descricao" @update:modelValue="prontuario.descricao = $event" editorStyle="height: 320px" />
            </div>

            <div v-if="erroSalvar" class="col-12 mt-2">
                <Message severity="error" :closable="true" @close="erroSalvar = null">
                    {{ erroSalvar }}
                </Message>
            </div>

            <div class="col-12 mt-2 d-flex gap-2 justify-content-end">
                <Button label="Cancelar" severity="secondary" @click="onUpdateVisible(false)" />
                <Button label="Salvar" severity="success" @click="salvarProntuario" />
            </div>
        </div>
        <Toast />
    </Dialog>
</template>
<script>
import { Toast } from 'primevue';


export default {
    name: 'DialogEditarProntuario',
    components: {
        Toast,
        Dialog: () => import('primevue/dialog'),
        InputMask: () => import('primevue/inputmask'),
        InputNumber: () => import('primevue/inputnumber'),
        Editor: () => import('primevue/editor'),
        Button: () => import('primevue/button'),
        Message: () => import('primevue/message')
    },
    props: {
        prontuario: {
            type: Object,
            default: null
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.erroSalvar = null;
            }
        },
    },
    data() {
        return {
            erroSalvar: null,
        }
    },
    methods: {
        onUpdateVisible(visible) {
            this.$emit('update:visible', visible)
        },
        validarValor(campo, valor, min, max) {
            // Se o valor for null ou undefined, permite (campo opcional)
            if (valor === null || valor === undefined) {
                this.prontuario[campo] = null;
                return;
            }
            
            // Converte para número
            const numValor = Number(valor);
            
            // Se não for um número válido, define como null
            if (isNaN(numValor)) {
                this.prontuario[campo] = null;
                return;
            }
            
            // Limita o valor entre min e max
            if (numValor < min) {
                this.prontuario[campo] = min;
            } else if (numValor > max) {
                this.prontuario[campo] = max;
            } else {
                this.prontuario[campo] = Math.round(numValor); // Garante que é inteiro
            }
        },
        mensagemErroApi(err) {
            const data = err.response?.data;
            if (data && typeof data.error === 'string') {
                return data.error;
            }
            if (data && typeof data.message === 'string') {
                return data.message;
            }
            return 'Não foi possível salvar. Verifique os dados e tente novamente.';
        },
        salvarProntuario() {
            this.erroSalvar = null;

            const data = {
                data_prontuario: this.prontuario.data_prontuario,
                descricao: this.prontuario.descricao,
                humor: this.prontuario.humor !== null && this.prontuario.humor !== undefined ? this.prontuario.humor : null,
                avaliacao_progresso: this.prontuario.avaliacao_progresso !== null && this.prontuario.avaliacao_progresso !== undefined ? this.prontuario.avaliacao_progresso : null,
                escala_ansiedade: this.prontuario.escala_ansiedade !== null && this.prontuario.escala_ansiedade !== undefined ? this.prontuario.escala_ansiedade : null,
                escala_depressao: this.prontuario.escala_depressao !== null && this.prontuario.escala_depressao !== undefined ? this.prontuario.escala_depressao : null,
            }

            this.$prontuariosService.update(this.prontuario.id, data).then((res) => {
                this.erroSalvar = null;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso!",
                    detail: res.success,
                    life: 3000,
                });
                this.$emit('salvarProntuario');
                this.onUpdateVisible(false);
            }).catch((err) => {
                console.log(err);
                this.erroSalvar = this.mensagemErroApi(err);
            });
        }
    },
}
</script>
<style></style>