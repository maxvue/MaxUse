# use-ref-cached-troca-de-chave-perde-escrita-pendente

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Composables/useRefCached.ts:53-70`

## Problema
Se no mesmo tick o consumidor faz `state.value = 'x'` e muda a chave dinâmica, o watcher de `raw_key` (registrado primeiro, flush pre) roda antes e sobrescreve `state` com o valor da chave nova — `'x'` se perde e nunca é gravado na chave antiga.

## Plano de correção
1. No watcher de `raw_key`, receber `(new_key, old_key)` e persistir `state.value` em `old_key` antes de carregar o valor de `new_key` (respeitando a flag de sync do achado [composables-use-ref-cached-echo-recria-chave-removida](composables-use-ref-cached-echo-recria-chave-removida.md)).

## Testes
- `key = ref('a')`; mutar state e key no mesmo tick; assertar que `localStorage['a']` contém o valor mutado e o state passa a refletir a chave `'b'`.
