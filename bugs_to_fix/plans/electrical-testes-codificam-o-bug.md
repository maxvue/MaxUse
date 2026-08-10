# A suíte de testes do módulo elétrico consagra a corrupção como comportamento esperado

- **Severidade:** CRÍTICA (defeito de processo — é o que permitiu o bug sobreviver)
- **Arquivo:** [src/Helpers/Electrical/wireSize.test.ts](../../src/Helpers/Electrical/wireSize.test.ts) — linhas 226 e 234
- **Categoria:** teste que passa e nada prova

## Problema

O teste não apenas deixa de detectar a corrupção descrita em
[electrical-tabelas-json-desordenadas](./electrical-tabelas-json-desordenadas.md)
— ele **documenta a corrupção e afirma o valor corrompido como correto**.

## Evidência

```ts
// wireSize.test.ts:226
length: 650, // Comprimento muito longo forçando bitola calculada ser ~300.
             // Na tabela desordenada, o item encontrado é wire 240.

// wireSize.test.ts:234
expect(result!.max_current).toBe(477); // O max_current para a bitola 300 na tabela b1
```

O comentário diz literalmente **"Na tabela desordenada"**. A desordem foi
observada por quem escreveu o teste, e a reação foi ajustar a expectativa ao
valor errado em vez de corrigir o dado.

Consequência direta: **corrigir os dados quebra este teste**. A suíte está
ancorada no estado defeituoso.

## Por que o resto da suíte também não protege

Os demais testes do módulo asseguram apenas *forma*, não *valor*:

- `expect(result).not.toBeNull()`
- `expect(result!.wire).toBeGreaterThan(0)`
- `expect(result!.wire).toBeGreaterThan(240)`

São 25 testes e **nenhum compara uma bitola exata contra a tabela NBR**. Por
isso o módulo passa 100% verde enquanto devolve 240 mm² para 20 A:

```
$ npx vitest run src/Helpers/Electrical
323 passed
```

Uma implementação que sempre retornasse a maior bitola da tabela passaria em
praticamente todas essas asserções.

## Causa raiz

Testes escritos para *cobertura de linha* (há inclusive comentários do tipo
"Garante que a linha 124 foi executada") em vez de *correção de domínio*. Em
código de dimensionamento elétrico, cobrir o branch sem conferir o número não
oferece garantia nenhuma.

## Correção proposta

1. Remover as duas asserções ancoradas no valor corrompido (linhas 226 e 234).
2. Substituir as asserções de forma por **expectativas exatas derivadas da
   tabela NBR**, cobrindo a matriz 9 métodos × 2 materiais × 2 temperaturas.
3. Adotar a regra: todo teste do módulo elétrico afirma uma bitola/ampacidade
   exata, nunca apenas `> 0` ou `not.toBeNull()`.

Executar **junto** com o plano das tabelas desordenadas — um não fecha sem o
outro.

## Teste de regressão

```ts
// Tabela de casos derivada diretamente do JSON da NBR
it.each([
    // [corrente, método, material, isolação, bitola esperada]
    [20,  'b1', 'copper', '70', 2.5],
    [20,  'c',  'copper', '70', 2.5],
    [100, 'b1', 'copper', '70', 25]
])('dimensiona %iA em %s/%s/%s como %fmm²', async (i, method, material, iso, expected) => {
    const r = await wireSize(i, {
        material, isolation: iso, method,
        phases: 2, voltage: 220, length: 10
    } as never);
    expect(r!.wire).toBe(expected);
});
```
