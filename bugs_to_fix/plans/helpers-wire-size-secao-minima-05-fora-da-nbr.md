# wire-size-secao-minima-05-fora-da-nbr

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:83-85`

## Problema
Sem `circuit_type`, `min_section = 0.5 mm²`. A NBR 5410 (tabela 47) só admite 0,5 mm² para sinalização/controle; circuitos de força exigem 2,5 mm² e iluminação 1,5 mm². Com corrente baixa e trecho curto, a função pode recomendar 0,5/0,75/1,0 mm² para um circuito comum.

## Plano de correção
1. Subir o default para 1,5 mm² (ou exigir `circuit_type` obrigatório) e documentar a referência à NBR 5410.

## Testes
- `wireSize(6, { length: 5 })` sem `circuit_type` retorna ≥ 1.5.
