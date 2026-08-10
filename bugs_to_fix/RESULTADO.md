# Resultado da auditoria — rodada de 2026-08-10

Execução das **7 etapas** do [execute_fixes.md](./execute_fixes.md), cobrindo os
**46 planos** de [plans/](./plans/).

Todo número abaixo foi obtido por execução real de comando na árvore integrada,
não estimado. Onde não houve medição, está escrito que não houve.

---

## 1. Números finais

| Métrica | Baseline | Final | Δ |
|---|---|---|---|
| Arquivos de teste | 392 | **396** | +4 |
| Testes | 2739 | **2819** | **+80** |
| Erros de tipo | 0 | **0** | — |
| Erros de lint | 0 | **0** | — |
| Avisos de lint | 4 | 7 | +3 |

Comandos, na árvore final (`dev`):

```
$ npx vitest run
 Test Files  396 passed (396)
      Tests  2819 passed (2819)

$ npm run type-check     → exit 0, nenhuma saída de erro
$ npx eslint .           → ✖ 7 problems (0 errors, 7 warnings)
$ npm run build          → ✓ built in 4.06s
```

Os 3 avisos novos são parâmetros `_a/_b/_c` em `curry.test.ts`: precisam existir
para a função ter `length === 3` (é exatamente o que o teste verifica) e o
prefixo `_` já sinaliza a intenção. Os outros 4 são pré-existentes.

## 2. Progressão medida por etapa

Cada marco foi medido após a integração da respectiva etapa em `dev`:

| Marco | Testes |
|---|---|
| Baseline (antes de tudo) | 2739 |
| Etapa 3 — Routes | 2745 |
| Etapa 4 — Composables | 2760 |
| Etapas 1 + 2 — Segurança e Elétrico | 2774 |
| Etapa 6 — Validações/Strings/Infra | 2809 |
| Etapa 5 — Datas | **2819** |

Nenhuma etapa reduziu a contagem, e nenhuma regressão foi introduzida.

## 3. Commits

| Hash | Escopo |
|---|---|
| `0aeaf318` + `4423be47` | Etapa 3 — Routes e cache IndexedDB/LocalStorage |
| `511993d7` | Etapa 4 — Composables reativos |
| `11e99127` | Etapa 1 — prototype pollution, keyBy, cloneDeep, isEqual |
| `e9b624dc` | Etapa 2 — tabelas NBR 5410 e validações de wireSize |
| `2167ed71` | Etapa 6 — validações BR, strings, Seq e infraestrutura |
| `2ba9cd59` | Etapa 5 — `_parseDate` nos helpers de data e testes de timeAgo |

Mais 4 commits de merge. Branches de backup preservadas:
`dev-antes-merge-etapas-1-2`, `dev-antes-etapa6`, `dev-antes-etapa5`.

## 4. Verificação funcional dos defeitos críticos

Executado na árvore final, após todos os merges. Não é leitura de código — é o
comportamento medido:

```
OK  pollution           deepMerge não contamina mais Object.prototype
OK  keyBy               keys = ["1"], e result[1] é acessível
OK  isEqual ciclo       retorna true em vez de RangeError
OK  cloneDeep TypedArr  [object Uint8Array], não [object Object]
OK  wireSize 20A B1     2.5 mm² (era 240 mm²)
OK  phone 10-dig        false (celular sem o 9º dígito é rejeitado)
OK  formatCurrency      'R$ 1.234,00' (era 'R$ 1,23' — erro de 1000x)
OK  isPast epoch 0      true (epoch 0 deixou de ser tratado como vazio)
```

Verificações de empacotamento:

```
dist/dist-*.js      ausente   → @vueuse/core deixou de ser embutido (344 KB)
dist/*.test.d.ts    ausente   → nenhuma declaração de teste vazando
```

## 5. Correção de maior impacto

**As 16 tabelas NBR 5410 desordenadas.** `wireSize` usa
`dados.find(c => c.max_current >= corrente)`, que exige ordem crescente — e 16
dos 70 arquivos JSON não a satisfaziam.

Efeito prático: um circuito de 20 A no método B1, o padrão residencial
brasileiro, era dimensionado como **240 mm² em vez de 2,5 mm²** — erro de custo
de material da ordem de 100×. Em outras tabelas a desordem podia selecionar
seção **subdimensionada**, com risco de aquecimento.

A correção ordena no carregamento, e não apenas nos arquivos, de modo a
sobreviver a uma futura regeneração das tabelas. Um teste-guarda passou a
verificar a ordenação de todos os arquivos.

## 6. Duas lições sobre os testes

Dois defeitos sobreviveram à rodada anterior porque **os testes os consagravam
como comportamento esperado**:

- `wireSize.test.ts:226` — comentário literal *"Na tabela desordenada, o item
  encontrado é wire 240"*, afirmando o valor corrompido;
- `keyBy.test.ts:8` — afirmava `result['1 ']`, com o espaço que tornava o
  objeto inacessível.

Corrigir o código exigiu reescrever esses testes. Um teste que documenta um bug
em vez de detectá-lo é pior que a ausência de teste: dá falsa confiança e
transforma a correção em aparente regressão.

Terceiro caso, de natureza distinta: `timeAgo.test.ts` usava apenas
`toBeGreaterThanOrEqual`, e um mutante devolvendo `999_999_999` passava em todas
as asserções. Hoje são **25 asserções de igualdade exata e zero frouxas**.

## 7. O que não foi medido

Registro explícito para não induzir a erro:

- **Cobertura (`npm run test:coverage`)** não foi executada nesta rodada. Não há
  número de cobertura a reportar.
- **Não houve publicação no npm.** A correção do `@vueuse/core` altera o pacote
  entregue ao consumidor (peer dependency nova) e deve entrar em uma versão
  *minor*, não *patch* — decisão pendente do mantenedor.
- **`wireSize.test.ts` ficou com cobertura parcial.** O plano
  `electrical-testes-codificam-o-bug` pedia asserções exatas na matriz completa
  (9 métodos × 2 materiais × 2 temperaturas). Restam 30 asserções de forma
  (`toBeGreaterThan(0)`, `not.toBeNull()`) contra 3 de bitola exata. O caso
  decisivo (20 A em B1) está coberto com valor exato, e o teste-guarda de
  ordenação fecha a causa raiz — mas a varredura completa não foi feita.

## 8. Observação sobre o teste-guarda de `dist`

`src/infraVueuseExternal.test.ts` lê o diretório `dist/` para confirmar que
nenhuma dependência foi embutida. Ele **depende de um build recente**: logo após
o merge da Etapa 6 acusou falha por ler um `dist/` de horas antes, anterior à
correção. Após `npm run build`, passou.

Em CI, esse teste precisa rodar **depois** do build, ou produzirá falso
positivo.
