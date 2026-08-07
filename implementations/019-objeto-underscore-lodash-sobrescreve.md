# 019 — Lodash sobrescreve helpers próprios no objeto `_` (contradiz a documentação)

- **Severidade:** Alta
- **Tipo:** Divergência entre documentação e implementação / bug de precedência
- **Arquivo:** [src/index.ts](../src/index.ts) (bloco final)

## Descrição

O [CLAUDE.md](../CLAUDE.md) documenta a precedência do objeto `_` de forma
inequívoca:

> The `_` object has a strict precedence when names collide:
> **own helpers > VueUse > Lodash** (VueUse and Lodash keys are filtered out if a
> name already exists higher in the chain).

A implementação **não faz** essa filtragem para o Lodash:

```typescript
/**
 * Helpers do VueUse (filtrados para evitar duplicatas com os próprios).
 */
const filteredVueUse = {} as Omit<typeof vueUse, keyof typeof ownHelpers | 'vueUse'>;
const vueUseKeys = Object.keys(vueUse).filter((key) => key !== 'vueUse');

for (const key of vueUseKeys) if (!(key in ownHelpers)) (filteredVueUse as Record<string, any>)[key] = (vueUse as Record<string, any>)[key];
//                            ^^^^^^^^^^^^^^^^^^^^^^^^ VueUse é filtrado corretamente

/**
 * Helpers do Lodash (filtrados para evitar duplicatas com ownHelpers e filteredVueUse).
 */
const filteredLodash: Record<string, any> = {};
const lodashKeys = Object.keys(lodash);

for (const key of lodashKeys) filteredLodash[key] = (lodash as Record<string, any>)[key];
//                            ^^^^^^^^^^^^^^^^^^^ NENHUM filtro — copia tudo

export const _ = {
    ...ownHelpers,
    ...filteredVueUse,
    ...filteredLodash       // ← espalhado por último, sobrescreve os anteriores
};
```

O comentário do bloco afirma "filtrados para evitar duplicatas com ownHelpers e
filteredVueUse", mas o loop não tem condicional alguma. Como `filteredLodash` é
espalhado **por último**, toda colisão é vencida pelo Lodash — exatamente a
precedência **inversa** à documentada.

## Impacto

Helpers próprios da biblioteca são silenciosamente substituídos pelas versões do
Lodash dentro de `_`, com semânticas diferentes. Nomes afetados incluem:

| Nome         | Versão em `_` | Versão em named import | Divergência |
|--------------|---------------|------------------------|-------------|
| `isEmpty`    | Lodash        | MaxUse                 | `_.isEmpty(0)` → `true`; `isEmpty(0)` → `false` |
| `size`       | Lodash        | MaxUse                 | `_.size(5)` → `0`; `size(5)` → `5` |
| `orderBy`    | Lodash        | MaxUse                 | tratamento de null/undefined difere |
| `sortBy`     | Lodash        | MaxUse                 | assinatura de direção difere |
| `get` / `set`| Lodash        | MaxUse                 | comportamento com paths similares |
| `chunk`, `countBy`, `groupBy`, `keyBy`, `uniq`, `sample`, `shuffle`, `sumBy`, `filter`, `first`, `last`, `findLast`, `mapValues`, `isEqual` | Lodash | MaxUse | vários |
| `deepClone`  | próprio (sem colisão — Lodash usa `cloneDeep`) | MaxUse | — |

O resultado é que **o mesmo nome se comporta diferente dependendo da forma de
importação**:

```typescript
import { _, size } from '@maxvue/max-use';

size(5);      // → 5   (helper próprio)
_.size(5);    // → 0   (Lodash)
```

Isso é particularmente grave porque o objeto `_` é apresentado no README como a
forma conveniente de consumir a biblioteca, e o CLAUDE.md instrui explicitamente
mantenedores a assumirem que "when adding a helper whose name might clash, be
aware it will shadow the VueUse/Lodash version inside `_`" — o oposto do que
acontece.

## Correção sugerida

Aplicar o filtro que o comentário já promete:

```typescript
const filteredLodash: Record<string, any> = {};
const lodashKeys = Object.keys(lodash);

for (const key of lodashKeys) {
    if (key in ownHelpers) continue;
    if (key in filteredVueUse) continue;
    filteredLodash[key] = (lodash as Record<string, any>)[key];
}
```

**Atenção:** essa correção muda o comportamento de `_` para consumidores
existentes que hoje dependem (mesmo sem saber) da versão Lodash. É uma correção
de bug, mas com impacto observável — deve sair em uma **minor/major**, com nota
de release destacando os nomes afetados.

Se a preferência for manter o comportamento atual, então o **CLAUDE.md e o README
devem ser corrigidos** para documentar a precedência real
(`Lodash > VueUse > próprios`), e o comentário enganoso no código removido.

## Teste de regressão sugerido

```typescript
it('helpers próprios têm precedência sobre Lodash no objeto _', () => {
    expect(_.size(5)).toBe(size(5));
    expect(_.isEmpty(0)).toBe(isEmpty(0));
    expect(_.orderBy).toBe(orderBy);
});
```

## Relacionado

- [002 — isEmpty(0) e isEmpty(false)](./002-isEmpty-zero-e-false-nunca-vazios.md)
- [003 — size retorna o próprio número](./003-size-retorna-o-proprio-numero.md)
- [016 — orderBy diverge do Lodash](./016-orderBy-muta-objeto-de-entrada.md)
- [020 — documentação desatualizada](./020-documentacao-desatualizada.md)
