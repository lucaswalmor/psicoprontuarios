<template>
  <div class="home">
    <Navbar />
    <Sobre />
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

export default {
  name: 'HomeView',
  components: {
    Planos,
    Navbar,
    Sobre,
    Footer,
  }
}
</script>
