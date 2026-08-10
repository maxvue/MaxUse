# set-nao-cria-array

- **Severidade**: média
- **Tipo**: divergencia-lodash
- **Arquivo**: `src/Helpers/Objects/set.ts:28`

## Problema
Segmentos intermediários são sempre criados como objeto plano `{}`; o Lodash cria **array** quando o próximo segmento é um índice válido. `_baseSet`/`_deepSet` já fazem isso corretamente via `isIndex`, mas o `set` público não os usa.

## Evidência
```js
set({}, 'a[0]', 1); // → {"a":{"0":1}}  (Lodash: {"a":[1]})
```

## Plano de correção
1. Delegar a `baseSet` (mesma correção de [lodash-pp-set-publico-sem-guarda](lodash-pp-set-publico-sem-guarda.md) — resolver juntos).

## Testes
- `expect(set({}, 'a[0].b', 2)).toEqual({ a: [{ b: 2 }] })`.
