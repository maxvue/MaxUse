# `useRefCached` guarda o objeto `default_value` do chamador por referência

- **Severidade:** alta
- **Arquivo:** [src/Composables/useRefCached.ts](../../src/Composables/useRefCached.ts) — linhas 32, 51, 88
- **Categoria:** bug de correção — estado compartilhado indevidamente

## Problema

`ref<T>(default_value)` embrulha o **objeto do chamador**, e as linhas 51/88
reatribuem esse **mesmo objeto** em cache-miss/reset. Consequências:

1. mutar o ref muta o literal do chamador;
2. dois composables que compartilhem um default compartilham estado;
3. como a linha 88 reatribui o default (já mutado) a cada troca de chave, o
   "reset para o default" fica **permanentemente corrompido** após a primeira
   mutação.

## Evidência

```
caller default after mutation = {"items":[1]}     <-- deveria continuar {"items":[]}
b.value = {"n":42}                                <-- instância B vê estado da A

× mutating state mutates the caller-owned default object
  → expected [ 1 ] to deeply equal []
× two instances share state through the default object
  → expected 42 to be +0
```

## Correção proposta

Clonar na entrada e a cada reset:

```ts
const cloneDefault = () =>
    (typeof default_value === 'object' && default_value !== null)
        ? structuredClone(default_value)
        : default_value;

const state = ref<T>(cloneDefault()) as ToRefCached<T>;
// e trocar cada `state.value = default_value` por `state.value = cloneDefault()`
```

## Teste de regressão

```ts
it('não muta o objeto default do chamador', () => {
    const def = { items: [] as number[] };
    const { state } = useRefCached('k', def);
    state.value.items.push(1);
    expect(def.items).toEqual([]);
});

it('não compartilha estado entre instâncias com o mesmo default', () => {
    const def = { n: 0 };
    const a = useRefCached('a', def);
    const b = useRefCached('b', def);
    a.state.value.n = 42;
    expect(b.state.value.n).toBe(0);
});
```
