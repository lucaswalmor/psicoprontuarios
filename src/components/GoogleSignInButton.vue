<template>
    <div class="google-signin-container">
        <div 
            ref="googleSignInButton" 
            class="google-signin-button"
            :class="{ 'loading': isLoading }"
        >
            <div v-if="isLoading" class="loading-spinner">
                <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="4" fill="transparent" />
            </div>
            <div v-else class="google-button-content">
                <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="google-button-text">{{ buttonText }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import GOOGLE_CONFIG from '@/config/google.js';

export default {
    name: 'GoogleSignInButton',
    props: {
        buttonText: {
            type: String,
            default: 'Continuar com Google'
        },
        theme: {
            type: String,
            default: 'outline' // 'outline' ou 'filled_blue'
        },
        size: {
            type: String,
            default: 'large' // 'large' ou 'medium'
        }
    },
    emits: ['success', 'error'],
    setup(props, { emit }) {
        const googleSignInButton = ref(null);
        const isLoading = ref(false);
        let googleInstance = null;

        const handleCredentialResponse = (response) => {
            isLoading.value = true;
            
            try {
                // Emitir evento de sucesso com a credencial
                emit('success', response.credential);
            } catch (error) {
                console.error('Erro ao processar resposta do Google:', error);
                emit('error', error);
            } finally {
                isLoading.value = false;
            }
        };

        const initializeGoogleSignIn = () => {
            if (typeof window.google !== 'undefined' && window.google.accounts) {
                try {
                    // Configurar o callback global
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CONFIG.client_id,
                        callback: handleCredentialResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });

                    // Renderizar o botão
                    if (googleSignInButton.value) {
                        window.google.accounts.id.renderButton(googleSignInButton.value, {
                            theme: props.theme,
                            size: props.size,
                            type: 'standard',
                            text: 'signin_with',
                            shape: 'rectangular',
                            logo_alignment: 'left',
                            width: '100%',
                        });
                    }
                } catch (error) {
                    console.error('Erro ao inicializar Google Sign-In:', error);
                    emit('error', error);
                }
            } else {
                console.warn('Google Identity Services não carregado');
            }
        };

        onMounted(() => {
            // Aguardar o Google Identity Services carregar
            if (typeof window.google !== 'undefined' && window.google.accounts) {
                initializeGoogleSignIn();
            } else {
                // Aguardar o script carregar
                const checkGoogle = setInterval(() => {
                    if (typeof window.google !== 'undefined' && window.google.accounts) {
                        clearInterval(checkGoogle);
                        initializeGoogleSignIn();
                    }
                }, 100);

                // Timeout de segurança
                setTimeout(() => {
                    clearInterval(checkGoogle);
                    if (typeof window.google === 'undefined') {
                        console.error('Google Identity Services não carregou');
                        emit('error', new Error('Google Identity Services não carregou'));
                    }
                }, 10000);
            }
        });

        onUnmounted(() => {
            // Limpar recursos se necessário
            if (googleInstance) {
                googleInstance = null;
            }
        });

        return {
            googleSignInButton,
            isLoading,
        };
    }
};
</script>

<style scoped>
.google-signin-container {
    width: 100%;
    margin-bottom: 1rem;
}

.google-signin-button {
    width: 100%;
    height: 48px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.google-signin-button:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-color: #c6c6c6;
}

.google-signin-button:active {
    background: #f8f9fa;
}

.google-signin-button.loading {
    cursor: not-allowed;
    opacity: 0.7;
}

.google-button-content {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Google Sans', Roboto, arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #3c4043;
}

.google-icon {
    flex-shrink: 0;
}

.google-button-text {
    white-space: nowrap;
}

.loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Tema filled_blue */
.google-signin-button.filled_blue {
    background: #1a73e8;
    border-color: #1a73e8;
    color: white;
}

.google-signin-button.filled_blue:hover {
    background: #1557b0;
    border-color: #1557b0;
    box-shadow: 0 2px 4px rgba(26, 115, 232, 0.2);
}

.google-signin-button.filled_blue .google-button-content {
    color: white;
}

/* Tamanho medium */
.google-signin-button.medium {
    height: 40px;
}

.google-signin-button.medium .google-button-content {
    font-size: 13px;
}

.google-signin-button.medium .google-icon {
    width: 18px;
    height: 18px;
}

/* Responsividade */
@media (max-width: 480px) {
    .google-signin-button {
        height: 44px;
    }
    
    .google-button-content {
        font-size: 13px;
        gap: 10px;
    }
    
    .google-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
