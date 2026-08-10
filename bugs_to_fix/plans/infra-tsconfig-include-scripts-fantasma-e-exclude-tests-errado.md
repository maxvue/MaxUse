# tsconfig-include-scripts-fantasma-e-exclude-tests-errado

- **Severidade**: baixa
- **Tipo**: infra
- **Arquivo**: `tsconfig.json:2-3`

## Problema
`include` lista `"scripts"`, mas não existe pasta `scripts/` na raiz (os scripts estão em `src/scripts`, já cobertos por `src/**/*`); `exclude` lista `src/**/__tests__/*`, padrão que não casa com nenhum arquivo (testes são colocados). Ambos são no-ops que mascaram a intenção real (ver [infra-dist-publica-dts-de-testes](infra-dist-publica-dts-de-testes.md)).

## Plano de correção
1. Remover `"scripts"` do include.
2. Trocar o exclude por `"src/**/*.test.ts"`.

## Testes
- `npm run type-check` e `npm run build` continuam passando; dist sem `.test.d.ts`.
