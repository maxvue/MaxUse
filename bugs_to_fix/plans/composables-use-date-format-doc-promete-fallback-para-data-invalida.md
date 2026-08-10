# use-date-format-doc-promete-fallback-para-data-invalida

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivos**: `src/Composables/useDateFormat.ts:7,26-29`, `src/Composables/useTimeAgo.ts:107-114`, `src/Helpers/Validations/isValid.ts:83-85`

## Problema
A doc diz "Se a data for nula, undefined **ou inválida**, retorna a data atual", mas o guard é `isNotValid`, que só detecta `null`/`undefined`. Strings como `'abc'` ou `new Date(NaN)` passam direto ao VueUse e produzem `Invalid Date`/saída quebrada, não o fallback. Mesma divergência em `useTimeAgo` (mesmo guard).

## Plano de correção
1. Trocar o guard por validação real de data: `Number.isNaN(new Date(toValue(value) as any).getTime())` ou o helper `isDate` de `Helpers/Dates` — preservando a reatividade (checagem dentro do computed/getter).
2. Aplicar em `useDateFormat` e `useTimeAgo`.
3. Alternativa: corrigir a doc — mas o fallback é o comportamento mais útil; preferir corrigir o código.

## Testes
- `useDateFormat('nao-e-data', 'DD/MM/YYYY')` formata a data atual.
- `useTimeAgo(new Date(NaN))` usa o fallback.
- Ref reativa que muda de inválida para válida atualiza a saída.
