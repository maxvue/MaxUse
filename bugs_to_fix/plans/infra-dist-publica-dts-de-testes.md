# dist-publica-dts-de-testes

- **Severidade**: média
- **Tipo**: infra
- **Arquivos**: `tsconfig.json:2-3`, `vite.config.ts:12`

## Problema
`tsconfig.json` exclui apenas `src/**/__tests__/*`, mas os testes são colocados como `*.test.ts` — logo o `vite-plugin-dts` gera e o npm publica (`files: ["dist"]`) declarações de teste: `dist/Routes/apiGetRoute.test.d.ts`, `dist/Helpers/Browser/getColorFromVar.test.d.ts` (+ `.map`) existem no dist atual.

## Plano de correção
1. Adicionar `"src/**/*.test.ts"` ao `exclude` do tsconfig **ou** passar `exclude: ['src/**/*.test.ts']` na opção do plugin `dts`.
2. Coordenar com [infra-tsconfig-include-scripts-fantasma-e-exclude-tests-errado](infra-tsconfig-include-scripts-fantasma-e-exclude-tests-errado.md).

## Testes
- Rebuildar e verificar `find dist -name '*.test.d.ts'` vazio.
