# use-cached-api-any-em-data-e-resposta

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivos**: `src/Composables/useRefCachedApi.ts:4,32`, `src/Routes/apiGetRoute.ts:14`

## Problema
`data_get?: any; data?: any` e `apiGetRoute(...): Promise<any>` — o valor da API entra em `state.value` (tipado `T`) sem fronteira de tipo. Além disso, `ToRefCachedApi<T> = T extends Ref ? T : Ref<T>` (linha 4) é distributivo em unions, inconsistente com `ToRefCached` de `useRefCached.ts:3`, que usa `[T] extends [Ref]`.

## Plano de correção
1. `data?: Record<string, unknown>`.
2. `apiGetRoute<T = unknown>` genérico (coordenar com [routes-tipagem-any-generalizada-e-inconsistente](routes-tipagem-any-generalizada-e-inconsistente.md)).
3. Trocar o condicional para `[T] extends [Ref]`.

## Testes
- Testes de tipo (`expectTypeOf`), incluindo `T` union.
