# 018 — `useDateFormat`/`timeAgo`: fallback para "agora" mascara dados inválidos

- **Severidade:** Média
- **Tipo:** Divergência de regra de negócio / bug silencioso
- **Arquivos:**
  - [src/Composables/useDateFormat.ts:22-25](../src/Composables/useDateFormat.ts#L22-L25)
  - [src/Composables/useTimeAgo.ts:107-110](../src/Composables/useTimeAgo.ts#L107-L110)

## Descrição

Ambos os composables substituem uma data ausente pela data **atual**:

```typescript
export const useDateFormat = (initialDate, format): UseDateFormatReturn => {
    if (isNotValid(toValue(initialDate))) return vueUseDateFormat(new Date(), format);
    return vueUseDateFormat(initialDate as any, format);
};
```

```typescript
export const timeAgo = (initialDate, format = 'br'): UseTimeAgoReturn => {
    if (isNotValid(toValue(initialDate))) return vueUseTimeAgo(new Date(), { messages: ... });
    return vueUseTimeAgo(initialDate as any, { messages: ... });
};
```

O JSDoc chama isso de "fallback seguro", mas o comportamento é o oposto de seguro
para o usuário final.

## Problema 1 — dado ausente vira "hoje"

```typescript
const usuario = { nome: 'Ana', ultimo_acesso: null };
useDateFormat(usuario.ultimo_acesso, 'DD/MM/YYYY').value;   // → "07/08/2026" (hoje)
timeAgo(usuario.ultimo_acesso).value;                        // → "agora"
```

Um usuário que **nunca acessou** o sistema aparece como tendo acessado agora. Um
contrato sem data de vencimento aparece vencendo hoje. Um pagamento sem data de
baixa aparece como pago hoje.

Esse é o pior tipo de falha: não há erro, não há log, e o valor exibido é
plausível — indistinguível de um dado real. Em telas de auditoria ou relatórios,
o dado fabricado é indistinguível do verdadeiro.

## Problema 2 — a data do fallback é congelada na criação

`new Date()` é avaliado **uma vez**, no momento da chamada do composable. Se a
data chegar depois (caso normal em carregamento assíncrono):

```typescript
const dataRecebida = ref<string | null>(null);
const formatada = useDateFormat(dataRecebida, 'DD/MM/YYYY');

// Depois, quando a API responde:
dataRecebida.value = '2020-01-15';
// formatada.value continua "07/08/2026" — a reatividade foi perdida
```

Como o ramo do fallback passa `new Date()` (valor estático) em vez do
`MaybeRefOrGetter` original, o `useDateFormat` do VueUse nunca reobserva a fonte.
**A reatividade é permanentemente quebrada** quando o valor inicial é nulo — que é
o caso mais comum em componentes que carregam dados via API.

## Problema 3 — `isNotValid` não detecta datas inválidas

`isNotValid` só verifica `null`/`undefined`. Uma string inválida passa direto:

```typescript
useDateFormat('data-invalida', 'DD/MM/YYYY').value;   // → "Invalid Date"
```

Então a função nem cobre todos os casos que o "fallback seguro" pretende cobrir.

## Correção sugerida

Preservar a reatividade e tornar o fallback explícito e configurável:

```typescript
export const useDateFormat = (
    initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>,
    format: string,
    options: { fallback?: string } = {}
): UseDateFormatReturn => {
    const fallback = options.fallback ?? '';

    // Mantém a fonte reativa: o getter é reavaliado quando initialDate muda
    const source = computed(() => toValue(initialDate) ?? new Date(NaN));
    const formatted = vueUseDateFormat(source, format);

    return computed(() => {
        const raw = toValue(initialDate);
        if (raw === null || raw === undefined) return fallback;
        if (isNaN(new Date(raw as any).getTime())) return fallback;
        return formatted.value;
    }) as UseDateFormatReturn;
};
```

O mesmo tratamento se aplica a `timeAgo`. O padrão passa a ser string vazia
(ou um traço `'—'`), que comunica ausência de dado sem inventar informação, e o
consumidor pode escolher outro fallback.

Se a mudança de padrão for considerada quebra de contrato, a correção mínima e
não negociável é o **Problema 2**: manter a reatividade mesmo no ramo de fallback.

## Testes de regressão sugeridos

```typescript
it('mantém reatividade quando a data chega depois', async () => {
    const data = ref<string | null>(null);
    const formatada = useDateFormat(data, 'DD/MM/YYYY');
    data.value = '2020-01-15';
    await nextTick();
    expect(formatada.value).toBe('15/01/2020');
});

it('não inventa a data atual para valores nulos', () => {
    expect(useDateFormat(null, 'DD/MM/YYYY').value).not.toBe(
        new Date().toLocaleDateString('pt-BR')
    );
});
```
