# Plano de Implementação - Issue #22
## [Audit] onlySymbols trata letras acentuadas em portugues como simbolos por falta de suporte Unicode

---

### Descrição e Causa Raiz

#### Descrição Detalhada do Problema e Agravantes
Durante a auditoria automatizada de 2026-09-04 (lente 10 - filtros de strings / regras de negócio), foi identificada uma falha na função [`onlySymbols`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43), localizada em [src/Helpers/Strings/filters.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts).

A função [`onlySymbols`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43) tem como especificação e contrato declarado "filtrar uma string, mantendo apenas símbolos (caracteres não alfanuméricos)". No entanto, a implementação utiliza a expressão regular `String(data).replace(/[^\W_]/g, '')`, que opera no modo ASCII padrão do JavaScript, sem suporte a Unicode (ausência da flag `u` e de classes de propriedades Unicode como `\p{L}`).

**Agravantes Técnicos Identificados:**
1. **Corrupção de texto em palavras com letras acentuadas:**
   No modo ASCII padrão de expressões regulares do JavaScript, o metacaráter `\w` corresponde estritamente aos caracteres `[a-zA-Z0-9_]`. O metacaráter complementar `\W` corresponde a qualquer caractere fora dessa faixa (`[^a-zA-Z0-9_]`).
   Portanto, todas as letras acentuadas da língua portuguesa (`á`, `é`, `í`, `ó`, `ú`, `ç`, `ã`, `õ`, `â`, `ê`, `ô`, `à`, `ü`, e suas formas maiúsculas `Á`, `É`, `Í`, `Ó`, `Ú`, `Ç`, `Ã`, `Õ`, `Â`, `Ê`, `Ô`, `À`, `Ü`) são classificadas como `\W` (não-palavra).
   A classe de caracteres negada `[^\W_]` significa "qualquer caractere que NÃO pertença a `\W` e NÃO seja `_`", ou seja, casa exatamente e unicamente os caracteres alfanuméricos ASCII `[a-zA-Z0-9]`.
   Ao executar `.replace(/[^\W_]/g, '')`, a função remove exclusivamente letras e dígitos ASCII, preservando todas as letras acentuadas na saída como se fossem símbolos/pontuação.
2. **Cenários de falha comprovados e reproduzíveis:**
   - `onlySymbols('Atenção!')`: retorna `'çã!'` em vez de `'!'`.
   - `onlySymbols('Olá, mundo!')`: retorna `'á, !'` em vez de `', !'`.
   - `onlySymbols('café!99')`: retorna `'é!'` em vez de `'!'`.
   - `onlySymbols('áéíóúçãõâêôàü ÁÉÍÓÚÇÃÕÂÊÔÀÜ')`: retorna `'áéíóúçãõâêôàü ÁÉÍÓÚÇÃÕÂÊÔÀÜ'` em vez de `' '`.
3. **Assimetria com as funções irmãs:**
   No mesmo arquivo [src/Helpers/Strings/filters.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts), as funções [`onlyLetters`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L13-L18) e [`onlyLettersAndNumbers`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L52-L56) já utilizam propriedades Unicode (`\p{L}`) com a flag `u` (`/gu`), tratando corretamente os caracteres acentuados. A função [`onlySymbols`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43) permaneceu com implementação legada baseada em ASCII.
4. **Impacto a jusante:**
   Qualquer regra de negócio, formulário, máscara ou sanitizador que confie em [`onlySymbols`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43) para extrair símbolos, tokens ou pontuações de uma entrada recebe dados corrompidos contendo fragmentos de palavras em língua portuguesa.

#### Causa Raiz Comprovada
- **Localização Exata no Código:**
  [src/Helpers/Strings/filters.ts:L39-L43](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43)
  ```ts
  export function onlySymbols(value: RefString): string {
      const data = toValue(value);
      if (isBlank(data)) return '';
      return String(data).replace(/[^\W_]/g, '');
  }
  ```
