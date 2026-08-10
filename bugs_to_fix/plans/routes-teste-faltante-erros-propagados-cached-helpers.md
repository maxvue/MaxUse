# teste-faltante-erros-propagados-cached-helpers

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivos**: `src/Routes/getCachedApi.test.ts`, `src/Routes/postCachedApiIDB.test.ts`

## Problema
Nenhum teste documenta que `getCachedApi` e `postCachedApiIDB` **propagam** erro de rede/axios (diferente dos `api*Route`, que retornam `null`). Também faltam: teste do comportamento "cache eterno" (sem TTL) de `getCachedApi`, e do caso `resolveRoute` lançando (resolver não configurado) — hoje o throw de `resolveRoute` em `apiRoute.ts:18` acontece **fora** do `try` dos wrappers e não é coberto.

## Plano de correção
1. Testes com `axios.get/post` rejeitando: `rejects.toThrow` fixando o contrato atual dos helpers cacheados.
2. Teste de `apiGetRoute` com `apiRoute` real + resolver não configurado, documentando que o erro do resolver propaga.
3. Teste do cache eterno do `getCachedApi` (segunda chamada não faz requisição, mesmo muito depois).
