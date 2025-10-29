<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h1 class="text-2xl font-bold mb-6">Configurações da Assinatura</h1>
        
        <!-- Assinatura Atual -->
        <div v-if="assinatura" class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Assinatura Atual</h2>
          
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="surface-card p-4 border-round">
                <div class="flex align-items-center justify-content-between mb-3">
                  <h3 class="text-lg font-semibold">{{ assinatura.plano.nome }}</h3>
                  <Tag :value="assinatura.status" 
                       :severity="getStatusSeverity(assinatura.status)" />
                </div>
                
                <div class="space-y-2">
                  <p><strong>Valor:</strong> R$ {{ assinatura.valor.toFixed(2) }}/mês</p>
                  <p v-if="assinatura.data_proxima_cobranca">
                    <strong>Próxima cobrança:</strong> 
                    {{ formatDate(assinatura.data_proxima_cobranca) }}
                  </p>
                  <p v-if="diasRestantes !== null">
                    <strong>Dias restantes:</strong> {{ diasRestantes }} dias
                  </p>
                </div>
                
                <div class="flex gap-2 mt-4">
                  <Button 
                    v-if="assinatura.status === 'ativa'"
                    label="Pausar" 
                    icon="pi pi-pause" 
                    @click="pausarAssinatura"
                    class="p-button-warning p-button-sm"
                    :loading="loading" />
                  
                  <Button 
                    v-if="assinatura.status === 'pausada'"
                    label="Reativar" 
                    icon="pi pi-play" 
                    @click="reativarAssinatura"
                    class="p-button-success p-button-sm"
                    :loading="loading" />
                  
                  <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    @click="mostrarDialogCancelamento = true"
                    class="p-button-danger p-button-sm" />
                </div>
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="surface-card p-4 border-round">
                <h3 class="text-lg font-semibold mb-3">Módulos Incluídos</h3>
                <div class="flex flex-wrap gap-2">
                  <Tag 
                    v-for="modulo in assinatura.plano.modulos" 
                    :key="modulo.id"
                    :value="modulo.nome"
                    severity="success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sem Assinatura -->
        <div v-else class="text-center py-8">
          <i class="pi pi-info-circle text-6xl text-blue-500 mb-4"></i>
          <h2 class="text-xl font-semibold mb-2">Nenhuma Assinatura Ativa</h2>
          <p class="text-gray-600 mb-4">
            Você não possui uma assinatura ativa. Faça upgrade do seu plano para acessar todos os recursos.
          </p>
          <Button 
            label="Ver Planos" 
            icon="pi pi-star" 
            @click="irParaUpgrade"
            class="p-button-primary" />
        </div>
        
        <!-- Método de Pagamento -->
        <div v-if="assinatura && assinatura.status !== 'cancelada'" class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Método de Pagamento</h2>
          
          <div class="surface-card p-4 border-round">
            <div class="flex align-items-center justify-content-between">
              <div>
                <h3 class="font-semibold mb-1">Cartão de Crédito</h3>
                <p class="text-gray-600 text-sm">
                  Método de pagamento configurado no Stripe
                </p>
              </div>
              <Button 
                label="Alterar Cartão" 
                icon="pi pi-credit-card" 
                @click="mostrarDialogCartao = true"
                class="p-button-outlined" />
            </div>
          </div>
        </div>
        
        <!-- Histórico de Cobranças -->
        <div v-if="assinatura" class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Histórico de Cobranças</h2>
          
          <div class="surface-card p-4 border-round">
            <p class="text-gray-600 text-center py-4">
              O histórico de cobranças será exibido aqui em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dialog de Cancelamento -->
    <Dialog 
      v-model:visible="mostrarDialogCancelamento" 
      header="Cancelar Assinatura" 
      :modal="true" 
      :closable="false"
      class="w-full max-w-md">
      
      <div class="mb-4">
        <p class="mb-3">
          Tem certeza que deseja cancelar sua assinatura? Você perderá acesso a todos os recursos premium.
        </p>
        
        <div class="field">
          <label for="motivo" class="font-semibold">Motivo do cancelamento (opcional)</label>
          <Textarea 
            id="motivo"
            v-model="motivoCancelamento" 
            rows="3" 
            placeholder="Conte-nos o motivo do cancelamento..."
            class="w-full" />
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Manter Assinatura" 
          @click="mostrarDialogCancelamento = false"
          class="p-button-secondary" />
        <Button 
          label="Cancelar Assinatura" 
          @click="cancelarAssinatura"
          class="p-button-danger"
          :loading="loading" />
      </template>
    </Dialog>
    
    <!-- Dialog de Alterar Cartão -->
    <Dialog 
      v-model:visible="mostrarDialogCartao" 
      header="Alterar Método de Pagamento" 
      :modal="true"
      class="w-full max-w-md">
      
      <div class="text-center py-4">
        <i class="pi pi-info-circle text-4xl text-blue-500 mb-3"></i>
        <p class="text-gray-600 mb-4">
          Para alterar seu método de pagamento, você será redirecionado para o Stripe, onde poderá atualizar suas informações de forma segura.
        </p>
        <Button 
          label="Alterar no Stripe" 
          icon="pi pi-external-link" 
          @click="alterarCartaoStripe"
          class="p-button-primary" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAsaas } from '@/composables/useAsaas';
import { usePlanStore } from '@/store/plan';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const planStore = usePlanStore();
const { pausarAssinatura: pauseAssinatura, reativarAssinatura: resumeAssinatura, cancelarAssinatura: cancelAssinatura, loading } = useAsaas();

const mostrarDialogCancelamento = ref(false);
const mostrarDialogCartao = ref(false);
const motivoCancelamento = ref('');

const assinatura = computed(() => planStore.assinatura);
const diasRestantes = computed(() => planStore.diasRestantes);

onMounted(async () => {
  await planStore.carregarAssinatura();
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

const pausarAssinatura = async () => {
  try {
    await pauseAssinatura(assinatura.value.id);
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Assinatura pausada com sucesso',
      life: 3000
    });
    await planStore.carregarAssinatura();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao pausar assinatura',
      life: 3000
    });
  }
};

const reativarAssinatura = async () => {
  try {
    await resumeAssinatura(assinatura.value.id);
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Assinatura reativada com sucesso',
      life: 3000
    });
    await planStore.carregarAssinatura();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao reativar assinatura',
      life: 3000
    });
  }
};

const cancelarAssinatura = async () => {
  try {
    await cancelAssinatura(assinatura.value.id, motivoCancelamento.value);
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Assinatura cancelada com sucesso',
      life: 3000
    });
    mostrarDialogCancelamento.value = false;
    motivoCancelamento.value = '';
    await planStore.carregarAssinatura();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao cancelar assinatura',
      life: 3000
    });
  }
};

const alterarCartaoStripe = () => {
  // Implementar redirecionamento para Stripe Customer Portal
  toast.add({
    severity: 'info',
    summary: 'Em breve',
    detail: 'Funcionalidade de alteração de cartão será implementada em breve',
    life: 3000
  });
  mostrarDialogCartao.value = false;
};

const irParaUpgrade = () => {
  router.push('/upgrade');
};
</script>
