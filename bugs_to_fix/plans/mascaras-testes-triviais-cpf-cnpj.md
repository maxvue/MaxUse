# Testes de `formatCpf`/`formatCnpj` só verificam se existe pontuação

- **Severidade:** média
- **Arquivo:** [src/Helpers/Strings/masks.test.ts](../../src/Helpers/Strings/masks.test.ts) — linhas 23-76
- **Categoria:** teste que passa e nada prova

## Problema

As asserções são `toContain('.')`, `toContain('-')`, `toContain('/')` e
`length > 0` — **nunca o valor formatado**.

## Evidência

Implementações quebradas que devolvem apenas a pontuação satisfazem **todas** as
asserções:

```
broken formatCpf:  ".-"    contains . -> true   contains - -> true
broken formatCnpj: "./-"   true true true
broken null cpf:   ""
length>0: true
```

Ou seja: os testes não detectariam agrupamento errado de dígitos, dígitos
trocados, dígitos perdidos, nem ordem errada de separadores.

## Causa raiz

Os testes foram escritos defensivamente, para não depender da saída exata do
`js-brasil`. Mas fixar a saída é **precisamente** o que protege contra uma
mudança silenciosa de formato na dependência externa.

Valores corretos e estáveis:

```
maskBr.cpf('12345678901')     -> 123.456.789-01
maskBr.cnpj('12345678000199') -> 12.345.678/0001-99
```

## Correção proposta

Trocar as asserções de `toContain` por igualdade exata.

## Teste de regressão

```ts
it('formata CPF com o agrupamento correto', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01');
});

it('formata CNPJ com o agrupamento correto', () => {
    expect(formatCnpj('12345678000199')).toBe('12.345.678/0001-99');
});

it('formatCpfCnpj escolhe a máscara pelo tamanho', () => {
    expect(formatCpfCnpj('12345678901')).toBe('123.456.789-01');
    expect(formatCpfCnpj('12345678000199')).toBe('12.345.678/0001-99');
});
```
