# get-nao-trata-chave-literal

- **Severidade**: média
- **Tipo**: divergencia-lodash
- **Arquivo**: `src/Helpers/Objects/get.ts:16-24`

## Problema
`get` público divide o path por regex simplista e não usa `castPath`/`isKey`. Quando a chave literal contém `.` mas já existe como own key, o Lodash retorna o valor; aqui retorna `undefined`. Também não trata símbolos em path string nem paths com aspas (`a["x.y"].z`) como o `toPath` real.

## Evidência
```js
get({ 'a.b': 5 }, 'a.b'); // → undefined  (Lodash: 5)
```

## Plano de correção
1. Reimplementar `get` sobre `baseGet` + `castPath` (já existem e tratam `isKey`), herdando a tipagem `unknown` dos internos.

## Testes
- `get({'a.b':5},'a.b') === 5`; path com símbolo; path `a["x.y"].z`; regressão da suíte existente.
