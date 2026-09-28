<p align="center">
  <img src="https://raw.githubusercontent.com/maxvue/MaxUse/main/maxvue.jpeg" alt="MaxUse Logo" width="120" />
</p>

<h1 align="center">@maxvue/max-use</h1>

<p align="center">
  <strong>The definitive utility library for Vue 3</strong><br/>
  VueUse + Native Lodash-style helpers + Custom utilities with first-class Vue reactivity.
</p>

<p align="center">
  🌐 <strong>English</strong> | <a href="README.pt-BR.md">Português (Brasil)</a>
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
| Native Vue Reactivity (`MaybeRefOrGetter`) | ❌ | ✅ | ✅ |
| Pure Utilities (strings, arrays, objects) | ✅ | ❌ | ✅ |
| Composables (watchers, storage, spell checker) | ❌ | ✅ | ✅ |
| Brazilian Utilities (CPF, CNPJ, CEP, Phone) | ❌ | ❌ | ✅ |
| Formatters (Currency BRL, Document Masks) | ❌ | ❌ | ✅ |
| Ziggy / Laravel / IndexedDB REST Integration | ❌ | ❌ | ✅ |
| Unified Aggregator Object (`_`) | ✅ | ❌ | ✅ |
| Tree-shaking & 16 Granular Submodules | ⚠️ | ✅ | ✅ |
| Auto Import (`unplugin-auto-import`) | ❌ | ✅ | ✅ |

**MaxUse** unites the best of both worlds under a single, tree-shakeable dependency, adding an extensive suite of reactive helpers for modern Vue 3 and Laravel/REST applications.

---

## 📦 Installation

```bash
npm install @maxvue/max-use @vueuse/core vue
```

> **Routes Submodule (Ziggy / Laravel / Cache):** If you plan to use `@maxvue/max-use/routes`, install the optional peer packages:
> ```bash
> npm install ziggy-js vue-router axios idb-keyval
> ```

---

## 🚀 Getting Started

### 1. Individual Named Imports (Recommended)

```ts
import { isString, isWeekend, capitalize, deepMerge } from '@maxvue/max-use'

const text = 'hello'
if (isString(text)) {
  console.log(capitalize(text)) // 'Hello'
}
```

### 2. Centralized Aggregator Object (`_`)

To maintain the ergonomic familiarity of Lodash, MaxUse exports a centralized `_` object. It bundles native MaxUse helpers and VueUse composables with full reactivity support.

> Starting with **v2.0.0**, MaxUse has **zero dependencies on `lodash-es`**. All Lodash-style utilities (`debounce`, `groupBy`, `sum`, `get`/`set`, etc.) are native, pure TypeScript implementations.

```ts
import { _ } from '@maxvue/max-use'

// Native MaxUse helpers
const id = _.intervalRandom(1, 10)
const merged = _.deepMerge({ a: 1 }, { b: 2 })

// Integrated VueUse composables
const { x, y } = _.useMouse()

// Lodash-style helpers
const debounced = _.debounce(fn, 300)
```

#### Known Deliberate Divergences from Lodash

These behavioral differences are **deliberate** and backed by characterization unit tests:

| Helper | MaxUse | Lodash | Rationale |
|:---|:---|:---|:---|
| `sum` | `sum([6, 4, NaN])` → `10`<br/>`sum(['1', '2'])` → `3` | `NaN`<br/>`'12'` | **Coercive summation**: Non-numeric values fall back to `0`. Never returns `NaN`. Accepts reactive `Ref` and `Record` objects. |
| `sumBy` | `sumBy([{ a: '10' }, { a: '5' }], 'a')` → `15` | `'105'` | Same coercion: `Number(val) \|\| 0`. Never returns `NaN`. |
| `orderBy` | Nulls and `undefined` are always sorted last | Nulls sorted first on `'desc'` | Consistent UI presentation in data tables: missing data is always sent to the bottom. |
| `deepMerge` | Deep-clones instances (`Date`, `Map`, `Set`) | Preserves instances by reference | Prevents reference leaks and unintended cross-object mutations. |
| `isEmpty` | `isEmpty(0) === false`<br/>`isEmpty(false) === false` | `true`<br/>`true` | In forms, `0` and `false` represent valid user selections and must not be treated as empty. |
| `size` | `size(42) === 42` (with default `allow_number: true`) | `0` | Ergonomic support for counters and numeric sizes. |
| `filter` | On `Record<string, T>`, returns `Record<string, T>` | Returns `T[]` (drops keys) | Preserves indexed key-value map structures. |

