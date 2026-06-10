import { describe, it, expect } from 'vitest';
import { keyBy } from './keyBy';

describe('keyBy', () => {
    it('indexa por string key (chaves numéricas recebem espaço)', () => {
        const users = [{ id: 1, name: 'Ana' }, { id: 2, name: 'Bruno' }];
        const result = keyBy(users, 'id') as any;
        expect(result['1 '].name).toBe('Ana');
        expect(result['2 '].name).toBe('Bruno');
    });

    it('indexa por string key (chaves não-numéricas sem espaço)', () => {
        const users = [{ code: 'A', name: 'Ana' }, { code: 'B', name: 'Bruno' }];
        const result = keyBy(users, 'code') as any;
        expect(result['A'].name).toBe('Ana');
        expect(result['B'].name).toBe('Bruno');
    });

    it('retorna {} para null ou undefined', () => {
        expect(keyBy(null, 'id')).toEqual({});
        expect(keyBy(undefined, 'id')).toEqual({});
    });

    it('funciona com Record (object)', () => {
        const items = { a: { id: 1, name: 'Ana' }, b: { id: 2, name: 'Bruno' } };
        const result = keyBy(items, 'id') as any;
        expect(result['1 '].name).toBe('Ana');
    });

    it('funciona com null na chave', () => {
        const items = [{ id: null, name: 'Ana' }];
        const result = keyBy(items, 'id') as any;
        expect(result['null'].name).toBe('Ana');
    });
});
