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
                                <ConfiguracaoPlanoTab v-if="activeTab === '0'" />
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

    <!-- Modal de Alteração de Senha -->
    <DialogChangePassword 
        v-model:visible="showChangePasswordModal"
        @success="handlePasswordChangeSuccess"
    />
</template>

<script setup>
import { ref, onMounted, onActivated, onUnmounted } from 'vue';
import { usePlanStore } from '@/store/plan';
import { useToast } from 'primevue/usetoast';
import DialogChangePassword from '@/components/dialogs/configuracoes/DialogChangePassword.vue';
import ConfiguracaoPlanoTab from '@/views/pages/configuracoes/ConfiguracaoPlanoTab.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Checkbox from 'primevue/checkbox';
import api from '@/utils/axios';

const planStore = usePlanStore();
const toast = useToast();

const showChangePasswordModal = ref(false);
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

const handlePasswordChangeSuccess = () => {
    toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha alterada com sucesso!',
        life: 3000
    });
};

// Carregar dados na montagem
onMounted(async () => {
    await carregarConfiguracoesNotificacao();

    // Atualizar stats quando eventos de criação/alteração ocorrerem em outras telas
    const handleStatsUpdate = async () => {
        await planStore.atualizarStats();
    };
    window.addEventListener('paciente-criado', handleStatsUpdate);
    window.addEventListener('anexo-uploaded', handleStatsUpdate);
    window.addEventListener('paciente-atualizado', handleStatsUpdate);
    window.addEventListener('anexo-removido', handleStatsUpdate);

    // Guardar para remover no unmount
    onUnmounted(() => {
        window.removeEventListener('paciente-criado', handleStatsUpdate);
        window.removeEventListener('anexo-uploaded', handleStatsUpdate);
        window.removeEventListener('paciente-atualizado', handleStatsUpdate);
        window.removeEventListener('anexo-removido', handleStatsUpdate);
    });
});

// Quando voltar para esta tela, garantir atualização dos contadores
onActivated(async () => {
    await planStore.atualizarStats();
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