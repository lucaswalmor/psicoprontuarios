<template>
    <div class="seja-parceiro-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <!-- Header -->
        <header class="bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <router-link to="/" class="text-surface-900 dark:text-surface-0 font-bold text-xl flex items-center gap-2">
                        PsicoProntuários
                    </router-link>
                    <a :href="urlCadastro" class="btn-parceiro-cta px-5 py-2 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity">
                        Quero ser parceiro
                    </a>
                </div>
            </div>
        </header>

        <!-- Hero -->
        <section class="container mx-auto px-4 py-20 text-center">
            <div class="max-w-3xl mx-auto">
                <span class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
                    Programa de Embaixadores
                </span>
                <h1 class="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                    Indique o PsicoProntuários e<br />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ganhe por cada indicado</span>
                </h1>
                <p class="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-2xl mx-auto">
                    Você é psicólogo(a) com audiência digital? Torne-se parceiro e ajude seus colegas a organizarem a vida profissional enquanto gera renda recorrente.
                </p>
                <a :href="urlCadastro" class="inline-block px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity shadow-lg">
                    Quero me cadastrar agora
                </a>
                <p class="text-xs text-surface-400 mt-3">Aprovação necessária. Sem custo para se cadastrar.</p>
            </div>
        </section>

        <!-- Modelos de parceria -->
        <section class="container mx-auto px-4 pb-20">
            <div class="max-w-5xl mx-auto">
                <h2 class="text-2xl font-bold text-center text-surface-900 dark:text-surface-100 mb-2">Escolha como quer ser recompensado</h2>
                <p class="text-center text-surface-500 dark:text-surface-400 mb-10 text-sm">Você escolhe uma vez e o modelo não pode ser alterado depois.</p>

                <div v-if="loadingModelos" class="flex justify-center py-8">
                    <span class="text-surface-400">Carregando modelos…</span>
                </div>

                <div v-else class="modelos-grid">
                    <div
                        v-for="modelo in modelos"
                        :key="modelo.id"
                        class="modelo-card"
                    >
                        <div class="modelo-nome">{{ modelo.nome }}</div>
                        <div class="modelo-valor">{{ modelo.valor_destaque }}</div>
                        <ul class="modelo-beneficios">
                            <li v-for="(b, i) in modelo.beneficios" :key="i" class="beneficio-item">
                                <span class="beneficio-check">✓</span>
                                {{ b }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Como funciona -->
        <section class="bg-surface-50 dark:bg-surface-800 py-16">
            <div class="container mx-auto px-4 max-w-3xl text-center">
                <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-10">Como funciona?</h2>
                <div class="passos-grid">
                    <div v-for="passo in passos" :key="passo.n" class="passo-item">
                        <div class="passo-numero">{{ passo.n }}</div>
                        <div class="passo-titulo">{{ passo.titulo }}</div>
                        <div class="passo-desc">{{ passo.desc }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Final -->
        <section class="container mx-auto px-4 py-20 text-center">
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">Pronto para começar?</h2>
            <p class="text-surface-500 dark:text-surface-400 mb-6 text-sm">Cadastre-se no portal, escolha seu modelo e aguarde a aprovação.</p>
            <a :href="urlCadastro" class="inline-block px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity shadow-lg">
                Criar minha conta de parceiro
            </a>
        </section>

        <!-- Footer mínimo -->
        <footer class="border-t border-surface-200 dark:border-surface-700 py-6">
            <p class="text-center text-xs text-surface-400">
                © {{ new Date().getFullYear() }} PsicoProntuários · 
                <router-link to="/" class="hover:underline">Voltar ao site</router-link>
            </p>
        </footer>
    </div>
</template>

<script>
import api from '@/utils/axios'

const PORTAL_URL = 'https://parceiros.psicoprontuarios.com.br/cadastro'

export default {
    name: 'SejaParceiro',

    data() {
        return {
            modelos: [],
            loadingModelos: true,
            passos: [
                { n: 1, titulo: 'Cadastre-se', desc: 'Crie sua conta gratuita no portal de parceiros.' },
                { n: 2, titulo: 'Escolha o modelo', desc: 'Selecione como quer ser recompensado pelas indicações.' },
                { n: 3, titulo: 'Divulgue e ganhe', desc: 'Compartilhe seu link exclusivo e acompanhe suas comissões.' },
            ],
        }
    },

    computed: {
        urlCadastro() { return PORTAL_URL },
    },

    async created() {
        try {
            const { data } = await api.get('/parceiro/programa/resumo')
            this.modelos = data.modelos
        } catch {
            // silencioso — exibir sem modelos
        } finally {
            this.loadingModelos = false
        }
    },
}
</script>

<style scoped>
.modelos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
}

@media (max-width: 640px) {
    .modelos-grid {
        grid-template-columns: 1fr;
    }
}

.modelo-card {
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    background: var(--surface-card, #fff);
    transition: border-color 0.2s;
}

.modelo-card:hover {
    border-color: #3b82f6;
}

.dark .modelo-card {
    background: var(--surface-800, #1e293b);
    border-color: #374151;
}

.modelo-nome {
    font-size: 1rem;
    font-weight: 700;
    color: var(--surface-900, #111827);
    margin-bottom: 0.25rem;
}

.modelo-valor {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 0.75rem;
}

.modelo-beneficios {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.beneficio-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
}

.beneficio-check {
    color: #22c55e;
    flex-shrink: 0;
    margin-top: 1px;
}

/* Passos */
.passos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

@media (max-width: 640px) {
    .passos-grid {
        grid-template-columns: 1fr;
    }
}

.passo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.passo-numero {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background: #2563eb;
    color: #fff;
    font-weight: 700;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.passo-titulo {
    font-weight: 600;
    color: var(--surface-900, #111827);
    font-size: 0.95rem;
}

.passo-desc {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
}
</style>
