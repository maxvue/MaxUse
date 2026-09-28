# Changelog

All notable changes to `@maxvue/max-use` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-09-28

### Added
- **`useSpellChecker` Documentation & Exports:** Fully documented real-time reactive spell checking composable with Levenshtein distance, custom dictionaries, and specialized solar/electrical engineering terminology.
- **Route Options & Helper Export:** Exported `apiRoute`, `ApiRouteOptions`, and `ApiRouteResult` in `@maxvue/max-use/routes` barrel.
- **IndexedDB Routes:** Documented `getCachedApiIDB` and `postCachedApiIDB` with *Stale-While-Revalidate* cache strategies.
- **Extended REST APIs:** Documented `apiPutRoute`, `apiDeleteRoute`, and `apiUploadRoute` (multipart with upload progress).
- **International Documentation:** Added canonical English `README.md` and synchronized `README.pt-BR.md`.
- **Governance:** Added `CONTRIBUTING.md`, `SECURITY.md`, and updated repository `.gitignore`.
- **Peer Dependencies:** Made `vue-router` optional via `peerDependenciesMeta` and broadened version support to `^4.0.0 || ^5.0.0`.

### Fixed
- **Reactivity in `isValid.ts`:** Implemented `toValue()` in `isValid`, `isNotValid`, `isEmpty`, and `isNotEmpty` so that reactive `Ref` and getter values are unwrapped accurately.
- **Type Overloads in `castArray.ts`:** Added TypeScript overloads so passing arrays returns `T[]` rather than `T[][]`.
- **Type Overloads in `pull.ts`:** Added non-nullable array overload to prevent strict TypeScript `null | undefined` errors.
- **Object Size with Refs (`objectSize.ts`):** Fixed array check to evaluate unwrapped `value` instead of raw ref object.
- **Reactivity in `assign.ts` & `defaults.ts`:** Guaranteed `toValue()` unwrapping for reactive source arguments.
- **JSDoc Placement:** Repositioned displaced JSDoc comment blocks in `useDefaultReset.ts` and `useRefCached.ts` directly onto exported functions.
- **Route Resolver Runtime Exception:** Clarified mandatory `setRouteResolver(...)` invocation in routes initialization.
- **`wireSize` Signature:** Corrected README documentation to reflect that `wireSize` is `async` and accepts `(current, options)`.
- **`orderByWithKey` Signature:** Fixed documentation to show 4 parameters and return type `Record<string, T>`.
- **`isDate` TypeScript Union:** Added `Date` instance support to `RefDate` type definition.

---

## [2.0.0] - 2026-08-10

### Changed
- **Zero Lodash Dependency:** Replaced `lodash-es` with native, 100% typed TypeScript implementations of collection, math, object, and function utilities.
- **Unified Reactive Hub (`_`):** The `_` symbol is now an object aggregating native MaxUse helpers and VueUse composables. It is no longer callable directly.
- **Dedicated Placeholder Symbol:** Replaced Lodash `_` placeholder in currying/partial evaluation with an explicit `placeholder` symbol (`Symbol('placeholder')`).
- **Coercive Summation (`sum`, `sumBy`):** Numbers as strings are coerced and non-numeric values fall back to `0`. `NaN` is never returned.
- **Vue Reactivity Native Support:** Helpers and composables accept `MaybeRefOrGetter` inputs, automatically unwrapping values reactively.
- **Tree-Shaking & Submodules:** Added granular submodule exports (`@maxvue/max-use/browser`, `/dates`, `/electrical`, `/format`, `/functions`, `/iterables`, `/lang`, `/math`, `/objects`, `/routes`, `/seq`, `/strings`, `/types`, `/utils`, `/validations`, `/composables`).
