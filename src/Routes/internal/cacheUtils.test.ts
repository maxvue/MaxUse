import { describe, it, expect, vi, beforeEach } from 'vitest';
import { stableStringify, buildCacheKey, dedupeRequest } from './cacheUtils';
import * as config from '../config';

describe('cacheUtils (internal)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        config.resetConfig();
        if (typeof localStorage !== 'undefined') localStorage.clear();

    });

    describe('stableStringify', () => {
        it('ordena chaves de objetos para produzir stringify idêntico', () => {
            const obj1 = { b: 2, a: 1, c: { y: 20, x: 10 } };
            const obj2 = { a: 1, c: { x: 10, y: 20 }, b: 2 };

            expect(stableStringify(obj1)).toBe(stableStringify(obj2));
            expect(stableStringify(obj1)).toBe('{"a":1,"b":2,"c":{"x":10,"y":20}}');
        });

        it('trata tipos primitivos, null, undefined e arrays', () => {
            expect(stableStringify(123)).toBe('123');
            expect(stableStringify('str')).toBe('"str"');
            expect(stableStringify(null)).toBe('null');
            expect(stableStringify([3, 1, 2])).toBe('[3,1,2]');
        });
    });

    describe('buildCacheKey', () => {
        it('usa a chave customizada quando fornecida', () => {
            expect(buildCacheKey('my.route', { a: 1 }, 'custom_key')).toBe('custom_key');
        });

        it('gera chave sem client ID quando localStorage não tem selected.client.id', () => {
            expect(buildCacheKey('my.route', { b: 2, a: 1 })).toBe('my.route_{"a":1,"b":2}');
        });

        it('incorpora selected.client.id na chave de cache', () => {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('selected.client.id', 'client_123');
                expect(buildCacheKey('my.route', { a: 1 })).toBe('my.route_client_123_{"a":1}');
            }
        });
    });

    describe('dedupeRequest', () => {
        it('deduplica chamadas simultâneas para a mesma chave', async () => {
            let executions = 0;
            const fn = vi.fn().mockImplementation(async () => {
                executions++;
                await new Promise((r) => setTimeout(r, 20));
                return 'result';
            });

            const p1 = dedupeRequest('key1', fn);
            const p2 = dedupeRequest('key1', fn);

            expect(p1).toBe(p2);
            const [r1, r2] = await Promise.all([p1, p2]);

            expect(r1).toBe('result');
            expect(r2).toBe('result');
            expect(executions).toBe(1);
        });

        it('permite nova requisição após a anterior terminar', async () => {
            const fn = vi.fn().mockResolvedValue('ok');
            await dedupeRequest('key2', fn);
            await dedupeRequest('key2', fn);

            expect(fn).toHaveBeenCalledTimes(2);
        });

        it('limpa requisições em voo no resetConfig', async () => {
            const fn = vi.fn().mockImplementation(() => new Promise(() => {}));
            dedupeRequest('key3', fn);

            config.resetConfig();

            // Uma nova chamada pós reset não reaproveita a promise anterior
            const fn2 = vi.fn().mockResolvedValue('new');
            const res = await dedupeRequest('key3', fn2);
            expect(res).toBe('new');
        });
    });
});
