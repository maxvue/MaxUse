# use-time-ago-teste-de-cobertura-fragil

- **Severidade**: baixa
- **Tipo**: teste-faltante
- **Arquivo**: `src/Composables/useTimeAgo.test.ts:691-742`

## Problema
O teste "cobertura direta dos formatadores" usa `vi.doMock` + `import('./useTimeAgo?update=' + Date.now())` e só asserta `toBeDefined()` — não valida nenhum texto, só executa branches para cobertura. O padrão é frágil (pode carregar o módulo real e o teste passa igual, pois nada é assertado).

## Plano de correção
1. Exportar `FORMAT_MAP` como `@internal` (ou expor as mensagens de outra forma testável).
2. Substituir por asserções diretas de texto: `expect(messages.day(1, true)).toBe('Ontem')` etc., cobrindo cada formato e unidade relevante.
3. Remover o padrão `vi.doMock` + import com query-string.
