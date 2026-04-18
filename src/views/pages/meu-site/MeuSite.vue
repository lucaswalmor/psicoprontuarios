<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <div class="flex align-items-center justify-content-between m-3 mb-4">
                    <h5 class="m-0">Meu Site</h5>
                    <a
                        v-if="slugAtual"
                        :href="`https://${slugAtual}.psicoprontuarios.com.br`"
                        target="_blank"
                        class="p-button p-button-outlined p-button-sm flex align-items-center gap-2"
                        style="text-decoration: none"
                    >
                        <i class="pi pi-external-link" />
                        Ver meu site
                    </a>
                </div>

                <div v-if="carregando" class="flex justify-content-center align-items-center p-6">
                    <ProgressSpinner style="width:48px;height:48px" />
                </div>

                <Tabs v-else v-model:value="activeTab">
                    <TabList>
                        <Tab value="0"><i class="pi pi-sliders-h mr-2" />Geral</Tab>
                        <Tab value="1"><i class="pi pi-palette mr-2" />Aparência</Tab>
                        <Tab value="2"><i class="pi pi-file-edit mr-2" />Textos</Tab>
                        <Tab value="3"><i class="pi pi-th-large mr-2" />Especialidades</Tab>
                        <Tab value="4"><i class="pi pi-clock mr-2" />Horários</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel value="0">
                            <GeralTab v-if="activeTab === '0'" :dados="dados" @salvo="onSalvo" />
                        </TabPanel>
                        <TabPanel value="1">
                            <AparenciaTab v-if="activeTab === '1'" :dados="dados" @salvo="onSalvo" />
                        </TabPanel>
                        <TabPanel value="2">
                            <TextosTab v-if="activeTab === '2'" :dados="dados" @salvo="onSalvo" />
                        </TabPanel>
                        <TabPanel value="3">
                            <EspecialidadesTab v-if="activeTab === '3'" :dados="dados" @salvo="onSalvo" />
                        </TabPanel>
                        <TabPanel value="4">
                            <HorariosTab v-if="activeTab === '4'" :dados="dados" @salvo="onSalvo" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
</template>

<script>
import meuSiteService from '@/services/meuSiteService';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import ProgressSpinner from 'primevue/progressspinner';
import GeralTab from './tabs/GeralTab.vue';
import AparenciaTab from './tabs/AparenciaTab.vue';
import TextosTab from './tabs/TextosTab.vue';
import EspecialidadesTab from './tabs/EspecialidadesTab.vue';
import HorariosTab from './tabs/HorariosTab.vue';

export default {
    name: 'MeuSite',
    components: { Tab, TabList, TabPanel, TabPanels, Tabs, ProgressSpinner, GeralTab, AparenciaTab, TextosTab, EspecialidadesTab, HorariosTab },

    data() {
        return {
            activeTab: '0',
            carregando: true,
            dados: null,
        };
    },

    computed: {
        slugAtual() {
            return this.dados?.slug ?? null;
        },
    },

    async mounted() {
        await this.carregar();
    },

    methods: {
        async carregar() {
            try {
                this.carregando = true;
                this.dados = await meuSiteService.getMeuSite();
            } catch {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do site.', life: 4000 });
            } finally {
                this.carregando = false;
            }
        },

        onSalvo(dadosAtualizados) {
            if (dadosAtualizados) {
                this.dados = { ...this.dados, ...dadosAtualizados };
            }
        },
    },
};
</script>
