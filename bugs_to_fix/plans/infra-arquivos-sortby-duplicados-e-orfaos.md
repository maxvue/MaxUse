# `sortBy.ts` e `sortByMulti.ts` são arquivos duplicados e órfãos

- **Severidade:** baixa
- **Arquivos:** [src/Helpers/Iterables/sortBy.ts](../../src/Helpers/Iterables/sortBy.ts); [src/Helpers/Iterables/sortByMulti.ts](../../src/Helpers/Iterables/sortByMulti.ts)
- **Categoria:** código morto

## Evidência

```
FILE_NOT_IN_INDEX | src/Helpers/Iterables | sortBy.ts
FILE_NOT_IN_INDEX | src/Helpers/Iterables | sortByMulti.ts

$ cat sortBy.ts sortByMulti.ts
import { orderBy } from './orderBy';  export const sortBy = orderBy;
import { orderBy } from './orderBy';  export const sortByMulti = orderBy;

$ grep -n "sortByMulti" orderBy.ts
76:export const sortByMulti = orderBy;
```

`orderBy.ts` já exporta ambos (linhas 75-76), e `Iterables/index.ts` reexporta
`./orderBy`. Os dois arquivos avulsos não alcançam a API pública por nenhum
caminho — os nomes funcionam graças ao `orderBy.ts`.

`sortByMulti.test.ts` importa do arquivo órfão e passa, o que mascara a
redundância.

Nota: os outros 21 arquivos apontados pela varredura são legítimos — internos
prefixados com `_`, `Routes/internal/` e `VueUse/core.ts` (entry própria).

## Correção proposta

Excluir os dois arquivos e repontar `sortByMulti.test.ts` para `./orderBy` (as
asserções já duplicam `orderBy.test.ts:120-127` e podem simplesmente sair).

## Teste de regressão

```ts
it('todo arquivo público está referenciado no index da categoria', () => {
    // varre src/Helpers/*/, ignora _*.ts, *.test.ts, index.ts
    // falha se o basename não aparecer no index.ts da pasta
});
```
