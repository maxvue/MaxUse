# `slugify` deixa hífens nas bordas

- **Severidade:** baixa
- **Arquivo:** [src/Helpers/Strings/manipulations.ts](../../src/Helpers/Strings/manipulations.ts) — linhas 33-40
- **Categoria:** correção

## Evidência

```
slugify('  -- olá --  ')  ->  "-ola-"
```

## Causa raiz

O `.trim()` roda **antes** de os hífens serem gerados, e não há remoção final.
Hífen em borda de slug de URL é forma não-canônica.

## Correção proposta

Acrescentar ao final da cadeia:

```ts
.replace(/^-+|-+$/g, '')
```

## Teste de regressão

```ts
it('não deixa hífens nas bordas', () => {
    expect(slugify('  -- olá --  ')).toBe('ola');
});
```
