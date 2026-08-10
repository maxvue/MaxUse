# `orderBy`/`sortBy` não resolvem caminho profundo — ordenação silenciosamente errada

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Iterables/orderBy.ts](../../src/Helpers/Iterables/orderBy.ts) — linhas 49-50
- **Categoria:** bug de correção — resultado errado sem erro

## Problema

Critérios de ordenação em string são tratados como **acesso direto de
propriedade**, não como caminho. Um critério do tipo `'a[0].b.c'` resolve para
`undefined` em todos os elementos, todas as comparações empatam, e o array volta
**na ordem original** — sem erro algum.

## Evidência

```
DIFF sortBy bracket path
     mine  = [{a:[{b:{c:5}}]},{a:[{b:{c:2}}]}]     # não ordenou
     lodash= [{a:[{b:{c:2}}]},{a:[{b:{c:5}}]}]     # ordenou
```

## Causa raiz

```ts
valA = (a as Record<string, unknown>)?.[rule]
```

Indexação direta. A chave literal `'a[0].b.c'` não existe em nenhum elemento →
`undefined` para todos → empate geral → ordem preservada.

O repositório **já possui** um `get` com resolução de caminho pronto para
reúso — a função simplesmente não o utiliza.

Alcance: `sortBy` e `sortByMulti` são apelidos de `orderBy`
(`orderBy.ts:75-76`), então os três compartilham o defeito.

## Por que é grave

A falha é silenciosa. Uma lista "ordenada" por caminho profundo é exibida ao
usuário final na ordem errada, sem exceção, sem log, sem sintoma — até alguém
conferir manualmente.

## Correção proposta

Substituir a indexação direta pelo `get` profundo já existente:

```ts
import { get } from '../Objects/get';
// ...
valA = get(a, rule);
valB = get(b, rule);
```

## Teste de regressão

```ts
it('ordena por caminho profundo com notação de colchetes', () => {
    const arr = [{ a: [{ b: { c: 5 } }] }, { a: [{ b: { c: 2 } }] }];
    expect(sortBy(arr, 'a[0].b.c')[0].a[0].b.c).toBe(2);
});

it('ordena por caminho com ponto', () => {
    const arr = [{ u: { idade: 30 } }, { u: { idade: 20 } }];
    expect(sortBy(arr, 'u.idade')[0].u.idade).toBe(20);
});
```
