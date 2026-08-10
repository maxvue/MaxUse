# teste-faltante-masks-entradas-parciais

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivo**: `src/Helpers/Strings/masks.test.ts:23-67`

## Problema
`formatCpf`/`formatCnpj`/`formatCpfCnpj` não têm testes com entrada curta (placeholders `___`), com 12-13 dígitos (perda de dígito verificada) nem com entrada numérica (perda de zero à esquerda). `formatCep` já cobre o análogo, evidenciando a assimetria.

## Plano de correção
1. Escrever junto com [helpers-format-cpf-cnpj-12-digitos-perde-digito](helpers-format-cpf-cnpj-12-digitos-perde-digito.md): `formatCpf('123')`, `formatCpfCnpj('123456789012')`, `formatCpf(1234567890)`.
