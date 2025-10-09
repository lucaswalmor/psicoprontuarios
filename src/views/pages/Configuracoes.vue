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
                            <i class="pi pi-cog mr-2"></i>
                            Preferências
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <!-- Aba do Plano -->
                        <TabPanel value="0">
                            <div class="p-4">
                                <!-- Seção do Plano Atual -->
                                <div class="surface-card p-4 border-round mb-4">
                                    <div class="flex align-items-center justify-content-between mb-3">
                                        <h6 class="m-0">Plano Atual</h6>
                                        <Tag :value="planStore.planInfo?.nome || 'Carregando...'" :severity="getPlanSeverity()" />
                                    </div>

                                    <div class="grid">
                                        <div class="col-12 md:col-6">
                                            <div class="flex flex-column gap-2">
                                                <div class="flex align-items-center gap-2">
                                                    <i class="pi pi-calendar text-primary"></i>
                                                    <span class="text-800 font-bold">Próximo Vencimento:</span>
                                                    <span class="text-500">{{ formatDate(planStore.planInfo?.data_fim_plano) }}</span>
                                                </div>
                                                <div class="flex align-items-center gap-2">
                                                    <i class="pi pi-users text-primary"></i>
                                                    <span class="text-800 font-bold">Pacientes:</span>
                                                    <span class="text-500">{{ planStore.pacientesCount }} / {{ planStore.limitePacientes
                                                        }}</span>
                                                </div>
                                                <div class="flex align-items-center gap-2">
                                                    <i class="pi pi-paperclip text-primary"></i>
                                                    <span class="text-800 font-bold">Anexos:</span>
                                                    <span class="text-500">
                                                        {{ planStore.anexosCount }} /
                                                        {{ planStore.anexosLimite === -1 ? 'Ilimitado' : planStore.anexosLimite }}
                                                    </span>
                                                </div>
                                                <div class="flex align-items-center gap-2">
                                                    <i class="pi pi-dollar text-primary"></i>
                                                    <span class="text-800 font-bold">Valor Mensal:</span>
                                                    <span class="text-500">{{ formatCurrency(planStore.planInfo?.preco) }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <div class="flex flex-column gap-2">
                                                <div class="flex align-items-center gap-2">
                                                    <i class="pi pi-check-circle text-green-500"></i>
                                                    <span class="text-800 font-bold">Status:</span>
                                                    <Tag :value="getStatusText()" :severity="getStatusSeverity()" />
                                                </div>
                                                <div class="flex align-items-center gap-2">
                                                    <i class="pi pi-credit-card text-primary"></i>
                                                    <span class="text-800 font-bold">Forma de Pagamento:</span>
                                                    <span class="text-500">{{ getPaymentMethod() }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ações do Plano -->
                                <div class="grid">
                                    <div class="col-12 md:col-6">
                                        <div class="surface-card p-4 border-round">
                                            <h6 class="mb-3">Gerenciar Plano</h6>

                                            <!-- Botão de Upgrade -->
                                            <Button v-if="shouldShowUpgradeButton" label="Fazer Upgrade do Plano" icon="pi pi-star"
                                                class="w-full mb-3" @click="goToUpgrade" />

                                            <!-- Botão de Pausar/Reativar -->
                                            <Button v-if="planStore.planInfo?.asaas_subscription_id"
                                                :label="isPlanPaused ? 'Reativar Plano' : 'Pausar Plano'"
                                                :icon="isPlanPaused ? 'pi pi-play' : 'pi pi-pause'"
                                                :severity="isPlanPaused ? 'success' : 'warning'" class="w-full"
                                                @click="togglePlanStatus" />

                                            <small class="text-gray-600 block mt-2">
                                                {{ isPlanPaused ?
                                                    'Reative seu plano para voltar a ter acesso completo ao sistema.' :
                                                    'Pause seu plano temporariamente. Você manterá acesso limitado.' }}
                                            </small>
                                        </div>
                                    </div>

                                    <div class="col-12 md:col-6">
                                        <div class="surface-card p-4 border-round">
                                            <h6 class="mb-3 text-800 font-bold">Recursos Disponíveis</h6>
                                            <div class="flex flex-column gap-2">
                                                <div v-for="feature in availableFeatures" :key="feature.key"
                                                    class="flex align-items-center gap-2">
                                                    <i
                                                        :class="['pi', feature.icon, feature.available ? 'text-green-500' : 'text-gray-400']"></i>
                                                    <span :class="{ 'text-gray-400': !feature.available }" class="text-800 font-bold">{{
                                                        feature.label }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Aba de Segurança -->
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
                                        
                                        <!-- Futuras opções de segurança -->
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

                        <!-- Aba de Preferências -->
                        <TabPanel value="2">
                            <div class="p-4">
                                <div class="surface-card p-4 border-round">
                                    <h6 class="mb-3 text-800 font-bold">Preferências de Notificação</h6>
                                    <p class="text-600 mb-4">Configure como você deseja receber notificações sobre suas consultas</p>
                                    
                                    <div v-if="loadingNotificacoes" class="flex justify-content-center p-4">
                                        <ProgressSpinner />
                                    </div>

                                    <div v-else class="flex flex-column gap-4">
                                        <!-- Notificações para o Psicólogo -->
                                        <div class="surface-100 p-4 border-round">
                                            <h6 class="mb-3 text-800 font-bold">Notificações para Você</h6>
                                            <div class="flex flex-column gap-3">
                                                <div class="flex align-items-center justify-content-between">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-whatsapp text-green-500 text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">WhatsApp</h6>
                                                            <small class="text-600">Receber lembretes de consultas via WhatsApp</small>
                                                        </div>
                                                    </div>
                                                    <Checkbox 
                                                        v-model="configNotificacoes.notificacoes_consultas_whatsapp" 
                                                        :binary="true" 
                                                        inputId="whatsapp_psicologo"
                                                    />
                                                </div>

                                                <div class="flex align-items-center justify-content-between">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-envelope text-blue-500 text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Email</h6>
                                                            <small class="text-600">Receber lembretes de consultas via email</small>
                                                        </div>
                                                    </div>
                                                    <Checkbox 
                                                        v-model="configNotificacoes.notificacoes_consultas_email" 
                                                        :binary="true" 
                                                        inputId="email_psicologo"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Notificações para os Pacientes -->
                                        <div class="surface-100 p-4 border-round">
                                            <h6 class="mb-3 text-800 font-bold">Notificações para Pacientes</h6>
                                            <div class="flex flex-column gap-3">
                                                <div class="flex align-items-center justify-content-between">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-whatsapp text-green-500 text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">WhatsApp</h6>
                                                            <small class="text-600">Enviar lembretes de consultas para pacientes via WhatsApp</small>
                                                        </div>
                                                    </div>
                                                    <Checkbox 
                                                        v-model="configNotificacoes.notificacoes_consultas_pacientes_whatsapp" 
                                                        :binary="true" 
                                                        inputId="whatsapp_pacientes"
                                                    />
                                                </div>

                                                <div class="flex align-items-center justify-content-between">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-envelope text-blue-500 text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Email</h6>
                                                            <small class="text-600">Enviar lembretes de consultas para pacientes via email</small>
                                                        </div>
                                                    </div>
                                                    <Checkbox 
                                                        v-model="configNotificacoes.notificacoes_consultas_pacientes_email" 
                                                        :binary="true" 
                                                        inputId="email_pacientes"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex justify-content-between mt-4">
                                            <Button 
                                                label="Resetar para Padrão" 
                                                icon="pi pi-refresh" 
                                                severity="secondary" 
                                                outlined 
                                                @click="resetarNotificacoes"
                                                :loading="resetandoNotificacoes"
                                            />
                                            <Button 
                                                label="Salvar Preferências" 
                                                icon="pi pi-save" 
                                                @click="salvarNotificacoes"
                                                :loading="salvandoNotificacoes"
                                            />
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

    <!-- Dialog de Confirmação para Pausar Plano -->
    <Dialog :visible="showPauseDialog" @update:visible="showPauseDialog = $event" modal header="Confirmar Pausa do Plano" :style="{ width: '500px' }">
        <div class="flex flex-column gap-3">
            <div class="flex align-items-center gap-2">
                <i class="pi pi-exclamation-triangle text-orange-500 text-xl"></i>
                <span class="font-medium">Tem certeza que deseja pausar seu plano?</span>
            </div>

            <div class="surface-100 p-3 border-round">
                <h6 class="mb-2">O que acontecerá ao pausar o plano:</h6>
                <ul class="m-0 pl-3 text-500">
                    <li class="text-800 font-bold">Você manterá acesso ao sistema</li>
                    <li class="text-800 font-bold">Poderá visualizar e baixar prontuários existentes</li>
                    <li class="text-800 font-bold">Poderá baixar anexos já enviados</li>
                    <li class="text-800 font-bold">Não poderá cadastrar novos pacientes</li>
                    <li class="text-800 font-bold">Não poderá fazer novos uploads de anexos</li>
                    <li class="text-800 font-bold">Não terá acesso a agendamentos e gestão financeira</li>
                    <li class="text-800 font-bold">Não serão geradas novas cobranças</li>
                </ul>
            </div>

            <div class="surface-100 p-3 border-round">
                <h6 class="mb-2">Para reativar:</h6>
                <p class="m-0 text-sm">Acesse esta tela novamente e clique em "Reativar Plano"</p>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="showPauseDialog = false" />
                <Button label="Confirmar Pausa" severity="warning" @click="confirmPausePlan" :loading="loading" />
            </div>
        </template>
    </Dialog>

    <!-- Dialog de Confirmação para Reativar Plano -->
    <Dialog :visible="showReactivateDialog" @update:visible="showReactivateDialog = $event" modal header="Confirmar Reativação do Plano"
        :style="{ width: '500px' }">
        <div class="flex flex-column gap-3">
            <div class="flex align-items-center gap-2">
                <i class="pi pi-check-circle text-green-500 text-xl"></i>
                <span class="font-medium">Reativar Plano</span>
            </div>

            <div class="surface-100 p-3 border-round">
                <h6 class="mb-2">Ao reativar seu plano:</h6>
                <ul class="m-0 pl-3">
                    <li>Você terá acesso completo ao sistema</li>
                    <li>Poderá cadastrar novos pacientes</li>
                    <li>Poderá fazer uploads de anexos</li>
                    <li>Terá acesso a agendamentos e gestão financeira</li>
                    <li>As cobranças mensais serão retomadas</li>
                </ul>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" severity="secondary" outlined @click="showReactivateDialog = false" />
                <Button label="Confirmar Reativação" severity="success" @click="confirmReactivatePlan"
                    :loading="loading" />
            </div>
        </template>
    </Dialog>

    <!-- Modal de Alteração de Senha -->
    <DialogChangePassword 
        v-model:visible="showChangePasswordModal"
        @success="handlePasswordChangeSuccess"
    />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePlanStore } from '@/store/plan';
import { useToast } from 'primevue/usetoast';
import DialogChangePassword from '@/components/dialogs/configuracoes/DialogChangePassword.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Checkbox from 'primevue/checkbox';
import api from '@/utils/axios';

const router = useRouter();
const planStore = usePlanStore();
const toast = useToast();

// Estados reativos
const showPauseDialog = ref(false);
const showReactivateDialog = ref(false);
const showChangePasswordModal = ref(false);
const loading = ref(false);
const activeTab = ref('0');

// Configurações de notificação
const loadingNotificacoes = ref(false);
const salvandoNotificacoes = ref(false);
const resetandoNotificacoes = ref(false);
const configNotificacoes = ref({
    notificacoes_consultas_whatsapp: true,
    notificacoes_consultas_email: true,
    notificacoes_consultas_pacientes_whatsapp: true,
    notificacoes_consultas_pacientes_email: true
});

// Computed properties
const shouldShowUpgradeButton = computed(() => {
    if (!planStore.planInfo) return false;
    const currentPlan = planStore.planInfo.nome;
    return currentPlan === 'Gratuito' || currentPlan === 'Essencial';
});

const isPlanPaused = computed(() => {
    return planStore.planInfo?.status === 'INACTIVE' || planStore.planInfo?.paused === true;
});

const availableFeatures = computed(() => [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'pi-home',
        available: planStore.canAccessDashboard || isPlanPaused.value
    },
    {
        key: 'gestao_financeira',
        label: 'Gestão Financeira',
        icon: 'pi-wallet',
        available: planStore.canAccessGestaoFinanceira && !isPlanPaused.value
    },
    {
        key: 'agendamentos',
        label: 'Agendamentos',
        icon: 'pi-calendar',
        available: planStore.canAccessAgendamentos && !isPlanPaused.value
    },
    {
        key: 'prontuarios_pdf',
        label: 'Exportar Prontuários PDF',
        icon: 'pi-file-pdf',
        available: planStore.canAccessProntuariosPDF || isPlanPaused.value
    },
    {
        key: 'anexos',
        label: `Anexos (${planStore.anexosLimite === -1 ? 'Ilimitado' : planStore.anexosLimite})`,
        icon: 'pi-paperclip',
        available: planStore.canUploadAnexos
    },
    {
        key: 'backup_automatico',
        label: 'Backup Automático',
        icon: 'pi-cloud',
        available: planStore.canAccessBackupAutomatico && !isPlanPaused.value
    }
]);

// Métodos
const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
};

