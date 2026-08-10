# format-phone-fallback-inconsistente-12-13-digitos

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Strings/masks.ts:71-79`

## Problema
Para 12-13 dígitos que **não** começam com `55`, o `replace` não casa e retorna `only_numbers` (dígitos crus), divergindo do fallback documentado `String(data)`. Idem `0800` com comprimento ≠ 11. E `formatPhone(800123456)` como number perde o `0` inicial do 0800.

## Plano de correção
1. Testar o prefixo antes: `only_numbers.startsWith('55') && (length === 12 || length === 13)`; senão cair no `return String(data)`.
2. Mesmo tratamento para o caso `0800`.

## Testes
- 12 dígitos sem `55` → retorna `String(data)`; 0800 com 10 dígitos; number 0800.
