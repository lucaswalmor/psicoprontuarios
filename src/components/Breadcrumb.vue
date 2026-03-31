<template>
    <div class="w-full col-md-12 mb-4">
        <Breadcrumb :home="home" :model="items">
            <template #item="{ item, props }">
                <router-link v-if="item.route && !item.useBack" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else-if="item.useBack" v-bind="props.action" @click="goBack" style="cursor: pointer;">
                    <span :class="[item.icon, 'text-color']" />
                    <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                </a>
            </template>
        </Breadcrumb>
    </div>
</template>

<script>
import Breadcrumb from 'primevue/breadcrumb';

export default {
    components: {
        Breadcrumb
    },
    data() {
        return {
            home: {
                icon: 'pi pi-home',
                route: '/dashboard'
            },
            items: []
        }
    },
    mounted() {
        this.updateBreadcrumb();
    },
    watch: {
        '$route'() {
            this.updateBreadcrumb();
        }
    },
    methods: {
        updateBreadcrumb() {
            const route = this.$route;
            const items = [];
            
            // Mapeamento de nomes das rotas para labels em português
            const routeNameMapping = {
                'landing': 'Página Inicial',
                'login': 'Login',
                'DashboardGeral': 'Geral',
                'pacientes': 'Pacientes',
                'prontuarios': 'Prontuários',
                'FinanceiroLista': 'Lista de Transações',
                'FinanceiroReceitas': 'Receitas',
                'FinanceiroDespesas': 'Despesas',
                'FinanceiroNovo': 'Nova Transação',
                'FinanceiroEditar': 'Editar Transação',
                'Agendamentos': 'Agendamentos',
                'formlayout': 'Layout de Formulário',
                'input': 'Entrada de Dados',
                'button': 'Botões',
                'table': 'Tabelas',
                'list': 'Listas',
                'tree': 'Árvores',
                'panel': 'Painéis',
                'overlay': 'Sobreposições',
                'media': 'Mídia',
                'message': 'Mensagens',
                'file': 'Arquivos',
                'menu': 'Menus',
                'charts': 'Gráficos',
                'misc': 'Diversos',
                'timeline': 'Linha do Tempo',
                'empty': 'Página Vazia',
                'crud': 'CRUD',
                'documentation': 'Documentação',
                'notfound': 'Página Não Encontrada',
                'accessDenied': 'Acesso Negado',
                'error': 'Erro',
                'cadastro': 'Cadastro',
                'CadastroPaciente': 'Cadastro de Paciente',
                'EditarPaciente': 'Editar Paciente',
                'Prontuarios': 'Prontuários',
                'Anexos': 'Anexos',
                'Agendamentos': 'Agendamentos',
                'Financeiro': 'Financeiro',
                'Configurações': 'Configurações',
                'Assinatura': 'Assinatura',
                'Upgrade': 'Upgrade',
            };
            
            const pathSegments = route.path.split('/').filter(segment => segment);
            
            // Adiciona o item inicial (Dashboard) se estiver em rotas do dashboard
            if (route.path.startsWith('/dashboard') || route.path.startsWith('/uikit') || route.path.startsWith('/pages') || route.path.startsWith('/documentation')) {
                items.push({
                    label: 'Dashboard',
                    route: '/dashboard'
                });
            }
            
            // Processa os segmentos do caminho
            let currentPath = '';
            pathSegments.forEach((segment, index) => {
                currentPath += `/${segment}`;
                
                // Tenta encontrar o nome da rota baseado no caminho
                let routeName = segment;
                
                // Mapeia segmentos específicos para nomes de rotas
                if (segment === 'uikit') {
                    routeName = pathSegments[index + 1] || 'uikit';
                } else if (segment === 'pages') {
                    routeName = pathSegments[index + 1] || 'pages';
                } else if (segment === 'auth') {
                    routeName = pathSegments[index + 1] || 'auth';
                }
                
                // Se é a última rota, usa o nome da rota atual
                if (index === pathSegments.length - 1) {
                    routeName = route.name || routeName;
                }
                
                const label = routeNameMapping[routeName] || routeName.charAt(0).toUpperCase() + routeName.slice(1);
                
                // Tratamento especial para rotas de financeiro
                if (segment === 'financeiro') {
                    const nextSegment = pathSegments[index + 1];
                    
                    // Se estiver em /financeiro/receitas ou /financeiro/despesas
                    if (nextSegment === 'receitas' || nextSegment === 'despesas') {
                        // Mantém a rota completa (receitas ou despesas) ao invés de apenas /financeiro
                        items.push({
                            label: label,
                            route: currentPath + `/${nextSegment}`
                        });
                    }
                    // Se estiver em /financeiro/novo ou /financeiro/editar/:id
                    else if (nextSegment === 'novo' || nextSegment === 'editar') {
                        // Usar router.back() para voltar à tela anterior
                        items.push({
                            label: label,
                            useBack: true
                        });
                    }
                    // Caso padrão (não deveria acontecer, mas por segurança)
                    else if (index < pathSegments.length - 1) {
                        items.push({
                            label: label,
                            route: currentPath
                        });
                    } else {
                        items.push({
                            label: label
                        });
                    }
                } else if (index < pathSegments.length - 1) {
                    // Se não é o último item, adiciona route para navegação
                    items.push({
                        label: label,
                        route: currentPath
                    });
                } else {
                    // Último item não tem route (página atual)
                    items.push({
                        label: label
                    });
                }
            });
            
            this.items = items;
        },
        
        goBack() {
            // Voltar para a tela anterior
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
:deep(.card) {
    padding: 10px !important;
}
</style>