const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const getPlanSeverity = () => {
    const planName = planStore.planInfo?.nome;
    if (planName === 'Vitalício') return 'success';
    if (planName === 'Premium') return 'info';
    if (planName === 'Essencial') return 'warning';
    return 'secondary';
};

const getStatusText = () => {
    if (isPlanPaused.value) return 'Pausado';
    return 'Ativo';
};

// Métodos para configurações de notificação
const carregarConfiguracoesNotificacao = async () => {
    try {
        loadingNotificacoes.value = true;
        const response = await api.get('/user-config');
        configNotificacoes.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar configurações de notificação',
            life: 3000
        });
    } finally {
        loadingNotificacoes.value = false;
    }
};

const salvarNotificacoes = async () => {
    try {
        salvandoNotificacoes.value = true;
        await api.put('/user-config', configNotificacoes.value);
        
        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Preferências de notificação salvas com sucesso!',
            life: 3000
        });
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao salvar preferências de notificação',
            life: 3000
        });
    } finally {
        salvandoNotificacoes.value = false;
    }
};

const resetarNotificacoes = async () => {
    try {
        resetandoNotificacoes.value = true;
        await api.post('/user-config/reset');
        
        // Recarregar configurações após reset
        await carregarConfiguracoesNotificacao();
        
        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Preferências resetadas para valores padrão!',
            life: 3000
        });
    } catch (error) {
        console.error('Erro ao resetar configurações:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao resetar preferências',
            life: 3000
        });
    } finally {
        resetandoNotificacoes.value = false;
    }
};

