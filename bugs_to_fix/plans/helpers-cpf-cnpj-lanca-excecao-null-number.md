# cpf-cnpj-lanca-excecao-null-number

- **Severidade**: alta
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Validations/documents.ts:12-37`

## Problema
`isCpf`/`isCnpj`/`isCpfCnpj` declaram aceitar `string | number | null | undefined` (tipo `RefString`), mas repassam o valor cru ao js-brasil sem guarda. Verificado em runtime: `validateBr.cpf(null)` lança `Cannot read properties of null (reading 'replace')` e `validateBr.cpf(52998224725)` (number) lança `strCPF.replace is not a function`. Ou seja, `isCpf(null)`, `isCpf(undefined)` e `isCpf(11111111111)` **lançam exceção** em vez de retornar `false`. CPF numérico ainda perde zeros à esquerda.

## Evidência
```ts
export function isCpf(value: RefString) { const data = toValue(value); return validateBr.cpf(data); }
// sem isBlank/String() como há em cepIsValid.ts:13
```

## Plano de correção
1. `if (isBlank(data)) return false;` nas três funções.
2. Normalizar com `String(data)` e, para `number`, `padStart(11/14, '0')` sobre os dígitos (ou documentar a conversão).

## Testes
- `isCpf(null)===false`, `isCpf(undefined)===false`, `isCpf('')===false`, `isCpf(52998224725)===true` (number), `isCnpj(null)===false`, `isCpfCnpj(null)===false`, tamanhos errados (`'5299822472'`, `'529982247251'`).
