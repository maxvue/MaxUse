# Independência do Lodash — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir o conjunto de artefatos `lodash_migrate/` (281 planos individuais + `execution.md` + `status.yaml` + docs de apoio) e o scaffolding de código (4 categorias novas + correção de precedência), de modo que uma sessão separada do Claude Code consiga executar a migração em loop até eliminar o `lodash-es`.

**Architecture:** Este plano **não implementa os 281 helpers**. Ele constrói: (a) o scaffolding das 4 categorias novas registrado nos 5 pontos de agregação; (b) a correção do bug de precedência em `src/index.ts`; (c) um gerador determinístico que produz os 281 arquivos `.md` de plano a partir de um manifesto categorizado versionado; (d) os documentos de controle (`execution.md`, `status.yaml`, `CONVENTIONS.md`, `DIVERGENCES.md`). A execução dos 281 helpers acontece depois, numa sessão separada, dirigida por `execution.md`.

**Tech Stack:** TypeScript, Vue 3 (`toValue`/`MaybeRefOrGetter`), Vite (lib multi-entry), Vitest (`globals: true`, `happy-dom`), ESLint flat config, `tsx` para scripts, `js-yaml` para gerar YAML.

## Global Constraints

- **Estilo ESLint (obrigatório, `eslint.config.js`):** indentação 4 espaços; aspas simples; ponto-e-vírgula sempre; **sem trailing comma**; `curly: multi` — corpo de uma única instrução fica inline sem chaves (`if (cond) return x;`); `object-curly-spacing: always`; `arrow-parens: always`; máx. 2 linhas vazias consecutivas.
- **Idioma:** todo JSDoc, comentário e documentação em **português**.
- **Reatividade:** `MaybeRefOrGetter<T>` + `toValue()` **apenas nos argumentos de dados** (arrays, objetos, strings, números). Callbacks/iteratees **nunca** passam por `toValue`. Retorno é sempre valor plano, nunca `ComputedRef`.
- **Precedência do `_`:** helpers próprios > VueUse > Lodash. Ao final, Lodash eliminado.
- **Um helper por arquivo**, registrado no `index.ts` da sua categoria.
- **Teste colocalizado** `<nome>.test.ts` ao lado do fonte, contendo obrigatoriamente um caso `funciona com Ref`.
- **Worktree obrigatório** (CLAUDE.md): agentes que propõem mudanças de código rodam em worktree separado, nunca na árvore principal.
- **Total imutável:** são exatamente **281** helpers. Qualquer divergência desse número indica erro e deve travar a geração.
- **Não editar à mão** `src/Helpers/autoImportData.json` — é gerado pelo `prebuild`.

## File Structure

**Criados por este plano:**

| Arquivo | Responsabilidade |
|---|---|
| `lodash_migrate/manifest.ts` | Fonte da verdade: os 281 helpers com categoria, fase, dependências, aliases e notas de peculiaridade. |
| `lodash_migrate/generate.ts` | Gerador determinístico: lê `manifest.ts` → emite os 281 `plans/**/*.md` e o `status.yaml`. |
| `lodash_migrate/CONVENTIONS.md` | Contrato de helper e de teste (evita repetir em 281 arquivos). |
| `lodash_migrate/DIVERGENCES.md` | Os 36 nomes onde a MaxUse diverge do Lodash. |
| `lodash_migrate/execution.md` | Protocolo do agente executor da sessão separada. |
| `lodash_migrate/status.yaml` | Estado de execução/verificação dos 281 (gerado). |
| `lodash_migrate/plans/<Cat>/<nome>.md` | 281 planos individuais (gerados). |
| `src/Helpers/{Functions,Lang,Seq,Utils}/index.ts` | Barrels das 4 categorias novas. |
| `src/Helpers/divergences.test.ts` | Trava a divergência intencional dos 36 nomes. |

**Modificados:**

| Arquivo | Mudança |
|---|---|
| `src/index.ts` | Corrigir filtro de precedência do Lodash; registrar 4 categorias. |
| `src/Helpers/maxUseItems.ts` | Registrar 4 categorias. |
| `src/scripts/buildAutoImport.ts` | Registrar 4 categorias. |
| `vite.config.ts` | 4 entradas novas em `build.lib.entry`. |
| `package.json` | 4 subpaths novos em `exports`; `js-yaml` em devDependencies. |

---

### Task 1: Worktree isolado + correção do bug de precedência

O CLAUDE.md exige worktree para mudanças de código. E há um bug real: em `src/index.ts:74-76`, `filteredLodash` recebe **todas** as chaves do Lodash sem filtro algum e entra por último no spread de `_` — sobrescrevendo os 36 helpers próprios e os 7 do VueUse. Sem corrigir isso, implementar um helper não teria efeito observável em `_`, e a migração inteira ficaria não-verificável.

**Files:**
- Modify: `src/index.ts:71-88`
- Test: `src/Helpers/precedence.test.ts` (criar)

**Interfaces:**
- Consumes: nada (primeira task).
- Produces: `_` com precedência correta (próprios > VueUse > Lodash). As tasks seguintes assumem que um helper próprio recém-criado vence o homônimo do Lodash dentro de `_`.

- [ ] **Step 1: Criar o worktree isolado**

```bash
cd /home/johnattas/GitHub/MaxUse
git worktree add ../MaxUse-wt-lodash-migrate -b lodash-migrate
cd ../MaxUse-wt-lodash-migrate
npm install
```

Todos os passos seguintes deste plano rodam dentro de `../MaxUse-wt-lodash-migrate`.

- [ ] **Step 2: Escrever o teste que falha**

Criar `src/Helpers/precedence.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { _ } from '../index';
import { get as ownGet } from './Objects/get';
import { chunk as ownChunk } from './Iterables/chunk';
import { isEqual as ownIsEqual } from './Objects/isEqual';

describe('precedência do objeto _', () => {
    it('helpers próprios vencem os homônimos do Lodash', () => {
        expect(_.get).toBe(ownGet);
        expect(_.chunk).toBe(ownChunk);
        expect(_.isEqual).toBe(ownIsEqual);
    });

    it('mantém os helpers exclusivos do Lodash disponíveis', () => {
        expect(typeof _.curry).toBe('function');
        expect(typeof _.compact).toBe('function');
    });

    it('mantém os helpers do VueUse disponíveis', () => {
        expect(typeof _.useStorage).toBe('function');
    });
});
```

- [ ] **Step 3: Rodar o teste e confirmar que falha**

Run: `npx vitest run src/Helpers/precedence.test.ts`
Expected: FAIL — `expect(_.get).toBe(ownGet)` falha porque `filteredLodash` sobrescreveu `get` com a versão do Lodash.

- [ ] **Step 4: Corrigir o filtro em `src/index.ts`**

Substituir o bloco atual (linhas 71-76):

```typescript
/**
 * Helpers do Lodash (filtrados para evitar duplicatas com ownHelpers e filteredVueUse).
 */
const filteredLodash: Record<string, any> = {};
const lodashKeys = Object.keys(lodash);

for (const key of lodashKeys) filteredLodash[key] = (lodash as Record<string, any>)[key];
```

Por:

