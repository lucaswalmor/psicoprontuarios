<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Configurações Gerais</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Dados de contato e endereço exibidos na landing page.</p>
            </div>
            <Button label="Salvar" icon="pi pi-check" :loading="salvando" @click="salvar" />
        </div>

        <Divider />

        <div class="formgrid grid mt-3">
            <!-- Slug (somente leitura) -->
            <div class="field col-12">
                <label class="font-medium text-sm">Endereço do seu site</label>
                <div class="flex align-items-center gap-2 mt-1 slug-display">
                    <i class="pi pi-globe text-color-secondary" />
                    <span class="text-color-secondary text-sm">psicoprontuarios.com.br/</span>
                    <span class="font-medium text-primary">{{ slugExibido }}</span>
                    <Tag value="Fixo" severity="secondary" class="ml-1" style="font-size:.7rem" />
                </div>
                <small class="text-color-secondary">Gerado automaticamente a partir do seu nome. Não pode ser alterado.</small>
            </div>

            <!-- CRP -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">CRP</label>
                <InputText v-model="form.crp" placeholder="Ex: 06/123456" class="w-full mt-1" />
            </div>

            <!-- WhatsApp -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">WhatsApp</label>
                <InputText v-model="form.whatsapp" placeholder="(11) 9 9999-0000" class="w-full mt-1" />
            </div>

            <!-- E-mail -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">E-mail de contato</label>
                <InputText v-model="form.email" placeholder="contato@exemplo.com.br" class="w-full mt-1" />
            </div>

            <!-- Endereço -->
            <div class="field col-12">
                <label class="font-medium text-sm">Endereço</label>
                <Textarea v-model="form.endereco" rows="2" placeholder="Rua das Flores, 100 · Centro · São Paulo – SP" class="w-full mt-1" auto-resize />
            </div>

            <!-- Tipo de atendimento -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">Tipo de atendimento</label>
                <Dropdown
                    v-model="form.tipo_atendimento"
                    :options="tiposAtendimento"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecione..."
                    class="w-full mt-1"
                />
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

export default {
    name: 'GeralTab',
    components: { Button, Divider, Dropdown, InputText, Tag, Textarea },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            salvando:    false,
            slugExibido: '',
            form: {
                crp:               '',
                whatsapp:          '',
                email:             '',
                endereco:          '',
                tipo_atendimento:  null,
            },
            tiposAtendimento: [
                { label: 'Online',               value: 0 },
                { label: 'Presencial',           value: 1 },
                { label: 'Online e Presencial',  value: 2 },
            ],
        };
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.slugExibido           = val.slug             ?? '';
                this.form.crp              = val.crp              ?? '';
                this.form.whatsapp         = val.whatsapp         ?? '';
                this.form.email            = val.email            ?? '';
                this.form.endereco         = val.endereco         ?? '';
                this.form.tipo_atendimento = val.tipo_atendimento ?? null;
            },
        },
    },

    methods: {
        async salvar() {
            try {
                this.salvando = true;
                await meuSiteService.updateConfiguracoes(this.form);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Configurações gerais atualizadas.', life: 3000 });
                this.$emit('salvo', this.form);
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar.', life: 4000 });
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>
