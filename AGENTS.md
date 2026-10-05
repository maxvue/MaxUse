# MaxUse — AGENTS.md

Este documento fornece as diretrizes canônicas para agentes de IA (Cursor, OpenCode, MaxCode, Codex, Gemini, Claude) ao trabalhar com o código deste repositório.

---

## 1. Diretrizes de Idioma

- **Português do Brasil (pt-BR)** para: comunicação com o usuário, planejamento, comentários de código, documentação e mensagens de commit.
- **Inglês (en-US)** para: identificadores de código (funções, variáveis, tipos, interfaces, classes, arquivos e diretórios).

---

## 2. Visão Geral do Projeto

`@maxvue/max-use` é uma biblioteca utilitária e de composables para **Vue 3** (distribuída via npm), que unifica em uma única dependência **VueUse + reimplementação moderna do Lodash (sem a dependência `lodash-es`) + helpers reativos brasileiros** (`toValue`).

- **Foco principal:** Aplicações Vue 3 com TypeScript, ecossistema brasileiro (validação e formatação de CPF/CNPJ/CEP/telefone, fuso `America/Sao_Paulo`) e integração com backends Laravel/Adonis via rotas nomeadas.
- **Reatividade nativa:** Funções e composables aceitam refs, getters ou valores primitivos através de `toValue`.

---

## 3. Stack Tecnológica

- **Linguagem:** TypeScript estrito (`strict: true`, ESNext, `target: ESNext`).
- **Core:** Vue 3.6 (Composition API exclusiva) e `@vueuse/core`.
- **Build:** Vite 8 com `vite-plugin-dts` (geração de bundles ES multi-entry em `./dist/` e declarações de tipos).
- **Testes:** Vitest 4 com ambiente `happy-dom`, cobertura v8 e fuso `TZ: America/Sao_Paulo`.
- **Qualidade & Lint:** ESLint 10 com plugins `@stylistic` e `typescript-eslint`.
- **CSS / Utilitários:** UnoCSS com preset corporativo `presetMaxUno`.

---

## 4. Arquitetura e Módulos

O código-fonte reside em `src/` e é distribuído através de **18 submódulos** (`exports` no `package.json` e entradas no `vite.config.ts`):

### 4.1 Áreas de Código em `src/`
1. **`src/Helpers/`** — Funções puras organizadas por domínio:
   - `Browser/` (`./browser`): Detecção de ambiente, manipuladores de viewport e clipboard.
   - `Dates/` (`./dates`): Operações temporais, cálculos e formatação pt-BR com timezone São Paulo.
   - `Electrical/` (`./electrical`): Dimensionamento e tabelas elétricas carregadas de `src/json/*.json`.
   - `Format/` (`./format`): Máscaras e formatação monetária (BRL), percentual e numérica.
   - `Functions/` (`./functions`): Reimplementação tipada de helpers de função (`debounce`, `throttle`, etc.).
   - `Iterables/` (`./iterables`): Utilitários para arrays, coleções e matrizes (`chunk`, `compact`, etc.).
   - `Lang/` (`./lang`): Verificações de tipo e comparadores (`isEqual`, `isNil`, `cloneDeep`, etc.).
   - `Locales/`: Configurações de localização e internacionalização.
   - `Math/` (`./math`): Cálculos matemáticos, clamp e arredondamentos.
   - `Objects/` (`./objects`): Manipulação segura de objetos e caminhos (`get`, `set`, `omit`, `pick`).
   - `Seq/` (`./seq`): Encadeamento e operações sequenciais de fluxo de dados.
   - `Strings/` (`./strings`): Formatação, máscaras e transformações de texto (slug, case, máscaras sensíveis).
   - `Types/` (`./types`): Tipos TypeScript utilitários e guards em tempo de execução.
   - `Utils/` (`./utils`): Utilitários gerais (`uniqueId`, ranges, fallbacks).
   - `Validations/` (`./validations`): Validações brasileiras (CPF, CNPJ, CEP, telefone, cartões).
   - `VueUse/` (`./vueuse` e `./vueUseCore`): Re-exports selecionados do `@vueuse/core`.
