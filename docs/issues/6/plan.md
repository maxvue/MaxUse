# Plano de Implementação - Issue #6
## [Audit] countBy tem assinatura e tipo de retorno divergentes do Lodash (retorna numero, nao objeto)

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante a auditoria automatizada de 2026-08-13 (lente 10 — divergência de contrato na reimplementação do Lodash), foi identificada uma divergência estrutural e incompatível na função [`countBy`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts#L13-L21), localizada em [src/Helpers/Iterables/countBy.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts).

A biblioteca MaxUse se define publicamente em seu [package.json](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/package.json#L4) como *"Biblioteca de Funções e Composables Vue — VueUse + Lodash + Helpers com suporte total a reatividade"*. Além disso, o próprio [README.md](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/README.md#L253) documenta expressamente o contrato do `countBy` como:
```markdown
| `countBy` | `(collection, iteratee) → Record<string, number>` | Conta ocorrências por grupo |
```

Contudo, a implementação existente em [src/Helpers/Iterables/countBy.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts) possui uma assinatura e semântica totalmente divergentes:
```ts
export function countBy(collection: MaybeRefOrGetter<T>, key: string, value: T[keyof T] | any = true): number
```
Ela recebe `(collection, key, value = true)` e retorna um valor escalar do tipo `number` (a contagem de itens onde `item[key] === value`).

**Agravantes Técnicos Identificados:**
1. **Quebra de Contrato e Erros em Tempo de Execução:**
   Desenvolvedores que utilizam a MaxUse como substituta do Lodash (ou que seguem a documentação oficial da tabela de Iterables do `README.md`) esperam receber um objeto agregado (`Record<string, number>`). Ao receberem um primitivo numérico (`number`), o código quebra imediatamente no primeiro acesso de propriedade (ex.: `res['chave']` resulta em `undefined` e `Object.keys(res)` ou desestruturação falham com comportamentos inesperados).
2. **Cenário de Falha Reproduzível Concreto:**
   Ao invocar com o iteratee clássico do Lodash:
   ```ts
   countBy([1.1, 2.2, 2.3], Math.floor)
   ```
   - **Contrato Lodash esperado:** `{ '1': 1, '2': 2 }` (tipo `Record<string, number>`)
   - **MaxUse atual:** `0` (tipo `number`)
   Como `key` recebe a função `Math.floor` e `value` assume o padrão `true`, o acesso `item[key]` avalia para `undefined`. A checagem `undefined === true` é falsa para todos os itens, resultando no retorno anômalo `0`.
3. **Quebra no Chaining de Coleções:**
   A função [`countBy`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts#L13-L21) está registrada nos mixins de encadeamento fluente em [src/Helpers/Seq/_collectionMixins.ts:L43](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Seq/_collectionMixins.ts#L43). Em chamadas encadeadas como `use(itens).countBy(fn).value()`, a sequência entrega um número quando deveria produzir o dicionário de frequências agrupadas.
4. **Limitação Semântica da Implementação Legada:**
   A implementação atual é meramente um predicado de igualdade estrita (`item[key] === value`) com chave fixa e valor padrão `true`. Ela é incapaz de realizar agrupamentos dinâmicos por predicado, transformação numérica, agrupamento por múltiplos critérios ou atalhos de caminho.

#### Causa Raiz Comprovada
- **Localização Exata no Código:**
  [src/Helpers/Iterables/countBy.ts:L13-L21](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts#L13-L21)
  ```ts
  export function countBy(collection: MaybeRefOrGetter<T>, key: string, value: T[keyof T] | any = true): number {
      const data = toValue(collection);

      if (!data || typeof data !== 'object') return 0;

      const items = Array.isArray(data) ? data : Object.values(data);

      return items.reduce((acc, item) => acc + (item[key] === value ? 1 : 0), 0);
  }
  ```
- **Fluxo Causal:**
  1. A função foi nomeada como `countBy`, porém codificada com a semântica de um `countWhere` (análogo a `filterBy`, que filtra itens por par chave/valor).
  2. A tipagem estática fixou o retorno em `: number` e os parâmetros em `key: string, value = true`.
  3. Nenhum mecanismo de normalização de iteratee (como [`iteratee`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Utils/iteratee.ts#L23) do projeto) foi utilizado.
  4. Quando um iteratee Lodash-compliant é passado (função seletora, atalho de propriedade ou identidade), a função trata esse argumento como uma chave de propriedade, falha no cálculo da igualdade e retorna a soma `0`.
- **Rastreamento Reverso de Dados:**
  ```
  [UI / View / Consumidor] Componentes Vue ou composables chamando countBy(items, iteratee) esperando Record<string, number>
      ↕
  [Chaining / Wrapper] src/Helpers/Seq/_collectionMixins.ts:L43 (método mixin countBy na classe MaxUseWrapper)
      ↕
  [Barramento de Exportação] src/index.ts ⇄ src/Helpers/Iterables/index.ts:L3 (re-export público de countBy)
      ↕
  [Service / Helper] Função countBy em src/Helpers/Iterables/countBy.ts:L13-L21
      ↕
  [Execução / Desembrulho] toValue(collection) -> items.reduce(...) com acumulador numérico
      ↕
  [Retorno Incompatível] Valor primitivo number retornado em desacordo com o contrato Lodash (Record<string, number>)
  ```
  *(Nota: O repositório MaxUse é uma biblioteca TypeScript utilitária reativa client-side para Vue 3, sem camadas de Controllers backend, Stores externas com banco de dados ou persistência).*

---

### Arquivos afetados

1. [src/Helpers/Iterables/countBy.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts):
   - Reescrita cirúrgica da função [`countBy`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts#L13-L21) para alinhar sua assinatura e retorno ao Lodash (`Record<string, number>`).
   - Integração com o helper interno [`iteratee`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Utils/iteratee.ts#L23) (`src/Helpers/Utils/iteratee.ts`) para suporte a funções, atalhos de string, arrays `[caminho, valor]`, objetos e identidade por omissão.
2. [src/Helpers/Iterables/countBy.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.test.ts):
   - Atualização completa da suíte de testes unitários para validar a conformidade com o Lodash (funções transformadoras, propriedades, atalhos, identidade, reatividade Vue via `Ref`, coleções nulas/undefined/vazias).
3. [src/Helpers/Iterables/countWhere.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countWhere.ts) (Novo Arquivo):
   - Criação do helper `countWhere(collection, key, value = true): number` para preservar com exatidão a funcionalidade anterior, assegurando caminho de migração limpo sem perda de recursos para quem utilizava a contagem por igualdade de propriedade.
4. [src/Helpers/Iterables/countWhere.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countWhere.test.ts) (Novo Arquivo):
   - Criação da suíte de testes unitários dedicada ao novo helper `countWhere`, absorvendo e expandindo os 4 testes originais que antes residiam em `countBy.test.ts`.
5. [src/Helpers/Iterables/index.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/index.ts):
   - Inclusão do re-export do novo helper: `export * from './countWhere';`.
6. [src/Helpers/Seq/_collectionMixins.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Seq/_collectionMixins.ts):
   - Importação e registro de `countWhere` em `collectionHelpers`, disponibilizando o método encadeado fluente no `MaxUseWrapper`.
7. [src/Helpers/autoImportData.json](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/autoImportData.json):
   - Registro de `"countWhere"` via script automatizado de prebuild (`npx tsx src/scripts/buildAutoImport.ts`).
8. [README.md](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/README.md):
   - Inclusão de `countWhere` na tabela de Iterables e adição de aviso explicativo de Breaking Change descrevendo a harmonização do `countBy` com o Lodash e a disponibilidade de `countWhere`.

---

### Execuções propostas

A execução técnica deve seguir rigorosamente o ciclo TDD (Red-Green-Refactor) com preservação da estabilidade global:

#### Passo 1: Especificação TDD dos Novos Testes de `countBy` (Fase Red)
Modificar [src/Helpers/Iterables/countBy.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.test.ts) para exercitar os requisitos do Lodash:
1. Contagem com iteratee como função (`Math.floor` sobre números fracionários).
2. Contagem com iteratee como propriedade string (`'length'` sobre strings).
3. Omissão de iteratee (uso de identidade).
4. Suporte aos atalhos de iteratee do Lodash: par `[caminho, valor]` e objeto de correspondência `{ status: 'ok' }`.
5. Tratamento de coleções `null`, `undefined` e coleções vazias retornando `{}`.
6. Suporte a coleções baseadas em `Record<string, any>` e desembrulho reativo de `Ref`.

Executar o comando de teste para comprovar a falha Red antes da implementação:
```bash
npx vitest run src/Helpers/Iterables/countBy.test.ts
```

#### Passo 2: Reimplementação Cirúrgica de `countBy.ts` (Fase Green)
Em [src/Helpers/Iterables/countBy.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countBy.ts):
1. Importar `toValue` e `MaybeRefOrGetter` de `'vue'`.
2. Importar o resolver de iteratees [`iteratee`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Utils/iteratee.ts#L23) de `'../Utils/iteratee'`.
3. Ajustar a assinatura para:
   ```ts
   export function countBy<T>(
       collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
       iterateeFn?: unknown
   ): Record<string, number>
   ```
4. Se `data == null || typeof data !== 'object'`, retornar `{}`.
5. Normalizar os itens (`Array.isArray(data) ? data : Object.values(data)`).
6. Resolver o iteratee via `const fn = iteratee(iterateeFn)`.
7. Iterar acumulando frequências por chave string:
   ```ts
   const result: Record<string, number> = {};
   for (const item of items) {
       const key = String(fn(item));
       result[key] = (result[key] ?? 0) + 1;
   }
   return result;
   ```

#### Passo 3: Criação do Helper `countWhere` e seus Testes Unitários
1. Criar [src/Helpers/Iterables/countWhere.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countWhere.ts):
   - Conter a lógica original de contagem de itens onde `item[key] === value` (com `value = true` como default).
   - Documentar em JSDoc a relação com a semântica legada de `countBy`.
2. Criar [src/Helpers/Iterables/countWhere.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/countWhere.test.ts):
   - Conter os testes que validam a contagem por chave padrão `true`, valor especificado, `null`/`undefined` retornando 0 e suporte a `Record`.

#### Passo 4: Atualização de Exportações e Mixins
1. Em [src/Helpers/Iterables/index.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Iterables/index.ts):
   - Adicionar `export * from './countWhere';`.
2. Em [src/Helpers/Seq/_collectionMixins.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Seq/_collectionMixins.ts):
   - Importar `countWhere` de `'../Iterables/countWhere'`.
   - Adicionar `countWhere` ao objeto `collectionHelpers`.

#### Passo 5: Atualização de Auto-Imports
Executar o script de prebuild oficial do projeto para regenerar [src/Helpers/autoImportData.json](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/autoImportData.json):
```bash
npx tsx src/scripts/buildAutoImport.ts
```

#### Passo 6: Atualização da Documentação no `README.md`
1. Adicionar `countWhere` na tabela de Iterables:
   ```markdown
   | `countWhere` | `(collection, key, value?) → number` | Conta itens cuja propriedade é igual ao valor (padrão `true`) |
   ```
2. Inserir uma nota detalhando a mudança de contrato do `countBy` e instruindo o uso de `countWhere` para manutenção da compatibilidade funcional com exemplos práticos.

#### Passo 7: Verificação Estática e Não-Regressão
1. Executar os testes unitários de ambos os módulos:
   ```bash
   npx vitest run src/Helpers/Iterables/countBy.test.ts src/Helpers/Iterables/countWhere.test.ts
   ```
2. Executar checagem de tipos e linting:
   ```bash
   npm run type-check
   npm run lint
   ```
3. Executar toda a suíte de testes do projeto:
   ```bash
   npm test
   ```

---

### Especificação de Teste TDD (Red-Green)

#### 1. Casos de Teste Red para `countBy.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { countBy } from './countBy';

describe('countBy', () => {
    it('agrupa e conta ocorrências aplicando iteratee função (Lodash spec)', () => {
        expect(countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': 1, '6': 2 });
    });

    it('agrupa e conta ocorrências usando iteratee por chave/propriedade string', () => {
        expect(countBy(['one', 'two', 'three'], 'length')).toEqual({ '3': 2, '5': 1 });
    });

    it('usa a identidade quando o iteratee é omitido', () => {
        expect(countBy(['a', 'b', 'a'])).toEqual({ a: 2, b: 1 });
    });

    it('aceita o atalho [caminho, valor]', () => {
        const items = [{ status: 'ok' }, { status: 'ok' }, { status: 'error' }];
        expect(countBy(items, ['status', 'ok'])).toEqual({ true: 2, false: 1 });
    });

    it('aceita o atalho de objeto', () => {
        const items = [{ status: 'ok' }, { status: 'ok' }, { status: 'error' }];
        expect(countBy(items, { status: 'ok' })).toEqual({ true: 2, false: 1 });
    });

    it('retorna objeto vazio para null ou undefined', () => {
        expect(countBy(null)).toEqual({});
        expect(countBy(undefined)).toEqual({});
        expect(countBy(null, 'active')).toEqual({});
    });

    it('funciona com Record (object)', () => {
        const items = { a: { tipo: 'x' }, b: { tipo: 'y' }, c: { tipo: 'x' } };
        expect(countBy(items, 'tipo')).toEqual({ x: 2, y: 1 });
    });

    it('desembrulha refs na coleção', () => {
        const items = ref([{ tipo: 'x' }, { tipo: 'x' }]);
        expect(countBy(items, 'tipo')).toEqual({ x: 2 });
    });

    it('retorna objeto vazio para coleção vazia', () => {
        expect(countBy([])).toEqual({});
    });
});
```

#### Comportamento Red (Antes da Modificação no Código-Fonte):
```text
FAIL src/Helpers/Iterables/countBy.test.ts > countBy > agrupa e conta ocorrências aplicando iteratee função (Lodash spec)
AssertionError: expected 0 to deeply equal { '4': 1, '6': 2 }
- Expected: { "4": 1, "6": 2 }
+ Received: 0
```

#### Comportamento Green (Após a Implementação da Correção):
```text
✓ src/Helpers/Iterables/countBy.test.ts (9 tests)
✓ src/Helpers/Iterables/countWhere.test.ts (4 tests)
Test Files  2 passed (2)
Tests  13 passed (13)
```

---

### Banco de dados

**Nenhuma migration necessária.**
A biblioteca `@maxvue/max-use` é exclusivamente client-side / front-end em Vue 3 e TypeScript, não possuindo banco de dados, ORM ou camadas de persistência em servidor.

---

### Riscos de quebra e Não-Regressão

1. **Quebra de Compatibilidade Retroativa de Chamadas com `(collection, key, value)`:**
   - *Risco:* Código que chamava `countBy(pedidos, 'pago')` esperando o total numérico passará a receber `{ true: X, false: Y }`.
   - *Mitigação:* Disponibilização imediata do helper idêntico `countWhere(pedidos, 'pago')` para substituição direta (1:1), documentado no `README.md` como breaking change intencional da versão com guia claro de migração.
2. **Conformidade de Atalhos do Iteratee:**
   - *Risco:* Divergência em relação aos comportamentos complexos de iteratee do Lodash (ex.: propriedades aninhadas, predicados de objeto).
   - *Mitigação:* Uso do helper interno [`iteratee`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-6/src/Helpers/Utils/iteratee.ts#L23) (`src/Helpers/Utils/iteratee.ts`), que padroniza os atalhos `property`, `matchesProperty` e `matches` em todo o ecossistema MaxUse.
3. **Casos de Borda com Entradas Inválidas ou Falsy:**
   - *Risco:* Lançamento de erro ao iterar sobre `null`, `undefined` ou primitivos.
   - *Mitigação:* Validação inicial `if (data == null || typeof data !== 'object') return {};` garantindo retorno consistente de `{}` em qualquer caso nulo ou inválido.
4. **Sincronização de Compilação e Auto-Import:**
   - *Risco:* Inconsistência entre exports declarados e o catálogo gerado `autoImportData.json`.
   - *Mitigação:* Execução do script `npx tsx src/scripts/buildAutoImport.ts` e inclusão nos barrels de exportação e mixins do `_collectionMixins.ts`.
5. **Garantia de Não-Regressão Global:**
   - *Risco:* Impacto colateral em outros métodos do MaxUse.
   - *Mitigação:* Execução da suíte completa de testes (`npm test`) com quase 3000 testes e verificação estática rigorosa (`npm run type-check`).

---

### Validação

Comandos automatizados que comprovam conclusivamente o sucesso da implementação:

1. **Validação Unitária Focada de `countBy` e `countWhere`:**
   ```bash
   npx vitest run src/Helpers/Iterables/countBy.test.ts src/Helpers/Iterables/countWhere.test.ts
   ```
   *Critério de aceitação:* Ambos os arquivos de teste executados com 100% de aprovação (todos os 13 testes verdes).

2. **Aferição da Presença dos Arquivos do Workspace:**
   ```bash
   ls src/Helpers/Iterables/countWhere.ts src/Helpers/Iterables/countBy.ts
   ```
   *Critério de aceitação:* Código de saída 0, confirmando a existência de ambos os helpers no workspace.

3. **Verificação Estática de Tipagem TypeScript:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* Execução do `vue-tsc --noEmit` concluída com código 0 e zero erros de tipagem.

4. **Validação de Linting e Formatação:**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* Execução do ESLint sem novos erros ou advertências.

5. **Suíte Completa de Testes da Biblioteca:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* Todos os mais de 396 arquivos de teste passando com 0 falhas e 0 regressões.

---

### Skills Aplicáveis

- `superpowers`: Estruturação metodológica do fluxo de engenharia, ciclo TDD Red-Green e garantia de aderência aos portões de qualidade.
- `tdd`: Condução estrita do ciclo de desenvolvimento guiado por testes, com especificação prévia do teste de falha e validação da solução.
- `systematic-debugging-best-practices`: Isolamento da divergência de contrato de API, rastreamento causal e validação de casos de borda.
- `code-review-and-quality`: Revisão multi-eixo avaliando segurança de tipos, compatibilidade retroativa, integridade de barrels e documentação.
- `production-code-audit`: Auditoria de contratos de bibliotecas públicas, garantindo alinhamento pleno entre documentação oficial e implementação real.
