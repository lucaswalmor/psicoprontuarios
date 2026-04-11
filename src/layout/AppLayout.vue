<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import PlanLoading from '@/components/PlanLoading.vue';
import ChatAtendimento from '@/components/ChatAtendimento.vue';
import { getN8nChatWebhookUrl } from '@/config/environment';
import DialogNps from '@/components/dialogs/DialogNps.vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);
const planLoading = ref(false);
const showNpsDialog = ref(false);

const isDesktop = ref(typeof window !== 'undefined' && window.innerWidth > 991);

const n8nChatWebhookUrl = getN8nChatWebhookUrl();

function updateIsDesktop() {
    isDesktop.value = window.innerWidth > 991;
}

/** Sidebar só é montada quando o menu está “aberto”, para o corpo usar 100% quando fechado. */
const showSidebar = computed(() => {
    if (!isDesktop.value) {
        return layoutState.staticMenuMobileActive;
    }
    if (layoutConfig.menuMode === 'overlay') {
        return layoutState.overlayMenuActive;
    }
    return !layoutState.staticMenuDesktopInactive;
});

// Event listeners para loading de plano
onMounted(() => {
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);

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

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateIsDesktop);
});

watch(isDesktop, (desktop) => {
    if (desktop) {
        layoutState.staticMenuMobileActive = false;
    }
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
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');
    if (!sidebarEl || !topbarEl) return false;

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
        <app-sidebar v-if="showSidebar"></app-sidebar>
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
    <ChatAtendimento :webhook-url="n8nChatWebhookUrl" />
    
    <!-- Dialog NPS -->
    <DialogNps 
        v-model:visible="showNpsDialog"
        @success="handleNpsSuccess"
    />
</template>
