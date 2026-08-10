# teste-faltante-luhn-invalido

- **Severidade**: média
- **Tipo**: teste-faltante
- **Arquivo**: `src/Helpers/Validations/creditCard.test.ts:5-43`

## Problema
A suíte testa formato (curto, bandeira inexistente) mas **nenhum número com dígito verificador Luhn errado** — exatamente o caso que revelaria o bug [helpers-credit-card-nao-valida-luhn](helpers-credit-card-nao-valida-luhn.md). `'4111111111111112'` passaria hoje.

## Plano de correção
1. Junto com a correção do Luhn: `expect(isValidCreditCard('4111111111111112')).toBe(false)` e pares válido/inválido por bandeira (Visa, Master, Amex, Elo, Hipercard).
