<template>
    <div class="bot-docs-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <header class="border-b border-surface-200 dark:border-surface-700">
            <div class="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <span class="font-bold text-xl text-surface-900 dark:text-surface-0">PsicoProntuários — Docs do bot</span>
                <router-link to="/" class="text-primary font-medium">← Voltar</router-link>
            </div>
        </header>

        <main class="container mx-auto px-4 py-10 max-w-5xl">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-3">Base de conhecimento (n8n)</h1>
                <p class="text-surface-600 dark:text-surface-400 leading-relaxed">
                    Cada manual abaixo fica disponível em URL pública de <strong>texto puro</strong> (<code>.md</code>).
                    No n8n, use o nó <strong>HTTP Request</strong> (GET) apontando para a coluna <strong>URL n8n</strong> — não use a rota de preview
                    (<code>/bot-docs/:slug</code>), que retorna HTML do app Vue.
                </p>
            </div>

            <div class="card border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                            <tr>
                                <th class="text-left p-3 font-semibold">Manual</th>
                                <th class="text-left p-3 font-semibold">Preview</th>
                                <th class="text-left p-3 font-semibold">URL n8n (GET)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="doc in docs"
                                :key="doc.slug"
                                class="border-t border-surface-200 dark:border-surface-700"
                            >
                                <td class="p-3 align-top">
                                    <div class="font-semibold text-surface-900 dark:text-surface-0">{{ doc.title }}</div>
                                    <div class="text-surface-500 dark:text-surface-400 text-xs mt-1">{{ doc.description }}</div>
                                </td>
                                <td class="p-3 align-top whitespace-nowrap">
                                    <router-link
                                        :to="`/bot-docs/${doc.slug}`"
                                        class="text-primary font-medium hover:underline"
                                    >
                                        Abrir
                                    </router-link>
                                </td>
                                <td class="p-3 align-top">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <code class="text-xs break-all bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">
                                            {{ urlPublica(doc.file) }}
                                        </code>
                                        <Button
                                            label="Copiar"
                                            size="small"
                                            severity="secondary"
                                            outlined
                                            @click="copiarUrl(doc.file)"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p class="text-sm text-surface-500 dark:text-surface-400 mt-6">
                Manifest JSON: <code>{{ manifestUrl }}</code>
            </p>
        </main>
    </div>
</template>

<script>
import Button from 'primevue/button';
import { BOT_DOCS, getBotDocPublicUrl } from '@/config/botDocs';

export default {
    name: 'BotDocsIndex',
    components: { Button },
    data() {
        return {
            docs: BOT_DOCS
        };
    },
    computed: {
        manifestUrl() {
            return `${window.location.origin}/bot-docs/manifest.json`;
        }
    },
    methods: {
        urlPublica(file) {
            return getBotDocPublicUrl(file, window.location.origin);
        },
        async copiarUrl(file) {
            try {
                await navigator.clipboard.writeText(this.urlPublica(file));
                this.$toast?.add?.({
                    severity: 'success',
                    summary: 'Copiado',
                    detail: 'URL copiada para a área de transferência.',
                    life: 2500
                });
            } catch {
                window.prompt('Copie a URL:', this.urlPublica(file));
            }
        }
    }
};
</script>
