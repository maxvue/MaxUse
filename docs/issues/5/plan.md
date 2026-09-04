# Plano de Execução — Issue #5: [Audit] sum/sumBy engolem NaN e nao-numericos como 0, divergindo do Lodash

### Descrição e Causa Raiz ###
#### 1. Contexto e Problema Relatado
A auditoria automatizada (Lente 10 — divergência de contrato na reimplementação do Lodash) identificou que os helpers `sum` e `sumBy` divergem substancialmente do contrato do Lodash (`_.sum` e `_.sumBy`):
- `sum` utiliza `parseFloat(val)` e substitui `NaN` por `0` (`acc + (isNaN(num) ? 0 : num)`).
- `sumBy` realiza coerção via `Number(item[key]) || 0`.
- Em contrapartida, a implementação de referência do Lodash utiliza adição estrita com o operador `+`, sem coerção prévia e sem supressão de `NaN`.

#### 2. Agravantes e Casos de Falha Empírica
O comportamento atual amortece e mascara valores corrompidos ou inconsistentes na coleção:
- `sum([6, 4, NaN])`: Na MaxUse resulta em `10` (o `NaN` é absorvido como `0`); no Lodash real resulta em `NaN`.
- `sum(['1', '2'])`: Na MaxUse resulta em `3` (coerção numérica); no Lodash real resulta em `'12'` (concatenação de strings).
- `sumBy([{ a: 'x' }, { a: 2 }], 'a')`: Na MaxUse resulta em `2` (a string `'x'` vira `0`); no Lodash real resulta em `'x2'`.

Na versão 2.0.0 da biblioteca `@maxvue/max-use`, a dependência de `lodash-es` foi removida em favor de utilitários nativos e reativos integrados ao Vue 3. No entanto, o JSDoc de `sum` em `src/Helpers/Iterables/sum.ts:L5` declara:
`* Semelhante ao _.sum do Lodash.`
Além disso, o `README.md` promovia o objeto global `_` como agrupador das funções de estilo Lodash sem especificar as divergências deliberadamente adotadas.

#### 3. Decisão Arquitetural (Triagem da Divergência)
A divergência de `sum` e `sumBy` em relação ao Lodash é **deliberada e intencional**:
- **Público-alvo e Caso de Uso:** A MaxUse é uma biblioteca utilitária voltada para ecossistemas frontend Vue, consumindo dados de formulários, inputs e APIs REST (ex.: Laravel, Adonis). Nesses cenários, é comum que números sejam entregues como strings numéricas (`"10.50"`), campos vazios (`""`) ou `null`. Permitir que um único valor inválido contamine um total monetário ou contábil com `NaN`, ou produza concatenações anômalas de strings (`"105"`), degradaria severamente as interfaces de usuário reativas.
- **Suporte a Reatividade e Objetos:** Os helpers da MaxUse aceitam `Ref`, `computed`, getters e estruturas do tipo `Record` (somando `Object.values`), capacidades inexistentes no Lodash.
- **Prevenção de Breaking Changes:** A suíte de testes existente já trava expressamente esse comportamento em `src/Helpers/Iterables/sum.test.ts:L18` (`expect(sum([1, 'abc', 3])).toBe(4)`) e `src/Helpers/Iterables/sumBy.test.ts:L20` (`expect(sumBy(items, 'v')).toBe(15)`). Alinhar cegamente ao Lodash quebraria testes unitários pré-existentes e causaria regressão crítica em projetos dependentes.

**Solução Arquitetural Requerida:** Formalizar a divergência deliberada. O bug reside na divergência contratual não documentada e no JSDoc impreciso. A correção consiste em documentar expressamente o contrato coercitivo no JSDoc de `sum.ts` e `sumBy.ts`, documentar as divergências deliberadas no `README.md` e travar o comportamento com testes de caracterização dedicados.

