# `memoize.Cache` ausente e aridade zerada em `curry`/`curryRight`

- **Severidade:** baixa
- **Arquivos:** [src/Helpers/Functions/memoize.ts](../../src/Helpers/Functions/memoize.ts) linha 33; [src/Helpers/Functions/curry.ts](../../src/Helpers/Functions/curry.ts) linha 47; `curryRight.ts`
- **Categoria:** paridade com Lodash

## 1. `memoize.Cache` não é exposto

```
memoize.Cache: undefined
```

No Lodash, `_.memoize.Cache === Map` e é ponto de extensão **documentado e
atribuível** (`_.memoize.Cache = WeakMap` troca a implementação de cache).

**Causa:** a linha 33 fixa `new Map(...)` e nunca anexa o estático `Cache` à
função exportada.

**Verificado como correto:** a API `.cache` por instância funciona bem —
`fn.cache instanceof Map`, `.get`/`.has`/`.delete`/`.clear` presentes,
substituição do `fn.cache` funciona, e o resolver está correto. Falta só o
estático.

**Correção:** `memoize.Cache = Map;` na função exportada (com o tipo por
declaration merging) e ler `new (memoize.Cache)()` na linha 33.

## 2. Aridade zerada em curry

```
curry len 0    curryRight len 0
```

Esperado no Lodash: `_.curry(fn3).length === 3`. É isso que permite compor
funções curried com utilitários que introspeccionam aridade (`_.ary`, `_.rest`,
pipelines point-free, re-curry).

**Causa:** o wrapper retornado usa parâmetro rest (`function (...args)`), e rest
contribui `0` para `Function.prototype.length`.

**Verificado como correto:** todo o resto do curry está certo — `cf(1)(2)(3)` e
`cf(1,2)(3)`, `curry.placeholder`, `partial.placeholder`, `curryRight`. O
suporte a placeholder é genuinamente implementado.

**Correção:**

```ts
Object.defineProperty(curried, 'length', {
    value: Math.max(0, n - args.length),
    configurable: true
});
```

## Teste de regressão

```ts
it('expõe memoize.Cache', () => {
    expect(memoize.Cache).toBe(Map);
});

it('reporta a aridade restante', () => {
    const cf = curry((a: number, b: number, c: number) => 0);
    expect(cf.length).toBe(3);
    expect(cf(1).length).toBe(2);
});
```
