<template>
  <div class="home">
    <Navbar />
    <Sobre />
    <Modalidades />
    <Especialista />
    <LGPD />
    <Planos />
    <Footer />

    <div class="botao-fixo">
      <Button @click="falarEspecialista" class="p-3 botao-wpp" v-tooltip.left="'Fale com um especialista'">
        <i class="fa-brands fa-whatsapp fa-2xl"></i>
      </Button>
    </div>
  </div>
</template>

<script>
import Planos from '@/components/Planos.vue'
import Navbar from '@/components/Navbar.vue';
import Sobre from '@/components/Sobre.vue';
import Footer from '@/components/Footer.vue';
import Modalidades from '../components/Modalidades.vue';
import LGPD from '../components/LGPD.vue';
import Button from 'primevue/button';
import Especialista from '@/components/Especialista.vue';

export default {
  name: 'HomeView',
  components: {
    Planos,
    Navbar,
    Sobre,
    Footer,
    Modalidades,
    LGPD,
    Especialista,
    Button,
  },
  methods: {
    falarEspecialista() {
      window.open('https://wa.me/5534992021394?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+demonstra%C3%A7%C3%A3o+do+sistema+Psico+Prontu%C3%A1rios%21', '_blank');
    }
  }
}
</script>

<style>
.botao-fixo {
  position: fixed;
  bottom: 80px;
  right: 20px;
}

.botao-wpp {
  border-radius: 50%;
  height: 60px;
}
</style>