<template>
    <div class="politica-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <!-- Header -->
        <header class="bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <!-- Logo -->
                    <div class="flex items-center">
                        <span class="text-surface-900 dark:text-surface-0 font-bold text-xl ml-3">PsicoProntuários</span>
                    </div>
                    
                    <!-- Voltar Link -->
                    <router-link 
                        to="/cadastro" 
                        class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        ← Voltar ao Cadastro
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-12">
            <div class="max-w-4xl mx-auto">
                <!-- Header da Página -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                        Política de Privacidade
                    </h1>
                    <p class="text-lg text-surface-600 dark:text-surface-400">
                        Última atualização: {{ dataAtualizacao }}
                    </p>
                </div>

                <!-- Conteúdo -->
                <div class="bg-surface-0 dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 p-8">
                    <div class="prose prose-lg max-w-none text-surface-700 dark:text-surface-300">
                        
                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            1. Informações Coletadas
                        </h2>
                        <p class="mb-4">
                            Coletamos as seguintes informações quando você se cadastra em nossa plataforma:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Informações pessoais (nome, sobrenome, email, telefone)</li>
                            <li>Informações profissionais (CRP, CPF)</li>
                            <li>Informações de endereço (CEP, cidade, estado, rua, bairro)</li>
                            <li>Dados de acesso (senha criptografada)</li>
                            <li>Informações de uso da plataforma</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            2. Como Utilizamos Suas Informações
                        </h2>
                        <p class="mb-4">
                            Utilizamos suas informações para:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Fornecer e manter nossos serviços</li>
                            <li>Processar pagamentos e assinaturas</li>
                            <li>Enviar comunicações importantes sobre sua conta</li>
                            <li>Melhorar nossos serviços e experiência do usuário</li>
                            <li>Cumprir obrigações legais</li>
                            <li>Prevenir fraudes e garantir a segurança</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            3. Compartilhamento de Informações
                        </h2>
                        <p class="mb-4">
                            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Com provedores de pagamento (Asaas) para processar transações</li>
                            <li>Quando exigido por lei ou ordem judicial</li>
                            <li>Para proteger nossos direitos e segurança</li>
                            <li>Com seu consentimento explícito</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            4. Segurança dos Dados
                        </h2>
                        <p class="mb-4">
                            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Criptografia de dados em trânsito e em repouso</li>
                            <li>Controle de acesso rigoroso</li>
                            <li>Monitoramento contínuo de segurança</li>
                            <li>Backups regulares e seguros</li>
                            <li>Conformidade com LGPD (Lei Geral de Proteção de Dados)</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            5. Seus Direitos
                        </h2>
                        <p class="mb-4">
                            Você tem os seguintes direitos sobre seus dados pessoais:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Acessar suas informações pessoais</li>
                            <li>Corrigir dados incorretos ou incompletos</li>
                            <li>Solicitar a exclusão de seus dados</li>
                            <li>Revogar consentimento a qualquer momento</li>
                            <li>Portabilidade de dados</li>
                            <li>Oposição ao processamento</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            6. Cookies e Tecnologias Similares
                        </h2>
                        <p class="mb-4">
                            Utilizamos cookies e tecnologias similares para:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Manter você logado em sua conta</li>
                            <li>Lembrar suas preferências</li>
                            <li>Analisar o uso da plataforma</li>
                            <li>Melhorar nossos serviços</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            7. Retenção de Dados
                        </h2>
                        <p class="mb-4">
                            Mantemos suas informações pelo tempo necessário para:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Fornecer nossos serviços</li>
                            <li>Cumprir obrigações legais</li>
                            <li>Resolver disputas</li>
                            <li>Fazer cumprir nossos acordos</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            8. Transferências Internacionais
                        </h2>
                        <p class="mb-4">
                            Seus dados podem ser processados em servidores localizados em outros países. Garantimos que essas transferências sejam feitas de acordo com as leis de proteção de dados aplicáveis.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            9. Menores de Idade
                        </h2>
                        <p class="mb-4">
                            Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores de idade.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            10. Alterações nesta Política
                        </h2>
                        <p class="mb-4">
                            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas por email ou através de nossa plataforma.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            11. Contato
                        </h2>
                        <p class="mb-4">
                            Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco:
                        </p>
                        <ul class="list-none pl-6 mb-6">
                            <li><strong>Email:</strong> psicoprontuarios@gmail.com</li>
                            <li><strong>Telefone:</strong> (34) 99202-1394</li>
                        </ul>

                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
                            <p class="text-blue-800 dark:text-blue-200">
                                <strong>Importante:</strong> Ao usar nossa plataforma, você concorda com esta política de privacidade. Se não concordar, não use nossos serviços.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'PoliticaPrivacidade',
    data() {
        return {
            dataAtualizacao: '30 de Agosto de 2025'
        };
    }
};
</script>

<style scoped>
.politica-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.prose h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.prose ul {
    margin-bottom: 1.5rem;
}

.prose p {
    margin-bottom: 1rem;
    line-height: 1.6;
}

/* Animações */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.politica-page {
    animation: fadeIn 0.6s ease-out;
}

/* Responsividade */
@media (max-width: 768px) {
    .politica-page {
        padding: 0 1rem;
    }
}
</style> 