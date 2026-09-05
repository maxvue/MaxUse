# Plano de Implementação — Issue #27

> **Problema:** [Audit] subtract documenta concatenação de strings e declara retorno number | string divergindo da execução  
> **Status da Verificação:** Confirmado / Reproduzível  
> **Arquivo Alvo:** [src/Helpers/Math/subtract.ts:L16-L40](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.ts#L16-L40)  

---

### Descrição e Causa Raiz

#### Problema Relatado e Agravantes
A função [`subtract`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.ts#L26-L40), exportada como utilitário autônomo e membro do namespace Math no barrel [`src/Helpers/Math/index.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/index.ts#L6), destina-se a subtrair o segundo operando (`other`) do primeiro (`value`), suportando valores reativos (`MaybeRefOrGetter`).

A auditoria automatizada detectou uma inconsistência grave entre a documentação/tipagem da função e o seu comportamento real de execução:
1. **Documentação JSDoc incorreta:**
   No cabeçalho da função ([`src/Helpers/Math/subtract.ts:L18-L24`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.ts#L18-L24)), afirma-se textualmente:
   - `* Se algum dos dois for string, concatena em vez de subtrair numericamente.`
   - `* @returns diferença (ou concatenação) dos dois valores`
2. **Tipagem de retorno enganosa:**
   A assinatura pública da função está tipada como:
   `export function subtract(value?: MaybeRefOrGetter<unknown>, other?: MaybeRefOrGetter<unknown>): number | string`
   E internamente efetua casts para `as number | string` nas linhas 34 e 39.
3. **Divergência frontal com a execução real:**
   Em JavaScript/ECMAScript, o operador de subtração binário (`-`) sempre força coerção numérica abstrata (`ToNumeric` / `ToNumber`). Ao subtrair duas strings (ex.: `subtract('10', '4')`), o resultado avaliado pela expressão `("10" as unknown as number) - ("4" as unknown as number)` é `6` (`number`), ou `NaN` se os operandos forem strings não numéricas. **Uma operação de subtração nunca produz concatenação de strings em JavaScript.**
   O arquivo de teste original inclusive continha o comentário `it('converte strings numéricas para número (diferente do add, não concatena)', ...)` em [`src/Helpers/Math/subtract.test.ts:L19`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.test.ts#L19), evidenciando que o autor dos testes já havia notado a discrepância, mas a documentação e a tipagem do helper permaneceram errôneas.

#### Agravantes
1. **Impacto no Consumo TypeScript (Type Ergonomics):**
   Ao declarar o retorno como `number | string`, a biblioteca obriga todos os seus consumidores a realizarem verificações de tipo desnecessárias (guardas `typeof res === 'number'` ou asserções manuais `res as number`) antes de empregarem o resultado em operações aritméticas subsequentes, formatações numéricas ou atribuições a estados reativos tipados como `number`.
2. **Engano na Leitura e no IntelliSense:**
   Ao inspecionar a documentação hover no VS Code / IDEs, os desenvolvedores são induzidos a acreditar que passar uma string fará a função concatenar (por exemplo, esperar `'104'` ao chamar `subtract('10', '4')`), quando em tempo de execução o resultado retornado é o número `6`.
3. **Inconsistência Arquitetural com Helpers Irmãos:**
   As demais funções correlatas de aritmética da categoria Math ([`multiply.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/multiply.ts#L29) e [`divide.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/divide.ts#L30)) tipam seu retorno estritamente como `number` e documentam detalhadamente a peculiaridade de coerção do Lodash (`baseToString` nos operandos e operador nativo aplicado diretamente).
4. **Desvio do padrão interno `_baseToString`:**
   O módulo interno [`src/Helpers/Lang/_baseToString.ts:L2-L3`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Lang/_baseToString.ts#L2-L3) especifica em seu JSDoc que foi projetado para ser compartilhado por `add`, `subtract`, `multiply` e `divide`. Todavia, enquanto `multiply.ts` e `divide.ts` importam e aplicam `baseToString`, `subtract.ts` estava usando template string ``(`${a}` as unknown as number) - (`${b}` as unknown as number)``, gerando inconsistência de coerção com símbolos e objetos complexos com `valueOf`.

#### Causa Raiz Comprovada
- **Localização Exata:** [src/Helpers/Math/subtract.ts:L16-L40](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.ts#L16-L40)
```ts
16: /**
17:  * Subtrai `other` de `value`. Se ambos forem `undefined`, retorna `0`; se
18:  * apenas um for fornecido, retorna esse valor sem operação. Se algum dos
19:  * dois for string, concatena em vez de subtrair numericamente.
20:  * Semelhante ao _.subtract do Lodash.
21:  *
22:  * @param value valor de origem
23:  * @param other valor a subtrair
24:  * @returns diferença (ou concatenação) dos dois valores
25:  */
26: export function subtract(value?: MaybeRefOrGetter<unknown>, other?: MaybeRefOrGetter<unknown>): number | string {
27:     const a = value === undefined ? undefined : toValue(value);
28:     const b = other === undefined ? undefined : toValue(other);
29: 
30:     if (a === undefined && b === undefined) return 0;
31: 
32:     let result: unknown = a;
33:     if (b !== undefined) {
34:         if (result === undefined) return b as number | string;
35:         if (typeof a === 'string' || typeof b === 'string') result = (`${a}` as unknown as number) - (`${b}` as unknown as number);
36:         else result = baseToNumber(a) - baseToNumber(b);
37: 
38:     }
39:     return result as number | string;
40: }
```

- **Fluxo Causal:**
  1. A implementação de `subtract.ts` foi originalmente clonada de [`src/Helpers/Math/add.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/add.ts).
  2. Em `add.ts`, o operador `+` de fato concatena quando há operandos do tipo string (`baseToString(a) + baseToString(b)`), justificando o tipo de retorno `number | string` e a frase *"concatena em vez de somar numericamente"*.
  3. Ao adaptar para `subtract.ts`, a operação foi trocada para `-`, mas a tipagem pública de retorno `number | string`, os typecasts internos `as number | string` e o texto do cabeçalho JSDoc foram mantidos inadvertidamente.
  4. Como consequência, o TypeScript infere `number | string` mesmo quando a execução sempre gera um número ou `NaN`.

- **Rastreamento Reverso de Dados:**
  ```
  UI / Componentes Vue (ex.: exibição de saldos, cálculos de descontos, barras de progresso)
      ↕
  Store / Composables Reativos (ex.: Pinia store consumindo subtract(total, desconto))
      ↕
  Exportação Barrel (src/index.ts ⇄ src/Helpers/Math/index.ts)
      ↕
  Helper subtract (src/Helpers/Math/subtract.ts:L16-L40)
      ↕
  Tipagem pública de retorno number | string e JSDoc incorreto (L18-L26) herdados de add.ts
      ↕
  Execução do operador aritmético '-' (L35-L36) produzindo estritamente number ou NaN
      ↕
  Backend HTTP / API (Resposta com dados numéricos brutos ou strings numéricas recebidas da API)
  ```

---

### Arquivos afetados

1. [src/Helpers/Math/subtract.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.ts):
   - Corrigir o comentário JSDoc no cabeçalho da função: remover a menção a concatenação de strings e corrigir a descrição de `@returns` para `diferença dos dois valores`. Documentar a peculiaridade do Lodash com strings (`baseToString` e operador `-` direto), alinhando com a documentação de `multiply.ts` e `divide.ts`.
   - Ajustar a assinatura pública de retorno: alterar `number | string` para `number`.
   - Importar `baseToString` de `../Lang/_baseToString`.
   - Substituir a linha 35 de template literal ``(`${a}` as unknown as number) - (`${b}` as unknown as number)`` por `(baseToString(a) as unknown as number) - (baseToString(b) as unknown as number)`.
   - Ajustar os retornos nas linhas 34 e 39 de `as number | string` para `as number`.

2. [src/Helpers/Math/subtract.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.test.ts):
   - Adicionar asserções de tipo estático via `expectTypeOf(subtract).returns.toEqualTypeOf<number>()` e `expectTypeOf(subtract('10', '4')).toEqualTypeOf<number>()`.
   - Adicionar casos de teste cobrindo a não-concatenação explícita de strings (ex.: `subtract('10', '4')` retornando `6` do tipo `number` e não `'104'`).
   - Adicionar testes de peculiaridade do Lodash quando um operando é string (`subtract('3', true)` resultando em `NaN`, `subtract('1', null)` resultando em `NaN`).

3. [docs/issues/27/plan.md](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/docs/issues/27/plan.md):
   - Armazenamento do plano de implementação detalhado da issue #27.

> [!IMPORTANT]
> **Controle Estrito de Escopo:** Nenhum outro arquivo, link simbólico ou dependência deve ser modificado ou adicionado. A alteração restringe-se cirurgicamente a `src/Helpers/Math/subtract.ts`, `src/Helpers/Math/subtract.test.ts` e `docs/issues/27/plan.md`.

---

### Execuções propostas

1. **Passo 1: Escrever os Testes Unitários e de Tipagem no Padrão TDD (Fase Red)**
   - No arquivo [src/Helpers/Math/subtract.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.test.ts):
     - Importar `expectTypeOf` de `vitest`.
     - Inserir teste de asserção estática de tipos garantindo que o retorno seja exclusivamente `number`:
       ```ts
       it('possui assinatura de tipo com retorno estritamente number', () => {
           expectTypeOf(subtract).returns.toEqualTypeOf<number>();
           expectTypeOf(subtract('10', '4')).toEqualTypeOf<number>();
           expectTypeOf(subtract(10, 4)).toEqualTypeOf<number>();
       });
       ```
     - Inserir teste comprovando que strings numéricas produzem resultado numérico e nunca concatenação:
       ```ts
       it('nunca concatena strings, sempre retornando a diferenca numerica', () => {
           const res = subtract('10', '4');
           expect(res).toBe(6);
           expect(typeof res).toBe('number');
           expect(res).not.toBe('104');
       });
       ```
     - Inserir teste de peculiaridade Lodash alinhado a `multiply` e `divide`:
       ```ts
       it('quando algum operando é string, aplica o operador direto sem baseToNumber (peculiaridade)', () => {
           expect(subtract('3', true)).toBeNaN();
           expect(subtract(3, true)).toBe(2);
       });

       it('converte null/undefined em texto literal ao aplicar baseToString em ambos operandos (peculiaridade)', () => {
           expect(subtract('1', null)).toBeNaN();
           expect(subtract(null, '1')).toBeNaN();
       });
       ```

2. **Passo 2: Implementar a Correção Cirúrgica em subtract.ts (Fase Green)**
   - No arquivo [src/Helpers/Math/subtract.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.ts):
     - Importar `baseToString` de `../Lang/_baseToString`.
     - Corrigir o cabeçalho JSDoc:
       ```ts
       /**
        * Subtrai `other` de `value`. Se ambos forem `undefined`, retorna `0`; se
        * apenas um for fornecido, retorna esse valor sem operação. Se **algum**
        * dos dois for string, ambos são convertidos via `toString` e o operador
        * `-` é aplicado diretamente — peculiaridade do Lodash:
        * `_.subtract('3', true)` vira `'3' - 'true'` = `NaN`.
        * Semelhante ao _.subtract do Lodash.
        *
        * @param value valor de origem (minuendo)
        * @param other valor a subtrair (subtraendo)
        * @returns diferença dos dois valores
        */
       ```
     - Corrigir a assinatura de retorno e casts:
       ```ts
       export function subtract(value?: MaybeRefOrGetter<unknown>, other?: MaybeRefOrGetter<unknown>): number {
           const a = value === undefined ? undefined : toValue(value);
           const b = other === undefined ? undefined : toValue(other);

           if (a === undefined && b === undefined) return 0;

           let result: unknown = a;
           if (b !== undefined) {
               if (result === undefined) return b as number;
               if (typeof a === 'string' || typeof b === 'string') result = (baseToString(a) as unknown as number) - (baseToString(b) as unknown as number);
               else result = baseToNumber(a) - baseToNumber(b);

           }
           return result as number;
       }
       ```

3. **Passo 3: Validação de Lint e Estilo (ESLint)**
   - Rodar o linter oficial do projeto nos arquivos afetados para garantir que não haja violações estilísticas:
     ```bash
     ./node_modules/.bin/eslint src/Helpers/Math/subtract.ts src/Helpers/Math/subtract.test.ts
     ```

4. **Passo 4: Validação de Tipagem Estática (vue-tsc / type-check)**
   - Executar a checagem estática de tipos do projeto:
     ```bash
     ./node_modules/.bin/vue-tsc --noEmit
     ```

5. **Passo 5: Validação da Suíte de Testes (Vitest)**
   - Executar os testes unitários de `subtract.test.ts`:
     ```bash
     ./node_modules/.bin/vitest run src/Helpers/Math/subtract.test.ts
     ```

---

### Especificação de Teste TDD (Red-Green)

#### Teste de Falha (Red)
Inserir no arquivo [src/Helpers/Math/subtract.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-27/src/Helpers/Math/subtract.test.ts):
```ts
import { describe, it, expect, expectTypeOf } from 'vitest';
import { ref } from 'vue';
import { subtract } from './subtract';

describe('subtract', () => {
    it('possui assinatura de tipo com retorno estritamente number', () => {
        expectTypeOf(subtract).returns.toEqualTypeOf<number>();
        expectTypeOf(subtract('10', '4')).toEqualTypeOf<number>();
        expectTypeOf(subtract(10, 4)).toEqualTypeOf<number>();
    });

    it('nunca concatena strings, sempre retornando a diferenca numerica', () => {
        const res = subtract('10', '4');
        expect(res).toBe(6);
        expect(typeof res).toBe('number');
        expect(res).not.toBe('104');
    });

    it('quando algum operando é string, aplica o operador direto sem baseToNumber (peculiaridade)', () => {
        expect(subtract('3', true)).toBeNaN();
        expect(subtract(3, true)).toBe(2);
    });

    it('converte null/undefined em texto literal ao aplicar baseToString em ambos operandos (peculiaridade)', () => {
        expect(subtract('1', null)).toBeNaN();
        expect(subtract(null, '1')).toBeNaN();
    });
});
```

- **Comportamento na fase Red:**
  Antes da modificação em `subtract.ts`:
  - A asserção de tipo `expectTypeOf(subtract).returns.toEqualTypeOf<number>()` falha na checagem estática de tipos, pois o tipo retornado é `number | string` (que não é estritamente igual a `number`).
  - O teste com `subtract('3', true)` retorna `2` em vez de `NaN` porque a implementação anterior usava template literal com `${true}` sem o tratamento de `baseToString` compartilhado com `multiply` e `divide`.

#### Validação de Sucesso (Green)
- Após a correção cirúrgica em `subtract.ts`:
  - `expectTypeOf(subtract).returns.toEqualTypeOf<number>()` é satisfeito com sucesso absoluto.
  - Todos os testes unitários (existentes e novos) passam com 100% de sucesso.

---

### Banco de dados

Nenhuma (módulo de funções utilitárias client-side puras em Vue/TypeScript, sem persistência ou banco de dados).

---

### Riscos de quebra e Não-Regressão

1. **Quebra de Contrato:**
   Nenhuma quebra desfavorável. A alteração do tipo de retorno de `number | string` para `number` é um *type narrowing* (estreitamento de tipo) puramente aditivo e benéfico.
   - Chamadores que esperavam `number` agora podem usar o retorno diretamente sem casting (`as number`).
   - Chamadores existentes que já tratavam o retorno ou realizavam coerção continuam perfeitamente compatíveis.
2. **Dependências Internas:**
   A busca global no repositório confirmou que `subtract` é exportada no barrel `src/Helpers/Math/index.ts` e listada no manifesto `src/Helpers/autoImportData.json`. Nenhuma outra função interna do repositório depende de `subtract` retornando `string`.
3. **Não-Regressão:**
   A execução de `./node_modules/.bin/vue-tsc --noEmit` e `./node_modules/.bin/vitest run src/Helpers/Math/subtract.test.ts` garante que nenhum contrato reativo ou matemático seja quebrado.

---

### Validação

Para provar conclusivamente que a implementação foi bem-sucedida, os seguintes comandos devem ser executados e retornar código 0:
```bash
# 1. Validação de lint e formatação
./node_modules/.bin/eslint src/Helpers/Math/subtract.ts src/Helpers/Math/subtract.test.ts

# 2. Validação estática de tipos (garante que nenhum erro de tipo exista no projeto)
./node_modules/.bin/vue-tsc --noEmit

# 3. Execução dos testes unitários e de tipagem
./node_modules/.bin/vitest run src/Helpers/Math/subtract.test.ts
```

---

### Skills Aplicáveis

- `systematic-debugging-best-practices`: Investigação e isolamento da causa raiz comprovada no código e JSDoc.
- `planning-with-files`: Estruturação do plano no arquivo de issue antes de qualquer alteração de código.
- `tdd`: Red-Green workflow através de asserções estáticas de tipo (`expectTypeOf`) e testes unitários com Vitest.
- `code-review-and-quality`: Análise de impacto, estilo ESLint e portões de qualidade.
- `superpowers`: Disciplina de engenharia agentic e execução cirúrgica.
