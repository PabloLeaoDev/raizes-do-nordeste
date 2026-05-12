# Raízes do Nordeste

API de gestão de vendas e estoque da rede de lanchonetes Raízes do Nordeste.

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Ambiente de execução
- **Fastify** - Framework web de alta performance
- **Zod** - Validação de schemas
- **pg** - Cliente do PostgreSQL
- **bcrypt** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **jest** - Testes unitários
- **docker** e **docker-compose** - Containerização
- **swagger** - Documentação da API

## 🚀 Como Rodar com Docker

### 1. Instale o Docker e Docker Compose

Certifique-se de ter o Docker instalado em sua máquina.

### 2. Clone o repositório

```bash
git clone <repository-url>
cd raizes-do-nordeste
```

### 3. Crie o arquivo `.env`

Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:

```bash
cp .env.example .env
```

**Configuração recomendada para desenvolvimento:**

```env
# Backend
HOST=localhost
PORT=3000

DB_HOST=database
DB_PORT=5432
DB_NAME=raizes-do-nordeste-dev
DB_USER=postgres
DB_PASS=postgres

JWT_SECRET=your-secret-key-here
```

### 4. Inicie os serviços

```bash
docker compose up -d
```

Isso irá:
1. Criar e iniciar o banco de dados PostgreSQL
2. Criar e iniciar o backend Node.js

### 5. Acesse as aplicações

- **Backend API:** http://localhost:3000

### 6. Crie um usuário admin (opcional)

Para criar um usuário admin, você precisa primeiro popular o banco. Você pode fazer isso:

1. **Usando um script** (veja a seção abaixo)
2. **Criando manualmente** através da API (depois que o backend estiver rodando)

### 7. Para parar os serviços

```bash
docker compose down
```

## 📝 Criando Usuário Admin com Script

### 1. Entre no container do backend

```bash
docker exec -it raizes-do-nordeste-backend bash
```

### 2. Execute o script de seed

```bash
npx ts-node src/infra/database/scripts/seed.ts
```

### 3. Saia do container

```bash
exit
```

Agora você pode fazer login com o usuário admin:
- **Email:** [EMAIL_ADDRESS]`
- **Senha:** `admin123`

## 🧪 Testes

### Testes de Integração

Para rodar os testes de integração:

```bash
./node_modules/.bin/jest --config jest.config.js --runInBand
```

ou se tiver criado um script no `package.json`:

```bash
npm test
```

### Testes Unitários

```bash
npm run test:unit
```

## 🔐 Endpoints Principais

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login de usuário

### Produtos
- `POST /produtos` - Criar produto (ADMIN, GERENTE)
- `GET /produtos` - Listar produtos (TODOS)
- `GET /produtos/:id` - Buscar produto por ID (TODOS)
- `PATCH /produtos/:id` - Atualizar produto (ADMIN, GERENTE)
- `DELETE /produtos/:id` - Deletar produto (ADMIN)

### Usuários
- `GET /usuarios` - Listar usuários (ADMIN, GERENTE)
- `GET /usuarios/:id` - Buscar usuário por ID (ADMIN, GERENTE)
- `PATCH /usuarios/:id` - Atualizar usuário (ADMIN, GERENTE)

### Pedidos
- `POST /pedidos` - Criar pedido (TODOS)
- `GET /pedidos` - Listar pedidos (ADMIN, GERENTE, ATENDENTE)
- `PATCH /pedidos/:id/status` - Atualizar status do pedido (ADMIN, GERENTE, ATENDENTE)

## 📂 Estrutura do Projeto

```
raizes-do-nordeste/
├── src/
│   ├── api/
│   │   ├── routes/           # Rotas da API
│   │   ├── controllers/      # Controllers da API
│   │   ├── schemas/          # Schemas de validação
│   │   └── middlewares/      # Middlewares de autenticação
│   ├── infra/
│   │   ├── database/         # Configuração do banco de dados
│   │   ├── providers/        # Provedores de serviços externos
│   │   ├── repositories/     # Repositórios de dados
│   │   └── transaction/      # Gerenciamento de transações
│   ├── domain/
│   │   ├── entities/         # Entidades do domínio
│   │   └── use-cases/        # Casos de uso da aplicação
│   ├── services/             # Serviços da aplicação
│   ├── tests/
│   │   ├── unit/             # Testes unitários
│   │   └── integration/      # Testes de integração
│   ├── utils/                # Utilitários
│   ├── server.ts             # Configuração do servidor
│   └── app.ts                # Configuração da aplicação
├── jest.config.js            # Configuração do Jest
├── package.json              # Dependências do projeto
├── package-lock.json         # Dependências das dependências do projeto
├── .gitignore                # Arquivos ignorados pelo Git
├── swagger.json              # Documentação da API
├── tsconfig.json              # Configuração do TypeScript
├── docker-compose.yml        # Configuração do Docker
├── .env.example              # Exemplo de arquivo de ambiente
├── README.md                 # Informações do projeto
└── LICENSE                   # Licença do projeto
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de código aberto e licenciado sob a licença MIT.
