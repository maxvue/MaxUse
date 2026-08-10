# pp-set-publico-sem-guarda

- **Severidade**: alta
- **Tipo**: segurança (prototype pollution)
- **Arquivo**: `src/Helpers/Objects/set.ts:23-33`

## Problema
O `set.ts` público **não** usa `_baseSet` (que tem a guarda) — reimplementa o walk manualmente sem proteção, permitindo pollution direta.

## Evidência (execução real confirmada)
```js
set({}, '__proto__.pollutedS', 3); // ({}).pollutedS === 3
```

## Plano de correção
1. Fazer `set.ts` delegar a `baseSet` (como `setWith.ts` já faz). Isso corrige junto a divergência de criação de arrays ([lodash-set-nao-cria-array](lodash-set-nao-cria-array.md)) e a tipagem `any`.

## Testes
- `set({}, '__proto__.x', 1)` e `set({}, 'constructor.prototype.x', 1)` não poluem `Object.prototype`.
- Comportamento normal de paths preservado (regressão da suíte existente).
