# is-date-rejeita-formato-brasileiro

- **Severidade**: baixa
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Dates/isDate.ts:14-17`

## Problema
`new Date('28/12/2024')` (dd/mm/yyyy, formato BR) é Invalid Date → `isDate` retorna false; já `'12/28/2024'` (formato US) retorna true (ambos verificados). Numa lib para o mercado brasileiro, o formato local é rejeitado e o americano aceito. Bônus: `isDate(12345) === true` (timestamp numérico) merece documentação.

## Plano de correção
1. Detectar `^\d{2}\/\d{2}\/\d{4}$` e validar como dd/mm/yyyy com checagem real de dia/mês (31/02 → false).
2. Decidir e documentar a semântica para o formato US ambíguo e para números.

## Testes
- `'28/12/2024'` true; `'31/02/2024'` false; `'12/28/2024'` conforme decisão; `isDate(12345)` documentado.
