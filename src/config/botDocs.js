/**
 * Catálogo das bases de conhecimento do bot (n8n).
 * Os arquivos .md ficam na raiz do repositório e são copiados para public/bot-docs/ no build.
 */
export const BOT_DOCS = [
    {
        slug: 'principal',
        file: 'tool_bot.md',
        title: 'Prompt principal',
        description: 'Roteador de tools — instruções gerais do assistente'
    },
    {
        slug: 'landing',
        file: 'tool_bot_landinpage.md',
        title: 'Landing',
        description: 'Visitantes pré-cadastro — produto, planos e contratação'
    },
    {
        slug: 'agendamento',
        file: 'tool_bot_agendamento.md',
        title: 'Agendamentos',
        description: 'Calendário, recorrência e edição de consultas'
    },
    {
        slug: 'pacientes',
        file: 'tool_bot_pacientes.md',
        title: 'Pacientes',
        description: 'Ficha, prontuários, sessões, anamnese e evolução'
    },
    {
        slug: 'financeiro',
        file: 'tool_bot_financeiro.md',
        title: 'Financeiro',
        description: 'Receitas, despesas, categorias e filtros'
    },
    {
        slug: 'dashboard',
        file: 'tool_bot_dashboard.md',
        title: 'Dashboard',
        description: 'Métricas da clínica e aba financeira'
    },
    {
        slug: 'configuracoes',
        file: 'tool_bot_configuracoes.md',
        title: 'Configurações',
        description: 'WhatsApp, notificações e plano Pro'
    },
    {
        slug: 'perfil',
        file: 'tool_bot_perfil.md',
        title: 'Perfil',
        description: 'Dados pessoais, senha, zona de perigo e exclusão de conta LGPD'
    },
    {
        slug: 'site',
        file: 'tool_bot_site.md',
        title: 'Meu Site',
        description: 'Landing page pública do psicólogo'
    }
];

export function findBotDocBySlug(slug) {
    return BOT_DOCS.find((doc) => doc.slug === slug) || null;
}

/** Caminho público do arquivo .md (texto puro — usar no n8n HTTP Request). */
export function getBotDocRawPath(file) {
    return `/bot-docs/${file}`;
}

export function getBotDocPublicUrl(file, origin = '') {
    const base = (origin || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
    return `${base}${getBotDocRawPath(file)}`;
}
