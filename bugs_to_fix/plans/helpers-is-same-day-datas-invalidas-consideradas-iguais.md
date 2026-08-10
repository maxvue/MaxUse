# is-same-day-datas-invalidas-consideradas-iguais

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Dates/isSameDay.ts:18-26`

## Problema
Datas inválidas geram a chave `'NaN-NaN-NaN'`, então `isSameDay(['foo', 'bar'])` retorna **true** (verificado). Além disso, mistura de formatos sofre o bug de timezone: `'2024-01-01'` (parse UTC) e `'2024-01-01T00:00:00'` (parse local) produzem chaves diferentes em BRT → false para o mesmo dia civil.

## Evidência
```ts
return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; // sem checar isNaN(d.getTime())
```

## Plano de correção
1. Retornar `false` se alguma data for inválida.
2. Normalizar date-only para parse local (reutilizar o helper do plano [helpers-is-weekend-timezone-date-only](helpers-is-weekend-timezone-date-only.md)).

## Testes
- `isSameDay(['x','y']) === false`; `isSameDay(['2024-01-01','2024-01-01T10:00:00']) === true` com TZ `America/Sao_Paulo`; array com `Date` + string.
