<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex flex-column align-items-center text-center py-8">
          <i class="pi pi-times-circle text-orange-500 text-6xl mb-4"></i>
          
          <h1 class="text-2xl font-bold text-orange-600 mb-2">
            Pagamento Cancelado
          </h1>
          
          <p class="text-gray-600 mb-6 max-w-md">
            Você cancelou o processo de pagamento. Não se preocupe, você pode tentar novamente a qualquer momento.
          </p>
          
          <div class="flex flex-column gap-3 w-full max-w-sm">
            <Button 
              label="Tentar Novamente" 
              icon="pi pi-refresh" 
              @click="tentarNovamente"
              class="p-button-warning w-full" />
            
            <Button 
              label="Voltar ao Dashboard" 
              icon="pi pi-home" 
              @click="voltarDashboard"
              class="p-button-secondary w-full" />
            
            <Button 
              label="Ver Planos" 
              icon="pi pi-star" 
              @click="verPlanos"
              class="p-button-outlined w-full" />
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 rounded-lg max-w-md">
            <h3 class="font-semibold text-blue-800 mb-2">
              Precisa de Ajuda?
            </h3>
            <p class="text-blue-700 text-sm mb-3">
              Se você teve problemas durante o pagamento ou tem dúvidas sobre nossos planos, nossa equipe está aqui para ajudar.
            </p>
            <Button 
              label="Entrar em Contato" 
              icon="pi pi-whatsapp" 
              @click="entrarContato"
              class="p-button-outlined p-button-sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const tentarNovamente = () => {
  router.push('/upgrade');
};

const voltarDashboard = () => {
  router.push('/dashboard');
};

const verPlanos = () => {
  router.push('/upgrade');
};

const entrarContato = () => {
  // Abrir WhatsApp ou email de contato
  const whatsappNumber = '5511999999999'; // Substituir pelo número real
  const message = 'Olá! Preciso de ajuda com o processo de assinatura.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};
</script>