### Placeholder Symbol in `curry` and `partial`

In Lodash, `_` is both the namespace and the argument placeholder. In MaxUse, `_` is an aggregator object, not a function.  
Therefore, an explicit `placeholder` symbol is exported:

```ts
import { curry, placeholder } from '@maxvue/max-use'

const fn = (a: number, b: number, c: number) => [a, b, c]

curry(fn)(1, placeholder, 3)(2) // ✅ [1, 2, 3]
curry(fn)(1, _, 3)              // ❌ Passes the '_' object as argument 'b'
```

---

## 🗂️ Submodules & API Reference

Optimize your production bundle by importing directly from domain submodules:

```ts
import { isTouchDevice, getColorFromVar } from '@maxvue/max-use/browser'
import { addTime, isWeekend, isPast }       from '@maxvue/max-use/dates'
import { first, uniqueBy, groupBy }         from '@maxvue/max-use/iterables'
import { average, median }                  from '@maxvue/max-use/math'
import { deepMerge, renameKeys }            from '@maxvue/max-use/objects'
import { truncate, readingTime, slugify }    from '@maxvue/max-use/strings'
import { isBlank, hasContent, isNumber }     from '@maxvue/max-use/types'
import { isCpf, isEmail, cepIsValid }       from '@maxvue/max-use/validations'
import { formatCurrency, formatBytes }       from '@maxvue/max-use/format'
import { wireSize }                          from '@maxvue/max-use/electrical'
import { useSpellChecker, useRefCached }    from '@maxvue/max-use/composables'
import { apiGetRoute, goToRoute }            from '@maxvue/max-use/routes'
import { debounce, throttle, memoize }       from '@maxvue/max-use/functions'
import { chain }                             from '@maxvue/max-use/seq'
import { cloneDeep, isPlainObject }          from '@maxvue/max-use/lang'
import { uniqueId, range }                  from '@maxvue/max-use/utils'
```

---

### 📦 Iterables (`@maxvue/max-use/iterables`)

Collection utilities with support for arrays, reactive refs, and records.

