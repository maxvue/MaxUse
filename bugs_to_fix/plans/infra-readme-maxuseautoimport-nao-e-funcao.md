# readme-maxuseautoimport-nao-e-funcao

- **Severidade**: alta
- **Tipo**: bug/docs
- **Arquivos**: `README.md:719-743`, `src/Helpers/maxUseItems.ts:56-66`

## Problema
O README e o próprio JSDoc de `maxUseAutoImport` instruem chamar `maxUseAutoImport()` dentro de `AutoImport({ imports: [...] })`, mas o export é uma **constante** (`export const maxUseAutoImport = autoImportData as any;`). Consumidor que segue o README recebe `TypeError: maxUseAutoImport is not a function` no build.

## Decisão de Design Registrada (REVISADA)

A primeira decisão foi transformar `maxUseAutoImport` em função (`() => autoImportData`) para casar com o README. **Isso foi revertido**: quebrou os consumidores em produção, que já usavam o formato de array (`imports: [...maxUseAutoImport]`). Com a função no lugar do array, o `unplugin-auto-import` descartava o preset silenciosamente e nenhum helper era injetado — o app estourava `ReferenceError: snakeCase is not defined` em runtime, no primeiro uso.

Decisão final: **manter `maxUseAutoImport` como a constante** (array de presets) e **corrigir o README/JSDoc**, que é onde estava o erro real. O `as any` foi removido junto.

```ts
export const maxUseAutoImport = autoImportData;
// consumo: AutoImport({ imports: [...maxUseAutoImport] })
```

## Plano de correção
1. `src/Helpers/maxUseItems.ts`: exportar a constante (sem `as any`) e corrigir o `@example` do JSDoc para o spread.
2. `README.md`: trocar `maxUseAutoImport(),` por `...maxUseAutoImport,` e ajustar o parágrafo explicativo.
3. `src/Helpers/maxUseItems.test.ts`: substituir os testes que exigiam função.

## Testes
- `maxUseAutoImport` é array, **não** função.
- Sobrevive ao spread `[...maxUseAutoImport]` usado no vite.config do consumidor.
- Todos os itens de `maxUseItems()` estão na lista.
- Regressão do bug reportado: `snakeCase`, `camelCase` e `kebabCase` presentes na lista de auto-import.
