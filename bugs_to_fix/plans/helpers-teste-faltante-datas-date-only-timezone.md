# teste-faltante-datas-date-only-timezone

- **Severidade**: média
- **Tipo**: teste-faltante
- **Arquivos**: `src/Helpers/Dates/isWeekend.test.ts:7-17`, `isSameDay.test.ts`, `addTime.test.ts`, `differences.test.ts`

## Problema
Todos os testes de `isWeekend` usam `T12:00:00Z`, evitando o caso date-only que quebra em UTC-3; `isSameDay.test.ts` não testa datas inválidas nem formatos mistos; `addTime.test.ts` não testa overflow de fim de mês nem `amount` NaN; `differences.test.ts` não cobre strings date-only cruzando fuso.

## Plano de correção
1. Fixar `TZ=America/Sao_Paulo` no ambiente de teste (vitest config `env` ou setup file) — isso torna os bugs de timezone reproduzíveis na CI.
2. Adicionar: `isWeekend('2026-06-13')` (sábado date-only), `isSameDay(['foo','bar'])`, `addTime('2024-01-31', 1, 'month')`, `diffInDays('2024-01-01','2024-01-02')`.
3. Escrever junto com as correções [helpers-is-weekend-timezone-date-only](helpers-is-weekend-timezone-date-only.md), [helpers-is-same-day-datas-invalidas-consideradas-iguais](helpers-is-same-day-datas-invalidas-consideradas-iguais.md) e [helpers-add-time-overflow-fim-de-mes](helpers-add-time-overflow-fim-de-mes.md).
