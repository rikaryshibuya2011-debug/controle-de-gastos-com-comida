# Controle de Gastos com Comida

Aplicação Electron/Vite/React ("Janta.Control") para registrar pedidos de janta/restaurante e mapear gastos: métricas, gráficos de consumo, saldo por depositante, orçamento e exportação de dados.

## Requisitos

- Node.js 20+

## Comandos

```bash
npm install        # dependências
npm run dev        # desenvolvimento em http://localhost:3000
npm run lint       # checagem de tipos (tsc --noEmit)
npm run build      # build de produção em dist/
```

Opcional: `GEMINI_API_KEY` via variável de ambiente (`.env.local`) — ver `.env.example`.

## Modo desktop

`electron/main.js` abre a janela carregando o build em `dist/`. Gerar instalador com `electron-builder` (saída em `release/`, ignorada pelo git).

## Dados

Tudo é persistido no `localStorage` do navegador — sem backend e sem dados enviados a servidores. Os registros de exemplo em `src/data/mockData.ts` são fictícios.
