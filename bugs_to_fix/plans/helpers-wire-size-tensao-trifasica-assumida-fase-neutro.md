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

## Decisão de Design Registrada
- Aceitar opção `voltage_type?: 'fn' | 'ff'`. Se `voltage_type` for `'fn'` (ou se omitido e `voltage <= 254` em sistema trifásico), multiplica por √3 para converter para fase-fase. Se `voltage_type` for `'ff'` ou `voltage > 254` (ex: 380 V, 440 V), usa a tensão informada diretamente como fase-fase.

## Plano de correção
1. Adicionar `voltage_type?: 'fn' | 'ff'` nas opções e ajustar a lógica de `voltage_base` em `src/Helpers/Electrical/wireSize.ts`.
2. Documentar no JSDoc.

## Testes
- `{phases:3, voltage:380}` usa base 380; `{phases:3, voltage:220}` usa 380 (220·√3).
