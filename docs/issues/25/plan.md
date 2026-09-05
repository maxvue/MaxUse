# Plano de Implementação - Issue #25
## [Audit] parseBrNumber converte incorretamente numeros internacionais como '1,234.56' para 1.23456 e nao possui testes

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante auditoria automatizada do ecossistema de utilitários `@maxvue/max-use` (lente 9 — Testes e Confiabilidade), foi identificada uma falha crítica de conversão numérica e ausência total de testes unitários no utilitário público exportado [`src/Helpers/Strings/converters.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.ts).

A função pública `parseBrNumber` documenta formalmente suporte à conversão de números e strings numéricas em formato brasileiro e internacional:
> *"Converte uma entrada numérica ou string contendo valores pt-BR ou internacionais em um `number` válido. Trata o formato de milhar pt-BR (ex: '1.234' -> 1234, '1.234,56' -> 1234.56, 'R$ 1.234,56' -> 1234.56)."*

Contudo, a implementação atual assume erroneamente que qualquer string que contenha uma vírgula (`str.includes(',')`) pertence exclusivamente ao padrão brasileiro. Diante dessa premissa incorreta, executa de forma cega:
```typescript
const normalized = str.replace(/\./g, '').replace(',', '.');
str = normalized;
```

Quando uma entrada no padrão internacional com separador de milhar e decimal (ex.: `'1,234.56'`) é submetida:
1. Todos os pontos são removidos incondicionalmente: `'1,234.56'` vira `'1,23456'`;
2. A vírgula é substituída por ponto: `'1,23456'` vira `'1.23456'`;
3. `Number('1.23456')` resulta em `1.23456`.
O valor numérico real (`1234.56`) é distorcido por um fator de divisão de 1.000 (mil vezes menor).

**Agravantes do Problema:**
1. **Quebra Total em Números com Múltiplos Milhares Internacionais:** O método `.replace(',', '.')` substitui apenas a primeira ocorrência da vírgula. Quando o valor possui dois ou mais agrupadores de milhar (ex.: `'1,234,567.89'`), a primeira vírgula torna-se ponto, mas as subsequentes permanecem intactas (`'1.234,56789'`). O parsing subsequente por `Number(...)` falha silenciosamente retornando `NaN`.
2. **Zero Testes Unitários:** Embora a função correlata `toNumber` possua cobertura ampla de testes para formatos pt-BR e internacionais em [`src/Helpers/Strings/converters.test.ts:L65-L86`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.test.ts#L65-L86) (regressão do achado 015), `parseBrNumber` possui **zero testes unitários** no arquivo de testes, permitindo que a regressão subsistisse em produção sem ser detectada.
3. **Propagação em Cascata para Helpers Dependentes:** `parseBrNumber` é o motor de parsing de entrada para múltiplos formatadores centrais da biblioteca:
   - [`src/Helpers/Format/currency.ts:L47`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Format/currency.ts#L47): `formatCurrency('1,234.56')` chama `parseBrNumber('1,234.56')`, obtém `1.23456` e formata incorretamente como `'R$ 1,23'` (em vez de `'R$ 1.234,56'`).
   - [`src/Helpers/Format/bytes.ts:L15`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Format/bytes.ts#L15): `formatBytes('1,234.56 MB')` obtém `rawBytes = 1.23456`, subdimensionando severamente o cálculo volumétrico.
4. **Incoerência Interna com Funções no Mesmo Arquivo:** No mesmo arquivo [`src/Helpers/Strings/converters.ts:L28-L38`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.ts#L28-L38), a função interna `normalizeNumericString` já implementa o critério posicional de desambiguação (`last_comma > last_dot`), o qual foi omitido em `parseBrNumber`.

#### Causa Raiz Comprovada
- **Localização Exata no Código-Fonte:**
  [`src/Helpers/Strings/converters.ts:L85-L94`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.ts#L85-L94):
  ```typescript
  85:     if (str.includes(',')) {
  86:         const normalized = str.replace(/\./g, '').replace(',', '.');
  87:         str = normalized;
  88:     } else if (str.includes('.')) {
  89:         const isMilhar = /^[+-]?\d{1,3}(\.\d{3})+$/.test(str);
  90:         if (isMilhar) {
  91:             const normalized = str.replace(/\./g, '');
  92:             str = normalized;
  93:         }
  94:     }
  ```
- **Fluxo Causal e Rastreamento Reverso de Dados:**
  - **Camada UI / Consumidor da Biblioteca:** O componente Vue ou consumidor da aplicação invoca `parseBrNumber('1,234.56')` (ou indiretamente via `formatCurrency('1,234.56')` / `formatBytes('1,234.56 MB')`).
  - **Camada Helper (`parseBrNumber`):**
    1. Validação inicial e normalização de NBSP (`\u00a0`, `\u202f`), remoção de prefixo `R$` e sufixos de bytes (`MB`, `KB`, etc.).
    2. A variável `str` contém `'1,234.56'`.
    3. Linha 85: `if (str.includes(','))` avalia como `true`.
    4. Linha 86: `.replace(/\./g, '')` elimina o ponto decimal legítimo, gerando `'1,23456'`. Em seguida `.replace(',', '.')` substitui a vírgula de milhar por ponto, gerando `'1.23456'`.
    5. Linha 104-105: `Number('1.23456')` retorna `1.23456` para o chamador, reduzindo o valor por 1000x.
  - **Rastreamento Reverso de Camadas:**
    - `UI / Consumidor` ⇄ `formatCurrency / formatBytes` ⇄ `parseBrNumber` (`converters.ts`).
    - Por ser uma biblioteca front-end pura de utilitários isolados para Vue 3, não há acoplamento com Stores reativas globais (Pinia/Vuex), rotas de API backend, Controllers/Services de servidor ou Banco de Dados (DB).

---

### Arquivos afetados

1. [`src/Helpers/Strings/converters.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.ts):
   - Refatoração da verificação de separadores em `parseBrNumber` (L85-L94) para analisar a presença conjunta de vírgula e ponto comparando as posições relativas (`lastIndexOf(',')` vs `lastIndexOf('.')`).
