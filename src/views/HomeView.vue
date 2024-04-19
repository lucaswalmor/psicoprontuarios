<template>
  <div class="home">
    <Navbar />
    <Sobre />
    <Modalidades />
    <LGPD />
    <Planos />
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Planos from '@/components/Planos.vue'
import Navbar from '@/components/Navbar.vue';
import Sobre from '@/components/Sobre.vue';
import Footer from '@/components/Footer.vue';
import Modalidades from '../components/Modalidades.vue';
import LGPD from '../components/LGPD.vue';

export default {
  name: 'HomeView',
  components: {
    Planos,
    Navbar,
    Sobre,
    Footer,
    Modalidades,
    LGPD,
  }
}
</script>