```typescript
/**
 * Helpers do Lodash (filtrados para evitar duplicatas com ownHelpers e filteredVueUse).
 * Precedência: próprios > VueUse > Lodash.
 * TEMPORÁRIO: este bloco é removido ao final da migração de independência do Lodash.
 */
const filteredLodash: Record<string, any> = {};
const lodashKeys = Object.keys(lodash);

for (const key of lodashKeys) {
    if (key in ownHelpers) continue;
    if (key in filteredVueUse) continue;
    filteredLodash[key] = (lodash as Record<string, any>)[key];
}
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `npx vitest run src/Helpers/precedence.test.ts`
Expected: PASS (3 testes)

- [ ] **Step 6: Rodar a suite completa para garantir que nada quebrou**

Run: `npm test`
Expected: todos os testes passam. Se algum teste existente dependia do comportamento do Lodash em nome conflitante, ele falha aqui — corrigir o teste (a semântica MaxUse é a correta por decisão de design) e anotar o caso para a Task 5 (`DIVERGENCES.md`).

- [ ] **Step 7: Commit**

```bash
git add src/index.ts src/Helpers/precedence.test.ts
git commit -m "fix: corrige precedência do _ para helpers próprios sobre o Lodash"
```

---

### Task 2: Scaffolding das 4 categorias novas

Cria `Functions`, `Lang`, `Seq` e `Utils` com o barrel vazio e as registra nos **5** pontos de agregação. Fazer isso agora — antes de gerar os planos — garante que o executor da sessão separada só precise criar arquivos de helper, nunca mexer em config.

Cada categoria precisa de um helper real para o barrel não ser um módulo vazio (o Vite falha em entry sem exports). Uso `stubTrue`, `isNil`, `constant` e `tap` como sementes: são triviais, sem dependências, e já fazem parte dos 281.

**Files:**
- Create: `src/Helpers/Lang/index.ts`, `src/Helpers/Lang/isNil.ts`, `src/Helpers/Lang/isNil.test.ts`
- Create: `src/Helpers/Functions/index.ts`, `src/Helpers/Functions/negate.ts`, `src/Helpers/Functions/negate.test.ts`
- Create: `src/Helpers/Utils/index.ts`, `src/Helpers/Utils/stubTrue.ts`, `src/Helpers/Utils/stubTrue.test.ts`
- Create: `src/Helpers/Seq/index.ts`, `src/Helpers/Seq/tap.ts`, `src/Helpers/Seq/tap.test.ts`
- Modify: `src/index.ts`, `src/Helpers/maxUseItems.ts`, `src/scripts/buildAutoImport.ts`, `vite.config.ts`, `package.json`

**Interfaces:**
- Consumes: precedência corrigida da Task 1.
- Produces: 4 categorias importáveis (`src/Helpers/Lang`, `Functions`, `Utils`, `Seq`), cada uma exportando flat + um objeto namespace (`lang`, `functions`, `utils`, `seq`). Subpaths `@maxvue/max-use/{lang,functions,utils,seq}`. A Task 3 gera planos que apontam para estes diretórios.

- [ ] **Step 1: Escrever os testes que falham**

`src/Helpers/Lang/isNil.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isNil } from './isNil';

describe('isNil', () => {
    it('retorna true para null e undefined', () => {
        expect(isNil(null)).toBe(true);
        expect(isNil(undefined)).toBe(true);
    });

    it('retorna false para valores falsy que não são nil', () => {
        expect(isNil(0)).toBe(false);
        expect(isNil('')).toBe(false);
        expect(isNil(NaN)).toBe(false);
        expect(isNil(false)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isNil(ref(null))).toBe(true);
        expect(isNil(ref(1))).toBe(false);
    });
});
```

`src/Helpers/Functions/negate.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { negate } from './negate';

describe('negate', () => {
    it('inverte o resultado do predicado', () => {
        const isPar = (n: number) => n % 2 === 0;
        expect(negate(isPar)(2)).toBe(false);
        expect(negate(isPar)(3)).toBe(true);
    });

    it('repassa todos os argumentos e o this', () => {
        const fn = negate(function (this: { base: number }, a: number, b: number) {
            return a + b > this.base;
        });
        expect(fn.call({ base: 10 }, 2, 3)).toBe(true);
    });
});
```

`src/Helpers/Utils/stubTrue.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { stubTrue } from './stubTrue';

describe('stubTrue', () => {
    it('retorna sempre true', () => {
        expect(stubTrue()).toBe(true);
    });

    it('ignora os argumentos recebidos', () => {
        expect((stubTrue as (...a: unknown[]) => boolean)(1, 2, 3)).toBe(true);
    });
});
```

`src/Helpers/Seq/tap.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { tap } from './tap';

