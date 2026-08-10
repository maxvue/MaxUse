# pp-merge-sem-guarda-proto

- **Severidade**: alta
- **Tipo**: segurança (prototype pollution)
- **Arquivo**: `src/Helpers/Objects/_baseMerge.ts:91-111` (via `merge.ts`, `mergeWith.ts`, `defaultsDeep.ts`)

## Problema
`baseMerge` itera as chaves de `source` via `keysIn` e atribui sem guarda contra `__proto__`/`constructor`/`prototype`. Diferente de `_baseSet`/`_deepSet` (que têm a guarda), `_baseMerge` não tem — permitindo prototype pollution através de `merge`, `mergeWith` e `defaultsDeep`.

## Evidência (execução real confirmada)
```js
merge({}, JSON.parse('{"__proto__":{"pollutedM":1}}'));   // ({}).pollutedM === 1
defaultsDeep({}, JSON.parse('{"__proto__":{"pollutedD":2}}')); // ({}).pollutedD === 2
```

## Plano de correção
1. No `for (const key of keysIn(src))` de `baseMerge` e dentro de `baseMergeDeep`, pular `key === '__proto__' || key === 'constructor' || key === 'prototype'`.

## Testes
- `merge`/`mergeWith`/`defaultsDeep` com source contendo `__proto__` e `constructor.prototype` não poluem `Object.prototype`: `expect(({} as any).polluted).toBeUndefined()` após a chamada.
- Merge normal de objetos com essas chaves como dados próprios (via `Object.defineProperty`) segue funcionando onde aplicável.
