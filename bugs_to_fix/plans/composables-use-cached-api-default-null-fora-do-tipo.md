# use-cached-api-default-null-fora-do-tipo

- **Severidade**: média
- **Tipo**: tipagem
- **Arquivo**: `src/Composables/useRefCachedApi.ts:33`

## Problema
`const state = ref(options.defaultValue ?? null) as ToRefCachedApi<T>` — sem `defaultValue`, `state.value` é `null`, mas o tipo retornado é `Ref<T>` sem `null`. O consumidor de `useCachedApi<Usuario[]>('r')` recebe `Ref<Usuario[]>` que na prática é `null` até a resposta chegar.

## Plano de correção
1. Overloads ou tipo condicional: sem `defaultValue`, retornar `Ref<T | null>`; com `defaultValue`, `Ref<T>`.

## Testes
- Testes de tipo (`expectTypeOf`) cobrindo os dois casos.
