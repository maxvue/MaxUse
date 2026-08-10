# Mensagem `invalid` do `useTimeAgo`/`useDateFormat` é inalcançável

- **Severidade:** baixa
- **Arquivos:** [src/Composables/useTimeAgo.ts](../../src/Composables/useTimeAgo.ts) linhas 10, 24, 38, 52, 108-113; [src/Composables/useDateFormat.ts](../../src/Composables/useDateFormat.ts) linhas 24-29
- **Categoria:** código morto + divergência de documentação

## Problema

As 5 entradas de `FORMAT_MAP` declaram `invalid`, mas o getter da linha 108
substitui qualquer entrada inválida/nula por `new Date()` **antes** de o VueUse
processá-la. A mensagem nunca aparece.

Quem passa data malformada recebe um confiante **"agora"** em vez de indicação
de erro.

## Evidência

```
FORMAT_MAP.br.invalid  = Data inválida
timeAgo('lixo').value  = agora
timeAgo(null).value    = agora
timeAgo(NaN).value     = agora
```

`useDateFormat` é ainda pior: exibe `15/06/2026` para `'lixo'` — **fabrica uma
data plausível**, que o usuário não tem como distinguir de um dado real.

## Correção proposta

Duas saídas coerentes; escolher uma e documentá-la:

1. **Preferida:** parar de substituir por `new Date()` e deixar o valor inválido
   fluir, para que o VueUse renderize `invalid`.
2. Remover as chaves `invalid` e documentar explicitamente o fallback no JSDoc.

O inaceitável é o estado atual: mensagem declarada, inalcançável, e JSDoc que
não descreve nenhum dos dois comportamentos.

## Teste de regressão

```ts
it('sinaliza data inválida em vez de exibir "agora"', () => {
    expect(useTimeAgo('lixo').value).toBe('Data inválida');
});

it('não fabrica data plausível para entrada inválida', () => {
    expect(useDateFormat('lixo', 'DD/MM/YYYY').value).not.toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
});
```
