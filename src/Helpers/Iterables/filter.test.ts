import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { filter } from './filter';

describe('filter', () => {
    it('filtra array com callback', () => {
        const items = [1, 2, 3, 4, 5];
        const result = filter(items, (n: number) => n > 3);
        expect(result).toEqual([4, 5]);
    });

    it('filtra objetos em array', () => {
        const items = [{ active: true }, { active: false }, { active: true }];
        const result = filter(items, (item: any) => item.active);
        expect(result).toHaveLength(2);
    });

    it('filtra Record (objeto)', () => {
        const obj = { a: { v: 1 }, b: { v: 2 }, c: { v: 3 } };
        const result = filter(obj, (item: any) => item.v > 1) as Record<string, any>;
        expect(Object.keys(result)).toEqual(['b', 'c']);
    });

    it('retorna array vazio para null', () => {
        expect(filter(null, () => true)).toEqual([]);
    });

    it('retorna array vazio para undefined', () => {
        expect(filter(undefined, () => true)).toEqual([]);
    });

    it('retorna array vazio para tipos primitivos', () => {
        expect(filter('string' as any, () => true)).toEqual([]);
        expect(filter(42 as any, () => true)).toEqual([]);
    });

    it('funciona com Ref', () => {
        const result = filter(ref([1, 2, 3, 4]), (n: number) => n % 2 === 0);
        expect(result).toEqual([2, 4]);
    });
});
