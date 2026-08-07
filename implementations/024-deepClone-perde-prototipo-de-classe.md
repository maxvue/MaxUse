# 024 — `deepClone` descarta o protótipo de instâncias de classe

- **Severidade:** Média
- **Tipo:** Bug / limitação não documentada
- **Arquivo:** [src/Helpers/Objects/deepClone.ts:11-64](../src/Helpers/Objects/deepClone.ts#L11-L64)

## Descrição

O JSDoc posiciona a função como equivalente ao Lodash:

```
 * Cria uma cópia profunda de um valor, lidando com referências circulares e diversos tipos de dados.
 * Semelhante ao _.cloneDeep do Lodash.
```

A implementação trata `Date`, `RegExp`, `Map`, `Set`, arrays e objetos planos —
mas para qualquer outra instância cai no ramo genérico:

```typescript
clone = Array.isArray(data) ? [] : {};       // ← sempre objeto literal
map.set(data, clone);

const keys = [...Object.keys(data), ...Object.getOwnPropertySymbols(data)];
for (const key of keys) clone[key] = deepClone((data as any)[key], map);
```

Confirmado em execução:

```typescript
class Foo { constructor(public x = 1) {} bar() { return 2; } }
const c = deepClone(new Foo());

c.constructor.name   →  "Object"      (esperado: "Foo")
typeof c.bar         →  "undefined"   (esperado: "function")
```

O clone perde a cadeia de protótipos: métodos desaparecem, `instanceof` falha,
getters/setters definidos na classe somem.

## Divergência em relação ao `_.cloneDeep`

O Lodash **preserva** o protótipo via `Object.create(Object.getPrototypeOf(obj))`.
Portanto:

```typescript
import { deepClone } from '@maxvue/max-use';
import cloneDeep from 'lodash-es/cloneDeep';

cloneDeep(new Foo()) instanceof Foo    // → true
deepClone(new Foo()) instanceof Foo    // → false
```

Como a biblioteca se apresenta como substituta unificada do Lodash, essa
divergência quebra migrações silenciosamente. E, por conta do
[achado 019](./019-objeto-underscore-lodash-sobrescreve.md), o nome `cloneDeep`
dentro de `_` vem do Lodash (comportamento correto) enquanto `deepClone` vem da
lib (comportamento divergente) — dois clones com semânticas diferentes no mesmo
objeto.

## Limitações adicionais não documentadas

Além do protótipo, o ramo genérico não trata:

| Tipo                | Comportamento atual |
|---------------------|---------------------|
| `Error`             | vira `{}` — `message` e `stack` são não-enumeráveis |
| `ArrayBuffer` / TypedArray | vira `{0: n, 1: n, ...}` |
| Getters/setters     | avaliados e copiados como valores estáticos |
| Propriedades não-enumeráveis | descartadas (`Object.keys` só lê enumeráveis) |
| `WeakMap` / `WeakSet` | vira `{}` |
| Funções             | retornadas por referência (o `typeof !== 'object'` da linha 15 as devolve intactas) |

O último caso é razoável, mas os demais produzem clones que perdem dados sem
qualquer aviso.

## Correção sugerida

**Mínimo — preservar o protótipo:**

```typescript
// Lida com Arrays e Objetos comuns (preservando o protótipo da instância)
if (Array.isArray(data)) {
    clone = [];
} else {
    const proto = Object.getPrototypeOf(data);
    clone = proto === null ? Object.create(null) : Object.create(proto);
}
map.set(data, clone);
```

**Recomendado — usar descritores de propriedade**, o que resolve também
getters/setters e não-enumeráveis:

```typescript
map.set(data, clone);

for (const key of Reflect.ownKeys(data)) {
    const desc = Object.getOwnPropertyDescriptor(data, key)!;
    if ('value' in desc) desc.value = deepClone(desc.value, map);
    Object.defineProperty(clone, key, desc);
}
```

**Alternativa — documentar a limitação** se o comportamento atual for intencional
(clone "plano" para serialização):

```
 * ATENÇÃO: instâncias de classe são clonadas como objetos literais — o protótipo,
 * métodos e propriedades não-enumeráveis são descartados. Para preservar a
 * identidade de classe, use `structuredClone` ou `_.cloneDeep` do Lodash.
```

## Testes de regressão sugeridos

```typescript
class Ponto { constructor(public x = 0, public y = 0) {} distancia() { return Math.hypot(this.x, this.y); } }

it('preserva o protótipo de instâncias de classe', () => {
    const clone = deepClone(new Ponto(3, 4));
    expect(clone).toBeInstanceOf(Ponto);
    expect(clone.distancia()).toBe(5);
});
```

## Relacionado

- [019 — Lodash sobrescreve helpers próprios no objeto `_`](./019-objeto-underscore-lodash-sobrescreve.md)
