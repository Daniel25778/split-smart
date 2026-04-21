# CLAUDE.md — SplitSmart

> Este arquivo descreve o projeto, stack, arquitetura, convenções e boas práticas do SplitSmart.
> Leia este arquivo **inteiro** antes de escrever qualquer código.

---

## 1. O que é o SplitSmart

SplitSmart é uma aplicação web para **dividir contas e despesas entre amigos** de forma simples, justa e transparente. O usuário pode criar grupos, adicionar despesas, definir quem pagou e quem deve, e visualizar um resumo claro de quem deve quanto para quem — minimizando o número de transferências necessárias.

Casos de uso principais:

- Viagens em grupo (hotel, combustível, refeições)
- Repúblicas (aluguel, contas de utilidades, compras de supermercado)
- Jantares e eventos pontuais entre amigos
- Qualquer situação onde múltiplas pessoas compartilham despesas

---

## 2. Stack tecnológica

| Camada          | Tecnologia                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                           |
| Linguagem       | TypeScript 5 — modo `strict` ativado              |
| UI Components   | Material UI (MUI) v6                              |
| Estilização     | Tailwind CSS v4 + MUI `sx` prop quando necessário |
| Animações       | GSAP (GreenSock Animation Platform)               |
| IA / LLM        | Google Gemini via `@google/generative-ai`         |
| Testes          | Vitest + Testing Library                          |
| Linting         | ESLint (flat config) + Prettier                   |
| Git hooks       | Husky v9 + lint-staged                            |
| Package manager | npm                                               |

---

## 3. Arquitetura de pastas

```
src/
├── app/                        # App Router — rotas, layouts, pages
│   ├── (auth)/                 # Route group: autenticação
│   ├── (dashboard)/            # Route group: app autenticado
│   └── api/                    # Route Handlers (API)
├── components/
│   ├── atoms/                  # Elementos mínimos: Button, Input, Badge, Avatar...
│   ├── molecules/              # Composições simples: FormField, ExpenseCard...
│   ├── organisms/              # Blocos complexos: ExpenseList, GroupHeader...
│   └── templates/              # Layouts de página reutilizáveis
├── hooks/                      # Custom React hooks (use*)
├── services/                   # Chamadas a APIs externas e Gemini
├── lib/                        # Utilitários puros, clients (gemini.ts, etc.)
├── types/                      # Tipos e interfaces TypeScript globais
└── tests/                      # Setup global de testes (setup.ts)
```

Cada componente vive em sua própria pasta com barrel export:

```
atoms/Button/
  Button.tsx
  Button.test.tsx
  Button.stories.tsx   # storybook-compatible, mesmo sem Storybook instalado
  index.ts
```

---

## 4. Convenções de código

### TypeScript

- Modo `strict: true` sempre. Sem `any` explícito — use `unknown` e narrowing.
- Prefira `interface` para props de componentes, `type` para unions/intersections.
- Exports nomeados em vez de default exports — exceto em `page.tsx` e `layout.tsx` (Next.js exige default).
- Tipos globais ficam em `src/types/`. Tipos locais ficam no próprio arquivo.

```ts
// ✅ Correto
interface ExpenseCardProps {
  expense: Expense
  onDelete: (id: string) => void
}

// ❌ Evitar
const ExpenseCard = (props: any) => { ... }
```

### Componentes React

- Sempre componentes funcionais com tipagem explícita nas props.
- Props de componentes MUI estendem os tipos nativos do MUI quando necessário.
- Não use `React.FC` — declare o tipo diretamente na função.
- Desestruture props na assinatura da função.
- **Sempre use arrow function** — nunca `function` declaration para componentes, hooks ou utilitários.
- **Proibido escrever comentários no código** — o código deve ser autoexplicativo através de bons nomes de variáveis e funções.

```tsx
// ✅ Correto
const Button = ({ children, variant = 'primary', isLoading = false, ...rest }: ButtonProps) => { ... }

// ❌ Evitar — function declaration
function Button({ children, variant = 'primary', isLoading = false, ...rest }: ButtonProps) { ... }

// ❌ Evitar — comentários no código
const calculateBalance = (expenses: Expense[]) => {
  // soma todas as despesas do grupo
  return expenses.reduce(...)
}
```

