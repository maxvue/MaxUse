# watch-if-valid-once-flush-sync-dispara-varias-vezes

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Composables/watchTrue.ts:30,69`

## Problema
Com `{ once: true, flush: 'sync' }`, o stop é adiado para `nextTick(() => handle.stop())`; mudanças síncronas subsequentes no mesmo tick disparam o callback de novo antes do stop — o contrato `once` é violado. Mesmo padrão em `watchDebounceIfValid` (linha 69).

## Evidência
```ts
if (options?.once) nextTick(() => handle.stop());
```

## Plano de correção
1. Usar flag local como gate: `let fired = false;` — no callback, `if (fired) return; if (options?.once) fired = true;` — e manter `handle.stop()` via `nextTick` apenas como cleanup.
2. Aplicar em `watchIfValid` e `watchDebounceIfValid`.

## Testes
- `flush: 'sync'`, duas atribuições válidas síncronas → `expect(callback).toHaveBeenCalledTimes(1)`. Testes em `effectScope()`.
