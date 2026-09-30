<p align="center">
  <img src="https://raw.githubusercontent.com/maxvue/MaxUse/main/maxvue.jpeg" alt="MaxUse Logo" width="120" />
</p>

<h1 align="center">@maxvue/max-use</h1>

<p align="center">
  <strong>The Ultimate Utility and Composable Library for Vue 3</strong><br/>
  VueUse + Lodash Reimplementation + Reactive Helpers with deep support for Vue 3 reactivity and full TypeScript typing.
</p>

<p align="center">
  🌐 <strong>English</strong> • <a href="README.pt-BR.md">Português (Brasil)</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@maxvue/max-use"><img src="https://img.shields.io/npm/v/@maxvue/max-use.svg?style=flat-square&color=41b883" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@maxvue/max-use"><img src="https://img.shields.io/npm/dm/@maxvue/max-use.svg?style=flat-square&color=41b883" alt="downloads" /></a>
  <a href="https://github.com/maxvue/MaxUse/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@maxvue/max-use.svg?style=flat-square" alt="license" /></a>
  <img src="https://img.shields.io/badge/Vue-3.x-41b883?style=flat-square&logo=vue.js" alt="vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript" alt="typescript" />
  <img src="https://img.shields.io/badge/tree--shaking-✓-brightgreen?style=flat-square" alt="tree-shaking" />
</p>

---

## ✨ Why MaxUse?

| Feature | Pure Lodash | Pure VueUse | **MaxUse** |
|:---|:---:|:---:|:---:|
| Native Vue 3 Reactivity (`toValue` unwrapping) | ❌ | ✅ | ✅ |
| Complete Array, Object & Function Utilities | ✅ | ❌ | ✅ (Native TS) |
| Advanced Composables (Storage, Debounce, SpellChecker) | ❌ | ✅ | ✅ |
| Brazilian Validations (CPF, CNPJ, CEP, Credit Card, Phone) | ❌ | ❌ | ✅ |
| Brazilian Formatting (Currency BRL, Documents, Masks) | ❌ | ❌ | ✅ |
| Named Route HTTP Client (Ziggy / Laravel / Adonis) | ❌ | ❌ | ✅ |
| HTTP Cache in `localStorage` & `IndexedDB` (Stale-While-Revalidate) | ❌ | ❌ | ✅ |
| Unified `_` API without runtime `lodash-es` dependency | ✅ | ❌ | ✅ |
| Granular Tree-Shaking + 18 Submodules | ⚠️ | ✅ | ✅ |
| Auto-Import Preset for `unplugin-auto-import` | ❌ | ✅ | ✅ |

---

## 📦 Installation

```bash
# npm
npm install @maxvue/max-use @vueuse/core vue

# pnpm
pnpm add @maxvue/max-use @vueuse/core vue

# yarn
yarn add @maxvue/max-use @vueuse/core vue

# bun
bun add @maxvue/max-use @vueuse/core vue
```

> **Routes Submodule (Optional):** If you are using SPA navigation and named routes with Ziggy or Laravel via `@maxvue/max-use/routes`, also install:
> ```bash
> npm install vue-router ziggy-js
> ```

---

## 🚀 Quick Start

### 1. Named Imports (Recommended for Tree-Shaking)

```ts
import { isString, isWeekend, capitalize, deepMerge, formatCurrency } from '@maxvue/max-use'

const price = formatCurrency(1250.5) // "R$ 1.250,50"
```

### 2. Centralized `_` Object

MaxUse exports an all-in-one `_` object that aggregates all proprietary helpers, **VueUse** composables, and **Lodash-style** reimplementations, giving priority to MaxUse in case of name collisions.

> **Note (v2.0.0):** MaxUse has zero runtime dependency on `lodash-es`. All utilities (`debounce`, `throttle`, `groupBy`, `sum`, `get`, `set`, etc.) are native TypeScript implementations built to work seamlessly with Vue 3 reactivity.

```ts
import { _ } from '@maxvue/max-use'

// Proprietary MaxUse helpers
const id = _.intervalRandom(1, 10)
const total = _.sum([10, '20', null]) // 30 (safe coercive parsing)

// Integrated VueUse composables
const { x, y } = _.useMouse()

// Modern function utilities
const debounced = _.debounce(() => console.log('Saved!'), 300)
```

#### Intentional Differences with Lodash

Deliberate behavioral distinctions enforced by characterization tests:

