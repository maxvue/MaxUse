# 016 — `orderBy` muta o objeto de entrada quando recebe um Record

- **Severidade:** Média
- **Tipo:** Bug (efeito colateral) / documentação incorreta
- **Arquivo:** [src/Helpers/Iterables/orderBy.ts:20-70](../src/Helpers/Iterables/orderBy.ts#L20-L70)

## Descrição

O JSDoc promete explicitamente imutabilidade:

```
 * @returns Um novo array ordenado.
```

E o código clona corretamente no caso de array:

```typescript
const items: T[] = Array.isArray(data) ? [...data] : Object.values(data);
//                                       ^^^^^^^^^ clona     ^^^^^^^^^^^^^^^^^^ novo array
```

Ambos os ramos produzem um novo array, então o `items.sort()` da linha 37 não muta
a coleção original. **Isso está correto** — verificado em execução:

```
orderBy([{n:3},{n:1},{n:2}], 'n')  →  origem preservada: [{"n":3},{"n":1},{"n":2}]
```

O problema real é outro, descrito abaixo.

## Problema real 1 — perda de chaves ao ordenar um Record

Quando a entrada é um `Record<string, T>`, a função retorna `T[]` via
`Object.values()`, **descartando as chaves**:

```typescript
orderBy({ a: {n:2}, b: {n:1} }, 'n')   →  [{n:1}, {n:2}]
```

As chaves `a` e `b` desaparecem. Para muitos casos de uso de ordenação de mapas
(ex.: ordenar um dicionário de itens indexados por ID mantendo a associação), o
resultado é inutilizável. A assinatura declara `: T[]`, então o comportamento é
tecnicamente honesto — mas a documentação não alerta para a perda de informação.

## Problema real 2 — `orderBy` não é compatível com o `orderBy` do Lodash

O nome `orderBy` colide com `_.orderBy` do Lodash, e a biblioteca exporta ambos:
no objeto `_`, o Lodash **sobrescreve** o helper próprio (ver
[achado 019](./019-objeto-underscore-lodash-sobrescreve.md)), enquanto o named
export `import { orderBy }` entrega a versão própria.

As assinaturas divergem em um ponto crítico:

| Aspecto              | `orderBy` (MaxUse)             | `_.orderBy` (Lodash)           |
|----------------------|--------------------------------|--------------------------------|
| Sem critério         | retorna cópia **não ordenada** | ordena por identidade          |
| Direção global       | `orders: 'asc'` aplica a todos | `orders` é sempre array        |
| Null/undefined       | sempre no final                | segue a comparação padrão      |
| Record de entrada    | `Object.values()`              | `Object.values()` (idem)       |

Portanto `_.orderBy(x, 'n', 'desc')` e `orderBy(x, 'n', 'desc')` podem produzir
resultados diferentes dependendo de qual foi importado — e o desenvolvedor não
tem sinal de qual está usando.

## Problema real 3 — `sortBy` e `sortByMulti` são apenas aliases

```typescript
export const sortBy = orderBy;
export const sortByMulti = orderBy;
```

O `_.sortBy` do Lodash tem semântica diferente: é sempre ascendente e estável, e
não aceita o terceiro parâmetro de direção. Quem migra de Lodash esperando
`sortBy(x, 'n')` encontra a mesma coisa, mas `sortBy(x, 'n', 'desc')` — inválido
no Lodash — silenciosamente funciona aqui, criando código que não é portável de
volta.

## Correção sugerida

1. **Documentar a perda de chaves** no JSDoc de forma explícita:

```
 * @returns Um novo array ordenado. ATENÇÃO: quando `collection` é um Record,
 *          as chaves são descartadas (usa Object.values). Para preservar a
 *          associação chave→valor, ordene `Object.entries(obj)`.
```

2. **Documentar as divergências em relação ao Lodash** no JSDoc e no README,
   já que a lib se posiciona como substituta do Lodash.

3. **Considerar `orderEntries`** como helper complementar, para o caso de Record:

```typescript
export function orderEntries<T>(
    collection: MaybeRefOrGetter<Record<string, T>>,
    criteria?: Criterion<T> | Criterion<T>[],
    orders?: OrderDirection | OrderDirection[]
): [string, T][] { ... }
```

## Relacionado

- [019 — Lodash sobrescreve helpers próprios no objeto `_`](./019-objeto-underscore-lodash-sobrescreve.md)
