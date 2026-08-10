# format-cpf-cnpj-12-digitos-perde-digito

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Strings/masks.ts:52-56` (e 28-32)

## Problema
`maskBr.cpfcnpj` com 12-13 dígitos aplica máscara de CPF e **descarta os dígitos excedentes**: verificado `maskBr.cpfcnpj('123456789012')` → `'123.456.789-01'` (o `2` final some — perda de dado num CNPJ digitado pela metade). `formatCpf` com entrada curta injeta placeholders (`'123'` → `'123.___.___-__'`), e number com zero à esquerda perdido gera `'123.456.789-0_'`. Diverge de `formatCep`, que devolve a string original quando não há exatamente 8 dígitos.

## Plano de correção
1. Replicar o padrão do `formatCep`: só aplicar máscara quando `onlyNumbers(data).length` for exatamente 11 (CPF) / 14 (CNPJ); senão retornar `String(data)`.
2. Aplicar em `formatCpf`, `formatCnpj` e `formatCpfCnpj`.

## Testes
- `formatCpf('123') === '123'`; `formatCpfCnpj('123456789012')` não perde dígito; CPF/CNPJ completos continuam mascarando.
