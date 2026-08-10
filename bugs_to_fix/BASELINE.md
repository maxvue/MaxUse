# Baseline verificado — auditoria de 2026-08-10

Estado real do repositório no início desta auditoria, medido por execução direta
(não estimado). Branch: `dev`, HEAD: `e84db171`.

## Suíte de testes

Comando: `npx vitest run`

```
Test Files  392 passed (392)
     Tests  2739 passed (2739)
  Duration  11.42s
```

Suíte 100% verde antes de qualquer alteração desta rodada. Portanto **qualquer
falha de teste observada depois daqui é regressão introduzida por esta
auditoria**, não um problema pré-existente.

## Contexto histórico relevante

Esta é a **segunda** rodada de auditoria do repositório.

- Uma rodada anterior produziu 90 planos em `bugs_to_fix/plans/`, todos
  reportadamente implementados (Lanes 1–8), documentados em `RESULTADO.md`
  (hoje na raiz do repositório).
- O commit `e84db171` (mensagem: `.`) **apagou** todo o diretório
  `bugs_to_fix/`, incluindo os 90 planos, o `execute_fixes.md` e o
  `RESULTADO.md` original.
- Por decisão do usuário, esta rodada **começa do zero**: nenhum plano antigo
  foi restaurado. O conteúdo de `bugs_to_fix/` reflete somente achados desta
  auditoria.

Consequência metodológica: as falhas óbvias já foram corrigidas na primeira
rodada. Achados desta rodada tendem a ser mais sutis, e o critério de evidência
foi elevado — todo achado precisa de reprodução empírica com comando e saída
reais.

## Divergências intencionais em relação ao Lodash

`lodash_migrate/DIVERGENCES.md` documenta **45 nomes** em que a MaxUse diverge
do Lodash **por decisão de design** (ordem de precedência no objeto `_`:
helpers próprios > VueUse > Lodash).

Esses nomes **não são bugs** e não geraram planos de correção nesta auditoria:

`camelCase`, `capitalize`, `chunk`, `clamp`, `cloneDeep`, `countBy`, `filter`,
`findLast`, `first`, `get`, `groupBy`, `identity`, `invoke`, `isArray`,
`isDate`, `isEmpty`, `isEqual`, `isNil`, `isNumber`, `isObject`, `kebabCase`,
`keyBy`, `last`, `mapValues`, `negate`, `noop`, `now`, `omit`, `orderBy`,
`pick`, `sample`, `set`, `shuffle`, `size`, `snakeCase`, `sortBy`, `stubTrue`,
`sum`, `sumBy`, `tap`, `toArray`, `toNumber`, `truncate`, `uniq`, `unset`.

Ressalva: a seção "Diferenças conhecidas" desse arquivo está explicitamente
incompleta ("Preencher conforme cada divergência for confirmada"). Só `deburr`
e `template` estão detalhados. Divergência **real mas não documentada** em um
desses 45 nomes continua sendo achado válido — classificada como lacuna de
documentação, não como bug de implementação.

## Critério de evidência desta rodada

Todo achado registrado em `plans/` precisou de:

1. Leitura do código-fonte real e do teste colocado correspondente.
2. Reprodução empírica: comando executado + saída real capturada.
3. Descarte se não reproduzível. Suspeita sem prova não virou plano.

Para achados do tipo "teste fraco", a prova exigida foi descrever uma
implementação quebrada que ainda assim passa no teste existente.
