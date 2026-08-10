# has-content-strings-null-literal

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Types/hasContent.ts:15`

## Problema
As strings literais `'null'`, `'NULL'`, `'undefined'`, `'UNDEFINED'` são tratadas como vazias — mas `'Null'`/`'Undefined'` (capitalização mista) não, e um usuário cuja entrada seja literalmente "null" é engolido por `isBlank`, propagando para `formatCurrency`, `formatCpf`, `truncate` etc. Comportamento surpreendente e não documentado nos consumidores.

## Plano de correção
1. Preferível: remover a heurística de strings literais (breaking — documentar no changelog).
2. Alternativa conservadora: normalizar com `.toLowerCase()` (consistência) e documentar em `hasContent`/`isBlank` e consumidores.

## Testes
- `hasContent('null')` e `hasContent('Null')` com o comportamento decidido; casos existentes preservados conforme a decisão.
