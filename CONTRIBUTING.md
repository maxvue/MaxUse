# Contributing to @maxvue/max-use

Thank you for investing your time in contributing to `@maxvue/max-use`!  
This guide will help you set up your development environment, run tests, and adhere to our codebase standards.

---

## 🛠️ Prerequisites

- **Node.js**: `>= 18.0.0`
- **Package Manager**: `npm` `>= 9.0.0`
- **Git**

---

## 📦 Setup & Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/maxvue/MaxUse.git
cd MaxUse
npm install
```

> [!NOTE]
> If peer dependency conflicts occur during local development, ensure `.npmrc` is configured with `legacy-peer-deps=true`.

---

## 🚀 Available Scripts

Run these scripts from the repository root:

| Command | Description |
|---|---|
| `npm run build` | Compiles TypeScript declarations (`vue-tsc`) and bundles library entries (`vite build`) |
| `npm run type-check` | Performs strict TypeScript type checks without emitting files |
| `npm run lint` | Runs ESLint and Stylelint with automatic formatting fixes |
| `npm test` | Runs the full Vitest test suite once |
| `npm run test:all` | Runs unit tests followed by static type tests |
| `npm run test:watch` | Runs Vitest in watch mode for TDD workflows |
| `npm run test:coverage` | Generates a V8 code coverage report |
| `npm run test:types` | Type-checks tests with Vitest |
| `npm run dev:playground` | Starts the local interactive playground for manual testing |

---

## 🧪 Testing Standards

Every helper, composable, or route utility must be covered by automated tests in `tests/` or co-located `*.test.ts` files.

1. **Pure TypeScript Utilities:**
   Write unit tests that verify:
   - Valid inputs, edge cases (`null`, `undefined`, empty string, `NaN`).
   - Coercion and fallbacks.
   - Characterization tests when behavior deliberately differs from libraries like Lodash.

2. **Reactive Helpers & Composables:**
   - Test with both plain values and Vue `Ref` / `getter` functions (`MaybeRefOrGetter`).
   - Verify that updates to reactive sources propagate to return values or trigger appropriate side effects.

Run a specific test file:
```bash
npx vitest run src/Composables/useTimeAgo.test.ts
npx vitest run src/Helpers/Validations/documents.test.ts
```

---

## 📐 Coding Conventions

1. **TypeScript First:**
   - Strict typing is enforced. Avoid `any` where a generic `<T>` or specific union is feasible.
   - Always export parameter options and return types/interfaces (e.g. `UseSpellCheckerOptions`, `UseSpellCheckerReturn`).
2. **Reactivity Contract:**
   - Functions that accept inputs should accept `MaybeRefOrGetter<T>` whenever practical, unwrapping via `toValue(val)`.
3. **JSDoc / TSDoc:**
   - Public helpers and composables must have clear JSDoc blocks in **English**.
   - Include `@param`, `@returns`, and at least one `@example` block.
4. **Code Formatting:**
   - 4-space indentation.
   - Single quotes (`'`), semicolons required (`;`).
   - No trailing commas.
   - Run `npm run lint` before committing.

---

## 📝 Pull Request Checklist

Before submitting a PR, make sure:
- [ ] `npm test` passes without errors.
- [ ] `npm run test:all` passes cleanly.
- [ ] `npm run type-check` passes without errors.
- [ ] `npm run lint` passes without warnings.
- [ ] All new functions have complete JSDoc documentation with `@param` and `@returns`.
- [ ] New helpers are re-exported from their category `index.ts`.
- [ ] Unit tests covering edge cases (`null`, `undefined`, reactive `ref`) are included.
