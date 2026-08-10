# teste-faltante-phone-ddd-e-celular-sem-9

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivo**: `src/Helpers/Validations/phone.test.ts:5-25`

## Problema
A validação delega ao libphonenumber-js (`phone.ts:14`), mas não há testes das regras BR que justificam a lib: DDD inexistente (`+5500999991234`), celular de 8 dígitos sem o 9, número nacional sem `+55` (que depende do `defaultCountry: 'BR'`), entrada numérica e string vazia.

## Plano de correção
1. Adicionar: `phone('11999991234')===true` (sem DDI, prova o defaultCountry), `phone('+5500999991234')===false`, `phone('999991234')===false`, `phone('')===false`, `phone(11999991234)` (number).