#### 4. Causa Raiz Comprovada
- **`src/Helpers/Iterables/sum.ts:L5`**: JSDoc declara indevidamente `* Semelhante ao _.sum do Lodash.`, omitindo a natureza coercitiva deliberada e a divergência contratual.
- **`src/Helpers/Iterables/sum.ts:L16-19`**: Redução com coerção via `parseFloat(val)` e `isNaN(num) ? 0 : num` que silencia `NaN` sem aviso ou documentação pública.
- **`src/Helpers/Iterables/sumBy.ts:L5-11`**: JSDoc omite a especificação da coerção forçada via `Number(item[key]) || 0`.
- **`src/Helpers/Iterables/sumBy.ts:L19`**: Implementação `Number(item[key]) || 0` que converte valores inválidos/strings não numéricas em `0`.
- **`README.md:L66-85`**: Ausência de documentação de breaking change / divergências conhecidas da v2.0.0 em relação ao `lodash-es`.

#### 5. Rastreamento Reverso de Dados
`UI (Templates / Composables Vue)` ⇄ `Store (Pinia / refs reativas / computed)` ⇄ `API / Rotas (useCachedApi / axios / DTOs de backend)` ⇄ `Helper de Iterables (sum / sumBy)`:
1. **Origem:** Requisição HTTP recebe payload JSON contendo coleções com campos numéricos inconsistentes (strings numéricas, null, undefined, strings não-numéricas).
2. **Transformação/Consumo:** O helper `sum` ou `sumBy` é chamado diretamente ou via namespace `_` em computeds da store ou views do Vue.
3. **Execução:** O acumulador itera com `parseFloat`/`Number`, convertendo itens inválidos em `0` e convertendo strings numéricas em floats/inteiros.
4. **Impacto:** A soma é concluída sem propagar `NaN`. Na ausência de documentação e caracterização formal, auditores e desenvolvedores reportam divergência inesperada com a especificação canônica do Lodash.

---

### Arquivos afetados
- `src/Helpers/Iterables/sum.ts` — Atualização do JSDoc para detalhar a soma coercitiva e avisar sobre a divergência deliberada com o `_.sum` do Lodash.
- `src/Helpers/Iterables/sumBy.ts` — Atualização do JSDoc para detalhar a soma coercitiva e avisar sobre a divergência deliberada com o `_.sumBy` do Lodash.
- `src/Helpers/Iterables/sum.test.ts` — Adição de suíte de testes de caracterização (`describe('divergências deliberadas em relação ao Lodash')`).
- `src/Helpers/Iterables/sumBy.test.ts` — Adição de suíte de testes de caracterização (`describe('divergências deliberadas em relação ao Lodash')`).
- `README.md` — Atualização da seção do objeto `_` e inclusão da subseção `#### Divergências conhecidas em relação ao Lodash`, além da atualização da tabela de referência de iteráveis.

---

### Execuções propostas
Uma correção cirúrgica focada na formalização contratual e caracterização de testes:

#### Passo 1: Atualização da documentação JSDoc em `src/Helpers/Iterables/sum.ts`
Substituir o cabeçalho JSDoc genérico pelas diretrizes contratuais precisas:
```ts
/**
 * Calcula a soma **coercitiva** dos valores em uma coleção.
 *
 * Cada item passa por `parseFloat`; o que não resultar em número
 * (`NaN`, `null`, `undefined`, strings não numéricas, objetos) conta como `0`.
 * Strings numéricas são convertidas (`'1'` vira `1`, não concatenação).
 * Aceita array, `Record` (soma `Object.values`) e ref/getter.
 *
 * > **Divergência deliberada em relação ao `_.sum` do Lodash.** O Lodash propaga
 * > `NaN` e concatena strings; aqui o fallback `0` é o contrato, pensado para
 * > dados vindos de API/formulário onde numéricos chegam como string ou nulos.
 * > Ex.: `sum([6, 4, NaN])` → `10` (Lodash: `NaN`); `sum(['1', '2'])` → `3`
 * > (Lodash: `'12'`). Para semântica idêntica ao Lodash, some manualmente.
 *
 * @param collection A coleção para iterar.
 * @returns Retorna a soma. Nunca retorna `NaN`.
 */
```