### Naming

| Elemento               | Convenção           | Exemplo             |
| ---------------------- | ------------------- | ------------------- |
| Componentes            | PascalCase          | `ExpenseCard`       |
| Hooks                  | camelCase com `use` | `useExpenses`       |
| Funções/variáveis      | camelCase           | `calculateBalance`  |
| Constantes globais     | UPPER_SNAKE_CASE    | `MAX_GROUP_SIZE`    |
| Arquivos de componente | PascalCase          | `ExpenseCard.tsx`   |
| Arquivos de utilitário | camelCase           | `formatCurrency.ts` |
| Tipos/Interfaces       | PascalCase          | `ExpenseGroup`      |

### Imports

- Use o alias `@/` para imports absolutos a partir de `src/`.
- Ordem: bibliotecas externas → imports internos (`@/`) → imports relativos.
- Sem imports circular entre camadas.

```ts
// ✅ Correto
import { useState } from 'react'
import { Button } from '@mui/material'
import { useExpenses } from '@/hooks/useExpenses'
import { formatCurrency } from './utils'
```

---

## 5. Material UI — convenções de uso

- Use o **tema centralizado** em `src/lib/theme.ts` para cores, tipografia e breakpoints. Nunca hardcode valores de cor.
- Use a prop `sx` do MUI para ajustes pontuais. Para estilos reutilizáveis, prefira classes Tailwind.
- **Não misture** `styled-components` ou `emotion` diretamente — use só o que MUI já expõe via `sx` e `ThemeProvider`.
- Componentes MUI já têm acessibilidade embutida — não reinvente `role`, `aria-label` quando o MUI já cuida.
- Para customizar componentes MUI, prefira `slotProps` e `slots` (API nova do MUI v6) em vez de `classes`.

```tsx
// ✅ Uso correto com sx + Tailwind
<Button variant="contained" sx={{ borderRadius: 2 }} className="w-full">
  Adicionar despesa
</Button>
```

---

## 6. Tailwind CSS — convenções de uso

- Tailwind é responsável por **layout, espaçamento, responsividade e utilitários**.
- MUI é responsável pelos **componentes interativos** (inputs, botões, modais, etc.).
- Não use Tailwind para estilizar internals de componentes MUI (use `sx` nesses casos).
- Use as classes Tailwind em `className` de elementos HTML e wrappers de layout.
- Configure o `content` do `tailwind.config.ts` para incluir todos os arquivos `src/**`.
- Prefixe classes de cores com variáveis do tema MUI quando possível para manter consistência.

---

## 7. GSAP — convenções de animação

