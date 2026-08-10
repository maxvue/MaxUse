# categorias-sem-subpath-export

- **Severidade**: média
- **Tipo**: infra
- **Arquivos**: `vite.config.ts:17-33`, `package.json:10-71`

## Problema
As categorias `Lang`, `Functions`, `Utils` e `Seq` estão no `index.ts`, no `maxUseItems.ts` e no `buildAutoImport.ts`, mas **não têm** entrada no `build.lib.entry` nem subpath no `exports` do package.json — todas as demais categorias têm (`./dates`, `./strings`, etc.). Consumidor não consegue `import { x } from '@maxvue/max-use/lang'`. A paridade dos 15 pares existentes está correta; a inconsistência é a ausência desses 4.

## Plano de correção
1. Adicionar as 4 entradas em `build.lib.entry` e os 4 subpaths em `exports` (`types` → `./dist/Helpers/<Cat>/index.d.ts`).
2. Alternativa: se for decisão deliberada, registrar no CLAUDE.md/README.

## Testes
- `npm run build` gera os 4 novos `dist/*.es.js`; import de subpath resolve (smoke test com `node -e "import(...)"`).
