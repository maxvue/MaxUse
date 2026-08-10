# cep-lanca-excecao-para-number

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Validations/cepIsValid.ts:11-15`

## Problema
A assinatura aceita `number`, o guard `isBlank` deixa números passarem, e `validateBr.cep(number)` lança `cep.replace is not a function` (verificado com `validateBr.cep(13101000)`). CEP numérico também perde zero à esquerda (`01310100` vira `1310100`, 7 dígitos).

## Plano de correção
1. Converter com `String(data)` antes de validar.
2. Para number, `padStart(8, '0')` (ou retornar false para <8 dígitos — decidir e documentar).

## Testes
- `cepIsValid(1310100)`, `cepIsValid(13101000)`, `cepIsValid('013101000')` (9 dígitos → false), `cepIsValid('abcde-fgh')===false`.