- GSAP é usado para animações de **entrada de página**, **transições de elementos** e **micro-interações** elaboradas que CSS não cobre bem.
- Para animações simples (hover, focus), prefira Tailwind (`transition`, `duration-*`, `ease-*`).
- Inicialize animações GSAP dentro de `useEffect` com cleanup adequado para evitar memory leaks.
- Use `gsap.context()` para escopo e limpeza automática em componentes React.
- Registre plugins no topo do arquivo onde são usados (`ScrollTrigger`, `TextPlugin`, etc.).

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' })
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}>
      <h1 className="hero-title">...</h1>
      <p className="hero-subtitle">...</p>
    </div>
  )
}
```

---

## 8. Gemini AI — integração

- O client Gemini é um **singleton** em `src/lib/gemini.ts`.
- A chave `GEMINI_API_KEY` vem de variáveis de ambiente — nunca no código.
- Toda chamada à API Gemini passa pelo `src/services/` — nunca diretamente nos componentes.
- Trate sempre os erros de API com `try/catch` e exiba feedback adequado ao usuário.
- Funcionalidades com IA são **progressivamente aprimoradas** — o app funciona sem elas.

Casos de uso de IA no SplitSmart:

- Sugestão automática de categoria para despesas (restaurante, transporte, hospedagem...)
- Resumo inteligente de despesas de um grupo em linguagem natural
- Detecção de despesas duplicadas ou suspeitas

---

## 9. Testes

- Todo componente tem um arquivo `.test.tsx` junto.
- Todo hook tem um arquivo `.test.ts` junto.
- Todo utilitário em `lib/` e `services/` tem testes.
- **Nunca** chame APIs reais nos testes — use `vi.mock()` e `vi.fn()`.
- Testes seguem o padrão AAA: Arrange → Act → Assert.
- Use `screen.getByRole` e queries semânticas. Evite `getByTestId` como primeira opção.

```tsx
// ✅ Padrão de teste
describe('Button', () => {
  it('calls onClick when clicked and not disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Clique</Button>)
    await user.click(screen.getByRole('button', { name: /clique/i }))

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

---

## 10. Git, commits e Pull Requests

- Commits seguem **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.
- Husky bloqueia commits com erros de lint ou TypeScript.
- Nunca faça commit de `.env.local` — apenas `.env.example` vai para o repositório.
- PRs pequenos e focados: uma feature ou fix por PR.

### Regras de PR

- **Abra uma PR após cada alteração complexa** — qualquer nova feature, refactor relevante ou mudança de arquitetura gera uma PR, não vai direto para a branch principal.
- Após criar a PR, **informe no chat** o link e um resumo do que foi alterado para revisão.
- PRs devem ter título no formato Conventional Commits: `feat: adicionar componente ExpenseCard`.
- A descrição da PR deve conter: o que foi feito, por que foi feito e como testar.

### Relatório obrigatório após cada feature

Ao concluir qualquer feature ou conjunto de alterações, **sempre** envie no chat um relatório com:

```
## ✅ Feature concluída: [nome]

**O que foi feito:**
- ...

**Arquivos criados/modificados:**
- src/components/...
- src/hooks/...

**Como testar:**
- ...

**PR aberta:** [link ou branch]
```

Isso permite revisão antes de continuar para o próximo passo.

---

## 11. Variáveis de ambiente

| Variável          | Descrição                  | Obrigatória    |
| ----------------- | -------------------------- | -------------- |
| `GEMINI_API_KEY`  | Chave da API Google Gemini | Sim            |
| `NEXTAUTH_SECRET` | Secret para autenticação   | Sim (produção) |
| `NEXTAUTH_URL`    | URL base da aplicação      | Sim (produção) |

Sempre que adicionar uma nova variável de ambiente:

1. Adicione em `.env.local` (não comitar)
2. Adicione em `.env.example` com valor vazio (comitar)
3. Valide a presença no `src/lib/env.ts` com erro descritivo se ausente

---

## 12. O que NÃO fazer

- ❌ Não use `any` — use `unknown` + type guard ou genéricos
- ❌ Não use `default export` fora de `page.tsx` / `layout.tsx`
- ❌ Não chame APIs diretamente em componentes — use `services/` ou hooks
- ❌ Não hardcode strings de UI — use constantes ou i18n
- ❌ Não crie animações GSAP fora de `useEffect` com `gsap.context()`
- ❌ Não use `styled-components` ou `emotion` diretamente
- ❌ Não pule testes para "agilizar" — todo arquivo de lógica tem teste
- ❌ Não quebre o Atomic Design: atoms não importam de molecules ou organisms
- ❌ Não escreva `function` declarations — use sempre arrow function
- ❌ Não escreva comentários no código — nomeie bem para dispensar explicação
- ❌ Não use `pnpm` ou `yarn` — o package manager do projeto é `npm`
- ❌ Não faça merge direto na branch principal após alteração complexa — abra PR e informe no chat

---

## 13. Checklist antes de abrir um PR

- [ ] `npm run lint` passa sem erros
- [ ] `npm test` passa sem erros
- [ ] `npm run build` compila sem erros TypeScript
- [ ] Novo componente tem `.test.tsx` e `index.ts` barrel
- [ ] Nenhuma variável de ambiente nova sem `.env.example` atualizado
- [ ] Animações GSAP têm cleanup (`ctx.revert()`)
- [ ] Nenhum `console.log` esquecido no código
- [ ] Nenhum comentário no código
- [ ] Todas as funções são arrow functions — sem `function` declarations
- [ ] Relatório da feature foi enviado no chat
- [ ] PR tem título e descrição seguindo as regras
