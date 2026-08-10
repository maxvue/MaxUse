# use-default-reset-timer-sem-deep

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Composables/useDefaultReset.ts:58`

## Problema
`watchDebounced(state, ...)` observa a ref sem `deep: true`; mutações internas (`form.value.nome = 'x'`) não disparam o auto-reset. A doc (linhas 19-20, 27: "auto-reset após mudança", "útil para formulários") promete reset após qualquer mudança; o teste existente (`useDefaultReset.test.ts:112`) só cobre substituição de primitivo.

## Plano de correção
1. Adicionar `{ debounce: timer, deep: true }` — **somente após** resolver [composables-use-default-reset-loop-infinito-timer-objeto](composables-use-default-reset-loop-infinito-timer-objeto.md), senão o loop piora.

## Testes
- Objeto, mutar campo interno, avançar timers, assertar volta ao valor inicial.
