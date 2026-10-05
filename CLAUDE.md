# MaxUse — CLAUDE.md

Este documento é a fonte canônica para Claude, Gemini/Antigravity, Codex, OpenCode e demais agentes. AGENTS.md e GEMINI.md apontam para esta mesma fonte.

---

## 1. Diretrizes de Idioma

- **Português do Brasil (pt-BR)** para: comunicação com o usuário, planejamento, comentários de código e mensagens de commit.
- **Inglês (en-US)** para: identificadores de código (nomes de funções, variáveis, tipos, interfaces, arquivos e diretórios).

---

## 2. Visão Geral do Projeto

`@maxvue/max-use` é uma biblioteca utilitária e de composables para **Vue 3** (publicada no npm) que unifica **VueUse + reimplementação moderna do Lodash (sem dependência do `lodash-es`) + helpers reativos brasileiros** (`toValue`).

- **Foco de Mercado:** Projetos Vue 3 e ecossistema brasileiro (validações e formatações de CPF, CNPJ, CEP, telefone e manipulação temporal com fuso `America/Sao_Paulo`) com integração de rotas nomeadas com backends Laravel/Adonis.
- **Reatividade com `toValue`:** Funções utilitárias e composables recebem indistintamente refs, computeds, getters ou valores primitivos.

---

## 3. Comandos do Projeto

```bash
npm run build          # prebuild (atualiza auto-import) → vue-tsc → vite build
npm run type-check     # vue-tsc --noEmit
npm run typecheck:tsgo # Checagem estática ultrarrápida via tsgo
npm run lint           # eslint . --fix
npm test               # vitest run (executa todos os *.test.ts)
npm run test:types     # vitest run --typecheck.only (avalia asserções expectTypeOf)
npm run test:all       # vitest run seguido de testes de tipo
npm run test:ui        # Interface gráfica do Vitest
npm run test:watch     # vitest em modo watch
npm run test:coverage  # vitest run --coverage (cobertura v8)
npm run dev:playground # Inicia o dev server Vite do ./playground para testes manuais
```

Executar arquivo de teste específico ou filtrar por nome:
```bash
npx vitest run src/Helpers/Validations/documents.test.ts
npx vitest run -t 'isCpf'
```

> [!NOTE]
> `npm run release` gera build, incrementa patch version, sobe tags no git e publica no npm — **execute somente se explicitamente solicitado pelo usuário**.

---

## 4. Arquitetura e Módulos

### 4.1 Exportações Modulares e Objeto Central `_`
- A API pública é reunida em `src/index.ts`. Cada função é exportada de forma plana para named imports (`import { isCpf } from '@maxvue/max-use'`) e também agregada no objeto `_` (espelhando a convenção do Lodash).
- **Prioridade em colisões:** Funções próprias (`ownHelpers`) sobrepõem as do VueUse quando houver colisão de nomes.
- Resolução de ambiguidades (`now`, `get`/`set`, `isObject`, `useTimeAgo`) é tratada explicitamente ao final de `src/index.ts`.

### 4.2 As Três Áreas de Código-Fonte em `src/`
- **`Helpers/`** — Funções puras organizadas em 16 categorias:
  - `Browser`, `Dates`, `Electrical`, `Format`, `Functions`, `Iterables`, `Lang`, `Locales`, `Math`, `Objects`, `Seq`, `Strings`, `Types`, `Utils`, `Validations`, `VueUse`.
- **`Composables/`** — Composables reativos:
  - `useRefCached`, `useRefCachedApi`, `useTimeAgo`, `useDateFormat`, `watchTrue`, `useDefaultReset`.
- **`Routes/`** — Camada HTTP agnóstica para rotas nomeadas:
  - Singletons de configuração em `src/Routes/config.ts`: `setRouteResolver`, `setApiRequestConfig`, `resetConfig`.
  - Helpers com cache: `getCachedApi` (`localStorage`), `getCachedApiIDB` e `postCachedApiIDB` (`IndexedDB`).

