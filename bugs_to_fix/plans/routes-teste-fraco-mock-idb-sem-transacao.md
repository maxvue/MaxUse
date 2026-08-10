# teste-fraco-mock-idb-sem-transacao

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivos**: `src/Routes/getCachedApiIDB.test.ts:24-101`, `src/Routes/postCachedApiIDB.test.ts:23-87`, `src/Routes/internal/idbCache.test.ts:13-41`

## Problema
O mock manual de IndexedDB está triplicado (três cópias quase idênticas) e não simula semântica real de transação (auto-commit, `tx.onerror`, eventos com `event.target`), nem o caso `onupgradeneeded` com store ausente (`idbCache.test.ts:16` fixa `contains: () => true`, deixando `createObjectStore` sem exercício). Mudanças na camada `idbCache` podem passar nos três suites e falhar em browser real.

## Plano de correção
1. Extrair o mock para um helper de teste compartilhado (ex.: `src/Routes/internal/testing/idbMock.ts` fora da superfície pública) ou adotar `fake-indexeddb` como devDependency para semântica fiel.
2. Adicionar caso `contains === false` exercitando `createObjectStore` no suite do módulo interno.
3. Migrar os três suites para o mock compartilhado.

## Testes
- Suítes existentes continuam passando com o mock unificado; novo caso de upgrade de store.
