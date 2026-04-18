<template>
    <div class="p-4">

        <!-- Temas Tratados -->
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Especialidades</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Selecione os temas que você trabalha. Eles aparecem como cards na sua landing page.</p>
            </div>
            <Button label="Salvar especialidades" icon="pi pi-check" :loading="salvandoTemas" @click="salvarTemas" />
        </div>

        <div v-if="carregandoTemas" class="flex justify-content-center p-4">
            <ProgressSpinner style="width:36px;height:36px" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
            <div
                v-for="tema in todosTemas"
                :key="tema.id"
                class="tema-chip"
                :class="{ selecionado: temasSelecionados.includes(tema.id) }"
                @click="toggleTema(tema.id)"
            >
                <span class="mr-1">{{ tema.icone }}</span>
                {{ tema.nome }}
            </div>
        </div>

        <Divider class="my-5" />

        <!-- Abordagens / Chips do Sobre -->
        <div class="flex align-items-center justify-content-between mb-4">
            <div>
                <h6 class="m-0">Abordagens Terapêuticas</h6>
                <p class="text-color-secondary text-sm m-0 mt-1">Selecione suas abordagens. Aparecem como chips na seção "Sobre mim".</p>
            </div>
            <Button label="Salvar abordagens" icon="pi pi-check" :loading="salvandoEsp" @click="salvarEspecialidades" />
        </div>

        <div v-if="carregandoEsp" class="flex justify-content-center p-4">
            <ProgressSpinner style="width:36px;height:36px" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
            <div
                v-for="esp in todasEspecialidades"
                :key="esp.id"
                class="tema-chip"
                :class="{ selecionado: espSelecionadas.includes(esp.id) }"
                @click="toggleEsp(esp.id)"
            >
                {{ esp.nome }}
            </div>
        </div>

    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'EspecialidadesTab',
    components: { Button, Divider, ProgressSpinner },

    props: {
        dados: { type: Object, default: null },
    },

    emits: ['salvo'],

    data() {
        return {
            carregandoTemas: true,
            carregandoEsp:   true,
            salvandoTemas:   false,
            salvandoEsp:     false,
            todosTemas:          [],
            todasEspecialidades: [],
            temasSelecionados:   [],
            espSelecionadas:     [],
        };
    },

    watch: {
        dados: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.temasSelecionados = (val.especialidades ?? []).map((e) => e.id);
                this.espSelecionadas   = (val.chips ?? []).map((c) => c.id);
            },
        },
    },

    async mounted() {
        await Promise.all([this.carregarTemas(), this.carregarEspecialidades()]);
    },

    methods: {
        async carregarTemas() {
            try {
                this.carregandoTemas = true;
                this.todosTemas = await meuSiteService.getTodosOsTemas();
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os temas.', life: 4000 });
            } finally {
                this.carregandoTemas = false;
            }
        },

        async carregarEspecialidades() {
            try {
                this.carregandoEsp = true;
                this.todasEspecialidades = await meuSiteService.getTodasAsEspecialidades();
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as abordagens.', life: 4000 });
            } finally {
                this.carregandoEsp = false;
            }
        },

        toggleTema(id) {
            const idx = this.temasSelecionados.indexOf(id);
            if (idx === -1) this.temasSelecionados.push(id);
            else this.temasSelecionados.splice(idx, 1);
        },

        toggleEsp(id) {
            const idx = this.espSelecionadas.indexOf(id);
            if (idx === -1) this.espSelecionadas.push(id);
            else this.espSelecionadas.splice(idx, 1);
        },

        async salvarTemas() {
            try {
                this.salvandoTemas = true;
                await meuSiteService.syncTemas(this.temasSelecionados);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Especialidades atualizadas.', life: 3000 });
                this.$emit('salvo');
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar as especialidades.', life: 4000 });
            } finally {
                this.salvandoTemas = false;
            }
        },

        async salvarEspecialidades() {
            try {
                this.salvandoEsp = true;
                await meuSiteService.syncEspecialidades(this.espSelecionadas);
                this.$toast.add({ severity: 'success', summary: 'Salvo!', detail: 'Abordagens atualizadas.', life: 3000 });
                this.$emit('salvo');
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar as abordagens.', life: 4000 });
            } finally {
                this.salvandoEsp = false;
            }
        },
    },
};
</script>

<style scoped>
.tema-chip {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 50px;
    border: 1.5px solid var(--surface-border);
    background: var(--surface-card);
    color: var(--text-color);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}

.tema-chip:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.tema-chip.selecionado {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
    font-weight: 500;
}
</style>
