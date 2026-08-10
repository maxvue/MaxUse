# `useDefaultReset` usa clone JSON, que corrompe `Date`/`Map` e lança em ciclos

- **Severidade:** média
- **Arquivo:** [src/Composables/useDefaultReset.ts](../../src/Composables/useDefaultReset.ts) — linhas 45-52
- **Categoria:** correção + documentação

## Problema

`JSON.parse(JSON.stringify(...))` degrada `Date` para `string`, elimina chaves
`undefined`, converte `Map`/`Set` em `{}`, descarta funções e **lança
`TypeError` em referência circular** — no momento da construção do composable.

O JSDoc diz apenas "será clonado internamente via JSON", sem alertar para
nenhuma dessas perdas.

## Evidência

```
value = {"d":"2024-01-15T00:00:00.000Z","m":{}}
d instanceof Date = false   typeof d = string
'u' in value = false
error = TypeError Converting circular structure to JSON
```

Isso importa no caso de uso pretendido (formulários): um modelo com campo
`Date` **muda de tipo** silenciosamente após o primeiro `reset()`.

## Correção proposta

Usar `structuredClone` (disponível no Node 18+ conforme `engines` e em todos os
navegadores alvo), com `try/catch` recaindo para o caminho JSON em entradas não
clonáveis. `structuredClone` preserva `Date`/`Map`/`Set` e trata ciclos.

## Teste de regressão

```ts
it('preserva Date após reset', () => {
    const { state, reset } = useDefaultReset({ d: new Date('2024-01-15') });
    state.value.d = new Date('2025-01-01');
    reset();
    expect(state.value.d).toBeInstanceOf(Date);
});

it('não lança com entrada circular', () => {
    const o: any = { a: 1 }; o.self = o;
    expect(() => useDefaultReset(o)).not.toThrow();
});
```
