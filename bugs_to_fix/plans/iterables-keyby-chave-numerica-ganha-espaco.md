# `keyBy` corrompe toda chave numérica acrescentando um espaço

- **Severidade:** CRÍTICA
- **Arquivo:** [src/Helpers/Iterables/keyBy.ts](../../src/Helpers/Iterables/keyBy.ts) — linha 22
- **Categoria:** bug de correção — resultado inutilizável

## Problema

`keyBy` acrescenta um espaço ao final de qualquer chave que pareça numérica.
O objeto resultante **não pode ser indexado por ninguém**: nem pelo valor
numérico original, nem pela sua forma string.

## Evidência

```
$ npx tsx -e "import {keyBy} from './src/Helpers/Iterables/keyBy';
const r:any = keyBy([{id:1,u:'a'},{id:2,u:'b'}],'id');
console.log('keys=',JSON.stringify(Object.keys(r)),'| lookup r[1]=',r[1]);"

keys= ["1 ","2 "] | lookup r[1]= undefined
```

Comportamento esperado (Lodash): `{1: {...}, 2: {...}}`, com `result[1]`
retornando o objeto.

Também afeta strings numéricas: `keyBy([{id:'10'}],'id')` → `{"10 ": ...}`.

## Causa raiz

```ts
const strKey = k !== null && k !== '' && !isNaN(Number(k))
    ? String(k) + ' '
    : String(k);
```

O espaço é acrescentado deliberadamente — aparentemente para driblar a
reordenação automática que o JavaScript aplica a chaves inteiras em objetos.

O remédio é pior que a doença: preserva-se a ordem de inserção ao custo de
tornar o resultado inacessível. `result[user.id]` — o uso natural e único
motivo de existir de `keyBy` — retorna sempre `undefined`.

Isto está errado sob **qualquer** decisão de API. Não é divergência de design:
nenhum consumidor quer um índice que não indexa.

## Correção proposta

Remover o sufixo:

```ts
return [String(k), item];
```

Se a ordem de inserção for requisito real, a estrutura correta é `Map`, que
preserva ordem e aceita chaves de qualquer tipo — não um objeto com chaves
adulteradas.

## Atenção: o teste atual documenta o bug

`keyBy.test.ts:8` afirma `result['1 ']` — ou seja, o teste **consagra o espaço
como esperado**. Corrigir o código quebra esse teste, e isso é desejado: o
teste precisa ser reescrito junto com a correção.

Mesmo padrão observado em
[electrical-testes-codificam-o-bug](./electrical-testes-codificam-o-bug.md).

## Teste de regressão

```ts
it('indexa por chave numérica sem adulterar a chave', () => {
    const r = keyBy([{ id: 1, u: 'a' }, { id: 2, u: 'b' }], 'id');
    expect(Object.keys(r)).toEqual(['1', '2']);
    expect(r['1']).toEqual({ id: 1, u: 'a' });
    expect((r as never)[1]).toEqual({ id: 1, u: 'a' });
});

it('não deixa espaço em branco em nenhuma chave', () => {
    const r = keyBy([{ id: '10' }], 'id');
    expect(Object.keys(r).every(k => k === k.trim())).toBe(true);
});
```
