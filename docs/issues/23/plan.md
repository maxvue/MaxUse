# Plano de Implementação - Issue #23
## [Audit] applySuggestion em useSpellChecker não sanitiza RegExp e falha com caracteres especiais ou acentuados

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante a auditoria automatizada de segurança e robustez (lente 5 - injeção em RegExp), identificou-se uma vulnerabilidade de compilação dinâmica de expressões regulares sem sanitização no composable [`useSpellChecker`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts#L508-L523).

A função `applySuggestion(word: string, replacement: string)` aceita qualquer string para o parâmetro `word` e interpola esse valor diretamente dentro do construtor nativo de expressões regulares:
```ts
const regex = new RegExp(`\\b${word}\\b`, 'g');
```

Isso produz três agravantes críticos em tempo de execução:

1. **Falha Crítica por Injeção Sintática de Metacaracteres RegExp (Crash por `SyntaxError`):**
   - Quando o termo `word` contém caracteres com significado especial em expressões regulares (tais como quantificadores `+`, `*`, `?`, delimitadores de agrupamento `(`, `)`, classes `[`, `]`, barras verticais `|`, chaves `{`, `}`, etc.), o construtor `new RegExp` tenta interpretá-los sintaticamente.
   - Cenário clássico em termos técnicos: ao tentar substituir o termo `'C++'`, a chamada `new RegExp('\\bC++\\b', 'g')` falha imediatamente lançando a exceção fatal não tratada:
     `SyntaxError: Invalid regular expression: /\bC++\b/g: Nothing to repeat`.
   - Se o termo for `'A+'`, a expressão `\bA+\b` não lança erro sintático, mas interpreta o `+` como o quantificador "um ou mais 'A's", corrompendo palavras como `'AAA'` em vez de substituir estritamente o termo pretendido.
   - Isso quebra a thread de execução do JavaScript, travando a interface do usuário ou o componente consumidor.

2. **Falha Silenciosa em Vocábulos da Língua Portuguesa com Acentuação (Bordas de Palavra ASCII `\b`):**
   - No motor de expressões regulares do JavaScript, a asserção de borda de palavra `\b` é delimitada estritamente pelos caracteres da classe ASCII `\w` (`[a-zA-Z0-9_]`).
   - Caracteres acentuados da língua portuguesa (`á`, `é`, `í`, `ó`, `ú`, `ã`, `õ`, `â`, `ê`, `ô`, `ç`, etc.) são classificados pelo motor nativo como `\W` (não-palavra).
   - Consequências graves de contorno:
     - **Palavras iniciadas por letra acentuada (ex.: `'órgão'`, `'água'`, `'ícone'`, `'área'`):** Em um texto como `"o órgão regulador"`, a transição entre o espaço `' '` (`\W`) e o caractere inicial `'ó'` (`\W`) NÃO é reconhecida como borda de palavra (`\b`). Assim, `\bórgão\b` nunca encontra correspondência e a substituição falha silenciosamente.
     - **Palavras terminadas por letra acentuada (ex.: `'maçã'`, `'você'`, `'café'`, `'está'`):** Em um texto como `"comprei maçã na feira"`, a transição entre `'ã'` (`\W`) e o espaço `' '` (`\W`) também NÃO é reconhecida como `\b`. A substituição não ocorre.
     - Como a biblioteca `@maxvue/max-use` tem suporte e dicionário prioritários para termos em pt-BR (vide `TECHNICAL_DICTIONARY` em [`useSpellChecker.ts:L65-150`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts#L65-L150)), a ineficácia com palavras acentuadas compromete diretamente a função precípua do composable.

3. **Substituição Insegura com Padrões de Cifrão em `replacement`:**
   - Ao executar `raw.replace(regex, replacement)`, se a string `replacement` contiver sequências como `$&`, `$'` ou `$1` (por exemplo, valores monetários como `"$100"` ou `"$&#"`), o método nativo `String.prototype.replace` interpreta esses caracteres como referências a grupos de captura, corrompendo o texto resultante.
   - A substituição deve empregar uma função de substituição (`() => replacement`), que trata a string de reposição de maneira puramente literal.

4. **Ausência de Cláusula de Guarda para Parâmetros Inválidos:**
   - Se `word` for string vazia, `null` ou `undefined`, a compilação ou execução de regex pode gerar comportamento errático ou substituição indesejada em toda a string.

#### Causa Raiz Comprovada
- **Localização Exata no Código:**
  - [`src/Composables/useSpellChecker.ts:L508-523`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts#L508-L523):
    ```ts
    const applySuggestion = (word: string, replacement: string): string => {
        const raw = toValue(source);
        if (!raw || typeof raw !== 'string') return raw ?? '';

        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const updated = raw.replace(regex, replacement);

        if (isRef(source)) (source as Ref<string | null | undefined>).value = updated;

        runCheck();
        return updated;
    };
    ```

- **Fluxo Causal:**
  1. `applySuggestion(word, replacement)` é invocada recebendo um termo a ser substituído.
  2. O argumento `word` é concatenado diretamente via template literal em `new RegExp(\`\\b\${word}\\b\`, 'g')`.
  3. A ausência de sanitização de caracteres especiais de expressão regular acarreta `SyntaxError` imediato para símbolos como `+` (ex: `C++`).
  4. O uso de `\b` restringe a detecção a caracteres ASCII `\w`, falhando na identificação de bordas em palavras com acentuação da língua portuguesa (`órgão`, `maçã`).
  5. A passagem de `replacement` diretamente como string no `.replace()` processa padrões de substituição especiais (`$`), alterando indevidamente o resultado pretendido.

- **Rastreamento Reverso de Dados:**
  - **UI (Camada de Apresentação):** Componentes Vue (ex.: editores de texto, campos de entrada ou painéis de revisão ortográfica) exibem lista de palavras incorretas e opções sugeridas (`suggestions`). Ao clicar em uma sugestão, aciona-se `@click="applySuggestion(erro.word, sugestao)"`.
  - **Store / Reatividade:** O composable [`useSpellChecker`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts) gerencia o estado da string (`source`), a lista reativa de erros (`errors`) e o mapa de sugestões (`suggestions`). A chamada de `applySuggestion` é executada de forma síncrona pelo consumidor.
  - **Camada de Serviço / Transformação:** A interpolação insegura e sem fronteiras Unicode falha na execução síncrona do JavaScript, lançando `SyntaxError` ou falhando silenciosamente na substituição de termos acentuados.
  - **API / Rotas / Banco de Dados:** Camada client-side pura de composable Vue, sem chamadas de rede nem persistência remota.

---

### Arquivos afetados

1. [`src/Composables/useSpellChecker.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts):
   - Importar o helper existente [`escapeRegExp`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Helpers/Strings/escapeRegExp.ts) de `../Helpers/Strings/escapeRegExp`.
   - Adicionar cláusula de guarda defensiva para `word` vazio ou não-string (`if (!word || typeof word !== 'string') return raw;`).
   - Substituir `\b` por fronteiras Unicode compatíveis: lookbehind negativo `(?<![\p{L}\p{N}])` e lookahead negativo `(?![\p{L}\p{N}])`.
   - Sanitizar `word` com `escapeRegExp(word)` e compilar a expressão regular com flags `'gu'`.
   - Utilizar função de substituição `() => replacement` no `.replace()` para garantir tratamento literal de caracteres como `$`.

2. [`src/Composables/useSpellChecker.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.test.ts):
   - Adicionar casos de teste cobrindo:
     - Sanitização de caracteres especiais de RegExp (`C++`, `[tag]`, `(calc)`, `a*b`, etc.) sem lançar `SyntaxError`.
     - Substituição em palavras iniciadas, contendo ou finalizadas por caracteres acentuados (`órgão`, `maçã`, `café`).
     - Respeito aos limites de palavra (não substituir partes de palavras maiores, ex.: `maçã` em `maçãs` ou `C++` em `C++20`).
     - Substituição segura com strings de reposição contendo `$`.
     - Cláusulas de guarda com `word` vazio ou inválido.

3. [`docs/issues/23/plan.md`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/docs/issues/23/plan.md):
   - Registro e documentação técnica do plano de execução da issue #23.

> [!IMPORTANT]
> **Controle Estrito de Escopo:** Nenhum outro arquivo, link simbólico (`node_modules`, `.claude/`, `.opencode/`), ou dependência deve ser modificado, criado ou adicionado ao Git. Ao realizar o commit, deve-se versionar única e exclusivamente os arquivos listados acima (`git add src/Composables/useSpellChecker.ts src/Composables/useSpellChecker.test.ts docs/issues/23/plan.md`). Links simbólicos para diretórios locais absolutos corrompem o ambiente de CI/CD e configuram violação estrita do escopo.

---

### Execuções propostas

1. **Passo 1: Escrever os Testes Unitários de Falha (Fase Red do TDD)**
   - No arquivo [`src/Composables/useSpellChecker.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.test.ts), adicionar a suíte de testes que reproduz as falhas de `SyntaxError`, a ausência de correspondência para termos acentuados e o tratamento de `$`.
   - Executar `npm test -- src/Composables/useSpellChecker.test.ts` e confirmar a ocorrência de falha (Red).

2. **Passo 2: Importar Helper de Sanitização**
   - No arquivo [`src/Composables/useSpellChecker.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts):
     - Adicionar o import do helper já existente no projeto:
       ```ts
       import { escapeRegExp } from '../Helpers/Strings/escapeRegExp';
       ```

3. **Passo 3: Implementar a Correção Cirúrgica em `applySuggestion` (Fase Green do TDD)**
   - Atualizar a função `applySuggestion`:
     ```ts
     const applySuggestion = (word: string, replacement: string): string => {
         const raw = toValue(source);
         if (!raw || typeof raw !== 'string') return raw ?? '';
         if (!word || typeof word !== 'string') return raw;

         const prefix = '(?<![\\p{L}\\p{N}])';
         const suffix = '(?![\\p{L}\\p{N}])';

         const regex = new RegExp(`${prefix}${escapeRegExp(word)}${suffix}`, 'gu');
         const updated = raw.replace(regex, () => replacement);

         if (isRef(source)) (source as Ref<string | null | undefined>).value = updated;

         runCheck();
         return updated;
     };
     ```

4. **Passo 4: Validação de Conformidade de Linter e Estilo (ESLint)**
   - Executar o linter oficial do projeto para certificar conformidade com as regras de ESLint e formatação do repositório:
     ```bash
     npx eslint src/Composables/useSpellChecker.ts src/Composables/useSpellChecker.test.ts
     ```

5. **Passo 5: Validação de Tipagem TypeScript e Suíte Completa**
   - Executar a checagem estática de tipos e a suíte completa de testes para garantir 100% de não-regressão:
     ```bash
     npm test -- src/Composables/useSpellChecker.test.ts
     npm run type-check
     npm test
     ```

---

### Especificação de Teste TDD (Red-Green)

#### Teste de Falha (Red)
Inserir no arquivo [`src/Composables/useSpellChecker.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.test.ts):

```ts
it('aplica sugestão com caracteres especiais de regex sem lançar SyntaxError', async () => {
    await scope.run(async () => {
        const text = ref('Termo C++ inválido e biblioteca A+');
        const { applySuggestion, checkNow } = useSpellChecker(text, { debounceMs: 0 });
        await checkNow();

        expect(() => {
            applySuggestion('C++', 'C#');
        }).not.toThrow();

        expect(text.value).toBe('Termo C# inválido e biblioteca A+');

        // Teste com outros caracteres reservados de regex
        const textSymbols = ref('teste [tag] e valor (calc) com a*b');
        const sc = useSpellChecker(textSymbols, { debounceMs: 0 });
        sc.applySuggestion('[tag]', '[label]');
        sc.applySuggestion('(calc)', '(resultado)');
        sc.applySuggestion('a*b', 'a_b');
        expect(textSymbols.value).toBe('teste [label] e valor (resultado) com a_b');

        // Guard clause para word vazio ou inválido
        sc.applySuggestion('', 'algo');
        // @ts-expect-error teste defensivo com tipo inválido
        sc.applySuggestion(null, 'algo');
        expect(textSymbols.value).toBe('teste [label] e valor (resultado) com a_b');
    });
});

it('aplica sugestão em palavras com caracteres acentuados no início, meio e fim', async () => {
    await scope.run(async () => {
        const text = ref('órgão regulador comprou maçã e café na feira');
        const { applySuggestion } = useSpellChecker(text, { debounceMs: 0 });

        // Palavra iniciando com acento
        applySuggestion('órgão', 'entidade');
        expect(text.value).toBe('entidade regulador comprou maçã e café na feira');

        // Palavra terminando com acento
        applySuggestion('maçã', 'banana');
        expect(text.value).toBe('entidade regulador comprou banana e café na feira');

        applySuggestion('café', 'chá');
        expect(text.value).toBe('entidade regulador comprou banana e chá na feira');
    });
});

it('respeita limites de palavra para termos acentuados e caracteres especiais', async () => {
    await scope.run(async () => {
        const text = ref('uma maçã e duas maçãs; versão C++ e C++20');
        const { applySuggestion } = useSpellChecker(text, { debounceMs: 0 });

        applySuggestion('maçã', 'pera');
        expect(text.value).toBe('uma pera e duas maçãs; versão C++ e C++20');

        applySuggestion('C++', 'Rust');
        expect(text.value).toBe('uma pera e duas maçãs; versão Rust e C++20');
    });
});

it('substitui com segurança quando replacement contém padrões de cifrão', async () => {
    await scope.run(async () => {
        const text = ref('o preco total era valor');
        const { applySuggestion } = useSpellChecker(text, { debounceMs: 0 });

        applySuggestion('valor', '$100 e $& bônus');
        expect(text.value).toBe('o preco total era $100 e $& bônus');
    });
});
```

#### Comportamento Red (antes da correção):
```text
FAIL src/Composables/useSpellChecker.test.ts > useSpellChecker Composable > aplica sugestão com caracteres especiais de regex sem lançar SyntaxError
SyntaxError: Invalid regular expression: /\bC++\b/g: Nothing to repeat
    at new RegExp (<anonymous>)
    at applySuggestion (src/Composables/useSpellChecker.ts:511:23)

FAIL src/Composables/useSpellChecker.test.ts > useSpellChecker Composable > aplica sugestão em palavras com caracteres acentuados no início, meio e fim
AssertionError: expected 'órgão regulador comprou maçã e café na feira' to be 'entidade regulador comprou maçã e café na feira'
- Expected: "entidade regulador comprou maçã e café na feira"
+ Received: "órgão regulador comprou maçã e café na feira"
```

#### Comportamento Green (após a correção):
```text
✓ src/Composables/useSpellChecker.test.ts (9 tests)
  ✓ useSpellChecker Composable (9)
    ✓ identifica erros ortográficos e sugere correções
    ✓ corrige automaticamente termos técnicos conhecidos
    ✓ preserva a capitalização das palavras corrigidas
    ✓ permite aplicar sugestão diretamente
    ✓ suporta dicionário customizado e opções de termos técnicos
    ✓ aplica sugestão com caracteres especiais de regex sem lançar SyntaxError
    ✓ aplica sugestão em palavras com caracteres acentuados no início, meio e fim
    ✓ respeita limites de palavra para termos acentuados e caracteres especiais
    ✓ substitui com segurança quando replacement contém padrões de cifrão
```

---

### Banco de dados

**Nenhuma migration necessária.**
O repositório `@maxvue/max-use` é uma biblioteca front-end client-side em Vue 3 / TypeScript, sem camada de persistência ou banco de dados.

---

### Riscos de quebra e Não-Regressão

1. **Compatibilidade de RegEx Unicode (`\p{L}`, `\p{N}` e lookbehind):**
   - *Risco:* Ambientes JavaScript legados poderiam não suportar lookbehind `(?<=...)` / `(?<!...)` ou propriedades Unicode com flag `u`.
   - *Mitigação:* A configuração de compilação do projeto define `target: "ESNext"` e `lib: ["ES2020", "DOM", "DOM.Iterable"]` no `tsconfig.json`. Lookaround e propriedades Unicode de RegExp são suportados nativamente no Node.js (v10+ / v12+) e em todos os navegadores modernos (Chrome 64+, Firefox 78+, Safari 16.4+), plenamente compatíveis com os alvos do repositório.
2. **Impacto em Chamadas Pré-existentes de `applySuggestion`:**
   - *Risco:* Alteração de comportamento em chamadas já existentes com palavras ASCII comuns.
   - *Mitigação:* Para palavras ASCII comuns (`disjutor`, `concessionaria`, etc.), o comportamento permanece estritamente idêntico, pois `(?<![\p{L}\p{N}])` e `(?![\p{L}\p{N}])` operam como fronteiras exatas de palavras, mantendo compatibilidade regressiva de 100%.
3. **Padrões Especiais de Substituição (`$`):**
   - A adoção da função de substituição `() => replacement` elimina potenciais quebras caso sugestões envolvam símbolos de moeda (`$100`) ou sequências reservadas do JavaScript (`$&`, `$1`).
4. **Risco de Ambiente e Portabilidade (Portão de Qualidade 2):**
   - *Risco:* Criação ou versionamento de links simbólicos apontando para caminhos absolutos locais (`node_modules`, `.claude/skills`, `.opencode/skills`), corrompendo a esteira de CI/CD.
   - *Mitigação:* O escopo de execução restringe-se estritamente aos arquivos previstos (`useSpellChecker.ts`, `useSpellChecker.test.ts` e `docs/issues/23/plan.md`). É terminantemente proibido adicionar symlinks ou diretórios de dependências ao Git.
5. **Verificação de Não-Regressão na Suíte Geral:**
   - Execução integral de `npm test` em toda a biblioteca (mais de 3400 testes unitários) para certificar que nenhum outro composable ou helper foi afetado.

---

### Validação

Comandos automatizados para comprovação conclusiva:

1. **Execução focada do teste do composable:**
   ```bash
   npm test -- src/Composables/useSpellChecker.test.ts
   ```
   *Critério de aceitação:* 9 testes aprovados (5 originais + 4 novos cenários de teste), sem falhas de `SyntaxError` nem de fronteiras de palavras.

2. **Checagem de conformidade de estilo de código:**
   ```bash
   npx eslint src/Composables/useSpellChecker.ts src/Composables/useSpellChecker.test.ts
   ```
   *Critério de aceitação:* Código sem violações de ESLint.

3. **Checagem estática de tipos TypeScript:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* Código compilando sem nenhum erro de tipagem estática (`vue-tsc --noEmit`).

4. **Suíte completa de testes do repositório:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* 100% da suíte passando sem regressões.

---

### Skills Aplicáveis

- `superpowers`: Condução estruturada do fluxo de engenharia, ciclo TDD Red-Green e planejamento cirúrgico.
- `code-review-and-quality`: Revisão rigorosa de alterações de código, análise de bordas de regex, regressões e tipagem.
- `tdd`: Aplicação estrita da metodologia Red-Green com escrita de testes que comprovam a falha e posterior implementação que garante a aprovação.
- `systematic-debugging-best-practices`: Isolamento da causa raiz comprovada, reprodução mínima controlada e tratamento de efeitos colaterais.
- `production-code-audit`: Auditoria de segurança e robustez para injeção de expressões regulares e manipulação de caracteres Unicode/multibyte.
