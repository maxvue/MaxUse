# Plano de Implementação - Issue #23
## [Audit] applySuggestion em useSpellChecker não sanitiza RegExp e falha com caracteres especiais ou acentuados

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante a auditoria automatizada de segurança e robustez (lente 5 - injeção em RegExp), identificou-se uma vulnerabilidade de compilação dinâmica de expressões regulares sem sanitização no composable [`useSpellChecker`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts#L507-L519).

A função `applySuggestion(word: string, replacement: string)` aceita qualquer string para o parâmetro `word` e interpola esse valor diretamente dentro do construtor de expressões regulares `new RegExp(\`\\b\${word}\\b\`, 'g')`. Isso produz dois agravantes críticos em tempo de execução:

1. **Falha Crítica por Injeção Sintática de Metacaracteres RegExp (Crash por `SyntaxError`):**
   - Quando o termo `word` contém caracteres com significado especial em expressões regulares (tais como quantificadores `+`, `*`, `?`, delimitadores de agrupamento `(`, `)`, classes `[`, `]`, barras verticais `|`, chaves `{`, `}`, etc.), o construtor `new RegExp` tenta interpretá-los sintaticamente.
   - Exemplo clássico em termos técnicos: ao tentar substituir a palavra `'C++'`, a chamada `new RegExp('\\bC++\\b', 'g')` falha imediatamente com o erro fatal não tratado:
     `SyntaxError: Invalid regular expression: /\bC++\b/g: Nothing to repeat`.
   - Se o termo for `'A+'`, a expressão `\bA+\b` não lança erro de sintaxe, mas interpreta o `+` como quantificador "um ou mais 'A's", corrompendo palavras como `'AAA'` em vez de substituir o termo pretendido.
   - Isso bloqueia a thread de execução do JavaScript, travando a interface do usuário ou o componente consumidor.

2. **Falha Silenciosa em Vocábulos da Língua Portuguesa com Acentuação (Bordas de Palavra ASCII `\b`):**
   - No motor de expressões regulares do JavaScript, a asserção de borda de palavra `\b` é delimitada estritamente pelos caracteres da classe ASCII `\w` (`[a-zA-Z0-9_]`).
   - Todos os caracteres acentuados da língua portuguesa (`á`, `é`, `í`, `ó`, `ú`, `ã`, `õ`, `â`, `ê`, `ô`, `ç`, etc.) são classificados pelo motor nativo como `\W` (não-palavra).
   - Consequências graves de contorno:
     - **Palavras iniciadas por letra acentuada (ex.: `'órgão'`, `'água'`, `'ícone'`, `'área'`):** Em um texto como `"o órgão regulador"`, a transição entre o espaço `' '` (`\W`) e o caractere inicial `'ó'` (`\W`) NÃO é uma borda de palavra (`\b`). Assim, `\bórgão\b` nunca encontra correspondência e a substituição falha silenciosamente. Pelo contrário, a expressão `\bórgão` coincidiria bizarramente em `'xórgão'` (transição de `\w` para `\W`), gerando falso-positivo inverso.
     - **Palavras terminadas por letra acentuada (ex.: `'maçã'`, `'você'`, `'café'`, `'está'`, `'baú'`):** Em um texto como `"comprei maçã fresca"`, a transição entre `'ã'` (`\W`) e o espaço `' '` (`\W`) também NÃO é reconhecida como `\b`. A substituição não ocorre.
     - Como a biblioteca tem suporte e dicionário prioritários para termos em pt-BR (vide `TECHNICAL_DICTIONARY` em [`useSpellChecker.ts:L65-150`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts#L65-L150)), a falha em lidar com palavras acentuadas compromete diretamente a função precípua do composable.

3. **Substituição Insegura com Padrões de Cifrão em `replacement`:**
   - Ao executar `raw.replace(regex, replacement)`, se a string `replacement` contiver caracteres especiais como `$&`, `$'` ou `$1` (por exemplo, valores monetários como `"$100"` ou `"$&#"`), o método nativo `String.prototype.replace` interpreta esses caracteres como referências a grupos de captura, distorcendo o texto resultante.

#### Causa Raiz Comprovada
- **Localização Exata no Código:**
  - [`src/Composables/useSpellChecker.ts:L507-519`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts#L507-L519):
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
- **Fluxo Causal e Rastreamento Reverso de Dados:**
  - **Camada UI / Aplicação Consumidora:** Um componente Vue invoca `const { applySuggestion } = useSpellChecker(source)` e dispara a função passando a palavra `word` a substituir e o termo `replacement`.
  - **Camada Composable (`useSpellChecker`):**
    1. A função `applySuggestion` extrai o valor de `source` através de `toValue(source)`.
    2. Na linha 511, concatena `word` de forma crua dentro da string de interpolação `` `\\b${word}\\b` ``.
    3. `new RegExp(...)` é chamado sem sanitização de caracteres de controle e sem suporte a Unicode (ausência da flag `u` e dependência de `\b` que só enxerga ASCII).
    4. Ao encontrar caracteres de regex (`+`, `*`, `(`, etc.), o JavaScript dispara um `SyntaxError` imediato. Ao encontrar palavras que começam ou terminam com caracteres acentuados, o padrão `\b` falha em casar as bordas e nada é substituído.
    5. O resultado não é gravado na `Ref` e a UI permanece em estado inconsistente.
  - **Rastreamento Reverso Completo:**
    - UI ⇄ Composable (`useSpellChecker`) ⇄ Helper nativo (`escapeRegExp`).
    - Por ser uma biblioteca utilitária de componentes e composables puramente cliente (`@maxvue/max-use`), não há envolvimento de Stores globais (Pinia/Vuex), rotas de API HTTP, Controllers de backend ou Banco de Dados.

---

### Arquivos afetados

1. [`src/Composables/useSpellChecker.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts):
   - Importar o helper existente [`escapeRegExp`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Helpers/Strings/escapeRegExp.ts).
   - Refatorar a implementação de `applySuggestion` para:
     - Sanitizar o parâmetro `word` usando `escapeRegExp`.
     - Definir limites de palavra sensíveis a Unicode (`(?<![\p{L}\p{N}])` e `(?![\p{L}\p{N}])`) acompanhados da flag `u` (`'gu'`).
     - Utilizar replacer funcional `() => replacement` para blindar contra padrões especiais de substituição (`$1`, `$&`, etc.).
     - Adicionar verificação defensiva para strings vazias ou nulas em `word`.

2. [`src/Composables/useSpellChecker.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.test.ts):
   - Adicionar novos casos de teste unitário no bloco `describe('useSpellChecker Composable')` cobrindo termos com caracteres especiais de regex, palavras acentuadas (início, meio e fim de texto) e preservação de limites Unicode.

---

### Execuções propostas

A implementação deve ser realizada cirurgicamente seguindo o ciclo TDD (Red-Green-Refactor):

#### Passo 1: Criação da Bateria de Testes TDD (Fase Red)
- No arquivo [`src/Composables/useSpellChecker.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.test.ts), adicionar novos casos de teste específicos:
  - **Teste 1:** Sanitização de caracteres de controle de expressão regular:
    - Cenário com `'C++'` -> substituição por `'C#'` sem lançar `SyntaxError`.
    - Cenários adicionais com metacaracteres: `'A+'`, `'(teste)'`, `'[termo]'`, `'item*'`, `'preco.total'`.
  - **Teste 2:** Suporte a palavras acentuadas em português nos extremos da palavra:
    - Palavra iniciando com acento: `'órgão'` -> `'entidade'` no início e meio de frases.
    - Palavra terminando com acento: `'maçã'` -> `'banana'`, `'café'` -> `'bebida'`.
  - **Teste 3:** Respeito rigoroso aos limites de palavra (word boundaries):
    - Garantir que `'maçã'` não substitua `'maçãs'` ou `'maçaneta'`.
    - Garantir que `'C++'` não substitua `'C++20'`.
  - **Teste 4:** Segurança contra injeção de padrões de substituição em `replacement`:
    - Substituição por strings contendo `"$100"` ou `"$&"`.
  - **Teste 5:** Guard clause para `word` inválido ou vazio:
    - `applySuggestion('', 'algo')` não deve alterar o texto.
- Executar `npm test -- src/Composables/useSpellChecker.test.ts` e registrar a falha (*Red*), comprovando que o código atual quebra com `SyntaxError` para `'C++'` e falha nas asserções de `'órgão'` e `'maçã'`.

#### Passo 2: Correção Cirúrgica no Código de Produção (Fase Green)
- No arquivo [`src/Composables/useSpellChecker.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.ts):
  1. No topo do arquivo (próximo à linha 2), adicionar o import:
     ```ts
     import { escapeRegExp } from '../Helpers/Strings/escapeRegExp';
     ```
  2. Substituir a implementação de `applySuggestion` (linhas 507-519):
     ```ts
     /**
      * Aplica uma substituição para uma palavra específica no texto.
      */
     const applySuggestion = (word: string, replacement: string): string => {
         const raw = toValue(source);
         if (!raw || typeof raw !== 'string') return raw ?? '';
         if (!word || typeof word !== 'string') return raw;

         const isStartWordChar = /^[\p{L}\p{N}]/u.test(word);
         const isEndWordChar = /[\p{L}\p{N}]$/u.test(word);

         const prefix = isStartWordChar ? '(?<![\\p{L}\\p{N}])' : '';
         const suffix = isEndWordChar ? '(?![\\p{L}\\p{N}])' : '';

         const regex = new RegExp(`${prefix}${escapeRegExp(word)}${suffix}`, 'gu');
         const updated = raw.replace(regex, () => replacement);

         if (isRef(source)) (source as Ref<string | null | undefined>).value = updated;

         runCheck();
         return updated;
     };
     ```

#### Passo 3: Validação do Teste Unitário (Fase Green)
- Executar novamente `npm test -- src/Composables/useSpellChecker.test.ts`.
- Verificar se todos os testes (os 5 pré-existentes e os novos testes adicionados) são executados com sucesso (100% green).

#### Passo 4: Verificação de Não-Regressão e Integridade do Repositório
- Executar `npm test` para assegurar que nenhum outro composable ou helper sofreu impacto colateral.
- Executar `npm run type-check` (`vue-tsc --noEmit`) para garantir que os tipos estáticos e declarações continuem 100% válidos.
- Executar `npm run lint` para conferir conformidade com as regras de formatação e linting do repositório.

---

### Especificação de Teste TDD (Red-Green)

#### Novos Casos de Teste
Arquivo: [`src/Composables/useSpellChecker.test.ts`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-23/src/Composables/useSpellChecker.test.ts)

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
O repositório `@maxvue/max-use` é uma biblioteca client-side front-end pura sem qualquer mecanismo de persistência ou banco de dados.

---

### Riscos de quebra e Não-Regressão

1. **Compatibilidade de RegEx Unicode (`\p{L}`, `\p{N}` e lookbehind):**
   - *Risco:* Ambientes JavaScript legados poderiam ter problemas com lookbehind `(?<=...)` ou flags Unicode `u`.
   - *Mitigação:* O projeto possui configuração de compilação direcionada para `target: "ESNext"` e `lib: ["ES2020", "DOM", "DOM.Iterable"]` no `tsconfig.json`. Lookbehind e propriedades Unicode de RegExp são suportados nativamente no Node.js (v10+ / v12+) e em todos os navegadores modernos (Chrome 64+, Firefox 78+, Safari 16.4+), plenamente compatíveis com os alvos do repositório.
2. **Impacto em Chamadas Pré-existentes de `applySuggestion`:**
   - *Risco:* Alteração de comportamento em chamadas já existentes.
   - *Mitigação:* Para palavras ASCII comuns (`disjutor`, `concessionaria`, etc.), o comportamento permanece estritamente idêntico, pois `(?<![\p{L}\p{N}])` e `(?![\p{L}\p{N}])` se comportam como fronteiras exatas de palavras, mantendo compatibilidade regressiva de 100%.
3. **Padrões de Substituição com Cifrão:**
   - A adoção da função de substituição `() => replacement` elimina potenciais quebras caso sugestões envolvam símbolos de moeda ou caracteres reservados de substituição do JavaScript.
4. **Verificação de Não-Regressão na Suíte Geral:**
   - Execução integral de `npm test` em toda a biblioteca para certificar que nenhum composable ou helper foi afetado.

---

### Validação

Comandos automatizados para comprovação conclusiva:

1. **Execução focada do teste do composable:**
   ```bash
   npm test -- src/Composables/useSpellChecker.test.ts
   ```
   *Critério de aceitação:* 9 testes aprovados (5 originais + 4 novos cenários de teste), sem falhas de `SyntaxError` nem de fronteiras de palavras.

2. **Checagem de tipos TypeScript:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* Código compilando sem nenhum erro de tipagem estática.

3. **Validação de linting e estilo de código:**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* Código sem violações de ESLint.

4. **Suíte completa de testes do repositório:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* 100% da suíte passando sem regressões.

---

### Skills Aplicáveis

- `superpowers`: Condução estruturada do fluxo de engenharia, ciclo TDD Red-Green e planejamento cirúrgico.
- `code-review`: Revisão rigorosa de alterações de código, análise de bordas de regex, regressões e tipagem.
- `tdd`: Aplicação estrita da metodologia Red-Green com escrita de testes que comprovam a falha e posterior implementação que garante a aprovação.
- `systematic-debugging-best-practices`: Isolamento da causa raiz comprovada, reprodução mínima controlada e tratamento de efeitos colaterais.
- `production-code-audit`: Auditoria de segurança e robustez para injeção de expressões regulares e manipulação de caracteres Unicode/multibyte.
