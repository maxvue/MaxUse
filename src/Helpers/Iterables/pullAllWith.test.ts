import { describe, it, expect } from 'vitest';
import { pullAllWith } from './pullAllWith';

const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

describe('pullAllWith', () => {
    it('remove em lugar os elementos que casam segundo o comparator', () => {
        const arr = [{ x: 1 }, { x: 2 }];
        const result = pullAllWith(arr, [{ x: 1 }], isEqual);
        expect(result).toEqual([{ x: 2 }]);
        expect(arr).toEqual([{ x: 2 }]);
    });

    it('retorna a coleção intocada para array null ou undefined', () => {
        expect(pullAllWith(null, [1], isEqual)).toBeNull();
    });
});
