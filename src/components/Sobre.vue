<template>
    <div id="sobre" class="mt-3 container">
        <div class="col-md-12 d-flex flex-wrap">
            <div class="col-md-6 d-flex flex-column justify-content-center">
                <div class="col-md-12">
                    <h1 class="text-roxo">SOBRE A PSICO PRONTUÁRIOS</h1>

                    <span class="">
                        Otimize sua prática clínica com nosso sistema de prontuários online para psicólogos. Com nossa plataforma, você pode criar e gerenciar facilmente notificações para suas consultas. Receba lembretes diretamente em seu whatsapp e email, garantindo que você nunca perca uma sessão importante. Simplifique seu fluxo de trabalho e concentre-se no que realmente importa: o bem-estar de seus pacientes. Experimente agora e descubra como nossa solução pode elevar sua prática a novos patamares de eficiência e cuidados.
                    </span>
                </div>
            </div>
            <div class="col-md-6 d-flex align-item-scenter">
                <img :src="require('@/assets/img/img4.webp')" data-aos="fade-right" data-aos-duration="2000" alt="img" class="img-sobre">
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.sobre {
    width: 100%;
}

.img-sobre {
    width: 500px;
}

@media screen and (max-width: 768px) {
    .img-sobre {
        width: 350px;
    }
}
</style>