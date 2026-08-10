# use-ref-cached-chave-numerica-zero-vira-no-key

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Composables/useRefCached.ts:27`

## Problema
`toValue(key) ? String(toValue(key)) : 'no-key'` — a chave numérica `0` (tipo aceito por `KeyCached`, linha 4) é falsy e vira `'no-key'` silenciosamente. Também avalia `toValue(key)` duas vezes (getter executado 2x).

## Plano de correção
```ts
const k = toValue(key);
return k === null || k === undefined || k === '' ? 'no-key' : String(k);
```

## Testes
- `useRefCached(0, 'v')` usa a chave `'0'` no localStorage.
- Getter de chave é avaliado uma única vez por resolução (spy).
