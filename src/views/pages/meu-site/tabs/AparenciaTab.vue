<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Aparência</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Personalize as cores da sua landing page.</p>
            </div>
            <Button label="Salvar cores" icon="pi pi-check" :loading="salvando" @click="salvar" />
        </div>

        <Divider />

        <div class="grid mt-3">
            <div class="col-12 md:col-6 lg:col-4" v-for="cor in coresConfig" :key="cor.campo">
                <div class="field">
                    <label class="font-medium text-sm block mb-1">{{ cor.label }}</label>
                    <p class="text-color-secondary text-xs m-0 mb-2">{{ cor.descricao }}</p>
                    <div class="flex align-items-center gap-2">
                        <input
                            type="color"
                            :value="form[cor.campo]"
                            @input="form[cor.campo] = $event.target.value"
                            class="color-picker"
                        />
                        <InputText
                            v-model="form[cor.campo]"
                            :placeholder="cor.padrao"
                            class="flex-1 font-mono text-sm"
                            maxlength="7"
                        />
                        <div
                            class="color-preview border-round"
                            :style="{ background: form[cor.campo] }"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';

export default {
    name: 'AparenciaTab',
    components: { Button, Divider, InputText },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            salvando: false,
            form: {
                cor_sage:       '#7A9E87',
                cor_sage_light: '#A8C4B0',
                cor_sage_pale:  '#E8F0EA',
                cor_sand:       '#C8B89A',
                cor_sand_light: '#EDE4D6',
                cor_sand_pale:  '#FAF7F2',
                cor_bark:       '#5C4A35',
                cor_ink:        '#1E2820',
                cor_mist:       '#F4F1EC',
                cor_white:      '#FDFCFA',
            },
            coresConfig: [
                { campo: 'cor_sage',       label: 'Cor principal',       descricao: 'Botões, destaques e ícones',         padrao: '#7A9E87' },
                { campo: 'cor_sage_light', label: 'Cor principal clara',  descricao: 'Versão mais clara da cor principal', padrao: '#A8C4B0' },
                { campo: 'cor_sage_pale',  label: 'Cor principal pálida', descricao: 'Fundos sutis e badges',              padrao: '#E8F0EA' },
                { campo: 'cor_sand',       label: 'Cor areia',            descricao: 'Elementos neutros e bordas',         padrao: '#C8B89A' },
                { campo: 'cor_sand_light', label: 'Cor areia clara',      descricao: 'Bordas e divisores sutis',           padrao: '#EDE4D6' },
                { campo: 'cor_sand_pale',  label: 'Cor areia pálida',     descricao: 'Fundo de seções alternadas leves',   padrao: '#FAF7F2' },
                { campo: 'cor_bark',       label: 'Cor texto secundário', descricao: 'Subtítulos e parágrafos',            padrao: '#5C4A35' },
                { campo: 'cor_ink',        label: 'Cor texto principal',  descricao: 'Headers e títulos',                  padrao: '#1E2820' },
                { campo: 'cor_mist',       label: 'Fundo seções',         descricao: 'Fundo de seções alternadas',         padrao: '#F4F1EC' },
                { campo: 'cor_white',      label: 'Fundo geral',          descricao: 'Cor de fundo da página',             padrao: '#FDFCFA' },
            ],
        };
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (!val) return;
                Object.keys(this.form).forEach((campo) => {
                    if (val[campo]) this.form[campo] = val[campo];
                });
            },
        },
    },

    methods: {
        async salvar() {
            try {
                this.salvando = true;
                await meuSiteService.updateCores(this.form);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Cores atualizadas com sucesso.', life: 3000 });
                this.$emit('salvo', this.form);
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar as cores.', life: 4000 });
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>

<style scoped>
.color-picker {
    width: 40px;
    height: 40px;
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    padding: 2px;
    cursor: pointer;
    background: transparent;
    flex-shrink: 0;
}

.color-preview {
    width: 36px;
    height: 36px;
    border: 1px solid var(--surface-border);
    flex-shrink: 0;
}
</style>