const getStatusSeverity = () => {
    return isPlanPaused.value ? 'warning' : 'success';
};

const getPaymentMethod = () => {
    const method = planStore.planInfo?.forma_pagamento;
    if (method === 'CREDIT_CARD') return 'Cartão de Crédito';
    if (method === 'PIX') return 'PIX';
    return 'N/A';
};

const goToUpgrade = () => {
    router.push('/upgrade');
};

const togglePlanStatus = () => {
    if (isPlanPaused.value) {
        showReactivateDialog.value = true;
    } else {
        showPauseDialog.value = true;
    }
};

const confirmPausePlan = async () => {
    try {
        loading.value = true;

        const response = await api.post('/assinatura/pausar');

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Plano pausado com sucesso',
            life: 3000
        });

        // Recarregar informações do plano
        await planStore.fetchPlanInfo();
        showPauseDialog.value = false;
    } catch (error) {
        console.error('Erro ao pausar plano:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao pausar plano';
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const handlePasswordChangeSuccess = () => {
    toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha alterada com sucesso!',
        life: 3000
    });
};

const confirmReactivatePlan = async () => {
    try {
        loading.value = true;

        const response = await api.post('/assinatura/reativar');

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Plano reativado com sucesso',
            life: 3000
        });

        // Recarregar informações do plano
        await planStore.fetchPlanInfo();
        showReactivateDialog.value = false;
    } catch (error) {
        console.error('Erro ao reativar plano:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao reativar plano';
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Carregar dados na montagem
onMounted(async () => {
    if (!planStore.hasPlanData) {
        await planStore.fetchPlanInfo();
    }
    await carregarConfiguracoesNotificacao();
});
</script>

<style scoped>
.surface-card {
    border: 1px solid var(--surface-border);
    transition: all 0.2s ease;
}

.surface-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>