describe('tap', () => {
    it('executa o interceptor e retorna o valor original', () => {
        const visto: number[] = [];
        const resultado = tap([1, 2, 3], (v) => { visto.push(...v); });
        expect(resultado).toEqual([1, 2, 3]);
        expect(visto).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(tap(ref([1, 2]), () => {})).toEqual([1, 2]);
    });
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npx vitest run src/Helpers/Lang src/Helpers/Functions src/Helpers/Utils src/Helpers/Seq`
Expected: FAIL — "Failed to resolve import" nos 4 arquivos (os fontes ainda não existem).

- [ ] **Step 3: Criar os 4 helpers-semente**

`src/Helpers/Lang/isNil.ts`:

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é `null` ou `undefined`.
 * Semelhante ao _.isNil do Lodash.
 *
 * @param value O valor a ser verificado.
 * @returns `true` quando o valor for `null` ou `undefined`.
 */
export function isNil(value: MaybeRefOrGetter<unknown>): boolean {
    return toValue(value) == null;
}
```

`src/Helpers/Functions/negate.ts`:

```typescript
/**
 * Cria uma função que nega o resultado do predicado informado.
 * Semelhante ao _.negate do Lodash.
 *
 * @param predicate O predicado a ser negado.
 * @returns A nova função negada.
 */
export function negate<T extends (...args: any[]) => any>(predicate: T): (...args: Parameters<T>) => boolean {
    if (typeof predicate !== 'function') throw new TypeError('Expected a function');

    return function (this: unknown, ...args: Parameters<T>): boolean {
        return !predicate.apply(this, args);
    };
}
```

`src/Helpers/Utils/stubTrue.ts`:

```typescript
/**
 * Retorna sempre `true`.
 * Semelhante ao _.stubTrue do Lodash.
 *
 * @returns Sempre `true`.
 */
export function stubTrue(): boolean {
    return true;
}
```

`src/Helpers/Seq/tap.ts`:

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Executa o interceptor com o valor e retorna o próprio valor.
 * Útil para inspecionar resultados intermediários numa cadeia.
 * Semelhante ao _.tap do Lodash.
 *
 * @param value O valor a ser repassado ao interceptor.
 * @param interceptor A função executada com o valor.
 * @returns O valor original.
 */
export function tap<T>(value: MaybeRefOrGetter<T>, interceptor: (value: T) => void): T {
    const data = toValue(value);
    interceptor(data);

    return data;
}
```

- [ ] **Step 4: Criar os 4 barrels**

Seguem o padrão de `src/Helpers/Validations/index.ts`: re-export flat + objeto namespace.

`src/Helpers/Lang/index.ts`:

```typescript
export * from './isNil';

import * as isNil from './isNil';

export const lang = {
    ...isNil
};
```

`src/Helpers/Functions/index.ts`:

```typescript
export * from './negate';

import * as negate from './negate';

export const functions = {
    ...negate
};
```

`src/Helpers/Utils/index.ts`:

```typescript
export * from './stubTrue';

import * as stubTrue from './stubTrue';

export const utils = {
    ...stubTrue
};
```

`src/Helpers/Seq/index.ts`:

```typescript
export * from './tap';

import * as tap from './tap';

export const seq = {
    ...tap
};
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

Run: `npx vitest run src/Helpers/Lang src/Helpers/Functions src/Helpers/Utils src/Helpers/Seq`
Expected: PASS (9 testes)

- [ ] **Step 6: Registrar as categorias em `src/index.ts`**

Adicionar aos imports (após a linha `import * as Format from './Helpers/Format';`):

```typescript
import * as Lang from './Helpers/Lang';
import * as Functions from './Helpers/Functions';
import * as Utils from './Helpers/Utils';
import * as Seq from './Helpers/Seq';
```

Adicionar aos re-exports (após `export * from './Helpers/Format';`):

```typescript
export * from './Helpers/Lang';
export * from './Helpers/Functions';
export * from './Helpers/Utils';
export * from './Helpers/Seq';
```

Adicionar ao objeto `ownHelpers` (após `...Format`):

```typescript
    ...Format,
    ...Lang,
    ...Functions,
    ...Utils,
    ...Seq
```

Atenção ao `comma-dangle: never`: `...Seq` é o último item e **não** leva vírgula.

- [ ] **Step 7: Registrar em `src/Helpers/maxUseItems.ts`**

Adicionar aos imports (após `import * as Format from './Format';`):

```typescript
import * as Lang from './Lang';
import * as Functions from './Functions';
import * as Utils from './Utils';
import * as Seq from './Seq';
```

E no array `modules`, após `Format,`:

```typescript
        Format,
        Lang,
        Functions,
        Utils,
        Seq,
        VueUse
```

- [ ] **Step 8: Registrar em `src/scripts/buildAutoImport.ts`**

Adicionar aos imports (após `import * as Format from '../Helpers/Format';`):

```typescript
import * as Lang from '../Helpers/Lang';
import * as Functions from '../Helpers/Functions';
import * as Utils from '../Helpers/Utils';
import * as Seq from '../Helpers/Seq';
```

E no array `modules` da função `maxUseItems`, após `Format,`:

```typescript
        Format,
        Lang,
        Functions,
        Utils,
        Seq,
        VueUse
```

- [ ] **Step 9: Registrar as entradas no `vite.config.ts`**

Em `build.lib.entry`, após a linha `format: path.resolve(__dirname, './src/Helpers/Format/index.ts'),`:

```typescript
                lang: path.resolve(__dirname, './src/Helpers/Lang/index.ts'),
                functions: path.resolve(__dirname, './src/Helpers/Functions/index.ts'),
                utils: path.resolve(__dirname, './src/Helpers/Utils/index.ts'),
                seq: path.resolve(__dirname, './src/Helpers/Seq/index.ts'),
```

- [ ] **Step 10: Registrar os subpaths no `package.json`**

No mapa `exports`, após o bloco `"./format"`:

```json
        "./lang": {
            "types": "./dist/Helpers/Lang/index.d.ts",
            "import": "./dist/lang.es.js"
        },
        "./functions": {
            "types": "./dist/Helpers/Functions/index.d.ts",
            "import": "./dist/functions.es.js"
        },
        "./utils": {
            "types": "./dist/Helpers/Utils/index.d.ts",
            "import": "./dist/utils.es.js"
        },
        "./seq": {
            "types": "./dist/Helpers/Seq/index.d.ts",
            "import": "./dist/seq.es.js"
        },
```

- [ ] **Step 11: Verificar o registro completo**

Run:

```bash
npx tsx -e "
import { maxUseItems } from './src/Helpers/maxUseItems';
const items = maxUseItems();
for (const nome of ['isNil', 'negate', 'stubTrue', 'tap']) {
    if (!items.includes(nome)) throw new Error('FALTA em maxUseItems: ' + nome);
}
console.log('OK — 4 categorias registradas em maxUseItems');
"
```

Expected: `OK — 4 categorias registradas em maxUseItems`

- [ ] **Step 12: Rodar lint, type-check e a suite completa**

Run: `npm run lint && npm run type-check && npm test`
Expected: os três passam.

- [ ] **Step 13: Commit**

```bash
git add src/Helpers/Lang src/Helpers/Functions src/Helpers/Utils src/Helpers/Seq src/index.ts src/Helpers/maxUseItems.ts src/scripts/buildAutoImport.ts vite.config.ts package.json
git commit -m "feat: adiciona categorias Lang, Functions, Utils e Seq"
```

---

### Task 3: Manifesto dos 281 helpers

O manifesto é a fonte da verdade da migração: define categoria, fase, dependências, aliases e peculiaridades de cada helper. Já foi construído e **validado** durante o planejamento (281 exatos, zero lacunas, zero extras, nenhuma dependência inválida ou apontando para fase posterior).

**Files:**
- Create: `lodash_migrate/manifest.ts`
- Create: `lodash_migrate/manifest.test.ts`

**Interfaces:**
- Consumes: as categorias da Task 2.
- Produces: `HELPERS: HelperEntry[]` (281 itens) e a interface `HelperEntry` com os campos `nome`, `categoria`, `fase`, `depende_de`, `alias_de?`, `nota?`. A Task 4 consome isto para gerar planos e `status.yaml`.

- [ ] **Step 1: Copiar o manifesto validado**

O arquivo está pronto em `/tmp/claude-1000/-home-johnattas-GitHub-MaxUse/0783e9a3-a7d9-4270-9c4a-98f428627b80/scratchpad/manifest.ts`.

```bash
mkdir -p lodash_migrate
cp /tmp/claude-1000/-home-johnattas-GitHub-MaxUse/0783e9a3-a7d9-4270-9c4a-98f428627b80/scratchpad/manifest.ts lodash_migrate/manifest.ts
```

Se o scratchpad não existir mais, o manifesto precisa ser reconstruído — sua distribuição validada é: fase 1 = 88, fase 2 = 47, fase 3 = 95, fase 4 = 29, fase 5 = 20; por categoria: Lang 46, Iterables 85, Objects 39, Utils 30, Functions 26, Strings 23, Seq 20, Math 10; 13 aliases.

- [ ] **Step 2: Escrever o teste de integridade do manifesto**

Criar `lodash_migrate/manifest.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import * as lodash from 'lodash-es';
import * as vueUse from '@vueuse/core';
import { HELPERS } from './manifest';
import { maxUseItems } from '../src/Helpers/maxUseItems';

/** Nomes do lodash-es que ainda não existem na MaxUse nem no VueUse. */
const faltantes = (): string[] => {
    const proprios = new Set(maxUseItems());
    return Object.keys(lodash)
        .filter((k) => !proprios.has(k))
        .filter((k) => !(k in vueUse))
        .sort();
};

describe('manifest', () => {
    it('cobre exatamente os helpers faltantes, sem lacunas nem extras', () => {
        const alvo = new Set(faltantes());
        const nomes = new Set(HELPERS.map((h) => h.nome));

        expect([...alvo].filter((k) => !nomes.has(k))).toEqual([]);
        expect([...nomes].filter((k) => !alvo.has(k))).toEqual([]);
    });

    it('não contém nomes duplicados', () => {
        const nomes = HELPERS.map((h) => h.nome);
        expect(nomes.length).toBe(new Set(nomes).size);
    });

    it('só declara dependências que existem no manifesto ou já na MaxUse', () => {
        const nomes = new Set(HELPERS.map((h) => h.nome));
        const proprios = new Set(maxUseItems());
        const invalidas = HELPERS.flatMap((h) =>
            h.depende_de.filter((d) => !nomes.has(d) && !proprios.has(d)).map((d) => `${h.nome} -> ${d}`)
        );

        expect(invalidas).toEqual([]);
    });

    it('nunca depende de um helper de fase posterior', () => {
        const fases = new Map(HELPERS.map((h) => [h.nome, h.fase]));
        const invertidas = HELPERS.flatMap((h) =>
            h.depende_de
                .filter((d) => fases.has(d) && (fases.get(d) as number) > h.fase)
                .map((d) => `${h.nome}(f${h.fase}) -> ${d}(f${fases.get(d)})`)
        );

        expect(invertidas).toEqual([]);
    });

    it('todo alias declara o original em depende_de', () => {
        const semDependencia = HELPERS
            .filter((h) => h.alias_de)
            .filter((h) => !h.depende_de.includes(h.alias_de as string))
            .map((h) => h.nome);

        expect(semDependencia).toEqual([]);
    });
});
```

- [ ] **Step 3: Rodar o teste e confirmar que passa**

Run: `npx vitest run lodash_migrate/manifest.test.ts`
Expected: PASS (5 testes).

Este teste é auto-corretivo: se a Task 2 registrou as 4 categorias corretamente, `maxUseItems()` já inclui `isNil`, `negate`, `stubTrue` e `tap`, e o teste exige que esses 4 **não** estejam mais listados como faltantes. Se falharem como "extra no manifesto", remova essas 4 entradas do `manifest.ts` — elas já foram implementadas na Task 2.

- [ ] **Step 4: Incluir `lodash_migrate` no escopo do Vitest**

O `vitest.config.ts` tem `include: ['src/**/*.test.ts']`, que não pega `lodash_migrate/`. Alterar para:

```typescript
        include: ['src/**/*.test.ts', 'lodash_migrate/**/*.test.ts'],
```

Run: `npm test`
Expected: a suite completa passa e inclui os 5 testes do manifesto.

- [ ] **Step 5: Commit**

```bash
git add lodash_migrate/manifest.ts lodash_migrate/manifest.test.ts vitest.config.ts
git commit -m "feat: adiciona manifesto validado dos 281 helpers do Lodash"
```

---

### Task 4: Gerador dos 281 planos e do status.yaml

Escrever 281 arquivos `.md` à mão é inviável e propenso a inconsistência. O gerador os produz a partir do manifesto, garantindo formato uniforme. Cada plano é curto e específico — o contrato comum vive em `CONVENTIONS.md` (Task 5), não repetido 281 vezes.

**Files:**
- Create: `lodash_migrate/generate.ts`
- Create: `lodash_migrate/plans/<Categoria>/<nome>.md` (281, gerados)
- Create: `lodash_migrate/status.yaml` (gerado)
- Modify: `package.json` (devDependency `js-yaml` + script)

**Interfaces:**
- Consumes: `HELPERS` e `HelperEntry` da Task 3.
- Produces: `lodash_migrate/plans/**/*.md` (281 arquivos) e `lodash_migrate/status.yaml` com a chave `helpers[]` (campos `nome`, `categoria`, `fase`, `plano`, `depende_de`, `tentativas`, `status_execucao`, `status_verificacao`) mais a chave `fases[]`. A Task 6 (`execution.md`) documenta o consumo deste YAML.

- [ ] **Step 1: Instalar a dependência de YAML**

```bash
npm install --save-dev js-yaml @types/js-yaml
```

- [ ] **Step 2: Escrever o gerador**

Criar `lodash_migrate/generate.ts`:

```typescript
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { HELPERS, type HelperEntry } from './manifest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOTAL_ESPERADO = 281;

const FASES = [
    { id: 1, nome: 'Primitivos sem dependência', detalhe: 'Lang, Math, Strings simples e Utils básicos.' },
    { id: 2, nome: 'Arrays e coleções', detalhe: 'Iterables sem iteratee e acesso básico a objetos.' },
    { id: 3, nome: 'Derivados de iteratee', detalhe: 'Coleções, objetos e strings que dependem do shorthand.' },
    { id: 4, nome: 'Functions e Utils', detalhe: 'Programação funcional e template.' },
    { id: 5, nome: 'Seq (chaining)', detalhe: 'Wrapper de encadeamento; depende do fechamento da fase 4.' }
];

/** Monta o conteúdo Markdown do plano de um helper. */
const planoDe = (h: HelperEntry): string => {
    const destino = `src/Helpers/${h.categoria}/${h.nome}.ts`;
    const teste = `src/Helpers/${h.categoria}/${h.nome}.test.ts`;
    const barrel = `src/Helpers/${h.categoria}/index.ts`;

    const deps = h.depende_de.length > 0
        ? h.depende_de.map((d) => `- \`${d}\``).join('\n')
        : '- Nenhuma.';

    const alias = h.alias_de
        ? `\n## Alias\n\nEste helper é um alias de \`${h.alias_de}\`. A implementação deve re-exportar o original, não duplicar a lógica:\n\n\`\`\`typescript\nexport { ${h.alias_de} as ${h.nome} } from './${h.alias_de}';\n\`\`\`\n\nSe o original estiver em outra categoria, ajuste o caminho relativo.\n`
        : '';

    const nota = h.nota
        ? `\n## Peculiaridade do Lodash\n\n${h.nota}\n\nEsta peculiaridade **precisa** de um caso de teste dedicado.\n`
        : '';

    return `# ${h.nome}

**Categoria:** ${h.categoria}
**Fase:** ${h.fase}
**Destino:** \`${destino}\`
**Teste:** \`${teste}\`
**Registro:** \`${barrel}\`

> Leia \`lodash_migrate/CONVENTIONS.md\` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

\`\`\`bash
node -e "const _=require('lodash'); console.log(_.${h.nome}.toString())"
\`\`\`

A documentação oficial está em https://lodash.com/docs#${h.nome}

O \`lodash-es\` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.
${alias}${nota}
## Dependências

${deps}

Todas devem estar com \`status_verificacao: Concluído\` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de \`null\`, \`undefined\`, tipos errados e valores-limite.
2. Criar \`${destino}\` seguindo o contrato do \`CONVENTIONS.md\`.
3. Registrar o export em \`${barrel}\` (re-export flat **e** entrada no objeto namespace).
4. Criar \`${teste}\` com a cobertura obrigatória descrita no \`CONVENTIONS.md\`.
5. Rodar \`npx vitest run ${teste}\` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar \`npm run lint && npm run type-check\`.

## Critérios de aprovação

- [ ] \`npx vitest run ${teste}\` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra \`lodash-es\`).
- [ ] Argumentos de dados aceitam \`MaybeRefOrGetter\` e usam \`toValue\`; callbacks **não**.
- [ ] Existe um caso de teste \`funciona com Ref\`.
- [ ] Exportado em \`${barrel}\` (flat + namespace).
- [ ] \`npm run lint\` e \`npm run type-check\` passam.
${h.nota ? `- [ ] Há teste dedicado para: ${h.nota}\n` : ''}`;
};

