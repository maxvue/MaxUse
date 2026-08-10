# readme-maxuseautoimport-nao-e-funcao

- **Severidade**: alta
- **Tipo**: bug/docs
- **Arquivos**: `README.md:719-743`, `src/Helpers/maxUseItems.ts:56-66`

## Problema
O README e o próprio JSDoc de `maxUseAutoImport` instruem chamar `maxUseAutoImport()` dentro de `AutoImport({ imports: [...] })`, mas o export é uma **constante** (`export const maxUseAutoImport = autoImportData as any;`). Consumidor que segue o README recebe `TypeError: maxUseAutoImport is not a function` no build.

## Decisão de Design Registrada
- Transformar `maxUseAutoImport` em função em `src/Helpers/maxUseItems.ts`: `export const maxUseAutoImport = () => autoImportData;` (e exportar `maxUseAutoImportObject = autoImportData` se necessário), alinhando a lib com o README e a experiência padrão de resolvers do `unplugin-auto-import`.

## Plano de correção
1. Atualizar a exportação de `maxUseAutoImport` para uma função que retorna `autoImportData`.

## Testes
- Teste em `maxUseItems.test.ts` cobrindo a forma de uso documentada (chamável e retorna o shape do JSON).
