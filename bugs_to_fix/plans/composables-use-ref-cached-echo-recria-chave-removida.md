# use-ref-cached-echo-recria-chave-removida

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Composables/useRefCached.ts:35-46, 72-75`

## Problema
Quando outra aba remove a chave (`event.newValue === null`) ou envia JSON inválido, `onStorageEvent` seta `state.value = default_value`; isso dispara o watcher de persistência (linha 72, `deep + immediate`), que **regrava** o default no `localStorage` — desfazendo a remoção feita pela outra aba. O mesmo eco regrava qualquer valor recebido de outra aba (gravação redundante).

## Plano de correção
1. Flag `is_syncing_from_event` setada antes de atualizar `state` no handler e checada no watcher de persistência (resetada via `nextTick`/microtask).

## Testes
- Dispatchar `StorageEvent` com `newValue: null` e assertar `localStorage.getItem(key) === null` após `nextTick`.
- `StorageEvent` com valor válido não gera `setItem` redundante (spy).
