<template>
    <div id="lgpd" class="mt-6 lgdp d-flex justify-content-center align-items-center flex-column p-3" data-aos="fade-up">
        <div class="row justify-content-center text-center">
            <h1 class="text-roxo fw-bold">Segurança dos Dados</h1>
            <h5 class="text-roxo">Segurança das informações com dados criptografados. Total privacidade, segurança e ética.</h5>
        </div>
        <div class="row">
            <div class="col-md-6 cursor-pointer" @click="abrirLgpd">
                <img :src="require('@/assets/img/LGPD.webp')" alt="lgpd">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        abrirLgpd() {
            window.open('https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd#:~:text=A%20Lei%20Geral%20de%20Prote%C3%A7%C3%A3o,da%20personalidade%20de%20cada%20indiv%C3%ADduo.', '_blank')
        }
    }
}
</script>

<style>
#lgpd {
    background-color: rgb(229 229 229) !important;
}

img {
    width: 150px;
}
</style>