2. **`src/Composables/`** (`./composables`) — Composables reativos:
   - `useRefCached`, `useRefCachedApi`, `useTimeAgo`, `useDateFormat`, `watchTrue`, `useDefaultReset`.
3. **`src/Routes/`** (`./routes`) — Camada HTTP agnóstica para rotas nomeadas (Ziggy/Laravel/Adonis):
   - Singletons em `src/Routes/config.ts`: `setRouteResolver`, `setApiRequestConfig`, `resetConfig`.
   - Clientes com cache em memória, `localStorage` (`getCachedApi`) e IndexedDB (`getCachedApiIDB`, `postCachedApiIDB`).

### 4.2 Objeto Centralizador `_` e Resolução de Ambiguidade
- O ponto de entrada principal (`src/index.ts`) exporta tudo de forma plana (named imports) e também unifica as funções em um objeto global `_` (espelhando a convenção do Lodash).
- **Regra de colisão:** Funções próprias (`ownHelpers`) sempre sobrepõem re-exports do VueUse em caso de conflito de nomes.
- Conflitos e ambiguidades são resolvidos explicitamente via `export { ... }` ao fim de `src/index.ts`.

### 4.3 Auto-Import (`unplugin-auto-import`)
- O arquivo `src/Helpers/autoImportData.json` é **gerado automaticamente** pelo script `src/scripts/buildAutoImport.ts`.
- **Nunca edite `autoImportData.json` manualmente.** Ao adicionar novos helpers, exporte-os no `index.ts` de sua categoria e execute `npm run prebuild`.

---

## 5. Convenções Estritas de Código

- **Indentação:** 4 espaços em todos os arquivos (`.ts`, `.js`, `.vue`).
- **Pontuação:** Aspas simples (`'`), ponto e vírgula obrigatório (`;`), **sem vírgula final** em arrays/objetos (`comma-dangle: never`).
- **Condicionais Curtas (`curly: multi`):** Condicionais de instrução única devem ficar na **mesma linha** sem chaves: `if (condicao) return valor;`.
- **Vue SFC (em playgrounds ou exemplos):**
  - Ordem obrigatória de blocos: 1º `<template>`, 2º `<script setup lang="ts">`, 3º `<style lang="scss">`.
  - Exclusivamente Composition API com TypeScript tipado estritamente.

---

## 6. Comandos do Projeto

```bash
npm run build          # prebuild (atualiza auto-import) → vue-tsc → vite build
npm run type-check     # Validação estática de tipos com vue-tsc (--noEmit)
npm run typecheck:tsgo # Checagem ultra-rápida de tipos via tsgo
npm run lint           # Validação e correção automática de estilo (ESLint)
npm test               # Executa vitest em todos os testes unitários (*.test.ts)
npm run test:types     # Valida asserções de tipo expectTypeOf (--typecheck.only)
npm run test:all       # Executa testes de runtime seguidos dos testes de tipo
npm run test:coverage  # Relatório de cobertura de código (v8)
npm run test:watch     # Modo interativo do vitest
npm run test:ui        # Interface gráfica do vitest
npm run dev:playground # Executa o playground Vite para testes manuais
```

> [!NOTE]
> Os testes de data exigem o fuso horário `America/Sao_Paulo`. O Vitest já injeta `env: { TZ: 'America/Sao_Paulo' }` automaticamente via `vitest.config.ts`.

---

## 7. Diretrizes de Execução em Git Worktree

1. **Isolamento Obrigatório:**
   - No **MaxCode (VSCode):** A extensão orquestra e executa o agente automaticamente em `.max-code-worktrees/wt-<id>`.
   - No **Gemini CLI / Terminal / Outros Agentes:** Toda modificação deve ser executada dentro de uma worktree dedicada em `.worktrees/<nome-da-branch>`, criada a partir de `dev`.
   - É proibido editar arquivos diretamente na árvore principal de trabalho.
2. **Governança de Commits:**
   - O agente **nunca** realiza `git commit`, `git merge`, `git push` ou exclusão de worktrees sem instrução ou confirmação explícita do usuário.
