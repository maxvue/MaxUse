# ttl-zero-desativa-expiracao

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Routes/internal/idbCache.ts:70`

## Problema
O check `if (ttl && Date.now() - entry.timestamp > ttl)` trata `ttl = 0` como "sem expiração" (falsy) em vez de "sempre expirado". A doc ("Se expirado, retorna null" / "Se não informado, o cache não expira") indica que só `undefined` deveria desativar o TTL.

## Evidência
```ts
if (ttl && Date.now() - entry.timestamp > ttl) {
```

## Plano de correção
1. Trocar para `if (ttl !== undefined && Date.now() - entry.timestamp >= ttl)` (o `>=` cobre `ttl = 0`).

## Testes
- `getFromIDB(key, 0)` retorna `null` (miss) para entrada recém-gravada.
- `getFromIDB(key, undefined)` continua retornando entrada antiga (cache eterno).
