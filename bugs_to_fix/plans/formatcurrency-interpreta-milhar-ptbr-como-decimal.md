# `formatCurrency('1.234')` retorna `R$ 1,23` — erro de 1000x

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Format/currency.ts](../../src/Helpers/Format/currency.ts) — linhas 18 e 21, via `normalizeNumericString` em [src/Helpers/Strings/converters.ts](../../src/Helpers/Strings/converters.ts) linha 37
- **Categoria:** bug de correção — erro de ordem de grandeza em valor monetário

## Problema

Um separador de milhar pt-BR é interpretado como separador decimal, produzindo
um valor **mil vezes menor** que o pretendido. Em um helper de moeda, num
projeto que declara foco no mercado brasileiro, esta é a divergência de maior
impacto prático da categoria.

## Evidência

```
$ npx tsx -e "import {formatCurrency} from './src/Helpers/Format/currency';
console.log(formatCurrency('1.234'));
console.log(formatCurrency(formatCurrency(1234.56)));"

formatCurrency('1.234')                 -> R$ 1,23     # esperado: R$ 1.234,00
formatCurrency(formatCurrency(1234.56)) -> R$ 0,00     # não faz round-trip
```

Casos adicionais medidos:

| Entrada          | Saída atual   | Esperado        |
|------------------|---------------|-----------------|
| `'1.234'`        | `R$ 1,23`     | `R$ 1.234,00`   |
| `'1.234,56'`     | `R$ 1.234,56` | correto         |
| `'1234'`         | `R$ 1.234,00` | correto         |
| `'R$ 1.234,56'`  | `R$ 0,00`     | `R$ 1.234,56`   |
| `Infinity`       | `R$ ∞`        | `R$ 0,00`       |

## Causa raiz

Três defeitos distintos:

1. `normalizeNumericString` (converters.ts:28-38) desambigua pela **posição do
   último separador**. Havendo só ponto, cai no ramo internacional e trata o
   ponto como decimal. A heurística é defensável num `toNumber` genérico — mas
   `formatCurrency` é documentado como "padrão de moeda brasileira (R$)" e é
   justamente o lugar onde um ponto isolado em grupo de 3 dígitos é
   inequivocamente separador de milhar.

2. A linha 18 rejeita qualquer string que contenha letra — e `R$` contém `R`.
   Por isso a função **não consegue reprocessar a própria saída**.

3. `Infinity` não é filtrado: só `isBlank` e o teste de letra guardam a entrada.

## Correção proposta

Em `formatCurrency`, antes de delegar a `toNumber`:

1. remover símbolo de moeda inicial: `/^\s*R\$\s*/`;
2. quando a string tiver ponto e não tiver vírgula, e todos os grupos após o
   primeiro tiverem exatamente 3 dígitos, tratar os pontos como milhar;
3. guardar o resultado com `Number.isFinite(num)`, com fallback `'R$ 0,00'`.

> Decisão de projeto a tomar junto com
> [formatbytes-corrompe-string-ptbr-e-notacao-cientifica](./formatbytes-corrompe-string-ptbr-e-notacao-cientifica.md):
> a desambiguação pt-BR deve viver em `converters.ts` (afetando todo `toNumber`)
> ou só em `formatCurrency`? Recomendação: criar um
> `parseBrNumber` explícito e usá-lo nos dois helpers, preservando o
> `toNumber` genérico como está para não quebrar outros consumidores.

## Teste de regressão

```ts
it('interpreta ponto como separador de milhar em pt-BR', () => {
    expect(formatCurrency('1.234')).toBe('R$ 1.234,00');
    expect(formatCurrency('1.234.567')).toBe('R$ 1.234.567,00');
});

it('faz round-trip do próprio formato de saída', () => {
    expect(formatCurrency(formatCurrency(1234.56))).toBe('R$ 1.234,56');
});

it('retorna R$ 0,00 para Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('R$ 0,00');
});
```
