# initials-doc-diverge-do-comportamento

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivo**: `src/Helpers/Strings/manipulations.ts:60-79`

## Problema
O JSDoc promete `"João Victor Silva" ➔ "JS"` (primeira + última), mas o código pega as **primeiras** `limit` iniciais → retorna `"JV"`. Também capitaliza preposições (`"João da Silva"` → `"JD"`), pouco útil para avatar.

## Decisão de Design Registrada
- Filtrar preposições em minúsculas (`de`, `da`, `do`, `dos`, `das`, `e`) ao gerar iniciais. Quando houver múltiplos nomes relevantes e `limit === 2`, pegar a inicial do primeiro nome e a inicial do último nome (ex: `"João Victor Silva"` -> `"JS"`, `"João da Silva"` -> `"JS"`).

## Plano de correção
1. Atualizar o código de `initials` em `src/Helpers/Strings/manipulations.ts` para ignorar preposições e pegar a primeira e última palavra relevante quando `limit === 2`.
2. Alinhar doc e código.

## Testes
- `"João Victor Silva"`, `"João da Silva"`, nome único, string vazia.
