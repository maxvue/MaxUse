# add-time-amount-nan-retorna-invalid-date

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Dates/addTime.ts:20-26`

## Problema
`rawDate` inválido retorna `null` (linha 26), mas `rawAmount` não é validado: `addTime(new Date(), NaN)` devolve um objeto `Date` **inválido**, violando o contrato de retornar `Date | null` utilizável. Unidade não mapeada também retorna a data sem alteração silenciosamente (switch sem default).

## Plano de correção
1. `if (!Number.isFinite(rawAmount)) return null;`.
2. Adicionar `default:` no switch retornando `null` (ou documentar o pass-through).

## Testes
- `addTime(d, NaN) === null`, `addTime(d, Infinity) === null`, unidade inválida com comportamento definido.
