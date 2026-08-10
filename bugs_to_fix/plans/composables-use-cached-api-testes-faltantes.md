# use-cached-api-testes-faltantes

- **Severidade**: média
- **Tipo**: teste-faltante
- **Arquivo**: `src/Composables/useRefCachedApi.test.ts`

## Problema
Lacunas verificadas: (a) precedência `data_get` sobre `data` (`useRefCachedApi.ts:57`) — nunca testada; (b) caminho `watch: false` + `sync` que persiste direto no `.then` (linha 63) — sem teste; (c) resposta tardia após `scope.stop()` — sem teste; (d) `state.value = undefined` — sem teste. Os testes existentes usam `effectScope` corretamente.

## Plano de correção
1. Adicionar os 4 casos com `vi.mock` de `apiGetRoute` e promises controladas (`let resolve; new Promise(r => resolve = r)`).
2. Casos (c) e (d) devem ser escritos junto com as correções [composables-use-cached-api-resposta-tardia-sobrescreve-estado](composables-use-cached-api-resposta-tardia-sobrescreve-estado.md) e [composables-use-cached-api-stringify-undefined-grava-lixo](composables-use-cached-api-stringify-undefined-grava-lixo.md).
