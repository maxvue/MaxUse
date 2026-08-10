# `formatPhone()` formata DDDs que não existem

- **Severidade:** média
- **Arquivo:** [src/Helpers/Strings/masks.ts](../../src/Helpers/Strings/masks.ts) — linhas 83-88
- **Categoria:** divergência de regra de negócio (BR)

## Evidência

```
0301234567  -> (03) 0123-4567
2012345678  -> (20) 1234-5678
0012345678  -> (00) 1234-5678
1012345678  -> (10) 1234-5678
2312345678  -> (23) 1234-5678
```

Nenhum desses DDDs existe no Brasil. Caso adicional: `'03001234567'` (número
0300, de custo compartilhado) vira `(03) 00123-4567` — enquanto o ramo irmão
de `0800` (linha 77) trata o caso corretamente.

## Causa raiz

As linhas 83-88 ramificam apenas por **contagem de dígitos**, sem whitelist de
DDD. Os DDDs brasileiros são um conjunto fixo e conhecido: 11-19, 21, 22, 24,
27, 28, 31-38, 41-49, 51, 53-55, 61-69, 71, 73-75, 77, 79, 81-89, 91-99.

Os prefixos não-geográficos 0300/0500/0900 também caem no ramo de DDD porque só
`0800` foi tratado.

## Correção proposta

Constante de módulo `const VALID_DDD = new Set([...])`, exigida nos ramos de
10/11/12/13 dígitos; devolver `String(data)` intacto caso contrário.

Estender o ramo não-geográfico de `startsWith('0800')` para
`/^0(800|300|500|900)/`.

## Teste de regressão

```ts
it('não formata DDDs inexistentes', () => {
    expect(formatPhone('0301234567')).toBe('0301234567');
    expect(formatPhone('2012345678')).toBe('2012345678');
    expect(formatPhone('0012345678')).toBe('0012345678');
});

it('trata 0300 como número não-geográfico', () => {
    expect(formatPhone('03001234567')).not.toBe('(03) 00123-4567');
});
```
