<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Configurações Gerais</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Dados de contato e endereço exibidos na landing page.</p>
            </div>
            <Button
                data-tour="tour-meusite-geral-salvar"
                label="Salvar"
                icon="pi pi-check"
                :loading="salvando"
                @click="salvar"
            />
        </div>

        <Divider />

        <div class="formgrid grid mt-3">
            <!-- Slug editável -->
            <div class="field col-12">
                <label class="font-medium text-sm">Endereço do seu site (subdomínio)</label>
                <div class="flex align-items-stretch gap-2 mt-1 flex-wrap slug-host-row">
                    <div class="slug-input-wrap">
                        <InputText
                            v-model="form.slug"
                            data-tour="tour-meusite-geral-slug"
                            class="w-full"
                            placeholder="ex.: ana-silva"
                            :invalid="slugIndisponivel"
                            @blur="verificarSlug"
                        />
                    </div>
                    <span
                        class="flex align-items-center text-color-secondary text-sm px-2 border-round surface-100 shrink-0"
                    >.psicoprontuarios.com.br</span>
                </div>
                <small v-if="slugAjuda" class="block mt-1" :class="slugIndisponivel ? 'text-red-500' : 'text-color-secondary'">
                    {{ slugAjuda }}
                </small>
                <small v-else class="text-color-secondary block mt-1">
                    Apenas letras minúsculas, números e hífens. Antes de salvar, verificamos se o endereço já está em uso.
                </small>
            </div>

            <!-- CRP -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">CRP</label>
                <InputText v-model="form.crp" data-tour="tour-meusite-geral-crp" placeholder="Ex: 06/123456" class="w-full mt-1" />
            </div>

            <!-- WhatsApp -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">WhatsApp</label>
                <InputText v-model="form.whatsapp" data-tour="tour-meusite-geral-whatsapp" placeholder="(11) 9 9999-0000" class="w-full mt-1" />
            </div>

            <!-- E-mail -->
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">E-mail de contato</label>
                <InputText v-model="form.email" data-tour="tour-meusite-geral-email" placeholder="contato@exemplo.com.br" class="w-full mt-1" />
            </div>

            <!-- Endereço -->
            <div class="field col-12">
                <label class="font-medium text-sm">Endereço</label>
                <Textarea
                    v-model="form.endereco"
                    data-tour="tour-meusite-geral-endereco"
                    rows="2"
                    placeholder="Rua das Flores, 100 · Centro · São Paulo – SP"
                    class="w-full mt-1"
                    auto-resize
                />
            </div>

            <!-- Tipo de atendimento -->
            <div class="field col-12 md:col-6" data-tour="tour-meusite-geral-tipo-atendimento">
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
import Textarea from 'primevue/textarea';

export default {
    name: 'GeralTab',
    components: { Button, Divider, Dropdown, InputText, Textarea },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            salvando:           false,
            verificandoSlug:    false,
            slugAjuda:          '',
            slugIndisponivel:   false,
            form: {
                slug:              '',
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
                this.form.slug             = val.slug             ?? '';
                this.form.crp              = val.crp              ?? '';
                this.form.whatsapp         = val.whatsapp         ?? '';
                this.form.email            = val.email            ?? '';
                this.form.endereco         = val.endereco         ?? '';
                this.form.tipo_atendimento = val.tipo_atendimento ?? null;
                this.slugAjuda             = '';
                this.slugIndisponivel      = false;
            },
        },
        'form.slug'() {
            this.slugAjuda        = '';
            this.slugIndisponivel = false;
        },
    },

    methods: {
        async verificarSlug() {
            const s = String(this.form.slug ?? '').trim();
            if (!s) {
                this.slugAjuda        = 'Informe o endereço do seu site.';
                this.slugIndisponivel = true;
                return;
            }

            this.verificandoSlug = true;
            try {
                const res = await meuSiteService.checkSlug(s);
                if (res.slug && res.slug !== this.form.slug) {
                    this.form.slug = res.slug;
                }
                this.slugIndisponivel = !res.disponivel;
                this.slugAjuda       = res.disponivel
                    ? 'Este endereço está disponível.'
                    : (res.message || 'Este endereço já está em uso.');
            } catch {
                this.slugAjuda        = 'Não foi possível verificar o endereço. Tente novamente.';
                this.slugIndisponivel = false;
            } finally {
                this.verificandoSlug = false;
            }
        },

        primeiraMsgErro(errors) {
            if (!errors || typeof errors !== 'object') return null;
            const firstKey = Object.keys(errors)[0];
            const arr      = errors[firstKey];
            return Array.isArray(arr) ? arr[0] : String(arr);
        },

        async salvar() {
            const s = String(this.form.slug ?? '').trim();
            if (!s) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o endereço do seu site.', life: 4000 });
                return;
            }

            await this.verificarSlug();
            if (this.slugIndisponivel) {
                this.$toast.add({
                    severity: 'error',
                    summary:  'Endereço indisponível',
                    detail:   this.slugAjuda || 'Já existe outro psicólogo usando este endereço.',
                    life:     5000,
                });
                return;
            }

            try {
                this.salvando = true;
                const res = await meuSiteService.updateConfiguracoes(this.form);
                const slugFinal = res.slug ?? this.form.slug;
                this.form.slug = slugFinal;
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Configurações gerais atualizadas.', life: 3000 });
                this.$emit('salvo', { ...this.form, slug: slugFinal });
                this.slugAjuda        = '';
                this.slugIndisponivel = false;
            } catch (e) {
                const msg =
                    this.primeiraMsgErro(e?.response?.data?.errors)
                    ?? e?.response?.data?.message
                    ?? 'Não foi possível salvar.';
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 });
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>

<style scoped>
/* Slug: largura limitada — antes o flex-1 esticava o campo na coluna inteira */
.slug-input-wrap {
    flex: 0 1 auto;
    width: min(13rem, 100%);
    min-width: 7rem;
}
</style>
