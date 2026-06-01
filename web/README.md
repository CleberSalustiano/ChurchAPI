# ChurchAPP Web

Projeto oficial do frontend, isolado da API.

## Estrutura

- `src/app/`: rotas e layout principal do App Router
- `src/components/`: componentes visuais e de fluxo
- `src/lib/`: cliente HTTP, auth local e utilitarios
- `src/providers/`: providers globais
- `src/types/`: contratos do frontend
- `docs/`: documentacao e plano do web

## Ambiente

1. Copie `./.env.example` para `./.env.local`
2. Instale as dependencias com `npm install`
3. Rode `npm run dev`

Por padrao, o frontend espera a API em `http://localhost:3333`.
