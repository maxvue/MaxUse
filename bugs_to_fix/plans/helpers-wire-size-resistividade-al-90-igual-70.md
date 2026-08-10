# wire-size-resistividade-al-90-igual-70

- **Severidade**: baixa
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:89-92`

## Problema
Para cobre a resistividade sobe de 0,0225 (70°C) para 0,0240 (90°C), mas para alumínio usa `0.0360` nas duas temperaturas — a queda de tensão de Al/EPR fica subestimada (~0,037-0,038 seria o coerente a 90°C).

## Evidência
```ts
'al': { '70': 0.0360, '90': 0.0360 }
```

## Plano de correção
1. Corrigir o valor de Al a 90°C usando a mesma fonte adotada para o Cu (proporção ≈ 0.0240/0.0225 sobre 0.0360 ≈ 0.0384).

## Testes
- Comparar queda de tensão al-70 vs al-90 para o mesmo circuito — devem diferir, com al-90 maior.
