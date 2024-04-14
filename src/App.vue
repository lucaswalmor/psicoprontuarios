<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view/>

  <ScrollTop />
</template>

<script>
import ScrollTop from 'primevue/scrolltop';

export default {
  components: {
    ScrollTop,
  }
}
</script>

<style>
</style>
