# eslint-sem-ignores-para-dist

- **Severidade**: média
- **Tipo**: infra
- **Arquivo**: `eslint.config.js`

## Problema
O flat config não tem bloco `ignores`. `npm run lint` = `eslint . --fix` com `files: ['**/*.{ts,js,mts,vue}']` — isso linta (e **auto-corrige**) `dist/*.es.js`, `coverage/`, `playground/` e `src/Helpers/Locales/*.js` (bundles gerados), podendo reescrever artefatos de build, além de ser lento. Flat config não lê `.eslintignore`/`.npmignore`.

## Plano de correção
1. Adicionar como primeiro item do array: `{ ignores: ['dist/**', 'coverage/**', 'src/Helpers/Locales/**'] }` (avaliar `playground/**` também).

## Testes
- `npm run lint` seguido de `git status` limpo em `dist/`.
