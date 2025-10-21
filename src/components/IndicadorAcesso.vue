<template>
  <div class="flex align-items-center gap-2">
    <!-- Ícone de acesso -->
    <i v-if="temAcesso" 
       class="pi pi-check-circle text-green-500" 
       :class="getIconSize"></i>
    <i v-else 
       class="pi pi-lock text-orange-500" 
       :class="getIconSize"></i>
    
    <!-- Texto do indicador -->
    <span v-if="mostrarTexto" 
          class="font-medium"
          :class="getTextSize">
      {{ textoIndicador }}
    </span>
    
    <!-- Badge do plano necessário -->
    <Tag v-if="!temAcesso && mostrarBadge" 
         :value="planoNecessario" 
         severity="warning" 
         :class="getBadgeSize" />
    
    <!-- Tooltip com informações -->
    <Tooltip v-if="mostrarTooltip" 
             :target="tooltipTarget" 
             :content="tooltipContent" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePlano } from '@/composables/usePlano';

const props = defineProps({
  moduloChave: {
    type: String,
    required: true
  },
  tamanho: {
    type: String,
    default: 'medio',
    validator: (value) => ['pequeno', 'medio', 'grande'].includes(value)
  },
  mostrarTexto: {
    type: Boolean,
    default: true
  },
  mostrarBadge: {
    type: Boolean,
    default: true
  },
  mostrarTooltip: {
    type: Boolean,
    default: true
  },
  textoPersonalizado: {
    type: String,
    default: ''
  }
});

const { temAcesso, statusAssinatura } = usePlano();
const tooltipTarget = ref(null);

const temAcesso = computed(() => {
  return temAcesso(props.moduloChave);
});

const getIconSize = computed(() => {
  const sizes = {
    'pequeno': 'text-sm',
    'medio': 'text-base',
    'grande': 'text-lg'
  };
  return sizes[props.tamanho];
});

const getTextSize = computed(() => {
  const sizes = {
    'pequeno': 'text-sm',
    'medio': 'text-base',
    'grande': 'text-lg'
  };
  return sizes[props.tamanho];
});

const getBadgeSize = computed(() => {
  const sizes = {
    'pequeno': 'text-xs',
    'medio': 'text-sm',
    'grande': 'text-base'
  };
  return sizes[props.tamanho];
});

const textoIndicador = computed(() => {
  if (props.textoPersonalizado) {
    return props.textoPersonalizado;
  }
  
  const textos = {
    'dashboard': 'Dashboard',
    'gestao_financeira': 'Gestão Financeira',
    'agendamentos': 'Agendamentos',
    'perfil_publico': 'Perfil Público',
    'prontuarios_pdf': 'Prontuários PDF',
    'backup_automatico': 'Backup Automático',
    'prontuario': 'Prontuários'
  };
  
  return textos[props.moduloChave] || 'Recurso';
});

const planoNecessario = computed(() => {
  const planos = {
    'dashboard': 'Essencial+',
    'gestao_financeira': 'Profissional',
    'agendamentos': 'Essencial+',
    'perfil_publico': 'Profissional',
    'prontuarios_pdf': 'Essencial+',
    'backup_automatico': 'Essencial+',
    'prontuario': 'Gratuito'
  };
  
  return planos[props.moduloChave] || 'Premium';
});

const tooltipContent = computed(() => {
  if (temAcesso.value) {
    return 'Você tem acesso a este recurso';
  }
  
  const conteudos = {
    'dashboard': 'Dashboard com métricas avançadas disponível no plano Essencial ou superior',
    'gestao_financeira': 'Gestão financeira completa disponível no plano Profissional',
    'agendamentos': 'Sistema de agendamentos disponível no plano Essencial ou superior',
    'perfil_publico': 'Perfil público para divulgação disponível no plano Profissional',
    'prontuarios_pdf': 'Exportação de prontuários em PDF disponível no plano Essencial ou superior',
    'backup_automatico': 'Backup automático disponível no plano Essencial ou superior',
    'prontuario': 'Prontuários básicos disponíveis no plano Gratuito'
  };
  
  return conteudos[props.moduloChave] || 'Este recurso requer um plano superior';
});
</script>
