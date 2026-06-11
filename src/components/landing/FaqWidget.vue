<script setup>
import { ref } from 'vue';

const faqs = [
    {
        pergunta: 'Como funciona o teste grátis de 7 dias?',
        resposta:
            'Você cria sua conta, escolhe o plano (Simples ou Pro) e usa o sistema completo por 7 dias sem pagar nada. É necessário cadastrar um cartão para iniciar o teste, mas a cobrança só acontece após o período. Se cancelar durante o teste, não paga nada.'
    },
    {
        pergunta: 'Posso cancelar quando quiser?',
        resposta:
            'Sim. Não há fidelidade nem multa: você cancela a assinatura a qualquer momento direto no seu painel, em Perfil → Plano. Também é possível pausar a assinatura temporariamente, se preferir.'
    },
    {
        pergunta: 'Os dados dos meus pacientes estão seguros?',
        resposta:
            'Sim. O tratamento de dados segue a LGPD e o sigilo profissional: cada conta tem seus dados isolados, o acesso é protegido por verificação em duas etapas, todas as ações ficam registradas em logs de auditoria e você pode ativar backup mensal automático dos seus prontuários.'
    },
    {
        pergunta: 'O que acontece com meus dados se eu sair?',
        resposta:
            'Você pode solicitar a exclusão da conta a qualquer momento, conforme a LGPD. Há um prazo de carência de 30 dias (caso mude de ideia) e, após esse período, seus dados pessoais são removidos. Os prontuários são mantidos de forma anonimizada, conforme as exigências do CFP de guarda de documentos.'
    },
    {
        pergunta: 'Funciona no celular? Preciso instalar algo?',
        resposta:
            'Não precisa instalar nada. O PsicoProntuários é 100% online e funciona em qualquer dispositivo — computador, tablet ou celular — com a mesma conta e os dados sempre sincronizados.'
    },
    {
        pergunta: 'Qual a diferença entre o plano Simples e o Pro?',
        resposta:
            'O Simples inclui tudo o essencial: prontuários com PDF, agenda, financeiro, anamnese, anexos e indicadores de evolução (humor, GAD-7, PHQ-9). O Pro adiciona recursos de IA nos prontuários (melhoria de texto, resumo por voz e relatório profissional), um site próprio para divulgar seu trabalho e as automações de WhatsApp.'
    },
    {
        pergunta: 'Como funcionam as automações de WhatsApp?',
        resposta:
            'No plano Pro, você conecta seu próprio número de WhatsApp ao sistema e ativa rotinas automáticas: lembrete de consulta para os pacientes no dia da sessão, sua agenda do dia enviada para você, mensagens de aniversário e de datas comemorativas.'
    },
    {
        pergunta: 'Consigo migrar meus registros atuais para o sistema?',
        resposta:
            'Sim. Você pode cadastrar seus pacientes e registrar o histórico clínico no prontuário de cada um, além de anexar arquivos (PDFs, imagens e documentos) à ficha do paciente — útil para guardar registros antigos digitalizados.'
    }
];

const aberta = ref(0);

function toggle(idx) {
    aberta.value = aberta.value === idx ? -1 : idx;
}
</script>

<template>
    <div class="faq-section">
        <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                Perguntas frequentes
            </h2>
            <p class="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
                Tudo o que você precisa saber antes de começar
            </p>
        </div>

        <div class="faq-list">
            <div
                v-for="(faq, idx) in faqs"
                :key="idx"
                class="faq-item"
                :class="{ open: aberta === idx }"
            >
                <button class="faq-question" :aria-expanded="aberta === idx" @click="toggle(idx)">
                    <span>{{ faq.pergunta }}</span>
                    <i class="pi" :class="aberta === idx ? 'pi-minus' : 'pi-plus'"></i>
                </button>
                <div v-show="aberta === idx" class="faq-answer">
                    <p>{{ faq.resposta }}</p>
                </div>
            </div>
        </div>

        <p class="faq-chat-hint">
            Não encontrou sua dúvida? Fale com nosso atendimento pelo chat no canto da tela — resposta na hora.
        </p>
    </div>
</template>

<style scoped>
.faq-section {
    padding: 2rem 0;
}

.faq-list {
    @apply max-w-3xl mx-auto space-y-3;
}

.faq-item {
    @apply bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 transition-all duration-200 overflow-hidden;
}

.faq-item.open {
    @apply border-primary shadow-md;
}

.faq-question {
    @apply w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-surface-900 dark:text-surface-0 cursor-pointer bg-transparent border-0;
    font-size: 1.05rem;
}

.faq-question i {
    @apply text-primary flex-shrink-0;
}

.faq-answer {
    @apply px-6 pb-5;
}

.faq-answer p {
    @apply text-surface-600 dark:text-surface-300 leading-relaxed m-0;
}

.faq-chat-hint {
    @apply text-center text-surface-500 dark:text-surface-400 mt-8 text-sm;
}
</style>