2. [`src/Helpers/Strings/converters.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.test.ts):
   - Criação de uma suíte completa de testes unitários para `parseBrNumber`, cobrindo cenários pt-BR, internacional, milhar sem decimal, moeda, bytes, notação científica e valores inválidos/bordas.
3. [`src/Helpers/Format/currency.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Format/currency.test.ts):
   - Adição de caso de teste de não-regressão garantindo que `formatCurrency('1,234.56')` formata corretamente para `'R$ 1.234,56'`.
4. [`src/Helpers/Format/bytes.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Format/bytes.test.ts):
   - Adição de caso de teste de não-regressão garantindo que `formatBytes('1,234.56 KB')` processe o valor numérico correto.
5. `docs/issues/25/plan.md`:
   - Armazenamento do presente plano técnico.

> [!IMPORTANT]
> **Higiene de Versionamento e Prevenção de Reprovação (Portões de Qualidade 2 e 4):**
> Nunca incluir no stage ou no commit arquivos ou symlinks fora de escopo, tais como `node_modules`, `.claude/skills`, `.opencode/skills` ou arquivos temporários de IDE. Usar apenas `git add` direcionado explicitamente aos arquivos de produção e teste modificados.

---

### Execuções propostas

A implementação deve seguir rigorosamente a metodologia TDD (Test-Driven Development) nas fases Red-Green-Refactor:

#### Passo 1: Criação dos Testes Automatizados Unitários (Fase Red)
1. No arquivo [`src/Helpers/Strings/converters.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.test.ts):
   - Importar `parseBrNumber` a partir de `./converters`.
   - Adicionar o bloco `describe('parseBrNumber', ...)` com os seguintes cenários:
     - **Formato Internacional com Milhar e Decimal (Cenário do Bug):**
       - `expect(parseBrNumber('1,234.56')).toBe(1234.56);`
       - `expect(parseBrNumber('1,234,567.89')).toBe(1234567.89);`
       - `expect(parseBrNumber('-1,234.56')).toBe(-1234.56);`
       - `expect(parseBrNumber('R$ 1,234.56')).toBe(1234.56);`
       - `expect(parseBrNumber('1,234.56 MB')).toBe(1234.56);`
     - **Formato Brasileiro (pt-BR):**
       - `expect(parseBrNumber('1.234,56')).toBe(1234.56);`
       - `expect(parseBrNumber('1.234.567,89')).toBe(1234567.89);`
       - `expect(parseBrNumber('1234,56')).toBe(1234.56);`
       - `expect(parseBrNumber('1,5')).toBe(1.5);`
       - `expect(parseBrNumber('0,25')).toBe(0.25);`
       - `expect(parseBrNumber(',5')).toBe(0.5);`
       - `expect(parseBrNumber('-1.234,56')).toBe(-1234.56);`
       - `expect(parseBrNumber('R$ 1.234,56')).toBe(1234.56);`
       - `expect(parseBrNumber('1.234,56 KB')).toBe(1234.56);`
     - **Milhar Brasileiro sem Decimal:**
       - `expect(parseBrNumber('1.234')).toBe(1234);`
       - `expect(parseBrNumber('1.234.567')).toBe(1234567);`
     - **Padrão Decimal Simples (ponto):**
       - `expect(parseBrNumber('1234.56')).toBe(1234.56);`
       - `expect(parseBrNumber('3.14')).toBe(3.14);`
       - `expect(parseBrNumber('.5')).toBe(0.5);`
     - **Tipos Primitivos, Notação Científica e Bordas:**
       - `expect(parseBrNumber(1234.56)).toBe(1234.56);`
       - `expect(parseBrNumber(0)).toBe(0);`
       - `expect(parseBrNumber('2e3')).toBe(2000);`
       - `expect(parseBrNumber('-1.5e-2')).toBe(-0.015);`
       - `expect(parseBrNumber(null)).toBeNaN();`
       - `expect(parseBrNumber(undefined)).toBeNaN();`
       - `expect(parseBrNumber('')).toBeNaN();`
       - `expect(parseBrNumber('   ')).toBeNaN();`
       - `expect(parseBrNumber(Infinity)).toBeNaN();`
       - `expect(parseBrNumber(-Infinity)).toBeNaN();`
       - `expect(parseBrNumber('abc')).toBeNaN();`
       - `expect(parseBrNumber('12a34')).toBeNaN();`
