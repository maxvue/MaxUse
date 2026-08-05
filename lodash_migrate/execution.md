# Execução — Independência do Lodash

Você vai implementar, em loop, os helpers que substituem o `lodash-es` na
`@maxvue/max-use`. Este arquivo é autossuficiente: leia-o do início ao fim
antes de tocar em código. Você não tem (nem precisa de) nenhum outro contexto
além do que está aqui e nos arquivos que ele referencia.

## Estado de partida — leia isto antes de tudo

A migração usa um manifesto de **280 helpers** (`lodash_migrate/manifest.ts`).
Destes, **4 já foram implementados** numa etapa anterior do projeto e já estão
gravados em `lodash_migrate/status.yaml` como `status_execucao: Concluído` e
`status_verificacao: Concluído`:

- `isNil`, `negate`, `stubTrue`, `tap`

**A sua fila de trabalho real é de 276 itens** — todos os outros. Não toque
nesses 4: não os re-implemente, não abra chamados de verificação para eles.
O `status.yaml` já reflete isso; basta segui-lo (ver "Escolha do próximo
item" abaixo — os 4 concluídos simplesmente nunca serão selecionados).

Não existe helper chamado `default` neste manifesto — se você encontrar
qualquer referência a ele em documentação antiga, ignore-a: foi removido do
escopo.

Rode até que **todos os 280** (os 4 já prontos + os 276 que você vai
implementar) estejam com `status_execucao: Concluído` **e**
`status_verificacao: Concluído`.

## Antes de começar

1. Confirme que está num worktree isolado, nunca na árvore principal:
   ```bash
   git worktree list
   ```
   Se não estiver num worktree dedicado a esta migração, crie um:
   ```bash
   git worktree add ../MaxUse-wt-lodash-migrate -b lodash-migrate
   cd ../MaxUse-wt-lodash-migrate && npm install
   ```
   Confirme com `pwd` que está dentro dele antes de editar qualquer arquivo.
2. Leia `lodash_migrate/CONVENTIONS.md` por inteiro. É o contrato de estilo,
   reatividade e teste de todos os helpers. As regras mais fáceis de violar
   por descuido:
   - `toValue()` só envolve **argumentos de dados** (arrays, objetos,
     strings, números). Callbacks/predicados/comparadores são funções puras
     e **nunca** passam por `toValue` nem recebem o tipo `MaybeRefOrGetter`.
   - O teste final **não pode importar `lodash-es`** — ele é um andaime de
     desenvolvimento. Antes de marcar o helper como `Concluído`, troque
     qualquer asserção contra `lodash.<nome>(...)` por um valor literal
     observado.
3. Leia `lodash_migrate/DIVERGENCES.md` por inteiro. Ele lista **45 nomes**
   (não 36 — número corrigido após a Task 2 adicionar `isNil`, `negate`,
   `stubTrue`, `tap` e outros nomes a `maxUseItems()`) onde a MaxUse já tem
   uma implementação própria (ou via VueUse) que **intencionalmente** vence o
   Lodash dentro do objeto `_`. Se o helper que você for implementar aparece
   nessa lista, **não** replique a semântica do Lodash — preserve o
   comportamento já existente na MaxUse.
4. Abra `lodash_migrate/status.yaml`. É o estado da migração e a sua fila de
   trabalho. Campos por helper: `nome`, `categoria`, `fase`, `plano`,
   `depende_de`, `tentativas`, `status_execucao`, `status_verificacao`. No
   topo do arquivo: `total: 280` e a lista `fases` (5 fases).

**Nunca rode `npx tsx lodash_migrate/generate.ts` (nem
`npm run migrate:generate`) durante a migração.** Esse script regenera
`plans/` e **reescreve `status.yaml` do zero**, apagando todo o progresso
registrado. Ele só deve ser usado antes da migração começar (já foi usado —
é por isso que `status.yaml` existe). Se você suspeitar que os planos ou o
manifesto estão desatualizados, **não rode o gerador** — pare e avise.

## Escolha do próximo item

Percorra `status.yaml` e selecione o **primeiro** helper que satisfaça as três
condições:

1. Pertence à **fase aberta** mais baixa (uma fase só abre quando a anterior
   fecha por completo — ver "Gate de fase" abaixo);
2. Todas as suas `depende_de` estão com `status_verificacao: Concluído`
   (ou já existiam na MaxUse antes da migração);
3. Não está `Bloqueado`.

Não siga ordem alfabética — a ordem de dependência é o que importa. O
`manifest.ts` que gerou este `status.yaml` é topologicamente ordenado e
validado por teste (nenhum helper aparece antes de uma dependência sua), então
seguir a ordem do arquivo já respeita as dependências.

## Máquina de estados

Para o item escolhido, olhe `status_execucao`:

- **`Realizando`** → alguém parou no meio. Verifique o que já existe
  (`src/Helpers/<Categoria>/<nome>.ts` e o `.test.ts`) e **continue de onde
  parou**.
- **`Aguardando`** → troque para `Realizando` e inicie a execução.
- **`Concluído`** → olhe `status_verificacao`:
  - **`Realizando`** → a verificação foi interrompida. **Reinicie a
    verificação do zero.**
  - **`Aguardando`** → troque para `Realizando` e inicie a verificação.
  - **`Concluído`** → vá para o próximo item.

Grave o `status.yaml` a cada transição de estado, para que uma interrupção não
perca o progresso.

## Processo de execução

1. Leia o plano do helper (campo `plano` no `status.yaml`, ex.:
   `lodash_migrate/plans/Lang/isNull.md`).
2. Leia a implementação original do Lodash como oráculo. **`lodash` (CJS) não
   está instalado neste projeto — só `lodash-es` (ESM).** Use:
   ```bash
   npx tsx -e "import * as lodash from 'lodash-es'; console.log((lodash as any).<nome>.toString());"
   ```
   Mapeie **todos** os comportamentos observáveis, incluindo `null`,
   `undefined`, tipos errados e valores-limite.
3. Se o nome do helper está na lista de `DIVERGENCES.md`, ignore o passo
   acima como fonte de verdade de comportamento — implemente/preserve a
   semântica já documentada da MaxUse, não a do Lodash.
4. Crie `src/Helpers/<Categoria>/<nome>.ts` seguindo o `CONVENTIONS.md`.
5. Registre no `index.ts` da categoria (re-export flat **e** objeto
   namespace — ver tabela de namespaces em `CONVENTIONS.md`).
6. Crie `src/Helpers/<Categoria>/<nome>.test.ts` com a cobertura obrigatória
   descrita em `CONVENTIONS.md` (paridade, edge cases, caso `funciona com
   Ref`, peculiaridade do plano). Durante o desenvolvimento você pode usar
   `lodash-es` como oráculo dentro do teste, mas **antes de terminar, troque
   essas asserções por valores literais** — nenhum `.test.ts` final pode
   importar `lodash-es`.
7. Rode até passar:
   ```bash
   npx vitest run src/Helpers/<Categoria>/<nome>.test.ts
   ```
8. **Revise o teste em busca de brechas.** Pergunte-se: algum comportamento
   do original ficou sem asserção? O teste passaria com uma implementação
   errada? Se sim, reforce o teste — e corrija o helper se ele estiver
   errado.
9. Rode `npm run lint && npm run type-check`.

   **Atenção ao `npm run lint`:** ele roda `eslint . --fix` no repositório
   inteiro, não só no arquivo novo. Duas pegadinhas conhecidas, sem relação
   com esta migração — **não tente corrigi-las**:
   - `src/Helpers/Locales/pt_BR.js` e
     `src/Helpers/Types/hasContent.test.ts` já falham no lint em `main`
     (erro pré-existente e não relacionado).
   - `eslint --fix` pode restilizar outros arquivos não relacionados ao seu
     helper (efeito da regra `curly: multi` combinada com código antigo).
     Depois de rodar o lint, cheque `git status --short`: se aparecer algo
     fora de `src/Helpers/<Categoria>/<nome>.ts`,
     `src/Helpers/<Categoria>/<nome>.test.ts`,
     `src/Helpers/<Categoria>/index.ts` e `lodash_migrate/status.yaml`,
     reverta com `git checkout -- <arquivo>` antes de commitar. Mantenha o
     diff cirúrgico.
10. Marque `status_execucao: Concluído` e passe para a verificação.

## Verificação

1. Dispare um **subagente com modelo Opus 5** com este briefing:

   > Verifique o helper `<nome>` em `src/Helpers/<Categoria>/<nome>.ts` e seu
   > teste em `src/Helpers/<Categoria>/<nome>.test.ts`.
   >
   > Se `<nome>` está listado em `lodash_migrate/DIVERGENCES.md`, a
   > referência de comportamento correto é a MaxUse (ou VueUse), não o
   > Lodash — não reprove por divergir do Lodash nesses casos. Caso
   > contrário, compare com o comportamento do `_.<nome>` do Lodash
   > (`lodash-es` está instalado — use-o como oráculo, nunca `lodash` puro,
   > que não está instalado). Verifique:
   > 1. Paridade de comportamento, incluindo `null`, `undefined`, coleção
   >    vazia, tipos errados e valores-limite;
   > 2. Aderência ao `lodash_migrate/CONVENTIONS.md` (estilo ESLint, JSDoc em
   >    português, `toValue` só nos argumentos de dados, callbacks
   >    intocados);
   > 3. Se o teste tem brechas — ele passaria com uma implementação errada?
   > 4. Se o helper está exportado no `index.ts` da categoria (flat +
   >    namespace);
   > 5. Se o `.test.ts` final **não** importa `lodash-es` (é permitido só
   >    durante o desenvolvimento, não no resultado).
   >
   > Rode `npx vitest run src/Helpers/<Categoria>/<nome>.test.ts`,
   > `npm run lint` e `npm run type-check`. Se o `lint` alterar arquivos além
   > dos deste helper, ignore essas alterações ao avaliar (são efeito
   > colateral conhecido do `eslint --fix`, não responsabilidade deste
   > helper) — mas não deixe de mencionar se isso ocorreu.
   >
   > Responda APROVADO ou REPROVADO. Se REPROVADO, liste os problemas
   > concretos.

2. Aguarde a conclusão.
3. **Aprovado** → marque `status_verificacao: Concluído`. Antes de commitar,
   rode `git status --short` e reverta qualquer arquivo alterado pelo
   `eslint --fix` do subagente que não pertença a este helper (ver passo 9
   acima). Então:
   ```bash
   git add src/Helpers/<Categoria>/<nome>.ts src/Helpers/<Categoria>/<nome>.test.ts src/Helpers/<Categoria>/index.ts lodash_migrate/status.yaml
   git commit -m "feat: implementa <nome> (migração Lodash)"
   ```
4. **Reprovado** → incremente `tentativas`, volte `status_execucao` para
   `Realizando` e corrija os problemas apontados.

## Limite de tentativas

Se `tentativas` chegar a **3**, marque `status_execucao: Bloqueado`, registre
o motivo num comentário do `status.yaml` e **siga para o próximo item**. Não
gire em loop no mesmo helper — os bloqueados são revisados manualmente ao
final.

## Gate de fase

Ao concluir o último helper de uma fase, antes de abrir a fase seguinte:

```bash
npm run lint && npm run type-check && npm test
```

Os três precisam passar. Um helper passar no próprio teste não garante que o
conjunto compila nem que não houve colisão de nomes no `_`. Se o `lint`
restilizar arquivos fora do escopo desta migração, reverta-os
(`git checkout -- <arquivo>`) antes de commitar o fechamento de fase.

```bash
git commit -m "chore: fecha a fase <N> da migração do Lodash"
```

## Encerramento (só depois dos 280 — os 4 já prontos + os 276 migrados)

Quando **todos** os itens estiverem `Concluído`/`Concluído`:

1. Remova o Lodash de `src/index.ts` ([src/index.ts](../src/index.ts)):
   apague a linha `import * as lodash from 'lodash-es';` e todo o bloco
   `filteredLodash` (comentário, declaração e laço), deixando o objeto `_`
   assim:
   ```typescript
   export const _ = {
       ...ownHelpers,
       ...filteredVueUse
   };
   ```
2. Remova `lodash-es` das dependências:
   ```bash
   npm uninstall lodash-es @types/lodash-es
   ```
3. Remova os imports de `lodash-es` que sobraram nos testes (o oráculo de
   paridade), substituindo as asserções por valores literais:
   ```bash
   grep -rln "lodash-es" src/ lodash_migrate/
   ```
   Exceção — reescreva em vez de simplesmente apagar o import, porque ambos
   dependem do Lodash para calcular a lista de nomes conflitantes:
   - `src/Helpers/divergences.test.ts` — troque o cálculo dinâmico (que hoje
     faz `Object.keys(lodash).filter(...)`) por uma lista estática dos 45
     nomes de `DIVERGENCES.md` (seção "Nomes afetados").
   - `lodash_migrate/manifest.test.ts` — mesma lógica: qualquer verificação
     que hoje importe `lodash-es` para conferir o manifesto precisa passar a
     usar dados estáticos (o próprio `manifest.ts`, que já é a fonte de
     verdade).
4. Regenere os dados de auto-import (script gerador — **nunca edite
   `src/Helpers/autoImportData.json` à mão**):
   ```bash
   npx tsx src/scripts/buildAutoImport.ts
   ```
5. Validação final:
   ```bash
   npm run lint && npm run type-check && npm test && npm run build
   ```
6. Confirme que o `_` expõe os nomes esperados:
   ```bash
   npx tsx -e "
   import { _ } from './src/index';
   console.log('total em _:', Object.keys(_).length);
   for (const n of ['isNil', 'negate', 'stubTrue', 'tap', 'compact', 'chunk', 'debounce'])
       if (!(n in _)) throw new Error('FALTA: ' + n);
   console.log('OK');
   "
   ```
7. Commit e integre no `main`:
   ```bash
   git add -A
   git commit -m "feat!: remove a dependência do lodash-es"
   cd /home/johnattas/GitHub/MaxUse
   git merge lodash-migrate
   ```

## Regras que não podem ser quebradas

1. **Nunca** edite `src/Helpers/autoImportData.json` à mão — é gerado pelo
   `prebuild`/`src/scripts/buildAutoImport.ts`.
2. **Nunca** remova o `lodash-es` antes dos 280 concluídos (os 4 já prontos
   contam) — ele é a rede de segurança e o oráculo dos testes durante o
   desenvolvimento.
3. **Nunca** envolva callbacks/iteratees/predicados/comparadores em
   `toValue`. Só argumentos de dados passam por `toValue`.
4. **Nunca** rode `npx tsx lodash_migrate/generate.ts` (nem
   `npm run migrate:generate`) enquanto houver progresso em `status.yaml` —
   ele reescreve o arquivo do zero e apaga todo o histórico de execução.
5. Os **45** nomes conflitantes (ver `lodash_migrate/DIVERGENCES.md`) mantêm
   a semântica da MaxUse. Não os "conserte" para bater com o Lodash.
6. Atualize o `status.yaml` a cada transição de estado, não só no fim.
7. Não gaste rodadas tentando corrigir as falhas de lint pré-existentes em
   `src/Helpers/Locales/pt_BR.js` e `src/Helpers/Types/hasContent.test.ts` —
   são anteriores a esta migração e fora de escopo.
