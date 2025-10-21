<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div class="flex flex-column align-items-center text-center py-8">
          <div v-if="loading" class="mb-4">
            <ProgressSpinner />
          </div>
          
          <div v-else-if="success" class="mb-4">
            <i class="pi pi-check-circle text-green-500 text-6xl mb-4"></i>
            <h1 class="text-2xl font-bold text-green-600 mb-2">
              Assinatura Criada com Sucesso!
            </h1>
            <p class="text-600 mb-4">
              Sua assinatura foi ativada e você já tem acesso a todos os recursos do seu plano.
            </p>
            
            <div v-if="assinatura" class="border-1 border-50 p-4 rounded-lg mb-4 w-full max-w-md">
              <h3 class="font-semibold mb-2">Detalhes da Assinatura</h3>
              <div class="text-left text-500">
                <p><strong>Plano:</strong> {{ assinatura.plano.nome }}</p>
                <p><strong>Valor:</strong> R$ {{ parseFloat(assinatura.valor).toFixed(2) }}/mês</p>
                <p><strong>Status:</strong> 
                  <Tag :value="assinatura.status" 
                       :severity="getStatusSeverity(assinatura.status)" />
                </p>
                <p v-if="assinatura.data_proxima_cobranca">
                  <strong>Próxima cobrança:</strong> 
                  {{ formatDate(assinatura.data_proxima_cobranca) }}
                </p>
              </div>
            </div>
            
            <Button 
              label="Ir para Dashboard" 
              icon="pi pi-home" 
              @click="irParaDashboard"
              class="p-button-success" />
          </div>
          
          <div v-else class="mb-4">
            <i class="pi pi-times-circle text-red-500 text-6xl mb-4"></i>
            <h1 class="text-2xl font-bold text-red-600 mb-2">
              Erro ao Processar Pagamento
            </h1>
            <p class="text-600 mb-4">
              {{ errorMessage || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.' }}
            </p>
            
            <div class="flex gap-2">
              <Button 
                label="Tentar Novamente" 
                icon="pi pi-refresh" 
                @click="tentarNovamente"
                class="p-button-warning" />
              <Button 
                label="Voltar ao Upgrade" 
                icon="pi pi-arrow-left" 
                @click="voltarUpgrade"
                class="p-button-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStripe } from '@/composables/useStripe';
import { usePlanStore } from '@/store/plan';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const planStore = usePlanStore();
const { validarCheckout, loading, error } = useStripe();

const success = ref(false);
const assinatura = ref(null);
const errorMessage = ref('');

// Função para carregar dados do store
const carregarDadosStore = async () => {
  try {
    await planStore.carregarAssinatura();
    await planStore.carregarModulosAcesso();
  } catch (err) {
    console.error('Erro ao carregar dados do store:', err);
  }
};

onMounted(async () => {
  const sessionId = route.query.session_id;
  
  if (!sessionId) {
    errorMessage.value = 'ID da sessão não encontrado';
    return;
  }

  try {
    const response = await validarCheckout(sessionId);
    
    if (response.success) {
      success.value = true;
      assinatura.value = response.assinatura;
      
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Assinatura criada com sucesso!',
        life: 5000
      });
      
      // Carregar dados atualizados no store após o toast
      setTimeout(() => {
        carregarDadosStore();
      }, 100);
      
    } else {
      errorMessage.value = 'Falha na validação do checkout';
    }
  } catch (err) {
    console.error('Erro ao validar checkout:', err);
    errorMessage.value = err.message || 'Erro ao processar pagamento';
  }
});

const getStatusSeverity = (status) => {
  const severityMap = {
    'ativa': 'success',
    'pendente': 'warning',
    'pausada': 'info',
    'cancelada': 'danger',
    'vencida': 'danger'
  };
  return severityMap[status] || 'info';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const irParaDashboard = () => {
  router.push('/dashboard');
};

const tentarNovamente = () => {
  router.push('/upgrade');
};

const voltarUpgrade = () => {
  router.push('/upgrade');
};
</script>