2. Executar o teste unitário via Vitest:
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Strings/converters.test.ts
   ```
   - **Comprovar a falha (*Red*):** os testes com `'1,234.56'` e `'1,234,567.89'` devem falhar comprovando a existência do bug relatado.

#### Passo 2: Correção Cirúrgica no Código de Produção (Fase Green)
1. No arquivo [`src/Helpers/Strings/converters.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Strings/converters.ts):
   - Substituir as linhas 85 a 94 por uma lógica de desambiguação posicional dos separadores:
   ```typescript
   const hasComma = str.includes(',');
   const hasDot = str.includes('.');

   if (hasComma && hasDot) {
       if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
           // pt-BR: vírgula é decimal após ponto de milhar (ex: "1.234,56" -> "1234.56")
           str = str.replace(/\./g, '').replace(',', '.');
       } else {
           // Internacional: ponto é decimal após vírgula de milhar (ex: "1,234.56" ou "1,234,567.89" -> "1234.56")
           str = str.replace(/,/g, '');
       }
   } else if (hasComma) {
       // Apenas vírgula: padrão pt-BR decimal (ex: "1234,56" -> "1234.56", "1,5" -> "1.5")
       str = str.replace(',', '.');
   } else if (hasDot) {
       // Apenas ponto: verifica se é milhar pt-BR sem casas decimais (ex: "1.234" -> "1234")
       const isMilhar = /^[+-]?\d{1,3}(\.\d{3})+$/.test(str);
       if (isMilhar) {
           str = str.replace(/\./g, '');
       }
   }
   ```

#### Passo 3: Validação do Teste Unitário (Fase Green)
1. Executar novamente o teste de `converters.test.ts`:
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Strings/converters.test.ts
   ```
2. Confirmar que todos os testes passam com 100% de sucesso (*Green*).

#### Passo 4: Adição de Testes Integrados nos Formatadores Dependentes
1. Em [`src/Helpers/Format/currency.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Format/currency.test.ts), adicionar teste para entrada em formato internacional com vírgula de milhar:
   ```typescript
   it('formata strings numéricas no padrão internacional com vírgula de milhar', () => {
       expect(formatCurrency('1,234.56')).toBe('R$ 1.234,56');
       expect(formatCurrency('1,234,567.89')).toBe('R$ 1.234.567,89');
   });
   ```
