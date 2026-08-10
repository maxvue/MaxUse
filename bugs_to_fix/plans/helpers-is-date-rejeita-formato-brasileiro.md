# is-date-rejeita-formato-brasileiro

- **Severidade**: baixa
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Dates/isDate.ts:14-17`

## Problema
`new Date('28/12/2024')` (dd/mm/yyyy, formato BR) é Invalid Date → `isDate` retorna false; já `'12/28/2024'` (formato US) retorna true (ambos verificados). Numa lib para o mercado brasileiro, o formato local é rejeitado e o americano aceito. Bônus: `isDate(12345) === true` (timestamp numérico) merece documentação.

## Decisão de Design Registrada
- Suportar formato de data brasileiro `dd/mm/yyyy` com validação de dia/mês reais (ex: `'28/12/2024'` -> true, `'31/02/2024'` -> false). Documentar aceitação de timestamps numéricos válidos.

## Plano de correção
1. Atualizar `src/Helpers/Dates/isDate.ts` com regex `^\d{2}\/\d{2}\/\d{4}` e parsing seguro dd/mm/yyyy.

## Testes
- `'28/12/2024'` true; `'31/02/2024'` false; `'12/28/2024'` conforme decisão; `isDate(12345)` documentado.
