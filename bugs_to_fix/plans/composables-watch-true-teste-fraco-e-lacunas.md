# watch-true-teste-fraco-e-lacunas

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivo**: `src/Composables/watchTrue.test.ts:173-175`

## Problema
`watchTrue` (alias de `whenever`) só é testado com `expect(typeof watchTrue).toBe('function')` — não valida comportamento. Faltam também: `once + flush: 'sync'` (ver [composables-watch-if-valid-once-flush-sync-dispara-varias-vezes](composables-watch-if-valid-once-flush-sync-dispara-varias-vezes.md)), `immediate: true` com valor inicial válido em `watchIfValid`, e `maxWait` em `watchDebounceIfValid`.

## Plano de correção
1. Teste funcional de `watchTrue`: ref falsy→truthy dispara callback; truthy→truthy não redispara indevidamente.
2. Casos `immediate` e `maxWait` com fake timers, dentro de `effectScope()`.
