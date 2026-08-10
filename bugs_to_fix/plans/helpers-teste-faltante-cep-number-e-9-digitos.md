# teste-faltante-cep-number-e-9-digitos

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivo**: `src/Helpers/Validations/cepIsValid.test.ts:5-25`

## Problema
Sem testes para: entrada numérica (hoje lança — ver [helpers-cep-lanca-excecao-para-number](helpers-cep-lanca-excecao-para-number.md)), CEP de 9 dígitos, CEP com letras, `undefined` e string vazia. A suíte atual (5 casos) não exercita nenhum caminho que revele o bug.

## Plano de correção
1. Adicionar os 5 casos junto com a correção do bug.
