# use-cached-api-resposta-tardia-sobrescreve-estado

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Composables/useRefCachedApi.ts:56-66`

## Problema
Race na revalidação: a promise de `apiGetRoute` resolve sem checagem de descarte — (a) se o consumidor editou `state.value` entre o setup e a resposta, a resposta sobrescreve a edição; (b) se o `effectScope`/componente já foi destruído, o `.then` ainda escreve em `state` e em `localStorage` (linha 63, caminho `watch: false`) — trabalho fora do escopo, sem cleanup.

## Evidência
```ts
.then((value) => { if (!value) return; state.value = value; ... }) // sem flag de cancelamento
```

## Plano de correção
1. `let disposed = false` + `onScopeDispose(() => disposed = true)` (com guarda `getCurrentScope()` para uso fora de componente); ignorar a resposta se `disposed`.
2. (Opcional) expor `isFetching`/`refresh` na API do composable.

## Testes
- Mock com promise controlada; `scope.stop()` antes de resolver → state e localStorage não mudam.
- Fluxo normal continua atualizando (regressão).
