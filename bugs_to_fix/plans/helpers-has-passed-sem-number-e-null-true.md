# has-passed-sem-number-e-null-true

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivos**: `src/Helpers/Dates/hasPassedDays.ts:3,15` (idem `hasPassedHours.ts`, `hasPassedMinutes.ts`)

## Problema
`TPassed = string | Date | null | undefined` exclui `number` (timestamp), inconsistente com os demais helpers de data (`TDate` inclui number). Além disso, `days`/`hours`/`minutes` não são `MaybeRefOrGetter` nem validados contra NaN, e a semântica "`null`/inválida → `true`" inverte a convenção dos demais (`isPast(null) === false`) sem destaque na doc.

## Plano de correção
1. Incluir `number` no tipo `TPassed` das três funções.
2. Aceitar `MaybeRefOrGetter<number>` no segundo parâmetro (resolvendo com `toValue`).
3. Documentar em destaque a semântica "sem data = passou".

## Testes
- Timestamp numérico; `days = NaN` com comportamento definido; reatividade do segundo parâmetro.
