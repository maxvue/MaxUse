# Plano de execução das correções — auditoria 2026-08-10

46 planos em [plans/](./plans/), distribuídos em **7 etapas**. Cada etapa é uma
unidade de trabalho para um subagente, executada em worktree isolada.

| Severidade | Qtd |
|---|---|
| CRÍTICA | 9 |
| alta | 17 |
| média | 12 |
| baixa | 8 |

Baseline verificado antes de qualquer alteração (ver [BASELINE.md](./BASELINE.md)):
**392 arquivos de teste, 2739 testes, 100% verdes.** Qualquer falha após este
ponto é regressão desta rodada.

---

## Regras obrigatórias para todos os subagentes

1. **Worktree isolada** (exigência do `CLAUDE.md`):
   `git worktree add ../MaxUse-wt-<slug> -b <slug>`.
   Nunca trabalhar direto na árvore principal.

2. **TDD — teste primeiro.** Escrever o teste de regressão do plano, **ver o
   teste falhar**, e só então corrigir. Um teste que passa antes da correção não
   está testando o bug.

3. **Comando de teste:** `npx vitest run` (nunca `--reporter=basic`; esse
   reporter não existe nesta versão e faz o comando abortar).

4. **Lint:** rodar `npx eslint .` **sem** `--fix` para inspecionar. O script
   `npm run lint` inclui `--fix` e modifica arquivos.

5. **Estilo obrigatório** (`eslint.config.js`): indentação de 4 espaços, aspas
   simples, ponto e vírgula, **sem vírgula final**, `curly: multi`
   (`if (cond) return x;` em uma linha).

6. **Critério de conclusão:** a suíte inteira verde (≥ 2739 testes),
   `npm run type-check` sem erro, `npx eslint .` sem erro novo. Reportar os
   números reais obtidos — não afirmar sucesso sem a saída do comando.

7. **Não corrigir o que não está no plano.** Achados novos viram plano novo em
   `plans/`, não correção improvisada.

---

## Ordem das etapas

Etapas 1-4 são **independentes entre si** e podem rodar em paralelo.
A Etapa 5 depende da 4. As Etapas 6 e 7 são de encerramento e rodam por último.

```
Etapa 1 (segurança)     ─┐
Etapa 2 (elétrico)      ─┤
Etapa 3 (routes/IDB)    ─┼──> Etapa 6 (integração) ──> Etapa 7 (validação final)
Etapa 4 (composables)   ─┤
Etapa 5 (datas) ────────┘  (após 4)
```

---

## Etapa 1 — Segurança e integridade de dados (CRÍTICA)

**Prioridade máxima.** Vulnerabilidade explorável e corrupção de dados.

| Plano | Severidade |
|---|---|
| `objects-deepmerge-prototype-pollution` | CRÍTICA |
| `objects-deepclone-typedarray-corrompido` | alta |
| `objects-isequal-circular-stack-overflow` | alta |
| `iterables-keyby-chave-numerica-ganha-espaco` | CRÍTICA |

**Atenção — `keyBy` quebra teste existente de propósito:** `keyBy.test.ts:8`
afirma `result['1 ']`, consagrando o bug. Reescrever esse teste faz parte da
correção.

**Cuidado no teste de poluição:** rodar em processo isolado ou limpar
`Object.prototype` no `afterEach` — uma poluição bem-sucedida vaza para os
demais testes e produz falhas confusas em cascata.

---

## Etapa 2 — Módulo elétrico (CRÍTICA — segurança física)

Dimensionamento de condutores NBR 5410. Erros aqui têm consequência física.

| Plano | Severidade |
|---|---|
| `electrical-tabelas-json-desordenadas` | CRÍTICA |
| `electrical-testes-codificam-o-bug` | CRÍTICA |
| `electrical-derating-fca-fct-ignorado` | alta |
| `electrical-secao-minima-nbr-nao-garantida` | alta |
| `electrical-queda-tensao-assimetrica` | alta |
| `electrical-falha-silenciosa-tabela-invalida` | média |
| `electrical-corrente-negativa-e-nan` | média |

