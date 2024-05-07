<template>
   <nav class="navbar navbar-expand-lg background-roxo shadow-8 p-3">
      <div class="container">
         <span class="navbar-brand text-light cursor-pointer" @click="$router.push('/')">Psico Prontuários</span>
         
         <div class="d-flex justify-content-between align-items-center gap-3">
            <span class="text-light cursor-pointer" @click="$router.push('/afiliado')">Quer ser um afiliado ?</span>

            <button class="nav-link botao-login shadow p-2" @click="redirecionarPainel">
               Acessar Painel
            </button>
         </div>
      </div>
   </nav>
</template>

<script>
export default {
   methods: {
      redirecionarPainel() {
         window.open('https://painel-psicoprontuarios.com.br/', '_blank');
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