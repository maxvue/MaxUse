# `Random(n, 'nonumber')` retorna só dígitos — exatamente o oposto do nome

- **Severidade:** alta (correção trivial, comportamento invertido)
- **Arquivo:** [src/Helpers/Strings/random.ts](../../src/Helpers/Strings/random.ts) — linhas 30 e 36
- **Categoria:** bug de correção + teste ausente

## Problema

O tipo `'nonumber'` — que deveria gerar string **sem números** — gera string
**exclusivamente numérica**.

## Evidência

```
$ npx tsx -e "...Random(12,'nonumber')"
nonumber -> 958308865735
nonumber -> 230971916876
```

## Causa raiz

`'nonumber'.includes('number')` é `true`. A sequência:

1. **Linha 30** tem a guarda `&& !type_code.includes('nonumber')`, então `chars`
   permanece vazio;
2. **Linha 33** aplica o fallback alfanumérico;
3. **Linha 36** — cuja condição **não tem** a exclusão de `nonumber` — sobrescreve
   tudo com `'0123456789'`.

A guarda foi escrita num ponto e esquecida no outro.

## Agravante: membro público sem nenhum teste

`nonumber` é membro declarado da união exportada `Typecode` (linha 8) e
**não é exercitado em nenhum teste** — `random.test.ts` nunca o invoca. Um tipo
público com comportamento invertido passou despercebido por falta de cobertura.

## Correção proposta

Acrescentar a mesma exclusão já presente na linha 30 à condição da linha 36:

```ts
&& !type_code.includes('nonumber')
```

## Teste de regressão

```ts
it("'nonumber' gera string sem dígitos", () => {
    expect(Random(50, 'nonumber')).toMatch(/^[a-zA-Z]+$/);
});

it.each(['number', 'nonumber', 'letter', 'ulid'] as const)(
    'cobre o Typecode %s', (tipo) => {
        expect(Random(10, tipo)).toBeTruthy();
    }
);
```
