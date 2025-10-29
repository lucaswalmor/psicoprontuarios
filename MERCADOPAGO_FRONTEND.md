# Integração Mercado Pago - Frontend

## Mudanças Realizadas

### 1. Package.json
- ✅ Removido `@stripe/stripe-js`
- ✅ Dependências de Mercado Pago não são necessárias (usando Checkout Pro)

### 2. Composable
- ✅ Removido `useStripe.js`
- ✅ Criado `useMercadoPago.js` com métodos para:
  - `criarCheckout()` - Redirecionar para Checkout Pro
  - `validarCheckout()` - Validar pagamento após retorno
  - `pausarAssinatura()` - Pausar assinatura
  - `reativarAssinatura()` - Reativar assinatura
  - `cancelarAssinatura()` - Cancelar assinatura

### 3. Service
- ✅ Criado `mercadoPagoService.js` com endpoints da API:
  - `POST /api/assinaturas/checkout`
  - `POST /api/assinaturas/validar`
  - `GET /api/assinaturas/ativa`
  - `POST /api/assinaturas/pausar`
  - `POST /api/assinaturas/reativar`
  - `DELETE /api/assinaturas/cancelar`

### 4. View
- ✅ `Upgrade.vue` atualizado para usar Mercado Pago
- ✅ Removidas referências ao Stripe
- ✅ Texto atualizado para "Mercado Pago"

## Como Funciona

### Fluxo de Checkout

1. **Usuário seleciona plano** na página `/upgrade`
2. **Clica em "Ir para Pagamento"**
3. **Frontend chama** `mercadoPago.criarCheckout(planoId)`
4. **Backend cria preferência** no Mercado Pago
5. **Redireciona** para Checkout Pro do Mercado Pago
6. **Usuário paga** no site do Mercado Pago
7. **Mercado Pago redireciona** para `/checkout/sucesso`
8. **Frontend valida** o pagamento
9. **Assinatura é ativada**

### Páginas de Retorno

Crie as seguintes páginas no Vue Router:

- `/checkout/sucesso` - Quando pagamento é bem-sucedido
- `/checkout/cancelado` - Quando usuário cancela

## Exemplo de Uso

### Em um Componente

```vue
<script setup>
import { useMercadoPago } from '@/composables/useMercadoPago';

const mercadoPago = useMercadoPago();

const iniciarCheckout = async (planoId) => {
    await mercadoPago.criarCheckout(planoId);
};
</script>

<template>
    <Button @click="iniciarCheckout(2)" :loading="mercadoPago.loading">
        Assinar Plano Essencial
    </Button>
</template>
```

## Variáveis de Ambiente

Certifique-se de que o `.env` tem:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Próximos Passos

1. Criar páginas de sucesso e cancelamento
2. Testar fluxo completo de checkout
3. Configurar webhooks no Mercado Pago
4. Testar com cartões de teste

