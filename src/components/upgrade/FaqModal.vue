<template>
    <div class="faq-modal">
        <Button 
            label="Ver Perguntas Frequentes" 
            icon="pi pi-question-circle"
            class="p-button-outlined"
            @click="showFaq = true"
        />

        <Dialog 
            v-model:visible="showFaq" 
            modal 
            header="Perguntas Frequentes"
            :style="{ width: '70vw', maxWidth: '800px' }"
            class="faq-dialog"
        >
            <div class="faq-content">
                <Accordion>
                    <AccordionTab header="Posso cancelar minha assinatura a qualquer momento?">
                        <p>Sim! Você pode cancelar sua assinatura a qualquer momento através do seu painel de controle. 
                        Não há fidelidade mínima e você não será cobrado após o cancelamento.</p>
                    </AccordionTab>

                    <AccordionTab header="Como funciona o upgrade de plano?">
                        <p>O upgrade é processado imediatamente após a confirmação do pagamento. 
                        Você terá acesso instantâneo aos novos recursos do plano escolhido. 
                        A cobrança será feita mensalmente conforme o valor do novo plano.</p>
                    </AccordionTab>

                    <AccordionTab header="Qual o tempo de ativação do novo plano?">
                        <p>O novo plano é ativado instantaneamente após a confirmação do pagamento. 
                        Não há tempo de espera - você terá acesso imediato a todos os recursos do plano escolhido.</p>
                    </AccordionTab>

                    <AccordionTab header="Posso fazer downgrade do meu plano?">
                        <p>Sim, você pode fazer downgrade do seu plano a qualquer momento. 
                        O downgrade será aplicado no próximo ciclo de cobrança, mantendo os recursos atuais até o final do período.</p>
                    </AccordionTab>

                    <AccordionTab header="Há fidelidade nos planos?">
                        <p>Não! Todos os nossos planos são sem fidelidade. Você pode cancelar ou alterar seu plano a qualquer momento sem penalidades.</p>
                    </AccordionTab>

                    <AccordionTab header="Como funciona o suporte técnico?">
                        <p>O suporte técnico varia conforme o plano:</p>
                        <ul>
                            <li><strong>Gratuito:</strong> Suporte por email</li>
                            <li><strong>Essencial:</strong> Suporte por email e chat</li>
                            <li><strong>Profissional:</strong> Suporte prioritário por email, chat e telefone</li>
                        </ul>
                    </AccordionTab>

                    <AccordionTab header="Meus dados estão seguros?">
                        <p>Sim! Todos os seus dados são protegidos com criptografia de ponta a ponta. 
                        Não armazenamos dados de cartão de crédito em nossos servidores - 
                        todo processamento de pagamento é feito pela Asaas, empresa especializada em segurança.</p>
                    </AccordionTab>

                    <AccordionTab header="Posso usar em múltiplos dispositivos?">
                        <p>Sim! Você pode acessar sua conta de qualquer dispositivo com internet. 
                        Seus dados são sincronizados automaticamente entre todos os dispositivos.</p>
                    </AccordionTab>

                    <AccordionTab header="Há limite de pacientes por plano?">
                        <p>Sim, os limites variam por plano:</p>
                        <ul>
                            <li><strong>Gratuito:</strong> Até 10 pacientes</li>
                            <li><strong>Essencial:</strong> Até 15 pacientes</li>
                            <li><strong>Profissional:</strong> Até 30 pacientes</li>
                        </ul>
                    </AccordionTab>

                    <AccordionTab header="Como funciona o backup automático?">
                        <p>O backup automático está disponível no plano Profissional. 
                        Seus dados são salvos automaticamente a cada 24 horas em servidores seguros, 
                        garantindo que você nunca perca informações importantes.</p>
                    </AccordionTab>

                    <AccordionTab header="Posso exportar meus dados?">
                        <p>Sim! Você pode exportar seus dados a qualquer momento. 
                        No plano Profissional, você também pode gerar prontuários em PDF 
                        para impressão ou arquivamento.</p>
                    </AccordionTab>
                </Accordion>
            </div>

            <template #footer>
                <div class="faq-footer">
                    <p>Ainda tem dúvidas? Entre em contato conosco:</p>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="pi pi-envelope"></i>
                            <span>suporte@psicoprontuarios.com</span>
                        </div>
                        <div class="contact-item">
                            <i class="pi pi-phone"></i>
                            <span>(11) 99999-9999</span>
                        </div>
                        <div class="contact-item">
                            <i class="pi pi-clock"></i>
                            <span>Segunda a Sexta, 8h às 18h</span>
                        </div>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'FaqModal',
    setup() {
        const showFaq = ref(false);

        return {
            showFaq
        };
    }
};
</script>

<style scoped>
.faq-modal {
    display: inline-block;
}

.faq-content {
    max-height: 60vh;
    overflow-y: auto;
}

.faq-content p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: var(--text-color-secondary);
}

.faq-content ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.faq-content li {
    margin-bottom: 0.5rem;
    color: var(--text-color-secondary);
}

.faq-content strong {
    color: var(--text-color);
    font-weight: 600;
}

.faq-footer {
    text-align: center;
    padding: 1rem 0;
    border-top: 1px solid var(--surface-border);
    margin-top: 1rem;
}

.faq-footer p {
    margin-bottom: 1rem;
    color: var(--text-color);
    font-weight: 600;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.contact-item i {
    color: var(--primary-color);
}

/* Estilização do Accordion */
:deep(.p-accordion) {
    border: none;
}

:deep(.p-accordion .p-accordion-header) {
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    background: var(--surface-card);
}

:deep(.p-accordion .p-accordion-header:not(.p-disabled).p-highlight:hover) {
    background: var(--surface-hover);
    border-color: var(--primary-color);
}

:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
    padding: 1rem;
    font-weight: 600;
    color: var(--text-color);
}

:deep(.p-accordion .p-accordion-content) {
    border: 1px solid var(--surface-border);
    border-top: none;
    border-radius: 0 0 8px 8px;
    padding: 1rem;
    background: var(--surface-ground);
}

/* Responsive */
@media (max-width: 768px) {
    .faq-content {
        max-height: 50vh;
    }
    
    .contact-info {
        font-size: 0.8rem;
    }
}
</style> 