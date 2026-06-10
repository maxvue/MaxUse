import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { groupBy } from './groupBy';

describe('groupBy', () => {
    const users = [
        { name: 'Ana', dept: 'TI' },
        { name: 'Bruno', dept: 'RH' },
        { name: 'Carlos', dept: 'TI' }
    ];

    it('agrupa por string key', () => {
        const result = groupBy(users, 'dept');
        expect(result['TI'].length).toBe(2);
        expect(result['RH'].length).toBe(1);
    });

    it('agrupa por função', () => {
        const result = groupBy([1, 2, 3, 4], (n: number) => (n % 2 === 0 ? 'par' : 'impar'));
        expect(result['par']).toEqual([2, 4]);
        expect(result['impar']).toEqual([1, 3]);
    });

    it('retorna objeto vazio para null', () => {
        expect(groupBy(null, 'key')).toEqual({});
    });

    it('funciona com Record como input principal', () => {
        const obj = { a: { dept: 'TI' }, b: { dept: 'RH' } };
        const result = groupBy(obj, 'dept');
        expect(result['TI'].length).toBe(1);
        expect(result['RH'].length).toBe(1);
    });

    it('funciona com Ref', () => {
        const result = groupBy(ref(users), 'dept');
        expect(Object.keys(result).length).toBe(2);
    });
});
