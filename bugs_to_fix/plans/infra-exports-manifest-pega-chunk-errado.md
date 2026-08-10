# exports-manifest-pega-chunk-errado

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `vite.config.ts:76-83`

## Problema
O plugin `generateExportsManifest` itera o bundle e faz `break` no **primeiro** chunk com `isEntry`, mas o build é multi-entry (15 entradas). A ordem de iteração fez o chunk `browser` ser capturado em vez do `index`: `dist/exports.json` contém apenas 7 nomes (incluindo `t`, um binding interno minificado) quando a superfície real do `index` tem ~774 exports.

## Decisão de Design Registrada
- Filtrar especificamente o chunk `chunk.name === 'index'` (ou `chunk.fileName === 'index.es.js'`) ao gerar `dist/exports.json`, capturando a superfície total de exports da entrada principal.

## Plano de correção
1. Ajustar o plugin `generateExportsManifest` em `vite.config.ts`.
2. Rebuildar e conferir `dist/exports.json`.

## Testes
- Após `npm run build`, script/asserção de que `exports.json` contém nomes conhecidos (`isCpf`, `formatCurrency`, `apiGetRoute`) e nenhum binding de 1 letra.
