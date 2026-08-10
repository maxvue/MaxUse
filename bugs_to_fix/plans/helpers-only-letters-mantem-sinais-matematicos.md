# only-letters-mantem-sinais-matematicos

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Strings/filters.ts:17,55`

## Problema
O range `À-ÿ` (U+00C0–U+00FF) inclui `×` (U+00D7) e `÷` (U+00F7), que não são letras. Verificado: `onlyLetters('a×b÷c')` retorna `'a×b÷c'` intacto. Afeta `onlyLetters` e `onlyLettersAndNumbers`.

## Plano de correção
1. Excluir explicitamente: `[^a-zA-ZÀ-ÖØ-öø-ÿ]` (pula U+00D7 e U+00F7), ou usar `\p{L}` com flag `u` (preferível, cobre qualquer letra Unicode).

## Testes
- `onlyLetters('a×b÷c') === 'abc'`; acentos preservados (`'ção'`).
