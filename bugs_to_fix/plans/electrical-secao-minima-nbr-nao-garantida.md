# Ramo da tabela pode devolver seção abaixo do mínimo da NBR 5410

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Electrical/wireSize.ts](../../src/Helpers/Electrical/wireSize.ts) — linhas 136-142 vs 121
- **Categoria:** divergência de norma (NBR 5410)

## Problema

`min_section` é aplicado na linha 121 via `Math.max`, mas o ramo `else` das
linhas 140-141 **reatribui** a seção a partir de `wire_table` sem revalidar o
mínimo.

Além disso, `circuit_type` assume 1,5 mm² quando não informado — então um
circuito de força que omita o campo recebe silenciosamente seção abaixo da
norma. A NBR 5410 (Tabela 47) exige **2,5 mm² para tomadas**.

## Correção proposta

Aplicar o mínimo no retorno, depois de todos os ramos:

```ts
data_return.wire = all_wires.find(w => w >= Math.max(data_return.wire, min_section));
```

Avaliar também tornar `circuit_type` obrigatório, ou usar o padrão mais
conservador (2,5 mm²) em vez do mais permissivo — em código normativo, o default
deve errar para o lado seguro.

## Teste de regressão

```ts
it('nunca retorna seção abaixo do mínimo da NBR para circuito de força', async () => {
    for (const method of METHODS) {
        for (const i of [10, 20, 32, 63]) {
            const r = await wireSize(i, { ...base, method, circuit_type: 'power' });
            expect(r!.wire).toBeGreaterThanOrEqual(2.5);
        }
    }
});
```
