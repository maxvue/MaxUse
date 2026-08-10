# format-bytes-fracionario-sufixo-undefined

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Format/bytes.ts:29-31`

## Problema
Para `0 < |bytes| < 1`, `Math.log(abs)` é negativo → `i = -1` → `sizes[-1] === undefined` e o valor é multiplicado por 1024. Verificado: `formatBytes(0.5)` retorna `"512 undefined"`. O `Math.min` da linha 29 protege só o teto, não o piso.

## Plano de correção
```ts
const i = Math.min(Math.max(Math.floor(Math.log(abs) / Math.log(k)), 0), sizes.length - 1);
```

## Testes
- `formatBytes(0.5) === '0.5 Bytes'`, `formatBytes(-0.5)`, `formatBytes('0,5')`.
