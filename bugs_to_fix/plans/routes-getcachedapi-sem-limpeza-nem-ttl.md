# `getCachedApi` (localStorage) não tem TTL nem API de limpeza

- **Severidade:** baixa (nota de projeto, não defeito de implementação)
- **Arquivo:** [src/Routes/getCachedApi.ts](../../src/Routes/getCachedApi.ts)
- **Categoria:** privacidade / superfície de API

## Problema

O cache em `localStorage` não expira e o módulo exporta apenas `getCachedApi` —
não há contraparte de limpeza (as variantes IDB têm `deleteFromIDB` e
`clearCacheIDB`).

Payloads em cache **persistem indefinidamente**. Foi observado numa sondagem uma
resposta contendo CPF e token permanecendo em `localStorage` sem prazo.

Consumidores que armazenem respostas sensíveis não têm caminho suportado para
apagá-las — inclusive no logout, cenário em que limpar é obrigatório.

## Correção proposta

Adicionar `clearCachedApi(key?)` e suporte opcional a TTL, alinhando a variante
`localStorage` com o que as variantes IDB já oferecem. No mínimo, documentar
explicitamente a ausência de expiração e a responsabilidade do consumidor pela
limpeza no logout.

## Teste de regressão

```ts
it('permite limpar o cache de localStorage', async () => {
    await getCachedApi('rota', {}, { keyCache: 'k' });
    clearCachedApi('k');
    expect(localStorage.getItem('k')).toBeNull();
});
```
