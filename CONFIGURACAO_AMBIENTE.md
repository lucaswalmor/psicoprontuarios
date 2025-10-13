# Configuração de Ambiente - Psico Prontuários

## Como funciona a detecção automática de ambiente

O sistema agora detecta automaticamente em qual ambiente você está trabalhando e configura a URL da API adequadamente.

### Detecção Automática

O sistema verifica:
1. **Variável de ambiente `VITE_API_URL`** (se definida, tem prioridade)
2. **Modo do Vite** (`import.meta.env.DEV`)
3. **Hostname da aplicação** (localhost, 127.0.0.1)

### Ambientes Suportados

- **Desenvolvimento**: `http://127.0.0.1:8000/api`
- **Produção V2**: `https://psicoprontuarios-v2.lksoftware.com.br/public/api/`
- **Produção V1**: `https://psicoprontuarios.lksoftware.com.br/public/api/`

## Como usar

### 1. Detecção Automática (Recomendado)
Não precisa fazer nada! O sistema detecta automaticamente:
- Se você estiver rodando `npm run dev` → usa desenvolvimento
- Se estiver em produção → usa produção V2

### 2. Configuração Manual via Variável de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Para desenvolvimento
VITE_API_URL=http://127.0.0.1:8000/api

# Para produção V2
VITE_API_URL=https://psicoprontuarios-v2.lksoftware.com.br/public/api/

# Para produção V1
VITE_API_URL=https://psicoprontuarios.lksoftware.com.br/public/api/
```

### 3. Configuração via Código
Edite o arquivo `src/config/environment.js` para alterar as URLs padrão.

## Debug

O sistema mostra no console qual ambiente e URL estão sendo usados:
```
🌍 Ambiente: development
🔗 API URL: http://127.0.0.1:8000/api
```

## Vantagens

✅ **Não precisa mais editar manualmente** a baseURL  
✅ **Detecção automática** do ambiente  
✅ **Flexível** - pode sobrescrever via variável de ambiente  
✅ **Debug fácil** - mostra qual URL está sendo usada  
✅ **Mantém compatibilidade** com configurações existentes
