# Configuração do Stripe Frontend

## 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```env
# Stripe Public Key (chave pública)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here

# API Base URL
VITE_API_BASE_URL=http://localhost:8000/api
```

## 2. Instalação de Dependências

Instale o Stripe.js:

```bash
npm install @stripe/stripe-js
```

## 3. Configuração do Stripe.js

O Stripe.js já está configurado no composable `useStripe.js`. 

### 3.1 Uso Básico

```javascript
import { useStripe } from '@/composables/useStripe';

export default {
  setup() {
    const { criarCheckout, loading } = useStripe();
    
    const processarPagamento = async (planoId) => {
      try {
        await criarCheckout(planoId);
      } catch (error) {
        console.error('Erro no checkout:', error);
      }
    };
    
    return { processarPagamento, loading };
  }
};
```

## 4. Páginas de Callback

### 4.1 Checkout Sucesso

A página `CheckoutSucesso.vue` será exibida quando o pagamento for bem-sucedido.

### 4.2 Checkout Cancelado

A página `CheckoutCancelado.vue` será exibida quando o usuário cancelar o pagamento.

## 5. Testando no Frontend

### 5.1 Cartões de Teste

Use estes cartões para testar:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **Requer autenticação**: `4000 0025 0000 3155`

### 5.2 Dados de Teste

- **CVV**: Qualquer 3 dígitos
- **Data de expiração**: Qualquer data futura
- **CEP**: Qualquer CEP válido

## 6. Monitoramento

### 6.1 Console do Navegador

Verifique o console para erros:
- Erros de JavaScript
- Erros de rede
- Erros do Stripe

### 6.2 Network Tab

Monitore as requisições:
- `/api/assinaturas/checkout-session`
- `/api/assinaturas/validar-checkout`

## 7. Produção

### 7.1 Chaves de Produção

Substitua as chaves de teste pelas de produção:
- `pk_test_` → `pk_live_`

### 7.2 URLs de Produção

Atualize as URLs de callback:
- `https://seudominio.com/checkout/sucesso`
- `https://seudominio.com/checkout/cancelado`

## 8. Troubleshooting

### 8.1 Erro de CORS

Se houver erro de CORS, verifique:
1. Se o backend está configurado para aceitar requisições do frontend
2. Se as URLs estão corretas

### 8.2 Erro de Chave Pública

Se houver erro de chave pública:
1. Verifique se `VITE_STRIPE_PUBLIC_KEY` está definida
2. Confirme se a chave está correta
3. Verifique se não há espaços extras

### 8.3 Erro de Checkout

Se o checkout não funcionar:
1. Verifique se o backend está rodando
2. Confirme se a rota `/api/assinaturas/checkout-session` está funcionando
3. Verifique os logs do backend

## 9. Exemplos de Uso

### 9.1 Botão de Upgrade

```vue
<template>
  <Button 
    label="Fazer Upgrade" 
    @click="processarPagamento"
    :loading="loading"
    class="p-button-primary" />
</template>

<script>
import { useStripe } from '@/composables/useStripe';

export default {
  setup() {
    const { criarCheckout, loading } = useStripe();
    
    const processarPagamento = async () => {
      await criarCheckout(1); // ID do plano
    };
    
    return { processarPagamento, loading };
  }
};
</script>
```

### 9.2 Verificação de Acesso

```vue
<template>
  <div v-acesso="'gestao_financeira'">
    <!-- Conteúdo apenas para usuários com acesso à gestão financeira -->
  </div>
</template>
```

### 9.3 Indicador de Status

```vue
<template>
  <div v-if="temAssinaturaAtiva">
    <i class="pi pi-check-circle text-green-500"></i>
    Assinatura Ativa
  </div>
  <div v-else>
    <i class="pi pi-exclamation-triangle text-yellow-500"></i>
    Assinatura Inativa
  </div>
</template>

<script>
import { usePlano } from '@/composables/usePlano';

export default {
  setup() {
    const { temAssinaturaAtiva } = usePlano();
    
    return { temAssinaturaAtiva };
  }
};
</script>
```
