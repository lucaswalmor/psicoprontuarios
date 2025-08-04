<template>
    <div class="plan-loading-overlay" v-if="loading">
        <div class="plan-loading-content">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
            <p class="loading-text">Verificando permissões...</p>
        </div>
    </div>
</template>

<script>
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'PlanLoading',
    components: {
        ProgressSpinner
    },
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
.plan-loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.plan-loading-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loading-text {
    margin-top: 1rem;
    color: #666;
    font-size: 1rem;
}
</style> 