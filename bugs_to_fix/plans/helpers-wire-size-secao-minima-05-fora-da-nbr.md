# wire-size-secao-minima-05-fora-da-nbr

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:83-85`

## Problema
Sem `circuit_type`, `min_section = 0.5 mm²`. A NBR 5410 (tabela 47) só admite 0,5 mm² para sinalização/controle; circuitos de força exigem 2,5 mm² e iluminação 1,5 mm². Com corrente baixa e trecho curto, a função pode recomendar 0,5/0,75/1,0 mm² para um circuito comum.

## Decisão de Design Registrada
- Subir a seção mínima padrão sem `circuit_type` para `1.5 mm²` (conforme NBR 5410 Tabela 47 para condutores isolados em circuitos de força e iluminação).

## Plano de correção
1. Atualizar o valor default de `min_section` para `1.5 mm²` em `src/Helpers/Electrical/wireSize.ts`.

## Testes
- `wireSize(6, { length: 5 })` sem `circuit_type` retorna ≥ 1.5.