**Os dois primeiros são inseparáveis.** O teste atual afirma o valor corrompido
(`wireSize.test.ts:226,234`, com o comentário *"Na tabela desordenada"*), então
corrigir os dados **quebra o teste de propósito**. Executar na mesma tarefa.

**Direções de erro distintas** — não confundir ao priorizar:
- tabelas desordenadas → **superdimensionamento** (custo: 240 mm² para 20 A);
- derating ignorado e seção mínima → **subdimensionamento** (risco de incêndio).

**Higiene:** mover `cu-70-bi-falsy.json` e `cu-70-bi-mocktest.json` de
`src/json/` para diretório de fixtures — hoje são alcançáveis pelo parâmetro
público `method`.

---

## Etapa 3 — Routes / cache IndexedDB

| Plano | Severidade |
|---|---|
| `routes-idb-abort-trava-promise-para-sempre` | CRÍTICA |
| `routes-testes-idb-fracos-e-mock-incompleto` | média |
| `routes-erro-de-cache-derruba-aplicacao` | alta |
| `routes-dedupe-entrega-resposta-pre-mutacao` | alta |
| `routes-swr-descarta-dado-fresco-quando-escrita-falha` | média |
| `routes-dedupe-sem-namespace-entre-stores` | média |
| `routes-getcachedapi-sem-limpeza-nem-ttl` | baixa |

**Começar pelo mock.** O `idbMock.ts` atual não modela ciclo de vida de
transação, e por isso **é incapaz de expressar** a falha de abort. Sem estender
o mock primeiro, o bug crítico não é testável.

**Lembrete:** a config de `Routes/` são singletons de módulo — todo teste precisa
de `resetConfig()` em setup/teardown.

---

## Etapa 4 — Composables reativos

| Plano | Severidade |
|---|---|
| `composables-vazamento-de-cache-entre-chaves` | CRÍTICA |
| `composables-resposta-api-tardia-sobrescreve-fresca` | CRÍTICA |
| `composables-default-value-compartilhado-por-referencia` | alta |
| `composables-janela-de-supressao-engole-escrita` | alta |
| `composables-use-default-reset-clone-json-destrutivo` | média |
| `composables-mensagem-invalid-inalcancavel` | baixa |
| `composables-detalhes-menores` | baixa |

**Ordem interna importa:** corrigir
`composables-default-value-compartilhado-por-referencia` **antes** de
`composables-vazamento-de-cache-entre-chaves` — o segundo usa `structuredClone`
no reset, e sem o primeiro a correção reintroduz o compartilhamento de
referência.

O vazamento entre chaves é **privacidade**, não só correção: dados de um usuário
gravados sob a chave de outro.

---

## Etapa 5 — Helpers de data (depende da Etapa 4)

| Plano | Severidade |
|---|---|
| `dates-somente-data-parseadas-em-utc` | alta |
| `dates-testes-timeago-passam-contra-mutante` | média |

Oito pontos de chamada ignoram `_parseDate` e deslocam datas em um dia no fuso
`America/Sao_Paulo`. Criar também `_parseDate.test.ts` (item 4 de
`composables-detalhes-menores`), já que ele é o núcleo compartilhado da correção.

Os testes de `timeAgo` passam contra um mutante que retorna `999_999_999` —
substituir limites inferiores por igualdade exata com `vi.setSystemTime`.

---

## Etapa 6 — Validações BR, strings e infraestrutura

| Plano | Severidade |
|---|---|
| `infra-vueuse-embutido-sem-declaracao-de-dependencia` | CRÍTICA |
| `validacao-telefone-aceita-numeros-br-inexistentes` | CRÍTICA |
| `formatcurrency-interpreta-milhar-ptbr-como-decimal` | alta |
| `formatbytes-corrompe-string-ptbr-e-notacao-cientifica` | alta |
| `validacao-cartao-rejeita-hipercard` | alta |
| `strings-random-nonumber-invertido` | alta |
| `browser-istouchdevice-sem-guarda-ssr` | alta |
| `infra-invariante-exports-underscore-quebrada` | média |
| `mascaras-cep-cpf-cnpj-divergem-de-validacao` | média |
| `mascaras-testes-triviais-cpf-cnpj` | média |
| `mascaras-formatphone-aceita-ddd-inexistente` | média |
| `iterables-chunk-nao-trunca-size-fracionario` | média |
| `iterables-orderby-nao-resolve-deep-path` | alta |
| `seq-wrapper-sem-metodos-encadeaveis` | alta |
| `infra-arquivos-sortby-duplicados-e-orfaos` | baixa |
| `strings-truncate-quebra-par-substituto` | baixa |
| `strings-slugify-hifens-nas-bordas` | baixa |
| `iterables-orderby-desc-nulos-no-fim` | baixa |
| `functions-memoize-cache-e-curry-arity` | baixa |

