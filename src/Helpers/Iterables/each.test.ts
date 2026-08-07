import { describe, it, expect } from 'vitest';
import { each } from './each';
import { forEach } from './forEach';

describe('each', () => {
    it('é um alias de forEach', () => {
        expect(each).toBe(forEach);
    });

    it('itera sobre um array', () => {
        const out: unknown[] = [];
        each([1, 2, 3], (v) => out.push(v));
        expect(out).toEqual([1, 2, 3]);
    });
});
