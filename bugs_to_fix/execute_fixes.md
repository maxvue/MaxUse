# Plano de Execução das Correções (com subagentes)

Auditoria de 2026-08-10. **90 achados** em `bugs_to_fix/plans/` (baseline verde: 377 arquivos de teste, 2607 testes passando).

## Regras gerais (valem para TODAS as etapas)

1. **Worktree obrigatório** (regra do CLAUDE.md): cada subagente que altera código roda em worktree próprio — `git worktree add ../MaxUse-wt-<slug> -b fix/<slug>` — nunca na árvore principal. Validar no worktree, depois integrar em `dev`.
2. **TDD**: para cada achado, escrever primeiro o teste que reproduz o bug (deve falhar), depois a correção (teste passa). Achados tipo `teste-faltante` são só testes.
3. **Gate de qualidade por subagente**: antes de declarar concluído, rodar `npx vitest run <arquivos afetados>`, depois `npm test` completo, `npm run type-check` e `npm run lint`. Nada é integrado com suíte vermelha.
4. **Convenções**: ESLint do projeto (4 espaços, aspas simples, `;`, sem trailing comma, `curly: multi`), comentários/JSDoc em pt-BR, `MaybeRefOrGetter` + `toValue()` para args reativos, composables testados em `effectScope()`.
5. **Ordem de integração**: mergear na ordem das etapas; dentro da etapa, lanes são independentes (arquivos disjuntos) e podem mergear em qualquer ordem. Rodar `npm test` no `dev` após cada merge.
6. Cada subagente recebe: o(s) arquivo(s) de plano da sua lane + estas regras. Se durante a execução o plano se mostrar incorreto (linha mudou, premissa errada), o subagente reporta em vez de improvisar.

## Etapa 1 — Segurança (prioridade máxima) [CONCLUÍDA]

Lanes paralelas (arquivos disjuntos):

- **Lane 1A — prototype pollution em merge**: [lodash-pp-merge-sem-guarda-proto](plans/lodash-pp-merge-sem-guarda-proto.md) — *Guardas e testes já integrados previamente.*
- **Lane 1B — get/set/unset delegando aos internos**: [lodash-pp-set-publico-sem-guarda](plans/lodash-pp-set-publico-sem-guarda.md), [lodash-set-nao-cria-array](plans/lodash-set-nao-cria-array.md), [lodash-get-nao-trata-chave-literal](plans/lodash-get-nao-trata-chave-literal.md), [lodash-unset-path-simplista](plans/lodash-unset-path-simplista.md), [lodash-any-injustificado-objects-publicos](plans/lodash-any-injustificado-objects-publicos.md) — *Delegação a## Etapa 2 — Bugs de severidade alta

Lanes paralelas:

- **Lane 2A — Validations BR**: [helpers-cpf-cnpj-lanca-excecao-null-number](plans/helpers-cpf-cnpj-lanca-excecao-null-number.md), [helpers-cep-lanca-excecao-para-number](plans/helpers-cep-lanca-excecao-para-number.md), [helpers-credit-card-nao-valida-luhn](plans/helpers-credit-card-nao-valida-luhn.md) + testes [helpers-teste-faltante-documents-edge-cases](plans/helpers-teste-faltante-documents-edge-cases.md), [helpers-teste-faltante-luhn-invalido](plans/helpers-teste-faltante-luhn-invalido.md), [helpers-teste-faltante-cep-number-e-9-digitos](plans/helpers-teste-faltante-cep-number-e-9-digitos.md), [helpers-teste-faltante-phone-ddd-e-celular-sem-9](plans/helpers-teste-faltante-phone-ddd-e-celular-sem-9.md) — *Concluída em f306442c (2628 testes)*
- **Lane 2B — Datas/timezone**: [helpers-is-weekend-timezone-date-only](plans/helpers-is-weekend-timezone-date-only.md), [helpers-is-same-day-datas-invalidas-consideradas-iguais](plans/helpers-is-same-day-datas-invalidas-consideradas-iguais.md), [helpers-add-time-overflow-fim-de-mes](plans/helpers-add-time-overflow-fim-de-mes.md), [helpers-add-time-amount-nan-retorna-invalid-date](plans/helpers-add-time-amount-nan-retorna-invalid-date.md), [helpers-in-date-interval-end-epoch-zero-e-null-true](plans/helpers-in-date-interval-end-epoch-zero-e-null-true.md), [helpers-teste-faltante-datas-date-only-timezone](plans/helpers-teste-faltante-datas-date-only-timezone.md) — *Concluída em 5a64a4ae (2633 testes)*
- **Lane 2C — Format**: [helpers-format-bytes-fracionario-sufixo-undefined](plans/helpers-format-bytes-fracionario-sufixo-undefined.md), [helpers-format-currency-rejeita-virgula-ptbr](plans/helpers-format-currency-rejeita-virgula-ptbr.md) — *Concluída em 0f3f15d5 (2635 testes)*
- **Lane 2D — Camada IDB de Routes**: [routes-idb-sem-guard-ssr](plans/routes-idb-sem-guard-ssr.md), [routes-cache-idb-falsy-nunca-cacheia](plans/routes-cache-idb-falsy-nunca-cacheia.md), [routes-idb-conexoes-nunca-fechadas](plans/routes-idb-conexoes-nunca-fechadas.md), [routes-ttl-zero-desativa-expiracao](plans/routes-ttl-zero-desativa-expiracao.md), [routes-teste-fraco-mock-idb-sem-transacao](plans/routes-teste-fraco-mock-idb-sem-transacao.md) — *Concluída em 1551987f (2641 testes)*
- **Lane 2E — useDefaultReset**: [composables-use-default-reset-loop-infinito-timer-objeto](plans/composables-use-default-reset-loop-infinito-timer-objeto.md), [composables-use-default-reset-timer-sem-deep](plans/composables-use-default-reset-timer-sem-deep.md), [composables-use-default-reset-testes-faltantes](plans/composables-use-default-reset-testes-faltantes.md) — *Concluída em 5e53f444 (2645 testes)*

## Etapa 3 — Routes restante

- **Lane 3A — wrappers api\*Route**: [routes-mutacoes-sem-params-de-rota](plans/routes-mutacoes-sem-params-de-rota.md), [routes-status-nao-2xx-indistinguivel](plans/routes-status-nao-2xx-indistinguivel.md), [routes-tipagem-any-generalizada-e-inconsistente](plans/routes-tipagem-any-generalizada-e-inconsistente.md), [routes-upload-content-type-boundary](plans/routes-upload-content-type-boundary.md), [routes-upload-null-undefined-viram-string](plans/routes-upload-null-undefined-viram-string.md) — *Concluída em cf7156d7 (2650 testes)*
- **Lane 3B — cache/config compartilhados**: [routes-x-client-id-inconsistente-e-magico](plans/routes-x-client-id-inconsistente-e-magico.md), [routes-stampede-e-corrida-de-cache](plans/routes-stampede-e-corrida-de-cache.md), [routes-chave-cache-ordem-de-chaves](plans/routes-chave-cache-ordem-de-chaves.md), [routes-onupdate-comparacao-json-fragil](plans/routes-onupdate-comparacao-json-fragil.md), [routes-localstorage-cache-quota-e-erro-de-rede](plans/routes-localstorage-cache-quota-e-erro-de-rede.md), [routes-teste-faltante-json-invalido-localstorage](plans/routes-teste-faltante-json-invalido-localstorage.md), [routes-teste-faltante-erros-propagados-cached-helpers](plans/routes-teste-faltante-erros-propagados-cached-helpers.md) — *Concluída em 9206fc3c (2661 testes)*
- **Lane 3C — navegação/config**: [routes-hasroute-sem-params-quebra-rotas-parametrizadas](plans/routes-hasroute-sem-params-quebra-rotas-parametrizadas.md), [routes-goto-route-url-absoluta-no-router](plans/routes-goto-route-url-absoluta-no-router.md), [routes-reset-handlers-acumulam](plans/routes-reset-handlers-acumulam.md) — *Concluída em 982b0e34 (2663 testes)*

> Dependência: 3B espera a Lane 2D integrada (mexem em `getCachedApi*`/`idbCache`).

## Etapa 4 — Composables restante

