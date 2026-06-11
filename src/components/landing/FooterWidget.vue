<template>
    <footer class="footer">
        <div class="footer-content">
            <!-- Main Footer com 3 colunas -->
            <div class="footer-main">
                <!-- Coluna 1: Logo e Nome -->
                <div class="footer-brand">
                    <div class="brand-container">
                        <img :src="logo" alt="PsicoProntuários" class="footer-logo" />
                        <h4 class="brand-title">PsicoProntuários</h4>
                    </div>
                </div>

                <!-- Coluna 2: Menu de Navegação -->
                <div class="footer-navigation">
                    <nav class="nav-menu">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <a @click="smoothScroll('hero')" class="nav-link">
                                    <span>Início</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a @click="smoothScroll('features')" class="nav-link">
                                    <span>Recursos</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a @click="smoothScroll('highlights')" class="nav-link">
                                    <span>Destaques</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a @click="smoothScroll('pricing')" class="nav-link">
                                    <span>Planos</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a @click="smoothScroll('leads')" class="nav-link">
                                    <span>Contato</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Coluna 3: Redes Sociais -->
                <div class="footer-social">
                    <h5 class="social-title">Siga-nos</h5>
                    <div class="social-links">
                        <a href="https://www.instagram.com/psicoprontuarios/" class="social-link" target="_blank" aria-label="Instagram">
                            <i class="pi pi-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/psicoprontuarios/" class="social-link" target="_blank" aria-label="LinkedIn">
                            <i class="pi pi-linkedin"></i>
                        </a>
                        <a href="https://www.facebook.com/psicoprontuarios/" class="social-link" target="_blank" aria-label="Facebook">
                            <i class="pi pi-facebook"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p class="copyright">
                        © {{ new Date().getFullYear() }} PsicoProntuários. Todos os direitos reservados.
                        <span class="copyright-lgpd">
                            Tratamento de dados pessoais em linha com a LGPD e o sigilo profissional.
                        </span>
                    </p>
                    <div class="footer-bottom-links">
                        <a href="#" class="bottom-link">Termos</a>
                        <a href="#" class="bottom-link">Privacidade</a>
                        <a href="#" class="bottom-link">Cookies</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import logo from '@/assets/img/logo.webp';

function smoothScroll(id) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>

<style scoped>
.footer {
    @apply bg-surface-100 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700;
}

.footer-content {
    @apply py-12;
}

.footer-main {
    @apply grid grid-cols-1 md:grid-cols-3 gap-8 mb-8;
}

/* Coluna 1: Logo e Nome */
.footer-brand {
    @apply flex justify-center md:justify-start;
}

.brand-container {
    @apply flex items-center gap-3;
}

.footer-logo {
    width: 60px;
    height: 60px;
}

.brand-title {
    @apply text-2xl font-bold text-surface-900 dark:text-surface-0;
}

/* Coluna 2: Menu de Navegação */
.footer-navigation {
    @apply flex justify-center;
}

.nav-menu {
    @apply flex;
}

.nav-list {
    @apply flex flex-col gap-2;
}

.nav-item {
    @apply list-none;
}

.nav-link {
    @apply text-surface-600 dark:text-surface-300 hover:text-primary transition-colors duration-200 cursor-pointer text-center md:text-left font-medium;
}

/* Coluna 3: Redes Sociais */
.footer-social {
    @apply flex flex-col items-center md:items-end;
}

.social-title {
    @apply text-lg font-semibold text-surface-900 dark:text-surface-0 mb-4;
}

.social-links {
    @apply flex gap-4;
}

.social-link {
    @apply w-12 h-12 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-primary hover:text-white transition-all duration-300 text-xl;
}

/* Footer Bottom */
.footer-bottom {
    @apply pt-8 border-t border-surface-200 dark:border-surface-700;
}

.footer-bottom-content {
    @apply flex flex-col md:flex-row justify-between items-center gap-4;
}

.copyright {
    @apply text-surface-600 dark:text-surface-300 text-sm max-w-2xl text-center md:text-left;
}

.copyright-lgpd {
    @apply block mt-2 text-surface-500 dark:text-surface-400 text-xs leading-snug;
}

.footer-bottom-links {
    @apply flex gap-6;
}

.bottom-link {
    @apply text-surface-600 dark:text-surface-300 hover:text-primary text-sm transition-colors duration-200;
}

/* Responsividade Mobile */
@media (max-width: 768px) {
    .footer-content {
        @apply py-8;
    }
    
    .footer-main {
        @apply grid-cols-1 gap-8 text-center;
    }
    
    .footer-brand,
    .footer-navigation,
    .footer-social {
        @apply justify-center items-center;
    }
    
    .nav-list {
        @apply flex-row flex-wrap justify-center gap-4;
    }
    
    .nav-link {
        @apply text-center;
    }
    
    .social-links {
        @apply justify-center;
    }
}

/* Estados de hover e focus para acessibilidade */
.nav-link:focus,
.social-link:focus,
.bottom-link:focus {
    @apply outline-2 outline-primary outline-offset-2;
}

.social-link:hover {
    @apply scale-110 shadow-lg;
}
</style>
