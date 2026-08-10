# use-time-ago-mapas-action-e-limit-identicos

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivo**: `src/Composables/useTimeAgo.ts:34-45,60-71`

## Problema
`timeAgoAction` e `timeAgoLimit` são campo a campo idênticos (todas as 10 chaves). A doc (linha 91) descreve `'limit'` como "similar a action" quando é igual — duplicação de ~12 linhas com risco de divergirem silenciosamente.

## Plano de correção
1. `const timeAgoLimit = timeAgoAction;` (ou apontar ambos para a mesma entrada no `FORMAT_MAP`), ajustando a doc.

## Testes
- `expect(FORMAT_MAP.limit).toBe(FORMAT_MAP.action)` ou comparar as saídas dos dois formatos.