2. Em [`src/Helpers/Format/bytes.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-25/src/Helpers/Format/bytes.test.ts), adicionar teste:
   ```typescript
   it('interpreta strings no padrão internacional com vírgula de milhar', () => {
       expect(formatBytes('1,234.56 KB')).toBe('1.21 KB');
   });
   ```
3. Executar os testes de formato:
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Format/currency.test.ts src/Helpers/Format/bytes.test.ts
   ```

#### Passo 5: Verificação de Tipagem Estática e Linting
1. Executar checagem estática de tipos com `vue-tsc`:
   ```bash
   npm run type-check
   ```
   - Código de saída 0, sem nenhum erro de tipagem.
2. Executar validação de conformidade com ESLint:
   ```bash
   npm run lint
   ```
   - Código de saída 0, sem violações.

#### Passo 6: Verificação Completa de Não-Regressão
1. Executar a suíte completa de testes de todo o repositório:
   ```bash
   ./node_modules/.bin/vitest run
   ```
   - Todos os arquivos de testes devem passar sem nenhuma quebra de compatibilidade.

#### Passo 7: Auditoria de Escopo Pré-Commit
1. Conferir que apenas os arquivos planejados estão alterados e nenhum symlink indesejado foi incluído no stage:
   ```bash
   git status --porcelain
   ```

---

### Especificação de Teste TDD (Red-Green)

#### Bloco de Teste a ser Adicionado em `src/Helpers/Strings/converters.test.ts`
```typescript
import { toSearchableString, toNumber, parseBrNumber } from './converters';

describe('parseBrNumber', () => {
    it('converte corretamente números no padrão internacional com separador de milhar e decimal', () => {
        expect(parseBrNumber('1,234.56')).toBe(1234.56);
        expect(parseBrNumber('1,234,567.89')).toBe(1234567.89);
        expect(parseBrNumber('-1,234.56')).toBe(-1234.56);
    });

    it('converte valores com prefixo monetário R$ e separador internacional', () => {
        expect(parseBrNumber('R$ 1,234.56')).toBe(1234.56);
    });

    it('converte valores com sufixos de bytes e separador internacional', () => {
        expect(parseBrNumber('1,234.56 MB')).toBe(1234.56);
    });

    it('mantém conversão correta para o padrão pt-BR com vírgula decimal', () => {
        expect(parseBrNumber('1.234,56')).toBe(1234.56);
        expect(parseBrNumber('1.234.567,89')).toBe(1234567.89);
        expect(parseBrNumber('1234,56')).toBe(1234.56);
        expect(parseBrNumber('1,5')).toBe(1.5);
        expect(parseBrNumber('0,25')).toBe(0.25);
        expect(parseBrNumber(',5')).toBe(0.5);
        expect(parseBrNumber('-1.234,56')).toBe(-1234.56);
        expect(parseBrNumber('R$ 1.234,56')).toBe(1234.56);
        expect(parseBrNumber('1.234,56 KB')).toBe(1234.56);
    });

    it('trata milhar pt-BR sem casas decimais', () => {
        expect(parseBrNumber('1.234')).toBe(1234);
        expect(parseBrNumber('1.234.567')).toBe(1234567);
        expect(parseBrNumber('-1.234')).toBe(-1234);
    });

    it('converte padrão decimal comum com ponto', () => {
        expect(parseBrNumber('1234.56')).toBe(1234.56);
        expect(parseBrNumber('3.14')).toBe(3.14);
        expect(parseBrNumber('.5')).toBe(0.5);
    });

    it('aceita números primitivos diretamente', () => {
        expect(parseBrNumber(1234.56)).toBe(1234.56);
        expect(parseBrNumber(0)).toBe(0);
        expect(parseBrNumber(-42)).toBe(-42);
    });

    it('converte notação científica', () => {
        expect(parseBrNumber('2e3')).toBe(2000);
        expect(parseBrNumber('-1.5e-2')).toBe(-0.015);
    });

    it('retorna NaN para entradas inválidas, vazias ou não-finitas', () => {
        expect(parseBrNumber(null)).toBeNaN();
        expect(parseBrNumber(undefined)).toBeNaN();
        expect(parseBrNumber('')).toBeNaN();
        expect(parseBrNumber('   ')).toBeNaN();
        expect(parseBrNumber(Infinity)).toBeNaN();
        expect(parseBrNumber(-Infinity)).toBeNaN();
        expect(parseBrNumber('abc')).toBeNaN();
        expect(parseBrNumber('12a34')).toBeNaN();
    });
});
```

#### Comportamento Red (antes da correção cirúrgica em `converters.ts`):
```text
FAIL  src/Helpers/Strings/converters.test.ts > parseBrNumber > converte corretamente números no padrão internacional com separador de milhar e decimal
AssertionError: expected 1.23456 to be 1234.56 // Object.is equality

- Expected: 1234.56
+ Received: 1.23456
```

#### Comportamento Green (após a correção cirúrgica em `converters.ts`):
```text
✓ src/Helpers/Strings/converters.test.ts (27 tests)
  ✓ toSearchableString (6)
  ✓ toNumber (8)
  ✓ toNumber — regressão auditoria (achado 015) (4)
  ✓ parseBrNumber (9)
    ✓ converte corretamente números no padrão internacional com separador de milhar e decimal
    ✓ converte valores com prefixo monetário R$ e separador internacional
    ✓ converte valores com sufixos de bytes e separador internacional
    ✓ mantém conversão correta para o padrão pt-BR com vírgula decimal
    ✓ trata milhar pt-BR sem casas decimais
    ✓ converte padrão decimal comum com ponto
    ✓ aceita números primitivos diretamente
    ✓ converte notação científica
    ✓ retorna NaN para entradas inválidas, vazias ou não-finitas
```

---

### Banco de dados

**Nenhuma migration necessária.**
O `@maxvue/max-use` é uma biblioteca client-side de utilitários TypeScript e composables Vue 3 distribuída via npm, sem qualquer camada de persistência de banco de dados relacional ou NoSQL.

---

### Riscos de quebra e Não-Regressão

1. **Risco de Quebra em Consumidores Existentes:**
   - *Risco:* Inexistente para o comportamento pretendido. Se algum consumidor contornava a falha aplicando um `.replace(/,/g, '')` antes de chamar `parseBrNumber` ou `formatCurrency`, esse contorno continuará funcionando transparentemente.
2. **Não-Regressão do Padrão pt-BR (Moeda e Milhar):**
   - *Risco:* A alteração de separadores poderia afetar strings comumente usadas no Brasil (`1.234,56`, `1.234`, `R$ 1.234,56`).
   - *Mitigação:* A lógica posicional `lastIndexOf(',') > lastIndexOf('.')` garante estritamente a preservação do comportamento pt-BR, e todos os testes legados de `currency.test.ts` e `bytes.test.ts` permanecerão verdes.
3. **Contrato de Tipagem TypeScript:**
   - A assinatura `export function parseBrNumber(value: unknown): number` permanece 100% idêntica, preservando integridade contratual do TypeScript.
4. **Higiene de Versionamento (Portões de Qualidade 2 e 4):**
   - *Risco:* Poluição acidental do commit com symlinks (`node_modules`, `.claude/skills`, `.opencode/skills`).
   - *Mitigação:* O comando `git add` deve ser executado de forma estritamente cirúrgica, proibindo `git add .` ou `git add -A`.

---

### Validação

Comandos automatizados para validação conclusiva da implementação:

1. **Teste unitário focado:**
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Strings/converters.test.ts
   ```
   *Critério de aceitação:* 27 testes aprovados com 100% de sucesso.

2. **Testes de formatadores dependentes:**
   ```bash
   ./node_modules/.bin/vitest run src/Helpers/Format/currency.test.ts src/Helpers/Format/bytes.test.ts
   ```
   *Critério de aceitação:* 100% dos testes aprovados, incluindo os novos cenários de formato internacional.

3. **Verificação de tipagem estática:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* `vue-tsc --noEmit` finalizado com código 0 e zero erros.

4. **Verificação de linter e estilo:**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* `eslint . --fix` finalizado com código 0.

5. **Suíte completa de testes:**
   ```bash
   ./node_modules/.bin/vitest run
   ```
   *Critério de aceitação:* Suíte completa de testes do projeto executada e aprovada sem qualquer regressão.

6. **Auditoria de escopo:**
   ```bash
   git status --porcelain
   ```
   *Critério de aceitação:* Somente arquivos previstos modificados, sem symlinks ou arquivos espúrios rastreados.

---

### Skills Aplicáveis

- `systematic-debugging-best-practices`: Rastreamento causal completo da falha de parsing numérico e separadores.
- `planning-with-files`: Estruturação documental rigorosa do plano de execução em `docs/issues/25/plan.md`.
- `tdd`: Ciclo Red-Green-Refactor estrito com comprovação prévia da falha e validação posterior da correção.
- `superpowers`: Disciplina de engenharia em branches isoladas, validações preventivas e controle de portões de qualidade.
- `code-review`: Auditoria de diff, aderência aos padrões de exportação de helpers do repositório e verificação de contratos públicos.
- `production-code-audit`: Preservação de interfaces públicas, consistência arquitetural com `normalizeNumericString` e higiene de versionamento.
