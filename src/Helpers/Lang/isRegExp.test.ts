import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isRegExp } from './isRegExp';

describe('isRegExp', () => {
    it('retorna true para regex literal e construído', () => {
        expect(isRegExp(/abc/)).toBe(true);
        expect(isRegExp(new RegExp('abc'))).toBe(true);
    });

    it('retorna false para outros tipos', () => {
        expect(isRegExp(null)).toBe(false);
        expect(isRegExp(undefined)).toBe(false);
        expect(isRegExp('abc')).toBe(false);
        expect(isRegExp({})).toBe(false);
        expect(isRegExp([])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isRegExp(ref(/abc/))).toBe(true);
        expect(isRegExp(ref('abc'))).toBe(false);
    });
});
