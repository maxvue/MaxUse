# `isValidCreditCard()` rejeita Hipercard válido (bandeira brasileira)

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Validations/creditCard.ts](../../src/Helpers/Validations/creditCard.ts) — linha 38
- **Categoria:** divergência de regra de negócio (BR)

## Evidência

```
6062825624254001  16  false      <-- Hipercard, BIN 606282, Luhn válido
4111111111111111  16  true
378282246310005   15  true
```

Isolando a camada responsável:

```
6062825624254001  luhn= true   jsbrasil= false
```

O Luhn passa; a rejeição vem inteiramente de `validateBr.cartaocredito`, cuja
lista de regex de bandeiras não cobre a faixa BIN `606282`.

Numa biblioteca que declara foco no mercado brasileiro, faltar Hipercard é
lacuna de domínio.

## Observação relevante

A mesma sondagem mostrou que `validateBr.cartaocredito` retorna `true` para
números com Luhn inválido (`4514160123456789`). O `checkLuhn` local protege
contra isso corretamente — então a detecção de bandeira é a única camada fraca.

## Correção proposta

Fallback explícito para bandeiras brasileiras, **após** o `validateBr`:

```ts
const BR_EXTRA_BRANDS = /^(606282|3841\d{2})/;   // Hipercard
const sanitized = str.replace(/\D/g, '');
if (validateBr.cartaocredito(str)) return true;
return BR_EXTRA_BRANDS.test(sanitized) && sanitized.length >= 13 && sanitized.length <= 19;
```

Melhor ainda: expor um helper `creditCardBrand()`, concentrando a lista de
bandeiras sob controle deste repositório em vez de depender da cobertura de
terceiros.

## Teste de regressão

```ts
it('aceita Hipercard válido', () => {
    expect(isValidCreditCard('6062825624254001')).toBe(true);
});

it('continua rejeitando Luhn inválido', () => {
    expect(isValidCreditCard('4514160123456789')).toBe(false);
});
```
