# Design — Independência do Lodash (`@maxvue/max-use`)

**Data:** 2026-08-05
**Objetivo:** Eliminar a dependência de `lodash-es`, reimplementando com paridade total os exports que a MaxUse ainda não cobre, com suporte à reatividade do Vue (`toValue`), e removendo o import do Lodash ao final.

## Contexto levantado

- `lodash-es` exporta **322** nomes. Destes:
  - **36** já são cobertos por helpers próprios da MaxUse (`camelCase`, `capitalize`, `chunk`, `cloneDeep`, `countBy`, `filter`, `findLast`, `first`, `get`, `groupBy`, `isArray`, `isDate`, `isEmpty`, `isEqual`, `isNumber`, `isObject`, `kebabCase`, `keyBy`, `last`, `mapValues`, `now`, `omit`, `orderBy`, `pick`, `sample`, `set`, `shuffle`, `size`, `snakeCase`, `sortBy`, `sum`, `sumBy`, `toNumber`, `truncate`, `uniq`, `unset`);
  - **7** são cobertos pelo VueUse (`clamp`, `identity`, `invoke`, `noop`, `toArray`, `toString`, `valueOf`);
  - **279** faltam e serão implementados (paridade total, incluindo chaining/Seq, FP e `template`).
- **Bug de precedência encontrado:** em `src/index.ts:76`, `filteredLodash` não filtra nada e entra por último no spread de `_`, sobrescrevendo os helpers próprios e o VueUse — o oposto da precedência documentada no CLAUDE.md (próprios > VueUse > Lodash).

## Decisões

| Questão | Decisão |
|---|---|
| Escopo | **Paridade total** — todos os 279 exports faltantes, incluindo Seq/chaining, FP pesado e `template`. |
| Conflitos de nome (36) | **Próprios vencem.** Corrigir a precedência em `index.ts`. Divergências documentadas em `DIVERGENCES.md` + suite de testes que trava a divergência intencional. |
| Reatividade | `toValue()` + `MaybeRefOrGetter` **apenas nos argumentos de dados** (arrays, objetos, strings, números). Callbacks/iteratees permanecem funções puras. Retorno é valor plano. |
| `template`/`templateSettings` | Implementar com `new Function` (paridade real). O plano documenta o risco de CSP/segurança. |
| Estrutura | Novas categorias `Functions`, `Lang`, `Seq`, `Utils` + distribuição do restante nas categorias existentes. |

## Seção 1 — Arquitetura de destino

### Novas categorias (seguem a convenção existente: `index.ts` re-exporta flat + objeto namespace)

| Categoria | Conteúdo | Qtd aprox. |
|---|---|---|
| `Helpers/Functions/` | curry, curryRight, debounce, throttle, memoize, partial, partialRight, flow, flowRight, once, after, before, rearg, spread, unary, ary, flip, wrap, negate, defer, delay, bind, bindAll, bindKey, overArgs, rest | ~35 |
| `Helpers/Lang/` | type guards (`isNil`, `isNull`, `isUndefined`, `isPlainObject`, `isString`, `isBoolean`, `isFunction`, `isMap`, `isSet`, `isWeakMap`, `isWeakSet`, `isTypedArray`, `isArrayBuffer`, `isBuffer`, `isArguments`, `isError`, `isRegExp`, `isSymbol`, `isElement`, `isNative`, `isFinite`, `isInteger`, `isSafeInteger`, `isLength`, `isArrayLike`, `isArrayLikeObject`, `isObjectLike`, `isMatch`, `isMatchWith`, `isEqualWith`, `isNaN`…), conversões (`toFinite`, `toInteger`, `toLength`, `toSafeInteger`, `toPath`, `toPlainObject`, `castArray`, `clone`, `cloneWith`, `cloneDeepWith`), comparadores (`eq`, `gt`, `gte`, `lt`, `lte`) | ~55 |
| `Helpers/Seq/` | `chain`, `value`, `thru`, `tap`, `commit`, `plant`, `next`, `toIterator`, `toJSON`, `valueOf`, `wrapperAt`, `wrapperChain`, `wrapperCommit`, `wrapperLodash`, `wrapperNext`, `wrapperPlant`, `wrapperReverse`, `wrapperToIterator`, `wrapperValue`, `lodash`, `mixin` | ~15–20 |
| `Helpers/Utils/` | `times`, `uniqueId`, `range`, `rangeRight`, `stubArray`, `stubFalse`, `stubObject`, `stubString`, `stubTrue`, `constant`, `defaultTo`, `iteratee`, `matches`, `matchesProperty`, `property`, `propertyOf`, `method`, `methodOf`, `cond`, `conforms`, `conformsTo`, `over`, `overEvery`, `overSome`, `attempt`, `template`, `templateSettings`, `nthArg`, `result` | ~35 |

