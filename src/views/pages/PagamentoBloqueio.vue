<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h1 class="text-2xl font-bold mb-2">Sua assinatura precisa de atenção</h1>
                <Message v-if="feedback" :severity="feedbackSeverity" class="mb-3" :closable="true" @close="feedback = ''">
                    {{ feedback }}
                </Message>
                <p class="text-color-secondary mb-4">{{ subtitulo }}</p>

                <Message v-if="motivo === 'conta_bloqueada'" severity="warn" class="mb-4" :closable="false">
                    Entre em contato com o suporte para regularizar sua conta vitalícia.
                </Message>

                <Message v-else severity="warn" class="mb-4" :closable="false">
                    Enquanto sua conta estiver inativa, o acesso ao sistema (pacientes, prontuários, agenda etc.) permanece
                    bloqueado.
                </Message>

                <div v-if="assinatura" class="surface-card p-4 border-round mb-4">
                    <h2 class="text-lg font-semibold mb-2">Resumo</h2>
                    <p v-if="assinatura.plano">
                        <strong>Plano:</strong> {{ assinatura.plano.nome }}
                    </p>
                    <p v-if="assinatura.valor_atual != null">
                        <strong>Valor:</strong> R$ {{ Number(assinatura.valor_atual).toFixed(2) }}/mês
                    </p>
                    <p>
                        <strong>Status:</strong> {{ assinatura.status }}
                    </p>
                </div>

                <div class="flex flex-column gap-3">
                    <template v-if="motivo === 'assinatura_pausada'">
                        <p class="m-0">
                            Sua assinatura está pausada. Você pode reativar para voltar a ser cobrado e recuperar o
                            acesso.
                        </p>
                        <Button
                            label="Reativar assinatura"
                            icon="pi pi-play"
                            :loading="loading"
                            @click="reativar"
                        />
                    </template>

                    <template v-else-if="motivo === 'assinatura_cancelada' || motivo === 'conta_bloqueada'">
                        <p v-if="motivo === 'assinatura_cancelada'" class="m-0">
                            Contrate novamente um plano para voltar a usar o sistema.
                        </p>
                        <Button
                            v-if="motivo === 'assinatura_cancelada'"
                            label="Ver planos e assinar novamente"
                            icon="pi pi-star"
                            @click="irUpgrade"
                        />
                    </template>

                    <template v-else>
                        <p class="m-0">
                            Se o pagamento falhou ou o cartão venceu, atualize os dados abaixo. O acesso pleno volta
                            após confirmação do pagamento pelo Asaas.
                        </p>
                        <Button
                            :label="mostrarFormCartao ? 'Ocultar formulário' : 'Atualizar cartão'"
                            icon="pi pi-credit-card"
                            class="p-button-outlined"
                            @click="mostrarFormCartao = !mostrarFormCartao"
                        />

                        <div v-if="mostrarFormCartao" class="surface-card p-4 border-round flex flex-column gap-3">
                            <div class="field">
                                <label class="block mb-1 font-medium" for="holder">Nome no cartão</label>
                                <InputText id="holder" v-model="cartao.holder_name" class="w-full" />
                            </div>
                            <div class="field">
                                <label class="block mb-1 font-medium" for="num">Número</label>
                                <InputText id="num" v-model="cartao.number" class="w-full" maxlength="19" />
                            </div>
                            <div class="grid">
                                <div class="col-12 md:col-4">
                                    <label class="block mb-1 font-medium" for="mês">Mês</label>
                                    <InputText id="mês" v-model="cartao.expiry_month" class="w-full" placeholder="MM" maxlength="2" />
                                </div>
                                <div class="col-12 md:col-4">
                                    <label class="block mb-1 font-medium" for="ano">Ano</label>
                                    <InputText id="ano" v-model="cartao.expiry_year" class="w-full" placeholder="AAAA" maxlength="4" />
                                </div>
                                <div class="col-12 md:col-4">
                                    <label class="block mb-1 font-medium" for="cvv">CVV</label>
                                    <InputText id="cvv" v-model="cartao.ccv" class="w-full" maxlength="4" />
                                </div>
                            </div>
                            <Button label="Salvar cartão" icon="pi pi-check" :loading="loading" @click="salvarCartao" />
                        </div>
                    </template>

                    <p class="text-sm text-color-secondary mt-3 mb-0">
                        Os dados de cartão são processados com segurança pelo Asaas; não armazenamos número completo do
                        cartão em nossos servidores.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import asaasService from '@/services/asaasService';
import authService from '@/services/authService';

export default {
    name: 'PagamentoBloqueio',
    components: {
        Button,
        InputText,
        Message
    },
    data() {
        return {
            feedback: '',
            feedbackSeverity: 'success',
            motivo: 'pagamento_atrasado',
            assinatura: null,
            loading: false,
            mostrarFormCartao: false,
            cartao: {
                holder_name: '',
                number: '',
                expiry_month: '',
                expiry_year: '',
                ccv: ''
            }
        };
    },
    computed: {
        subtitulo() {
            const map = {
                pagamento_atrasado: 'Identificamos um problema com o pagamento da sua assinatura. Regularize para voltar a usar o sistema.',
                assinatura_cancelada: 'Sua assinatura foi encerrada. Você pode contratar novamente quando quiser.',
                assinatura_pausada: 'Sua assinatura está pausada: não há cobrança recorrente ativa e o acesso ao sistema está suspenso.',
                conta_bloqueada: 'Sua conta está temporariamente bloqueada.'
            };
            return map[this.motivo] || map.pagamento_atrasado;
        }
    },
    mounted() {
        this.motivo = authService.obterMotivoBloqueio() || 'pagamento_atrasado';
        try {
            const raw = localStorage.getItem('userAssinatura');
            this.assinatura = raw ? JSON.parse(raw) : null;
        } catch {
            this.assinatura = null;
        }
    },
    methods: {
        irUpgrade() {
            this.$router.push('/upgrade');
        },
        async reativar() {
            this.loading = true;
            this.feedback = '';
            try {
                await asaasService.reativarAssinatura();
                await authService.sincronizarSessaoComApi();
                this.$router.replace('/dashboard');
            } catch (e) {
                console.error(e);
                this.feedbackSeverity = 'error';
                this.feedback = 'Não foi possível reativar. Verifique os dados ou tente mais tarde.';
            } finally {
                this.loading = false;
            }
        },
        async salvarCartao() {
            this.loading = true;
            this.feedback = '';
            try {
                await asaasService.atualizarCartao(this.cartao);
                this.feedbackSeverity = 'success';
                this.feedback = 'Cartão atualizado. O acesso será liberado após confirmação do pagamento pelo Asaas.';
                this.mostrarFormCartao = false;
            } catch (e) {
                console.error(e);
                this.feedbackSeverity = 'error';
                this.feedback = 'Não foi possível atualizar o cartão.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