export const gerar = (): void => {
    if (HELPERS.length !== TOTAL_ESPERADO)
        throw new Error(`Manifesto com ${HELPERS.length} helpers; esperado ${TOTAL_ESPERADO}.`);

    const raizPlanos = path.resolve(__dirname, 'plans');
    fs.rmSync(raizPlanos, { recursive: true, force: true });

    for (const h of HELPERS) {
        const pasta = path.resolve(raizPlanos, h.categoria);
        fs.mkdirSync(pasta, { recursive: true });
        fs.writeFileSync(path.resolve(pasta, `${h.nome}.md`), planoDe(h));
    }

    const status = {
        total: HELPERS.length,
        fases: FASES,
        helpers: HELPERS.map((h) => ({
            nome: h.nome,
            categoria: h.categoria,
            fase: h.fase,
            plano: `plans/${h.categoria}/${h.nome}.md`,
            depende_de: h.depende_de,
            tentativas: 0,
            status_execucao: 'Aguardando',
            status_verificacao: 'Aguardando'
        }))
    };

    fs.writeFileSync(
        path.resolve(__dirname, 'status.yaml'),
        yaml.dump(status, { lineWidth: 120, noRefs: true })
    );

    console.log(`Gerados ${HELPERS.length} planos em lodash_migrate/plans e o status.yaml`);
};

