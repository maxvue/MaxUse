# teste-faltante-documents-edge-cases

- **Severidade**: média
- **Tipo**: teste-faltante
- **Arquivo**: `src/Helpers/Validations/documents.test.ts:1-49`

## Problema
Não há testes para: null/undefined/string vazia (que hoje **lançam** — ver [helpers-cpf-cnpj-lanca-excecao-null-number](helpers-cpf-cnpj-lanca-excecao-null-number.md)), entrada numérica, tamanhos errados (10/12 dígitos de CPF, 13/15 de CNPJ), CNPJ com todos os dígitos iguais, CNPJ com máscara, CNPJ alfanumérico (js-brasil aceita `'12ABC34501DE35'` — verificar se é desejado para o CNPJ alfanumérico de 2026), e nenhum teste para os ~25 aliases exportados (`documents.ts:40-88`).

## Plano de correção
1. Escrever junto com a correção do bug de exceção: todos os casos acima.
2. Sanidade de aliases: `expect(cpfIsValid).toBe(isCpf)` para uma amostra representativa.
3. Decidir e fixar por teste o comportamento para CNPJ alfanumérico.
