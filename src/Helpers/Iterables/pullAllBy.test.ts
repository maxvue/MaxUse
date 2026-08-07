import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pullAllBy } from './pullAllBy';

describe('pullAllBy', () => {
    it('remove em lugar os elementos cujo critério aparece em values', () => {
        const arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
        const result = pullAllBy(arr, [{ x: 1 }, { x: 3 }], 'x');
        expect(result).toEqual([{ x: 2 }]);
        expect(arr).toEqual([{ x: 2 }]);
    });

    it('não muta quando values é vazio', () => {
        const arr = [{ x: 1 }];
        pullAllBy(arr, [], 'x');
        expect(arr).toEqual([{ x: 1 }]);
    });

    it('retorna a coleção intocada para array null ou undefined', () => {
        expect(pullAllBy(null, [{ x: 1 }], 'x')).toBeNull();
    });

    it('funciona com Ref', () => {
        const r = ref([{ x: 1 }, { x: 2 }]);
        pullAllBy(r, [{ x: 1 }], 'x');
        expect(r.value).toEqual([{ x: 2 }]);
    });
});
