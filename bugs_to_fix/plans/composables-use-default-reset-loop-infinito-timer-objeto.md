# use-default-reset-loop-infinito-timer-objeto

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/Composables/useDefaultReset.ts:58`

## Problema
Com `timer` ativo e valor objeto/array, `reset()` substitui `state.value` por um objeto novo (`JSON.parse` na linha 47), o que dispara o próprio `watchDebounced(state, () => state.reset(), ...)`, que agenda outro reset, que cria outro objeto novo — **loop infinito** de resets a cada `timer` ms após a primeira mudança. Com `id: 'ulid'`/`created_at: 'now'`, o valor muda perpetuamente.

## Evidência
```ts
if (timer) watchDebounced(state, () => state.reset(), { debounce: timer });
// combinado com state.value = new_data; (linha 52, sempre nova referência)
```

## Plano de correção
1. Guardar flag `is_resetting` e ignorar o disparo do watcher causado pelo próprio reset (ou comparar serialização antes de resetar; alternativa: `pausableWatch` do VueUse pausado durante o reset).
2. Coordenar com o achado [composables-use-default-reset-timer-sem-deep](composables-use-default-reset-timer-sem-deep.md) — corrigir os dois juntos.

## Testes
- Fake timers + objeto (`useDefaultReset({ a: 1 }, 500)`): mutar, avançar `timer` várias vezes e assertar que o reset interno ocorre **uma única vez** (contar trocas de referência ou spy).
- Testes dentro de `effectScope()`.
