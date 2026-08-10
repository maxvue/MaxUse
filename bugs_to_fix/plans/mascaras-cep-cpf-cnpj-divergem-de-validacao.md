# `formatCep` diverge de `cepIsValid` para entrada numérica com zero à esquerda

- **Severidade:** média
- **Arquivos:** [src/Helpers/Strings/masks.ts](../../src/Helpers/Strings/masks.ts) linhas 17-19; [src/Helpers/Validations/cepIsValid.ts](../../src/Helpers/Validations/cepIsValid.ts) linha 15
- **Categoria:** inconsistência interna

## Problema

A biblioteca **valida** um CEP como correto e depois **não consegue formatá-lo**.

```
1001000     cepIsValid= true   formatCep= "1001000"     <-- não formatou
13101000    cepIsValid= true   formatCep= "13101-000"
"01001000"  cepIsValid= true   formatCep= "01001-000"
```

## Causa raiz

`cepIsValid` (linha 15) faz `String(data).padStart(8, '0')` explicitamente, para
que CEPs iniciados em `0` sobrevivam ao literal numérico do JavaScript.

`formatCep` (linha 17) **não** replica o padding: vai direto ao
`replace(/\D/g,'')`, obtém 7 dígitos, falha no teste `length === 8` e devolve a
entrada intacta.

Atinge todo CEP da capital de São Paulo (010xx–055xx) e demais regiões com
prefixo `0`, sempre que o valor trafega como número.

## Lacuna correspondente nos testes

`cepIsValid.test.ts:28` cobre o lado do validador. `masks.test.ts` **não tem
nenhum caso numérico** de `formatCep` — por isso a divergência sobreviveu.

## Correção proposta

Espelhar o padding:

```ts
const cep = (typeof data === 'number' ? String(data).padStart(8, '0') : String(data))
    .replace(/\D/g, '');
```

Recomendação estrutural: extrair "documento BR numérico → string com zero à
esquerda" para **um** helper interno compartilhado. `formatCpf` (11) e
`formatCnpj` (14) têm a mesma lacuna latente — `formatCpf(52998224725)` só
funciona porque aquele CPF não começa com zero.

## Teste de regressão

```ts
it('formata CEP numérico com zero à esquerda', () => {
    expect(formatCep(1001000)).toBe('01001-000');
});

it('é consistente com cepIsValid para entrada numérica', () => {
    expect(formatCep(1001000)).toMatch(/^\d{5}-\d{3}$/);
});
```
