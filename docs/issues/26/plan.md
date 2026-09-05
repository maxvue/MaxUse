# Plano de Implementação — Issue #26
## [Audit] wireSize aceita e documenta opção voltage_drop em WireOptions mas ignora o parâmetro no cálculo

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante auditoria automatizada do ecossistema de utilitários `@maxvue/max-use` (lente 11 - Documentação e Contratos de API pública), foi identificada uma divergência crítica entre o contrato formal/documentado e a implementação prática no módulo de cálculos elétricos em [`src/Helpers/Electrical/wireSize.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts).

O tipo público `WireOptions` documenta formalmente via JSDoc `@property voltage_drop - Queda de tensão máxima permitida (V).` e declara a propriedade no tipo TypeScript: `voltage_drop?: number | string;` ([`src/Helpers/Electrical/wireSize.ts:L23`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L23) e [`src/Helpers/Electrical/wireSize.ts:L39`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L39)). Essa opção existe para permitir que engenheiros eletricistas e integradores dimensionem condutores limitando a perda de potencial elétrico a um valor fixo em Volts absolutos (por exemplo: circuitos sensíveis de instrumentação, automação predial/industrial, alimentação de equipamentos hospitalares ou limites estritos de queda em painéis solares e bancos de baterias), em vez de uma porcentagem genérica relativa à tensão nominal da rede.

Contudo, na implementação interna de `wireSize`, o valor `options.voltage_drop` **nunca é lido nem considerado em nenhuma linha de código**. A função limita-se a ler exclusivamente `options.max_loss` (aplicando fallback padrão de 5%), ignorando por completo qualquer valor informado em `voltage_drop`.

**Agravantes do Problema:**
1. **Falsa Sensação de Segurança e Risco de Subdimensionamento:** Um integrador que informe `{ voltage: 220, voltage_drop: 2, length: 50 }` espera que o condutor dimensionado limite a perda a 2 Volts absolutos. Como `wireSize` ignora o parâmetro, utiliza a tolerância padrão de 5% de 220V (11 Volts). Em vez de recomendar um condutor de 25 mm² (queda real de ~1,77V), a função entrega um condutor subdimensionado de 6 mm² (queda real de ~7,19V), resultando em condutores com queda mais de 350% superior ao limite estipulado pelo projeto.
2. **Contrato de Tipagem TypeScript Válido Sem Efeito em Tempo de Execução:** O compilador TypeScript e IDEs com IntelliSense aceitam `voltage_drop` normalmente (tanto `number` quanto `string`), dando ao desenvolvedor a garantia formal de que o parâmetro é suportado, quando na verdade ele é silenciosamente descartado.
3. **Ausência Absoluta de Testes Protetores:** A suíte de testes unitários [`src/Helpers/Electrical/wireSize.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.test.ts) (32 testes existentes) possui dezenas de asserções cobrindo ampacidade, tabelas NBR 5410, derating de fca/fct e limites percentuais de `max_loss`, mas **nenhum** teste sequer menciona ou protege o parâmetro `voltage_drop`.
4. **Violação de Boas Práticas da NBR 5410:** Embora a NBR 5410 convencione limites percentuais padrão (ex: 4% para circuitos terminais, 7% total da instalação), na prática da engenharia é mandatório respeitar limites de queda absoluta em Volts quando impostos por equipamentos terminais ou especificações de projeto. Ignorar esse parâmetro compromete a integridade técnica da biblioteca.