#### Passo 2: Atualização da documentação JSDoc em `src/Helpers/Iterables/sumBy.ts`
Substituir o cabeçalho JSDoc para esclarecer a coerção e paridade:
```ts
/**
 * Soma **coercitivamente** os valores de uma propriedade específica em uma
 * coleção de objetos.
 *
 * Cada valor passa por `Number(valor) || 0`: o que não for numérico
 * (`NaN`, `undefined`, strings não numéricas, objetos) conta como `0`.
 * `null` e `''` já convertem para `0` por `Number`, então o `||` só altera o
 * resultado nos casos `NaN` e `-0`. Aceita array, `Record` e ref/getter.
 *
 * > **Divergência deliberada em relação ao `_.sumBy` do Lodash**, que propaga
 * > `NaN` e concatena strings. Ex.: `sumBy([{ a: 'x' }, { a: 2 }], 'a')` → `2`
 * > (Lodash: `'x2'`). O fallback `0` é o contrato desta biblioteca, pensado
 * > para dados sujos vindos de API/formulário.
 *
 * @param collection A coleção de objetos.
 * @param key A chave que contém o valor numérico a ser somado.
 * @returns A soma total dos valores da chave especificada. Nunca retorna `NaN`.
 */
```

#### Passo 3: Atualização da Documentação Central em `README.md`
1. Atualizar a introdução de `### 2. O Objeto Centralizado (_)` para clarificar a reimplementação de estilo Lodash na v2.0.0:
```markdown
> A partir da **2.0.0** a MaxUse não depende mais do `lodash-es`: os utilitários de estilo Lodash (`debounce`, `groupBy`, `sum`, `get`/`set`, …) são **reimplementações próprias**. A API é inspirada no Lodash, mas não é garantida como equivalente 1:1 — veja as divergências abaixo.
```
2. Inserir a subseção `#### Divergências conhecidas em relação ao Lodash` com tabela explicativa:
```markdown
#### Divergências conhecidas em relação ao Lodash

Diferenças **deliberadas** de comportamento, travadas por testes de caracterização. Quem migra de `lodash-es` deve conferir estes casos:

| Helper | MaxUse | Lodash | Motivo |
|:---|:---|:---|:---|
| `sum` | `sum([6, 4, NaN])` → `10`<br/>`sum(['1', '2'])` → `3`<br/>`sum([1, 'abc', 2])` → `3` | `NaN`<br/>`'12'`<br/>`'1abc2'` | Soma **coercitiva**: cada item passa por `parseFloat` e o que não for numérico conta como `0`. Nunca retorna `NaN` (Lodash usa `+`, concatenando com string em vez de converter). |
| `sumBy` | `sumBy([{ a: 'x' }, { a: 2 }], 'a')` → `2`<br/>`sumBy([{ a: '10' }, { a: '5' }], 'a')` → `15` | `'x2'`<br/>`'105'` | Mesmo contrato: `Number(valor) \|\| 0`. Nunca retorna `NaN`. |

O fallback `0` é intencional: os helpers foram desenhados para dados vindos de API/formulário (Laravel, Adonis), onde valores numéricos chegam como string, `null` ou ausentes, e um único campo sujo não deve contaminar um total inteiro com `NaN`. Se precisar da semântica estrita do Lodash, faça a soma manualmente (`items.reduce((a, b) => a + b, 0)`).

Além disso, `sum` e `sumBy` aceitam `Ref`/getter e `Record` (somando `Object.values`), o que o Lodash não faz.
```
3. Ajustar a tabela de Iteráveis (`sum` e `sumBy`) com hiperlink para as divergências conhecidas.

