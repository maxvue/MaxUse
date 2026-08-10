import { getClientId, onResetConfig } from '../config';

/**
 * Serializa de forma estável um valor/objeto, ordenando as chaves de objetos recursivamente.
 * Garante que `{ a: 1, b: 2 }` e `{ b: 2, a: 1 }` produzam a mesma string.
 */
export function stableStringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);

    if (Array.isArray(obj)) return '[' + obj.map((item) => stableStringify(item)).join(',') + ']';

    const keys = Object.keys(obj).sort();
    const parts: string[] = [];
    for (const key of keys) parts.push(JSON.stringify(key) + ':' + stableStringify(obj[key]));

    return '{' + parts.join(',') + '}';
}

/**
 * Constrói a chave de cache estável para helpers de rotas cacheadas.
 * Incorpora o client ID ativo para evitar vazamento entre clientes.
 */
export function buildCacheKey(RouteName: string, params: any, keyCacheCustom?: string | null): string {
    if (keyCacheCustom) return keyCacheCustom;

    const clientId = getClientId();
    const paramsStr = stableStringify(params ?? {});
    return clientId ? `${RouteName}_${clientId}_${paramsStr}` : `${RouteName}_${paramsStr}`;
}

const inFlight = new Map<string, Promise<any>>();

/**
 * Deduplica requisições HTTP em voo por chave de cache.
 * Evita cache stampede de chamadas concorrentes idênticas.
 */
export function dedupeRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (inFlight.has(key)) return inFlight.get(key)!;

    const promise = fn().finally(() => {
        inFlight.delete(key);
    });
    inFlight.set(key, promise);
    return promise;
}

/**
 * Invalida uma chave (ou todas as chaves) em voo no mapa de deduplicação.
 */
export function invalidateDedupeKey(key?: string): void {
    if (key) {
        inFlight.delete(key);
        inFlight.delete(`idb:GET:${key}`);
        inFlight.delete(`ls:GET:${key}`);
        inFlight.delete(`idb:POST:${key}`);
    } else inFlight.clear();

}

onResetConfig(() => {
    invalidateDedupeKey();
});
