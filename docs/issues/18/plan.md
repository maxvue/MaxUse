# Plano de Execução — Issue #18: times() faz número errado de invocações acima de MAX_ARRAY_LENGTH

### Descrição e Causa Raiz
- **Problema Relatado e Agravantes:**
  O utilitário `times` em `src/Helpers/Utils/times.ts` documenta explicitamente replicar o comportamento do `_.times` do Lodash (`Semelhante ao _.times do Lodash` e comentários internos sobre a preservação de invocações acima de `MAX_ARRAY_LENGTH`).
  No JavaScript, o comprimento máximo de um array padrão é `MAX_ARRAY_LENGTH = 4294967295` ($2^{32} - 1$). Quando a função `times(n, iteratee)` é chamada com `n > MAX_ARRAY_LENGTH`, o array resultante não pode crescer além desse limite nativo.
  No Lodash 4.x (`lodash/times.js` / `lodash-es/times.js`), a implementação opera em duas fases:
  1. Cria e preenche o array de tamanho `Math.min(n, MAX_ARRAY_LENGTH)` invocando `iteratee` via `baseTimes`.
  2. Executa as iterações excedentes sem acumulação através da lógica:
     ```js
     n -= MAX_ARRAY_LENGTH;
     var index = MAX_ARRAY_LENGTH;
     while (++index < n) iteratee(index);
     ```
  No MaxUse, o laço excedente na linha 26 de `src/Helpers/Utils/times.ts` foi implementado como:
  ```ts
  for (let i = MAX_ARRAY_LENGTH; i < count; i++) fn(i);
  ```
  Isso gera uma divergência crítica de contrato em relação ao Lodash:
  - O código do MaxUse compara o índice absoluto `i` diretamente contra o total `count`, executando `count - MAX_ARRAY_LENGTH` invocações lineares a partir de `MAX_ARRAY_LENGTH`.
  - O Lodash subtrai `MAX_ARRAY_LENGTH` de `n` antes de comparar com o contador pré-incrementado `++index` (onde `index` inicia em `MAX_ARRAY_LENGTH`). Consequentemente, a condição `++index < n` compara um índice absoluto ($\ge 4.294.967.296$) com a quantidade remanescente $n - \text{MAX\_ARRAY\_LENGTH}$.
  - Em escala tratável ($M = 10$):
    - Para `count = 20` ($2 \times M$): Lodash realiza 0 invocações extras no laço; MaxUse realiza 10 invocações extras (índices 10 a 19).
    - Para `count = 25` ($2 \times M + 5$): Lodash realiza 4 invocações extras (índices 11 a 14); MaxUse realiza 15 invocações extras (índices 10 a 24).
  - Embora a severidade seja baixa em tempo de execução real por depender de $n > 4.294.967.295$, trata-se de quebra de contrato na reimplementação canônica do Lodash que contradiz os comentários do próprio código.