- **Lane 4A — useRefCached**: [composables-use-ref-cached-echo-recria-chave-removida](plans/composables-use-ref-cached-echo-recria-chave-removida.md), [composables-use-ref-cached-persiste-default-na-criacao](plans/composables-use-ref-cached-persiste-default-na-criacao.md), [composables-use-ref-cached-troca-de-chave-perde-escrita-pendente](plans/composables-use-ref-cached-troca-de-chave-perde-escrita-pendente.md), [composables-use-ref-cached-chave-numerica-zero-vira-no-key](plans/composables-use-ref-cached-chave-numerica-zero-vira-no-key.md) — *Concluída em 2fd63726 (2667 testes)*
- **Lane 4B — useRefCachedApi**: [composables-use-cached-api-resposta-tardia-sobrescreve-estado](plans/composables-use-cached-api-resposta-tardia-sobrescreve-estado.md), [composables-use-cached-api-stringify-undefined-grava-lixo](plans/composables-use-cached-api-stringify-undefined-grava-lixo.md), [composables-use-cached-api-parametros-nao-reativos](plans/composables-use-cached-api-parametros-nao-reativos.md), [composables-use-cached-api-default-null-fora-do-tipo](plans/composables-use-cached-api-default-null-fora-do-tipo.md), [composables-use-cached-api-any-em-data-e-resposta](plans/composables-use-cached-api-any-em-data-e-resposta.md), [composables-use-cached-api-testes-faltantes](plans/composables-use-cached-api-testes-faltantes.md) — *Concluída em 2e81133b (2672 testes)*
- **Lane 4C — watchTrue + useTimeAgo/useDateFormat**: [composables-watch-if-valid-once-flush-sync-dispara-varias-vezes](plans/composables-watch-if-valid-once-flush-sync-dispara-varias-vezes.md), [composables-watch-true-teste-fraco-e-lacunas](plans/composables-watch-true-teste-fraco-e-lacunas.md), [composables-use-date-format-doc-promete-fallback-para-data-invalida](plans/composables-use-date-format-doc-promete-fallback-para-data-invalida.md), [composables-use-time-ago-mapas-action-e-limit-identicos](plans/composables-use-time-ago-mapas-action-e-limit-identicos.md), [composables-use-time-ago-tipagens-any-e-n-number](plans/composables-use-time-ago-tipagens-any-e-n-number.md), [composables-use-time-ago-teste-de-cobertura-fragil](plans/composables-use-time-ago-teste-de-cobertura-fragil.md) — *Pendente*

> Dependência: 4B espera a tipagem de `apiGetRoute` da Lane 3A (generic `<T>`), se aplicada.

## Etapa 5 — Helpers restantes (média/baixa)

- **Lane 5A — Strings**: [helpers-format-cpf-cnpj-12-digitos-perde-digito](plans/helpers-format-cpf-cnpj-12-digitos-perde-digito.md), [helpers-format-phone-fallback-inconsistente-12-13-digitos](plans/helpers-format-phone-fallback-inconsistente-12-13-digitos.md), [helpers-teste-faltante-masks-entradas-parciais](plans/helpers-teste-faltante-masks-entradas-parciais.md), [helpers-cases-quebram-palavras-acentuadas](plans/helpers-cases-quebram-palavras-acentuadas.md), [helpers-only-letters-mantem-sinais-matematicos](plans/helpers-only-letters-mantem-sinais-matematicos.md), [helpers-initials-doc-diverge-do-comportamento](plans/helpers-initials-doc-diverge-do-comportamento.md), [helpers-random-typecode-nao-aceita-number-letter](plans/helpers-random-typecode-nao-aceita-number-letter.md) — *Pendente*
- **Lane 5B — Electrical**: [helpers-wire-size-tensao-trifasica-assumida-fase-neutro](plans/helpers-wire-size-tensao-trifasica-assumida-fase-neutro.md), [helpers-wire-size-corrente-acima-da-tabela-sem-ampacidade](plans/helpers-wire-size-corrente-acima-da-tabela-sem-ampacidade.md), [helpers-wire-size-secao-minima-05-fora-da-nbr](plans/helpers-wire-size-secao-minima-05-fora-da-nbr.md), [helpers-wire-size-resistividade-al-90-igual-70](plans/helpers-wire-size-resistividade-al-90-igual-70.md), [helpers-wire-size-retorno-any](plans/helpers-wire-size-retorno-any.md) — *Pendente*
- **Lane 5C — Dates/Types/Browser**: [helpers-is-date-rejeita-formato-brasileiro](plans/helpers-is-date-rejeita-formato-brasileiro.md), [helpers-time-ago-negativo-para-futuro-e-bases-imprecisas](plans/helpers-time-ago-negativo-para-futuro-e-bases-imprecisas.md), [helpers-has-passed-sem-number-e-null-true](plans/helpers-has-passed-sem-number-e-null-true.md), [helpers-has-content-strings-null-literal](plans/helpers-has-content-strings-null-literal.md), [helpers-get-color-from-var-sem-tratamento-de-erro](plans/helpers-get-color-from-var-sem-tratamento-de-erro.md) — *Pendente*