O restante (~139) vai para as categorias existentes:
- `Iterables/` — arrays e coleções (`compact`, `concat`, `difference*`, `drop*`, `each*`, `every`, `fill`, `find*`, `flat*`, `forEach*`, `fromPairs`, `head`, `includes`, `indexOf`, `initial`, `intersection*`, `join`, `lastIndexOf`, `map`, `max*`, `min*`, `nth`, `partition`, `pull*`, `reduce*`, `reject`, `remove`, `reverse`, `sampleSize`, `slice`, `some`, `sorted*`, `tail`, `take*`, `union*`, `uniqBy`, `uniqWith`, `unzip*`, `without`, `xor*`, `zip*`);
- `Objects/` — (`assign*`, `at`, `create`, `defaults`, `defaultsDeep`, `entries*`, `extend*`, `findKey`, `findLastKey`, `forIn*`, `forOwn*`, `functions*`, `has`, `hasIn`, `invert*`, `invokeMap`, `keys`, `keysIn`, `mapKeys`, `merge`, `mergeWith`, `omitBy`, `pickBy`, `setWith`, `toPairs*`, `transform`, `update`, `updateWith`, `values*`);
- `Strings/` — (`deburr`, `endsWith`, `escape`, `escapeRegExp`, `lowerCase`, `lowerFirst`, `pad*`, `repeat`, `replace`, `split`, `startCase`, `startsWith`, `toLower`, `toUpper`, `trim*`, `unescape`, `upperCase`, `upperFirst`, `words`);
- `Math/` — (`add`, `subtract`, `multiply`, `divide`, `ceil`, `floor`, `round`, `inRange`, `mean`, `meanBy`, `max`†, `min`†, `random`, `parseInt`);
- Aliases (`each`→`forEach`, `extend`→`assignIn`, `entries`→`toPairs`, `default`, etc.) são arquivos triviais que re-exportam com outro nome, no mesmo módulo do original.

† `max`/`maxBy`/`min`/`minBy` ficam onde fizer mais sentido entre `Iterables` e `Math` — decisão registrada no plano individual.

### Registro de novas categorias (obrigatório para cada uma)

1. `src/index.ts` — import + spread em `ownHelpers` + `export *`;
2. `src/Helpers/maxUseItems.ts`;
3. `src/scripts/buildAutoImport.ts`;
4. `vite.config.ts` — `build.lib.entry`;
5. `package.json` — mapa `exports`.

### Correção de precedência em `src/index.ts`

- **Durante a migração:** corrigir o loop do `filteredLodash` para pular chaves já presentes em `ownHelpers`/`filteredVueUse` (como o CLAUDE.md documenta). Assim cada helper implementado passa imediatamente a valer dentro de `_`.
- **Ao final:** remover `import * as lodash from 'lodash-es'` e o bloco `filteredLodash`; `_` vira `{...ownHelpers, ...filteredVueUse}`. Remover `lodash-es` das `dependencies` do `package.json`.

### Risco maior: `Seq` (chaining)

`chain`/`_(x)` cria um wrapper com todos os helpers como métodos e avaliação em `.value()`. Depende de todos os demais estarem prontos — fica obrigatoriamente na última fase. A implementação será um wrapper explícito (classe com métodos gerados a partir do registro de helpers), sem lazy evaluation otimizada do Lodash (shortcut fusion) — paridade de comportamento observável, não de performance interna.

## Seção 2 — Contrato do helper e do teste

### Assinatura padrão

```ts
import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * <descrição em português>
 * Semelhante ao _.<nome> do Lodash.
 *
 * @param <arg> <descrição>
 * @returns <descrição>
 */
export function nome<T>(arg: MaybeRefOrGetter<T[]>, opt: number = 1): T[] {
    const data = toValue(arg);
    if (!data || data.length === 0) return [];
    // ...
}
```

Regras fixas:
- `MaybeRefOrGetter` + `toValue()` **apenas nos argumentos de dados**. Callbacks/iteratees são funções puras — nunca envolvidos em `toValue`.
- Guard-clause com early return. ESLint `curly: multi`: corpo de uma instrução inline, sem chaves (`if (cond) return x;`).
- 4 espaços, aspas simples, ponto-e-vírgula obrigatório, sem trailing comma.
- JSDoc em português.
- Um arquivo por helper, registrado no `index.ts` da categoria.

### Teste colocalizado `<nome>.test.ts`

Cobertura obrigatória:
1. Casos de paridade com o comportamento documentado do Lodash;
2. Edge cases: `null`, `undefined`, vazio, tipo errado;
3. Um caso `funciona com Ref` (`expect(fn(ref(...)))`);
4. Peculiaridades do Lodash (ex.: `_.chunk([1,2,3], 0)` → `[]`, `_.toInteger('3.9')` → `3`).

