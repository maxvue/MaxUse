# wire-size-tensao-trifasica-assumida-fase-neutro

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:48-52,97`

## Problema
Para trifásico, `toPhasePhase` **sempre** multiplica a tensão por √3, assumindo entrada fase-neutro. Mas o tipo `voltage` documenta valores fase-fase como `380`/`440`: `wireSize(x, { phases: 3, voltage: 380 })` → `380·√3 ≈ 658` → arredonda para **480 V**, calculando queda de tensão sobre base errada (~26% de erro).

## Evidência
```ts
const voltage_base = Number(phases === 3 ? toPhasePhase(Number(voltage)) : voltage);
```

## Plano de correção
1. Só converter quando a tensão informada for claramente fase-neutro (ex.: `voltage <= 254`), **ou** aceitar flag explícita `voltage_type: 'fn' | 'ff'` (preferível — sem ambiguidade).
2. Documentar a semântica no JSDoc.

## Testes
- `{phases:3, voltage:380}` usa base 380; `{phases:3, voltage:220}` usa 380 (220·√3).