### 4.3 Multi-entry Library Build e Auto-Import
- `vite.config.ts` declara entradas Rollup para cada um dos 18 submódulos em ES format (`./dist/*.es.js` + `.d.ts`), mapeados no `exports` do `package.json`.
- `unplugin-auto-import` é alimentado por `src/Helpers/autoImportData.json` (arquivo gerado pelo script `src/scripts/buildAutoImport.ts` no `prebuild`). Nunca altere o JSON manualmente.

---

## 5. Convenções de Código

- **Indentação e Estilo:** 4 espaços, aspas simples, ponto e vírgula obrigatório, **sem vírgula final** (`comma-dangle: never`).
- **Condicionais Curtas (`curly: multi`):** Instruções condicionais únicas devem permanecer na **mesma linha**: `if (cond) return valor;`.
- **Componentes Vue (Playground/Exemplos):** Ordem estrita: 1º `<template>`, 2º `<script setup lang="ts">`, 3º `<style lang="scss">`.
- **Ambiente de Testes:** Vitest com `happy-dom`, `globals: true` e `TZ: 'America/Sao_Paulo'`. `tsconfig.json` exclui arquivos de teste da checagem padrão; testes de tipo rodam isolados com `tsconfig.test.json` via `npm run test:types`.

---

## 6. Diretrizes de Execução em Git Worktree

1. **Isolamento Obrigatório:**
   - **No MaxCode (VSCode):** A execução opera automaticamente em um git worktree dedicado gerenciado pela extensão sob `.max-code-worktrees/wt-<id>`.
   - **Fora do MaxCode (CLI manual / Terminal):** Toda alteração deve ocorrer em um worktree temporário sob `.worktrees/<nome-da-branch>`, derivado de `dev`.
   - É proibido realizar modificações diretamente na raiz do repositório ou na branch principal.
2. **Governança de Commits:**
   - O agente **NUNCA** executa `git commit`, `git merge`, `git push` ou exclusão de worktrees por conta própria. Toda integração aguarda aprovação explícita do usuário.


## Execução e validação em lote

- Implemente todo o bloco autorizado e seus testes antes de executar validações. Depois, valide o conjunto, corrija falhas em lote e revalide após concluir as correções. Não execute testes, tipos ou builds após cada microedição.
- Leia diretrizes na primeira admissão e consulte trechos necessários nas retomadas. Preserve decisões e autorização já concedidas; peça nova decisão somente para ampliação de escopo ou ambiguidade relevante.
- Comandos agregados já executam suas etapas: não repita testes, tipos, lint ou build sobre a mesma revisão sem mudança relevante, falha ou dúvida concreta.
- Preserve asserções, regressões, revisão final e gates de segurança/release. Falhas persistentes exigem diagnóstico; não amplie o escopo para corrigir baseline sem estabelecer causalidade e autorização.
- Informe progresso e limitações, sem segredos ou conclusão verde com verificações falhando/pendentes. Este fluxo não autoriza publicação, deploy ou integração Git.


## Contexto compartilhado dos harnesses

- CSS/utilitários: UnoCSS com o preset corporativo `presetMaxUno`, preservando os contratos de estilo do ecossistema.
- TypeScript estrito, Vue Composition API, Vite multi-entry, Vitest/happy-dom e ESLint são a base. Confira versões no package/lockfile quando relevantes; descrições históricas não substituem contratos instalados.
- Testes temporais usam `TZ: America/Sao_Paulo`, configurado no Vitest. Preserve a checagem isolada dos testes de tipos, pois o tsconfig principal exclui testes.
- Preserve categorias Helpers/Composables/Routes, named exports, namespace `_`, aliases e prioridade dos helpers próprios sobre VueUse.
- Ao acrescentar helper, atualize exports da categoria e gere auto-import conforme o contrato. `npm run build` já executa o hook `prebuild`; não execute `prebuild` isolado novamente no mesmo lote sem mudança dos exports ou necessidade concreta. Nunca edite o JSON gerado à mão.
- Planejamento/autorização já concedidos valem para o bloco aprovado em todos os harnesses. Peça aprovação somente para novas decisões/escopo; não reinicie a entrevista na troca de agente.