### Oráculo de paridade

Enquanto `lodash-es` estiver instalado, os testes podem importá-lo para comparar saídas em casos-limite (`expect(nossoHelper(x)).toEqual(lodash.nome(x))`). Esses imports são removidos na fase final, convertendo os asserts para valores literais (o valor esperado fica gravado no teste).

## Seção 3 — Artefatos em `lodash_migrate/`

```
lodash_migrate/
├── execution.md              # instruções para o agente executor
├── status.yaml               # 279 itens + status de execução/verificação
├── CONVENTIONS.md            # contrato da Seção 2 (evita repetir em 279 planos)
├── DIVERGENCES.md            # os 36 conflitos: semântica MaxUse vs Lodash
└── plans/
    ├── Iterables/compact.md
    ├── Functions/curry.md
    └── ... (um .md por helper)
```

### Formato de `plans/<Categoria>/<nome>.md`

- Assinatura Lodash original + comportamento documentado (com peculiaridades);
- Assinatura MaxUse alvo (com `MaybeRefOrGetter` nos dados);
- Edge cases a cobrir;
- Casos de teste obrigatórios;
- `depende_de` (helpers internos necessários);
- Destino (`src/Helpers/<Cat>/<nome>.ts`) e registro no `index.ts` da categoria.

### Formato de `status.yaml`

```yaml
fases:
    - id: 1
      nome: Primitivos sem dependência
    # ...
helpers:
    - nome: compact
      categoria: Iterables
      fase: 2
      plano: plans/Iterables/compact.md
      depende_de: []
      tentativas: 0
      status_execucao: Aguardando    # Aguardando | Realizando | Concluído | Bloqueado
      status_verificacao: Aguardando # Aguardando | Realizando | Concluído
```

### Protocolo do agente executor (`execution.md`)

Máquina de estados por item (conforme especificação do usuário):
- `status_execucao: Realizando` → verificar progresso; se parado, continuar de onde parou;
- `status_execucao: Aguardando` → marcar `Realizando` e iniciar;
- `status_execucao: Concluído` → olhar `status_verificacao`:
  - `Realizando` → se parada, **reiniciar verificação do zero**;
  - `Aguardando` → marcar `Realizando` e iniciar verificação;
  - `Concluído` → próximo item.

Processo de execução por helper: (1) criar helper; (2) criar teste e rodar; (3) verificar brechas no teste; (4) corrigir helper/teste se necessário.

Verificação: subagente com **modelo Opus 5** revisa helper + teste; aprovado → próximo item; reprovado → voltar à execução.

Loop único até todos os itens estarem `Concluído`/`Concluído`.

### Melhorias de processo (aprovadas)

1. **Ordem por dependência** — o executor pega sempre o próximo item cujas `depende_de` estejam Concluídas, não a ordem alfabética.
2. **Fases explícitas** — (1) primitivos sem dependência; (2) arrays/coleções; (3) objetos/strings/math; (4) functions/utils; (5) Seq/chaining. Fase só abre quando a anterior fecha.
3. **Campo `tentativas`** — 3 reprovações na verificação → `status_execucao: Bloqueado`, seguir adiante; bloqueados revisados manualmente depois.
4. **Gate de integração por fase** — `npm run lint && npm run type-check && npm test` ao fechar cada fase.
5. **Remoção do Lodash só no final** — o import em `index.ts` sai apenas com os 279 Concluídos+Verificados; até lá serve de rede de segurança e oráculo de testes.
6. **Worktree obrigatório** — conforme CLAUDE.md: `git worktree add ../MaxUse-wt-lodash-migrate -b lodash-migrate`; integração ao main após validação.
7. **Dependência de fase para o Seq** — a fase 5 depende do fechamento da fase 4, sem listar 279 `depende_de` em `chain`.

## Fora de escopo

- Variantes reativas com retorno `ComputedRef` (ex.: `chunkRef`) — descartado na decisão de reatividade.
- Paridade de performance interna do Lodash (lazy evaluation/shortcut fusion no chaining).
- Varredura de projetos consumidores — a decisão foi paridade total, não subset por uso.

## Critérios de sucesso

1. `Object.keys(_)` contém todos os 322 nomes do `lodash-es` (os 36 com semântica MaxUse, documentada em `DIVERGENCES.md`);
2. `lodash-es` removido de `package.json` e de `src/index.ts`;
3. `npm run lint`, `npm run type-check` e `npm test` passam;
4. Precedência de `_` corrigida: próprios > VueUse (Lodash eliminado);
5. `status.yaml` com 279 itens em `Concluído`/`Concluído` (ou `Bloqueado` justificado);
6. Suite de testes de divergência travando os 36 nomes conflitantes;
7. Auto-import (`autoImportData.json`) regenerado incluindo as novas categorias.
