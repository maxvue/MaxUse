# Baseline de testes — MaxUse

Registro das execuções de `npm test` usadas como rede de segurança pelo `/bugs-fix`.
Comparar a **lista nominal** de falhas, não apenas a contagem: duas falhas novas podem
mascarar duas antigas que sumiram.

## 2026-08-13 — primeira execução (auditoria inicial)

| Métrica | Valor |
|---|---|
| Arquivos de teste | 396 passed (396) |
| Testes | 2819 passed (2819) |
| Falhas | **0** |
| Skipped | 0 |
| Duração | 10,20s |

**Lista nominal de falhas:** vazia.

Nenhuma falha por `UniqueConstraintViolationException` ou colisão de fixture — este
projeto não usa banco de dados; a suíte roda em vitest com ambiente happy-dom.

### Como interpretar

Esta é a primeira execução registrada, então não havia baseline anterior para comparar.
Como a lista de falhas é vazia, a ambiguidade "regressão nova vs. falha preexistente"
não se aplica: **qualquer** falha em execução futura é regressão.

Uma suíte 100% verde não prova ausência de bug — prova que nenhum teste discorda do
código atual. A auditoria de 2026-08-13 confirmou defeitos reais em código coberto por
testes que passam, o que significa que os testes existentes não exercitam esses caminhos.
