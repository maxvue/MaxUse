# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Diretrizes de Idioma

1. **Usar Português do Brasil (pt-BR) para:**
   - Comunicação entre Usuário <=> Agente de IA
   - Comentários no Código (comentários em inglês devem ser substituídos por comentários em português do Brasil)

2. **Usar Inglês (en-US) para:**
   - Nomes de funções
   - Nomes de variáveis
   - Nomes de tabelas do banco de dados
   - Nomes de colunas do banco de dados

## Project Overview

`@maxvue/max-use` is a tree-shakable Vue 3 utility library (published to npm) that unifies **VueUse + Lodash + custom helpers** behind a single dependency. It targets the Brazilian market (CPF/CNPJ/CEP/phone validations, pt-BR formatting) and Laravel/Adonis + Vue projects (named-route HTTP helpers). Source is TypeScript; comments and docs are in Portuguese.

## Commands

```bash
npm run build          # prebuild (regen auto-import data) → vue-tsc typecheck → vite lib build
npm run type-check     # vue-tsc --noEmit
npm run lint           # eslint . --fix
npm test               # vitest run (all *.test.ts)
npm run test:watch     # vitest watch mode
npm run test:coverage  # vitest run --coverage (v8)
npm run dev:playground # vite dev server against ./playground for manual testing
```

Run a single test file or filter by name:

```bash
npx vitest run src/Helpers/Validations/documents.test.ts
npx vitest run -t 'isCpf'
```

`npm run release` builds, bumps the patch version, pushes tags, and publishes — only run when explicitly asked to publish.

## Architecture

### Modular exports with a central `_` object
The public API is assembled in [src/index.ts](src/index.ts). Everything is re-exported flat for named imports (`import { isCpf } from '@maxvue/max-use'`), **and** merged into a single `_` object mirroring Lodash's convention. The `_` object has a strict precedence when names collide: **own helpers > VueUse > Lodash** (VueUse and Lodash keys are filtered out if a name already exists higher in the chain). When adding a helper whose name might clash, be aware it will shadow the VueUse/Lodash version inside `_`.

Ambiguity between modules (e.g. `now`, `get`/`set`, `isObject`, `useTimeAgo`) is resolved with explicit `export { ... }` lines near the bottom of `index.ts` — add to that list if you introduce a name exported by more than one module.

### Three top-level source areas under `src/`
- **`Helpers/`** — pure functions grouped by domain: `Browser`, `Dates`, `Electrical`, `Format`, `Iterables`, `Math`, `Objects`, `Strings`, `Types`, `Validations`, plus `VueUse` (curated re-exports) and `Locales`.
- **`Composables/`** — reactive Vue composables (`useRefCached`, `useRefCachedApi`, `useTimeAgo`, `useDateFormat`, `watchTrue`, `useDefaultReset`).
- **`Routes/`** — framework-agnostic named-route HTTP helpers (see below).

### Helper category convention
Each `Helpers/<Category>/` folder has an `index.ts` that (1) re-exports every function flat and (2) builds a namespace object aggregating them (e.g. `Validations/index.ts` exports both the individual functions and a `validate` object). Follow this pattern for new categories, and register the new category in **all three** aggregation points: [src/index.ts](src/index.ts), [src/Helpers/maxUseItems.ts](src/Helpers/maxUseItems.ts), and [src/scripts/buildAutoImport.ts](src/scripts/buildAutoImport.ts).

### Multi-entry library build
[vite.config.ts](vite.config.ts) declares one Rollup entry per subpath export (`browser`, `dates`, `math`, `routes`, etc.), ES format only, minify off, sourcemaps on. Each entry maps to a `./dist/*.es.js` + `.d.ts` pair listed under `exports` in [package.json](package.json) (e.g. `@maxvue/max-use/validations`). **Adding a new subpath export requires editing both** the `build.lib.entry` map in vite.config.ts and the `exports` map in package.json. Vue and all runtime `dependencies`/`peerDependencies` are externalized. A custom `generateExportsManifest` plugin emits `dist/exports.json` listing the public API surface.

### Auto-import generation (prebuild step)
`unplugin-auto-import` support is powered by [src/Helpers/autoImportData.json](src/Helpers/autoImportData.json), a **generated file**. The `prebuild` script runs `tsx src/scripts/buildAutoImport.ts`, which imports every module, collects export names (plus VueUse *type* names parsed out of `@vueuse/core`'s `.d.ts`), and rewrites that JSON. Consumers load it via `maxUseAutoImport`. Do not hand-edit `autoImportData.json` — change the source module and rebuild.

### Routes module (framework-agnostic HTTP)
[src/Routes/config.ts](src/Routes/config.ts) holds module-level singletons configured once at app startup:
- `setRouteResolver((name, params) => url | null)` — bridges to Ziggy/Laravel or any named-route system. Internal helpers (`resolveRoute`, `hasRoute`) throw/return based on it.
- `setApiRequestConfig({ headers, withCredentials })` — global headers (values may be functions resolved per-request, e.g. `Authorization`) and cookie behavior for mutating requests.
- `resetConfig()` — `@internal`, used to reset singletons between tests.

`apiRoute` is the base used by `apiGetRoute`/`apiPostRoute`/`apiPutRoute`/`apiDeleteRoute`/`apiUploadRoute`. Cached variants (`getCachedApi`, `getCachedApiIDB`, `postCachedApiIDB`) use `localforage` for IndexedDB caching. Because config is global singletons, tests must call `resetConfig()` in setup/teardown.

### Data-driven helpers
`Helpers/Electrical/wireSize.ts` reads lookup tables from `src/json/*.json` (electrical wire-sizing tables like `al-70-bi-a1.json`). `resolveJsonModule` is enabled; these JSON files are bundled, not external.

## Conventions

- **Tests are colocated** as `<name>.test.ts` next to source; vitest runs with `globals: true` and the `happy-dom` environment. `index.ts` files, `scripts/`, `json/`, and the VueUse/Locales re-export folders are excluded from coverage.
- **ESLint style** (enforced, [eslint.config.js](eslint.config.js)): 4-space indent, single quotes, semicolons required, **no trailing commas**, `curly: multi` (single-statement bodies inline without braces — this codebase heavily uses `if (cond) return x;` on one line). Run `npm run lint` before finishing.
- New public functions must be reachable from their category `index.ts` to appear in the flat exports, the `_` object, and auto-import data.

## Agent Execution in Worktrees

- Any agent/subagent execution that proposes code changes in this repository must run in a **separate git worktree**, created specifically for the proposed changes inside the hidden `.worktrees/` folder at the project root (`git worktree add .worktrees/wt-<slug> -b <slug>`) — never directly in the main working tree. The `.worktrees/` folder is ignored by Git (`.gitignore`).
- Validate the changes in the isolated worktree, then integrate (merge) into the main branch.
