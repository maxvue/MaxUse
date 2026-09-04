# Plano de Implementação - Issue #3

## [Audit] keyBy/filter/findLast/groupBy/orderBy não aceitam os shorthands de iteratee do Lodash

---

### Descrição e Causa Raiz

#### 1. Descrição do Problema e Agravantes
Na versão 2.0.0 da biblioteca `@maxvue/max-use`, a dependência legada `lodash-es` foi descontinuada e substituída por reimplementações nativas e composables otimizados para Vue 3. Entretanto, cinco funções essenciais de iteração de coleções (`keyBy`, `filter`, `findLast`, `groupBy` e `orderBy`) foram implementadas assumindo contratos excessivamente restritos para seus Iteratees/Predicates, divergindo drasticamente do contrato universal estabelecido pelo Lodash e assumido como padrão pela biblioteca.

O contrato canônico do Lodash para coleções estipula que Iteratees aceitam **quatro formatos polimórficos**:
1. **Função customizada:** `(value, key/index, collection) => result`
2. **Property shorthand (string / caminho profundo):** `'prop'` ou `'deep.nested.property'` (resolvido por consulta navegacional profunda)
3. **MatchesProperty shorthand (tupla array):** `['key', value]` ou `['nested.path', value]`
4. **Matches shorthand (objeto plano):** `{ status: 'active', role: 'admin' }` (validação de correspondência parcial de atributos)

Nas implementações originais em `dev`, esses formatos não são suportados de maneira uniforme e geram dois modos severos de falha:
- **Lançamento de Exceções em Tempo de Execução (`TypeError`):** Em `filter` e `findLast`, o parâmetro de avaliação é invocado cegamente como função (`callback(item)` ou `predicate(data[i], i, data)`). Quando o consumidor envia uma string, objeto ou tupla, ocorre erro de execução imediato (`TypeError: callback is not a function` / `TypeError: predicate is not a function`), abortando a renderização ou rotina consumidora.
- **Corrupção e Perda Silenciosa de Dados (Pior Cenário):** Em `keyBy` e `groupBy`, a passagem de uma função no caso do `keyBy` (`keyBy(items, u => u.id)`) ou de uma string com notação pontuada aninhada no `groupBy` (`groupBy(items, 'category.id')`) tenta indexar os itens via chave direta `item[key]`. Como `key` é uma função ou uma string pontuada que não existe como chave direta plana no objeto, `item[key]` avalia como `undefined`. O resultado é agrupado ou indexado sob a chave string `"undefined"`. No caso do `keyBy`, cada registro sucessivo sobrescreve o anterior na chave `"undefined"`, **descartando silenciosamente todos os itens da coleção exceto o último**, sem emitir qualquer aviso ou exceção.

