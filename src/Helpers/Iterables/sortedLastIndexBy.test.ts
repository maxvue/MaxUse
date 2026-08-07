import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedLastIndexBy } from './sortedLastIndexBy';

describe('sortedLastIndexBy', () => {
    it('encontra o maior índice de inserção, após ocorrências iguais', () => {
        expect(sortedLastIndexBy([{ x: 4 }, { x: 4 }], { x: 4 }, 'x')).toBe(2);
    });

    it('retorna 0 para array vazio', () => {
        expect(sortedLastIndexBy([], { x: 1 }, 'x')).toBe(0);
    });

    it('difere de sortedIndexBy quando há duplicatas', () => {
        expect(sortedLastIndexBy([{ x: 1 }, { x: 2 }, { x: 2 }], { x: 2 }, 'x')).toBe(3);
    });

    it('funciona com Ref', () => {
        expect(sortedLastIndexBy(ref([{ x: 1 }, { x: 1 }]), { x: 1 }, 'x')).toBe(2);
    });

    it('peculiaridade: valor derivado não comparável (chave ausente) não é sempre posicionado no índice 0', () => {
        expect(sortedLastIndexBy([{ x: 1 }, { x: 3 }, { x: 5 }], {}, 'x')).toBe(3);
    });
});
