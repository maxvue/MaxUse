import { describe, it, expect } from 'vitest';
import { eachRight } from './eachRight';
import { forEachRight } from './forEachRight';

describe('eachRight', () => {
    it('é um alias de forEachRight', () => {
        expect(eachRight).toBe(forEachRight);
    });

    it('itera sobre um array na ordem inversa', () => {
        const out: unknown[] = [];
        eachRight([1, 2, 3], (v) => out.push(v));
        expect(out).toEqual([3, 2, 1]);
    });
});
