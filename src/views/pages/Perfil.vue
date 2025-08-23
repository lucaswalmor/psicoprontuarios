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
                        <Tab value="2">
                            <i class="pi pi-calculator mr-2"></i>
                            Carne Leão
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
                                                        <i class="pi pi-calendar text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Plano Ativo Até</h6>
                                                            <small class="text-600">{{ userProfile?.data_fim_plano || 'N/A' }}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-star text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Status do Plano</h6>
                                                            <small class="text-600">{{ userProfile?.usuario_vitalicio ? 'Vitalício' : 'Ativo' }}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                                    <div class="flex align-items-center gap-3">
                                                        <i class="pi pi-clock text-primary text-xl"></i>
                                                        <div>
                                                            <h6 class="m-0 text-800">Dias Restantes</h6>
                                                            <small class="text-600">{{ userProfile?.qtd_dias_plano || '0' }} dias</small>
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

                                        <!-- Integração com Google Calendar -->
                                        <!-- <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                            <div class="flex align-items-center gap-3">
                                                <i class="pi pi-calendar text-primary text-xl"></i>
                                                <div>
                                                    <h6 class="m-0 text-800">Google Calendar</h6>
                                                    <small class="text-600">
                                                        {{ googleCalendarStatus.connected 
                                                            ? `Conectado com ${googleCalendarStatus.email || 'Google Calendar'} ✔` 
                                                            : 'Conecte sua conta do Google Calendar para sincronizar eventos' 
                                                        }}
                                                    </small>
                                                </div>
                                            </div>
                                            
                                            <div v-if="googleCalendarStatus.hasProfessionalPlan">
                                                <Button 
                                                    v-if="!googleCalendarStatus.connected"
                                                    label="Conectar ao Google Calendar" 
                                                    icon="pi pi-calendar-plus" 
                                                    severity="success" 
                                                    outlined 
                                                    @click="connectGoogleCalendar"
                                                    :loading="connectingGoogleCalendar"
                                                />
                                                <Button 
                                                    v-else
                                                    label="Desconectar" 
                                                    icon="pi pi-calendar-minus" 
                                                    severity="danger" 
                                                    outlined 
                                                    @click="disconnectGoogleCalendar"
                                                    :loading="disconnectingGoogleCalendar"
                                                />
                                            </div>
                                            
                                             <div v-else class="text-center">
                                                 <small class="text-500">
                                                     Disponível apenas no plano Profissional ou para usuários Vitalícios
                                                 </small>
                                             </div>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        <!-- Aba de Configurações do Carne Leão -->
                        <TabPanel value="2">
                            <div class="p-4">
                                <div class="surface-card p-4 border-round">
                                    <h6 class="mb-3 text-800 font-bold">Configurações Tributárias</h6>
                                    <p class="text-600 mb-4">Configure suas informações tributárias para o cálculo do Carne Leão</p>
                                    
                                    <div v-if="loadingTributario" class="flex justify-content-center p-4">
                                        <ProgressSpinner />
                                    </div>

                                    <div v-else class="grid">
                                        <div class="col-12 md:col-6">
                                            <div class="flex flex-column gap-3">
                                                <div class="flex flex-column gap-2">
                                                    <label class="font-medium">Regime Tributário *</label>
                                                    <Dropdown 
                                                        v-model="configTributario.regime_tributario" 
                                                        :options="regimesTributarios" 
                                                        optionLabel="label" 
                                                        optionValue="value"
                                                        placeholder="Selecione o regime"
                                                        class="w-full"
                                                    />
                                                </div>

                                                <div class="flex flex-column gap-2">
                                                    <label class="font-medium">Alíquota INSS (%)</label>
                                                    <InputNumber 
                                                        v-model="configTributario.aliquota_inss" 
                                                        :minFractionDigits="2" 
                                                        :maxFractionDigits="2"
                                                        suffix="%"
                                                        class="w-full"
                                                        :disabled="configTributario.regime_tributario === 'mei'"
                                                    />
                                                </div>

                                                <div v-if="configTributario.regime_tributario === 'mei'" class="flex flex-column gap-2">
                                                    <label class="font-medium">Valor INSS Fixo (R$)</label>
                                                    <InputNumber 
                                                        v-model="configTributario.valor_inss_fixo" 
                                                        :minFractionDigits="2" 
                                                        :maxFractionDigits="2"
                                                        prefix="R$ "
                                                        class="w-full"
                                                    />
                                                </div>

                                                <div class="flex flex-column gap-2">
                                                    <label class="font-medium">Número de Dependentes</label>
                                                    <InputNumber 
                                                        v-model="configTributario.dependentes" 
                                                        :min="0" 
                                                        :max="10"
                                                        class="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <div class="flex flex-column gap-3">
                                                <div class="flex flex-column gap-2">
                                                    <label class="font-medium">CPF do Cônjuge</label>
                                                    <InputMask 
                                                        v-model="configTributario.cpf_conjuge" 
                                                        mask="999.999.999-99"
                                                        placeholder="000.000.000-00"
                                                        class="w-full"
                                                    />
                                                </div>

                                                <div class="flex flex-column gap-2">
                                                    <label class="font-medium">Rendimentos do Cônjuge (R$)</label>
                                                    <InputNumber 
                                                        v-model="configTributario.rendimentos_conjuge" 
                                                        :minFractionDigits="2" 
                                                        :maxFractionDigits="2"
                                                        prefix="R$ "
                                                        class="w-full"
                                                    />
                                                </div>

                                                <div class="flex align-items-center gap-2">
                                                    <Checkbox 
                                                        v-model="configTributario.plano_saude_familia" 
                                                        :binary="true" 
                                                        inputId="plano_saude"
                                                    />
                                                    <label for="plano_saude" class="text-sm">Plano de Saúde Familiar</label>
                                                </div>

                                                <div class="flex align-items-center gap-2">
                                                    <Checkbox 
                                                        v-model="configTributario.educacao_dependentes" 
                                                        :binary="true" 
                                                        inputId="educacao"
                                                    />
                                                    <label for="educacao" class="text-sm">Educação de Dependentes</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex justify-content-end mt-4">
                                        <Button 
                                            label="Salvar Configurações" 
                                            icon="pi pi-save" 
                                            @click="salvarConfiguracoesTributarias"
                                            :loading="salvandoTributario"
                                        />
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
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import Checkbox from 'primevue/checkbox';

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
        TabPanel,
        Dropdown,
        InputNumber,
        InputMask,
        Checkbox
    },
    data() {
        return {
            loading: false,
            userProfile: null,
            activeTab: '0',
            showEditEmailModal: false,
            showEditPhoneModal: false,
            showChangePasswordModal: false,
            googleCalendarStatus: {
                connected: false,
                email: null,
                connected_at: null,
                hasProfessionalPlan: false
            },
            connectingGoogleCalendar: false,
            disconnectingGoogleCalendar: false,
            // Configurações tributárias
            loadingTributario: false,
            salvandoTributario: false,
            configTributario: {
                regime_tributario: 'autonomo',
                aliquota_inss: 20.00,
                valor_inss_fixo: 66.00,
                dependentes: 0,
                cpf_conjuge: '',
                rendimentos_conjuge: 0.00,
                plano_saude_familia: false,
                educacao_dependentes: false
            },
            regimesTributarios: [
                { label: 'MEI', value: 'mei' },
                { label: 'Autônomo', value: 'autonomo' },
                { label: 'PJ', value: 'pj' },
                { label: 'CLT', value: 'clt' }
            ]
        };
    },
    computed: {
        hasProfessionalPlan() {
            return this.planStore.isVitalicio || this.planStore.planInfo?.nome === 'Profissional';
        }
    },
    async mounted() {
        // Carregar dados do plano primeiro
        if (!this.planStore.hasPlanData) {
            await this.planStore.fetchPlanInfo();
        }
        
        await this.loadUserProfile();
        await this.loadGoogleCalendarStatus();
        await this.loadConfiguracoesTributarias();
        
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

        // Métodos para Google Calendar
        async loadGoogleCalendarStatus() {
            try {
                console.log('Carregando status do Google Calendar...');
                
                const response = await api.get('/google-calendar/status');
                
                // Usar o computed hasProfessionalPlan em vez do valor da API
                this.googleCalendarStatus = {
                    ...response.data,
                    hasProfessionalPlan: this.hasProfessionalPlan
                };
            } catch (error) {
                console.error('Erro ao carregar status do Google Calendar:', error);
                // Mesmo com erro, definir hasProfessionalPlan baseado no store
                this.googleCalendarStatus.hasProfessionalPlan = this.hasProfessionalPlan;
            }
        },

        async connectGoogleCalendar() {
            try {
                this.connectingGoogleCalendar = true;
                
                console.log('Conectando ao Google Calendar...');
                
                // Obter URL de autorização do backend
                const response = await api.get('/google-calendar/redirect');
                
                console.log('Dados da resposta:', response.data);
                
                // Redirecionar para a página de autorização do Google
                window.location.href = response.data.auth_url;
                
            } catch (error) {
                console.error('Erro ao conectar ao Google Calendar:', error);
                
                let errorMessage = 'Erro ao conectar ao Google Calendar';
                
                if (error.response?.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error.message) {
                    errorMessage = `Erro de conexão: ${error.message}`;
                }
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorMessage,
                    life: 5000
                });
            } finally {
                this.connectingGoogleCalendar = false;
            }
        },

        async disconnectGoogleCalendar() {
            try {
                this.disconnectingGoogleCalendar = true;
                
                const response = await api.post('/google-calendar/disconnect');
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Google Calendar desconectado com sucesso!',
                    life: 3000
                });
                
                // Atualizar status local
                await this.loadGoogleCalendarStatus();
                
            } catch (error) {
                console.error('Erro ao desconectar do Google Calendar:', error);
                
                let errorMessage = 'Erro ao desconectar do Google Calendar';
                
                if (error.response?.data?.error) {
                    errorMessage = error.response.data.error;
                }
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorMessage,
                    life: 3000
                });
            } finally {
                this.disconnectingGoogleCalendar = false;
            }
        },

        // Função para verificar parâmetros da URL e mostrar mensagens
        checkUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Verificar sucesso
            if (urlParams.get('success') === 'Google_Calendar_conectado') {
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Google Calendar conectado com sucesso!',
                    life: 5000
                });
                
                // Limpar parâmetros da URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Recarregar status do Google Calendar
                this.loadGoogleCalendarStatus();
            }
            
            // Verificar erros
            const error = urlParams.get('error');
            if (error) {
                let errorMessage = 'Erro desconhecido';
                
                switch (error) {
                    case 'Usuario_nao_autenticado':
                        errorMessage = 'Usuário não autenticado';
                        break;
                    case 'Plano_nao_autorizado':
                        errorMessage = 'Apenas usuários com plano Profissional ou usuários Vitalícios podem conectar ao Google Calendar';
                        break;
                    case 'Erro_autorizacao':
                        errorMessage = 'Erro na autorização do Google Calendar';
                        break;
                    case 'Erro_conexao':
                        const message = urlParams.get('message');
                        errorMessage = message ? `Erro ao conectar: ${decodeURIComponent(message)}` : 'Erro ao conectar ao Google Calendar';
                        break;
                }
                
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorMessage,
                    life: 5000
                });
                
                // Limpar parâmetros da URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // Verificar se deve abrir a aba de Carne Leão
            const tab = urlParams.get('tab');
            if (tab === '2') {
                this.activeTab = '2';
                // Limpar parâmetro da URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        },

        // Métodos para configurações tributárias
        async loadConfiguracoesTributarias() {
            try {
                this.loadingTributario = true;
                
                // Carregar configurações do perfil do usuário
                if (this.userProfile) {
                    this.configTributario = {
                        regime_tributario: this.userProfile.regime_tributario || 'autonomo',
                        aliquota_inss: this.userProfile.aliquota_inss ? this.userProfile.aliquota_inss * 100 : 20.00,
                        valor_inss_fixo: this.userProfile.valor_inss_fixo || 66.00,
                        dependentes: this.userProfile.dependentes || 0,
                        cpf_conjuge: this.userProfile.cpf_conjuge || '',
                        rendimentos_conjuge: this.userProfile.rendimentos_conjuge || 0.00,
                        plano_saude_familia: this.userProfile.plano_saude_familia || false,
                        educacao_dependentes: this.userProfile.educacao_dependentes || false
                    };
                }
                
            } catch (error) {
                console.error('Erro ao carregar configurações tributárias:', error);
            } finally {
                this.loadingTributario = false;
            }
        },

        async salvarConfiguracoesTributarias() {
            try {
                this.salvandoTributario = true;
                
                // Preparar dados para envio
                const dados = {
                    regime_tributario: this.configTributario.regime_tributario,
                    aliquota_inss: this.configTributario.aliquota_inss / 100, // Converter para decimal
                    valor_inss_fixo: this.configTributario.valor_inss_fixo,
                    dependentes: this.configTributario.dependentes,
                    cpf_conjuge: this.configTributario.cpf_conjuge,
                    rendimentos_conjuge: this.configTributario.rendimentos_conjuge,
                    plano_saude_familia: this.configTributario.plano_saude_familia,
                    educacao_dependentes: this.configTributario.educacao_dependentes
                };

                // Atualizar perfil do usuário
                await this.$userService.updateProfile(dados);
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Configurações tributárias salvas com sucesso!',
                    life: 3000
                });

                // Recarregar perfil
                await this.loadUserProfile();
                
            } catch (error) {
                console.error('Erro ao salvar configurações tributárias:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao salvar configurações tributárias',
                    life: 3000
                });
            } finally {
                this.salvandoTributario = false;
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