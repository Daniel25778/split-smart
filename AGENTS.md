<!-- BEGIN:nextjs-agent-rules -->

SplitSmart — divisor de contas inteligente
A ideia: você tira uma foto da comanda ou cola o texto dela, a IA identifica os itens automaticamente, e cada pessoa da mesa arrasta os itens que consumiu. O app calcula quanto cada um deve, já com gorjeta configurável, e gera um link de resumo pra compartilhar no WhatsApp.
Por que impressiona? É um problema que 100% das pessoas já viveram. O recrutador abre, entende em 5 segundos pra que serve, e consegue imaginar usando. Não é um CRUD, não é um clone — é um produto real com uma dorzinha real resolvida.

O que você mostra tecnicamente:

OCR com IA — manda a foto da comanda pra API da OpenAI (vision) e ela retorna os itens estruturados em JSON
Drag and drop — cada pessoa arrasta os itens dela, usando @dnd-kit
URL compartilhável — o estado da divisão é serializado na URL, então o link do WhatsApp abre o resumo sem precisar de backend ou banco
Otimistic UI — a atribuição de itens é instantânea, sem loading
TypeScript estrito — tipos bem definidos pra comanda, itens, pessoas e divisão
Responsivo de verdade — funciona no celular que é onde a galera vai usar na mesa do restaurante

As telas:

Upload de foto ou digitação manual da comanda
IA processa e lista os itens detectados (com opção de corrigir)
Adiciona as pessoas da mesa
Cada um arrasta os itens que consumiu — itens compartilhados dividem automaticamente
Tela de resumo com quanto cada um deve + botão de compartilhar no WhatsApp

Stack:

Next.js 14 + TypeScript
Tailwind + Shadcn/ui pra UI polida rápido
OpenAI API (gpt-4o com vision pro OCR)
@dnd-kit pro drag and drop
Vercel pra deploy — zero backend necessário

<!-- END:nextjs-agent-rules -->
