<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="mb-4">Meu Perfil</h5>

                <Tabs v-model:value="activeTab">
                    <TabList>
                        <Tab value="0">
                            <i class="pi pi-user mr-2"></i>
                            Dados Pessoais
                        </Tab>
                        <Tab value="1">
                            <i class="pi pi-cog mr-2"></i>
                            Configurações
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <!-- Aba de Dados Pessoais -->
                        <TabPanel value="0">
                            <div class="p-4">
                                <div class="surface-card p-4 border-round">
                                    <h6 class="mb-3 text-800 font-bold">Informações Pessoais</h6>
                                    
                                    <div v-if="loading" class="flex justify-content-center p-4">
                                        <ProgressSpinner />
                                    </div>

                                    <div v-else class="grid">
                                        <div class="col-12 md:col-6">
                                            <div class="flex flex-column gap-3">
                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-user text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Nome Completo</h6>
                                                            <small class="text-600">{{ userProfile?.nome || 'Carregando...' }}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-envelope text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Email</h6>
                                                            <small class="text-600">{{ userProfile?.email || 'Carregando...' }}</small>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        label="Editar" 
                                                        icon="pi pi-pencil" 
                                                        severity="secondary" 
                                                        outlined 
                                                        size="small"
                                                        @click="showEditEmailModal = true"
                                                    />
                                                </div>

                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-phone text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Telefone</h6>
                                                            <small class="text-600">{{ userProfile?.telefone || 'Carregando...' }}</small>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        label="Editar" 
                                                        icon="pi pi-pencil" 
                                                        severity="secondary" 
                                                        outlined 
                                                        size="small"
                                                        @click="showEditPhoneModal = true"
                                                    />
                                                </div>

                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-id-card text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">CPF</h6>
                                                            <small class="text-600">{{ userProfile?.cpf || 'Carregando...' }}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-briefcase text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">CRP</h6>
                                                            <small class="text-600">{{ userProfile?.crp || 'Carregando...' }}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <div class="flex flex-column gap-3">
                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-star text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Plano Atual</h6>
                                                            <small class="text-600">{{ planStore.planoNome || 'Carregando...' }}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Aba de Configurações -->
                        <TabPanel value="1">
                            <div class="p-4">
                                <div class="surface-card p-4 border-round">
                                    <h6 class="mb-3 text-800 font-bold">Configurações da Conta</h6>
                                    <div class="flex flex-column gap-3">
                                        <!-- Configuração de Senha -->
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

                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>

    <!-- Dialog de Edição de Email -->
    <DialogEditEmail 
        v-model:visible="showEditEmailModal"
        :current-email="userProfile?.email"
        @success="handleEmailUpdateSuccess"
    />

    <!-- Dialog de Edição de Telefone -->
    <DialogEditPhone 
        v-model:visible="showEditPhoneModal"
        :current-phone="userProfile?.telefone"
        @success="handlePhoneUpdateSuccess"
    />

    <!-- Modal de Alteração de Senha -->
    <DialogChangePassword 
        v-model:visible="showChangePasswordModal"
        @success="handlePasswordChangeSuccess"
    />
</template>

<script>
import { useToast } from 'primevue/usetoast';
import { usePlanStore } from '@/store/plan';
import userService from '@/services/userService';
import api from '@/utils/axios';
import DialogChangePassword from '@/components/dialogs/configuracoes/DialogChangePassword.vue';
import DialogEditEmail from '@/components/dialogs/configuracoes/DialogEditEmail.vue';
import DialogEditPhone from '@/components/dialogs/configuracoes/DialogEditPhone.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

export default {
    name: 'Perfil',
    components: {
        DialogChangePassword,
        DialogEditEmail,
        DialogEditPhone,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    },
    data() {
        return {
            loading: false,
            userProfile: null,
            activeTab: '0',
            showEditEmailModal: false,
            showEditPhoneModal: false,
            showChangePasswordModal: false,
        };
    },
    async mounted() {
        await this.loadUserProfile();
        
        // Verificar parâmetros da URL após carregar os dados
        this.checkUrlParams();
    },
    methods: {
        async loadUserProfile() {
            try {
                this.loading = true;
                const response = await userService.getProfile();
                this.userProfile = response;
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do perfil',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        handleEmailUpdateSuccess() {
            this.$toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Email atualizado com sucesso!',
                life: 3000
            });
            this.loadUserProfile(); // Recarregar dados
        },

        handlePhoneUpdateSuccess() {
            this.$toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Telefone atualizado com sucesso!',
                life: 3000
            });
            this.loadUserProfile(); // Recarregar dados
        },

        handlePasswordChangeSuccess() {
            this.$toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Senha alterada com sucesso!',
                life: 3000
            });
        },


        // Função para verificar parâmetros da URL e mostrar mensagens
        checkUrlParams() {
            // Função simplificada - removidas referências ao Google Calendar
            const urlParams = new URLSearchParams(window.location.search);
            
            // Limpar parâmetros da URL se houver algum
            if (urlParams.toString()) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    },
    setup() {
        const toast = useToast();
        const planStore = usePlanStore();
        
        return {
            toast,
            planStore
        };
    }
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
</style> 