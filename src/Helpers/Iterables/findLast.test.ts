import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { findLast } from './findLast';

describe('findLast', () => {
    it('encontra o último item que atende ao predicado', () => {
        const items = [1, 2, 3, 4, 5];
        const result = findLast(items, (n) => n < 4);
        expect(result).toBe(3);
    });

    it('retorna undefined quando nenhum item atende', () => {
        expect(findLast([1, 2, 3], (n) => n > 10)).toBeUndefined();
    });

    it('retorna undefined para null', () => {
        expect(findLast(null, () => true)).toBeUndefined();
    });

    it('funciona com objetos', () => {
        const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'A' }];
        const result = findLast(items, (i) => i.name === 'A');
        expect(result?.id).toBe(3);
    });

    it('funciona com Ref', () => {
        const result = findLast(ref([10, 20, 30, 40]), (n) => n < 25);
        expect(result).toBe(20);
    });
});
