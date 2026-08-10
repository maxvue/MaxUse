# `phone()` aceita números brasileiros que não podem existir

- **Severidade:** CRÍTICA
- **Arquivo:** [src/Helpers/Validations/phone.ts](../../src/Helpers/Validations/phone.ts) — linha 1 (import) e linha 21
- **Categoria:** divergência de regra de negócio (BR)

## Problema

`phone()` valida apenas a **faixa de comprimento** do número, não o padrão
nacional por tipo de linha. Com isso aceita como válidos números que a
numeração brasileira torna impossíveis:

- celular com 10 dígitos (sem o 9º dígito) — extinto desde 2016;
- telefone fixo com 11 dígitos.

## Evidência

```
$ npx tsx -e "import {phone} from './src/Helpers/Validations/phone';
console.log(phone('1199999123'), phone('11333344445'));"

10-digit mobile 1199999123 -> true
11-digit landline 11333344445 -> true
```

A resposta correta é `false` nos dois casos, e a própria dependência já sabe
disso quando carregada com os metadados completos:

```
$ npx tsx -e "import * as P from 'libphonenumber-js/max';
for (const x of ['+551199999123','+5511333344445','+5511999991234','+551133334444']) {
  const p = P.parsePhoneNumberFromString(x); console.log(x, p?.isValid(), p?.getType());
}"

+551199999123    false  undefined
+5511333344445   false  undefined
+5511999991234   true   MOBILE
+551133334444    true   FIXED_LINE
```

## Causa raiz

`import * as PhoneLib from 'libphonenumber-js'` carrega o bundle de metadados
**min**, que só valida faixas de comprimento por país — não os padrões
nacionais por tipo. As guardas manuais da função (`length < 10`,
`startsWith('00')`) não compensam essa perda.

Agravante de documentação: o JSDoc promete "padrão internacional via
libphonenumber-js", mas a validação entregue é materialmente mais fraca do que
a biblioteca é capaz de fazer.

## Correção proposta

Trocar o import para o bundle com metadados completos:

```ts
import * as PhoneLib from 'libphonenumber-js/max';
```

`isValidPhoneNumber` passa então a aplicar o padrão nacional completo,
incluindo a regra do 9º dígito.

Ponderação necessária: `/max` aumenta o tamanho do bundle. É, porém, a única
variante que enforça a regra do 9º dígito. Se o custo for proibitivo, a
alternativa é `/mobile` (caso só celular importe) ou implementar a whitelist de
DDD + regra de 9º dígito manualmente — mas isso duplica conhecimento que a
dependência já tem.

Regressão a confirmar: os casos hoje válidos continuam válidos sob `/max`
(`phone('11999991234')` e `phone('1133334444')` → `true`, já verificado acima).

## Teste de regressão

```ts
it('rejeita celular BR de 10 dígitos (sem o 9º dígito)', () => {
    expect(phone('1199999123')).toBe(false);
    expect(phone('+551199999123')).toBe(false);
});

it('rejeita fixo BR com 11 dígitos', () => {
    expect(phone('11333344445')).toBe(false);
});

it('mantém válidos os números BR corretos', () => {
    expect(phone('11999991234')).toBe(true);   // celular
    expect(phone('1133334444')).toBe(true);    // fixo
});
```
