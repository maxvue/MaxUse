# has-content-strings-null-literal

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Types/hasContent.ts:15`

## Problema
As strings literais `'null'`, `'NULL'`, `'undefined'`, `'UNDEFINED'` são tratadas como vazias — mas `'Null'`/`'Undefined'` (capitalização mista) não, e um usuário cuja entrada seja literalmente "null" é engolido por `isBlank`, propagando para `formatCurrency`, `formatCpf`, `truncate` etc. Comportamento surpreendente e não documentado nos consumidores.

## Decisão de Design Registrada
- Normalizar com `.toLowerCase()` e `.trim()` ao checar strings literais como `'null'`, `'undefined'`, `'none'`, `'nan'`, `'false'`, garantindo que variações como `'Null'`, `'UNDEFINED'` sejam consistentemente tratadas como vazias.

## Plano de correção
1. Aplicar `.toLowerCase()` nas checagens de strings literais falsy em `src/Helpers/Types/hasContent.ts`.

## Testes
- `hasContent('null')` e `hasContent('Null')` com o comportamento decidido; casos existentes preservados conforme a decisão.