| Helper | MaxUse | Lodash | Rationale |
|:---|:---|:---|:---|
| `sum` | `sum([6, 4, NaN])` → `10`<br/>`sum(['1', '2'])` → `3` | `NaN`<br/>`'12'` | Coercive parsing (`parseFloat`): non-numeric values become `0`. Never returns `NaN`. Accepts `Ref` and `Record`. |
| `sumBy` | `sumBy([{ a: '10' }, { a: '5' }], 'a')` → `15` | `'105'` | Same coercion: `Number(val) \|\| 0`. Never returns `NaN`. |
| `orderBy` | Nulls and `undefined` are always sorted to the end | Nulls at beginning in `'desc'` | UI consistency: missing values always stay at the bottom. |
| `deepMerge` | Deep-clones instances (`Date`, `Map`, `Set`) *(mutates target)* | Preserves instances by reference *(mutates target)* | Prevents reference leakage and accidental cross-mutation. |
| `isEmpty` | `isEmpty(0) === false`<br/>`isEmpty(false) === false` | `true`<br/>`true` | In form controls, `0` and `false` represent valid inputs. |
| `size` | `size(42) === 42` (with `allow_number: true`) | `0` | Ergonomic counting for numeric values. |
| `filter` | On `Record<string, T>`, returns `Record<string, T>` | Returns `T[]` (loses keys) | Preserves dictionary key mapping. |

---

## 🛤️ Routes Submodule (`@maxvue/max-use/routes`)

Declarative HTTP client integrating named backend routes (Laravel/Ziggy/Adonis) with caching strategies in `localStorage` and `IndexedDB`.

### Mandatory Setup

```ts
// main.ts or app.ts
import { createApp } from 'vue'
import { setLibraryRouter, setRouteResolver, setApiRequestConfig } from '@maxvue/max-use/routes'
import { route } from 'ziggy-js' // Or your custom route resolver
import router from './router'
import App from './App.vue'

const app = createApp(App)

// 1. Connect Vue Router for programmatic navigation via goToRoute()
setLibraryRouter(router)

// 2. Connect route resolver (REQUIRED for apiGetRoute, getRoute, etc.)
setRouteResolver((name, params) => {
    try {
        return route(name, params)
    } catch {
        return null
    }
})

// 3. (Optional) Configure global request headers, CSRF and auth tokens
setApiRequestConfig({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': () => {
            const token = localStorage.getItem('token')
            return token ? `Bearer ${token}` : ''
        }
    }
})

app.use(router).mount('#app')
```

### HTTP Requests

```ts
import { 
    apiGetRoute, 
    apiPostRoute, 
    apiPutRoute, 
    apiDeleteRoute,
    getRoute,
    goToRoute,
    getCachedApi, 
    getCachedApiIDB 
} from '@maxvue/max-use/routes'

// Typed GET with query parameters
const users = await apiGetRoute<User[]>('api.users.index', { page: 1 })

// POST with request body payload
await apiPostRoute('api.users.store', { name: 'John Doe', email: 'john@example.com' })

// PUT with URL route parameters and request body
await apiPutRoute('api.users.update', { name: 'John Updated' }, {
    route_params: { id: 42 }
})

// DELETE with URL route parameter
await apiDeleteRoute('api.users.destroy', null, {
    route_params: { id: 42 }
})

// Resolve route URL string
const profileUrl = getRoute('api.users.show', { id: 42 }) // "/api/users/42"

// Programmatic SPA navigation
goToRoute('dashboard.index')

// Fast localStorage cache (5-minute TTL = 300,000 ms)
const configs = await getCachedApi('api.config', {}, 'app_configs', 5 * 60 * 1000)

// Persistent IndexedDB cache with Stale-While-Revalidate (1-hour TTL = 3,600,000 ms)
const catalog = await getCachedApiIDB('api.catalog', {}, 'catalog_cache', 60 * 60 * 1000, (freshData) => {
    console.log('Background updated:', freshData)
})
```

---

## ⚡ Auto-Import (`unplugin-auto-import`)

