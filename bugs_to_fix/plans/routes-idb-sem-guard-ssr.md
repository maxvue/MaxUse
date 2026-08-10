# idb-sem-guard-ssr

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/Routes/internal/idbCache.ts:33`

## Problema
`openDB()` acessa o global `indexedDB` sem guard (`typeof indexedDB === 'undefined'`). Em SSR/Node ou ambientes restritos, qualquer chamada a `getCachedApiIDB`/`postCachedApiIDB`/`deleteFromIDB`/`clearCacheIDB` lança `ReferenceError: indexedDB is not defined` em vez de degradar. Os demais helpers do módulo guardam `localStorage` (`apiGetRoute.ts:26`, `getCachedApi.ts:29`) — a camada IDB é inconsistente com o resto de `Routes/`.

## Evidência
```ts
const request = indexedDB.open(DB_NAME, DB_VERSION);
```

## Plano de correção
1. Em `idbCache.ts`, adicionar guard central: se `typeof indexedDB === 'undefined'`, `getFromIDB` retorna `null` (miss) e `setToIDB`/`deleteFromIDB`/`clearCacheIDB` viram no-op que resolve — mesmo padrão `is_client` de `getCachedApi`.
2. Garantir que os helpers consumidores caem direto na requisição HTTP nesse cenário.

## Testes
- Com `vi.stubGlobal('indexedDB', undefined)`: `getCachedApiIDB`/`postCachedApiIDB` ainda resolvem fazendo a requisição.
- `deleteFromIDB`/`clearCacheIDB` resolvem sem lançar.