| Helper | Signature | Description |
|:---|:---|:---|
| `first` | `(array) → T \| undefined` | Returns the first element |
| `last` | `(array) → T \| undefined` | Returns the last element |
| `chunk` | `(array, size) → T[][]` | Splits array into chunks of specified length |
| `uniq` | `(array) → T[]` | Returns duplicate-free array |
| `uniqueBy` | `(array, key) → T[]` | Removes duplicates by property or selector function |
| `groupBy` | `(collection, iteratee?) → Record<string, T[]>` | Groups items by key or iteratee |
| `keyBy` | `(collection, iteratee?) → Record<string, T>` | Indexes collection by property or iteratee |
| `countBy` | `(collection, iteratee) → Record<string, number>` | Counts occurrences per group |
| `countWhere` | `(collection, key, value?) → number` | Counts items matching key-value criteria |
| `orderBy` | `(collection, criteria?, orders?) → T[]` | Sorts collection by multiple criteria and directions |
| `orderByWithKey` | `(collection, criteria, object_keyBy, order?) → Record<string, T>` | Sorts collection and returns indexed Record |
| `filter` | `(collection, predicate?) → T[] \| Record<string, T>` | Filters collection with predicate |
| `sum` | `(array) → number` | Calculates sum with coercion ([see divergences](#known-deliberate-divergences-from-lodash)) |
| `sumBy` | `(collection, iteratee?) → number` | Calculates sum of selected property with coercion |
| `sample` | `(array) → T` | Returns a random item |
| `shuffle` | `(array) → T[]` | Randomly shuffles array elements |
| `size` | `(value, allow_number?) → number` | Returns size of array, string, object, Map, Set, or number |
| `reverse` | `(array) → T[]` | Mutates array reversing elements in-place |

---

### 🔤 Strings (`@maxvue/max-use/strings`)

| Helper | Signature | Description |
|:---|:---|:---|
| `truncate` | `(str, length?, suffix?) → string` | Truncates text with suffix (default `'...'`) |
| `slugify` | `(str) → string` | Converts text to URL-friendly slug |
| `stripHtml` | `(html) → string` | Strips HTML tags |
| `readingTime` | `(text, wpm?) → string` | Returns reading time estimate (e.g. `'2 min de leitura'`) |
| `initials` | `(name, max?) → string` | Generates initials from person/organization name |
| `abbrevName` | `(name) → string` | Progressively abbreviates Brazilian names suppressing connectives |
| `camelCase` | `(str) → string` | Converts string to camelCase |
| `kebabCase` | `(str) → string` | Converts string to kebab-case |
| `snakeCase` | `(str) → string` | Converts string to snake_case |
| `capitalize` | `(str) → string` | Capitalizes first letter |
| `Random` | `(type?, length?) → string` | Generates random alphanumeric string |
| `ulid` | `() → string` | Generates unique ULID |

---

### 💰 Format (`@maxvue/max-use/format`)

| Helper | Signature | Description |
|:---|:---|:---|
| `formatCurrency` | `(value, decimals?) → string` | Formats number to Brazilian Real (`R$ 1.234,50`) |
| `formatBytes` | `(bytes, decimals?) → string` | Formats byte counts to human-readable format (`1.5 MB`) |
| `formatCpf` | `(value) → string` | Applies CPF mask (`123.456.789-09`) |
| `formatCnpj` | `(value) → string` | Applies CNPJ mask (`12.345.678/0001-90`) |
| `formatPhone` | `(value) → string` | Formats Brazilian telephone numbers |
| `maskSensitive` | `(value, type?) → string` | Obfuscates sensitive data (email, credit card, text) per LGPD |

---

### ⚡ Electrical (`@maxvue/max-use/electrical`)

Engineering calculation helpers compliant with Brazilian standard **NBR 5410**.

| Helper | Signature | Description |
|:---|:---|:---|
| `wireSize` | `async (current, options?) → Promise<WireSizeResult \| null>` | Sizes electrical conductor gauge by ampacity and voltage drop limits |
| `calculaCabo` | `async (current, options?) → Promise<WireSizeResult \| null>` | Portuguese alias for `wireSize` |

```ts
import { wireSize } from '@maxvue/max-use/electrical'

const result = await wireSize(32, {
  voltage: 220,
  length: 25,
  max_loss: 4,
  material: 'copper', // 'copper' | 'aluminum'
  isolation: 'pvc'    // 'pvc' (70°C) | 'epr' / 'xlpe' (90°C)
})

console.log(result?.wire)         // Recommended nominal gauge in mm² (e.g. 6)
console.log(result?.max_current)  // Conductor ampacity rating (A)
console.log(result?.voltage_drop) // Voltage drop in Volts (V)
console.log(result?.loss_percent) // Voltage drop percentage (e.g. 1.78%)
```

---

## 🔧 Composables (`@maxvue/max-use/composables`)

Reactive composables designed for Vue 3 SFCs.

### `useSpellChecker`

Real-time reactive spell checking and terminology assistance composable with built-in Brazilian Portuguese dictionaries and specialized solar/electrical engineering terms.

```ts
import { ref } from 'vue'
import { useSpellChecker } from '@maxvue/max-use/composables'

const text = ref('homologacao na consessionaria')
const { errors, hasErrors, suggestions, getCorrectedText, checkNow } = useSpellChecker(text, {
  debounceMs: 300,
  technicalTerms: true
})

console.log(hasErrors.value)    // true
console.log(getCorrectedText()) // 'homologação na concessionária'
```

### `useRefCached` / `useStorage`

Creates a Vue `Ref` automatically synchronized with `localStorage` and cross-tab storage events.

```ts
import { useRefCached } from '@maxvue/max-use'

const theme = useRefCached('theme', 'dark')

// Reactive dynamic key
const userId = ref(1)
const prefs = useRefCached(() => `prefs-${userId.value}`, { sidebar: true })
```

### `useDefaultReset` / `refAutoReset`

Creates a resettable `Ref` with auto-reset debounce timer.

```ts
import { useDefaultReset } from '@maxvue/max-use'

const search = useDefaultReset('', 3000) // Reverts to '' 3s after last keystroke
search.reset()                           // Immediate manual reset
```

### `useCachedApi`

SWR reactive cache with automatic API synchronization via Ziggy routes.

```ts
import { useCachedApi } from '@maxvue/max-use'

const users = useCachedApi<User[]>('api.users.index', {
  defaultValue: [],
  data_get: { active: true },
  key: 'users-cache'
})
```

---

## 🛤️ Routes (`@maxvue/max-use/routes`)

Full-featured RESTful routing module for **Laravel + Inertia/Vue**, **Ziggy**, Axios, and IndexedDB caching.

### Mandatory Setup

Before calling API route helpers, configure the route resolver and Vue Router in your application's entrypoint (`main.ts`):

```ts
// main.ts
import { setRouteResolver, setLibraryRouter, setApiRequestConfig } from '@maxvue/max-use/routes'
import { route } from 'ziggy-js'
import router from './router'

// 1. Mandatory Ziggy Route Resolver
setRouteResolver(route)

// 2. Mandatory Vue Router instance for goToRoute navigation
setLibraryRouter(router)

// 3. Optional global HTTP configuration
setApiRequestConfig({
  headers: {
    Authorization: () => `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: true
})
```

### Available Route Helpers

| Function | HTTP Method | Description |
|:---|:---:|:---|
| `apiGetRoute<T>` | GET | Typed GET request for named routes (supports blob downloads via `file: true`) |
| `apiPostRoute<T>` | POST | POST request for named routes (supports `options.route_params` for URL parameters) |
| `apiPutRoute<T>` | PUT | PUT request with separated URL parameters and body |
| `apiDeleteRoute<T>` | DELETE | DELETE request with optional payload |
| `apiUploadRoute<T>` | POST | Multipart upload with automatic FormData serialization and progress callback |
| `getCachedApiIDB<T>` | GET | Persistent **IndexedDB** cache with *Stale-While-Revalidate* strategy |
| `postCachedApiIDB<T>` | POST | Cached POST requests in IndexedDB for heavy analytics queries |
| `clearCachedApi` | — | Invalidates localStorage cache keys |
| `clearCacheIDB` | — | Clears IndexedDB cache database |
| `getRoute` | — | Resolves named route to URL string |
| `goToRoute` | — | Navigates to named route via Vue Router |

```ts
import { apiGetRoute, apiPutRoute, getCachedApiIDB, goToRoute } from '@maxvue/max-use/routes'