if (import.meta.url === `file://${process.argv[1]}`) gerar();
```

- [ ] **Step 3: Rodar o gerador**

Run: `npx tsx lodash_migrate/generate.ts`
Expected: `Gerados 281 planos em lodash_migrate/plans e o status.yaml`

- [ ] **Step 4: Verificar a saída**

Run:

```bash
find lodash_migrate/plans -name '*.md' | wc -l
npx tsx -e "
import fs from 'node:fs';
import yaml from 'js-yaml';
const s: any = yaml.load(fs.readFileSync('lodash_migrate/status.yaml', 'utf8'));
if (s.helpers.length !== 281) throw new Error('status.yaml com ' + s.helpers.length);
const pendentes = s.helpers.filter((h: any) => h.status_execucao !== 'Aguardando');
if (pendentes.length) throw new Error('status inicial incorreto');
for (const h of s.helpers) if (!fs.existsSync('lodash_migrate/' + h.plano)) throw new Error('plano ausente: ' + h.plano);
console.log('OK — 281 planos, status.yaml íntegro, todos os caminhos resolvem');
"
```

Expected: `281` seguido de `OK — 281 planos, status.yaml íntegro, todos os caminhos resolvem`

- [ ] **Step 5: Inspecionar dois planos gerados**

Run: `cat lodash_migrate/plans/Iterables/compact.md && cat lodash_migrate/plans/Objects/entries.md`
Expected: `compact.md` traz a nota sobre valores falsy; `entries.md` traz a seção **Alias** apontando para `toPairs`. Se algum estiver com placeholder ou seção vazia, corrigir `planoDe` e regerar.

- [ ] **Step 6: Adicionar o script ao `package.json`**

Em `scripts`, adicionar:

```json
        "migrate:generate": "npx tsx lodash_migrate/generate.ts",
```

- [ ] **Step 7: Commit**

```bash
git add lodash_migrate/generate.ts lodash_migrate/plans lodash_migrate/status.yaml package.json package-lock.json
git commit -m "feat: gera os 281 planos de migração e o status.yaml"
```

---

### Task 5: CONVENTIONS.md e DIVERGENCES.md

`CONVENTIONS.md` é o contrato que os 281 planos referenciam. `DIVERGENCES.md` documenta os 36 nomes onde a MaxUse diverge do Lodash, acompanhado de uma suite que trava essa divergência — sem ela, um agente futuro "consertaria" a divergência achando que é bug.

**Files:**
- Create: `lodash_migrate/CONVENTIONS.md`
- Create: `lodash_migrate/DIVERGENCES.md`
- Create: `src/Helpers/divergences.test.ts`

**Interfaces:**
- Consumes: precedência corrigida da Task 1.
- Produces: contrato textual referenciado por todos os planos; suite `divergences.test.ts` que falha se algum helper próprio for silenciosamente substituído pela semântica do Lodash.

- [ ] **Step 1: Levantar os 36 nomes conflitantes**

Run:

```bash
npx tsx -e "
import * as lodash from 'lodash-es';
import { maxUseItems } from './src/Helpers/maxUseItems';
const proprios = new Set(maxUseItems());
const conflitos = Object.keys(lodash).filter((k) => proprios.has(k)).sort();
console.log(conflitos.length);
console.log(conflitos.join('\n'));
"
```

Expected: 36 nomes (`camelCase`, `capitalize`, `chunk`, `cloneDeep`, `countBy`, `filter`, `findLast`, `first`, `get`, `groupBy`, `isArray`, `isDate`, `isEmpty`, `isEqual`, `isNumber`, `isObject`, `kebabCase`, `keyBy`, `last`, `mapValues`, `now`, `omit`, `orderBy`, `pick`, `sample`, `set`, `shuffle`, `size`, `snakeCase`, `sortBy`, `sum`, `sumBy`, `toNumber`, `truncate`, `uniq`, `unset`). O número pode subir se a Task 2 tiver adicionado nomes — nesse caso use a saída real.

- [ ] **Step 2: Escrever o `CONVENTIONS.md`**

Criar `lodash_migrate/CONVENTIONS.md`:

````markdown
# Convenções de implementação

Contrato obrigatório para todos os 281 helpers da migração. Os planos individuais
em `plans/` referenciam este arquivo em vez de repetir estas regras.

## Estilo (ESLint — `eslint.config.js`)

- Indentação de **4 espaços**.
- **Aspas simples**.
- **Ponto-e-vírgula** sempre.
- **Sem trailing comma** (`comma-dangle: never`).
- `curly: multi` — corpo de uma única instrução fica inline, sem chaves:
  `if (!data) return [];`
- `object-curly-spacing: always` → `{ a, b }`.
- `arrow-parens: always` → `(x) => x`.
- Máximo de 2 linhas vazias consecutivas.
- JSDoc e comentários **em português**.

## Assinatura do helper

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * <descrição em português>
 * Semelhante ao _.<nome> do Lodash.
 *
 * @param <arg> <descrição>
 * @returns <descrição>
 */
export function nome<T>(arg: MaybeRefOrGetter<T[]>, opt: number = 1): T[] {
    const data = toValue(arg);
    if (!data || data.length === 0) return [];

    // ...
}
```

### Reatividade — a regra que mais causa erro

`MaybeRefOrGetter` + `toValue()` valem **apenas para argumentos de dados**:
arrays, objetos, strings, números.

**Callbacks, iteratees e comparadores permanecem funções puras.** Envolver um
callback em `toValue` quebraria `filter(arr, fn)`, porque `toValue` invocaria a
função como getter em vez de repassá-la como predicado.

```typescript
// certo
export function takeWhile<T>(array: MaybeRefOrGetter<T[]>, predicate: (v: T) => boolean): T[] {
    const data = toValue(array);
    // ...
}

// errado — nunca faça isto
export function takeWhile<T>(array: MaybeRefOrGetter<T[]>, predicate: MaybeRefOrGetter<(v: T) => boolean>): T[] {
    const fn = toValue(predicate); // invoca o predicado sem argumentos
}
```

O retorno é sempre **valor plano**, nunca `ComputedRef`.

## Registro no barrel

Cada categoria tem um `index.ts` com re-export flat **e** objeto namespace
(padrão de `src/Helpers/Validations/index.ts`). Ambos precisam ser atualizados:

```typescript
export * from './nomeDoHelper';

import * as nomeDoHelper from './nomeDoHelper';

export const <namespace> = {
    ...nomeDoHelper
};
```

Namespaces por categoria: `Lang` → `lang`, `Functions` → `functions`,
`Utils` → `utils`, `Seq` → `seq`, `Iterables` → (ver o `index.ts` da categoria),
`Objects`, `Strings`, `Math` → idem.

## Teste colocalizado

Arquivo `<nome>.test.ts` ao lado do fonte. Cobertura **obrigatória**:

1. Casos de paridade com o comportamento documentado do Lodash.
2. Edge cases: `null`, `undefined`, coleção vazia, tipo errado.
3. Um caso **`funciona com Ref`**:
   ```typescript
   it('funciona com Ref', () => {
       expect(nome(ref([1, 2, 3]))).toEqual(esperado);
   });
   ```
4. A peculiaridade citada no plano do helper, quando houver.

Modelo:

```typescript
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { nome } from './nome';

describe('nome', () => {
    it('faz o caso principal', () => {
        expect(nome([1, 2, 3])).toEqual(esperado);
    });

    it('retorna vazio para null', () => {
        expect(nome(null as any)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(nome(ref([1, 2, 3]))).toEqual(esperado);
    });
});
```

## Oráculo de paridade

Enquanto `lodash-es` estiver instalado, use-o para conferir casos-limite durante
o desenvolvimento:

