# cache-idb-falsy-nunca-cacheia

- **Severidade**: alta
- **Tipo**: bug
- **Arquivos**: `src/Routes/getCachedApiIDB.ts:59`, `src/Routes/postCachedApiIDB.ts:42`, `src/Routes/internal/idbCache.ts:64-77`

## Problema
`getFromIDB` resolve `entry.data` e os consumidores testam `if (cached)`. Se a API retornar valor falsy (`0`, `''`, `false`), hit de cache é indistinguível de miss e o helper refaz a requisição sempre. Em `postCachedApiIDB` é grave: um POST "cacheado" é reenviado ao servidor a cada chamada, contrariando a doc ("Se já existir dado cacheado... retorna sem fazer requisição").

## Evidência
```ts
const cached = await getFromIDB(key, ttl);
if (cached) return cached;
```

## Plano de correção
1. Mudar `getFromIDB` para retornar envelope: `{ hit: true, data } | null` (ou sentinel exportado de miss).
2. Atualizar `getCachedApiIDB` e `postCachedApiIDB` para testar o envelope (`if (result) return result.data`), não o valor.
3. Manter compatibilidade das assinaturas públicas dos helpers.

## Testes
- Semear no mock IDB entradas com `data: 0`, `data: ''` e `data: false` e assertar que `axios.get`/`axios.post` **não** é chamado e o valor falsy é retornado.
