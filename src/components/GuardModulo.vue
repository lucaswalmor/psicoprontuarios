<template>
  <div>
    <!-- Slot padrão - conteúdo quando tem acesso -->
    <slot v-if="temAcesso" />
    
    <!-- Slot de upgrade - conteúdo quando não tem acesso -->
    <slot v-else name="upgrade">
      <div class="surface-card p-4 border-round text-center">
        <i class="pi pi-lock text-4xl text-orange-500 mb-3"></i>
        <h3 class="text-lg font-semibold mb-2">
          {{ tituloUpgrade }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ mensagemUpgrade }}
        </p>
        
        <div v-if="mostrarMensagem" class="space-y-2">
          <Button 
            label="Fazer Upgrade" 
            icon="pi pi-star" 
            @click="irParaUpgrade"
            class="p-button-primary" />
          
          <div v-if="statusAssinatura !== 'sem_assinatura'" class="text-sm text-gray-500">
            Status atual: 
            <Tag :value="statusAssinatura" 
                 :severity="getStatusSeverity(statusAssinatura)" 
                 class="ml-1" />
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlano } from '@/composables/usePlano';

const props = defineProps({
  moduloChave: {
    type: String,
    required: true
  },
  mostrarMensagem: {
    type: Boolean,
    default: true
  },
  tituloPersonalizado: {
    type: String,
    default: ''
  },
  mensagemPersonalizada: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const { temAcesso, statusAssinatura } = usePlano();

const temAcesso = computed(() => {
  return temAcesso(props.moduloChave);
});

const tituloUpgrade = computed(() => {
  if (props.tituloPersonalizado) {
    return props.tituloPersonalizado;
  }
  
  const titulos = {
    'dashboard': 'Dashboard Premium',
    'gestao_financeira': 'Gestão Financeira',
    'agendamentos': 'Sistema de Agendamentos',
    'perfil_publico': 'Perfil Público',
    'prontuarios_pdf': 'Exportação de Prontuários',
    'backup_automatico': 'Backup Automático',
    'prontuario': 'Prontuários Avançados'
  };
  
  return titulos[props.moduloChave] || 'Recurso Premium';
});

const mensagemUpgrade = computed(() => {
  if (props.mensagemPersonalizada) {
    return props.mensagemPersonalizada;
  }
  
  const mensagens = {
    'dashboard': 'Acesse métricas detalhadas e relatórios avançados do seu consultório.',
    'gestao_financeira': 'Controle completo das suas finanças com relatórios e análises.',
    'agendamentos': 'Gerencie seus agendamentos de forma profissional e eficiente.',
    'perfil_publico': 'Crie uma página pública para divulgar seus serviços.',
    'prontuarios_pdf': 'Exporte prontuários em formato PDF para impressão.',
    'backup_automatico': 'Seus dados são protegidos com backup automático.',
    'prontuario': 'Acesse recursos avançados de prontuários.'
  };
  
  return mensagens[props.moduloChave] || 'Este recurso está disponível em planos superiores.';
});

const getStatusSeverity = (status) => {
  const severityMap = {
    'ativa': 'success',
    'pendente': 'warning',
    'pausada': 'info',
    'cancelada': 'danger',
    'vencida': 'danger',
    'sem_assinatura': 'secondary'
  };
  return severityMap[status] || 'info';
};

const irParaUpgrade = () => {
  router.push('/upgrade');
};
</script>