#### Causa Raiz Comprovada
- **Localização Exata no Código-Fonte:**
  - Declaração de tipo e JSDoc: [`src/Helpers/Electrical/wireSize.ts:L23`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L23) e [`src/Helpers/Electrical/wireSize.ts:L39`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L39)
    ```ts
    23:  * @property voltage_drop - Queda de tensão máxima permitida (V).
    ...
    39:     voltage_drop?: number | string;
    ```
  - Leitura unilateral de `max_loss` ignorando `voltage_drop`: [`src/Helpers/Electrical/wireSize.ts:L92`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L92)
    ```ts
    92:     const max_percent = Number(options?.max_loss ?? 5);
    ```
  - Cálculo de queda admissível baseado exclusivamente em porcentagem: [`src/Helpers/Electrical/wireSize.ts:L120`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L120)
    ```ts
    120:    const voltage_drop_allowed = voltage_base * (max_percent / 100);
    ```
  - Verificação final iterativa no loop AC baseada exclusivamente em `max_percent`: [`src/Helpers/Electrical/wireSize.ts:L201`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L201)
    ```ts
    201:    if (percent_drop <= max_percent || wireIdx === all_wires.length - 1) {
    ```
  - Na função `wireSize`, entre as linhas 74 e 213, o identificador `voltage_drop` só é utilizado para o campo de saída em `data_return` (`data_return.voltage_drop = ...`) e nunca para ler a propriedade de entrada `options.voltage_drop`.

- **Fluxo Causal e Rastreamento Reverso de Dados:**
  - **Camada UI / Consumidor:** A interface ou script consumidor chama `wireSize(current, { voltage: 220, voltage_drop: 2, length: 50 })`.
  - **Camada Helper (`wireSize.ts`):**
    1. A função extrai os parâmetros nas linhas 83-96. Na linha 92, avalia apenas `const max_percent = Number(options?.max_loss ?? 5);`. Como `options.max_loss` não foi fornecido, assume `max_percent = 5`.
    2. Na linha 120, calcula `voltage_drop_allowed = 220 * (5 / 100) = 11V`, descartando o valor `2` que o usuário solicitou em `options.voltage_drop`.
    3. A seção inicial de cabo é estimada com base em $11\text{V}$, selecionando uma seção teórica de $4,09\text{ mm}^2$ (bitola comercial de $6\text{ mm}^2$).
    4. O loop de impedância AC (linhas 194-207) valida se `percent_drop <= max_percent` ($3,27\% \le 5\%$). A condição é satisfeita para $6\text{ mm}^2$, e a função retorna `wire: 6` com `voltage_drop: 7.19` e `loss_percent: 3.27`.
    5. A queda real resultante ($7,19\text{V}$) viola gravemente o requisito de $2\text{V}$ especificado pelo chamador.
  - **Rastreamento Reverso de Camadas:**
    - `UI / Consumidor` ⇄ `wireSize.ts` (função pura em memória) ⇄ Tabelas estáticas JSON da NBR 5410 em `src/json/`.
    - Trata-se de biblioteca client-side de utilitários isolados para Vue/TypeScript: inexistem camadas de Store reativa global (Pinia/Vuex), rotas HTTP de backend, Controllers/Services ou Banco de Dados (DB).

---

### Arquivos afetados

Apenas 2 arquivos de código-fonte/testes e os artefatos de documentação da issue em `docs/issues/26/`:

1. [`src/Helpers/Electrical/wireSize.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts):
   - Adição do processamento e normalização segura de `options.voltage_drop` (aceitando número ou string).
   - Mapeamento harmonioso entre `voltage_drop` (Volts) e `max_loss` (Percentual) após a determinação de `voltage_base`, garantindo que quando ambos forem passados, a restrição mais conservadora (menor queda de tensão permitida) prevaleça (`Math.min`).
   - Atualização do cálculo de `voltage_drop_allowed` e `max_percent`.
   - Ajuste na condição de parada da verificação por impedância AC para respeitar tanto `max_percent` quanto `voltage_drop_allowed`.
2. [`src/Helpers/Electrical/wireSize.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.test.ts):
   - Adição de casos de teste automatizados cobrindo:
     - Dimensionamento correto respeitando `voltage_drop` em Volts.
     - Aceitação de `voltage_drop` como string numérica (`'2'`).
     - Interação entre `voltage_drop` e `max_loss` (prevalência da restrição mais estrita).
     - Dimensionamento em circuito trifásico com `voltage_drop`.
3. [`docs/issues/26/plan.md`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/docs/issues/26/plan.md):
   - Documento do plano de implementação da issue.

