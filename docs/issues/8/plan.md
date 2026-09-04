Correção implementada em `fix/gh-8` (4c02d08a16392f969238d59dea0f20892874141d), aguardando revisão do /bugs-check.

**O que mudou** (`src/Helpers/Objects/deepMerge.ts`, assinatura pública inalterada):
- recursão extraída para o auxiliar privado `mergeInto(target, source, stack)` com `Map` de stack — ciclo direto (`a.self = a`), aninhado (`a.b.parent = a`) e indireto (`a.b.a === a`) não estouram mais a pilha, e o ciclo é **reconstruído no alvo** (`result.b.a === result`), como `merge` já fazia;
- `isObject` → `isPlainObject` na decisão de recursão: `Date`, `Map`, `Set` e instâncias de classe deixam de virar `{}` vazio;
- valores não-plain passam por `deepClone`, resolvendo o achado secundário (o resultado não compartilha mais referência de array/objeto com a fonte);
- laço sobre `sources` em vez de `sources.shift()` — o array de argumentos não é mais mutado.

Decisão registrada para a revisão: optou-se por **clonar** `Date`/`Map`/`Set`/instâncias de classe (divergência deliberada de `merge`, que as mantém por referência), conforme a opção recomendada no plano. Reverter para paridade estrita seria trocar `deepClone(sourceValue)` por `sourceValue`.

**Validação:** `npm test` 396 arquivos / 2826 testes verdes; `npm run type-check` sem erros; `npm run lint` 0 erros (7 warnings pré-existentes em arquivos não tocados). 8 testes de regressão adicionados em `deepMerge.test.ts` (18 no total no arquivo). Prova manual via `npx tsx`: ciclo sem erro, `source.items` permanece `[1,2,3]`, `r.d instanceof Date === true`.