<script setup>
import { computed, onMounted } from 'vue';
import { usePlanStore } from '@/store/plan';
import AppMenuItem from './AppMenuItem.vue';

const planStore = usePlanStore();

// Carregar informações do plano
const loadPlanInfo = async () => {
    try {
        // Se não tem dados no store, carregar do localStorage ou servidor
        if (!planStore.hasPlanData) {
            planStore.loadPlanFromStorage();
            
            // Se ainda não tem dados, buscar do servidor
            if (!planStore.hasPlanData) {
                await planStore.fetchPlanInfo();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar informações do plano:', error);
    }
};

onMounted(() => {
    loadPlanInfo();
});

// Modelo do menu filtrado baseado no plano
const model = computed(() => {
    const baseMenu = [
        {
            label: 'Home',
            items: [
                {
                    label: 'Dashboard', 
                    icon: 'pi pi-fw pi-home', 
                    to: '/dashboard',
                    requiredFeature: 'dashboard'
                },
                {
                    label: 'Gestão Financeira', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: '/financeiro',
                    requiredFeature: 'gestao_financeira'
                },
                {
                    label: 'Pacientes', 
                    icon: 'pi pi-fw pi-user', 
                    to: '/pacientes',
                    requiredFeature: null // Sempre disponível
                },
                {
                    label: 'Agendamentos', 
                    icon: 'pi pi-fw pi-calendar', 
                    to: '/agendamentos',
                    requiredFeature: 'agendamentos'
                },
            ]
        },
        {
            label: 'Configurações',
            items: [
                {
                    label: 'Gerenciar Plano', 
                    icon: 'pi pi-fw pi-cog', 
                    to: '/configuracoes',
                    requiredFeature: null // Sempre disponível
                },
                {
                    label: 'FAQ - Dúvidas', 
                    icon: 'pi pi-fw pi-question-circle', 
                    to: '/faq',
                    requiredFeature: null // Sempre disponível
                }
            ]
        }
    ];

    // Obter dados do store
    const planInfo = planStore.planInfo;
    const isVitalicio = planStore.isVitalicio;

    // Filtrar itens baseado no plano
    return baseMenu.map(section => ({
        ...section,
        items: section.items.filter(item => {
            // Usuários vitalícios têm acesso total
            if (isVitalicio) {
                return true;
            }
            
            // Se não tem feature requerida, sempre disponível
            if (!item.requiredFeature) {
                return true;
            }
            
            // Se o plano está pausado, verificar se a feature é permitida
            if (planStore.isPlanPaused) {
                // Quando pausado, apenas algumas features são permitidas
                const allowedWhenPaused = ['dashboard', null]; // null = sempre disponível
                return allowedWhenPaused.includes(item.requiredFeature);
            }
            
            // Verificar se a feature está disponível no plano
            return planInfo?.features?.[item.requiredFeature] || false;
        })
    }));
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