---

### Execuções propostas

A correção deve ser cirúrgica e seguir estritamente o ciclo TDD (Red-Green-Refactor):

#### Passo 1: Especificação dos Testes Unitários (Fase Red)
No arquivo [`src/Helpers/Electrical/wireSize.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.test.ts), adicionar 4 novos casos de teste ao final do bloco `describe('wireSize', ...)`:
1. `respeita voltage_drop em Volts quando especificado`:
   Comprovar que `wireSize(20, { voltage: 220, voltage_drop: 2, length: 50 })` retorna `result.voltage_drop <= 2` e `result.wire === 25` (em vez de `wire === 6` com `voltage_drop === 7.19`).
2. `aceita voltage_drop como string numérica`:
   Comprovar que `voltage_drop: '2'` é tratado identicamente a `voltage_drop: 2`.
3. `aplica o limite mais restritivo entre voltage_drop e max_loss quando ambos são fornecidos`:
   - Cenário A: `{ voltage: 220, length: 50, voltage_drop: 2, max_loss: 5 }` -> limite de 2V prevalece sobre 5% (11V), resultando em 25mm².
   - Cenário B: `{ voltage: 220, length: 50, voltage_drop: 10, max_loss: 1 }` -> limite de 1% (2.2V) prevalece sobre 10V, dimensionando para $\le 2.2\text{V}$.
4. `respeita voltage_drop em circuito trifásico`:
   Comprovar que em circuito trifásico (`phases: 3, voltage: 380, voltage_type: 'ff', length: 60, voltage_drop: 5`), o dimensionamento atende `result.voltage_drop <= 5`.

Executar vitest para registrar a falha (*Red*):
```bash
./node_modules/.bin/vitest run src/Helpers/Electrical/wireSize.test.ts
```
O teste `respeita voltage_drop em Volts quando especificado` deve falhar com:
`AssertionError: expected 7.19 to be less than or equal to 2`.

#### Passo 2: Correção Cirúrgica em `wireSize.ts` (Fase Green)
No arquivo [`src/Helpers/Electrical/wireSize.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts):
1. Mover a definição de `max_percent` e `voltage_drop_allowed` para logo após o cálculo de `voltage_base` (linhas 116-118), pois a conversão mútua entre Volts absolutos e percentual depende da tensão base efetiva do circuito:
   ```ts
   // Trata tensão fase-fase vs fase-neutro em trifásico
   const voltage_base = phases === 3
       ? (voltage_type === 'ff' || rawVoltage > 254 ? rawVoltage : toPhasePhase(rawVoltage))
       : rawVoltage;

   const hasVoltageDrop = options?.voltage_drop !== undefined && !isBlank(options?.voltage_drop) && Number(options?.voltage_drop) > 0;
   const hasMaxLoss = options?.max_loss !== undefined && !isBlank(options?.max_loss) && Number(options?.max_loss) > 0;

   let voltage_drop_allowed: number;
   let max_percent: number;

   if (hasVoltageDrop && hasMaxLoss) {
       const dropFromVolt = Number(options.voltage_drop);
       const dropFromLoss = voltage_base * (Number(options.max_loss) / 100);
       voltage_drop_allowed = Math.min(dropFromVolt, dropFromLoss);
       max_percent = (voltage_drop_allowed / voltage_base) * 100;
   } else if (hasVoltageDrop) {
       voltage_drop_allowed = Number(options.voltage_drop);
       max_percent = (voltage_drop_allowed / voltage_base) * 100;
   } else if (hasMaxLoss) {
       max_percent = Number(options.max_loss);
       voltage_drop_allowed = voltage_base * (max_percent / 100);
   } else {
       max_percent = 5;
       voltage_drop_allowed = voltage_base * (max_percent / 100);
   }
   ```
