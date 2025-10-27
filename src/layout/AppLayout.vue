<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref, watch, onMounted } from 'vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import PlanLoading from '@/components/PlanLoading.vue';
import ChatAtendimento from '@/components/ChatAtendimento.vue';
import DialogNps from '@/components/dialogs/DialogNps.vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);
const planLoading = ref(false);
const showNpsDialog = ref(false);

// Event listeners para loading de plano
onMounted(() => {
    window.addEventListener('plan-check-start', () => {
        planLoading.value = true;
        window.planLoadingActive = true; // Variável global para o axios
    });
    
    window.addEventListener('plan-check-end', () => {
        planLoading.value = false;
        window.planLoadingActive = false; // Variável global para o axios
    });
    
    // Verificar se precisa mostrar dialog NPS
    checkNpsRequired();
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}

// Função para verificar se precisa mostrar dialog NPS
async function checkNpsRequired() {
    try {
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        
        // Verificar se a pesquisa NPS é necessária E se ainda não foi respondida nesta sessão
        const npsRespondido = sessionStorage.getItem('nps_respondido');
        
        if (usuario.pesquisa_nps === true && !npsRespondido) {
            showNpsDialog.value = true;
        }
    } catch (error) {
        console.error('Erro ao verificar pesquisa NPS:', error);
    }
}

// Função para lidar com sucesso da pesquisa NPS
function handleNpsSuccess() {
    showNpsDialog.value = false;
    // Marcar que o NPS foi respondido nesta sessão
    sessionStorage.setItem('nps_respondido', 'true');
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="container-fluid">
            <!-- <div class="layout-main"> -->
                <Breadcrumb />
                <router-view></router-view>
            </div>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
    <PlanLoading :loading="planLoading" />
    <ChatAtendimento />
    
    <!-- Dialog NPS -->
    <DialogNps 
        v-model:visible="showNpsDialog"
        @success="handleNpsSuccess"
    />
</template>
