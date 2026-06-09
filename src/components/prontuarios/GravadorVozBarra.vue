<template>
    <div class="voz-barra" :class="{ 'voz-barra--processando': processando }">
        <button
            type="button"
            class="voz-barra__btn voz-barra__btn--lixeira"
            :disabled="processando"
            title="Descartar gravação"
            aria-label="Descartar gravação"
            @click="$emit('cancelar')"
        >
            <i class="pi pi-trash"></i>
        </button>

        <template v-if="processando">
            <span class="voz-barra__processando">
                <i class="pi pi-spin pi-spinner"></i>
                Processando áudio…
            </span>
        </template>

        <template v-else>
            <span class="voz-barra__rec" :class="{ 'voz-barra__rec--pausado': pausado }" aria-hidden="true"></span>
            <span class="voz-barra__timer">{{ duracaoFormatada }}</span>

            <div class="voz-barra__onda" aria-hidden="true">
                <span
                    v-for="(nivel, i) in niveisExibidos"
                    :key="i"
                    class="voz-barra__barra"
                    :style="{ height: `${nivel}%` }"
                ></span>
            </div>

            <button
                type="button"
                class="voz-barra__btn voz-barra__btn--pausa"
                :title="pausado ? 'Continuar gravação' : 'Pausar gravação'"
                :aria-label="pausado ? 'Continuar gravação' : 'Pausar gravação'"
                @click="$emit('alternar-pausa')"
            >
                <i :class="pausado ? 'pi pi-play' : 'pi pi-pause'"></i>
            </button>
        </template>

        <button
            type="button"
            class="voz-barra__btn voz-barra__btn--enviar"
            :disabled="processando || !gravando"
            title="Enviar para transcrição"
            aria-label="Enviar para transcrição"
            @click="$emit('enviar')"
        >
            <i class="pi pi-send"></i>
        </button>
    </div>
</template>

<script>
const BARRAS = 36;

export default {
    name: 'GravadorVozBarra',
    props: {
        gravando: { type: Boolean, default: false },
        pausado: { type: Boolean, default: false },
        processando: { type: Boolean, default: false },
        duracao: { type: Number, default: 0 },
        niveis: { type: Array, default: () => [] },
    },
    emits: ['cancelar', 'alternar-pausa', 'enviar'],
    computed: {
        duracaoFormatada() {
            const total = Math.max(0, this.duracao);
            const min = Math.floor(total / 60);
            const seg = total % 60;
            return `${min}:${String(seg).padStart(2, '0')}`;
        },
        niveisExibidos() {
            const base = Array.isArray(this.niveis) ? this.niveis : [];
            if (base.length >= BARRAS) {
                return base.slice(-BARRAS);
            }
            const vazio = Array(BARRAS - base.length).fill(8);
            return [...vazio, ...base];
        },
    },
};
</script>

<style scoped>
.voz-barra {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    max-width: 100%;
    padding: 0.45rem 0.55rem 0.45rem 0.75rem;
    border-radius: 999px;
    background: var(--surface-100, #f4f4f5);
    border: 1px solid var(--surface-200, #e4e4e7);
    min-height: 3rem;
}

.voz-barra--processando {
    justify-content: flex-start;
}

.voz-barra__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    color: var(--text-color-secondary, #71717a);
    transition: color 0.15s ease, transform 0.15s ease;
}

.voz-barra__btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.voz-barra__btn:not(:disabled):hover {
    color: var(--text-color, #18181b);
}

.voz-barra__btn--lixeira {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
}

.voz-barra__btn--lixeira:not(:disabled):hover {
    color: var(--red-500, #ef4444);
}

.voz-barra__btn--pausa {
    width: 2rem;
    height: 2rem;
    font-size: 0.95rem;
    color: var(--primary-color, #7c3aed);
}

.voz-barra__btn--enviar {
    width: 2.35rem;
    height: 2.35rem;
    border-radius: 50%;
    background: var(--green-500, #22c55e);
    color: #fff;
    margin-left: auto;
    font-size: 0.9rem;
}

.voz-barra__btn--enviar:not(:disabled):hover {
    background: var(--green-600, #16a34a);
    color: #fff;
    transform: scale(1.04);
}

.voz-barra__rec {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
    animation: voz-pulsar 1.2s ease-in-out infinite;
}

.voz-barra__rec--pausado {
    animation: none;
    opacity: 0.45;
}

.voz-barra__timer {
    font-variant-numeric: tabular-nums;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-color, #18181b);
    min-width: 2.25rem;
    flex-shrink: 0;
}

.voz-barra__onda {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 2rem;
    min-width: 0;
    overflow: hidden;
    padding: 0 0.25rem;
}

.voz-barra__barra {
    width: 3px;
    min-height: 4px;
    border-radius: 2px;
    background: var(--primary-300, #c4b5fd);
    transition: height 0.08s ease;
    align-self: center;
}

.voz-barra__processando {
    flex: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-color-secondary, #71717a);
}

@keyframes voz-pulsar {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.55;
        transform: scale(0.92);
    }
}

:global(.app-dark) .voz-barra,
:global([data-theme='dark']) .voz-barra {
    background: var(--surface-800, #27272a);
    border-color: var(--surface-700, #3f3f46);
}

:global(.app-dark) .voz-barra__barra,
:global([data-theme='dark']) .voz-barra__barra {
    background: var(--primary-400, #a78bfa);
}
</style>