#### 2. Causa Raiz Comprovada
A causa raiz reside no fato de nenhuma dessas cinco funções normalizar o argumento recebido com o utilitário canônico já existente na biblioteca [`src/Helpers/Utils/iteratee.ts:L23-31`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Utils/iteratee.ts#L23-L31), somado à tipagem TypeScript que anteriormente restringia a assinatura a callbacks ou strings planas, ou que, em tentativas anteriores de correção, utilizou uniões com `unknown` (ex.: `predicate?: unknown` ou `Criterion<T> = ... | unknown`), colapsando a união do TypeScript para `unknown` e destruindo a inferência de tipo contextual (*contextual typing*) dos parâmetros em callbacks anônimos.

Evidências pontuais e comprovadas nos arquivos-fonte da branch base `dev`:

1. **`keyBy` — [`src/Helpers/Iterables/keyBy.ts:L12-24`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/keyBy.ts#L12-L24)**
   - *Código original em `dev`:*
     ```typescript
     export function keyBy(collection: MaybeRefOrGetter<T | any[]>, key: string): Record<string, T> {
         ...
         return Object.fromEntries(items.map((item) => [String(item[key]), item]));
     }
     ```
   - *Comprovação causal:* O parâmetro `key` é forçado como `string` na tipagem e indexa diretamente `item[key]`. Se uma função `u => u.id` é passada, `item[key]` tenta acessar a propriedade `"u => u.id"`, que é `undefined`. O retorno colapsa todos os elementos em `result["undefined"]`, retendo apenas o último registro. Também falha com strings de caminho profundo (ex.: `'profile.id'`), objetos matches e tuplas.

2. **`filter` — [`src/Helpers/Iterables/filter.ts:L12-21`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/filter.ts#L12-L21)**
   - *Código original em `dev`:*
     ```typescript
     export function filter(collection: MaybeRefOrGetter<T>, callback: (card: any) => void): T[] | Record<string, T> {
         ...
         if (Array.isArray(data)) return data.filter((item) => callback(item));
         return Object.fromEntries(Object.entries(data).filter(([, item]) => callback(item)));
     }
     ```
   - *Comprovação causal:* `callback` é tipado exclusivamente como `(card: any) => void` e invocado diretamente. Ao fornecer `'active'`, `{ id: 1 }` ou `['id', 1]`, o runtime lança `TypeError: callback is not a function`.

3. **`findLast` — [`src/Helpers/Iterables/findLast.ts:L10-21`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/findLast.ts#L10-L21)**
   - *Código original em `dev`:*
     ```typescript
     export function findLast<T>(collection: MaybeRefOrGetter<T[] | null | undefined>, predicate: (value: T, index: number, collection: T[]) => boolean): T | undefined {
         ...
         for (let i = data.length - 1; i >= 0; i--) if (predicate(data[i], i, data)) return data[i];
         return undefined;
     }
     ```
   - *Comprovação causal:* `predicate` é executado diretamente sem passar por `iteratee`. Passar `'a'`, `{ tag: 'x' }` ou `['id', 1]` dispara `TypeError: predicate is not a function`. Além disso, a função rejeita coleções do tipo `Record<string, T>` e não provê suporte ao parâmetro Lodash `fromIndex`.

4. **`groupBy` — [`src/Helpers/Iterables/groupBy.ts:L10-29`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/groupBy.ts#L10-L29)**
   - *Código original em `dev`:*
     ```typescript
     export function groupBy<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | any>, iteratee: string | ((item: T) => string | number)): Record<string, T[]> {
         ...
         if (typeof iteratee === 'function') key = iteratee(item as T);
         else key = (item as any)[iteratee];
     ```
   - *Comprovação causal:* O branch `else` assume que qualquer iteratee não-função é acessível diretamente via índice raso `(item as any)[iteratee]`. Para caminhos profundos (`'address.city'`), `item['address.city']` resulta em `undefined`, agrupando todos os registros na chave `"undefined"`. O mesmo ocorre para objetos matches e tuplas.

5. **`orderBy` — [`src/Helpers/Iterables/orderBy.ts:L4-56`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/orderBy.ts#L4-L56)**
   - *Código original em `dev`:*
     ```typescript
     type Criterion<T> = string | ((item: T) => unknown);
     ...
     if (typeof rule === 'function') {
         valA = rule(a);
         valB = rule(b);
     } else if (typeof rule === 'string') {
         valA = get(a, rule);
         valB = get(b, rule);
     } else {
         valA = a;
         valB = b;
     }
     ```
   - *Comprovação causal:* Linha 53 cai no fallback `else` para qualquer critério que seja objeto matches ou tupla array, ignorando a avaliação do iteratee e comparando diretamente os objetos inteiros `a` e `b`.

#### 3. Rastreamento Reverso de Dados
`Camada de Apresentação UI (Componentes Vue, Tabelas, Selects)`
   ⇄ `Camada Reativa / Estado (Pinia Stores, Composables useRefCachedApi / useList)`
   ⇄ `Helpers Iterables (keyBy, filter, findLast, groupBy, orderBy)`
   ⇄ `Normalizador Utilitário (iteratee -> property / matches / matchesProperty)`
   ⇄ `Fontes de Dados (Payloads JSON de APIs REST, IndexedDB, Entidades em Memória)`

- **Cenário de impacto UI via `keyBy`:** Uma store indexa usuários obtidos de API via `const usersById = keyBy(users, u => u.id)`. Todos os usuários são sobrepostos na chave `"undefined"`, e a UI acessa `usersById[user.id]` recebendo `undefined`. Resultado: listas vazias, detalhes em branco e quebra visual sem logs de erro.
- **Cenário de impacto UI via `filter`:** Um composable de listagem reativa executa `filter(products, 'inStock')`. O motor lança `TypeError: callback is not a function`, travando a execução do hook e o ciclo de montagem do componente Vue.
- **Cenário de impacto UI via `groupBy`:** Uma tela de faturamento agrupa transações por unidade via `groupBy(invoices, 'store.code')`. Todas as faturas caem sob a chave única `"undefined"`, misturando dados de clientes e lojas distintas.

---

### Arquivos afetados

#### 1. Código de Produção
- [`src/Helpers/Iterables/keyBy.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/keyBy.ts):
  - Integrar `iteratee` de `../Utils/iteratee`.
  - Atualizar a tipagem de entrada para suportar iteratee polimórfico (`KeyByIteratee<T>`), garantindo tipagem contextual em callbacks inline e suporte a propriedades aninhadas, tuplas e matches objects.
  - Implementar iteração sobre arrays e Records.
- [`src/Helpers/Iterables/filter.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/filter.ts):
  - Integrar `iteratee` de `../Utils/iteratee`.
  - Adicionar sobrecargas de função (overloads) para preservar tipagem estrita de retorno (`T[]` para array e `Record<string, T>` para Record) e tipagem contextual do predicado sem degradar para `unknown`.
  - Suportar todos os 4 formatos de iteratee.
- [`src/Helpers/Iterables/findLast.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/findLast.ts):
  - Integrar `iteratee` de `../Utils/iteratee`.
  - Definir `FindLastPredicate<T>` preservando a assinatura funcional `(value: T, index: number, collection: any) => unknown` na união (sem adicionar `| unknown`) para manter a tipagem contextual estrita de parâmetros como `(n) => n < 4`.
  - Suportar busca regressiva em arrays e Records, além do parâmetro `fromIndex`.
- [`src/Helpers/Iterables/groupBy.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/groupBy.ts):
  - Integrar `toIteratee` de `../Utils/iteratee`.
  - Definir tipo `GroupByIteratee<T>` suportando caminhos pontuados profundos, funções, tuplas e objetos.
  - Iterar com tratamento adequado para arrays e Records.
- [`src/Helpers/Iterables/orderBy.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/orderBy.ts):
  - Integrar `iteratee` de `../Utils/iteratee`.
  - Refatorar a definição de `Criterion<T>` sem incluir `| unknown` no final da união, garantindo que `((item: T) => unknown)` não seja colapsado e preserve a inferência de tipo de `(u) => u.name.length`.
  - Pré-compilar critérios via `iteratee` para objetos matches e tuplas, mantendo otimização de performance no loop de ordenação.

#### 2. Testes Automatizados Unitários
- [`src/Helpers/Iterables/keyBy.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/keyBy.test.ts): Adicionar testes para função iteratee, caminho profundo pontuado, objeto matches, tupla matchesProperty e coleção Record.
- [`src/Helpers/Iterables/filter.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/filter.test.ts): Adicionar testes para property shorthand, deep property shorthand, matches object, matchesProperty array e preservação de Records.
- [`src/Helpers/Iterables/findLast.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/findLast.test.ts): Adicionar testes para property shorthand, deep property shorthand, matches object, matchesProperty array, coleções do tipo Record e `fromIndex` reverso.
- [`src/Helpers/Iterables/groupBy.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/groupBy.test.ts): Adicionar testes para caminho pontuado profundo (`'e.c'`), matches object, matchesProperty array e coleção Record.
- [`src/Helpers/Iterables/orderBy.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/src/Helpers/Iterables/orderBy.test.ts): Adicionar testes para ordenação por critério de objeto matches, critério de tupla array e múltiplos critérios combinando strings e objetos.

#### 3. Documentação e Escopo do Git
- [`README.md`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/README.md): Atualizar a tabela descritiva da seção `Iterables` documentando a conformidade com os iteratees polimórficos do Lodash.
- **Saneamento de Escopo Git:** Remover symlinks indevidos commitados em iterações prévias (`node_modules`, `.claude/skills`, `.opencode/skills`) para garantir total limpeza no `git diff dev..HEAD`.

---

### Execuções propostas

#### Passo 1: Limpeza e Garantia de Escopo Git
1. Identificar e remover do rastreamento do Git quaisquer symlinks espúrios (`node_modules`, `.claude/skills`, `.opencode/skills`) que apontem para diretórios locais do host, garantindo que o diff contra `dev` contenha estritamente os arquivos da issue #3 e documentação pertinente.

#### Passo 2: Refatoração Cirúrgica de `keyBy.ts`
1. Importar `iteratee` de `../Utils/iteratee`.
2. Definir o tipo auxiliar:
   ```typescript
   export type KeyByIteratee<T> =
       | ((value: T, key: any, collection: any) => PropertyKey)
       | PropertyKey
       | [PropertyKey, unknown]
       | Record<string, any>;
   ```
3. Implementar a assinatura da função:
   ```typescript
   export function keyBy<T>(
       collection: MaybeRefOrGetter<Record<string, T> | T[] | null | undefined>,
       iterateeFn?: KeyByIteratee<T>
   ): Record<string, T>
   ```
4. Normalizar o iteratee através de `const fn = iteratee(iterateeFn)`.
5. Iterar de forma diferenciada e segura:
   - Se for array: `for (let i = 0; i < data.length; i++) { const item = data[i]; const k = fn(item, i, data); result[String(k)] = item; }`
   - Se for objeto/Record: `for (const [key, item] of Object.entries(data)) { const k = fn(item, key, data); result[String(k)] = item; }`
6. Retornar `result`.

#### Passo 3: Refatoração Cirúrgica de `filter.ts`
1. Importar `iteratee` de `../Utils/iteratee`.
2. Definir o tipo auxiliar:
   ```typescript
   export type FilterPredicate<T> =
       | ((value: T, indexOrKey: any, collection: any) => unknown)
       | PropertyKey
       | [PropertyKey, unknown]
       | Record<string, any>;
   ```
3. Fornecer sobrecargas estritas para inferência correta de array vs Record:
   ```typescript
   export function filter<T>(
       collection: MaybeRefOrGetter<T[]>,
       predicate?: ((value: T, index: number, collection: T[]) => unknown) | FilterPredicate<T>
   ): T[];
   export function filter<T>(
       collection: MaybeRefOrGetter<Record<string, T>>,
       predicate?: ((value: T, key: string, collection: Record<string, T>) => unknown) | FilterPredicate<T>
   ): Record<string, T>;
   export function filter<T>(
       collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
       predicate?: FilterPredicate<T>
   ): T[] | Record<string, T>;
   ```
4. Obter `const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown`.
5. Se for array: `return data.filter((item, index) => Boolean(fn(item, index, data)))`.
6. Se for objeto: filtrar as entradas com `Object.entries(data)` mantendo as chaves originais: `Object.fromEntries(Object.entries(data).filter(([key, item]) => Boolean(fn(item as T, key, data))))`.

#### Passo 4: Refatoração Cirúrgica de `findLast.ts`
1. Importar `iteratee` de `../Utils/iteratee`.
2. Definir o tipo auxiliar **sem incluir `| unknown`**:
   ```typescript
   export type FindLastPredicate<T> =
       | ((value: T, index: number, collection: any) => unknown)
       | PropertyKey
       | [PropertyKey, unknown]
       | Record<string, any>;
   ```
   *Nota Crítica de Tipagem:* A presença explícita da variante funcional `(value: T, index: number, collection: any) => unknown` é mandatória para que o TypeScript infira tipos contextuais em lambdas (como `(n) => n < 4` em arrays numéricos), eliminando o erro de compilação `Parameter 'n' implicitly has an 'any' type`.
3. Assinatura:
   ```typescript
   export function findLast<T>(
       collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
       predicate?: FindLastPredicate<T>,
       fromIndex?: number
   ): T | undefined
   ```
4. Normalizar `const fn = iteratee(predicate)`.
5. Suportar `fromIndex` com suporte a índices negativos (calculados a partir do final da coleção).
6. Implementar varredura regressiva tanto para arrays quanto para Records (iterando sobre `Object.keys(data)` do final para o início).

#### Passo 5: Refatoração Cirúrgica de `groupBy.ts`
1. Importar `iteratee as toIteratee` de `../Utils/iteratee`.
2. Definir o tipo auxiliar:
   ```typescript
   export type GroupByIteratee<T> =
       | ((item: T, keyOrIndex: any, collection: any) => PropertyKey)
       | PropertyKey
       | [PropertyKey, unknown]
       | Record<string, any>;
   ```
3. Assinatura:
   ```typescript
   export function groupBy<T>(
       collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
       iterateeFn?: GroupByIteratee<T>
   ): Record<string, T[]>
   ```
4. Normalizar via `const fn = toIteratee(iterateeFn)`.
5. Para cada elemento de array ou objeto, extrair a chave com `const groupKey = String(fn(item, keyOrIndex, data))` e acumular no array `result[groupKey]`.

#### Passo 6: Refatoração Cirúrgica de `orderBy.ts`
1. Importar `iteratee` de `../Utils/iteratee` e `get` de `../Objects/get`.
2. Ajustar `Criterion<T>` **removendo terminantemente o `| unknown` no fim da união**:
   ```typescript
   type IterateeCriterion<T> =
       | ((item: T) => unknown)
       | PropertyKey
       | [PropertyKey, unknown]
       | Record<string, any>;

   export type Criterion<T> = IterateeCriterion<T>;
   export type OrderDirection = 'asc' | 'desc';
   ```
   *Nota Crítica de Tipagem:* Se a união contiver `| unknown`, as regras de redução de tipos do TypeScript simplificam a união inteira para `unknown`, desarmando a contextualização de `u` em `(u) => u.name.length` e disparando `Parameter 'u' implicitly has an 'any' type`.
3. Na pré-compilação dos critérios para ordenação:
   ```typescript
   const iteratees = rules.map((rule) => {
       if (typeof rule === 'function') return rule as (item: T) => unknown;
       if (typeof rule === 'string') return (item: T) => get(item, rule);
       if (typeof rule === 'object' && rule !== null) return iteratee(rule) as (item: T) => unknown;
       return (item: T) => item;
   });
   ```
4. Dentro do loop de `items.sort`, comparar `valA = fn(a)` e `valB = fn(b)`.

#### Passo 7: Documentação e README
1. Atualizar a tabela descritiva da seção de Iterables no [`README.md`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-3/README.md) detalhando o suporte aos quatro formatos de iteratee do Lodash.

---

### Especificação de Teste TDD (Red-Green)

#### 1. Casos de Teste de Falha a Reproduzir (*Red*)
Os testes abaixo falham na implementação original de `dev` e comprovam a resolução completa quando passarem:

1. **`keyBy.test.ts`:**
   - **Caso 1 (Função iteratee):** `keyBy([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], (u) => u.id)` deve retornar `{ '1': { id: 1, name: 'A' }, '2': { id: 2, name: 'B' } }` (na versão original gerava `{ 'undefined': { id: 2, name: 'B' } }`).
   - **Caso 2 (Caminho profundo pontuado):** `keyBy([{ meta: { code: 'X' } }, { meta: { code: 'Y' } }], 'meta.code')` deve retornar `{ X: { meta: { code: 'X' } }, Y: { meta: { code: 'Y' } } }`.
   - **Caso 3 (Matches object shorthand):** `keyBy([{ id: 1, active: true }, { id: 2, active: false }], { active: true })` deve mapear sob as chaves `'true'` e `'false'`.
   - **Caso 4 (MatchesProperty array shorthand):** `keyBy([{ id: 1, role: 'admin' }, { id: 2, role: 'user' }], ['role', 'admin'])` deve mapear sob `'true'` e `'false'`.
   - **Caso 5 (Identidade sem iteratee):** `keyBy([10, 20])` deve indexar pelos próprios números: `{ '10': 10, '20': 20 }`.

2. **`filter.test.ts`:**
   - **Caso 1 (Property shorthand):** `filter([{ a: 1 }, { a: 0 }], 'a')` deve retornar `[{ a: 1 }]` (na versão original lançava `TypeError: callback is not a function`).
   - **Caso 2 (Caminho profundo pontuado):** `filter([{ user: { active: true } }, { user: { active: false } }], 'user.active')` deve retornar apenas o item ativo.
   - **Caso 3 (Matches object shorthand):** `filter([{ a: 1, b: 2 }, { a: 2, b: 2 }], { a: 1 })` deve retornar `[{ a: 1, b: 2 }]`.
   - **Caso 4 (MatchesProperty array shorthand):** `filter([{ a: 1, b: 2 }, { a: 2, b: 2 }], ['a', 2])` deve retornar `[{ a: 2, b: 2 }]`.
   - **Caso 5 (Coleção Record):** `filter({ k1: { v: 1 }, k2: { v: 0 } }, 'v')` deve retornar `{ k1: { v: 1 } }`.

3. **`findLast.test.ts`:**
   - **Caso 1 (Property shorthand):** `findLast([{ a: 0 }, { a: 1 }, { a: 2 }], 'a')` deve retornar `{ a: 2 }` (na versão original lançava `TypeError: predicate is not a function`).
   - **Caso 2 (Matches object shorthand):** `findLast([{ id: 1, tag: 'x' }, { id: 2, tag: 'y' }, { id: 3, tag: 'x' }], { tag: 'x' })` deve retornar `{ id: 3, tag: 'x' }`.
   - **Caso 3 (MatchesProperty array shorthand):** `findLast([{ id: 1, ok: true }, { id: 2, ok: true }], ['id', 1])` deve retornar `{ id: 1, ok: true }`.
   - **Caso 4 (Coleção Record):** `findLast({ a: { id: 1, v: 'x' }, b: { id: 2, v: 'x' } }, ['v', 'x'])` deve retornar `{ id: 2, v: 'x' }`.
   - **Caso 5 (Regressão com fromIndex):** `findLast([{ id: 1, tag: 'x' }, { id: 2, tag: 'x' }, { id: 3, tag: 'x' }], { tag: 'x' }, 1)` deve retornar `{ id: 2, tag: 'x' }`.

4. **`groupBy.test.ts`:**
   - **Caso 1 (Caminho profundo pontuado):** `groupBy([{ e: { c: 'SP' } }, { e: { c: 'RJ' } }, { e: { c: 'SP' } }], 'e.c')` deve retornar `{ SP: [{ e: { c: 'SP' } }, { e: { c: 'SP' } }], RJ: [{ e: { c: 'RJ' } }] }` (na versão original agrupava sob `{ 'undefined': [...] }`).
   - **Caso 2 (Matches object shorthand):** `groupBy([{ id: 1, vip: true }, { id: 2, vip: false }, { id: 3, vip: true }], { vip: true })` deve agrupar sob `'true'` e `'false'`.
   - **Caso 3 (MatchesProperty array shorthand):** `groupBy([{ id: 1, sector: 'IT' }, { id: 2, sector: 'HR' }], ['sector', 'IT'])` deve agrupar sob `'true'` e `'false'`.

5. **`orderBy.test.ts`:**
   - **Caso 1 (Matches object shorthand):** `orderBy([{ role: 'user', name: 'B' }, { role: 'admin', name: 'A' }], { role: 'admin' }, 'desc')` deve ordenar `{ role: 'admin' }` no topo.
   - **Caso 2 (MatchesProperty array shorthand):** `orderBy([{ status: 'off' }, { status: 'on' }], [['status', 'on']], ['desc'])` deve colocar `'on'` primeiro.
   - **Caso 3 (Múltiplos critérios combinados):** `orderBy([{ role: 'admin', age: 30 }, { role: 'admin', age: 20 }, { role: 'user', age: 40 }], [{ role: 'admin' }, 'age'], ['desc', 'asc'])` deve ordenar por `role: 'admin'` em primeiro lugar e desempatar pela idade em ordem ascendente.

#### 2. Validação da Correção (*Green*)
Após a alteração cirúrgica dos 5 arquivos em `src/Helpers/Iterables/`, todos os 24 testes existentes + todos os novos testes de shorthands devem passar sem qualquer regressão.

---

### Banco de dados

Nenhuma migration necessária. A biblioteca `@maxvue/max-use` é uma coleção de helpers utilitários e composables Vue/TypeScript em memória, sem persistência em banco de dados.

---

### Riscos de quebra e Não-Regressão

1. **Risco de Colapso de Tipagem Contextual em Callbacks:**
   - *Impacto:* Se o tipo do iteratee/predicate contiver `| unknown` ou for apenas `unknown`, o compilador TypeScript colapsa os parâmetros de arrow functions inline (`(n) => n < 4` ou `(u) => u.name.length`) para tipo `any`, quebrando o build com `Parameter implicitly has an 'any' type`.
   - *Mitigação Estrita:* As definições de tipos (`KeyByIteratee<T>`, `FilterPredicate<T>`, `FindLastPredicate<T>`, `GroupByIteratee<T>` e `Criterion<T>`) NUNCA devem incluir `| unknown` em sua união e SEMPRE devem elencar a variante funcional tipada `(value: T, ...) => unknown`.
2. **Risco de Quebra em Callbacks e Strings Legados:**
   - *Mitigação:* `iteratee(func)` repassa a função diretamente e sem alterações quando `typeof func === 'function'`. Strings continuam sendo tratadas via `property`, garantindo compatibilidade com propriedades rasas existentes e habilitando caminhos aninhados.
3. **Risco de Comportamento em Fallbacks Numéricos no `orderBy`:**
   - *Mitigação:* O teste legado `fallback compara valores diretamente quando rule não é string nem function` envia `0 as any`. Com a pré-compilação via `typeof rule === 'object' && rule !== null`, valores numéricos caem no branch padrão `(item) => item`, preservando integralmente o comportamento legado testado.
4. **Risco de Poluição de Escopo Git por Symlinks:**
   - *Mitigação:* Antes de qualquer commit, validar `git status` e `git diff dev..HEAD --name-status` para assegurar que nenhum symlink de máquina local (`node_modules`, `.claude/skills`, etc.) seja incluído.

---

### Validação

Para comprovar formal e conclusivamente a implementação:
1. **Executar a suíte de testes unitários dos helpers afetados:**
   ```bash
   npx vitest run src/Helpers/Iterables/keyBy.test.ts src/Helpers/Iterables/filter.test.ts src/Helpers/Iterables/findLast.test.ts src/Helpers/Iterables/groupBy.test.ts src/Helpers/Iterables/orderBy.test.ts
   ```
   *Critério de aceite:* Todos os testes legados e novos testes passando com 100% de sucesso.
2. **Executar checagem estrita de tipos do TypeScript com typecheck vitest:**
   ```bash
   npm run test:types
   ```
   *Critério de aceite:* Zero erros de `TypeCheckError` nos 5 arquivos de teste afetados.
3. **Executar checagem de tipagem estática geral do projeto:**
   ```bash
   npm run type-check
   ```
   *Critério de aceite:* Zero erros emitidos pelo `vue-tsc`.
4. **Executar a suíte completa de testes do repositório:**
   ```bash
   npm test
   ```
   *Critério de aceite:* Mais de 3.500 testes passando sem qualquer regressão.
5. **Executar build de produção:**
   ```bash
   npm run build
   ```
   *Critério de aceite:* Build gerado com sucesso em `dist/`.
6. **Verificação de Limpeza de Escopo Git:**
   ```bash
   git status --short
   git diff dev..HEAD --name-status
   ```
   *Critério de aceite:* Sem symlinks espúrios e restrito aos arquivos autorizados da issue.

---

### Skills Aplicáveis

- `superpowers` (enforcement do fluxo de engenharia estruturado: investigação prévia, especificação técnica, ciclo TDD Red-Green e portões de qualidade).
- `systematic-debugging-best-practices` (análise de causa raiz comprovada, reprodução empírica do defeito e isolamento da anomalia).
- `code-review-and-quality` (inspeção de conformidade estrita de contratos, verificação de tipagem contextual do TypeScript, cobertura de testes e prevenção de poluição no git).
