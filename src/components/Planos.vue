<template>
   <div class="px-4 py-6 md:px-6 lg:px-8 background-roxo-gradiente" id="planos">
      <div class="text-roxo font-bold text-5xl mb-4 text-center">Nossos Planos</div>

      <div class="grid justify-content-center" data-aos="flip-left" data-aos-duration="2000" >
         <div class="col-12 lg:col-6 card shadow-7">
            <div class="h-full">
               <div
                  class="shadow-2 h-full flex flex-column surface-card p-3"
                  style="border-radius: 6px"
               >
                  <div class="text-center text-roxo font-medium text-xl mb-2">Plano Único</div>
                  <div class="text-center text-600">30 Dias</div>
                  <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                  <div class="flex align-items-center justify-content-center">
                     <span class="font-bold text-2xl text-roxo">R$ 29,90</span>
                     <span class="ml-2 font-medium text-600">por mês</span>
                  </div>
                  <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
                  <ul class="list-none p-0 m-0 flex-grow-1">
                     <li class="flex align-items-center mb-3">
                        <i class="pi pi-check-circle text-roxo mr-2"></i>
                        <span>Prontuário online</span>
                     </li>
                     <li class="flex align-items-center mb-3">
                        <i class="pi pi-check-circle text-roxo mr-2"></i>
                        <span>Controle financeiro</span>
                     </li>
                     <li class="flex align-items-center mb-3">
                        <i class="pi pi-check-circle text-roxo mr-2"></i>
                        <span>Exportação de prontuários</span>
                     </li>
                     <li class="flex align-items-center mb-3">
                        <i class="pi pi-check-circle text-roxo mr-2"></i>
                        <span>Agendamento de consultas</span>
                     </li>
                     <li class="flex align-items-center mb-3">
                        <i class="pi pi-check-circle text-roxo mr-2"></i>
                        <span>Notificações automáticas de consultas agendadas para pacientes e psicólogos via email e whatsapp</span>
                     </li>
                  </ul>
                  <hr class="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                  <Button label="Cadastre-se agora" class="p-2 rounded w-full mt-auto fw-bold fs-5" @click="$router.push('/cadastro')"></Button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import Button from 'primevue/button';

export default {
   name: "HelloWorld",
   components: {
      Button,
   },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
   margin: 40px 0 0;
}
ul {
   list-style-type: none;
   padding: 0;
}
li {
   display: inline-block;
   margin: 0 10px;
}
a {
   color: #42b983;
}

</style>
