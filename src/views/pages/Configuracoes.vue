<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="mb-4">Configurações</h5>

                <Tabs v-model:value="activeTab">
                    <TabList>
                        <Tab value="0">
                            <i class="pi pi-star mr-2"></i>
                            Plano
                        </Tab>
                        <Tab value="1">
                            <i class="pi pi-lock mr-2"></i>
                            Segurança
                        </Tab>
                        <Tab value="2">
                            <i class="pi pi-whatsapp mr-2"></i>
                            WhatsApp
                        </Tab>
                        <Tab value="3">
                            <i class="pi pi-bell mr-2"></i>
                            Notificações
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <div class="p-4">
                                <ConfiguracaoPlanoTab v-if="activeTab === '0'" />
                            </div>
                        </TabPanel>

                        <TabPanel value="1">
                            <div class="p-4">
                                <div class="surface-card p-4 border-round">
                                    <h6 class="mb-3 text-800 font-bold">Segurança da Conta</h6>
                                    <div class="flex flex-column gap-3">
                                        <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                            <div class="flex align-items-center gap-3">
                                                <i class="pi pi-lock text-primary text-xl"></i>
                                                <div>
                                                    <h6 class="m-0 text-800">Senha da Conta</h6>
                                                    <small class="text-600">Altere sua senha para manter a conta segura</small>
                                                </div>
                                            </div>
                                            <Button
                                                label="Alterar Senha"
                                                icon="pi pi-key"
                                                severity="secondary"
                                                outlined
                                                @click="showChangePasswordModal = true"
                                            />
                                        </div>

                                        <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                            <div class="flex align-items-center gap-3">
                                                <i class="pi pi-shield text-primary text-xl"></i>
                                                <div>
                                                    <h6 class="m-0 text-800">Autenticação de Dois Fatores</h6>
                                                    <small class="text-600">Adicione uma camada extra de segurança</small>
                                                </div>
                                            </div>
                                            <Button
                                                label="Configurar"
                                                icon="pi pi-cog"
                                                severity="secondary"
                                                outlined
                                                disabled
                                            />
                                        </div>

                                        <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                            <div class="flex align-items-center gap-3">
                                                <i class="pi pi-history text-primary text-xl"></i>
                                                <div>
                                                    <h6 class="m-0 text-800">Histórico de Login</h6>
                                                    <small class="text-600">Veja os últimos acessos à sua conta</small>
                                                </div>
                                            </div>
                                            <Button
                                                label="Visualizar"
                                                icon="pi pi-eye"
                                                severity="secondary"
                                                outlined
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel value="2">
                            <div class="p-4">
                                <EvolutionConfig v-if="activeTab === '2'" />
                            </div>
                        </TabPanel>

                        <TabPanel value="3">
                            <div class="p-4">
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

    <DialogChangePassword
        v-model:visible="showChangePasswordModal"
        @success="handlePasswordChangeSuccess"
    />
</template>

<script>
import { usePlanStore } from '@/store/plan';
import DialogChangePassword from '@/components/dialogs/configuracoes/DialogChangePassword.vue';
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
        DialogChangePassword,
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
            showChangePasswordModal: false,
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
        handlePasswordChangeSuccess() {
            this.$toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Senha alterada com sucesso!',
                life: 3000,
            });
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
</style>