2. Na verificação por impedância AC (linhas 194-207), validar a condição de término:
   ```ts
   if (percent_drop <= max_percent || voltage_drop <= voltage_drop_allowed || wireIdx === all_wires.length - 1) {
       data_return.wire = candidateWire;
       if (percent_drop > max_percent && voltage_drop > voltage_drop_allowed && wireIdx === all_wires.length - 1) data_return.exceeded = true;
       break;
   }
   ```

#### Passo 3: Validação do Teste Unitário (Fase Green)
Executar os testes de `wireSize.test.ts`:
```bash
./node_modules/.bin/vitest run src/Helpers/Electrical/wireSize.test.ts
```
Comprovar que todos os 36 testes (32 existentes + 4 novos) passam com 100% de sucesso.

#### Passo 4: Verificação de Tipagem Estática e Linting
Executar:
```bash
npm run type-check
npm run lint
```
Garantir zero erros de compilação com `vue-tsc` e conformidade com as regras de ESLint.

#### Passo 5: Suíte Completa de Não-Regressão
Executar:
```bash
./node_modules/.bin/vitest run
```
Comprovar que todas as 404 suítes de testes e mais de 3550 testes do projeto continuam passando sem nenhuma quebra.

#### Passo 6: Auditoria de Higiene e Escopo Pré-Commit
Garantir com `git status` e `git diff dev --name-status` que apenas os 2 arquivos de código/teste e a documentação em `docs/issues/26/` foram alterados. NENHUM arquivo espúrio ou symlink em `node_modules` ou `.claude`/`.opencode` deve ser versionado.

---

### Especificação de Teste TDD (Red-Green)

