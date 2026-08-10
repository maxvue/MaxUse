# `isTouchDevice()` lança no servidor (sem guarda SSR)

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Browser/isTouchDevice.ts](../../src/Helpers/Browser/isTouchDevice.ts) — linha 69
- **Categoria:** compatibilidade SSR

## Problema

`'ontouchstart' in window` sem guarda. Em renderização no servidor, lança.

```
$ npx tsx -e "...isTouchDevice()"
isTouchDevice SSR THREW: ReferenceError: window is not defined
```

O vizinho `getColorFromVar.ts:32` **tem** guarda SSR adequada — inconsistência
dentro da mesma pasta.

Impacto direto no público-alvo declarado da biblioteca (Laravel/Adonis + Vue):
derruba a renderização SSR em Nuxt/Inertia.

## Por que o teste não pega

O `happy-dom` fornece `window`, então o ambiente de teste **nunca reproduz** a
condição de servidor. É um caso em que teste verde não significa código correto.

## Correção proposta

```ts
if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
```

Aproveitar para eliminar o `as any` da linha 71, com extensão de interface
tipada para `msMaxTouchPoints`.

## Teste de regressão

```ts
it('retorna false em ambiente sem window (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(() => isTouchDevice()).not.toThrow();
    expect(isTouchDevice()).toBe(false);
    vi.unstubAllGlobals();
});
```
