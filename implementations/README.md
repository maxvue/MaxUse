# Achados da Auditoria — `@maxvue/max-use`

Auditoria realizada em **07/08/2026** sobre a branch `dev`, versão `1.1.47`.

Foram levantados **28 achados**. **22 foram resolvidos** e seus arquivos removidos
desta pasta — o registro permanente está no histórico do git (commits
`fix: corrige 18 achados...`, `fix(composables): preserva reatividade...` e
`refactor(routes): extrai camada de cache IndexedDB...`). Um deles, o 019, foi
resolvido indiretamente pela migração do Lodash — ver Destaques.

Os **6 arquivos restantes** são os achados **ainda abertos**: nenhum é um bug de
runtime simples — todos exigem uma decisão de produto ou arquitetura antes de
implementar, porque mudam comportamento observável de quem já consome a
biblioteca.

**Estado atual da suíte:** 373 arquivos, **2567 testes**, todos passando.
`vue-tsc` sem erros. Build ok. 15/15 subpath exports resolvem.

---

## Achados em aberto

| # | Achado | Área | Por que exige decisão |
|---|--------|------|------------------------|
| [002](./002-isEmpty-zero-e-false-nunca-vazios.md) | `isEmpty(0)`/`isEmpty(false)` retornam `false`, conflitando com `isBlank` | Validations | Alinhar as duas famílias muda o resultado de validações já em produção |
| [003](./003-size-retorna-o-proprio-numero.md) | `size(n)` retorna o próprio número, permitindo tamanho negativo | Iterables | Separar as responsabilidades quebra a API pública (major) |
| [007](./007-contratos-retorno-inconsistentes-rotas.md) | Contratos de retorno inconsistentes entre helpers de rota (`false` vs `null` vs exceção) | Routes | O contrato discriminado proposto é breaking change |
| [016](./016-orderBy-muta-objeto-de-entrada.md) | `orderBy`: perda de chaves em Record e divergência do Lodash | Iterables | Depende de definir se a lib segue ou não a semântica do Lodash |
| [018](./018-useDateFormat-fallback-mascara-erro.md) ⚠️ | `useDateFormat`/`timeAgo`: fallback para "hoje" mascara dado ausente | Composables | **Parcial** — a quebra de reatividade foi corrigida; mudar o fallback altera o que já é exibido em telas existentes |
| [027](./027-config-global-singleton-sem-isolamento.md) | Config global em singletons: vazamento entre requisições em SSR | Routes | A API de instância proposta é major |

### Destaques

**[018](./018-useDateFormat-fallback-mascara-erro.md)** é o de maior risco silencioso: uma data nula vira a data atual, então
"nunca acessou" é exibido como "acessou agora" — indistinguível de dado real.
Essa parte segue aberta por depender de decisão de produto.

O sub-problema que **não** dependia dessa decisão **já foi corrigido**: quando o
valor inicial era nulo, a reatividade quebrava permanentemente (o fallback
passava um `Date` estático em vez do getter original), atingindo todo componente
que carrega data via API. O fallback passou a ser resolvido dentro de um getter,
preservando a reatividade sem alterar o valor exibido.

**[019] foi resolvido na raiz, sem decisão de produto necessária.** A migração
do Lodash (branch `lodash-migrate`, mergeada na `dev`) removeu por completo a
dependência `lodash-es`. O objeto `_` passou a ser apenas `ownHelpers` + VueUse
filtrado, e a precedência que o `CLAUDE.md` sempre documentou passou a valer de
fato — `_.size(5)` e `size(5)` agora concordam.

---

## O que foi corrigido (referência)

Removidos desta pasta, agrupados por causa raiz:

**Rotas HTTP** — `apiGetRoute` sem guarda para `apiRoute()` null (TypeError duplo,
o segundo dentro do próprio `catch`); `apiUploadRoute` quebrando com o `files`
default e sem `try/catch`; `getCachedApi`/`getCachedApiIDB` ignorando
`setApiRequestConfig`; mutação global de `axios.defaults.withCredentials`.

**Composables** — `JSON.parse` sem proteção derrubando o setup do componente;
rejeição não tratada na sincronização; acesso a `window`/`localStorage` sem
guarda (SSR); traduções pt-BR emitindo `"2 years"` e `"3hs"`.

**Helpers** — `average`/`median` lançando com `null`; `formatBytes` retornando
`"NaN undefined"` para negativos e lendo `"1,5"` como `15`; `toNumber`
convertendo `"1.234,56"` em `0`; `maskSensitive` vazando cartões curtos e
strings sem `@`; `isEmail` aceitando `a@b..com`; `diffInYears` contando 1 dia
como 1 ano; type-guard invertido em `isEmpty`.

**Empacotamento e docs** — 2 dos 15 subpath exports apontando para arquivos que o
build nunca emite; `localforage` declarada mas nunca importada; `CLAUDE.md`
descrevendo precedência e implementação inexistentes; `coverage/` (112 arquivos)
versionada.

**Clonagem** — `deepClone` (exportado também como `cloneDeep`) descartava o
protótipo de instâncias de classe, devolvendo objetos literais sem métodos e sem
`instanceof`. Corrigido via `Object.create(Object.getPrototypeOf(...))`, alinhando
o comportamento ao `_baseClone` que a migração do Lodash já havia trazido — as
duas implementações de clone da biblioteca agora concordam.

**Refactor interno** — as ~105 linhas de IndexedDB duplicadas entre
`getCachedApiIDB` e `postCachedApiIDB` foram extraídas para
`src/Routes/internal/idbCache.ts` (355 → 273 linhas). Essa duplicação era a causa
raiz de um bug real: a config global chegou a ser aplicada em um dos arquivos e
não no outro. A API pública (`deleteFromIDB`, `clearCacheIDB`) foi preservada por
reexportação.

---

## Nota sobre a suíte de testes

A auditoria original correu sobre 950 testes **todos passando** — nenhum detectava
os 28 achados. As lacunas observadas, e o que foi feito:

- **Type-guards não eram testados.** Adicionados testes com `expectTypeOf`;
  confirmado que falham quando o defeito é reintroduzido.
- **Casos de borda ausentes** (`null`, negativos, strings malformadas): cobertos.
- **Testes que fixavam o defeito como esperado** — havia um chamado
  `years → "X years"` e outro exigindo que `maskSensitive('noatsign', 'email')`
  retornasse o valor **em claro**. Foram atualizados para o comportamento correto.
- **SSR/Node nunca exercitados** (ambiente sempre `happy-dom`): as guardas foram
  adicionadas, mas continua sem teste em ambiente `node` — lacuna conhecida.

Cada arquivo restante inclui a seção "Testes de regressão sugeridos" com casos
concretos que falhariam hoje.