#### Passo 4: Implementação de Testes de Caracterização em `src/Helpers/Iterables/sum.test.ts`
Adicionar bloco de testes cobrindo formalmente os cenários de divergência:
```ts
    // Testes de caracterização: a divergência em relação ao _.sum do Lodash é
    // DELIBERADA e faz parte do contrato público. Se algum destes falhar por uma
    // tentativa de "alinhar ao Lodash", a mudança é breaking change e precisa de
    // decisão consciente (ver README, "Divergências conhecidas em relação ao Lodash").
    describe('divergências deliberadas em relação ao Lodash', () => {
        it('NaN conta como 0 em vez de contaminar a soma', () => {
            expect(sum([6, 4, NaN])).toBe(10); // Lodash: NaN
        });

        it('strings numéricas são convertidas, não concatenadas', () => {
            expect(sum(['1', '2'])).toBe(3); // Lodash: '12'
        });

        it('strings não numéricas contam como 0', () => {
            expect(sum([1, 'abc', 2])).toBe(3); // Lodash: '1abc2' (concatena strings)
        });

        it('null e undefined na coleção contam como 0', () => {
            expect(sum([1, null, undefined, 2])).toBe(3); // Lodash também retorna 3
        });

        it('nunca retorna NaN', () => {
            expect(sum([NaN, 'abc', {}, undefined])).toBe(0);
        });
    });
```

#### Passo 5: Implementação de Testes de Caracterização em `src/Helpers/Iterables/sumBy.test.ts`
Adicionar bloco de testes cobrindo formalmente os cenários de divergência:
```ts
    // Testes de caracterização: a divergência em relação ao _.sumBy do Lodash é
    // DELIBERADA e faz parte do contrato público. Se algum destes falhar por uma
    // tentativa de "alinhar ao Lodash", a mudança é breaking change e precisa de
    // decisão consciente (ver README, "Divergências conhecidas em relação ao Lodash").
    describe('divergências deliberadas em relação ao Lodash', () => {
        it('strings não numéricas contam como 0, sem concatenar', () => {
            expect(sumBy([{ a: 'x' }, { a: 2 }], 'a')).toBe(2); // Lodash: 'x2'
        });

        it('NaN conta como 0 em vez de contaminar a soma', () => {
            expect(sumBy([{ a: NaN }, { a: 5 }], 'a')).toBe(5); // Lodash: NaN
        });

        it('null e chave ausente contam como 0', () => {
            expect(sumBy([{ a: null }, { a: 2 }, {}], 'a')).toBe(2);
        });

        it('strings numéricas são convertidas', () => {
            expect(sumBy([{ a: '10' }, { a: '5' }], 'a')).toBe(15); // Lodash: '105'
        });

        it('nunca retorna NaN', () => {
            expect(sumBy([{ a: 'abc' }, { a: undefined }], 'a')).toBe(0);
        });
    });
```

---

### Especificação de Teste TDD (Red-Green)
#### 1. Fase Red (Reprodução e Caracterização Faltante)
Antes da modificação, verificar a ausência da caracterização formal e a presença do texto enganoso:
1. `grep -n "Semelhante ao _.sum" src/Helpers/Iterables/sum.ts` → Retorna linha 5 (documentação enganosa presente).
2. `grep -n "Divergências conhecidas em relação ao Lodash" README.md` → Retorna código 1 (seção ausente no README).
3. `npx vitest run src/Helpers/Iterables/sum.test.ts src/Helpers/Iterables/sumBy.test.ts` → Executa apenas 10 testes (5 em cada arquivo), demonstrando ausência da suíte de caracterização contratual deliberada.

#### 2. Fase Green (Implementação e Validação do Contrato)
Após a aplicação das alterações:
1. Execução de `npx vitest run src/Helpers/Iterables/sum.test.ts src/Helpers/Iterables/sumBy.test.ts`:
   - Os 10 testes originais passam.
   - Os 10 novos testes de caracterização (5 em `sum.test.ts` e 5 em `sumBy.test.ts`) passam com sucesso, totalizando 20 testes verdes.
