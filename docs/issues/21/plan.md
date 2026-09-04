# Plano de Implementação — Issue #21

> **Problema:** [Audit] renameKeys lanca TypeError com entrada nula/indefinida em object ou map  
> **Status da Verificação:** Confirmado / Reproduzível  
> **Arquivo Alvo:** [src/Helpers/Objects/renameKeys.ts:L12-L27](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.ts#L12-L27)  

---

### Descrição e Causa Raiz

#### Problema Relatado e Agravantes
A função [`renameKeys`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.ts#L12-L27), exportada como função utilitária autônoma e como membro do namespace [`Obj`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/index.ts#L58-L72), altera os nomes das chaves de um objeto usando um mapa de correspondência de/para (`{ [chaveAntiga]: chaveNova }`).

Entretanto, a implementação original falha ao não tratar valores `null` ou `undefined` em nenhum de seus dois parâmetros (`object` e `map`), divergindo frontalmente da convenção de tolerância e resiliência adotada por todas as demais funções utilitárias da categoria `Objects` ([`mapKeys`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/mapKeys.ts), [`mapValues`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/mapValues.ts), [`pick`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/manipulations.ts#L9-L21), [`omit`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/manipulations.ts#L29-L41), [`keys`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/keys.ts), [`assign`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/assign.ts), etc.):

1. **Falha quando `object` é `null` ou `undefined` (`TypeError: Cannot convert undefined or null to object`):**  
   A função desempacota o parâmetro reativo através de `const rawObject = toValue(object)` e imediatamente invoca `Object.keys(rawObject)` na linha 21. De acordo com a especificação ECMAScript, invocar `Object.keys` sobre `null` ou `undefined` dispara incondicionalmente uma exceção `TypeError`.
2. **Falha quando `map` é `null` ou `undefined` (`TypeError: Cannot read properties of null` / `undefined`):**  
   A função desempacota o mapa através de `const rawMap = toValue(map)` e acessa diretamente `rawMap[key]` na linha 22 dentro do laço `forEach`. Caso `map` seja nulo ou indefinido, qualquer indexação provoca um erro fatal de execução.
3. **Agravante no Ecossistema Reativo Vue:**  
   Em aplicações Vue.js que consomem `@maxvue/max-use`, é padrão injetar `Ref`s ou getters reativos em helpers de transformação de dados (por exemplo, `const payload = ref<Record<string, any> | null>(null)` aguardando um fetch assíncrono de API). Ao montar componentes com dados ainda pendentes de carregamento (estado de loading), `renameKeys` quebra a aplicação imediatamente, inviabilizando o tratamento gracioso do fluxo de renderização.
4. **Agravante de Tipagem TypeScript:**  
   A assinatura original (`object: MaybeRefOrGetter<Record<string, any>>`, `map: MaybeRefOrGetter<Record<string, string>>`) rejeita `null` e `undefined` sob `strictNullChecks`, forçando os desenvolvedores a utilizar cast inseguro (`as any`) ou asserções não nulas (`!`), que mascaram o erro estático até que ele estoure em runtime.

#### Causa Raiz Comprovada
- **Localização Exata:** [src/Helpers/Objects/renameKeys.ts:L12-L27](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.ts#L12-L27)
```ts
12: export function renameKeys(
13:     object: MaybeRefOrGetter<Record<string, any>>,
14:     map: MaybeRefOrGetter<Record<string, string>>
15: ): Record<string, any> {
16:     const rawObject = toValue(object);
17:     const rawMap = toValue(map);
18: 
19:     const renamedObject: Record<string, any> = {};
20: 
21:     Object.keys(rawObject).forEach((key) => {
22:         const newKey = rawMap[key] || key;
23:         baseAssignValue(renamedObject, newKey, rawObject[key]);
24:     });
25: 
26:     return renamedObject;
27: }
```

- **Fluxo Causal:**
  1. A função recebe o argumento `object` (direto, via `Ref` ou via Getter) que resolve para `null` ou `undefined`.
  2. `toValue(object)` retorna `null` ou `undefined`.
  3. A linha 21 executa `Object.keys(rawObject)` sem salvaguarda defensiva prévia, disparando `TypeError: Cannot convert undefined or null to object`.
  4. Similarmente, se `object` for válido mas `map` resolver para `null` ou `undefined`, a linha 22 executa `rawMap[key]`, disparando `TypeError: Cannot read properties of null (reading '...')`.

- **Rastreamento Reverso de Dados:**
  ```
  UI / Componente Vue (template / script setup consumindo chaves renomeadas de um registro)
      ↕
  Store / Composable Reativo (ex.: Pinia store com ref<Record<string, any> | null>(null) durante fetch assíncrono)
      ↕
  Exportação Barrel (src/index.ts ⇄ src/Helpers/Objects/index.ts)
      ↕
  Helper renameKeys (src/Helpers/Objects/renameKeys.ts:L12-L27)
      ↕
  Resolução Reativa via toValue(object) e toValue(map)
      ↕
  Tentativa de Object.keys(null) na L21 ou rawMap[key] na L22 -> Disparo de TypeError fatal
      ↕
  API / Backend HTTP (Resposta assíncrona ainda pendente ou payload nulo)
  ```

---

### Arquivos afetados

1. [src/Helpers/Objects/renameKeys.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.ts):
   - Atualização da assinatura de tipos para aceitar `null | undefined` em `object` e `map`, e tornar `map` opcional (`map?: ...`).
   - Inclusão de guarda defensiva: `if (rawObject == null || typeof rawObject !== 'object') return {};` (respeitando estritamente a regra do ESLint `curly: multi` sem chaves desnecessárias).
   - Normalização segura do mapa com fallback: `const safeMap = rawMap ?? {};`.
2. [src/Helpers/Objects/renameKeys.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.test.ts):
   - Inclusão de suíte completa de testes unitários cobrindo: `null`, `undefined`, `ref(null)`, `ref(undefined)`, getters nulos, `map` omitido, `map` nulo/indefinido, ambos os parâmetros nulos e valores primitivos não-objeto.
3. [docs/issues/21/plan.md](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/docs/issues/21/plan.md):
   - Documentação estruturada do plano de implementação da issue #21.

> [!IMPORTANT]
> **Controle Estrito de Escopo:** Nenhum outro arquivo, link simbólico (`node_modules`, `.claude/`, `.opencode/`), ou dependência deve ser modificado, criado ou adicionado ao Git. Ao realizar o commit, deve-se versionar única e exclusivamente os arquivos listados acima (`git add src/Helpers/Objects/renameKeys.ts src/Helpers/Objects/renameKeys.test.ts docs/issues/21/plan.md`).

---

### Execuções propostas

1. **Passo 1: Escrever os Testes Unitários de Falha (Fase Red do TDD)**
   - No arquivo [src/Helpers/Objects/renameKeys.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.test.ts), adicionar os casos de teste para os cenários relatados:
     - `object` direto como `null` ou `undefined`.
     - `object` reativo (`ref` ou getter) retornando `null` ou `undefined`.
     - `map` direto como `null` ou `undefined`.
     - `map` reativo (`ref` ou getter) retornando `null` ou `undefined`.
     - `map` omitido na chamada (`renameKeys(obj)`).
     - Ambos os parâmetros `null` ou `undefined`.
     - `object` com valores primitivos não-objeto (`number`, `string`, `boolean`).

2. **Passo 2: Implementar a Correção Cirúrgica em renameKeys.ts (Fase Green do TDD)**
   - No arquivo [src/Helpers/Objects/renameKeys.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.ts):
     - Atualizar a assinatura da função para aceitar `null | undefined` e tornar `map` opcional:
       ```ts
       export function renameKeys(
           object: MaybeRefOrGetter<Record<string, any> | null | undefined>,
           map?: MaybeRefOrGetter<Record<string, string> | null | undefined>
       ): Record<string, any>
       ```
     - Desempacotar reatividade e inserir guarda defensiva formatada segundo o padrão ESLint (`curly: multi`):
       ```ts
       const rawObject = toValue(object);
       const rawMap = toValue(map);

       if (rawObject == null || typeof rawObject !== 'object')
           return {};

       const renamedObject: Record<string, any> = {};
       const safeMap = rawMap ?? {};

       Object.keys(rawObject).forEach((key) => {
           const newKey = safeMap[key] || key;
           baseAssignValue(renamedObject, newKey, rawObject[key]);
       });

       return renamedObject;
       ```

3. **Passo 3: Validação de Lint e Estilo (Portão de Qualidade 3)**
   - Executar o linter oficial do projeto para certificar conformidade estrita com as regras do ESLint:
     ```bash
     npx eslint src/Helpers/Objects/renameKeys.ts
     ```

4. **Passo 4: Validação de Tipagem TypeScript e Testes**
   - Executar a checagem estática de tipos e a suíte completa de testes para garantir não-regressão:
     ```bash
     npm test -- src/Helpers/Objects/renameKeys.test.ts
     npm run type-check
     npm test
     ```

---

### Especificação de Teste TDD (Red-Green)

#### Teste de Falha (Red)
Inserir no arquivo [src/Helpers/Objects/renameKeys.test.ts](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/renameKeys.test.ts):
```ts
it('retorna objeto vazio quando object é null ou undefined', () => {
    expect(renameKeys(null, { a: 'b' })).toEqual({});
    expect(renameKeys(undefined, { a: 'b' })).toEqual({});
});

it('retorna objeto vazio quando object é Ref ou Getter com null ou undefined', () => {
    const nullRef = ref<Record<string, any> | null>(null);
    const undefinedRef = ref<Record<string, any> | undefined>(undefined);
    expect(renameKeys(nullRef, { a: 'b' })).toEqual({});
    expect(renameKeys(undefinedRef, { a: 'b' })).toEqual({});
    expect(renameKeys(() => null, { a: 'b' })).toEqual({});
    expect(renameKeys(() => undefined, { a: 'b' })).toEqual({});
});

it('mantém chaves originais quando map é null ou undefined', () => {
    const obj = { a: 1, b: 2 };
    expect(renameKeys(obj, null)).toEqual({ a: 1, b: 2 });
    expect(renameKeys(obj, undefined)).toEqual({ a: 1, b: 2 });
    expect(renameKeys(obj)).toEqual({ a: 1, b: 2 });
});

it('mantém chaves originais quando map é Ref ou Getter com null ou undefined', () => {
    const obj = { a: 1, b: 2 };
    const nullMapRef = ref<Record<string, string> | null>(null);
    expect(renameKeys(obj, nullMapRef)).toEqual({ a: 1, b: 2 });
    expect(renameKeys(obj, () => null)).toEqual({ a: 1, b: 2 });
});

it('lida com ambos os parâmetros null ou undefined', () => {
    expect(renameKeys(null, null)).toEqual({});
    expect(renameKeys(undefined, undefined)).toEqual({});
});

it('retorna objeto vazio quando object é um valor primitivo', () => {
    expect(renameKeys(123 as any, {})).toEqual({});
    expect(renameKeys('string' as any, {})).toEqual({});
    expect(renameKeys(true as any, {})).toEqual({});
});
```

- **Comportamento na fase Red:**
  Antes da modificação, os testes falham com:
  - `TypeError: Cannot convert undefined or null to object` quando `object` resolve para `null` ou `undefined`.
  - `TypeError: Cannot read properties of null (reading 'a')` quando `map` é `null`.

#### Validação de Sucesso (Green)
- Após a correção cirúrgica em `renameKeys.ts`, todos os 12 testes unitários passam com 100% de sucesso.

---

### Banco de dados

Nenhuma (biblioteca utilitária client-side em Vue/TypeScript, sem camada de persistência ou migrations).

---

### Riscos de quebra e Não-Regressão

- **Compatibilidade Retroativa:** Total. A chamada com objetos e mapas válidos preserva exatamente o mesmo comportamento e valor retornado. A proteção contra poluição de protótipo (`__proto__`) implementada via [`_baseAssignValue`](file:///home/johnattas/GitHub/MaxUse/.max-code-worktrees/wt-implement-issue-21/src/Helpers/Objects/_baseAssignValue.ts#L13-L16) permanece intocada.
- **Contrato de Tipagem TypeScript:** A expansão de tipo para `MaybeRefOrGetter<Record<string, any> | null | undefined>` e `map?: MaybeRefOrGetter<Record<string, string> | null | undefined>` é totalmente retrocompatível e elimina erros falsos de compilação em código consumidor com `strictNullChecks: true`.
- **Risco de Ambiente e Portabilidade:** O escopo de execução restringe-se estritamente aos arquivos TypeScript do utilitário e seus testes. É terminantemente proibido criar symlinks absolutos ou versionar `node_modules`.
- **Garantia de Não-Regressão:** Execução da suíte completa de testes com mais de 3400 testes unitários em todos os módulos da biblioteca.

---

### Validação

Comandos automatizados para prova conclusiva da correção:
1. **Validação unitária focada do helper e novos testes de regressão:**
   ```bash
   npm test -- src/Helpers/Objects/renameKeys.test.ts
   ```
2. **Conformidade de estilo de código (ESLint `curly: multi`):**
   ```bash
   npx eslint src/Helpers/Objects/renameKeys.ts
   ```
3. **Checagem estática rigorosa de tipos TypeScript:**
   ```bash
   npm run type-check
   ```
4. **Execução completa da suíte de testes de não-regressão:**
   ```bash
   npm test
   ```

---

### Skills Aplicáveis

- `superpowers`: Engenharia agentic com planejamento arquitetural estruturado, TDD Red-Green e critérios rigorosos de aceitação.
- `code-review-and-quality`: Análise multi-eixo de qualidade de código, respeito às convenções de linter/estilo e portabilidade de ambiente.
- `agent-orchestrator`: Alinhamento do ciclo de planejamento e execução dentro do ecossistema de worktrees e agentes.