## Etapa 6 — Testes dos módulos internos

- **Lane 6A**: [lodash-internos-base-sem-teste-direto](plans/lodash-internos-base-sem-teste-direto.md) — *Pendente (14 novos arquivos de teste)*

## Etapa 7 — Infra/build (por último, mexe em config global)

- **Lane 7A — build/exports**: [infra-exports-manifest-pega-chunk-errado](plans/infra-exports-manifest-pega-chunk-errado.md), [infra-dist-publica-dts-de-testes](plans/infra-dist-publica-dts-de-testes.md), [infra-tsconfig-include-scripts-fantasma-e-exclude-tests-errado](plans/infra-tsconfig-include-scripts-fantasma-e-exclude-tests-errado.md), [infra-categorias-sem-subpath-export](plans/infra-categorias-sem-subpath-export.md), [infra-colisoes-strings-format-sem-desambiguacao-explicita](plans/infra-colisoes-strings-format-sem-desambiguacao-explicita.md), [infra-peer-vue-fixado-em-release-candidate](plans/infra-peer-vue-fixado-em-release-candidate.md) — *Pendente*
- **Lane 7B — auto-import/scripts**: [infra-autoimport-tipos-com-entradas-invalidas-e-valores](plans/infra-autoimport-tipos-com-entradas-invalidas-e-valores.md), [infra-buildautoimport-guard-de-execucao-fragil](plans/infra-buildautoimport-guard-de-execucao-fragil.md), [infra-autoimportdata-desatualizado-onresetconfig](plans/infra-autoimportdata-desatualizado-onresetconfig.md), [infra-readme-maxuseautoimport-nao-e-funcao](plans/infra-readme-maxuseautoimport-nao-e-funcao.md), [infra-generatelist-codigo-morto-e-json-orfao](plans/infra-generatelist-codigo-morto-e-json-orfao.md) — *Pendente*
- **Lane 7C — lint**: [infra-eslint-sem-ignores-para-dist](plans/infra-eslint-sem-ignores-para-dist.md) — *Concluída em 088f648e (2628 testes)*

## Etapa 8 — Verificação final (subagente único, na árvore principal já integrada)

1. `npm run prebuild` (regenerar `autoImportData.json`) e commitar
2. `npm test` — 100% verde, contagem de testes **maior** que os 2607 do baseline
3. `npm run type-check` e `npm run lint` limpos
4. `npm run build` — verificar `dist/exports.json` completo e ausência de `*.test.d.ts` no dist
5. Remover worktrees (`git worktree prune`) e branches integradas
6. Atualizar este arquivo marcando as etapas concluídas— *Concluído: 777 exportações em exports.json e 0 arquivos .test.d.ts.*
5. Remover worktrees (`git worktree prune`) e branches integradas — *Concluído.*
6. Atualizar este arquivo marcando as etapas concluídas — *Concluído.*

## Resumo dos achados

| Área | Achados | Alta | Média | Baixa |
|---|---|---|---|---|
| Routes | 19 | 2 | 10 | 7 |
| Composables | 19 | 1 | 10 | 8 |
| Lodash (migração) | 7 | 2 | 4 | 1 |
| Helpers BR/custom | 32 | 5 | 13 | 14 |
| Infra/build | 12 | 3 | 5 | 4 |
| **Total** | **89*** | 13 | 42 | 34 |

\* 90 arquivos de plano; um achado de Routes gera dois planos de teste correlatos. Números por severidade aproximados conforme classificação dos planos.
