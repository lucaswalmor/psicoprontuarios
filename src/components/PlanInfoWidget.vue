<template>
    <div class="plan-info-widget">
        <div class="plan-card" :class="{ 'vitalicio': isVitalicio }">
            <div class="plan-header">
                <i class="pi pi-crown text-2xl" v-if="isVitalicio"></i>
                <i class="pi pi-star text-2xl" v-else></i>
                <h3 class="plan-title">{{ planInfo.nome }}</h3>
            </div>
            
            <div class="plan-stats">
                <div class="stat-item">
                    <span class="stat-label">Pacientes:</span>
                    <span class="stat-value">{{ stats.pacientes_count }} / {{ stats.limite_pacientes }}</span>
                </div>
                
                <div class="stat-item" v-if="!canAddPaciente">
                    <span class="stat-warning">
                        <i class="pi pi-exclamation-triangle"></i>
                        Limite atingido
                    </span>
                </div>
            </div>

            <div class="plan-features">
                <h4 class="features-title">Recursos disponíveis:</h4>
                <ul class="features-list">
                    <li class="feature-item" :class="{ 'available': planStore.podeAcessarModulo('dashboard') }">
                        <i class="pi" :class="planStore.podeAcessarModulo('dashboard') ? 'pi-check text-green-500' : 'pi-times text-red-500'"></i>
                        <span>Dashboard</span>
                    </li>
                    <li class="feature-item" :class="{ 'available': planStore.podeAcessarModulo('gestao_financeira') }">
                        <i class="pi" :class="planStore.podeAcessarModulo('gestao_financeira') ? 'pi-check text-green-500' : 'pi-times text-red-500'"></i>
                        <span>Gestão Financeira</span>
                    </li>
                    <li class="feature-item" :class="{ 'available': planStore.podeAcessarModulo('prontuarios_pdf') }">
                        <i class="pi" :class="planStore.podeAcessarModulo('prontuarios_pdf') ? 'pi-check text-green-500' : 'pi-times text-red-500'"></i>
                        <span>Prontuários PDF</span>
                    </li>
                    <li class="feature-item" :class="{ 'available': planStore.podeAcessarModulo('agendamentos') }">
                        <i class="pi" :class="planStore.podeAcessarModulo('agendamentos') ? 'pi-check text-green-500' : 'pi-times text-red-500'"></i>
                        <span>Agendamentos</span>
                    </li>
                    <li class="feature-item" :class="{ 'available': planStore.podeAcessarModulo('backup_automatico') }">
                        <i class="pi" :class="planStore.podeAcessarModulo('backup_automatico') ? 'pi-check text-green-500' : 'pi-times text-red-500'"></i>
                        <span>Backup Automático</span>
                    </li>
                </ul>
            </div>

            <div class="plan-actions" v-if="!isVitalicio && planInfo.nome !== 'Vitalício'">
                <Button 
                    label="Fazer Upgrade" 
                    class="upgrade-btn"
                    @click="showUpgradeModal = true"
                />
            </div>
        </div>

        <!-- Modal de Upgrade (futuro) -->
        <Dialog 
            v-model:visible="showUpgradeModal" 
            modal 
            header="Fazer Upgrade do Plano"
            class="upgrade-dialog"
        >
            <div class="upgrade-content">
                <p>Funcionalidade de upgrade será implementada em breve!</p>
                <p>Entre em contato conosco para fazer o upgrade do seu plano.</p>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { planService } from '@/services';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

export default {
    name: 'PlanInfoWidget',
    components: {
        Button,
        Dialog
    },
    data() {
        return {
            planInfo: {
                nome: 'Carregando...',
                limite_pacientes: 0,
                features: {
                    dashboard: false,
                    gestao_financeira: false,
                    prontuarios_pdf: false,
                    agendamentos: false,
                    backup_automatico: false
                }
            },
            stats: {
                pacientes_count: 0,
                limite_pacientes: 0,
                can_add_paciente: false
            },
            loading: true,
            showUpgradeModal: false
        };
    },
    computed: {
        isVitalicio() {
            return this.planInfo.nome === 'Vitalício';
        },
        canAddPaciente() {
            return this.stats.can_add_paciente;
        }
    },
    async mounted() {
        await this.loadPlanInfo();
    },
    methods: {
        async loadPlanInfo() {
            try {
                this.loading = true;
                const response = await planService.getUserPlanInfo();
                this.planInfo = response.plano;
                this.stats = response.stats;
            } catch (error) {
                console.error('Erro ao carregar informações do plano:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.plan-info-widget {
    @apply bg-surface-0 dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700;
}

.plan-card {
    @apply space-y-4;
}

.plan-card.vitalicio {
    @apply border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20;
}

.plan-header {
    @apply flex items-center gap-3 mb-4;
}

.plan-title {
    @apply text-xl font-bold text-surface-900 dark:text-surface-100;
}

.plan-stats {
    @apply space-y-2;
}

.stat-item {
    @apply flex justify-between items-center;
}

.stat-label {
    @apply text-surface-600 dark:text-surface-400 font-medium;
}

.stat-value {
    @apply text-surface-900 dark:text-surface-100 font-semibold;
}

.stat-warning {
    @apply text-orange-600 dark:text-orange-400 text-sm flex items-center gap-2;
}

.plan-features {
    @apply space-y-3;
}

.features-title {
    @apply text-lg font-semibold text-surface-900 dark:text-surface-100;
}

.features-list {
    @apply space-y-2;
}

.feature-item {
    @apply flex items-center gap-3 text-surface-700 dark:text-surface-300;
}

.feature-item.available {
    @apply text-surface-900 dark:text-surface-100;
}

.plan-actions {
    @apply pt-4 border-t border-surface-200 dark:border-surface-700;
}

.upgrade-btn {
    @apply w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700;
}

.upgrade-dialog {
    @apply max-w-md;
}

.upgrade-content {
    @apply space-y-4 text-center;
}
</style> 