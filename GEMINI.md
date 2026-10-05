# MaxUse — GEMINI.md

Este documento fornece as diretrizes canônicas para o Gemini CLI, Google Antigravity e assistentes da família Gemini ao trabalhar com o código deste repositório.

---

## 1. Diretrizes de Idioma

- **Estritamente Português do Brasil (pt-BR)** para: comunicação com o usuário, planejamento, explicações, comentários no código e mensagens de commit.
- **Inglês (en-US)** para: identificadores de código (nomes de funções, variáveis, tipos, interfaces, arquivos e diretórios).

---

## 2. Visão Geral do Projeto

`@maxvue/max-use` é a biblioteca utilitária e de composables oficial do ecossistema Max / Engeapp, desenvolvida em **Vue 3** (Composition API, TypeScript) e distribuída via npm.

- **Objetivo:** Unificar **VueUse + utilitários semânticos no estilo Lodash (sem a dependência `lodash-es`) + helpers reativos brasileiros** (`toValue`) sob uma única dependência tree-shakable.
- **Suporte a Reatividade:** Todas as funções utilitárias que operam sobre valores potencialmente reativos utilizam `toValue()` do Vue 3, aceitando `ref`, `computed`, getters ou primitivos.
- **Domínio Brasileiro:** Inclui validação e formatação de CPF, CNPJ, CEP, telefone e manipulação temporal com fuso horário `America/Sao_Paulo`.

---

## 3. Stack Tecnológica

- **Linguagem:** TypeScript estrito (`strict: true`, ESNext).
- **Frontend / Core:** Vue 3.6 (Composition API exclusiva) e `@vueuse/core`.
- **Bundler:** Vite 8 com `vite-plugin-dts` (distribuição multi-entry em `./dist/*.es.js` e `.d.ts`).
- **Testes Unitários:** Vitest 4 com ambiente `happy-dom`, cobertura v8 e timezone `America/Sao_Paulo`.
- **Linter & Estilo:** ESLint 10 com `@stylistic` (4 espaços, ponto e vírgula, sem trailing commas).
- **CSS:** UnoCSS (`presetMaxUno`).

---

## 4. Arquitetura (18 Submódulos)

O código-fonte reside em `src/` e disponibiliza 18 submódulos em `package.json` (`exports`) e `vite.config.ts`:

1. **`src/Helpers/`** (funções puras por domínio):
   - `Browser/` (`./browser`): detecção de ambiente e manipulação de viewport/clipboard.
   - `Dates/` (`./dates`): cálculos de tempo, comparações e formatação pt-BR (`America/Sao_Paulo`).
   - `Electrical/` (`./electrical`): dimensionamento elétrico alimentado por tabelas em `src/json/*.json`.
   - `Format/` (`./format`): formatação monetária (BRL), percentual e numérica.
   - `Functions/` (`./functions`): helpers de controle de execução (`debounce`, `throttle`, currying).
   - `Iterables/` (`./iterables`): manipulação funcional de arrays e matrizes (`chunk`, `compact`, `uniqBy`).
   - `Lang/` (`./lang`): checagem de tipos e comparação profunda (`isEqual`, `isNil`, `cloneDeep`).
   - `Locales/`: configurações e dados de internacionalização.
   - `Math/` (`./math`): utilitários numéricos, clamping e arredondamentos precisos.
   - `Objects/` (`./objects`): manipulação de propriedades e caminhos profundos (`get`, `set`, `omit`, `pick`).
   - `Seq/` (`./seq`): composição de cadeias e pipelines funcionais.
   - `Strings/` (`./strings`): manipulação, slugify, máscaras e dados sensíveis.
   - `Types/` (`./types`): tipos TypeScript compartilhados e type guards.
   - `Utils/` (`./utils`): utilitários gerais (`uniqueId`, ranges, fallbacks).
   - `Validations/` (`./validations`): validações formais (CPF, CNPJ, CEP, telefone, cartões).
   - `VueUse/` (`./vueuse` e `./vueUseCore`): re-exports curados do `@vueuse/core`.
2. **`src/Composables/`** (`./composables`):
   - Composables reativos (`useRefCached`, `useRefCachedApi`, `useTimeAgo`, `useDateFormat`, `watchTrue`, `useDefaultReset`).
3. **`src/Routes/`** (`./routes`):
   - Cliente HTTP agnóstico de rotas nomeadas (Ziggy/Laravel/Adonis) com suporte a cache em `localStorage` e `IndexedDB`.
4. **Objeto Central `_` e Auto-Import:**
   - `src/index.ts` monta a exportação plana e o namespace `_`. Helpers próprios têm prioridade sobre VueUse.
   - `src/Helpers/autoImportData.json` é um arquivo **gerado**. Nunca edite à mão; utilize `npm run prebuild`.

---

## 5. Convenções de Código

- **Indentação:** 4 espaços em TypeScript, JavaScript e Vue.
- **Estilo:** Aspas simples (`'`), ponto e vírgula obrigatório (`;`), **sem vírgula final** (`comma-dangle: never`).
- **Condicionais Curtas (`curly: multi`):** Corpo em instrução única permanece na mesma linha: `if (cond) return valor;`.
- **SFC Vue:** Ordem estrutural 1º `<template>`, 2º `<script setup lang="ts">`, 3º `<style lang="scss">`.

---

## 6. Comandos e Testes

```bash
npm run build          # Executa prebuild (auto-import) → vue-tsc → vite build
npm run type-check     # Validação de tipos com vue-tsc (--noEmit)
npm run typecheck:tsgo # Checagem estática ultrarrápida via tsgo
npm run lint           # Linter e formatação automática (ESLint)
npm test               # Executa os 400+ arquivos de teste unitário com Vitest
npm run test:types     # Valida testes de tipos com expectTypeOf (--typecheck.only)
npm run test:all       # Executa testes unitários seguidos de testes de tipo
npm run test:coverage  # Relatório de cobertura de testes (v8)
npm run dev:playground # Inicia o servidor Vite do playground para testes manuais
```

> [!IMPORTANT]
> Testes de data são sensíveis ao fuso horário. `vitest.config.ts` já configura automaticamente `TZ: 'America/Sao_Paulo'`.

---

## 7. Diretrizes de Execução em Git Worktree

1. **Modificações Obrigatórias em Worktree Isolado:**
   - Toda e qualquer alteração de arquivos no repositório deve ocorrer em um **git worktree separado**.
   - **Gemini CLI / Terminal:** Utilize `.worktrees/<nome-da-branch>`.
   - **MaxCode:** Opera automaticamente sob `.max-code-worktrees/wt-<id>`.
   - É proibido editar diretamente na branch principal (`dev`/`main`) ou na raiz do repositório.
2. **Fluxo de Planejamento e Aprovação:**
   - Sempre apresente um plano de execução detalhado e aguarde a aprovação do usuário antes de realizar alterações.
   - Commits, merges e pushes são exclusivos do usuário. O agente nunca executa `git commit` sem solicitação explícita.
