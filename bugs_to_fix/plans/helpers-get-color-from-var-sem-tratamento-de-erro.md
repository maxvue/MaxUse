# get-color-from-var-sem-tratamento-de-erro

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Browser/getColorFromVar.ts:18-30`

## Problema
`Color(...)` lança exceção para valores não parseáveis pela lib `color` (ex.: `oklch(0.7 0.1 200)`, `color-mix(...)`, cada vez mais comuns em CSS vars) — sem try/catch, um token moderno derruba o componente. Também acessa `document`/`window` sem guarda (quebra SSR), diferente do cuidado tomado em `Routes/`.

## Plano de correção
1. Envolver em try/catch retornando `Color('transparent')` (ou parâmetro de fallback).
2. Guard `typeof window !== 'undefined'` retornando o fallback em SSR.

## Testes
- Var resolvendo para `oklch(...)` não lança e retorna fallback; ambiente sem `document` (stub) retorna fallback.
