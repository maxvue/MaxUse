# `formatBytes()` corrompe strings pt-BR e notação científica em silêncio

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Format/bytes.ts](../../src/Helpers/Format/bytes.ts) — linha 15 (sanitização), linhas 29/31 (índice do sufixo)
- **Categoria:** bug de correção — produz número errado sem erro

## Problema

A sanitização de entrada por regex produz **números errados silenciosamente**,
em vez de rejeitar a entrada inválida. Esta é a pior classe de falha do
conjunto: o chamador recebe um valor plausível e errado, sem nenhum sinal.

## Evidência

```
$ npx tsx -e "import {formatBytes} from './src/Helpers/Format/bytes';
console.log(formatBytes('2e3'), '|', formatBytes(1023.9999));"

formatBytes(2e3)       -> 23 Bytes      # fabricou "23" a partir de "2e3"
formatBytes(1023.9999) -> 1024 Bytes    # deveria promover para 1 KB
```

Casos adicionais medidos na mesma execução:

| Entrada      | Saída atual  | Esperado    |
|--------------|--------------|-------------|
| `'1.234,5'`  | `0 Bytes`    | `1.21 KB`   |
| `'2e3'`      | `23 Bytes`   | nunca `23`  |
| `'1.024'`    | `1.02 Bytes` | `1 KB`      |
| `1023.9999`  | `1024 Bytes` | `1 KB`      |
| `Infinity`   | `Infinity YB`| `0 Bytes`   |

Isolamento da causa:

```
$ npx tsx -e "
console.log('1.234,5'.replace(',','.').replace(/[^0-9.-]/g,''));  // 1.234.5 -> NaN
console.log('2e3'.replace(',','.').replace(/[^0-9.-]/g,''));      // 23
console.log(parseFloat((1023.9999).toFixed(2)));                  // 1024
"
```

## Causa raiz

São dois defeitos independentes:

1. **Linha 15** faz `.replace(',', '.')` seguido de remoção de tudo que não seja
   `[0-9.-]`. Consequências: (a) string pt-BR com milhar e decimal vira
   `1.234.5`, número inválido → `NaN` → `'0 Bytes'`; (b) o `e` de `2e3` é
   removido e os dígitos se colam em `23` — **número errado, em silêncio**;
   (c) `1-2` mantém o sinal de menos interno.

2. **Linhas 29/31** calculam o índice do sufixo a partir de `log(abs)` **antes**
   do arredondamento `toFixed(dm)`. Então `1023.9999` arredonda para `1024` mas
   continua carregando o sufixo `Bytes`.

O teste existente em `bytes.test.ts:79` só exercita `'1,5'` — um único
separador — e por isso não alcança nenhum dos casos acima.

## Correção proposta

Reaproveitar o conversor que já trata os dois formatos, em vez da regex ad-hoc.
Verificado: `toNumber('1.234,56') === 1234.56`.

```ts
import { toNumber } from '../Strings/converters';

const rawBytes = typeof raw === 'string' ? toNumber(raw) : Number(raw);
if (!Number.isFinite(rawBytes) || rawBytes === 0) return '0 Bytes';
```

Para o arredondamento de fronteira, recalcular o índice após arredondar:

```ts
if (parseFloat((abs / k ** i).toFixed(dm)) >= k && i < sizes.length - 1) i++;
```

> Observação: a correção do item 1 depende de `toNumber` interpretar `'1.234'`
> corretamente. Ver o plano
> [formatcurrency-interpreta-milhar-ptbr-como-decimal](./formatcurrency-interpreta-milhar-ptbr-como-decimal.md),
> que trata da mesma heurística de separadores. **Corrigir os dois em conjunto**
> e decidir de forma única onde mora a desambiguação pt-BR.

## Teste de regressão

```ts
it('interpreta strings pt-BR com milhar e decimal', () => {
    expect(formatBytes('1.234,5')).toBe('1.21 KB');
    expect(formatBytes('1.024')).toBe('1 KB');
});

it('não fabrica números a partir de notação científica', () => {
    expect(formatBytes('2e3')).not.toBe('23 Bytes');
});

it('promove o sufixo quando o arredondamento atinge 1024', () => {
    expect(formatBytes(1023.9999)).toBe('1 KB');
});

it('trata Infinity como entrada inválida', () => {
    expect(formatBytes(Infinity)).toBe('0 Bytes');
});
```