```typescript
import * as lodash from 'lodash-es';
expect(nome(entrada)).toEqual(lodash.nome(entrada));
```

**Estes imports são temporários.** Antes de marcar o helper como concluído,
troque a asserção pelo valor literal observado — o valor esperado precisa ficar
gravado no teste, para que ele continue válido depois que o Lodash for removido:

```typescript
// depois
expect(nome(entrada)).toEqual([1, 2, 3]);
```

## Comandos

```bash
npx vitest run src/Helpers/<Categoria>/<nome>.test.ts   # teste do helper
npm run lint                                            # ESLint com --fix
npm run type-check                                      # vue-tsc --noEmit
npm test                                                # suite completa
```
````

- [ ] **Step 3: Escrever o `DIVERGENCES.md`**

Criar `lodash_migrate/DIVERGENCES.md` (use a lista real obtida no Step 1):

````markdown
# Divergências intencionais em relação ao Lodash

A MaxUse já possuía implementações próprias para 36 nomes que também existem no
Lodash. Por decisão de design, **os helpers próprios vencem**: `_.get` é o `get`
da MaxUse, não o do Lodash.

Consequência: o `_` **não é** um drop-in replacement fiel do Lodash nestes nomes.
Quem migra de `lodash` para `@maxvue/max-use` precisa revisar os usos abaixo.

## Nomes afetados

`camelCase`, `capitalize`, `chunk`, `cloneDeep`, `countBy`, `filter`, `findLast`,
`first`, `get`, `groupBy`, `isArray`, `isDate`, `isEmpty`, `isEqual`, `isNumber`,
`isObject`, `kebabCase`, `keyBy`, `last`, `mapValues`, `now`, `omit`, `orderBy`,
`pick`, `sample`, `set`, `shuffle`, `size`, `snakeCase`, `sortBy`, `sum`, `sumBy`,
`toNumber`, `truncate`, `uniq`, `unset`.

## Diferenças conhecidas

Preencher conforme cada divergência for confirmada durante a migração. Formato:

### `<nome>`

- **Lodash:** `<assinatura>` — `<comportamento>`
- **MaxUse:** `<assinatura>` — `<comportamento>`
- **Impacto:** `<o que quebra ao migrar>`

## Como esta divergência é protegida

`src/Helpers/divergences.test.ts` verifica que cada um destes nomes, dentro de `_`,
aponta para a implementação da MaxUse. Se alguém trocar por uma versão fiel ao
Lodash, o teste falha — a divergência é intencional, não um bug a ser corrigido.
````

- [ ] **Step 4: Escrever o teste de divergência**

