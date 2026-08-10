# initials-doc-diverge-do-comportamento

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivo**: `src/Helpers/Strings/manipulations.ts:60-79`

## Problema
O JSDoc promete `"João Victor Silva" ➔ "JS"` (primeira + última), mas o código pega as **primeiras** `limit` iniciais → retorna `"JV"`. Também capitaliza preposições (`"João da Silva"` → `"JD"`), pouco útil para avatar.

## Plano de correção
1. Decidir a regra (sugestão para avatar: primeiro + último nome, ignorando `da/de/do/dos/das/e`).
2. Alinhar doc e código.

## Testes
- `"João Victor Silva"`, `"João da Silva"`, nome único, string vazia.
