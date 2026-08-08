import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isArguments } from './isArguments';

function getArguments(...args: unknown[]) {

    return arguments;
}

describe('isArguments', () => {
    it('retorna true para objeto arguments', () => {
        expect(isArguments(getArguments(1, 2, 3))).toBe(true);
    });

    it('retorna false para array (nem sempre óbvio, arguments parece array)', () => {
        expect(isArguments([1, 2, 3])).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isArguments(null)).toBe(false);
        expect(isArguments(undefined)).toBe(false);
        expect(isArguments({})).toBe(false);
        expect(isArguments('abc')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isArguments(ref(getArguments()))).toBe(true);
        expect(isArguments(ref([1, 2, 3]))).toBe(false);
    });
});
