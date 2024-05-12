<template>
    <div id="pix" class="container py-8 mt-8 card">
        <div class="row" v-if="!pixPago">
            <div class="col-md-12 text-center d-flex flex-column">
                <span class="mt-3 fs-5">
                    Após o pagamento ser concluído seu plano será renovado para mais <b>30 dias!</b>
                </span>

                <Message>Não feche esta página</Message>
            </div>

            <div class="col-md-12 text-center d-flex flex-column justify-content-center align-items-center mt-4">
                <img :src="pix.qrCodeImage" alt="qrCode" style="width: 200px">
            </div>

            <div class="col-md-12 text-center mt-3">
                <p>Tempo restante</p>
                <h4>{{ tempoRestante }}</h4>
                <ProgressBar mode="indeterminate" style="height: 6px; margin-top: 15px"></ProgressBar>
            </div>

            <div class="mt-3 col-md-12 text-center d-flex flex-column">
                <InputText v-model="pix.copiaEcola" readonly class="w-full" />
                <Button label="Copiar código" class="rounded mt-3" outlined @click="copy" />
            </div>

            <Toast />

            <div class="col-md-12 mt-3">
                <Button label="Pagar depois" class="rounded w-full" outlined @click="pagarDepois" />
            </div>
        </div>

        <div class="row" v-if="pixPago">
            <div class="col-md-12 text-center d-flex flex-column">
                <i class="fa-solid fa-circle-check" style="color: #B197FC; font-size: 6rem"></i>
                <span class="mt-3 fs-5 fw-bold">{{ mensagem }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressBar from 'primevue/progressbar';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { DeprecationTypes } from 'vue';

export default {
    components: {
        ProgressBar,
        InputText,
        Button,
        Toast,
        Message,
    },
    data() {
        return {
            tempoRestante: "",
            mensagem: "",
            contador: null,
            pixPago: false,
            pix: [],
            tempoExpiracaoOriginal: 900,
        }
    },
    methods: {
        pagarDepois() {
            window.location.href = 'https://painel-psicoprontuarios.com.br/';
        },
        recarregarPagina() {
            window.location.reload();
        },
        copy() {
            navigator.clipboard.writeText(this.pix.copiaEcola);
            this.$toast.add({ severity: 'success', summary: 'Copiado', detail: 'Código pix copiado com sucesso!', life: 3000 });
        },
        iniciarContagemRegressiva() {
            this.contador = setInterval(() => {
                this.atualizarContagemRegressiva();
            }, 1000);
        },
        formatarTempo(segundos) {
            const minutos = Math.floor(segundos / 60);
            const segundosRestantes = segundos % 60;
            return `${minutos}:${segundosRestantes < 10 ? "0" : ""}${segundosRestantes}`;
        },
        atualizarContagemRegressiva() {
            // Decrementa o tempo restante em 1 segundo a cada chamada
            this.tempoExpiracaoOriginal--;

            if (this.tempoExpiracaoOriginal > 0) {
                this.tempoRestante = this.formatarTempo(this.tempoExpiracaoOriginal);
            } else {
                clearInterval(this.contador);
                this.tempoRestante = "Expirado";
            }
        },
        verificaPixPago() {
            this.axios.get(`https://projetopix.lksoftware.com.br/public/api/buscar-pix/${this.pix.identifier}`).then(res => {
                if (res.data.charges && res.data.charges[0].status == 'PAID') {
                    this.atualizarUsuario();
                } else {
                    console.log(res)
                }
            })
        },
        atualizarUsuario() {
            this.axios.put(`ativar-usuario/${this.pix.email}`).then(res => {
                if (res.status == 200) {
                    this.mensagem = 'Seu plano foi ativado, aguarde um instate que iremos redirecioná-lo para o painel!';
                    this.pixPago = true;

                    setTimeout(() => {
                        window.location.href = 'https://painel-psicoprontuarios.com.br/';
                    }, 4500);
                }
            })
        }
    },
    created() {
        this.pix = JSON.parse(this.$route.query.pix)
    },
    mounted() {
        setInterval(() => {
            this.verificaPixPago();
        }, 20000);

        this.iniciarContagemRegressiva();
    },

    beforeDestroy() {
        clearInterval(this.contador);
    },
}
</script>

<style>

</style>