// Typed GET
const users = await apiGetRoute<User[]>('api.users.index', { role: 'admin' })

// RESTful PUT with separated route parameter and body
await apiPutRoute('api.users.update', { name: 'New Name' }, {
  route_params: { user: 42 }
})

// IndexedDB SWR caching
const report = await getCachedApiIDB('api.analytics.summary', null, 'analytics-cache', 3600, (freshData) => {
  console.log('Background updated:', freshData)
})
```

---

## 🧩 Auto Import Setup

MaxUse provides native integration with `unplugin-auto-import`. With a single configuration, **all helpers and composables** become globally accessible across templates and scripts without manual imports.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { maxUseAutoImport } from '@maxvue/max-use'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        ...maxUseAutoImport,
      ],
      dts: 'auto-imports.d.ts' // Generates TypeScript declarations for IDE autocomplete
    })
  ]
})
```

---

## 📋 Submodules Summary

| Submodule | Import Path | Contents |
|:---|:---|:---|
| **Browser** | `@maxvue/max-use/browser` | `getColorFromVar`, `contrastColor`, `isTouchDevice` |
| **Dates** | `@maxvue/max-use/dates` | `addTime`, `diffInDays`, `isSameDay`, `isWeekend`, `isDate`, `now`, `formatMailDate` |
| **Electrical** | `@maxvue/max-use/electrical` | `wireSize`, `calculaCabo` (NBR 5410 standard) |
| **Format** | `@maxvue/max-use/format` | `formatCurrency`, `formatBytes`, `formatCpf`, `formatCnpj`, `formatPhone`, `maskSensitive` |
| **Functions** | `@maxvue/max-use/functions` | `debounce`, `throttle`, `memoize`, `once`, `curry`, `partial`, `placeholder`, etc. |
| **Iterables** | `@maxvue/max-use/iterables` | `first`, `last`, `chunk`, `groupBy`, `keyBy`, `orderBy`, `orderByWithKey`, `sum`, `sumBy`, `uniq`, etc. |
| **Lang** | `@maxvue/max-use/lang` | `castArray`, `clone`, `cloneDeep`, `isPlainObject`, `isEqualWith`, type guards |
| **Math** | `@maxvue/max-use/math` | `average`, `median`, `round`, `floor`, `ceil`, `inRange`, `clamp`, `random` |
| **Objects** | `@maxvue/max-use/objects` | `deepMerge`, `deepClone`, `get`, `set`, `omit`, `pick`, `renameKeys`, `diff`, `has`, etc. |
| **Routes** | `@maxvue/max-use/routes` | `apiGetRoute`, `apiPostRoute`, `apiPutRoute`, `apiDeleteRoute`, `apiUploadRoute`, `getCachedApiIDB`, `setRouteResolver`, `goToRoute` |
| **Seq** | `@maxvue/max-use/seq` | `chain`, `tap`, `thru`, `wrapperChain` |
| **Strings** | `@maxvue/max-use/strings` | `truncate`, `slugify`, `readingTime`, `kebabCase`, `camelCase`, `snakeCase`, `mask`, `abbrevName` |
| **Types** | `@maxvue/max-use/types` | `isBlank`, `hasContent`, `isArray`, `isObject`, `isNumber`, `canIterate` |
| **Utils** | `@maxvue/max-use/utils` | `uniqueId`, `range`, `times`, `attempt`, `cond`, `conforms`, `template` |
| **Validations** | `@maxvue/max-use/validations` | `isCpf`, `isCnpj`, `cepIsValid`, `phone`, `isValidCreditCard`, `isEmail`, `isEmpty` |
| **Composables** | `@maxvue/max-use/composables` | `useSpellChecker`, `useCachedApi`, `useRefCached`, `useDefaultReset`, `useTimeAgo`, `useDateFormat`, `watchTrue` |
| **VueUse** | `@maxvue/max-use/vueuse` | Direct, unfiltered re-export of `@vueuse/core` |

---

## 🤝 Contributing

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) guide for instructions on local setup, running tests, type checking, and pull request conventions.

For version history and migration details, refer to the [CHANGELOG.md](CHANGELOG.md).

---

## 📄 License

**MIT License** © [Johnattas Santana](https://github.com/maxvue)
