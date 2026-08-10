# `isEqual` estoura a pilha em referências circulares

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Objects/isEqual.ts](../../src/Helpers/Objects/isEqual.ts) — linha 12 (sem rastreio de visitados)
- **Categoria:** bug de correção — crash

## Problema

Comparar duas estruturas circulares estruturalmente idênticas lança
`RangeError: Maximum call stack size exceeded` em vez de retornar `true`.

## Evidência

```
$ npx tsx -e "import { isEqual } from './src/Helpers/Objects/isEqual';
const a:any={x:1}; a.s=a; const b:any={x:1}; b.s=b;
try{ console.log(isEqual(a,b)); }catch(e:any){ console.log('THREW', e.constructor.name); }"

THREW RangeError
```

O mesmo ocorre com arrays autorreferentes (`p=[1]; p.push(p)`).

Comportamento esperado (Lodash): `_.isEqual(a, b)` retorna `true` — o
`baseIsEqualDeep` carrega um `Stack` e faz curto-circuito ao reencontrar um par
já visitado. O Lodash nunca lança nesse caso.

## Causa raiz

`isEqual` recorre pelos ramos de `Map`, `Set`, array e objeto (linhas 38, 48,
58, 66) **sem** propagar um parâmetro `stack`/`WeakMap`. Um ciclo recorre
indefinidamente até estourar a pilha.

Inconsistência interna relevante: `deepClone`, na mesma pasta, **carrega** um
`WeakMap` exatamente para isso e trata ciclos corretamente. A omissão em
`isEqual` é descuido, não simplificação deliberada.

## Impacto

Crash, não resultado errado. Estruturas circulares são rotineiras em aplicação
Vue — instâncias de componente, vínculos pai/filho, grafos reativos. `isEqual` é
escolha natural para comparação em `watch`/memo, e um `RangeError` ali derruba a
renderização.

## Sobre a política de divergências

`isEqual` está na lista dos 45 nomes. Mas `RangeError` não é divergência de
design, e o caso não consta em "Diferenças conhecidas". Manter a implementação
própria é legítimo; travar em entrada que o Lodash suporta, não.

## Correção proposta

Adicionar terceiro parâmetro interno `stack = new WeakMap()` e, no início da
comparação de objetos:

```ts
const seen = stack.get(a);
if (seen !== undefined) return seen === b;
stack.set(a, b);
```

Propagando `stack` em toda chamada recursiva (valores de `Map`, membros de
`Set`, elementos de array, propriedades de objeto). É o mesmo padrão que
`deepClone` já aplica.

## Teste de regressão

`isEqual.test.ts` não tem hoje ocorrência de `circ`/`self`/`stack`.

```ts
it('trata referências circulares sem estourar a pilha', () => {
    const a: any = { x: 1 }; a.s = a;
    const b: any = { x: 1 }; b.s = b;
    expect(() => isEqual(a, b)).not.toThrow();
    expect(isEqual(a, b)).toBe(true);
});

it('trata arrays autorreferentes', () => {
    const p: any = [1]; p.push(p);
    const q: any = [1]; q.push(q);
    expect(isEqual(p, q)).toBe(true);
});
```
