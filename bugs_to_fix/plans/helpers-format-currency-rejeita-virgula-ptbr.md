# format-currency-rejeita-virgula-ptbr

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Format/currency.ts:15-16`

## Problema
Uma lib pt-BR que formata moeda não aceita entrada no formato pt-BR: `formatCurrency('1.234,56')` → `Number('1.234,56')` = NaN → retorna silenciosamente `'R$ 0,00'` (verificado). Inconsistente com `toNumber` (`converters.ts:48`), que já normaliza vírgula decimal. Retornar `R$ 0,00` para entrada inválida também mascara erros (indistinguível de zero real).

## Plano de correção
1. Usar `toNumber` (helper da própria lib) para normalizar strings antes do `Intl.NumberFormat`.
2. Avaliar retornar `''` para NaN em vez de `'R$ 0,00'` (breaking — no mínimo documentar a decisão).

## Decisão de Design Registrada
Opção selecionada: Usar `toNumber` para aceitar formatação pt-BR ("1.234,56") e manter `'R$ 0,00'` para valores nulos/em branco/inválidos para preservar a compatibilidade retroativa (backward compatibility).

## Testes
- `'1.234,56'` → `'R$ 1.234,56'`, `'10,5'` → `'R$ 10,50'`; manter casos NaN/null atuais (atenção ao NBSP ` ` do Intl nas asserções).