Criar `src/Helpers/divergences.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import * as lodash from 'lodash-es';
import { _ } from '../index';
import { maxUseItems } from './maxUseItems';

/**
 * Nomes presentes tanto no Lodash quanto nos helpers próprios da MaxUse.
 * A precedência é intencional: os próprios vencem.
 */
const conflitos = (): string[] => {
    const proprios = new Set(maxUseItems());
    return Object.keys(lodash).filter((k) => proprios.has(k)).sort();
};

describe('divergências intencionais em relação ao Lodash', () => {
    it('nenhum nome conflitante aponta para a implementação do Lodash', () => {
        const vazados = conflitos().filter(
            (nome) => (_ as Record<string, unknown>)[nome] === (lodash as Record<string, unknown>)[nome]
        );

        expect(vazados).toEqual([]);
    });

    it('todos os nomes conflitantes continuam definidos em _', () => {
        const ausentes = conflitos().filter((nome) => (_ as Record<string, unknown>)[nome] === undefined);

        expect(ausentes).toEqual([]);
    });
});
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `npx vitest run src/Helpers/divergences.test.ts`
Expected: PASS (2 testes). Se falhar em "nenhum nome conflitante aponta para a implementação do Lodash", a correção da Task 1 não está funcionando — voltar e revisar.

- [ ] **Step 6: Rodar lint e a suite completa**

Run: `npm run lint && npm test`
Expected: ambos passam.

- [ ] **Step 7: Commit**

```bash
git add lodash_migrate/CONVENTIONS.md lodash_migrate/DIVERGENCES.md src/Helpers/divergences.test.ts
git commit -m "docs: adiciona convenções e trava as divergências intencionais do Lodash"
```

---

### Task 6: execution.md — protocolo do agente executor

Este é o arquivo que o usuário vai invocar noutra sessão. Precisa ser autossuficiente: o agente que o ler não terá o contexto desta conversa.

**Files:**
- Create: `lodash_migrate/execution.md`

**Interfaces:**
- Consumes: `status.yaml` e `plans/` da Task 4; `CONVENTIONS.md` da Task 5.
- Produces: protocolo executável de ponta a ponta. Nada depende desta task.

- [ ] **Step 1: Escrever o `execution.md`**

Criar `lodash_migrate/execution.md`:

````markdown
# Execução — Independência do Lodash

Você vai implementar, em loop, os 281 helpers que substituem o `lodash-es` na
`@maxvue/max-use`. Rode até que **todos** estejam com `status_execucao: Concluído`
e `status_verificacao: Concluído`.

## Antes de começar

1. Confirme que está num worktree isolado, nunca na árvore principal:
   ```bash
   git worktree list
   ```
   Se não estiver, crie:
   ```bash
   git worktree add ../MaxUse-wt-lodash-migrate -b lodash-migrate
   cd ../MaxUse-wt-lodash-migrate && npm install
   ```
2. Leia `lodash_migrate/CONVENTIONS.md` por inteiro. É o contrato de estilo,
   reatividade e teste de todos os helpers.
3. Abra `lodash_migrate/status.yaml`. É o estado da migração e a sua fila de trabalho.

## Escolha do próximo item

Percorra `status.yaml` e selecione o **primeiro** helper que satisfaça as três condições:

1. Pertence à **fase aberta** mais baixa (uma fase só abre quando a anterior fecha
   por completo — ver "Gate de fase");
2. Todas as suas `depende_de` estão com `status_verificacao: Concluído`
   (ou já existiam na MaxUse antes da migração);
3. Não está `Bloqueado`.

Não siga ordem alfabética — a ordem de dependência é o que importa.

## Máquina de estados

Para o item escolhido, olhe `status_execucao`:

- **`Realizando`** → alguém parou no meio. Verifique o que já existe
  (`src/Helpers/<Categoria>/<nome>.ts` e o `.test.ts`) e **continue de onde parou**.
- **`Aguardando`** → troque para `Realizando` e inicie a execução.
- **`Concluído`** → olhe `status_verificacao`:
  - **`Realizando`** → a verificação foi interrompida. **Reinicie a verificação do zero.**
  - **`Aguardando`** → troque para `Realizando` e inicie a verificação.
  - **`Concluído`** → vá para o próximo item.

Grave o `status.yaml` a cada transição, para que uma interrupção não perca o progresso.

## Processo de execução

1. Leia o plano do helper (campo `plano` no `status.yaml`).
2. Leia a implementação original do Lodash:
   ```bash
   node -e "const _=require('lodash'); console.log(_.<nome>.toString())"
   ```
   Mapeie **todos** os comportamentos observáveis, incluindo `null`, `undefined`,
   tipos errados e valores-limite.
3. Crie `src/Helpers/<Categoria>/<nome>.ts` seguindo o `CONVENTIONS.md`.
4. Registre no `index.ts` da categoria (re-export flat **e** objeto namespace).
5. Crie `src/Helpers/<Categoria>/<nome>.test.ts` com a cobertura obrigatória.
6. Rode até passar:
   ```bash
   npx vitest run src/Helpers/<Categoria>/<nome>.test.ts
   ```
7. **Revise o teste em busca de brechas.** Pergunte-se: algum comportamento do
   original ficou sem asserção? O teste passaria com uma implementação errada?
   Se sim, reforce o teste — e corrija o helper se ele estiver errado.
8. Rode `npm run lint && npm run type-check`.
9. Marque `status_execucao: Concluído` e passe para a verificação.

## Verificação

1. Dispare um **subagente com modelo Opus 5** com este briefing:

   > Verifique o helper `<nome>` em `src/Helpers/<Categoria>/<nome>.ts` e seu teste
   > em `src/Helpers/<Categoria>/<nome>.test.ts`.
   >
   > Compare com o comportamento do `_.<nome>` do Lodash (o `lodash-es` está
   > instalado — use-o como oráculo). Verifique:
   > 1. Paridade de comportamento, incluindo `null`, `undefined`, coleção vazia,
   >    tipos errados e valores-limite;
   > 2. Aderência ao `lodash_migrate/CONVENTIONS.md` (estilo ESLint, JSDoc em
   >    português, `toValue` só nos argumentos de dados, callbacks intocados);
   > 3. Se o teste tem brechas — ele passaria com uma implementação errada?
   > 4. Se o helper está exportado no `index.ts` da categoria (flat + namespace).
   >
   > Rode `npx vitest run src/Helpers/<Categoria>/<nome>.test.ts`,
   > `npm run lint` e `npm run type-check`.
   >
   > Responda APROVADO ou REPROVADO. Se REPROVADO, liste os problemas concretos.

2. Aguarde a conclusão.
3. **Aprovado** → `status_verificacao: Concluído`, commit, próximo item:
   ```bash
   git add src/Helpers/<Categoria>/<nome>.ts src/Helpers/<Categoria>/<nome>.test.ts src/Helpers/<Categoria>/index.ts lodash_migrate/status.yaml
   git commit -m "feat: implementa <nome> (migração Lodash)"
   ```
4. **Reprovado** → incremente `tentativas`, volte `status_execucao` para
   `Realizando` e corrija os problemas apontados.

## Limite de tentativas

Se `tentativas` chegar a **3**, marque `status_execucao: Bloqueado`, registre o
motivo num comentário do `status.yaml` e **siga para o próximo item**. Não gire em
loop no mesmo helper — os bloqueados são revisados manualmente ao final.

## Gate de fase

Ao concluir o último helper de uma fase, antes de abrir a fase seguinte:

```bash
npm run lint && npm run type-check && npm test
```

Os três precisam passar. Um helper passar no próprio teste não garante que o
conjunto compila nem que não houve colisão de nomes no `_`.

```bash
git commit -m "chore: fecha a fase <N> da migração do Lodash"
```

## Encerramento (só depois dos 281)

Quando todos os itens estiverem `Concluído`/`Concluído`:

1. Remova o Lodash de `src/index.ts` — apague o `import * as lodash from 'lodash-es';`
   e todo o bloco `filteredLodash`, deixando:
   ```typescript
   export const _ = {
       ...ownHelpers,
       ...filteredVueUse
   };
   ```
2. Remova `lodash-es` das `dependencies` do `package.json`:
   ```bash
   npm uninstall lodash-es @types/lodash-es
   ```
3. Remova os imports de `lodash-es` que sobraram nos testes (o oráculo de paridade),
   substituindo as asserções por valores literais:
   ```bash
   grep -rn "lodash-es" src/ lodash_migrate/
   ```
   Exceção: `src/Helpers/divergences.test.ts` e `lodash_migrate/manifest.test.ts`
   usam o Lodash como referência. Ambos precisam ser reescritos para uma lista
   estática de nomes, ou removidos, já que a dependência deixou de existir.
4. Regenere os dados de auto-import:
   ```bash
   npx tsx src/scripts/buildAutoImport.ts
   ```
5. Validação final:
   ```bash
   npm run lint && npm run type-check && npm test && npm run build
   ```
6. Confirme que o `_` expõe todos os nomes esperados:
   ```bash
   npx tsx -e "
   import { _ } from './src/index';
   console.log('total em _:', Object.keys(_).length);
   for (const n of ['curry', 'compact', 'template', 'chain', 'debounce'])
       if (!(n in _)) throw new Error('FALTA: ' + n);
   console.log('OK');
   "
   ```
7. Commit e integre no `main`:
   ```bash
   git add -A
   git commit -m "feat!: remove a dependência do lodash-es"
   cd /home/johnattas/GitHub/MaxUse
   git merge lodash-migrate
   ```

## Regras que não podem ser quebradas

1. **Nunca** edite `src/Helpers/autoImportData.json` à mão — é gerado pelo `prebuild`.
2. **Nunca** remova o `lodash-es` antes dos 281 concluídos — ele é a rede de
   segurança e o oráculo dos testes.
3. **Nunca** envolva callbacks/iteratees em `toValue`.
4. Os 36 nomes conflitantes (ver `DIVERGENCES.md`) mantêm a semântica da MaxUse.
   Não os "conserte" para bater com o Lodash.
5. Atualize o `status.yaml` a cada transição de estado, não só no fim.
````

- [ ] **Step 2: Verificar a consistência dos caminhos citados**

Run:

```bash
npx tsx -e "
import fs from 'node:fs';
const doc = fs.readFileSync('lodash_migrate/execution.md', 'utf8');
for (const alvo of ['lodash_migrate/CONVENTIONS.md', 'lodash_migrate/status.yaml', 'src/index.ts', 'src/scripts/buildAutoImport.ts', 'src/Helpers/divergences.test.ts']) {
    if (!doc.includes(alvo.replace('lodash_migrate/', ''))) throw new Error('execution.md não cita: ' + alvo);
    if (!fs.existsSync(alvo)) throw new Error('caminho citado não existe: ' + alvo);
}
console.log('OK — todos os caminhos citados no execution.md existem');
"
```

Expected: `OK — todos os caminhos citados no execution.md existem`

- [ ] **Step 3: Commit**

```bash
git add lodash_migrate/execution.md
git commit -m "docs: adiciona protocolo de execução da migração do Lodash"
```

---

### Task 7: Validação end-to-end do conjunto

Antes de entregar, confirmar que o conjunto está íntegro e que o build multi-entry funciona com as 4 categorias novas — um erro de configuração aqui só apareceria depois de dezenas de helpers implementados.

**Files:**
- Create: `lodash_migrate/integrity.test.ts`

**Interfaces:**
- Consumes: todos os artefatos das Tasks 1-6.
- Produces: suite de integridade que roda em `npm test`.

- [ ] **Step 1: Escrever o teste de integridade**

Criar `lodash_migrate/integrity.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { HELPERS } from './manifest';

interface StatusItem {
    nome: string;
    categoria: string;
    fase: number;
    plano: string;
    depende_de: string[];
    tentativas: number;
    status_execucao: string;
    status_verificacao: string;
}

const RAIZ = path.resolve(__dirname);
const status = yaml.load(fs.readFileSync(path.resolve(RAIZ, 'status.yaml'), 'utf8')) as {
    total: number;
    fases: { id: number; nome: string }[];
    helpers: StatusItem[];
};

