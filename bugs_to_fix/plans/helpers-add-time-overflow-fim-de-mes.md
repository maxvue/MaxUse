# add-time-overflow-fim-de-mes

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Dates/addTime.ts:33-39`

## Problema
`setMonth`/`setFullYear` sofrem rollover do JS: `addTime('2024-01-31T12:00', 1, 'month')` → **2 de março** (verificado), e `addTime('2024-02-29', 1, 'year')` → 1º de março. O esperado em regras de negócio (vencimentos, mensalidades) é clampar para o último dia do mês (31/01 + 1 mês = 29/02).

## Plano de correção
1. Guardar `day = date.getDate()`, aplicar `setMonth`, e se `date.getDate() !== day` fazer `date.setDate(0)` (volta ao último dia do mês anterior).
2. Idem para `year`.

## Testes
- 31/01/2024 + 1 mês = 29/02 (bissexto); 31/01/2023 + 1 mês = 28/02; 29/02 + 1 ano = 28/02; 31/03 − 1 mês = 29/02.
