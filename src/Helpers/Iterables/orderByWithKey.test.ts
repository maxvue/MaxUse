import { describe, it, expect } from 'vitest';
import { orderByWithKey } from './orderByWithKey';

describe('orderByWithKey', () => {
    const users = [
        { code: 'c3', name: 'Carlos' },
        { code: 'a1', name: 'Ana' },
        { code: 'b2', name: 'Bruno' }
    ];

    it('ordena e indexa por chave', () => {
        const result = orderByWithKey(users, 'name', 'code');
        const keys = Object.keys(result);
        expect(keys.length).toBe(3);
    });

    it('ordena desc e indexa por chave', () => {
        const result = orderByWithKey(users, 'name', 'code', 'desc');
        const values = Object.values(result);
        expect(values[0].name).toBe('Carlos');
    });

    it('aceita critério como objeto { key: direction }', () => {
        const result = orderByWithKey(users, { name: 'asc' }, 'code');
        expect(Object.values(result).length).toBe(3);
    });

    it('aceita critério como objeto com valor undefined (usa fallback default order)', () => {
        const result = orderByWithKey(users, { name: undefined } as any, 'code', 'desc');
        const values = Object.values(result);
        expect(values[0].name).toBe('Carlos');
    });

    it('aceita critério como array de chaves', () => {
        const result = orderByWithKey(users, ['name'], 'code');
        expect(Object.values(result).length).toBe(3);
    });
});

