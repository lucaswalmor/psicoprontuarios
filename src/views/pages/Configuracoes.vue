<template>
    <div class="grid">
        <div class="col-12">
            <!-- Tours: um componente por aba (passos no próprio .vue) -->
            <ConfiguracaoPlanoTour v-if="planoConteudoModo !== null" :modo="planoConteudoModo" />
            <ConfiguracaoWhatsappTour
                v-if="podeRecursoPro"
                :key="'wa-tour-' + whatsappTourModo"
                :tour-modo="whatsappTourModo"
            />
            <ConfiguracaoNotificacoesTour v-if="mostrarAbaNotificacoes" />

            <div class="card p-1">
                <h5 class="mb-4 m-3">Configurações</h5>

                <Tabs v-model:value="activeTab">
                    <TabList>
                        <Tab value="0">
                            <i class="pi pi-star mr-2"></i>
                            Plano
                        </Tab>
                        <Tab value="1">
                            <span class="config-tab-label flex align-items-center gap-2">
                                <span>
                                    <i class="pi pi-whatsapp mr-2"></i>
                                    WhatsApp
                                </span>
                                <Tag
                                    v-if="!podeRecursoPro"
                                    value="PRO"
                                    severity="warning"
                                    class="config-pro-tag"
                                />
                            </span>
                        </Tab>
                        <Tab v-if="mostrarAbaNotificacoes" value="2">
                            <i class="pi pi-bell mr-2"></i>
                            Notificações
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <div class="p-4 config-tab-body">
                                <ConfiguracaoPlanoTab
                                    v-if="activeTab === '0'"
                                    @plano-conteudo="onPlanoConteudo"
                                />
                            </div>
                        </TabPanel>

                        <TabPanel value="1">
                            <div class="p-4 config-tab-body">
                                <div
                                    v-if="activeTab === '1' && !podeRecursoPro"
                                    class="col-12 d-flex justify-content-center align-items-center p-7"
                                >
                                    <PlanoPro />
                                </div>
                                <EvolutionConfig
                                    v-else-if="activeTab === '1' && podeRecursoPro"
                                    :prefetch="evolutionPrefetch"
                                    @evolution-state-change="onEvolutionStateChange"
                                />
                            </div>
                        </TabPanel>

                        <TabPanel v-if="mostrarAbaNotificacoes" value="2">
                            <div class="p-4 config-tab-body">
                                <div class="row">
                                    <div class="col-12 mb-4" data-tour="tour-config-notif-intro">
                                        <h5>Central de Notificações</h5>
                                        <p>Configure mensagens automáticas enviadas via WhatsApp para seus pacientes.</p>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="card h-100" data-tour="tour-config-notif-datas">
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
                                        <div class="card h-100" data-tour="tour-config-notif-aniv">
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
                                        <div class="card h-100 opacity-50" data-tour="tour-config-notif-personal">
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
import PlanoPro from '@/components/PlanoPro.vue';
import api from '@/utils/axios';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import ConfiguracaoPlanoTour from '@/components/tour/configuracoes/ConfiguracaoPlanoTour.vue';
import ConfiguracaoWhatsappTour from '@/components/tour/configuracoes/ConfiguracaoWhatsappTour.vue';
import ConfiguracaoNotificacoesTour from '@/components/tour/configuracoes/ConfiguracaoNotificacoesTour.vue';

export default {
    name: 'Configuracoes',
    components: {
        Button,
        ConfiguracaoNotificacoesTour,
        ConfiguracaoPlanoTab,
        ConfiguracaoPlanoTour,
        ConfiguracaoWhatsappTour,
        EvolutionConfig,
        PlanoPro,
        Tag,
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
            evolutionPrefetch: null,
            /** null até ConfiguracaoPlanoTab emitir — evita tour com alvos errados antes do painel carregar */
            planoConteudoModo: null
        };
    },
    computed: {
        podeRecursoPro() {
            const tipo = this.$planService.resolverTipoPlanoUsuario();
            return ['pro', 'vitalicio'].includes(tipo);
        },
        mostrarAbaNotificacoes() {
            return this.podeRecursoPro && this.evolutionConectado;
        },
        /** Define passos do tour (telefone + Salvar só quando ainda não há instância) */
        whatsappTourModo() {
            const p = this.evolutionPrefetch;
            if (p == null) return 'loading';
            return p.instance ? 'instancia_existente' : 'nova_instancia';
        }
    },
    watch: {
        mostrarAbaNotificacoes(visivel) {
            if (!visivel && this.activeTab === '2') {
                this.activeTab = '0';
            }
        },
    },
    created() {
        this.planStore = usePlanStore();
    },
    async mounted() {
        await this.carregarEstadoEvolution();

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
        await this.carregarEstadoEvolution();
    },
    methods: {
        onPlanoConteudo({ modo }) {
            this.planoConteudoModo = modo === 'full' ? 'full' : 'simples';
        },
        onEvolutionStateChange({ instance, status }) {
            this.evolutionPrefetch = { instance, status: status || 'disconnected' };
            this.evolutionConectado = (status || '') === 'connected';
        },
        async carregarEstadoEvolution() {
            let instance = null;
            let status = 'disconnected';

            try {
                const instRes = await api.get('/evolution/instancia');
                instance = instRes?.data?.data || null;
                status = instance?.status || 'disconnected';
            } catch (error) {
                if (error?.response?.status === 404) {
                    instance = null;
                    status = 'disconnected';
                } else {
                    instance = null;
                }
            }

            try {
                const stRes = await api.get('/evolution/instancia/status');
                const st = stRes?.data?.status || 'disconnected';
                status = st;
                this.evolutionConectado = st === 'connected';
                if (instance) {
                    instance = { ...instance, status: st };
                }
            } catch {
                this.evolutionConectado = false;
                status = 'disconnected';
                if (instance) {
                    instance = { ...instance, status: 'disconnected' };
                }
            }

            this.evolutionPrefetch = { instance, status };
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

.config-tab-label {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.config-pro-tag {
    flex: 0 0 auto;
    font-size: 0.7rem;
    padding: 0.125rem 0.4rem;
}

@media (max-width: 991px) {
    .config-tab-body {
        padding: 0.25rem !important;
    }
}
</style>