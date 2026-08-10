# credit-card-nao-valida-luhn

- **Severidade**: alta
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Validations/creditCard.ts:6-15`

## Problema
O JSDoc promete "algoritmo de Luhn", mas `validateBr.cartaocredito` do js-brasil **não valida Luhn** — só formato/bandeira. Verificado em runtime: `'4111111111111112'` e `'1234567890123456'` (dígito verificador Luhn errado) retornam `true`. A função aprova qualquer sequência de 16 dígitos com prefixo de bandeira.

## Evidência
```js
validateBr.cartaocredito('4111111111111112') === true
```

## Plano de correção
1. Implementar Luhn localmente (soma alternada dobrando dígitos) sobre `String(data).replace(/\D/g, '')`.
2. Combinar com a checagem de bandeira existente (Luhn **e** formato).

## Testes
- Pares válido/inválido por bandeira: `4111111111111111` true / `4111111111111112` false; `5500005555555559` true / dígito trocado false; com espaços/traços; `'0000000000000000'` mantém false.
