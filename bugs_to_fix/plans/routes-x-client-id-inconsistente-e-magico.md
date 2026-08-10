# x-client-id-inconsistente-e-magico

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivos**: `src/Routes/apiGetRoute.ts:26-29`, `apiPostRoute.ts:26`, `apiPutRoute.ts:26`, `apiDeleteRoute.ts:27`, `apiUploadRoute.ts:52` vs `getCachedApi.ts:42-46`, `getCachedApiIDB.ts:19-23`, `postCachedApiIDB.ts:47-56`

## Problema
Os cinco wrappers `api*Route` injetam o header `X-Client-Id` lido da chave mágica de localStorage `'selected.client.id'` (acoplamento não documentado), mas os três helpers com cache **não** injetam. Duplo problema:
(a) a mesma rota responde dados diferentes por cliente via header, porém a chave de cache (`routeName + '_' + JSON.stringify(params)`) não inclui o client id — trocar de cliente serve dados cacheados do cliente anterior (**vazamento entre clientes**);
(b) o spread vem depois de `getConfiguredHeaders()`, então um `X-Client-Id` configurado via `setApiRequestConfig` é silenciosamente sobrescrito.

## Plano de correção
1. Extrair a lógica para `config.ts` (ex.: função interna `getClientIdHeader()` ou header dinâmico padrão registrável) usada por todos os helpers, inclusive `fetchAndStore` dos cacheados.
2. Incluir o client id na chave de cache default dos helpers cacheados.
3. Inverter a precedência: valor configurado via `setApiRequestConfig` deve vencer o valor mágico do localStorage (ou documentar o contrário).
4. Documentar a convenção `'selected.client.id'` no JSDoc.

## Testes
- Semear `localStorage.setItem('selected.client.id', 'x')` e assertar o header em cada wrapper.
- Assertar presença nos helpers cacheados e que a chave de cache muda por cliente.
- Precedência sobre `setApiRequestConfig`.
