import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                // Evita Deprecation Warning [legacy-js-api] do Dart Sass (API antiga).
                api: 'modern',
            },
        },
    },
    optimizeDeps: {
        noDiscovery: true,
        include: ['quill', 'quill-delta', '@primeuix/styles/drawer'],
        exclude: ['@quilljs/quill']
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        conditions: ['import', 'module', 'browser', 'default']
    },
    define: {
        global: 'globalThis'
    }
});
