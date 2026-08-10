# generatelist-codigo-morto-e-json-orfao

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivos**: `src/scripts/generateList.ts`, `src/scripts/all-modules.json`

## Problema
`saveInJson` não é importado por nenhum arquivo do repo, e `all-modules.json` (47 KB) é um artefato órfão sem referências. Como `resolveJsonModule` + include de `src/**/*.json` estão ativos, o JSON órfão ainda entra no grafo do tsc.

## Decisão de Design Registrada
- Remover os dois arquivos mortos/órfãos `src/scripts/generateList.ts` e `src/scripts/all-modules.json`.

## Plano de correção
1. Remover `src/scripts/generateList.ts` e `src/scripts/all-modules.json`.

## Testes
- `npm run type-check`, `npm run build` e `npm test` passando após a remoção.
