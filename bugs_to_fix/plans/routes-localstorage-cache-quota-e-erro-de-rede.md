# localstorage-cache-quota-e-erro-de-rede

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Routes/getCachedApi.ts:47-50`

## Problema
`getCachedApi` não tem `try/catch`: (a) erro de rede/HTTP não-2xx propaga rejeição — divergência de contrato não documentada no JSDoc; (b) `localStorage.setItem` pode lançar `QuotaExceededError` **depois** da requisição ter sucesso, rejeitando a chamada e perdendo o dado.

## Evidência
```ts
const response = await axios.get(routeUrl, config);
const data_return = response.data;
if (is_client) localStorage.setItem(key, JSON.stringify(data_return));
return data_return;
```

## Decisão de Design Registrada
- `localStorage.setItem` em `getCachedApi` é envolvido em `try/catch` silencioso para evitar que erros de quota (`QuotaExceededError`) rejeitem a chamada e descartem a resposta com sucesso.
- Erros de rede HTTP em `getCachedApi` continuam propagando a rejeição, mantendo o contrato estrito para que a aplicação possa tratar a falha de conexão.

## Plano de correção
1. Envolver o `setItem` em `try/catch` silencioso.
2. Documentar no JSDoc que erros de rede propagam a rejeição.

## Testes
- Mock de `localStorage.setItem` lançando → dado ainda é retornado.
- Teste documentando o comportamento escolhido para erro de rede.
