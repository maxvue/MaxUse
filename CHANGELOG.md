# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-09-28

### Added
- **`useSpellChecker` Documentation & Exports:** Fully documented real-time reactive spell checking composable with Levenshtein distance, custom dictionaries, and specialized solar/electrical engineering terminology.
- **Route Options Export:** Exported `ApiRouteOptions` in `@maxvue/max-use/routes` barrel.
- **IndexedDB Routes:** Documented `getCachedApiIDB` and `postCachedApiIDB` with *Stale-While-Revalidate* cache strategies.
- **Extended REST APIs:** Documented `apiPutRoute`, `apiDeleteRoute`, and `apiUploadRoute` (multipart with upload progress).
- **International Documentation:** Added canonical English `README.md` and synchronized `README.pt-BR.md`.
- **Governance:** Added `CONTRIBUTING.md`, `SECURITY.md`, and `.env.example`.
- **Peer Dependencies:** Made `vue-router` optional via `peerDependenciesMeta` and broadened version support to `^4.0.0 || ^5.0.0`.

### Fixed
- **Route Resolver Runtime Exception:** Clarified mandatory `setRouteResolver(...)` invocation in routes initialization.
- **`wireSize` Signature:** Corrected README documentation to reflect that `wireSize` is `async` and accepts `(current, options)`.
- **`orderByWithKey` Signature:** Fixed documentation to show 4 parameters and return type `Record<string, T>`.
- **`isDate` TypeScript Union:** Added `Date` instance support to `RefString` type definition.
- **Spell Checker Typo:** Corrected dictionary entry for `'rápida'`.

---

## [2.0.0] - 2026-08-10

### Changed
- **Zero Lodash Dependency:** Replaced `lodash-es` with native, 100% typed TypeScript implementations of collection, math, object, and function utilities.
- **Unified Reactive Hub (`_`):** The `_` symbol is now an object aggregating native MaxUse helpers and VueUse composables. It is no longer callable directly.
- **Dedicated Placeholder Symbol:** Replaced Lodash `_` placeholder in currying/partial evaluation with an explicit `placeholder` symbol (`Symbol('placeholder')`).
- **Coercive Summation (`sum`, `sumBy`):** Numbers as strings are coerced and non-numeric values fall back to `0`. `NaN` is never returned.
- **Vue Reactivity Native Support:** Helpers and composables accept `MaybeRefOrGetter` inputs, automatically unwrapping values reactively.
- **Tree-Shaking & Submodules:** Added granular submodule exports (`@maxvue/max-use/browser`, `/dates`, `/electrical`, `/format`, `/functions`, `/iterables`, `/lang`, `/math`, `/objects`, `/routes`, `/seq`, `/strings`, `/types`, `/utils`, `/validations`, `/composables`).
