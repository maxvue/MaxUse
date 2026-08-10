# generatelist-codigo-morto-e-json-orfao

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivos**: `src/scripts/generateList.ts`, `src/scripts/all-modules.json`

## Problema
`saveInJson` não é importado por nenhum arquivo do repo, e `all-modules.json` (47 KB) é um artefato órfão sem referências. Como `resolveJsonModule` + include de `src/**/*.json` estão ativos, o JSON órfão ainda entra no grafo do tsc.

## Plano de correção
1. Remover os dois arquivos (ou mover `saveInJson` para dentro de `buildAutoImport.ts` se houver plano de uso).

## Testes
- `npm run type-check`, `npm run build` e `npm test` passando após a remoção.
