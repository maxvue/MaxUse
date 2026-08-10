# `truncate` parte caractere astral e emite substituto solitário

- **Severidade:** baixa
- **Arquivo:** [src/Helpers/Strings/manipulations.ts](../../src/Helpers/Strings/manipulations.ts) — linhas 18-20
- **Categoria:** correção Unicode

## Evidência

```
truncate('🙂🙂🙂🙂🙂', 3, '...')  ->  "🙂\ud83d..."
```

A saída contém um **substituto não pareado**, que renderiza como `�`.

## Causa raiz

`str.length` e `str.slice` contam unidades UTF-16, não pontos de código.

Inconsistência interna: `pad.ts:90` **trata isso corretamente** via `[...chars]`,
no mesmo módulo.

## Nota sobre a política de divergências

`truncate` está na lista dos 45 nomes. Ainda assim, emitir substituto solitário
é bug de correção que nenhum chamador deseja — independente de paridade com o
Lodash.

## Correção proposta

```ts
[...str].slice(0, limit).join('')
```

## Teste de regressão

```ts
it('não parte pares substitutos', () => {
    const out = truncate('🙂🙂🙂🙂🙂', 3, '...');
    expect(out).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/);
});
```
