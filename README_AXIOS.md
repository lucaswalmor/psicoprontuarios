# Configuração Axios e Services

## Visão Geral

Este projeto está configurado com axios para comunicação com a API Laravel usando Sanctum, incluindo interceptors automáticos para loading global e autenticação.

## Estrutura de Arquivos

```
src/
├── utils/
│   └── axios.js              # Configuração base do axios com interceptors
├── services/
│   ├── index.js              # Exportação centralizada dos services
│   ├── authService.js        # Service de autenticação
│   ├── pacientesService.js   # Service de pacientes
│   ├── prontuariosService.js # Service de prontuários
│   └── agendamentosService.js # Service de agendamentos
└── components/
    └── LoadingGlobal.vue     # Componente de loading global
```

## Configuração do Axios

### Interceptors Automáticos

O axios está configurado com interceptors que:

1. **Adicionam token automaticamente** em todas as requisições
2. **Mostram loading global** para todas as requisições (exceto login/logout)
3. **Tratam erros 401** redirecionando para login
4. **Escondem loading** automaticamente ao finalizar requisições

### Variáveis de Ambiente

Configure a URL da API no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## Services Disponíveis

### AuthService
```javascript
// Login
await this.$authService.login({ email, password });

// Logout
await this.$authService.logout();

// Verificar autenticação
await this.$authService.checkAuth();

// Verificar se está autenticado
this.$authService.isAuthenticated();
```

### PacientesService
```javascript
// Buscar todos os pacientes
await this.$pacientesService.getAll();

// Buscar com paginação
await this.$pacientesService.getPaginated(page, perPage, filters);

// Buscar por ID
await this.$pacientesService.getById(id);

// Criar paciente
await this.$pacientesService.create(pacienteData);

// Atualizar paciente
await this.$pacientesService.update(id, pacienteData);

// Deletar paciente
await this.$pacientesService.delete(id);
```

### ProntuariosService
```javascript
// Buscar todos os prontuários
await this.$prontuariosService.getAll();

// Buscar por paciente
await this.$prontuariosService.getByPaciente(pacienteId);

// Criar prontuário
await this.$prontuariosService.create(prontuarioData);

// Adicionar anotação
await this.$prontuariosService.addAnotacao(id, anotacao);
```

### AgendamentosService
```javascript
// Buscar todos os agendamentos
await this.$agendamentosService.getAll();

// Buscar por data
await this.$agendamentosService.getByDate(date);

// Confirmar agendamento
await this.$agendamentosService.confirmar(id);

// Cancelar agendamento
await this.$agendamentosService.cancelar(id, motivo);
```

## Loading Global

O loading é ativado automaticamente para todas as requisições HTTP (exceto login/logout). O componente `LoadingGlobal.vue`:

- Ocupa a tela inteira com overlay escuro
- Impede interação do usuário durante requisições
- Mostra spinner animado com texto
- É responsivo para mobile

### Controle Manual do Loading

Se necessário, você pode controlar o loading manualmente:

```javascript
// Mostrar loading
window.$loading.show();

// Esconder loading
window.$loading.hide();
```

## Exemplo de Uso em Componente

```vue
<template>
    <div>
        <DataTable :value="pacientes" :loading="loading">
            <Column field="nome" header="Nome"></Column>
            <Column field="email" header="Email"></Column>
        </DataTable>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pacientes: [],
            loading: false
        };
    },
    async mounted() {
        await this.carregarPacientes();
    },
    methods: {
        async carregarPacientes() {
            try {
                this.loading = true;
                const response = await this.$pacientesService.getPaginated(1, 10);
                this.pacientes = response.data;
            } catch (error) {
                console.error('Erro:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
```

## Tratamento de Erros

Os interceptors tratam automaticamente:

- **Erro 401**: Remove token e redireciona para login
- **Outros erros**: São propagados para tratamento no componente

## Configuração do Sanctum

Certifique-se de que o Laravel está configurado corretamente:

1. Sanctum instalado e configurado
2. CORS configurado para permitir requisições do frontend
3. Rotas de API protegidas com middleware `auth:sanctum`

## Notas Importantes

- O loading é ativado automaticamente para todas as requisições
- O token é adicionado automaticamente em todas as requisições
- Erros 401 são tratados automaticamente
- Os services estão disponíveis globalmente via `this.$serviceName`
- O loading pode ser controlado manualmente se necessário 