- **Causa Raiz Comprovada:**
  - **Arquivo e Linhas Exatos:** [`src/Helpers/Utils/times.ts:L24-L26`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.ts#L24-L26)
    ```ts
    // Além de MAX_ARRAY_LENGTH, o Lodash continua invocando `iteratee` sem
    // acumular no array (que não pode crescer além desse limite nativo).
    for (let i = MAX_ARRAY_LENGTH; i < count; i++) fn(i);
    ```
  - **Fluxo Causal:**
    1. A função `times(n, iteratee)` é invocada com $n > 4.294.967.295$.
    2. `count` é normalizado via `toInteger(toValue(n))`.
    3. O array base é alocado com `length = Math.min(count, MAX_ARRAY_LENGTH)` e preenchido na linha 23 (`result[i] = fn(i)`).
    4. Na linha 26, a iteração de transbordamento executa `for (let i = MAX_ARRAY_LENGTH; i < count; i++) fn(i);` em vez de replicar o cálculo com subtração do limite e comparação pré-incrementada do Lodash (`while (++index < count - MAX_ARRAY_LENGTH)`).
  - **Rastreamento Reverso de Dados:**
    Camada consumidora / UI ⇄ Helper Utilitário `times` ([`src/Helpers/Utils/times.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.ts)) ⇄ Laço excedente L26 ⇄ Invocação da callback `fn(index)`. Função pura em memória, sem persistência em Store, Rotas/API ou Banco de Dados.

### Arquivos afetados
- [`src/Helpers/Utils/times.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.ts): Correção do laço de overflow para replicar o algoritmo do Lodash e inclusão de parâmetro de limite customizável com default `MAX_ARRAY_LENGTH` para possibilitar testes determinísticos e seguros.
- [`src/Helpers/Utils/times.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.test.ts): Adição de casos de teste para cobertura do laço de transbordamento em escala tratável ($M = 10$).

### Execuções propostas
1. **Ajuste cirúrgico em [`src/Helpers/Utils/times.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.ts):**
   - Atualizar a assinatura da função para aceitar opcionalmente o parâmetro `maxArrayLength` (com valor padrão `MAX_ARRAY_LENGTH`):
     ```ts
     export function times<T = number>(
         n: MaybeRefOrGetter<number>,
         iteratee?: (index: number) => T,
         maxArrayLength = MAX_ARRAY_LENGTH
     ): T[]
     ```
   - Utilizar `maxArrayLength` no cálculo de `length = Math.min(count, maxArrayLength)`.
   - Substituir o laço `for (let i = MAX_ARRAY_LENGTH; i < count; i++) fn(i);` pela lógica do Lodash:
     ```ts
     let index = maxArrayLength;
     const remaining = count - maxArrayLength;
     while (++index < remaining) fn(index);
     ```
   - Manter a fidelidade da documentação JSDoc e comentários internos.

2. **Criação de testes em [`src/Helpers/Utils/times.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.test.ts):**
   - Adicionar teste para $count \le 2 \times M$ comprovando 0 invocações adicionais no laço.
   - Adicionar teste para $count > 2 \times M$ comprovando invocações apenas no intervalo de transbordamento Lodash (`++index < remaining`).

3. **Verificação de Regressão e Portões de Qualidade:**
   - Executar `npx vitest run src/Helpers/Utils/times.test.ts` (garantindo que os testes existentes e novos passem).
   - Executar `npm run type-check` para confirmar conformidade de tipos com `vue-tsc`.
   - Executar `npm run lint` para garantir conformidade com as regras de ESLint do projeto.

### Especificação de Teste TDD (Red-Green)
Os seguintes testes automatizados devem ser adicionados ao bloco `describe('times', ...)` em [`src/Helpers/Utils/times.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-18/src/Helpers/Utils/times.test.ts):

```ts
it('não invoca iteratee além do limite quando count <= 2 * maxArrayLength (contrato Lodash)', () => {
    let extraCalls = 0;
    // Com limite reduzido M = 10 e count = 20: Lodash executa baseTimes(10) e 0 chamadas no while
    times(20, (i) => {
        if (i >= 10) extraCalls++;
    }, 10);
    expect(extraCalls).toBe(0);
});

it('invoca iteratee com limites e índices corretos quando count > 2 * maxArrayLength (contrato Lodash)', () => {
    const extraIndices: number[] = [];
    // Com limite reduzido M = 10 e count = 25: remaining = 15; while (++index < 15) com index iniciando em 10 -> índices 11 a 14 (4 chamadas)
    times(25, (i) => {
        if (i >= 10) extraIndices.push(i);
    }, 10);
    expect(extraIndices).toEqual([11, 12, 13, 14]);
});
```

- **Fase Red (no código atual sem a alteração):**
  - Para `count = 20`: o loop `for (let i = 10; i < 20; i++)` executa 10 vezes (`extraCalls` resulta em 10 em vez de 0). Falha no teste.
  - Para `count = 25`: o loop `for (let i = 10; i < 25; i++)` executa 15 vezes gerando `[10, 11, 12, ..., 24]` em vez de `[11, 12, 13, 14]`. Falha no teste.
- **Fase Green (após a alteração cirúrgica proposta):**
  - Os novos testes passam com 100% de sucesso.
  - O total de testes na suíte passa de 6 para 8.

### Banco de dados
Nenhuma. O repositório `@maxvue/max-use` é uma biblioteca client-side/TypeScript de funções puras e composables Vue 3; não há banco de dados nem migrations.

### Riscos de quebra e Não-Regressão
- **Compatibilidade de Assinatura:** O parâmetro `maxArrayLength = MAX_ARRAY_LENGTH` é opcional e posicionado ao final, mantendo retrocompatibilidade total para chamadas existentes com 1 ou 2 argumentos `times(n)` ou `times(n, iteratee)`.
- **Integridade do Array Retornado:** O retorno da função segue idêntico, contendo no máximo `MAX_ARRAY_LENGTH` itens alocados.
- **Não-regressão:** A suíte existente de 6 testes unitários em `times.test.ts` e todas as 392 suítes do projeto continuam passando sem alteração.
- **Exports e Auto-import:** O nome e módulo de exportação pública continuam inalterados em `src/Helpers/Utils/index.ts` e `src/index.ts`.

### Validação
Para comprovar conclusivamente o sucesso da implementação após a execução, os seguintes comandos devem ser executados:

1. **Validação da Causa Raiz (remoção do loop incorreto):**
   ```bash
   ! grep -n "MAX_ARRAY_LENGTH; i <" src/Helpers/Utils/times.ts
   ```
   *Critério de aceitação:* O comando deve retornar vazio (código de saída 0 com a negação), comprovando que o laço antigo `for (let i = MAX_ARRAY_LENGTH; i < count; i++)` foi removido.

2. **Validação dos Testes Unitários de `times`:**
   ```bash
   npx vitest run src/Helpers/Utils/times.test.ts
   ```
   *Critério de aceitação:* 8 passed (8 tests), 0 failures.

3. **Validação de Tipos (TypeScript):**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* `vue-tsc --noEmit` finalizado com 0 erros.

4. **Validação de Estilo e Linting:**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* `eslint . --fix` finalizado com 0 erros.

5. **Validação Global de Não-Regressão:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* Todas as suítes de testes passam (392+ test files passed).

### Skills Aplicáveis
- `superpowers`: Fluxo estruturado de engenharia agentic com TDD, planejamento cirúrgico e validação contínua.
- `tdd`: Especificação estrita de ciclo Red-Green para prevenção e confirmação de defeitos.
- `code-review`: Revisão sistemática da compatibilidade de contratos e não-regressão.
- `systematic-debugging-best-practices`: Análise causal minuciosa de fronteira de inteiros e equivalência com especificações externas (Lodash 4.x).
