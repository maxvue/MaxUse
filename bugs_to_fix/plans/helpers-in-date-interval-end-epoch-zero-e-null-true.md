# in-date-interval-end-epoch-zero-e-null-true

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Dates/inDateInterval.ts:17-23`

## Problema
(1) `end` igual à época zero (`new Date(0)`) tem `getTime() === 0`, e o retorno usa `(!end || ...)` sobre o **timestamp** — end=epoch é tratado como "sem limite" (verificado). (2) Datas/intervalos inválidos viram `NaN` e retornam `false` silenciosamente, enquanto `null` retorna `true` — semânticas opostas para entradas igualmente ruins.

## Evidência
```ts
const end = rawInterval.end ? new Date(rawInterval.end).getTime() : false;
return target >= start && (!end || target <= end);
```

## Plano de correção
1. Usar sentinela explícita: `(end === false || target <= end)`.
2. Validar `isNaN` de target/start/end retornando comportamento definido e documentado (`false` para inválidos).

## Testes
- `end = new Date(0)` com target em 1969 (true) e 1971 (false); start inválido; target inválido.
