# use-cached-api-parametros-nao-reativos

- **Severidade**: média
- **Tipo**: melhoria
- **Arquivo**: `src/Composables/useRefCachedApi.ts:32`

## Problema
`route_name`, `options.data`/`data_get` e `key` são estáticos — diferente de `useRefCached`, que aceita `MaybeRefOrGetter` para a chave. Não há `toValue()` nem watch: se os parâmetros da rota mudam (paginação, filtro), o composable não revalida nem troca de chave. A doc não avisa dessa limitação. Viola o padrão do projeto (skill: parâmetros reativos via `MaybeRefOrGetter` + `toValue`).

## Plano de correção
1. Aceitar `MaybeRefOrGetter` em `key` e `data`/`data_get`, resolvendo com `toValue()`.
2. Refazer o fetch (e trocar a chave de cache) em `watch(() => [toValue(key), toValue(data)], ...)`.
3. Alternativa mínima: documentar explicitamente que os parâmetros são congelados no setup.

## Testes
- Passar `ref` como `data`, mutar → novo `apiGetRoute` com os novos params e nova chave de cache. Testes em `effectScope()`.
