# Votaí

Um aplicativo completo (Full-stack) para criação, gerenciamento de enquetes e votações. O projeto é dividido em um frontend construído com Next.js e um backend construído com Node.js e Express.

## Tecnologias Utilizadas

**Frontend:**
- [Next.js](https://nextjs.org/) (React)
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com/) & Lucide React

**Backend:**
- Node.js
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/) (MongoDB)

---

##  Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/) (ou yarn/pnpm)
- Um cluster no [MongoDB Atlas](https://www.mongodb.com/atlas/database) ou uma instância do MongoDB rodando localmente.

---

##  Como Executar o Projeto

O projeto está dividido em duas pastas principais: `backend` e `frontend`. É necessário rodar ambas as partes simultaneamente para o sistema funcionar por completo.

### 1. Configurando e Rodando o Backend

1. Abra o terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz da pasta `backend` com a sua URL de conexão do MongoDB:
   ```env
   DB_URL="mongodb+srv://<usuario>:<senha>@cluster0.exemplo.mongodb.net"
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   *(Por padrão, a API estará rodando em `http://localhost:7340`)*

### 2. Configurando e Rodando o Frontend

1. Abra um **novo terminal** (mantendo o backend rodando) e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz da pasta `frontend` e aponte para a URL da API (backend):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:7340
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse o aplicativo no seu navegador em: [http://localhost:3000](http://localhost:3000)

---

## Estrutura de Pastas

```text
votai/
├── backend/          # API construída com Node.js e Express
│   ├── src/          # Código fonte (rotas, models, etc.)
│   ├── server.js     # Ponto de entrada (App) do backend
│   └── package.json  # Dependências do backend
│
└── frontend/         # Aplicação web construída com Next.js
    ├── app/          # Páginas e rotas da aplicação
    ├── components/   # Componentes da interface (EnqueteCard, etc.)
    └── package.json  # Dependências do frontend
```
