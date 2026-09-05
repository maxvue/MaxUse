# Plano de Implementação - Issue #29
## [Audit] diffInMonths retorna 0 em transicoes entre ultimo dia de meses com duracoes distintas (ex: 31/01 a 28/02)

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante auditoria automatizada do ecossistema `@maxvue/max-use` (lente 9 — Testes), foi identificada uma falha no cálculo de diferença em meses na função [`diffInMonths`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts#L46-L60), localizada em [`src/Helpers/Dates/differences.ts:56`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts#L56).

A documentação JSDoc formal da função estabelece seu contrato:
```typescript
/**
 * Calcula a diferença absoluta em meses COMPLETOS entre duas datas.
 * O dia é considerado: 31/01 → 01/02 retorna 0, pois não completou um mês.
 */
```

A implementação calcula inicialmente a diferença de meses calendário:
```typescript
let months = (later.getFullYear() - earlier.getFullYear()) * 12
           + (later.getMonth() - earlier.getMonth());
```
Em seguida, para garantir a regra de "meses completos" (evitando que 31/01 a 01/02 conte como 1 mês), a função desconta o mês em curso comparando ordinalmente os dias do mês:
```typescript
if (later.getDate() < earlier.getDate()) months--;
```

Entretanto, em transições em que a data inicial ocorre no último dia de um mês mais longo (ex.: dia 31) e a data final ocorre no último dia de um mês mais curto (ex.: 28 de fevereiro em anos regulares, 29 de fevereiro em bissextos, ou 30 em abril, junho, setembro e novembro), o dia de `later` é numericamente menor que o de `earlier` (`28 < 31`, `29 < 31`, `30 < 31`). Como consequência direta:
1. O decremento `months--` é disparado indevidamente.
2. O intervalo de 31 de janeiro a 28 de fevereiro (no qual o mês de fevereiro transcorreu em sua totalidade) retorna `0` em vez de `1`.
3. O intervalo de 31 de março a 30 de abril retorna `0` em vez de `1`.
4. O intervalo de 31 de janeiro de 2024 a 29 de fevereiro de 2024 (ano bissexto) retorna `0` em vez de `1`.
5. Intervalos multi-mês também são subestimados: 31/01 a 30/04 retorna `2` em vez de `3`; 31/01/2025 a 28/02/2026 retorna `12` em vez de `13`.

**Agravantes do Problema:**
1. **Subestimação em cascata no cálculo de anos (`diffInYears`):** A função [`diffInYears`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts#L66-L68) é calculada diretamente como `Math.floor(diffInMonths(date1, date2) / 12)`. Quando `diffInMonths` retorna 11 meses em vez de 12 para transições anuais que encerram no final de fevereiro (ex.: '2024-02-29' a '2025-02-28'), `diffInYears` retorna `0` em vez de `1`, falhando no cálculo de idade e vigência de contratos.
2. **Incoerência semântica com o helper de adição temporal [`addTime`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/addTime.ts#L38-L41):** A função `addTime(date, amount, 'months')` já possui tratamento consolidado para overflow de fim de mês (`if (date.getDate() !== expectedDay) date.setDate(0);`), mapeando `31/01 + 1 mês` para `28/02` (ou `29/02`). Havia, portanto, uma quebra de simetria: `addTime('2026-01-31', 1, 'month')` gerava `2026-02-28`, mas a diferença reversa `diffInMonths('2026-01-31', '2026-02-28')` retornava `0`.
3. **Propagação para utilitários de tempo decorrido:** Os helpers [`monthsAgo`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/timeAgo.ts#L58-L63) e [`yearsAgo`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/timeAgo.ts#L71-L75) delegam para `diffInMonths` e `diffInYears`, herdando o mesmo desvio de contagem.

#### Causa Raiz Comprovada
- **Localização Exata no Código-Fonte:**
  - [`src/Helpers/Dates/differences.ts:L56-L58`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts#L56-L58)
  ```typescript
  // Desconta o mês em curso se o dia ainda não foi alcançado
  if (later.getDate() < earlier.getDate()) months--;
  ```
- **Mecanismo da Falha:**
  A condição `later.getDate() < earlier.getDate()` pressupõe implicitamente que todo mês possui pelo menos a mesma quantidade de dias que o mês de `earlier`. Quando o mês de `later` possui menos dias do que o ordinal `earlier.getDate()`, é matematicamente impossível que `later.getDate()` atinja ou supere `earlier.getDate()`. O último dia possível do mês de `later` (ex.: 28 em fevereiro) representa o encerramento do ciclo mensal para a data base correspondente. Ao exigir `later.getDate() >= earlier.getDate()`, a lógica exige que fevereiro chegue ao dia 31 para completar 1 mês, o que jamais ocorrerá.
- **Rastreamento Reverso de Dados (Arquitetura em Camadas):**
  - **Camada UI / Consumidor:** Aplicação consome `diffInMonths(d1, d2)` ou `diffInYears(d1, d2)` de `@maxvue/max-use/dates`.
  - **Camada Store:** N/A (biblioteca puramente stateless de helpers e composables).
  - **Camada API / Rotas:** N/A (operações utilitárias client-side isoladas, sem chamadas HTTP).
  - **Camada Service / Controller / Helpers:**
    - [`diffInMonths`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts#L46) recebe `date1` e `date2`.
    - Normaliza entradas via [`_parseDate`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/_parseDate.ts#L9) (preservando o fuso local para formato `YYYY-MM-DD`).
    - Ordena cronologicamente: `[earlier, later] = d1 <= d2 ? [d1, d2] : [d2, d1]`.
    - Computa `months` e avalia a comparação de dias em [`differences.ts:57`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts#L57).
  - **Camada DB:** N/A (sem banco de dados).

---

### Arquivos Afetados

A implementação da solução afetará cirurgicamente apenas 2 arquivos do projeto:

1. [`src/Helpers/Dates/differences.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts):
   - Atualização do cálculo de desconto do mês em curso em `diffInMonths`:
     Calcular o último dia do mês de destino `later`: `const lastDayOfLaterMonth = new Date(later.getFullYear(), later.getMonth() + 1, 0).getDate();`
     Ajustar o dia alvo com clamp: `const anchorDay = Math.min(earlier.getDate(), lastDayOfLaterMonth);`
     Verificar se `later.getDate() < anchorDay` antes de decrementar `months--`.
2. [`src/Helpers/Dates/differences.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.test.ts):
   - Adição de bloco de testes dedicado cobrindo os cenários da Issue #29:
     - 31/01 a 28/02 (ano não bissexto -> 1 mês completo).
     - 31/01 a 29/02 (ano bissexto -> 1 mês completo).
     - 31/03 a 30/04, 31/05 a 30/06, 31/08 a 30/09, 31/10 a 30/11 -> 1 mês completo.
     - Fronteira: 31/01 a 27/02 -> 0 meses (não completou).
     - Fronteira bissexta: 31/01/2024 a 28/02/2024 -> 0 meses (fevereiro bissexto vai até 29).
     - Multi-meses: 31/01 a 30/04 -> 3 meses completos; 31/01/2025 a 28/02/2026 -> 13 meses.
     - Cálculo de anos: 29/02/2024 a 28/02/2025 -> 1 ano completo via `diffInYears`.
     - Simetria total com inversão de ordem dos parâmetros.

> [!IMPORTANT]
> **Higiene de Versionamento e Restrição de Escopo:**
> Nenhum outro arquivo de produção ou symlink (`node_modules`, `.claude/skills`, `.opencode/skills`) deve ser alterado ou colocado em stage.

---

### Execuções Propostas

O processo de implementação seguirá rigorosamente o ciclo TDD (Red-Green-Refactor):

#### Passo 1: Preparação e Garantia de Higiene
1. Verificar integridade da branch de trabalho (`git status`).
2. Garantir ausência de alterações não intencionais no stage.

#### Passo 2: Implementação dos Testes de Reprodução (Fase Red)
1. Abrir [`src/Helpers/Dates/differences.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.test.ts).
2. Adicionar ao final do arquivo a suíte de testes de regressão específica:
   ```typescript
   describe('diffInMonths / diffInYears — transições entre último dia de meses (Issue #29)', () => {
       it('considera 1 mês completo em transição 31/01 a 28/02 (ano não bissexto)', () => {
           expect(diffInMonths('2026-01-31', '2026-02-28')).toBe(1);
           expect(diffInMonths('2026-02-28', '2026-01-31')).toBe(1);
       });

       it('considera 1 mês completo em transição 31/01 a 29/02 (ano bissexto)', () => {
           expect(diffInMonths('2024-01-31', '2024-02-29')).toBe(1);
           expect(diffInMonths('2024-02-29', '2024-01-31')).toBe(1);
       });

       it('considera 1 mês completo em transições de 31 dias para meses de 30 dias', () => {
           expect(diffInMonths('2026-03-31', '2026-04-30')).toBe(1);
           expect(diffInMonths('2026-05-31', '2026-06-30')).toBe(1);
           expect(diffInMonths('2026-08-31', '2026-09-30')).toBe(1);
           expect(diffInMonths('2026-10-31', '2026-11-30')).toBe(1);
       });

       it('não completa o mês se o último dia do mês de destino não foi alcançado', () => {
           expect(diffInMonths('2026-01-31', '2026-02-27')).toBe(0);
           expect(diffInMonths('2024-01-31', '2024-02-28')).toBe(0);
           expect(diffInMonths('2026-03-31', '2026-04-29')).toBe(0);
       });

       it('calcula múltiplos meses corretamente com ancoragem no fim do mês', () => {
           expect(diffInMonths('2026-01-31', '2026-04-30')).toBe(3);
           expect(diffInMonths('2025-01-31', '2026-02-28')).toBe(13);
       });

       it('calcula 1 ano completo para aniversário em 29 de fevereiro no ano seguinte não bissexto', () => {
           expect(diffInYears('2024-02-29', '2025-02-28')).toBe(1);
           expect(diffInYears('2024-02-29', '2025-02-27')).toBe(0);
       });
   });
   ```
3. Executar o teste unitário isolado para comprovar a falha (*Red*):
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Dates/differences.test.ts
   ```
   - Espera-se a falha com `AssertionError: expected 0 to be 1` para `'2026-01-31'` a `'2026-02-28'`.

#### Passo 3: Correção Cirúrgica no Código de Produção (Fase Green)
1. Abrir [`src/Helpers/Dates/differences.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.ts).
2. Localizar as linhas 56-58:
   ```typescript
   // Desconta o mês em curso se o dia ainda não foi alcançado
   if (later.getDate() < earlier.getDate()) months--;
   ```
3. Substituir por:
   ```typescript
   // Desconta o mês em curso se o dia ainda não foi alcançado no mês de destino
   const lastDayOfLaterMonth = new Date(later.getFullYear(), later.getMonth() + 1, 0).getDate();
   const anchorDay = Math.min(earlier.getDate(), lastDayOfLaterMonth);
   if (later.getDate() < anchorDay) months--;
   ```
   *Explicação técnica:* `new Date(year, month + 1, 0).getDate()` retorna o total exato de dias do mês de `later` (28, 29, 30 ou 31). Se `earlier` tinha o dia 31 e o mês de destino só vai até 28 (fevereiro), o `anchorDay` é ajustado para 28. Portanto, se `later.getDate()` for 28, o dia alvo foi plenamente alcançado e `months` não é descontado. Se `later.getDate()` for 27, o mês não foi completo e continua sendo descontado (`months--`).

#### Passo 4: Validação dos Testes Unitários (Fase Green)
1. Executar os testes unitários do helper:
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Dates/differences.test.ts
   ```
2. Confirmar que todos os testes (anteriores e novos) passam com 100% de sucesso.
3. Executar os testes dos helpers correlatos de data:
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Dates/timeAgo.test.ts
   ./node_modules/.bin/vitest run src/Helpers/Dates/addTime.test.ts
   ```

#### Passo 5: Verificação de Tipagem Estática
1. Executar o verificador de tipos:
   ```bash
   npm run type-check
   ```
2. Garantir retorno com código 0 e sem erros do `vue-tsc`.

#### Passo 6: Verificação de Formatação e Estilo (Linting)
1. Executar o linter oficial:
   ```bash
   npm run lint
   ```
2. Garantir código 0 e conformidade com as regras ESLint do repositório.

#### Passo 7: Verificação Geral de Não-Regressão
1. Executar toda a suíte de testes do projeto:
   ```bash
   ./node_modules/.bin/vitest run
   ```
2. Garantir aprovação de 100% dos testes da biblioteca.

#### Passo 8: Auditoria de Escopo Pré-Commit
1. Executar `git status --porcelain`.
2. Executar `git diff dev --name-status`.
3. Confirmar que **apenas** `src/Helpers/Dates/differences.ts`, `src/Helpers/Dates/differences.test.ts` e arquivos em `docs/issues/29/` foram modificados.

---

### Especificação de Teste TDD (Red-Green)

#### Caso de Teste Red-Green
Arquivo: [`src/Helpers/Dates/differences.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-29/src/Helpers/Dates/differences.test.ts)

```typescript
describe('diffInMonths / diffInYears — transições entre último dia de meses (Issue #29)', () => {
    it('considera 1 mês completo em transição 31/01 a 28/02 (ano não bissexto)', () => {
        expect(diffInMonths('2026-01-31', '2026-02-28')).toBe(1);
        expect(diffInMonths('2026-02-28', '2026-01-31')).toBe(1);
    });

    it('considera 1 mês completo em transição 31/01 a 29/02 (ano bissexto)', () => {
        expect(diffInMonths('2024-01-31', '2024-02-29')).toBe(1);
        expect(diffInMonths('2024-02-29', '2024-01-31')).toBe(1);
    });

    it('considera 1 mês completo em transições de 31 dias para meses de 30 dias', () => {
        expect(diffInMonths('2026-03-31', '2026-04-30')).toBe(1);
        expect(diffInMonths('2026-05-31', '2026-06-30')).toBe(1);
        expect(diffInMonths('2026-08-31', '2026-09-30')).toBe(1);
        expect(diffInMonths('2026-10-31', '2026-11-30')).toBe(1);
    });

    it('não completa o mês se o último dia do mês de destino não foi alcançado', () => {
        expect(diffInMonths('2026-01-31', '2026-02-27')).toBe(0);
        expect(diffInMonths('2024-01-31', '2024-02-28')).toBe(0);
        expect(diffInMonths('2026-03-31', '2026-04-29')).toBe(0);
    });

    it('calcula múltiplos meses corretamente com ancoragem no fim do mês', () => {
        expect(diffInMonths('2026-01-31', '2026-04-30')).toBe(3);
        expect(diffInMonths('2025-01-31', '2026-02-28')).toBe(13);
    });

    it('calcula 1 ano completo para aniversário em 29 de fevereiro no ano seguinte não bissexto', () => {
        expect(diffInYears('2024-02-29', '2025-02-28')).toBe(1);
        expect(diffInYears('2024-02-29', '2025-02-27')).toBe(0);
    });
});
```

#### Comportamento Red (antes da correção):
```text
FAIL src/Helpers/Dates/differences.test.ts > diffInMonths / diffInYears — transições entre último dia de meses (Issue #29) > considera 1 mês completo em transição 31/01 a 28/02 (ano não bissexto)
AssertionError: expected 0 to be 1
- Expected: 1
+ Received: 0
```

#### Comportamento Green (após a aplicação do anchorDay com clamp no código de produção):
```text
✓ src/Helpers/Dates/differences.test.ts (25 tests)
  ✓ diffInSeconds (6)
  ✓ diffInMinutes (1)
  ✓ diffInHours (1)
  ✓ diffInDays (1)
  ✓ diffInMonths (2)
  ✓ diffInYears (3)
  ✓ diffInYears / diffInMonths — regressão auditoria (achado 026) (5)
  ✓ diffInMonths / diffInYears — transições entre último dia de meses (Issue #29) (6)
```

---

### Banco de dados

**Nenhuma migration necessária.**
O `@maxvue/max-use` é um pacote puramente front-end / client-side de utilitários e composables reativos para Vue 3, sem integração com banco de dados, ORMs ou tabelas relacionais.

---

### Riscos de Quebra e Não-Regressão

1. **Risco de regressão na regra de meses incompletos (Achado 026):**
   - *Cenário:* Garantir que a virada de mês (ex.: 31/01 a 01/02) continue retornando `0`, assim como 31/12 a 01/01 continue retornando `0` anos.
   - *Garantia:* O teste existente da suíte `diffInYears / diffInMonths — regressão auditoria (achado 026)` é executado continuamente. Como `anchorDay = Math.min(31, 28) = 28`, em `01/02` temos `1 < 28`, resultando corretamente no decremento `months--`.
2. **Risco de quebra de simetria:**
   - *Cenário:* `diffInMonths(a, b)` deve produzir exatamente o mesmo valor que `diffInMonths(b, a)`.
   - *Garantia:* A ordenação canônica `const [earlier, later] = d1 <= d2 ? [d1, d2] : [d2, d1]` é mantida intacta, garantindo simetria perfeita em 100% dos pares de datas.
3. **Contratos de API e Assinaturas TypeScript:**
   - A assinatura formal de `diffInMonths(date1: RefDate, date2: RefDate): number` permanece idêntica.
   - Nenhuma dependência externa ou nova biblioteca é adicionada.

---

### Validação

Comandos de validação automatizada para atestar a implementação:

1. **Validação unitária da alteração:**
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Dates/differences.test.ts
   ```
   *Critério de aceitação:* Todos os 25 testes de `differences.test.ts` devem ser aprovados com sucesso.

2. **Validação de helpers dependentes:**
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Dates/timeAgo.test.ts
   ./node_modules/.bin/vitest run src/Helpers/Dates/addTime.test.ts
   ```
   *Critério de aceitação:* Todos os testes de `timeAgo` e `addTime` devem ser aprovados.

3. **Validação de tipagem estática:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* Código de saída 0 sem qualquer inconsistência do compilador TypeScript (`vue-tsc`).

4. **Validação de qualidade e padronização (linting):**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* Código de saída 0 no ESLint.

5. **Validação completa da suíte de testes do projeto:**
   ```bash
   ./node_modules/.bin/vitest run
   ```
   *Critério de aceitação:* 100% dos testes do repositório executados e aprovados.

6. **Auditoria rigorosa de diff e escopo:**
   ```bash
   git diff dev --name-status
   ```
   *Critério de aceitação:* Modificações restritas unicamente a `src/Helpers/Dates/differences.ts`, `src/Helpers/Dates/differences.test.ts` e arquivos em `docs/issues/29/`.

---

### Skills Aplicáveis

- `systematic-debugging-best-practices`: Isolamento da causa raiz de descompasso de calendário e determinação cirúrgica do ponto de falha.
- `planning-with-files`: Documentação e persistência do plano arquitetural detalhado em `docs/issues/29/plan.md`.
- `tdd`: Aplicação do ciclo Red-Green-Refactor com teste de falha comprovada antes da modificação em código de produção.
- `superpowers`: Disciplina estruturada de engenharia de software com critérios estritos de aceite e não-regressão.
- `code-review`: Revisão sistemática de limites de escopo e garantia de não-inclusão de artefatos indesejados.
- `production-code-audit`: Auditoria de contratos públicos, simetria matemática e compatibilidade estrita.