2. `! grep -n "Semelhante ao _.sum" src/Helpers/Iterables/sum.ts` → Confirma a remoção da alegação indevida.
3. `grep -n "Divergências conhecidas em relação ao Lodash" README.md` → Confirma a documentação contratual consolidada.

---

### Banco de dados
Nenhuma. O projeto é uma biblioteca utilitária para Vue 3 e TypeScript em ambiente client-side/frontend, sem persistência relacional ou migrations.

---

### Riscos de quebra e Não-Regressão
#### 1. Riscos Mapeados
- **Risco de Quebra de Contrato (Backward Compatibility):** Se `sum` ou `sumBy` fossem alterados para emular rigidamente o Lodash, haveria quebra massiva de contratos para aplicações existentes da MaxUse que dependem da coerção de strings numéricas e do tratamento gracioso de valores ausentes/inválidos como `0`. A formalização documental e os testes de caracterização eliminam 100% desse risco.
- **Risco de Regressão em Helpers Dependentes:** Noutros pontos da biblioteca onde `sum` possa ser utilizado (ex.: `wrap.test.ts`), o comportamento inalterado do código em runtime garante risco zero de regressão funcional.
- **Risco de Regressão em Tipagens TypeScript:** As assinaturas das funções permanecem rigorosamente inalteradas (`MaybeRefOrGetter<number[] | any>` e `MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>`).
- **Risco de Poluição de Escopo Git:** NUNCA incluir symlinks locais, `.claude/skills`, `.opencode/skills` ou `node_modules` no versionamento Git, limitando rigorosamente o escopo aos arquivos especificados no plano.

#### 2. Salvaguardas e Testes de Não-Regressão
- Suíte completa do Vitest: `npm test` garantindo que todos os testes e asserções continuam 100% verdes.
- Checagem de tipagem estática: `npm run type-check`.
- Checagem de formatação e lint: `npm run lint`.
- Build de distribuição: `npm run build`.

---

### Validação
O sucesso da implementação do plano é comprovado conclusivamente pelos seguintes comandos automatizados:

1. **Validação dos Testes de Caracterização e Regressão:**
   ```bash
   npx vitest run src/Helpers/Iterables/sum.test.ts src/Helpers/Iterables/sumBy.test.ts
   ```
   *Critério de aceitação:* Suíte executa 2 arquivos com 20 testes passando (10 testes em `sum.test.ts` e 10 testes em `sumBy.test.ts`), sem nenhum erro ou warning.

2. **Validação da Remoção da Asserção Enganosa em `sum.ts`:**
   ```bash
   ! grep -n "Semelhante ao _.sum" src/Helpers/Iterables/sum.ts
   ```
   *Critério de aceitação:* O comando retorna código de saída 0 (nenhuma correspondência encontrada).

3. **Validação da Seção Documental em `README.md`:**
   ```bash
   grep -n "Divergências conhecidas em relação ao Lodash" README.md
   ```
   *Critério de aceitação:* O comando localiza a seção no README com saída bem-sucedida.

4. **Validação de Tipagem TypeScript:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* Compilação limpa do `vue-tsc` sem nenhum erro de tipo.

5. **Validação da Suíte Completa de Testes:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* 100% dos testes da biblioteca passam sem regressão em relação ao baseline de auditoria.

---

### Skills Aplicáveis
- `systematic-debugging-best-practices`: Investigação e diagnóstico de causas raízes, distinção rigorosa entre defeito algorítmico e desalinhamento contratual/documental.
- `tdd`: Estruturação da metodologia Red-Green e formulação de testes de caracterização para travamento de contratos públicos.
- `superpowers`: Disciplina em planos estruturados, rastreamento reverso de dados e conformidade estrita com o portão de qualidade.
- `code-review`: Análise dos 5 eixos (corretude, legibilidade, arquitetura, segurança e performance) e garantia de não-regressão.
- `production-code-audit`: Avaliação do impacto em produção de dados sujos de API/formulários e mitigação de breaking changes silenciosas.
