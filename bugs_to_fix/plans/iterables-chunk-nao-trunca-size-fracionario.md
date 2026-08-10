# `chunk` não trunca tamanho fracionário e produz blocos de larguras diferentes

- **Severidade:** média (divergência não documentada)
- **Arquivo:** [src/Helpers/Iterables/chunk.ts](../../src/Helpers/Iterables/chunk.ts) — linha 14
- **Categoria:** paridade com Lodash

## Evidência

```
chunk([1,2,3,4], 1.5)
     mine   = [[1],[2,3],[4]]
     lodash = [[1],[2],[3],[4]]
```

O mais grave não é divergir do Lodash, e sim produzir **larguras inconsistentes
dentro de uma mesma chamada**: `[1]`, depois `[2,3]`, depois `[4]`.

## Causa raiz

`size` é usado cru em `i += size`; o float acumula e desloca as fronteiras dos
blocos a cada iteração. O Lodash aplica `toInteger(size)` → `1`.

Verificado como correto: `chunk(arr, 0)`, `chunk(arr, -1)` e o padrão. Só o
caminho não-inteiro diverge.

## Nota sobre a política de divergências

`chunk` está na lista dos 45 nomes de precedência intencional. Mas larguras
inconsistentes dentro da mesma chamada não são escolha de design defensável, e o
caso não consta em "Diferenças conhecidas".

## Correção proposta

```ts
const n = Math.trunc(size) || 0;
```

antes do laço, usando `n` daí em diante.

## Teste de regressão

```ts
it('trunca tamanho fracionário', () => {
    expect(chunk([1, 2, 3, 4], 1.5)).toEqual([[1], [2], [3], [4]]);
});
```
