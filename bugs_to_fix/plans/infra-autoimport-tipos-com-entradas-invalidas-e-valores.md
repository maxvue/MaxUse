# autoimport-tipos-com-entradas-invalidas-e-valores

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/scripts/buildAutoImport.ts:88-98,118`

## Problema
O parser do `.d.ts` do VueUse (regex no último bloco `export { ... }`) tem dois defeitos:
(a) não trata aliases nem o modificador `type` — gera entradas inválidas no `autoImportData.json` como `"ResizeObserverCallback$1 as ResizeObserverCallback"` e `"type MultiWatchSources"`, que produzem `import type {...}` quebrado no consumidor;
(b) o filtro de "o que é valor" usa `Object.keys` do módulo **curado** (`Helpers/VueUse`), então 54 valores reais do `@vueuse/core`/shared são classificados como tipos (`useStorage`, `templateRef`, `isClient`, ...), com 8 duplicados entre as listas de valores e tipos.

## Plano de correção
1. No parse, remover prefixo `type ` e resolver aliases pegando o lado direito do `as`.
2. Filtrar valores usando `Object.keys(await import('@vueuse/core'))` (o pacote real), não o módulo curado.
3. Remover da lista de tipos qualquer nome já presente em `items`.
4. Rodar `npm run prebuild` e commitar o JSON regenerado.

## Testes
- Asserção no script (ou teste) de que nenhuma entrada de tipo contém espaço e de que não há interseção entre valores e tipos.
