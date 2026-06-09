<template>
    <div class="grid">
        <div class="col-12">
            <ConfiguracaoWhatsappTour
                v-if="podeRecursoPro"
                :key="'wa-tour-' + whatsappTourModo"
                :tour-modo="whatsappTourModo"
            />
            <ConfiguracaoNotificacoesTour v-if="podeRecursoPro && evolutionConectado" />

            <div class="card p-1">
                <div class="p-4 config-tab-body">
                    <div
                        v-if="!podeRecursoPro"
                        class="col-12 d-flex justify-content-center align-items-center p-7"
                    >
                        <PlanoPro />
                    </div>

                    <template v-else>
                        <section class="mb-5">
                            <h5 class="mb-2">WhatsApp</h5>
                            <p class="text-color-secondary mb-4">
                                Conecte seu WhatsApp para enviar mensagens automáticas aos pacientes.
                            </p>
                            <EvolutionConfig
                                :prefetch="evolutionPrefetch"
                                @evolution-state-change="onEvolutionStateChange"
                            />
                        </section>

                        <section v-if="evolutionConectado">
                            <div class="col-12 mb-4" data-tour="tour-config-notif-intro">
                                <h5>Notificações para pacientes</h5>
                                <p class="text-color-secondary m-0">
                                    Configure mensagens automáticas enviadas via WhatsApp para seus pacientes.
                                </p>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card h-100" data-tour="tour-config-notif-datas">
                                        <div class="card-body text-center d-flex flex-column">
                                            <div class="fs-1 mb-2">🎉</div>
                                            <h6 class="card-title notificacao-card-title">Datas Comemorativas</h6>
                                            <p class="card-text small notificacao-card-text">
                                                Configure mensagens automáticas para datas especiais como Natal, Dia das Mães e muito mais.
                                            </p>
                                            <div class="mt-auto">
                                                <Button
                                                    label="Configurar"
                                                    icon="pi pi-cog"
                                                    @click="$router.push('/notificacoes/datas-comemorativas')"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="card h-100" data-tour="tour-config-notif-aniv">
                                        <div class="card-body text-center d-flex flex-column">
                                            <div class="fs-1 mb-2">🎂</div>
                                            <h6 class="card-title notificacao-card-title">Aniversariantes</h6>
                                            <p class="card-text small notificacao-card-text">
                                                Configure mensagens automáticas para aniversários dos pacientes.
                                            </p>
                                            <div class="mt-auto">
                                                <Button
                                                    label="Configurar"
                                                    icon="pi pi-cog"
                                                    @click="$router.push('/notificacoes/aniversariantes')"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="card h-100" data-tour="tour-config-notif-personal">
                                        <div class="card-body text-center d-flex flex-column">
                                            <div class="fs-1 mb-2">✉️</div>
                                            <h6 class="card-title notificacao-card-title">Mensagens Personalizadas</h6>
                                            <p class="card-text small notificacao-card-text">
                                                Crie mensagens com texto livre e agende uma data/hora de envio.
                                            </p>
                                            <div class="mt-auto">
                                                <Button
                                                    label="Configurar"
                                                    icon="pi pi-cog"
                                                    @click="$router.push('/notificacoes/personalizadas')"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section v-else class="mt-4">
                            <Message severity="warn" :closable="false">
                                Configure o WhatsApp acima para habilitar as notificações automáticas para pacientes.
                            </Message>
                        </section>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EvolutionConfig from '@/components/evolution/EvolutionConfig.vue';
import PlanoPro from '@/components/PlanoPro.vue';
import api from '@/utils/axios';
import Button from 'primevue/button';
import Message from 'primevue/message';
import ConfiguracaoWhatsappTour from '@/components/tour/configuracoes/ConfiguracaoWhatsappTour.vue';
import ConfiguracaoNotificacoesTour from '@/components/tour/configuracoes/ConfiguracaoNotificacoesTour.vue';

export default {
    name: 'ConfiguracaoComunicacao',
    components: {
        Button,
        ConfiguracaoNotificacoesTour,
        ConfiguracaoWhatsappTour,
        EvolutionConfig,
        Message,
        PlanoPro,
    },
    data() {
        return {
            evolutionConectado: false,
            evolutionPrefetch: null,
        };
    },
    computed: {
        podeRecursoPro() {
            const tipo = this.$planService.resolverTipoPlanoUsuario();
            return ['pro', 'vitalicio'].includes(tipo);
        },
        whatsappTourModo() {
            const p = this.evolutionPrefetch;
            if (p == null) return 'loading';
            return p.instance ? 'instancia_existente' : 'nova_instancia';
        },
    },
    async mounted() {
        await this.carregarEstadoEvolution();
    },
    async activated() {
        await this.carregarEstadoEvolution();
    },
    methods: {
        onEvolutionStateChange({ instance, status }) {
            this.evolutionPrefetch = { instance, status: status || 'disconnected' };
            this.evolutionConectado = (status || '') === 'connected';
        },
        async carregarEstadoEvolution() {
            let instance = null;
            let status = 'disconnected';

            try {
                const instRes = await api.get('/evolution/instancia');
                instance = instRes?.data?.data || null;
                status = instance?.status || 'disconnected';
            } catch (error) {
                if (error?.response?.status !== 404) {
                    instance = null;
                }
            }

            try {
                const stRes = await api.get('/evolution/instancia/status');
                const st = stRes?.data?.status || 'disconnected';
                status = st;
                this.evolutionConectado = st === 'connected';
                if (instance) {
                    instance = { ...instance, status: st };
                }
            } catch {
                this.evolutionConectado = false;
                status = 'disconnected';
                if (instance) {
                    instance = { ...instance, status: 'disconnected' };
                }
            }

            this.evolutionPrefetch = { instance, status };
        },
    },
};
</script>

<style scoped>
.notificacao-card-title {
    color: var(--text-color);
}

.notificacao-card-text {
    color: var(--text-color-secondary);
}

@media (max-width: 991px) {
    .config-tab-body {
        padding: 0.25rem !important;
    }
}
</style>
