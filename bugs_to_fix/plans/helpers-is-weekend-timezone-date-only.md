# is-weekend-timezone-date-only

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Dates/isWeekend.ts:17-21`

## Problema
Bug clássico de timezone: string date-only (`'2024-01-06'`, um sábado) é parseada como **UTC meia-noite**, mas `getDay()` usa hora **local**. Em `America/Sao_Paulo` (UTC-3, mercado-alvo da lib), vira sexta 21:00 → `isWeekend('2024-01-06')` retorna **false para um sábado** (verificado com `TZ=America/Sao_Paulo`). O teste colocado só usa strings com `T12:00:00Z`, mascarando o bug.

## Plano de correção
1. Detectar padrão `^\d{4}-\d{2}-\d{2}$` e parsear como local (`new Date(y, m-1, d)`) — ou usar `getUTCDay()` para date-only.
2. Avaliar extrair essa normalização para um helper interno de `Dates/` reutilizável (mesmo problema atinge `isSameDay`, `differences` etc.).

## Testes
- Fixar `TZ=America/Sao_Paulo` no ambiente de teste; `isWeekend('2026-06-13')===true` (sábado date-only), domingo e segunda date-only.
