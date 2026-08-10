# Fatores de correção (fca/fct) não têm efeito quando não se informa `method`

- **Severidade:** alta — direção do erro é **subdimensionamento**
- **Arquivo:** [src/Helpers/Electrical/wireSize.ts](../../src/Helpers/Electrical/wireSize.ts) — linha 99 vs linhas 117-119
- **Categoria:** bug de correção em código de segurança

## Problema

`correctedCurrent` é calculado na linha 99, mas a fórmula de seção nas linhas
117-119 usa `currentVal` **cru**. O derating só chega ao resultado pelo ramo da
tabela — sem `method`, é silenciosamente descartado.

## Evidência

```
sem fca/fct   : {"wire":240,"max_current":100,...}
fca=fct=0.5   : {"wire":240,"max_current":100,...}    <-- idêntico
```

`fca = fct = 0.5` significa que o cabo conduz **metade** da corrente nominal —
por agrupamento de circuitos e temperatura ambiente. Ignorar isso produz cabo
subdimensionado.

## Por que é grave

Diferente do bug das tabelas desordenadas (que superdimensiona, gerando custo),
este erra na direção **perigosa**: o condutor especificado é menor que o
necessário. Cabo subdimensionado aquece — risco de incêndio.

## Correção proposta

O critério de ampacidade deve usar `correctedCurrent` em todo o percurso.

Manter a queda de tensão sobre `currentVal` — isso está **correto** e deve ser
preservado: a queda de tensão depende da corrente real da carga, não da
corrente corrigida por fatores de instalação. Os dois critérios usam grandezas
diferentes por razão física legítima.

## Teste de regressão

```ts
it('fatores de correção aumentam a seção exigida', async () => {
    const semFatores = await wireSize(100, { ...base });
    const comFatores = await wireSize(100, { ...base, fca: 0.5, fct: 0.5 });
    expect(comFatores!.wire).toBeGreaterThan(semFatores!.wire);
});

it('aplica derating mesmo sem method informado', async () => {
    const a = await wireSize(100, { material: 'copper', voltage: 220, length: 10, phases: 2 });
    const b = await wireSize(100, { material: 'copper', voltage: 220, length: 10, phases: 2, fca: 0.5 });
    expect(b!.wire).toBeGreaterThan(a!.wire);
});
```
