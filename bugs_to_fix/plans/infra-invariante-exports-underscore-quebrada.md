# Invariante "exports nomeados == chaves de `_`" está quebrada em 48 nomes

- **Severidade:** média
- **Arquivos:** [src/index.ts](../../src/index.ts) linhas 48 e 53-70; [src/Helpers/VueUse/index.ts](../../src/Helpers/VueUse/index.ts); [src/scripts/buildAutoImport.ts](../../src/scripts/buildAutoImport.ts)
- **Categoria:** integridade da API pública

## Problema

O `CLAUDE.md` estabelece que `_.foo` e o export nomeado `foo` sempre concordam.
Há **duas quebras** dessa invariante, em direções opostas.

### Quebra A — 2 nomes exportados que não estão em `_`

```
FLAT_NOT_IN_UNDERSCORE (2): ["maxUseAutoImport","maxUseItems"]
exported but NOT in maxUseItems: ["maxUseAutoImport","maxUseItems"]
EXPORTED_BUT_NOT_IN_AUTOIMPORT (2): ["maxUseAutoImport","maxUseItems"]
```

`maxUseItems`/`maxUseAutoImport` são reexportados numa linha isolada, mas
`src/Helpers/maxUseItems.ts` não tem `index.ts` de categoria e não entra em
`ownHelpers`. O efeito cascateia: `maxUseItems()` monta sua lista iterando as
mesmas categorias, então **omite a si mesmo**; e `autoImportData.json`, gerado a
partir dele, omite os dois. Consumidores de `unplugin-auto-import` não
conseguem auto-importar `maxUseAutoImport` — justamente o símbolo em torno do
qual o recurso existe.

### Quebra B — 46 nomes em `_` que não são exports nomeados

```
underNotFlat-from-vueuse: 46
underNotFlat-NOT-vueuse (0): []
```

Exemplos: `useDebounce`, `toRef`, `toRefs`, `isClient`, `breakpointsTailwind`,
`StorageSerializers`, `computedEager`, `pausableWatch`, `watchPausable`.

`_` é montado de `import * as vueUse from '@vueuse/core'` (superfície completa),
enquanto os exports nomeados vêm da allowlist manual de 248 linhas em
`Helpers/VueUse/index.ts`. Todo nome acrescentado ao VueUse depois da última
edição da allowlist aparece em `_` e nunca como export nomeado.

`import { useDebounce } from '@maxvue/max-use'` falha; `_.useDebounce` funciona.

**Atenuante verificado:** esses 46 não estão em `autoImportData.json`, então
builds de consumidores não quebram hoje. É inconsistência de superfície, não
falha de build — por isso média, não alta.

## Ponto verificado como correto

`IDENTITY_MISMATCH (0)` — para todo nome presente nos dois lados,
`_.foo === foo` vale exatamente. A precedência "helpers próprios vencem"
funciona como documentado.

## Correção proposta

**Quebra A:** incluir `import * as MaxUseMeta from './Helpers/maxUseItems'` e
espalhar `...MaxUseMeta` em `ownHelpers`; estender a lista-semente do
`buildAutoImport.ts` de `['_','vueUse']` para
`['_','vueUse','maxUseItems','maxUseAutoImport']`; rodar `npm run prebuild`.

**Quebra B:** decidir qual lado é a fonte de verdade —
- se a superfície deve ser completa: `export * from '@vueuse/core'` em
  `Helpers/VueUse/index.ts`, antes do bloco de desambiguação;
- se a allowlist é curadoria deliberada: filtrar `_` pela mesma allowlist, para
  que `_` nunca exponha o que os exports nomeados não expõem.

A escolha é de produto; o que não pode permanecer é a divergência silenciosa.

## Teste de regressão

```ts
it('todo export nomeado existe em _ e é a mesma referência', async () => {
    const lib = await import('../index');
    const flat = Object.keys(lib).filter(k => !['_', 'vueUse', 'default'].includes(k));
    for (const k of flat) {
        expect(lib._, `_ não contém ${k}`).toHaveProperty(k);
        expect((lib._ as never)[k], `_.${k} !== ${k}`).toBe((lib as never)[k]);
    }
});

it('_ não expõe nada além dos exports nomeados', async () => {
    const lib = await import('../index');
    const flat = new Set(Object.keys(lib));
    expect(Object.keys(lib._).filter(k => !flat.has(k))).toEqual([]);
});
```
