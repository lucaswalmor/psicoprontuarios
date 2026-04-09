<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-1">
                <h5 class="mb-4 m-3">Configurações</h5>

                <Tabs v-model:value="activeTab">
                    <TabList>
                        <Tab value="0">
                            <i class="pi pi-star mr-2"></i>
                            Plano
                        </Tab>
                        <Tab value="1">
                            <i class="pi pi-whatsapp mr-2"></i>
                            WhatsApp
                        </Tab>
                        <Tab value="2">
                            <i class="pi pi-bell mr-2"></i>
                            Notificações
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <div class="p-4 config-tab-body">
                                <ConfiguracaoPlanoTab v-if="activeTab === '0'" />
                            </div>
                        </TabPanel>

                        <TabPanel value="1">
                            <div class="p-4 config-tab-body">
                                <EvolutionConfig v-if="activeTab === '1'" />
                            </div>
                        </TabPanel>

                        <TabPanel value="2">
                            <div class="p-4 config-tab-body">
                                <div class="row">
                                    <div class="col-12 mb-4">
                                        <h5>Central de Notificações</h5>
                                        <p>Configure mensagens automáticas enviadas via WhatsApp para seus pacientes.</p>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card h-100">
                                            <div class="card-body text-center d-flex flex-column">
                                                <div class="fs-1 mb-2">🎉</div>
                                                <h6 class="card-title notificacao-card-title">Datas Comemorativas</h6>
                                                <p class="card-text small notificacao-card-text">
                                                    Configure mensagens automáticas para datas especiais como Natal, Dia das Mães e muito mais.
                                                </p>
                                                <div class="mt-auto">
                                                    <Button
                                                        label="Configurar"
                                                        icon="pi pi-cog"
                                                        @click="$router.push('/notificacoes/datas-comemorativas')"
                                                        :disabled="!evolutionConectado"
                                                    />
                                                    <p v-if="!evolutionConectado" class="text-danger small mt-2">
                                                        ⚠️ Configure o WhatsApp primeiro para habilitar notificações.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card h-100">
                                            <div class="card-body text-center d-flex flex-column">
                                                <div class="fs-1 mb-2">🎂</div>
                                                <h6 class="card-title notificacao-card-title">Aniversariantes</h6>
                                                <p class="card-text small notificacao-card-text">
                                                    Configure mensagens automáticas para aniversários dos pacientes.
                                                </p>
                                                <div class="mt-auto">
                                                    <Button
                                                        label="Configurar"
                                                        icon="pi pi-cog"
                                                        @click="$router.push('/notificacoes/aniversariantes')"
                                                        :disabled="!evolutionConectado"
                                                    />
                                                    <p v-if="!evolutionConectado" class="text-danger small mt-2">
                                                        ⚠️ Configure o WhatsApp primeiro para habilitar notificações.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card h-100 opacity-50">
                                            <div class="card-body text-center d-flex flex-column">
                                                <div class="fs-1 mb-2">✉️</div>
                                                <h6 class="card-title notificacao-card-title">Mensagens Personalizadas</h6>
                                                <p class="card-text small notificacao-card-text">
                                                    Em breve: crie mensagens personalizadas para datas especiais escolhidas por você.
                                                </p>
                                                <div class="mt-auto">
                                                    <Button label="Em Breve" icon="pi pi-lock" disabled />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlanStore } from '@/store/plan';
import EvolutionConfig from '@/components/evolution/EvolutionConfig.vue';
import ConfiguracaoPlanoTab from '@/views/pages/configuracoes/ConfiguracaoPlanoTab.vue';
import api from '@/utils/axios';
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';

export default {
    name: 'Configuracoes',
    components: {
        Button,
        ConfiguracaoPlanoTab,
        EvolutionConfig,
        Tab,
        TabList,
        TabPanel,
        TabPanels,
        Tabs,
    },
    data() {
        return {
            activeTab: '0',
            planStore: null,
            handleStatsUpdate: null,
            evolutionConectado: false,
        };
    },
    created() {
        this.planStore = usePlanStore();
    },
    mounted() {
        this.verificarStatusEvolution();

        this.handleStatsUpdate = async () => {
            await this.planStore.atualizarStats();
        };

        window.addEventListener('paciente-criado', this.handleStatsUpdate);
        window.addEventListener('anexo-uploaded', this.handleStatsUpdate);
        window.addEventListener('paciente-atualizado', this.handleStatsUpdate);
        window.addEventListener('anexo-removido', this.handleStatsUpdate);
    },
    beforeUnmount() {
        if (!this.handleStatsUpdate) return;
        window.removeEventListener('paciente-criado', this.handleStatsUpdate);
        window.removeEventListener('anexo-uploaded', this.handleStatsUpdate);
        window.removeEventListener('paciente-atualizado', this.handleStatsUpdate);
        window.removeEventListener('anexo-removido', this.handleStatsUpdate);
    },
    async activated() {
        await this.planStore.atualizarStats();
    },
    methods: {
        async verificarStatusEvolution() {
            try {
                const response = await api.get('/evolution/instancia/status');
                this.evolutionConectado = response?.data?.status === 'connected';
            } catch (error) {
                this.evolutionConectado = false;
            }
        },
    },
};
</script>

<style scoped>
.surface-card {
    border: 1px solid var(--surface-border);
    transition: all 0.2s ease;
}

.surface-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notificacao-card-title {
    color: var(--text-color);
}

.notificacao-card-text {
    color: var(--text-color-secondary);
}

@media (max-width: 991px) {
    .config-tab-body {
        padding: 0.25rem !important;
    }
}
</style>