- **Fluxo Causal:**
  1. A função recebe `value` (tipo `RefString`, suportando string, número, nulo, indefinido ou `Ref`/getter reativo do Vue).
  2. Desembrulha reativamente o valor com `toValue(value)` e trata valores vazios com [`isBlank(data)`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Types/isBlank.ts#L8).
  3. Converte o valor para string com `String(data)` e invoca `.replace(/[^\W_]/g, '')`.
  4. Por falta da flag `u` e da categoria de caracteres Unicode `\p{L}`, a regex casa somente o intervalo ASCII `[a-zA-Z0-9]`. Letras com diacríticos e acentos são tratadas como `\W`, escapando da substituição e permanecendo indevidamente no retorno.
- **Rastreamento Reverso de Dados:**
  ```
  [UI / View] Componentes Vue / Aplicação consumidora que invoca onlySymbols (ex.: sanitização de input, máscaras, extração de caracteres especiais)
      ↕
  [Barramento de Exportação] [src/index.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/index.ts#L33) ⇄ [src/Helpers/Strings/index.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/index.ts#L60) (exportação nomeada e via objeto StrFilter.onlySymbols)
      ↕
  [Service / Helper] Função [`onlySymbols`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43) em [src/Helpers/Strings/filters.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts)
      ↕
  [Processamento / Reatividade] `toValue(value)` com checagem [`isBlank`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Types/isBlank.ts#L8)
      ↕
  [Regex Engine] `String(data).replace(/[^\W_]/g, '')` (ASCII-only regex sem flag 'u' e sem '\p{L}', tratando acentos '\W' como símbolos)
  ```
  *(Nota: O projeto MaxUse é uma biblioteca front-end utilitária e reativa em Vue 3 / TypeScript, sem camadas de Controllers de backend, Stores globais externas ou Banco de Dados).*

---

### Arquivos afetados

1. [src/Helpers/Strings/filters.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts):
   - Modificação cirúrgica da linha 42 para substituir a regex legada `/[^\W_]/g` por `/[\p{L}0-9]/gu`.
2. [src/Helpers/Strings/filters.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.test.ts):
   - Inclusão de testes unitários no bloco `describe('onlySymbols')` cobrindo caracteres acentuados da língua portuguesa, caracteres Unicode diversos, reatividade com `Ref` e preservação de múltiplos símbolos e pontuações.

> [!IMPORTANT]
> **Controle de Escopo Estrito:** Nenhum outro arquivo deve ser modificado ou incluído no commit da implementação. É estritamente proibido versionar links simbólicos locais (`node_modules`, `.claude/skills`, `.opencode/skills`) ou arquivos temporários.

---

### Execuções propostas

A implementação deve seguir rigorosamente o ciclo TDD (Red-Green-Refactor):

#### Passo 1: Especificação dos Casos de Teste (Fase Red do TDD)
No arquivo [src/Helpers/Strings/filters.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.test.ts), no bloco `describe('onlySymbols', ...)`, adicionar casos de teste para:
1. Remoção de letras acentuadas da língua portuguesa:
   - `'Atenção!'` -> `'!'`
   - `'Olá, mundo!'` -> `', !'`
   - `'café!99'` -> `'!'`
2. Remoção ampla de caracteres acentuados maiúsculos e minúsculos:
   - `'áéíóúçãõâêôàü ÁÉÍÓÚÇÃÕÂÊÔÀÜ'` -> `' '` (espaço mantido como símbolo não-alfanumérico)
3. Suporte a `Ref` reativo com texto acentuado:
   - `ref('Atenção! #1')` -> `'! #'`
4. Preservação de símbolos múltiplos, pontuações e underscores:
   - `'user_name@test.com: #1!&'` -> `'_@.: #!&'`

Executar o teste para validar o comportamento Red antes de qualquer alteração no código-fonte:
```bash
npm test -- src/Helpers/Strings/filters.test.ts
```

#### Passo 2: Correção Cirúrgica em filters.ts (Fase Green do TDD)
No arquivo [src/Helpers/Strings/filters.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts), atualizar a função [`onlySymbols`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L39-L43):
```ts
export function onlySymbols(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return '';
    return String(data).replace(/[\p{L}0-9]/gu, '');
}
```

**Justificativa Técnica da Expressão Regular:**
- `\p{L}`: categoria Unicode "Letter", que abrange todas as letras de qualquer sistema de escrita do padrão Unicode (incluindo todas as vogais acentuadas e consoantes com diacríticos da língua portuguesa).
- `0-9`: dígitos numéricos de 0 a 9.
- `[\p{L}0-9]`: classe que casa qualquer letra ou dígito (qualquer caractere alfanumérico).
- Flag `u`: habilita o suporte pleno a Unicode e classes de propriedade `\p{...}`.
- Flag `g`: substituição global em toda a extensão da string.
- Ao substituir `[\p{L}0-9]` por `''`, todas as letras (com ou sem acento) e números são removidos, preservando estritamente os símbolos, pontuações, caracteres especiais (incluindo `_`) e espaços em branco.
- Isso estabelece total simetria com [`onlyLettersAndNumbers`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L52-L56), que utiliza `/[^\p{L}0-9]/gu`.

#### Passo 3: Verificação dos Testes Unitários (Green)
Reexecutar o teste unitário focado:
```bash
npm test -- src/Helpers/Strings/filters.test.ts
```
Verificar que todos os testes de [src/Helpers/Strings/filters.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.test.ts) passam com 100% de sucesso.

#### Passo 4: Verificação de Tipos e Não-Regressão Global
Executar a verificação estática de tipos TypeScript e a suíte completa de testes do projeto:
```bash
npm run type-check
npm test
```

---

### Especificação de Teste TDD (Red-Green)

#### Teste Automatizado a Ser Inserido
No arquivo [src/Helpers/Strings/filters.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.test.ts), dentro de `describe('onlySymbols')`:
```ts
it('remove letras acentuadas em português e outros caracteres Unicode', () => {
    expect(onlySymbols('Atenção!')).toBe('!');
    expect(onlySymbols('Olá, mundo!')).toBe(', !');
    expect(onlySymbols('café!99')).toBe('!');
    expect(onlySymbols('áéíóúçãõâêôàü ÁÉÍÓÚÇÃÕÂÊÔÀÜ')).toBe(' ');
});

it('funciona com Ref', () => {
    expect(onlySymbols(ref('Atenção! #1'))).toBe('! #');
});

it('mantém múltiplos símbolos e underscores', () => {
    expect(onlySymbols('user_name@test.com: #1!&')).toBe('_@.: #!&');
});
```

#### Comportamento Red (antes da correção):
```text
FAIL src/Helpers/Strings/filters.test.ts > onlySymbols > remove letras acentuadas em português e outros caracteres Unicode
AssertionError: expected 'çã!' to be '!'
- Expected: "!"
+ Received: "çã!"
```

#### Comportamento Green (após a correção):
```text
✓ src/Helpers/Strings/filters.test.ts (24 tests)
  ✓ onlyLetters (5 tests)
  ✓ onlyNumbers (5 tests)
  ✓ onlySymbols (6 tests)
    ✓ mantém apenas símbolos/pontuação
    ✓ retorna vazio para string alfanumérica
    ✓ retorna vazio para null
    ✓ remove letras acentuadas em português e outros caracteres Unicode
    ✓ funciona com Ref
    ✓ mantém múltiplos símbolos e underscores
  ✓ onlyLettersAndNumbers (4 tests)
  ✓ removeSpaces (4 tests)
```

---

### Banco de dados

**Nenhuma migration necessária.**
A biblioteca `@maxvue/max-use` é exclusivamente front-end / client-side para Vue 3 e TypeScript, não possuindo camada de persistência, ORM ou banco de dados.

---

### Riscos de quebra e Não-Regressão

1. **Compatibilidade de Recursos Unicode em Expressões Regulares (`\p{L}` com flag `u`):**
   - *Risco:* Incompatibilidade com ambientes de execução ou versões antigas do JavaScript.
   - *Mitigação:* A especificação de propriedades Unicode de RegExp (`\p{L}` com flag `u`) faz parte do ECMAScript 2018 (ES2018) e é amplamente suportada em todos os navegadores modernos (Chrome 64+, Firefox 78+, Safari 11.1+) e versões de Node.js suportadas pelo projeto (Node 12+). Além disso, as funções [`onlyLetters`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L17) e [`onlyLettersAndNumbers`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-22/src/Helpers/Strings/filters.ts#L55) no mesmo arquivo já empregam essa mesma construção sem qualquer problema.
2. **Compatibilidade de Contrato de API:**
   - *Risco:* Quebra de tipagem ou alteração de assinatura.
   - *Mitigação:* A assinatura da função `onlySymbols(value: RefString): string` é mantida integralmente idêntica. Nenhum contrato público é alterado.
3. **Comportamento com Caracteres Não-ASCII:**
   - Para entradas puramente ASCII (`abc123!@#`), o comportamento permanece 100% idêntico. Apenas caracteres acentuados que antes eram tratados incorretamente como símbolos agora são tratados corretamente como letras e descartados.
4. **Garantia de Não-Regressão:**
   - Execução de toda a suíte de testes automatizados (`npm test`) com 401 arquivos de teste e mais de 3400 testes para certificar que nenhum helper ou composable dependente foi afetado.

---

### Validação

Comandos automatizados para prova conclusiva da implementação:

1. **Validação unitária focada de filtros de string:**
   ```bash
   npm test -- src/Helpers/Strings/filters.test.ts
   ```
   *Critério de aceitação:* Todos os 24 testes executados e aprovados com 100% de sucesso.

2. **Verificação de tipos estáticos TypeScript:**
   ```bash
   npm run type-check
   ```
   *Critério de aceitação:* Compilação via `vue-tsc --noEmit` concluída com código de saída 0 e nenhum erro de tipo.

3. **Validação de linting e regras de estilo:**
   ```bash
   npm run lint
   ```
   *Critério de aceitação:* ESLint concluído com código 0 e sem avisos ou erros.

4. **Suíte completa de testes do repositório:**
   ```bash
   npm test
   ```
   *Critério de aceitação:* 401 arquivos de teste aprovados sem nenhuma falha ou regressão.

---

### Skills Aplicáveis

- `superpowers`: Condução estruturada do fluxo de engenharia, TDD Red-Green e adesão rigorosa aos critérios do portão de qualidade.
- `tdd`: Aplicação estrita da metodologia Red-Green, garantindo teste de falha prévio e validação da solução cirúrgica.
- `code-review-and-quality`: Inspeção profunda de integridade do código, não-regressão, tipagem e escopo estrito de alterações.
- `systematic-debugging-best-practices`: Rastreamento causal e isolamento de comportamento anômalo em Expressões Regulares com caracteres multibyte/Unicode.
- `production-code-audit`: Auditoria de regras de negócio, manipulação de texto em português e padronização com as melhores práticas de internacionalização.
