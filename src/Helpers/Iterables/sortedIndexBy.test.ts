import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedIndexBy } from './sortedIndexBy';

describe('sortedIndexBy', () => {
    it('encontra o menor índice de inserção pelo critério derivado', () => {
        expect(sortedIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, 'x')).toBe(0);
    });

    it('retorna 0 para array vazio', () => {
        expect(sortedIndexBy([], { x: 1 }, 'x')).toBe(0);
    });

    it('insere após elementos menores', () => {
        expect(sortedIndexBy([{ x: 1 }, { x: 3 }], { x: 2 }, 'x')).toBe(1);
    });

    it('funciona com Ref', () => {
        expect(sortedIndexBy(ref([{ x: 1 }, { x: 3 }]), { x: 2 }, 'x')).toBe(1);
    });

    it('peculiaridade: valor derivado não comparável (undefined/NaN) não é sempre posicionado no índice 0', () => {
        expect(sortedIndexBy([10, 20, 30], undefined)).toBe(3);
        expect(sortedIndexBy([10, 20, 30], NaN)).toBe(3);
    });
});
