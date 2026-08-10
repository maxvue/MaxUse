# readme-maxuseautoimport-nao-e-funcao

- **Severidade**: alta
- **Tipo**: bug/docs
- **Arquivos**: `README.md:719-743`, `src/Helpers/maxUseItems.ts:56-66`

## Problema
O README e o próprio JSDoc de `maxUseAutoImport` instruem chamar `maxUseAutoImport()` dentro de `AutoImport({ imports: [...] })`, mas o export é uma **constante** (`export const maxUseAutoImport = autoImportData as any;`). Consumidor que segue o README recebe `TypeError: maxUseAutoImport is not a function` no build.

## Plano de correção
Escolher uma:
1. Transformar em função: `export const maxUseAutoImport = () => autoImportData;` (mantém compat com o README já publicado) — **preferível**; ou
2. Corrigir README/JSDoc para usar sem parênteses.
Além disso: remover o `as any` tipando o retorno adequadamente.

## Testes
- Teste em `maxUseItems.test.ts` cobrindo a forma de uso documentada (chamável e retorna o shape do JSON).
