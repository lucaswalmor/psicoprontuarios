<template>
    <div class="p-4">
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Textos da Página</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Conteúdo exibido nas seções da sua landing page.</p>
            </div>
            <Button
                data-tour="tour-meusite-textos-salvar"
                label="Salvar textos"
                icon="pi pi-check"
                :loading="salvando"
                @click="salvar"
            />
        </div>

        <Divider />

        <!-- Seção Hero -->
        <div class="mt-4 mb-2">
            <span class="text-xs font-semibold text-color-secondary uppercase letter-spacing-1">
                <i class="pi pi-star mr-1" /> Seção principal (Hero)
            </span>
        </div>
        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">Nome exibido na navegação</label>
                <InputText v-model="form.nav_nome" data-tour="tour-meusite-textos-nav-nome" placeholder="Dra. Ana Lima" class="w-full mt-1" />
            </div>
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">Eyebrow <span class="text-color-secondary text-xs">(linha acima do título)</span></label>
                <InputText v-model="form.hero_eyebrow" data-tour="tour-meusite-textos-hero-eyebrow" placeholder="CRP 06/123456" class="w-full mt-1" />
            </div>
            <div class="field col-12">
                <label class="font-medium text-sm">Título principal</label>
                <InputText v-model="form.hero_titulo" data-tour="tour-meusite-textos-hero-titulo" placeholder="Cuide da sua saúde mental..." class="w-full mt-1" />
            </div>
            <div class="field col-12">
                <label class="font-medium text-sm">Subtítulo</label>
                <InputText v-model="form.hero_subtitulo" data-tour="tour-meusite-textos-hero-subtitulo" placeholder="Atendimento humanizado..." class="w-full mt-1" />
            </div>
            <div class="field col-12">
                <label class="font-medium text-sm">Descrição</label>
                <Textarea
                    v-model="form.hero_descricao"
                    data-tour="tour-meusite-textos-hero-descricao"
                    rows="3"
                    placeholder="Aqui é um espaço seguro..."
                    class="w-full mt-1"
                    auto-resize
                />
            </div>
            <div class="field col-12 md:col-4">
                <label class="font-medium text-sm">Badge — anos de experiência</label>
                <InputText v-model="form.hero_badge_anos" data-tour="tour-meusite-textos-hero-badge" placeholder="Ex: 8+" class="w-full mt-1" />
            </div>
        </div>

        <Divider />

        <!-- Seção Sobre -->
        <div class="mt-2 mb-2">
            <span class="text-xs font-semibold text-color-secondary uppercase letter-spacing-1">
                <i class="pi pi-user mr-1" /> Seção Sobre Mim
            </span>
        </div>
        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">Título da seção</label>
                <InputText v-model="form.sobre_titulo" data-tour="tour-meusite-textos-sobre-titulo" placeholder="Olá, sou Ana Lima" class="w-full mt-1" />
            </div>
            <div class="field col-12 md:col-6">
                <label class="font-medium text-sm">Badge — pacientes atendidos</label>
                <InputText v-model="form.sobre_pacientes" data-tour="tour-meusite-textos-sobre-pacientes" placeholder="Ex: 200+" class="w-full mt-1" />
            </div>
            <div class="field col-12">
                <label class="font-medium text-sm">Biografia — parágrafo 1</label>
                <Textarea
                    v-model="form.sobre_bio_1"
                    data-tour="tour-meusite-textos-sobre-bio1"
                    rows="4"
                    placeholder="Sou psicóloga clínica..."
                    class="w-full mt-1"
                    auto-resize
                />
            </div>
            <div class="field col-12">
                <label class="font-medium text-sm">Biografia — parágrafo 2</label>
                <Textarea
                    v-model="form.sobre_bio_2"
                    data-tour="tour-meusite-textos-sobre-bio2"
                    rows="4"
                    placeholder="Atendo adultos e adolescentes..."
                    class="w-full mt-1"
                    auto-resize
                />
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

export default {
    name: 'TextosTab',
    components: { Button, Divider, InputText, Textarea },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            salvando: false,
            form: {
                nav_nome:        '',
                hero_eyebrow:    '',
                hero_titulo:     '',
                hero_subtitulo:  '',
                hero_descricao:  '',
                hero_badge_anos: '',
                sobre_titulo:    '',
                sobre_pacientes: '',
                sobre_bio_1:     '',
                sobre_bio_2:     '',
            },
        };
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (!val) return;
                Object.keys(this.form).forEach((campo) => {
                    const raw = val[campo];
                    this.form[campo] = raw === null || raw === undefined ? '' : String(raw);
                });
            },
        },
    },

    methods: {
        async salvar() {
            try {
                this.salvando = true;
                await meuSiteService.updateInformacoes(this.form);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Textos atualizados com sucesso.', life: 3000 });
                this.$emit('salvo', this.form);
            } catch (err) {
                const detail =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Não foi possível salvar os textos.';
                this.$toast.add({ severity: 'error', summary: 'Erro', detail, life: 5000 });
            } finally {
                this.salvando = false;
            }
        },
    },
};
</script>
