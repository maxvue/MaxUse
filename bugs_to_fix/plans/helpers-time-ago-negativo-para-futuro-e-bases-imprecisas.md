# time-ago-negativo-para-futuro-e-bases-imprecisas

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivo**: `src/Helpers/Dates/timeAgo.ts:21-23,62-74`

## Problema
(1) Datas futuras produzem valores negativos ("há -5 minutos"); (2) `monthsAgo` usa mês de 30 dias e `yearsAgo` ano de **360 dias** (30·12), acumulando ~5 dias de erro/ano; (3) `parseInt(Math.floor(x) + '')` é conversão redundante via string. `diffInMonths`/`diffInYears` (`differences.ts:49-71`) já fazem o cálculo de calendário correto.

## Plano de correção
1. Delegar `monthsAgo`/`yearsAgo` para `diffInMonths(value, new Date())`/`diffInYears`.
2. Clampar em 0 para datas futuras (ou documentar o negativo).
3. Trocar `parseInt(x + '')` por `Math.floor`.

## Testes
- Data futura → 0; `yearsAgo` de exatamente 1 ano atrás === 1.
