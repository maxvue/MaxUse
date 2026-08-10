# internos-base-sem-teste-direto

- **Severidade**: média
- **Tipo**: teste-faltante
- **Arquivos**: `src/Helpers/Iterables/_baseExtremum.ts`, `_baseSortedIndexBy.ts`, `_deepSet.ts`, `_restIteratee.ts`; `src/Helpers/Math/_createRound.ts`; `src/Helpers/Objects/_baseMerge.ts`, `_baseSet.ts`, `_castPath.ts`; `src/Helpers/Lang/_baseClone.ts`, `_baseIsMatch.ts`, `_baseToString.ts`; `src/Helpers/Utils/_baseGet.ts`, `_baseInvoke.ts`, `_baseRange.ts`

## Problema
Nenhum dos 14 módulos internos tem `<nome>.test.ts` colocado (apenas `_MaxUseWrapper.test.ts` existe). A convenção do projeto ("Tests are colocated") não é cumprida, a cobertura é indireta e esses arquivos **não estão** nos excludes de coverage do `vitest.config.ts` — edge cases internos (guarda de pollution, Symbol, tags de clone) ficam sem asserção direta.

## Plano de correção
Criar teste direto para cada um, priorizando:
1. `_baseSet` — guarda `__proto__`/`constructor`/`prototype` + criação array-vs-objeto por `isIndex`.
2. `_baseMerge` — após aplicar a guarda de [lodash-pp-merge-sem-guarda-proto](lodash-pp-merge-sem-guarda-proto.md).
3. `_baseClone` — cada tag: Date, RegExp (flags + lastIndex), Map/Set recursivos, TypedArray shallow compartilha buffer, referência circular.
4. `_baseSortedIndexBy` — NaN/null/undefined/Symbol e `retHighest`.
5. `_castPath`/`isKey` — string vazia, chave própria com ponto.
6. Demais (`_baseExtremum`, `_restIteratee`, `_deepSet`, `_createRound`, `_baseIsMatch`, `_baseToString`, `_baseGet`, `_baseInvoke`, `_baseRange`) com casos essenciais.

## Testes
- 14 novos arquivos `.test.ts` colocados, todos passando.
