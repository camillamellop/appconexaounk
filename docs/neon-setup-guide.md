# 🗄️ Guia de Configuração do Neon Database

## 📋 Pré-requisitos

1. Conta no [Neon](https://neon.tech)
2. Projeto criado no Neon Console
3. Variáveis de ambiente configuradas

## 🔧 Passo a Passo

### 1. Criar Projeto no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Clique em "Create Project"
3. Escolha um nome (ex: "jack-profile-app")
4. Selecione a região mais próxima
5. Clique em "Create Project"

### 2. Obter String de Conexão

1. No dashboard do projeto, vá em "Connection Details"
2. Copie a **Database URL** (formato: `postgresql://user:password@host/database`)
3. Exemplo: `postgresql://jack_user:abc123@ep-cool-lab-123456.us-east-1.aws.neon.tech/neondb`

### 3. Configurar Variáveis de Ambiente

No seu projeto v0, as seguintes variáveis já estão disponíveis:

\`\`\`env
# Neon Database URLs (já configuradas automaticamente)
NEON_NEON_DATABASE_URL=postgresql://user:password@host/database
NEON_POSTGRES_URL=postgresql://user:password@host/database
NEON_POSTGRES_PRISMA_URL=postgresql://user:password@host/database?pgbouncer=true&connect_timeout=15
\`\`\`

### 4. Executar Scripts SQL

Execute os scripts na seguinte ordem no **Neon SQL Editor**:

#### 4.1 Criar Estrutura
\`\`\`sql
-- Execute: scripts/create-neon-database.sql
-- Cria todas as tabelas, índices e triggers
\`\`\`

#### 4.2 Inserir Dados de Exemplo
\`\`\`sql
-- Execute: scripts/insert-sample-data-neon.sql
-- Insere usuários, eventos, tarefas, etc.
\`\`\`

#### 4.3 Verificar Instalação
\`\`\`sql
-- Execute: scripts/verify-neon-data.sql
-- Valida estrutura e dados inseridos
\`\`\`

## 🔍 Verificação da Configuração

### Teste de Conexão

\`\`\`javascript
// Teste rápido no console do navegador
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log('Usuários:', data))
  .catch(err => console.error('Erro:', err));
\`\`\`

### Estrutura Esperada

Após executar os scripts, você deve ter:

- **8 tabelas** criadas
- **5 usuários** de exemplo
- **4 eventos** na agenda
- **5 tarefas** cadastradas
- **5 documentos** organizados
- **7 transações** financeiras
- **7 gastos fixos**
- **4 metas** financeiras
- **5 projetos** em andamento

## 🚨 Solução de Problemas

### Erro de Conexão
\`\`\`
Error: Connection refused
\`\`\`
**Solução**: Verifique se a `DATABASE_URL` está correta e o projeto Neon está ativo.

### Erro de Permissão
\`\`\`
Error: permission denied for table usuarios
\`\`\`
**Solução**: Verifique se o usuário tem permissões adequadas no banco.

### Tabelas não Encontradas
\`\`\`
Error: relation "usuarios" does not exist
\`\`\`
**Solução**: Execute primeiro o script `create-neon-database.sql`.

## 📊 Monitoramento

### Dashboard Neon
- Acesse o dashboard para monitorar:
  - Conexões ativas
  - Uso de CPU e memória
  - Queries executadas
  - Logs de erro

### Logs da Aplicação
\`\`\`javascript
// Verificar logs das APIs
console.log('API Response:', response);
\`\`\`

## 🔐 Segurança

### Variáveis de Ambiente
- ✅ Nunca commite credenciais no código
- ✅ Use variáveis de ambiente para strings de conexão
- ✅ Configure SSL/TLS para conexões

### Backup
- ✅ Neon faz backup automático
- ✅ Configure snapshots regulares
- ✅ Teste restauração periodicamente

## 📞 Suporte

- **Documentação Neon**: [neon.tech/docs](https://neon.tech/docs)
- **Status Page**: [status.neon.tech](https://status.neon.tech)
- **Discord**: [discord.gg/neon](https://discord.gg/neon)

---

✅ **Configuração Completa!** Seu banco Neon está pronto para uso.
