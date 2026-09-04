# Plano de Implementação - Issue #24
## [Audit] formatMailDate documenta e retorna grafia incorreta 'Mêses' com circunflexo no plural

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante auditoria automatizada do ecossistema de utilitários `@maxvue/max-use` (lente 11 - documentação e correção gramatical), foi identificada uma incorreção ortográfica na formatação textual de intervalos temporais compreendidos entre 30 dias e menos de 365 dias no utilitário [`src/Helpers/Dates/formatMailDate.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.ts).

O helper `formatMailDate` converte uma data (timestamp, string ou objeto `Date`) em texto conciso no estilo de caixas de entrada de e-mail e mensagens. Ao formatar múltiplos meses, a função interpola a quantidade calculada com o sufixo `"Mêses"` (com acento circunflexo gráfico): `${months} Mêses`.

Conforme as regras do Acordo Ortográfico da Língua Portuguesa vigente:
- A forma no singular **"mês"** é um monossílabo tônico terminado em "-s", recebendo obrigatoriamente acento circunflexo.
- No plural, ao receber o sufixo flexional, torna-se a palavra paroxítona **"meses"**, cuja terminação em "-es" não admite acento gráfico.
- Portanto, a grafia `"Mêses"` com circunflexo no plural constitui um erro gramatical manifesto.

**Agravantes do Problema:**
1. **Documentação JSDoc Oficial Propagando o Erro:** Em [`src/Helpers/Dates/formatMailDate.ts:L13`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.ts#L13), o contrato formal do JSDoc documenta ` * - Menos de 1 ano (< 365 dias): "X Mêses" (ex: "2 Mêses", "1 Mês")`, induzindo os consumidores da biblioteca e ferramentas de auto-complete / IntelliSense a reproduzir o erro.
2. **Suíte de Testes Blindando a Regressão Ortográfica:** Em [`src/Helpers/Dates/formatMailDate.test.ts:L51-L55`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.test.ts#L51-L55), o caso de teste nomeado `'formata menos de 1 ano como "X Mêses"'` possui asserção positiva `expect(formatMailDate(date60days)).toBe('2 Mêses')`, travando o comportamento defeituoso e impedindo que a suíte automatizada de testes aponte a falha gramatical.
3. **Inconsistência Terminológica com Outros Utilitários:** O composable correlato [`src/Composables/useTimeAgo.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Composables/useTimeAgo.ts#L13) e sua suíte de testes [`src/Composables/useTimeAgo.test.ts:L116`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Composables/useTimeAgo.test.ts#L116) empregam corretamente o termo `"Meses"`, resultando em incoerência de padrões léxicos dentro da mesma biblioteca.
4. **Histórico de Reprovação no Portão de Qualidade:** A tentativa prévia de implementação da issue #24 foi reprovada na etapa de verificação (`result-check.json`) porque foram incluídos no commit arquivos fora de escopo e symlinks absolutos para a máquina local (`node_modules`, `.claude/skills`, `.opencode/skills`), violando os Portões 4 (Escopo) e 2 (Risco de quebra de ambiente). O presente plano define controles estritos de higiene de versionamento para sanar definitivamente tal deficiência.

#### Causa Raiz Comprovada
- **Localização Exata no Código-Fonte:**
  - Código de produção: [`src/Helpers/Dates/formatMailDate.ts:L79`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.ts#L79)
    ```ts
    return months === 1 ? '1 Mês' : `${months} Mêses`;
    ```
  - Documentação JSDoc: [`src/Helpers/Dates/formatMailDate.ts:L13`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.ts#L13)
    ```ts
     * - Menos de 1 ano (< 365 dias): "X Mêses" (ex: "2 Mêses", "1 Mês")
    ```
  - Suíte de testes: [`src/Helpers/Dates/formatMailDate.test.ts:L51-L55`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.test.ts#L51-L55)
    ```ts
    it('formata menos de 1 ano como "X Mêses"', () => {
        const now = new Date();
        const date60days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60, 10, 0);
        expect(formatMailDate(date60days)).toBe('2 Mêses');
    });
    ```
- **Fluxo Causal e Rastreamento Reverso de Dados:**
  - **Camada UI / Consumidor:** Componente de interface consome `@maxvue/max-use` e invoca `formatMailDate(timestamp)`.
  - **Camada Helper (`formatMailDate`):**
    1. O valor é extraído via `toValue(value)` e normalizado por `_parseDate(data)`.
    2. Calcula-se a diferença em milissegundos contra a data atual (`new Date()`).
    3. Para `calendarDays >= 30 && calendarDays < 365`, a variável `months` é computada pela fórmula de meses corridos:
       `const months = Math.max(1, (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth()) || Math.floor(calendarDays / 30));`
    4. Quando `months > 1`, a expressão ternária avalia para o ramo plural `${months} Mêses`, propagando a string com o circunflexo indevido de volta ao chamador.
  - **Rastreamento Reverso de Camadas:**
    - `UI` ⇄ `formatMailDate.ts` ⇄ `_parseDate.ts`.
    - Por se tratar de biblioteca client-side de utilitários isolados para Vue, inexistem camadas de Store reativa global (Pinia/Vuex), rotas de API HTTP, Controllers/Services de backend ou Banco de Dados (DB).

---

### Arquivos afetados

Apenas 2 arquivos de código-fonte/testes e os artefatos de documentação da issue no diretório `docs/issues/24/` devem ser afetados:

1. [`src/Helpers/Dates/formatMailDate.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.ts):
   - Atualização do JSDoc na linha 13: alteração de `"X Mêses"` para `"X Meses"`.
   - Correção do retorno na linha 79: alteração de `${months} Mêses` para `${months} Meses`.
2. [`src/Helpers/Dates/formatMailDate.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.test.ts):
   - Atualização do título do teste na linha 51: `'formata menos de 1 ano como "X Meses"'`.
   - Atualização da asserção na linha 54: `expect(formatMailDate(date60days)).toBe('2 Meses')`.

> [!IMPORTANT]
> **Restrição Crítica de Escopo (Prevenção de Reprovação nos Portões 2 e 4):**
> Sob nenhuma hipótese devem ser versionados ou incluídos no stage arquivos ou symlinks como `node_modules`, `.claude/skills`, `.opencode/skills` ou arquivos temporários de IDE. Caso existam symlinks ou arquivos espúrios na árvore de trabalho, o agente executor deve expurgá-los do stage antes do commit.

---

### Execuções propostas

A implementação deve seguir de maneira estrita o ciclo TDD (Red-Green-Refactor) com garantia de higiene do repositório:

#### Passo 1: Preparação do Ambiente e Higiene de Versionamento
1. Assegurar que a árvore de trabalho esteja alinhada à branch base `dev`.
2. Se houver resquícios de symlinks espúrios herdados (`node_modules`, `.claude/skills`, `.opencode/skills`), garantir que não estejam preparados para commit:
   ```bash
   git rm --cached -f node_modules .claude/skills .opencode/skills 2>/dev/null || true
   ```

#### Passo 2: Atualização da Suíte de Testes Unitários (Fase Red)
1. No arquivo [`src/Helpers/Dates/formatMailDate.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.test.ts):
   - Modificar a linha 51 de:
     ```ts
     it('formata menos de 1 ano como "X Mêses"', () => {
     ```
     para:
     ```ts
     it('formata menos de 1 ano como "X Meses"', () => {
     ```
   - Modificar a linha 54 de:
     ```ts
     expect(formatMailDate(date60days)).toBe('2 Mêses');
     ```
     para:
     ```ts
     expect(formatMailDate(date60days)).toBe('2 Meses');
     ```
2. Executar o teste unitário isolado e observar a falha (*Red*):
   ```bash
   npm run test -- src/Helpers/Dates/formatMailDate.test.ts
   ```
   - A asserção deve falhar com: `AssertionError: expected '2 Mêses' to be '2 Meses'`.

#### Passo 3: Correção Cirúrgica no Código de Produção (Fase Green)
1. No arquivo [`src/Helpers/Dates/formatMailDate.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.ts):
   - Modificar a linha 13 da documentação JSDoc:
     ```ts
     // De:
      * - Menos de 1 ano (< 365 dias): "X Mêses" (ex: "2 Mêses", "1 Mês")
     // Para:
      * - Menos de 1 ano (< 365 dias): "X Meses" (ex: "2 Meses", "1 Mês")
     ```
   - Modificar a linha 79 do retorno da função:
     ```ts
     // De:
     return months === 1 ? '1 Mês' : `${months} Mêses`;
     // Para:
     return months === 1 ? '1 Mês' : `${months} Meses`;
     ```

#### Passo 4: Validação do Teste Unitário (Fase Green)
1. Executar novamente o teste unitário:
   ```bash
   npm run test -- src/Helpers/Dates/formatMailDate.test.ts
   ```
2. Comprovar que todos os 8 testes do helper `formatMailDate` passam com 100% de sucesso.

#### Passo 5: Verificação de Tipagem Estática e Linting
1. Executar a verificação de tipos:
   ```bash
   npm run type-check
   ```
   - Deve finalizar com código de saída 0 e nenhum erro reportado pelo `vue-tsc`.
2. Executar o linter oficial do projeto:
   ```bash
   npm run lint
   ```
   - Deve finalizar com código 0 e sem violações de convenções de estilo.

#### Passo 6: Verificação Completa de Não-Regressão
1. Executar toda a suíte de testes do projeto:
   ```bash
   npm test
   ```
   - Todos os 400+ arquivos de teste e 3400+ testes devem passar sem nenhuma regressão.

#### Passo 7: Auditoria Rigorosa de Escopo Pré-Commit
1. Executar a verificação de status:
   ```bash
   git status --porcelain
   ```
2. Executar a verificação de diff comparativo contra `dev`:
   ```bash
   git diff dev --name-status
   ```
3. Confirmar que **apenas** `src/Helpers/Dates/formatMailDate.ts`, `src/Helpers/Dates/formatMailDate.test.ts` e arquivos em `docs/issues/24/` foram alterados. NENHUM symlink (`node_modules`, `.claude/skills`, `.opencode/skills`) pode constar nas alterações.

---

### Especificação de Teste TDD (Red-Green)

#### Caso de Teste Red-Green
Arquivo: [`src/Helpers/Dates/formatMailDate.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-24/src/Helpers/Dates/formatMailDate.test.ts)

```ts
it('formata menos de 1 ano como "X Meses"', () => {
    const now = new Date();
    const date60days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60, 10, 0);
    expect(formatMailDate(date60days)).toBe('2 Meses');
});
```

#### Comportamento Red (antes da correção no código de produção):
```text
FAIL src/Helpers/Dates/formatMailDate.test.ts > formatMailDate > formata menos de 1 ano como "X Meses"
AssertionError: expected '2 Mêses' to be '2 Meses'
- Expected: "2 Meses"
+ Received: "2 Mêses"
```

#### Comportamento Green (após a correção no código de produção):
```text
✓ src/Helpers/Dates/formatMailDate.test.ts (8 tests)
  ✓ formatMailDate > retorna vazio para null ou inválido
  ✓ formatMailDate > formata menos de 1h como "X min"
  ✓ formatMailDate > formata hoje com mais de 1h como "HH:mm"
  ✓ formatMailDate > formata ontem como "Ontem HH:mm"
  ✓ formatMailDate > formata menos de 1 semana como "X dias"
  ✓ formatMailDate > formata menos de 1 mês como "X Semanas"
  ✓ formatMailDate > formata menos de 1 ano como "X Meses"
  ✓ formatMailDate > formata mais de 1 ano como "X Anos"
```

---

### Banco de dados

**Nenhuma migration necessária.**
O repositório `@maxvue/max-use` é uma biblioteca front-end client-side pura de utilitários e composables Vue, sem camada de persistência de dados, ORMs ou tabelas de banco de dados.

---

### Riscos de quebra e Não-Regressão

1. **Quebra de Asserções em Testes de Clientes Consumidores:**
   - *Risco:* Projetos externos consumidores de `@maxvue/max-use` que utilizem `formatMailDate` e possuam testes asserindo a string exata `'2 Mêses'` (com circunflexo) sofrerão quebra em suas suítes ao atualizar para a nova versão.
   - *Mitigação:* Trata-se de correção estrita de bug léxico/ortográfico. A alteração deve constar nas notas de lançamento (release notes) e no changelog da versão como fix de documentação e gramática.
2. **Impacto em Outros Utilitários Internos:**
   - *Risco:* Inconsistência caso outros componentes dependam de `formatMailDate`.
   - *Mitigação:* A busca global em todo o repositório confirmou que nenhum outro helper ou componente depende da string com circunflexo. Utilitários como `useTimeAgo` já usam `"Meses"` padronizadamente.
3. **Contrato de Tipagem TypeScript:**
   - A assinatura `formatMailDate(value: RefDate): string` permanece 100% inalterada, mantendo total compatibilidade sintática e de tipos.
4. **Risco de Escopo e Poluição de Repositório (Portões 2 e 4):**
   - *Risco:* Reincidência da reprovação anterior com commit acidental de symlinks para `node_modules` ou diretórios `.claude`/`.opencode`.
   - *Mitigação:* O plano proíbe expressamente `git add .` e orienta a adição cirúrgica e explícita apenas dos arquivos alvo.

---

### Validação

Comandos automatizados para validação conclusiva e sem ressalvas da implementação:

1. **Teste unitário específico do helper:**
   ```bash
   npm run test -- src/Helpers/Dates/formatMailDate.test.ts
   ```
   *Critério de aceitação:* 8 testes executados com 100% de sucesso, incluindo a validação de `'2 Meses'`.

2. **Verificação de tipagem estática:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* `vue-tsc --noEmit` executa com código 0 e sem nenhum erro.

3. **Verificação de padronização e estilo (linting):**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* `eslint . --fix` executa com código 0 e sem advertências ou erros.

4. **Suíte completa de testes do repositório:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* 100% dos testes aprovados (mais de 400 arquivos e 3400 testes) sem regressão.

5. **Auditoria estrita de escopo (Portão de Qualidade 4):**
   ```bash
   git diff dev --name-status
   ```
   *Critério de aceitação:* Apenas `src/Helpers/Dates/formatMailDate.ts`, `src/Helpers/Dates/formatMailDate.test.ts` e arquivos em `docs/issues/24/` aparecem na listagem. Nenhum symlink ou arquivo espúrio presente.

---

### Skills Aplicáveis

- `systematic-debugging-best-practices`: Rastreamento causal e isolamento preciso da falha gramatical no código-fonte.
- `planning-with-files`: Estruturação persistida do plano de execução em arquivos de documentação para guiar as etapas subsequentes.
- `tdd`: Metodologia Red-Green-Refactor, garantindo a reprodução da falha antes da correção e a validação do comportamento correto após a intervenção.
- `superpowers`: Fluxo rigoroso de engenharia com critérios de aceitação estritos e portões de qualidade.
- `code-review`: Auditoria de diff, garantia de escopo limpo e conformidade ortográfica e de JSDoc.
- `production-code-audit`: Validação de contratos públicos, consistência terminológica e higiene de dependências.
