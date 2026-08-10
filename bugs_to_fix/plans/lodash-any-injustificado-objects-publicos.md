# any-injustificado-objects-publicos

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivos**: `src/Helpers/Objects/get.ts:12`, `set.ts:12`, `unset.ts:11`, `src/Helpers/Iterables/orderBy.ts:42-53`

## Problema
`get`/`set`/`unset` usam `MaybeRefOrGetter<any>` e acesso sem narrowing; `orderBy` usa `valA: any`/`(a as any)[rule]`. Contrasta com os internos migrados (`_baseGet`, `_baseSet`) que usam `unknown`/`PropertyKey` corretamente.

## Plano de correção
1. Ao reimplementar `get`/`set`/`unset` sobre os internos (planos `lodash-pp-set-publico-sem-guarda`, `lodash-get-nao-trata-chave-literal`, `lodash-unset-path-simplista`), herdar assinaturas com `unknown`.
2. Em `orderBy`, trocar `any` por `unknown` com casts localizados onde a comparação heterogênea exigir.

## Testes
- `npm run type-check` limpo; testes de tipo pontuais com `expectTypeOf`.
