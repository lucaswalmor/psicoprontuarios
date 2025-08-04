<template>
    <div class="termos-page bg-surface-0 dark:bg-surface-900 min-h-screen">
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
                        Termos de Uso
                    </h1>
                    <p class="text-lg text-surface-600 dark:text-surface-400">
                        Última atualização: {{ dataAtualizacao }}
                    </p>
                </div>

                <!-- Conteúdo -->
                <div class="bg-surface-0 dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 p-8">
                    <div class="prose prose-lg max-w-none text-surface-700 dark:text-surface-300">
                        
                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            1. Aceitação dos Termos
                        </h2>
                        <p class="mb-4">
                            Ao acessar e usar a plataforma PsicoProntuários, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            2. Descrição dos Serviços
                        </h2>
                        <p class="mb-4">
                            A PsicoProntuários é uma plataforma digital que oferece:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Gestão de prontuários eletrônicos para psicólogos</li>
                            <li>Agendamento de consultas</li>
                            <li>Comunicação com pacientes</li>
                            <li>Relatórios e análises</li>
                            <li>Armazenamento seguro de dados</li>
                            <li>Ferramentas de gestão financeira</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            3. Elegibilidade e Cadastro
                        </h2>
                        <p class="mb-4">
                            Para usar nossos serviços, você deve:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Ter pelo menos 18 anos de idade</li>
                            <li>Ser um psicólogo registrado com CRP válido</li>
                            <li>Fornecer informações verdadeiras e precisas</li>
                            <li>Manter a confidencialidade de sua conta</li>
                            <li>Ser responsável por todas as atividades em sua conta</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            4. Uso Aceitável
                        </h2>
                        <p class="mb-4">
                            Você concorda em usar nossos serviços apenas para fins legais e de acordo com estes termos. É proibido:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Usar os serviços para atividades ilegais</li>
                            <li>Violar direitos de terceiros</li>
                            <li>Transmitir vírus ou código malicioso</li>
                            <li>Tentar acessar sistemas sem autorização</li>
                            <li>Interferir no funcionamento da plataforma</li>
                            <li>Compartilhar credenciais de acesso</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            5. Privacidade e Confidencialidade
                        </h2>
                        <p class="mb-4">
                            Sua privacidade é importante para nós. Nossa Política de Privacidade, incorporada a estes termos, descreve como coletamos, usamos e protegemos suas informações.
                        </p>
                        <p class="mb-4">
                            Como psicólogo, você é responsável por:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Manter a confidencialidade dos dados dos pacientes</li>
                            <li>Cumprir as leis de proteção de dados aplicáveis</li>
                            <li>Obter consentimento adequado dos pacientes</li>
                            <li>Usar medidas de segurança apropriadas</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            6. Pagamentos e Assinaturas
                        </h2>
                        <p class="mb-4">
                            Nossos serviços são oferecidos mediante assinatura mensal:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Pagamentos são processados pela Asaas</li>
                            <li>Assinaturas são renovadas automaticamente</li>
                            <li>Você pode cancelar a qualquer momento</li>
                            <li>Reembolsos seguem nossa política específica</li>
                            <li>Preços podem ser alterados com aviso prévio</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            7. Propriedade Intelectual
                        </h2>
                        <p class="mb-4">
                            A plataforma e todo seu conteúdo são propriedade da PsicoProntuários ou de nossos licenciadores. Você recebe uma licença limitada para usar nossos serviços conforme estes termos.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            8. Limitação de Responsabilidade
                        </h2>
                        <p class="mb-4">
                            Em nenhuma circunstância seremos responsáveis por:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Danos indiretos, incidentais ou consequenciais</li>
                            <li>Perda de dados ou interrupção de serviços</li>
                            <li>Decisões tomadas com base em informações da plataforma</li>
                            <li>Problemas de conectividade ou equipamento</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            9. Disponibilidade do Serviço
                        </h2>
                        <p class="mb-4">
                            Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos disponibilidade contínua. Podemos realizar manutenções programadas com aviso prévio.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            10. Backup e Segurança
                        </h2>
                        <p class="mb-4">
                            Implementamos medidas de segurança robustas, mas recomendamos que você mantenha backups de seus dados importantes. Não somos responsáveis por perda de dados devido a falhas técnicas.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            11. Rescisão
                        </h2>
                        <p class="mb-4">
                            Podemos suspender ou encerrar sua conta se você:
                        </p>
                        <ul class="list-disc pl-6 mb-6">
                            <li>Violar estes termos</li>
                            <li>Não pagar as taxas devidas</li>
                            <li>Usar os serviços de forma inadequada</li>
                            <li>Fornecer informações falsas</li>
                        </ul>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            12. Modificações dos Termos
                        </h2>
                        <p class="mb-4">
                            Podemos modificar estes termos a qualquer momento. Mudanças significativas serão comunicadas por email ou através da plataforma. O uso continuado após as modificações constitui aceitação dos novos termos.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            13. Lei Aplicável
                        </h2>
                        <p class="mb-4">
                            Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            14. Disposições Gerais
                        </h2>
                        <p class="mb-4">
                            Se qualquer disposição destes termos for considerada inválida, as demais disposições permanecerão em vigor. Estes termos constituem o acordo completo entre você e a PsicoProntuários.
                        </p>

                        <h2 class="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">
                            15. Contato
                        </h2>
                        <p class="mb-4">
                            Para dúvidas sobre estes termos, entre em contato:
                        </p>
                        <ul class="list-none pl-6 mb-6">
                            <li><strong>Email:</strong> juridico@psicoprontuarios.com.br</li>
                            <li><strong>Telefone:</strong> (34) 99202-1394</li>
                        </ul>

                        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-8">
                            <p class="text-green-800 dark:text-green-200">
                                <strong>Aviso:</strong> Ao usar nossa plataforma, você confirma que leu, entendeu e concorda com estes Termos de Uso e nossa Política de Privacidade.
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
    name: 'TermosUso',
    data() {
        return {
            dataAtualizacao: '30 de Agosto de 2025'
        };
    }
};
</script>

<style scoped>
.termos-page {
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

.termos-page {
    animation: fadeIn 0.6s ease-out;
}

/* Responsividade */
@media (max-width: 768px) {
    .termos-page {
        padding: 0 1rem;
    }
}
</style> 