# teste-faltante-json-invalido-localstorage

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivos**: `src/Routes/getCachedApi.ts:33-37`, `src/Routes/getCachedApi.test.ts`

## Problema
O branch de recuperação de cache corrompido (`JSON.parse` lança → `localStorage.removeItem(key)` → segue para a requisição) não tem nenhum teste — caminho que regride silenciosamente.

## Plano de correção
1. Adicionar teste em `getCachedApi.test.ts`: `localStorage.setItem(key, '{invalido')`, mock de `axios.get` resolvendo.

## Testes
- Assertar: entrada corrompida removida, requisição feita, dado fresco retornado e re-cacheado.