#### Casos de Teste Unitário Red-Green
Arquivo: [`src/Helpers/Electrical/wireSize.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.test.ts)

```ts
    it('respeita voltage_drop em Volts quando especificado', async () => {
        const result = await wireSize(20, {
            voltage: 220,
            voltage_drop: 2,
            length: 50
        });
        expect(result).not.toBeNull();
        expect(result!.voltage_drop).toBeLessThanOrEqual(2);
        expect(result!.wire).toBe(25);
    });

    it('aceita voltage_drop como string numérica', async () => {
        const result = await wireSize(20, {
            voltage: 220,
            voltage_drop: '2',
            length: 50
        });
        expect(result).not.toBeNull();
        expect(result!.voltage_drop).toBeLessThanOrEqual(2);
        expect(result!.wire).toBe(25);
    });

    it('aplica o limite mais restritivo entre voltage_drop e max_loss quando ambos são fornecidos', async () => {
        const resA = await wireSize(20, {
            voltage: 220,
            length: 50,
            voltage_drop: 2,
            max_loss: 5
        });
        expect(resA!.voltage_drop).toBeLessThanOrEqual(2);
        expect(resA!.wire).toBe(25);

        const resB = await wireSize(20, {
            voltage: 220,
            length: 50,
            voltage_drop: 10,
            max_loss: 1
        });
        expect(resB!.voltage_drop).toBeLessThanOrEqual(2.2);
        expect(resB!.loss_percent).toBeLessThanOrEqual(1);
    });

    it('respeita voltage_drop em circuito trifásico', async () => {
        const result = await wireSize(30, {
            voltage: 380,
            voltage_type: 'ff',
            phases: 3,
            length: 60,
            voltage_drop: 5
        });
        expect(result).not.toBeNull();
        expect(result!.voltage_drop).toBeLessThanOrEqual(5);
    });
```

#### Comportamento Red (antes da correção):
```text
FAIL src/Helpers/Electrical/wireSize.test.ts > wireSize > respeita voltage_drop em Volts quando especificado
AssertionError: expected 7.19 to be less than or equal to 2
- Expected: <= 2
+ Received: 7.19
```

#### Comportamento Green (após a correção cirúrgica):
```text
✓ src/Helpers/Electrical/wireSize.test.ts (36 tests)
  ✓ wireSize (35)
    ...
    ✓ respeita voltage_drop em Volts quando especificado
    ✓ aceita voltage_drop como string numérica
    ✓ aplica o limite mais restritivo entre voltage_drop e max_loss quando ambos são fornecidos
    ✓ respeita voltage_drop em circuito trifásico
  ✓ calculaCabo (alias) (1)
```

---

### Banco de dados

**Nenhuma migration necessária.**
O repositório `@maxvue/max-use` é uma biblioteca front-end client-side pura em TypeScript de utilitários e composables Vue, sem camada de persistência de dados, ORMs ou tabelas de banco de dados.

---

### Riscos de quebra e Não-Regressão

1. **Retrocompatibilidade Total de Assinatura:**
   - A propriedade `voltage_drop?: number | string` já faz parte do tipo público exportado `WireOptions` ([`src/Helpers/Electrical/wireSize.ts:L39`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-26/src/Helpers/Electrical/wireSize.ts#L39)). Nenhuma interface pública, assinatura de função ou alias (`calculaCabo`) sofre alteração estrutural.
2. **Preservação de Comportamento Existente:**
   - Para chamadas onde `options.voltage_drop` não é informado (100% dos testes e códigos consumidores existentes), o comportamento padrão `max_loss ?? 5` é rigorosamente preservado.
   - Os 32 testes existentes em `wireSize.test.ts` e todas as 404 suítes de testes globais continuam passando sem nenhuma quebra ou regressão.
3. **Casos Limite e Entradas Nulas/Inválidas:**
   - Caso `voltage_drop` seja fornecido como string inválida, valor negativo, zero ou em branco, as guardas com `!isBlank(...) && Number(...) > 0` garantem descarte seguro e fallback suave para `max_loss`.
4. **Priorização Segura entre Restrições Múltiplas:**
   - A aplicação de `Math.min(dropFromVolt, dropFromLoss)` garante que o sistema nunca relaxe uma restrição imposta pelo projetista, respeitando simultaneamente o teto de tensão absoluta e o percentual estipulado.
5. **Critério da Ampacidade vs Queda de Tensão:**
   - A garantia de que a bitola final escolhida atenda tanto à capacidade de condução de corrente (tabelas NBR 5410 com FCA e FCT) quanto ao critério de queda de tensão permanece plenamente ativa.

---

### Validação

Comandos automatizados para validação conclusiva e sem ressalvas da implementação:

1. **Teste unitário específico do helper:**
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Electrical/wireSize.test.ts
   ```
   *Critério de aceitação:* 36 testes executados com 100% de sucesso.

2. **Verificação de tipagem estática:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* `vue-tsc --noEmit` executa com código 0 e nenhum erro reportado.

3. **Verificação de padronização e estilo (linting):**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* `eslint . --fix` executa com código 0 e sem advertências ou erros.

4. **Suíte completa de testes do repositório:**
   ```bash
   ./node_modules/.bin/vitest run
   ```
   *Critério de aceitação:* 100% dos testes aprovados (404 arquivos e mais de 3550 testes) sem nenhuma regressão.

5. **Auditoria estrita de escopo (Portão de Qualidade 4):**
   ```bash
   git diff dev --name-status
   ```
   *Critério de aceitação:* Apenas `src/Helpers/Electrical/wireSize.ts`, `src/Helpers/Electrical/wireSize.test.ts` e arquivos em `docs/issues/26/` aparecem na listagem. Nenhum symlink ou arquivo espúrio presente.

---

### Skills Aplicáveis

- `systematic-debugging-best-practices`: Investigação causal e isolamento de propriedades documentadas ignoradas em tempo de execução.
- `planning-with-files`: Estruturação persistida do plano de execução em arquivos de documentação para guiar as etapas subsequentes com precisão cirúrgica.
- `tdd`: Metodologia Red-Green-Refactor, garantindo a reprodução da falha antes da correção e a validação conclusiva do comportamento correto após a intervenção.
- `superpowers`: Fluxo rigoroso de engenharia agentic com critérios de aceitação estritos e portões de qualidade.
- `code-review`: Auditoria de diff, garantia de escopo limpo e conformidade matemática/física com as normas técnicas.
- `production-code-audit`: Validação de contratos públicos, consistência JSDoc vs runtime e higiene de dependências.
