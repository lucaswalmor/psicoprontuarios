<template>
    <div class="bot-docs-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <header class="border-b border-surface-200 dark:border-surface-700">
            <div class="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <span class="font-bold text-xl text-surface-900 dark:text-surface-0">PsicoProntuários — Docs do bot</span>
                <router-link to="/bot-docs" class="text-primary font-medium">← Índice</router-link>
            </div>
        </header>

        <main class="container mx-auto px-4 py-10 max-w-5xl">
            <div v-if="!docMeta" class="text-center py-16">
                <h1 class="text-2xl font-bold mb-2">Manual não encontrado</h1>
                <router-link to="/bot-docs" class="text-primary">Voltar ao índice</router-link>
            </div>

            <template v-else>
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ docMeta.title }}</h1>
                    <p class="text-surface-600 dark:text-surface-400">{{ docMeta.description }}</p>
                </div>

                <div class="card border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 mb-6">
                    <p class="text-sm font-semibold text-surface-900 dark:text-surface-0 mb-2">URL para o n8n (HTTP Request — GET)</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <code class="text-xs break-all flex-1 bg-surface-0 dark:bg-surface-900 px-3 py-2 rounded border border-surface-200 dark:border-surface-700">
                            {{ urlN8n }}
                        </code>
                        <Button label="Copiar URL" size="small" @click="copiarUrl" />
                    </div>
                    <p class="text-xs text-surface-500 dark:text-surface-400 mt-2 mb-0">
                        Arquivo: <code>{{ docMeta.file }}</code>
                    </p>
                </div>

                <div v-if="loading" class="text-center py-12 text-surface-500">Carregando manual…</div>

                <div
                    v-else-if="erro"
                    class="card border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300"
                >
                    {{ erro }}
                </div>

                <div
                    v-else
                    class="card border border-surface-200 dark:border-surface-700 rounded-xl p-6 overflow-x-auto"
                >
                    <pre class="bot-docs-pre m-0 whitespace-pre-wrap text-sm text-surface-800 dark:text-surface-200">{{ conteudo }}</pre>
                </div>
            </template>
        </main>
    </div>
</template>

<script>
import Button from 'primevue/button';
import { findBotDocBySlug, getBotDocPublicUrl, getBotDocRawPath } from '@/config/botDocs';

export default {
    name: 'BotDocView',
    components: { Button },
    props: {
        slug: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            conteudo: '',
            loading: true,
            erro: null
        };
    },
    computed: {
        docMeta() {
            return findBotDocBySlug(this.slug);
        },
        urlN8n() {
            if (!this.docMeta) return '';
            return getBotDocPublicUrl(this.docMeta.file, window.location.origin);
        }
    },
    watch: {
        slug: {
            immediate: true,
            handler() {
                this.carregar();
            }
        }
    },
    methods: {
        async carregar() {
            if (!this.docMeta) {
                this.loading = false;
                return;
            }

            this.loading = true;
            this.erro = null;
            this.conteudo = '';

            try {
                const response = await fetch(getBotDocRawPath(this.docMeta.file));
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                this.conteudo = await response.text();
            } catch {
                this.erro =
                    'Não foi possível carregar o manual. Execute npm run sync:bot-docs (ou npm run dev) para copiar os arquivos para public/bot-docs/.';
            } finally {
                this.loading = false;
            }
        },
        async copiarUrl() {
            try {
                await navigator.clipboard.writeText(this.urlN8n);
            } catch {
                window.prompt('Copie a URL:', this.urlN8n);
            }
        }
    }
};
</script>

<style scoped>
.bot-docs-pre {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    line-height: 1.55;
}
</style>
