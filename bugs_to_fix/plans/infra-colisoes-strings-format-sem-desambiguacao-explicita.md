# colisoes-strings-format-sem-desambiguacao-explicita

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivos**: `src/index.ts:42-46`, `src/Helpers/Format/index.ts:3`

## Problema
Análise dos módulos star-exportados encontrou 6 nomes presentes em Strings×Format sem linha de desambiguação: `formatCep`, `formatCnpj`, `formatCpf`, `formatCpfCnpj`, `formatPhone`, `maskSensitive`. Hoje não há ambiguidade real porque `Format/index.ts` re-exporta o **mesmo binding** de `../Strings/masks` (ESM considera o mesmo binding não-ambíguo; `_.x === x` confirmado). Porém a convenção do CLAUDE.md não está sendo seguida, e se alguém redeclarar em vez de re-exportar, os 6 nomes somem silenciosamente dos named exports.

## Plano de correção
1. Adicionar ao bloco de desambiguação do `index.ts`:
```ts
export { formatCep, formatCnpj, formatCpf, formatCpfCnpj, formatPhone, maskSensitive } from './Helpers/Strings';
```

## Testes
- Teste de sanidade (pode entrar no `maxUseItems.test.ts`): os 6 nomes são exportados e `_.formatCpf === formatCpf`.