**Decidir em conjunto** `formatcurrency` + `formatbytes`: ambos dependem da
desambiguação de separador pt-BR. Recomendação dos planos: criar um
`parseBrNumber` explícito usado pelos dois, preservando o `toNumber` genérico
para não quebrar outros consumidores.

**Duas decisões de produto** (não são puramente técnicas — se houver dúvida,
perguntar antes de implementar):
- `phone()`: migrar para `libphonenumber-js/max` corrige a regra do 9º dígito,
  mas aumenta o bundle. É a única variante que enforça a regra.
- `seq-wrapper`: implementar encadeamento completo **ou** corrigir a
  documentação que hoje promete fidelidade ao Lodash. Ambas são saídas
  legítimas; o estado atual (promessa + `TypeError`) não é.
- `infra-invariante-exports`: definir qual lado é fonte de verdade para os 46
  nomes do VueUse — superfície completa ou allowlist curada.

---

## Etapa 7 — Validação final e documentação

Sem alteração de código-fonte. Executar depois de todas as demais.

1. Suíte completa: `npx vitest run` — registrar os números **reais**.
2. `npm run type-check` — zero erro.
3. `npx eslint .` (sem `--fix`) — zero erro novo.
4. `npm run build` — e confirmar que `dist/dist-*.js` (o bundle do VueUse
   embutido) **desapareceu**, provando a correção da Etapa 6.
5. Atualizar `lodash_migrate/DIVERGENCES.md`: a seção "Diferenças conhecidas"
   está declaradamente incompleta (só `deburr` e `template`). Documentar as
   divergências confirmadas nesta auditoria — `orderBy` com nulos em `desc`,
   `sum` com strings, e as APIs baseadas em `key` (`filter`, `countBy`,
   `sumBy`, `groupBy`, `size`, `shuffle`, `findLast`).
6. Escrever `RESULTADO.md` **apenas com dados verificados por execução**.

> Ver na raiz o `RESULTADO.md` da rodada anterior e seus commits de correção
> (`52628d67`, `2e3fe0dd` — "corrige dados nao verificaveis"). Relatório com
> número não medido gera retrabalho: registrar somente o que veio da saída real
> dos comandos.

---

## Achados fora de escopo (registrados, não corrigidos)

Verificados como **limpos** — não geraram plano:

- Paridade Lodash em `Iterables`: NaN/SameValueZero, `-0`/`+0`, as seis formas
  de iteratee shorthand, semântica de mutação, agregados sobre coleção vazia,
  família `sortedIndex`, `zip`/`unzip`, estabilidade de ordenação.
- Prototype pollution em `set`/`setWith`/`update`/`merge`/`mergeWith`/
  `defaultsDeep`/`zipObjectDeep`/`_baseSet`/`_baseMerge` — todos protegidos.
- `Math` inteiro, incluindo o caso notório `round(1.005, 2) === 1.01`.
- `debounce`/`throttle` — paridade completa (`maxWait`, `cancel`, `flush`).
- ReDoS em `Strings` — sem backtracking catastrófico; crescimento linear até
  50 mil caracteres.
- `isEmail`, `isValid`, `documents` (CPF/CNPJ, incluindo CNPJ alfanumérico).
- Subpath exports, tree-shaking, `sideEffects: false`, `autoImportData.json`
  em sincronia, ausência de `*.test.d.ts` no `dist`.
- `escape`/`unescape`, `words`, `pad*`, `addTime`, `watchTrue`, `differences`,
  `isDate`.

Os 45 nomes de divergência intencional documentados em
`lodash_migrate/DIVERGENCES.md` foram respeitados: divergência já documentada
não virou plano.
