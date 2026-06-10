import { describe, it, expect } from 'vitest';
import { orderByWithKey } from './orderByWithKey';

describe('orderByWithKey', () => {
    const users = [
        { id: 3, name: 'Carlos' },
        { id: 1, name: 'Ana' },
        { id: 2, name: 'Bruno' }
    ];

    it('ordena e indexa por chave', () => {
        const result = orderByWithKey(users, 'name', 'id');
        const keys = Object.keys(result);
        expect(keys.length).toBe(3);
    });

    it('ordena desc e indexa por chave', () => {
        const result = orderByWithKey(users, 'name', 'id', 'desc');
        const values = Object.values(result);
        expect(values[0].name).toBe('Carlos');
    });

    it('aceita critério como objeto { key: direction }', () => {
        const result = orderByWithKey(users, { name: 'asc' }, 'id');
        expect(Object.values(result).length).toBe(3);
    });

    it('aceita critério como objeto com valor undefined (usa fallback default order)', () => {
        const result = orderByWithKey(users, { name: undefined } as any, 'id', 'desc');
        const values = Object.values(result);
        expect(values[0].name).toBe('Carlos');
    });

    it('aceita critério como array de chaves', () => {
        const result = orderByWithKey(users, ['name'], 'id');
        expect(Object.values(result).length).toBe(3);
    });
});
