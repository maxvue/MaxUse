# exports-manifest-pega-chunk-errado

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `vite.config.ts:76-83`

## Problema
O plugin `generateExportsManifest` itera o bundle e faz `break` no **primeiro** chunk com `isEntry`, mas o build é multi-entry (15 entradas). A ordem de iteração fez o chunk `browser` ser capturado em vez do `index`: `dist/exports.json` contém apenas 7 nomes (incluindo `t`, um binding interno minificado) quando a superfície real do `index` tem ~774 exports.

## Plano de correção
1. Selecionar o chunk cujo `chunk.name === 'index'` (ou `fileName === 'index.es.js'`) em vez do primeiro `isEntry`.
2. Opcional: emitir manifesto por entrada (`{ index: [...], browser: [...] }`).
3. Rebuildar e conferir que `dist/exports.json` lista a superfície completa.

## Testes
- Após `npm run build`, script/asserção de que `exports.json` contém nomes conhecidos (`isCpf`, `formatCurrency`, `apiGetRoute`) e nenhum binding de 1 letra.
