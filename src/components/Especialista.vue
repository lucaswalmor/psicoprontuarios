<template>
    <div id="especialista" class="mt-3 container">
        <div class="col-md-12 d-flex flex-wrap">
            <div class="col-md-6 text-center">
                <img :src="require('@/assets/img/especialista.png')" data-aos="fade-left" data-aos-duration="2000" alt="img" style="width: 350px">
            </div>
            <div class="col-md-6 d-flex flex-column justify-content-center">
                <div class="col-md-12">
                    <h1 class="text-roxo">Ainda tem dúvidas?</h1>

                    <span class="">
                        Chame um de nossos especialistas no whatsapp e tire todas as suas duvidas, agendaremos uma demonstração do nosso sistema para que você fique por dentro de todas
                        as nossas funcionalidades, e assim poderá fazer parte da nossa família sem preocupações!
                    </span>

                </div>

                <div class="col-md-12 mt-3">
                    <Button class="w-full rounded" label="Falar com um especialista" outlined @click="falarEspecialista" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';

export default {
    components: {
        Button,
    },
    methods: {
        falarEspecialista() {
            window.open('https://wa.me/5534992021394?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+demonstra%C3%A7%C3%A3o+do+sistema+Psico+Prontu%C3%A1rios%21', '_blank');
        }
    }
}
</script>

<style scoped>
.sobre {
    width: 100%;
}
</style>