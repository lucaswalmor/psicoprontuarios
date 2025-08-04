<template>
    <div v-if="isLoading" class="loading-overlay">
        <div class="loading-container">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <div class="loading-text">
                <h3>Carregando...</h3>
                <p>Por favor, aguarde</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingGlobal',
    data() {
        return {
            isLoading: false,
            requestCount: 0
        };
    },
    methods: {
        show() {
            this.requestCount++;
            this.isLoading = true;
        },
        hide() {
            this.requestCount--;
            if (this.requestCount <= 0) {
                this.requestCount = 0;
                this.isLoading = false;
            }
        }
    },
    mounted() {
        // Expor métodos globalmente
        this.$root.$loading = {
            show: this.show.bind(this),
            hide: this.hide.bind(this)
        };
        
        // Também expor no window para acesso global
        window.$loading = {
            show: this.show.bind(this),
            hide: this.hide.bind(this)
        };
    }
};
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-in-out;
}

.loading-container {
    text-align: center;
    color: white;
}

.loading-spinner {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid #fff;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(1) {
    animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
    width: 60px;
    height: 60px;
    top: 10px;
    left: 10px;
    border-top-color: #4f46e5;
    animation-delay: 0.2s;
}

.spinner-ring:nth-child(3) {
    width: 40px;
    height: 40px;
    top: 20px;
    left: 20px;
    border-top-color: #06b6d4;
    animation-delay: 0.4s;
}

.loading-text h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #fff;
}

.loading-text p {
    font-size: 1rem;
    color: #d1d5db;
    margin: 0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Responsividade */
@media (max-width: 768px) {
    .loading-spinner {
        width: 60px;
        height: 60px;
    }
    
    .spinner-ring:nth-child(2) {
        width: 45px;
        height: 45px;
        top: 7.5px;
        left: 7.5px;
    }
    
    .spinner-ring:nth-child(3) {
        width: 30px;
        height: 30px;
        top: 15px;
        left: 15px;
    }
    
    .loading-text h3 {
        font-size: 1.25rem;
    }
    
    .loading-text p {
        font-size: 0.875rem;
    }
}
</style> 