describe('integridade do conjunto lodash_migrate', () => {
    it('o status.yaml cobre exatamente o manifesto', () => {
        expect(status.helpers.length).toBe(HELPERS.length);
        expect(status.helpers.map((h) => h.nome).sort()).toEqual(HELPERS.map((h) => h.nome).sort());
    });

    it('existe um arquivo de plano para cada helper', () => {
        const ausentes = status.helpers
            .filter((h) => !fs.existsSync(path.resolve(RAIZ, h.plano)))
            .map((h) => h.plano);

        expect(ausentes).toEqual([]);
    });

    it('nenhum plano contém placeholders', () => {
        const suspeitos: string[] = [];

        for (const h of status.helpers) {
            const conteudo = fs.readFileSync(path.resolve(RAIZ, h.plano), 'utf8');
            if (/\bTBD\b|\bTODO\b|preencher aqui/i.test(conteudo)) suspeitos.push(h.plano);
        }

        expect(suspeitos).toEqual([]);
    });

    it('todo plano cita o caminho de destino e o de teste', () => {
        const incompletos = status.helpers.filter((h) => {
            const conteudo = fs.readFileSync(path.resolve(RAIZ, h.plano), 'utf8');
            return !conteudo.includes(`src/Helpers/${h.categoria}/${h.nome}.ts`)
                || !conteudo.includes(`src/Helpers/${h.categoria}/${h.nome}.test.ts`);
        }).map((h) => h.plano);

        expect(incompletos).toEqual([]);
    });

    it('todos começam com os status iniciais corretos', () => {
        const invalidos = status.helpers.filter(
            (h) => h.status_execucao !== 'Aguardando' || h.status_verificacao !== 'Aguardando' || h.tentativas !== 0
        ).map((h) => h.nome);

        expect(invalidos).toEqual([]);
    });

    it('declara as 5 fases', () => {
        expect(status.fases.map((f) => f.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it('as 4 categorias novas existem no código-fonte', () => {
        for (const cat of ['Lang', 'Functions', 'Utils', 'Seq'])
            expect(fs.existsSync(path.resolve(RAIZ, '..', 'src', 'Helpers', cat, 'index.ts'))).toBe(true);
    });

    it('os documentos de apoio existem', () => {
        for (const doc of ['CONVENTIONS.md', 'DIVERGENCES.md', 'execution.md'])
            expect(fs.existsSync(path.resolve(RAIZ, doc))).toBe(true);
    });
});
```

- [ ] **Step 2: Rodar o teste de integridade**

Run: `npx vitest run lodash_migrate/integrity.test.ts`
Expected: PASS (8 testes)

- [ ] **Step 3: Rodar a suite completa**

Run: `npm test`
Expected: todos passam — inclui `precedence`, `divergences`, `manifest`, `integrity` e os 4 helpers-semente.

- [ ] **Step 4: Rodar o build**

Run: `npm run build`
Expected: build conclui sem erro e gera os 4 novos bundles.

```bash
ls dist/lang.es.js dist/functions.es.js dist/utils.es.js dist/seq.es.js
```

Expected: os 4 arquivos existem. Se faltarem, revisar `build.lib.entry` no `vite.config.ts` (Task 2, Step 9).

- [ ] **Step 5: Confirmar que o auto-import foi regenerado**

O `prebuild` roda automaticamente no `npm run build`.

Run:

```bash
npx tsx -e "
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('src/Helpers/autoImportData.json', 'utf8'));
const nomes: string[] = data[0]['@maxvue/max-use'];
for (const n of ['isNil', 'negate', 'stubTrue', 'tap'])
    if (!nomes.includes(n)) throw new Error('FALTA no auto-import: ' + n);
console.log('OK — auto-import inclui as categorias novas');
"
```

Expected: `OK — auto-import inclui as categorias novas`

- [ ] **Step 6: Commit**

```bash
git add lodash_migrate/integrity.test.ts src/Helpers/autoImportData.json
git commit -m "test: valida a integridade do conjunto de migração do Lodash"
```

---

### Task 8: Integração no main

O conjunto está pronto para a sessão de execução. O CLAUDE.md exige integrar o worktree no `main` após validação.

**Files:**
- Nenhum arquivo novo.

**Interfaces:**
- Consumes: todos os artefatos validados na Task 7.
- Produces: `main` com o conjunto `lodash_migrate/` pronto para consumo.

- [ ] **Step 1: Revisar o diff completo**

Run: `git diff main --stat`
Expected: mudanças em `src/index.ts`, `src/Helpers/maxUseItems.ts`, `src/scripts/buildAutoImport.ts`, `vite.config.ts`, `package.json`, `vitest.config.ts`; arquivos novos em `src/Helpers/{Lang,Functions,Utils,Seq}/` e `lodash_migrate/`. Nenhum helper dos 281 implementado além dos 4 semente — isso é esperado.

- [ ] **Step 2: Validação final antes do merge**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: os quatro passam.

- [ ] **Step 3: Integrar no main**

```bash
cd /home/johnattas/GitHub/MaxUse
git merge lodash-migrate
npm test
```

Expected: merge sem conflito, suite passa na árvore principal.

- [ ] **Step 4: Remover o worktree**

```bash
git worktree remove ../MaxUse-wt-lodash-migrate
```

O branch `lodash-migrate` permanece — a sessão de execução vai recriá-lo ou reutilizá-lo.

- [ ] **Step 5: Informar o usuário**

O conjunto está pronto. Para executar a migração, abrir uma **nova sessão** do Claude Code e apontar para `lodash_migrate/execution.md`.

---

## Self-Review

**1. Cobertura da spec:**

| Requisito da spec | Task |
|---|---|
| Mapear os helpers lodash faltantes | Task 3 (manifesto validado, 281) |
| Criar a pasta `lodash_migrate` | Task 3, Step 1 |
| Plano de implementação dos helpers | Tasks 3-4 |
| Um `.md` por helper analisando o original | Task 4 (gerador; cada plano cita a fonte e a peculiaridade) |
| `execution.md` | Task 6 |
| `status.yaml` com os 3 status | Task 4 (gerado com `Aguardando`/`Realizando`/`Concluído`) |
| 4 categorias novas + 5 pontos de registro | Task 2 |
| Correção de precedência | Task 1 |
| `DIVERGENCES.md` + teste de divergência | Task 5 |
| `CONVENTIONS.md` | Task 5 |
| Reatividade com `toValue` | Constraints globais + `CONVENTIONS.md` |
| Helpers exportados dentro de `_` | Task 1 (precedência) + Task 2 (registro) |
| Loop até todos concluídos | Task 6 (`execution.md`) |
| Verificação por subagente Opus 5 | Task 6 (briefing textual) |
| Worktree | Task 1, Step 1 + Task 8 |
| `template` com `new Function` | Manifesto (fase 4, nota de risco CSP) |

**2. Placeholders:** nenhum "TBD"/"TODO" em passos de código. `DIVERGENCES.md` tem uma seção a preencher durante a execução — é intencional e está declarado como tal, e o teste de integridade só varre `plans/`, não esse arquivo.

**3. Consistência de tipos:** `HelperEntry` (Task 3) tem os campos consumidos por `generate.ts` (Task 4: `nome`, `categoria`, `fase`, `depende_de`, `alias_de`, `nota`) e pelo `integrity.test.ts` (Task 7). A interface `StatusItem` (Task 7) espelha os campos emitidos pelo gerador. Os namespaces das 4 categorias (`lang`, `functions`, `utils`, `seq`) são consistentes entre a Task 2 e o `CONVENTIONS.md`.

**Riscos conhecidos:**
- `isNil`, `negate`, `stubTrue` e `tap` são implementados na Task 2 como sementes e **continuam no manifesto** (decisão do parceiro humano). O teste de integridade da Task 3 compara contra a **linha de base pré-migração**, descontando essas 4 sementes de `maxUseItems()`, e o `status.yaml` as emite já como `Concluído`/`Concluído`. Total permanece 281; a fila efetiva da sessão de execução tem 277.
- `chain`/Seq depende de um registro de todos os helpers para montar os métodos do wrapper. A fase 5 é a mais arriscada e pode exigir refinamento do plano quando chegar a vez.
