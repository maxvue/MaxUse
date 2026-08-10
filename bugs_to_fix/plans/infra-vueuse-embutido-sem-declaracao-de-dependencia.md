# `@vueuse/core` é embutido no `dist/` por não estar declarado como dependência

- **Severidade:** CRÍTICA (para publicação no npm)
- **Arquivos:** [package.json](../../package.json) linha 126 (devDependencies); [vite.config.ts](../../vite.config.ts) linhas 47-56 (externals)
- **Categoria:** empacotamento

## Problema

`@vueuse/core` é import de runtime, mas está declarado **apenas** em
`devDependencies` — nem em `dependencies`, nem em `peerDependencies`. Como o
Vite monta a lista de externals a partir dessas duas chaves, o Rollup
**embute a biblioteca inteira** no bundle publicado.

## Evidência

```
$ node -e "const p=require('./package.json');
console.log('vueuse in deps?',!!p.dependencies['@vueuse/core'],
            '| in peer?',!!(p.peerDependencies||{})['@vueuse/core']);"
vueuse in deps? false | in peer? false

$ grep -c "#region node_modules" dist/dist-*.js
2

$ ls -la dist/dist-Cdjm40YW.js
-rw-r--r-- 344020 dist/dist-Cdjm40YW.js        # 344 KB / ~82,8 KB gzip

$ grep -rl "dist-Cdjm40YW" dist/*.es.js
dist/composables.es.js  dist/index.es.js  dist/vueuse.es.js  dist/vueUseCore.es.js
```

## Consequências reais

1. **Estado reativo duplicado.** Composables do VueUse que dependem de
   singletons de módulo (`createGlobalState`, `createSharedComposable`, hooks de
   evento compartilhados, registros de listener de `useStorage`) passam a existir
   **duas vezes** numa aplicação que também instale `@vueuse/core`. As duas
   cópias **não compartilham estado** — classe de bug muito difícil de
   diagnosticar.

2. **Versão congelada silenciosamente.** O consumidor recebe uma cópia privada
   presa à versão instalada no momento do build (14.4.0). Atualizar
   `@vueuse/core` no projeto dele não afeta nada que passe pela MaxUse.

3. **Peso.** 344 KB brutos entregues de forma duplicada.

## Causa raiz

O `vite.config.ts` deriva os externals de
`Object.keys(pkg.dependencies) + Object.keys(pkg.peerDependencies)`. A ausência
de declaração não gera erro — apenas faz o bundler embutir. Falha silenciosa de
configuração.

## Correção proposta

Adicionar `@vueuse/core` a `peerDependencies` com faixa permissiva
(`"^14.0.0"`), mantendo-o em `devDependencies` para o build local. Como o Vite
já deriva externals dessas chaves, **a externalização passa a ocorrer sem
nenhuma mudança de configuração**.

Verificação pós-correção: `dist/dist-*.js` deve desaparecer e
`grep "from \"@vueuse/core\"" dist/vueUseCore.es.js` deve encontrar o import
externo.

## Teste de regressão

```ts
it('não empacota dependências externas no dist', () => {
    for (const f of fs.readdirSync('dist').filter(x => x.endsWith('.es.js'))) {
        const src = fs.readFileSync(path.join('dist', f), 'utf8');
        expect(src, `${f} contém código inline de node_modules`)
            .not.toMatch(/#region node_modules/);
    }
    expect(fs.readFileSync('dist/vueUseCore.es.js', 'utf8'))
        .toMatch(/from ["']@vueuse\/core["']/);
});
```
