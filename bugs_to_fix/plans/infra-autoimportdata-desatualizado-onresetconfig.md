# autoimportdata-desatualizado-onresetconfig

- **Severidade**: média
- **Tipo**: infra
- **Arquivo**: `src/Helpers/autoImportData.json`

## Problema
O JSON gerado está desatualizado: falta `onResetConfig` (adicionado em `src/Routes/config.ts` no commit `8d729c0a`, posterior à última regeneração). Verificado por script que importa todos os módulos como faz `buildAutoImport.ts`: faltando `["onResetConfig"]`.

## Plano de correção
1. Rodar `npm run prebuild` (idealmente após corrigir [infra-autoimport-tipos-com-entradas-invalidas-e-valores](infra-autoimport-tipos-com-entradas-invalidas-e-valores.md)) e commitar o JSON.
2. Adicionar teste em `maxUseItems.test.ts` comparando os exports reais com o conteúdo do JSON — hoje o teste só valida amostras e não pega staleness.

## Testes
- Teste de sincronia: conjunto de exports de `src/index.ts` (menos `_`/`vueUse`) ⊆ itens do JSON.
