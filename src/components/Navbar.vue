<template>
   <nav class="navbar navbar-expand-lg background-roxo shadow-8 p-3">
      <div class="container">
        <span class="navbar-brand text-light">Psico Prontuários</span>

         <button class="nav-link botao-login shadow p-2" @click="redirecionarPainel">
            Acessar Painel
         </button>


      </div>
   </nav>
</template>

<script>
export default {
   methods: {
      redirecionarPainel() {
         window.open('https://psico-prontuario.vercel.app/', '_blank');
      }
   },
};
</script>

<style scoped>
.nav-link {
   color: #fff !important;
}

.botao-login {
   border: 1px solid #fff;
   min-width: 150px;
   border-radius: 5px;
   display: flex !important;
   justify-content: center;
   align-items: center;
}

.botao-login a {
   color: #fff !important;
}
</style>