To use all helpers, composables and types without manual imports:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { maxUseAutoImport } from '@maxvue/max-use'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                // Registers all MaxUse helpers, composables, and type definitions
                ...maxUseAutoImport,
            ],
            dts: 'src/auto-imports.d.ts', // Generates TypeScript declarations for IDE autocomplete
        })
    ]
})
```

---

## 📋 The 18 Exported Submodules

Import directly from subpaths to maximize bundling efficiency:

| Submodule | Description |
|:---|:---|
| `@maxvue/max-use` | Unified entry point containing all helpers and the `_` object |
| `@maxvue/max-use/browser` | Touch detection and color manipulation (`getColorFromVar`, `contrastColor`) |
| `@maxvue/max-use/composables` | Reactive composables: `useRefCached`, `useSpellChecker`, `useDefaultReset`, `useTimeAgo` |
| `@maxvue/max-use/dates` | Date calculations and assertions: `isDate`, `addTime`, `isWeekend`, `formatMailDate` |
| `@maxvue/max-use/electrical` | Sizing of electrical cables per Brazilian standard NBR 5410: `wireSize` (async) |
| `@maxvue/max-use/format` | Brazilian formatters: `formatCurrency` (R$), `formatBytes`, `formatPhone` |
| `@maxvue/max-use/functions` | Function utilities: `debounce`, `throttle`, `memoize`, `curry`, `partial`, `flow` |
| `@maxvue/max-use/iterables` | 85+ array and collection helpers: `orderByWithKey`, `groupBy`, `sum`, `chunk` |
| `@maxvue/max-use/lang` | 47 type checking & conversion utilities: `isString`, `isPlainObject`, `castArray`, `clone` |
| `@maxvue/max-use/math` | 14 mathematical functions: `average`, `median`, `ceil`, `floor`, `round`, `inRange` |
| `@maxvue/max-use/objects` | Deep object manipulation: `get`, `set`, `diff`, `deepMerge`, `renameKeys` |
| `@maxvue/max-use/routes` | HTTP client integrated with named routes, IndexedDB & localStorage cache |
| `@maxvue/max-use/seq` | Lodash-style sequencing and wrapper chaining: `chain`, `tap`, `thru`, `wrapperValue` |
| `@maxvue/max-use/strings` | String sanitization and casing: `abbrevName`, `slugify`, `truncate`, masks |
| `@maxvue/max-use/types` | Reactive type guards: `hasContent`, `isBlank`, `isNumber`, `isArray` |
| `@maxvue/max-use/utils` | General utilities: `range`, `times`, `uniqueId`, `defaultTo`, `attempt`, `template` |
| `@maxvue/max-use/validations` | Full Brazilian validations: `isCpf`, `isCnpj`, `cepIsValid`, `isValidCreditCard` |
| `@maxvue/max-use/vueuse` | Curated re-exports from the VueUse ecosystem |

---

## 🛠️ Key API Details & Caveats

### Composables
- **`useRefCached(key, defaultValue)`**: Synchronizes a reactive `Ref` with `localStorage` and listens to native `storage` events across browser tabs.
- **`useCachedApi<T>(routeName, options)`**: Stale-while-revalidate pattern linking an API GET endpoint with `localStorage` and immediate reactive updates.
- **`useDateFormat(date, format)`**: Reactive date formatter with safe reactive fallback.
- **`useTimeAgo(date, format)`**: Localized relative time formatter with multiple styles (`'br'`, `'abbrev'`, `'action'`, `'limit'`, `'limitAbbrev'`).
- **`watchIfValid(source, callback)`** & **`watchDebounceIfValid`**: Watchers that fire callbacks only when the watched value is non-empty (`isNotEmpty`).
- **`useSpellChecker(text, options)`**: Reactive Brazilian Portuguese spellchecker with suggestions and auto-correction.

### Objects
- **`deepMerge(target, ...sources)`**: Mutates `target` in place. Use `deepMerge({}, defaults, userConfig)` to avoid mutating original objects.
- **`set(object, path, value)`**: Returns the updated object (`T`) or preserves the original `Ref`.
- **`diff(oldObj, newObj, alwaysKeep?)`**: Returns properties that changed or were added in `newObj`. Note that deleted keys are not captured.

### Validations
- **`isValid(value)`**: Unwraps Vue reactivity with `toValue`. Returns `false` for `null` and `undefined` (even if passed as `ref(null)`).
- **`isValidCreditCard(number)`**: Validates using the Luhn algorithm as well as Brazilian national card issuer BINs (including Elo and Hipercard).

### Electrical
- **`wireSize(current, options)`**: Asynchronous function returning `Promise<WireSizeResult | null>`. First parameter `current` is required.
```ts
import { wireSize } from '@maxvue/max-use/electrical'
const cable = await wireSize(25, { voltage: 220, length: 30 })
```

### Browser
- **`getColorFromVar(varName)`**: Returns a `ColorInstance` (from the `color` library), not a raw string. Use `.hex()` to obtain the hexadecimal string:
```ts
import { getColorFromVar } from '@maxvue/max-use/browser'
const hex = getColorFromVar('--primary-color').hex() // '#41b883'
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run all unit tests (Vitest)
npm test

# Run tests including static type checks
npm run test:all

# Static type checking (vue-tsc)
npm run type-check

# Lint and fix code formatting
npm run lint

# Launch interactive playground at http://localhost:5173
npm run dev:playground

# Build library (prebuild + bundle outputs in dist/)
npm run build
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
