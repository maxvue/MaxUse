# Dimensionamento e verificação usam físicas diferentes; reatância fixa cria piso na queda

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Electrical/wireSize.ts](../../src/Helpers/Electrical/wireSize.ts) — linhas 117-119 vs 155-162
- **Categoria:** divergência de regra de negócio

## Problema

O **dimensionamento** usa resistividade pura (`rho`). A **verificação** usa
`R·cosφ + X·senφ`, com `X = 0,0001 Ω/m` fixo e `cosφ = 0,95` hardcoded.

Como os dois discordam, o `loss_percent` retornado pode **exceder o `max_loss`
solicitado** — a função entrega um resultado que viola a própria restrição que
recebeu:

```
max_loss=1% -> {"wire":185,"loss_percent":1.11}    RESPEITADO? false
```

## Agravante: o piso reativo

O termo `X` fixo **não escala com a seção**. Ele passa a dominar em cabos
grandes: 26% da impedância a 240 mm², **59% a 1000 mm²**.

Consequência: abaixo de certo ponto a queda de tensão **nunca converge**, por
mais que se aumente a bitola. Aumentar o cabo deixa de resolver o problema.

`cosφ = 0,95` também é inadequado para carga motora (~0,8).

## Correção proposta

1. Usar **um único** modelo de impedância para dimensionar e verificar.
2. Iterar a seção até a queda calculada atender `max_loss` de fato.
3. Expor `cos_phi` como opção.
4. Obter `X` da tabela de reatâncias da NBR por seção, em vez de constante.

## Verificado como correto neste trecho

- Trifásico usa `√3` e monofásico usa `2` (linha 160) — correto.
- As resistividades Cu/Al × 70/90 °C são quatro valores genuinamente distintos
  (linhas 101-104): 0,0225 / 0,0240 / 0,0360 / 0,0384 — coerentes com a prática
  NBR.

## Teste de regressão

```ts
it('respeita max_loss para uma matriz de cenários', async () => {
    for (const [i, len, v] of CENARIOS) {
        const r = await wireSize(i, { ...base, length: len, voltage: v, max_loss: 1 });
        if (r && !r.exceeded) expect(r.loss_percent).toBeLessThanOrEqual(1);
    }
});
```
