# Corrente negativa devolve queda negativa; `NaN` devolve campos `null` fora do contrato

- **Severidade:** média
- **Arquivo:** [src/Helpers/Electrical/wireSize.ts](../../src/Helpers/Electrical/wireSize.ts) — linhas 75-77
- **Categoria:** validação de entrada / violação de tipo

## Evidência

```
wireSize(-50, ...)  -> {"wire":1.5,"max_current":19.5,"voltage_drop":-14.28,"loss_percent":-6.49}
wireSize('abc', ...) -> {"wire":1000,"max_current":1125,"voltage_drop":null,"loss_percent":null,"exceeded":true}
```

`NaN.toFixed(2)` → `"NaN"` → `Number("NaN")` → `NaN` → serializa como `null`.

O tipo declarado é `WireSizeResult | null`, com `voltage_drop: number`. Retornar
`voltage_drop: null` **viola o contrato de tipo** sem que haja `any` envolvido —
o TypeScript não protege porque o `NaN` nasce em runtime.

## Correção proposta

```ts
if (!Number.isFinite(currentVal) || currentVal < 0) return null;
```

logo após a linha 75.

## Teste de regressão

```ts
it('rejeita corrente negativa e não-finita', async () => {
    expect(await wireSize(-50, base)).toBeNull();
    expect(await wireSize('abc' as never, base)).toBeNull();
    expect(await wireSize(NaN, base)).toBeNull();
});
```
