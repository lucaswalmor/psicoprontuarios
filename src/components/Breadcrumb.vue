<template>
    <div class="w-full col-md-12 mb-4">
        <Breadcrumb :home="home" :model="items">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
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
                'DashboardGeral': 'Dashboard',
                'pacientes': 'Pacientes',
                'prontuarios': 'Prontuários',
                'FinanceiroLista': 'Lista de Transações',
                'FinanceiroNovo': 'Nova Transação',
                'FinanceiroDashboard': 'Dashboard Financeiro',
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
                'carne-leao': 'Carne Leão',
                'cadastro': 'Cadastro',
                'CarneLeao': 'Lista de Carne Leão',
                'GerarCarneLeao': 'Gerar Carne Leão',
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
                
                // Se não é o último item, adiciona route para navegação
                if (index < pathSegments.length - 1) {
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
        }
    }
}
</script>

<style scoped>
:deep(.card) {
    padding: 10px !important;
}
</style>