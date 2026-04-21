# SplitSmart 💸

> Divida despesas entre amigos de forma simples, justa e sem dor de cabeça.

SplitSmart é uma aplicação web para gerenciar e dividir contas em grupo. Crie grupos, registre quem pagou o quê, escolha como dividir — igualmente, por valor exato ou por porcentagem — e veja instantaneamente quem deve quanto para quem, com o menor número de transferências possível.

---

## Funcionalidades

- **Grupos** — crie grupos para viagens, repúblicas, jantares ou qualquer ocasião
- **Despesas** — registre despesas com categoria, data e método de divisão
- **Balanço inteligente** — algoritmo que minimiza o número de transferências necessárias
- **Divisão flexível** — igualmente, por valor exato ou por porcentagem
- **IA com Gemini** — sugestão automática de categoria e resumo de despesas em linguagem natural
- **Autenticação** — login com e-mail e senha

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 strict |
| UI | Material UI v6 |
| Estilização | Tailwind CSS v4 |
| Animações | GSAP |
| IA | Google Gemini |
| Autenticação | NextAuth.js v5 |
| Testes | Vitest + Testing Library |

---

## Pré-requisitos

- Node.js 20+
- npm 10+

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/splitsmart.git
cd splitsmart
npm install
```

Copie o arquivo de variáveis de ambiente e preencha os valores:

```bash
cp .env.example .env.local
```

Abra `.env.local` e preencha:

```env
NEXTAUTH_SECRET=          # gere com: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=           # obtenha em: https://aistudio.google.com/app/apikey
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Credenciais de teste

Em ambiente de desenvolvimento, use as credenciais abaixo para entrar sem precisar criar uma conta:

| E-mail | Senha |
|---|---|
| ana@test.com | 123456 |
| bruno@test.com | 123456 |

---

## Scripts disponíveis

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run start      # inicia o build de produção
npm run lint       # verifica erros de lint
npm run lint:fix   # corrige erros de lint automaticamente
npm run format     # formata todos os arquivos com Prettier
npm test           # roda os testes
npm run test:ui    # roda os testes com interface visual
npm run test:coverage  # relatório de cobertura
```
