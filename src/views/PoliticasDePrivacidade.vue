<template>
  <div id="politicas-privacidade">
      <div class="col-md-12">
        Política de Privacidade e Proteção de Dados Pessoais
      </div>
      <div class="col-md-12 mt-3">
        <div class="fw-bold w-full">
          Introdução
        </div>
        Esta Política de Privacidade e Proteção de Dados Pessoais descreve como nós, Psico Prontuários, coletamos, usamos e protegemos os dados pessoais dos usuários do nosso sistema de gestão de psicólogos.
        Estamos comprometidos em proteger a privacidade e a segurança dos dados pessoais de nossos usuários em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras leis aplicáveis.
      </div>
      <div class="col-md-12 mt-3">
        <div class="fw-bold w-full">
          Dados Coletados
        </div>
        2.1. Dados de Cadastro: Coletamos informações fornecidas pelos psicólogos e pacientes durante o processo de cadastro, como nome, endereço, telefone, e-mail, entre outros dados necessários para a prestação dos serviços.

        2.2. Dados de Prontuário: Os prontuários dos pacientes, contendo informações sensíveis relacionadas à saúde mental, são armazenados de forma segura e acessados apenas pelos psicólogos autorizados.

        2.3. Dados de Pagamento: Para processar pagamentos e fornecer serviços financeiros, podemos coletar informações de pagamento, como números de cartão de crédito e dados bancários.
      </div>
      <div class="col-md-12 mt-3">
        <div class="fw-bold w-full">
          Uso dos Dados
        </div>

        3.1. Os dados coletados são utilizados exclusivamente para a prestação dos serviços oferecidos pelo sistema de gestão de psicólogos, incluindo o agendamento de consultas, gestão de prontuários e serviços financeiros.

        3.2. Os dados pessoais dos usuários não serão compartilhados, vendidos ou divulgados a terceiros, exceto quando necessário para cumprir com obrigações legais ou a pedido expresso dos usuários.
      </div>
      <div class="col-md-12 mt-3">
        <div class="fw-bold w-full">
          Segurança dos Dados
        </div>

        4.1. Implementamos medidas de segurança técnicas, administrativas e físicas para proteger os dados pessoais dos usuários contra acesso não autorizado, uso indevido, alteração, divulgação ou destruição.

        4.2. Apenas funcionários autorizados têm acesso aos dados pessoais dos usuários e são obrigados a manter a confidencialidade dessas informações.
      </div>
      <div class="col-md-12 mt-3">
        <div class="fw-bold w-full">
          Direitos dos Usuários
        </div>
      
        5.1. Os usuários têm o direito de acessar, corrigir, atualizar ou excluir seus dados pessoais a qualquer momento.

        5.2. Os usuários podem solicitar a portabilidade de seus dados pessoais para outro provedor de serviços, quando aplicável.

        5.3. Os usuários podem retirar seu consentimento para o processamento de seus dados pessoais a qualquer momento, sujeito às obrigações legais.
      </div>
      <div class="col-md-12 mt-3">
        <div class="fw-bold w-full">
          Contato
        </div>
        Para mais informações sobre nossa Política de Privacidade e Proteção de Dados Pessoais, ou para exercer seus direitos de privacidade, entre em contato conosco pelo e-mail psicoprontuarios@gmail.com.

      </div>
      <div class="col-md-12 mt-3">
        <div class="col-md-12 fw-bold">
          Alterações na Política de Privacidade
        </div>
        Reservamo-nos o direito de atualizar ou modificar esta Política de Privacidade e Proteção de Dados Pessoais a qualquer momento. Quaisquer alterações serão publicadas nesta página.
      </div>

      <Button label="Fecha"  @click="this.$emit('fecharPoliticaPrivacidade', false)" class="w-full rounded mt-4" outlined/>
  </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  components: {
    Button,
  }
}
</script>

<style>

</style>