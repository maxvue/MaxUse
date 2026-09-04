Correção implementada em `fix/gh-16` (f783a12d312086e0b6184de7567234d92c005ab6), aguardando revisão do /bugs-check.

**Parte 1 (código) — guarda `isIterateeCall` em `random`.** Novo interno `src/Helpers/Math/_isIterateeCall.ts` (prefixo `_`, fora do barrel — não altera `exports.json` nem `autoImportData.json`), aplicado em `random.ts` antes da promoção de boolean. `[4, 8].map(random)` agora se comporta como `random(4)`/`random(8)`.

Os testes novos usam `vi.spyOn(Math, 'random')` para cravar os limites em vez de depender de sorte: com `Math.random() = 0` a saída é `[0, 0]` e com `0.9999999999999999` é `[4, 8]` — os dois extremos inclusivos exatos. Cobertos também argumento único, argumentos invertidos, caminho `floating`, e um 3º argumento objeto que **não** é chamada de iteratee (a guarda não pode disparar aí).

Verificação de que os testes são decisivos: com a guarda neutralizada, os 3 testes de iteratee falham; com ela, passam.

**Parte 2 (documentação) — wrapper implícito.** Conforme a arbitragem do plano, documentado em vez de reimplementado: nova seção "Diferenças conhecidas em relação ao Lodash" no README e JSDoc ampliado em `wrapperLodash.ts`. Todas as afirmações do README foram verificadas por execução real (`typeof _ === 'object'`, `_([1,2,3])` → `TypeError`, `chain(...).max().value() === 3`, `w > 2 === true`, `w + 1 === 4`, `JSON.stringify(w) === '3'`, `w === 3` → `false`).

**Validação:** `npm test` 2839/2839 passando (397 arquivos); `npm run type-check` limpo; `npm run lint` 0 erros (7 warnings pré-existentes em arquivos não tocados).

**Aviso de conflito para a revisão:** esta branch parte de `dev` e toca `src/Helpers/Seq/wrapperLodash.ts` (apenas JSDoc). A branch da issue #6 alterou `src/Helpers/Seq/_collectionMixins.ts` — arquivo diferente, conflito improvável, mas registrado. Nada em `src/Helpers/Iterables/` foi tocado. O `README.md` foi alterado (uma seção nova inserida após "### 4. Acesso ao VueUse completo").