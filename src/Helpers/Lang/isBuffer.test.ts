import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isBuffer } from './isBuffer';

describe('isBuffer', () => {
    it('sempre retorna false, mesmo para um Buffer real (paridade com lodash-es em ambiente sem Buffer global)', () => {
        expect(isBuffer(Buffer.from('abc'))).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isBuffer(null)).toBe(false);
        expect(isBuffer(undefined)).toBe(false);
        expect(isBuffer([])).toBe(false);
        expect(isBuffer({})).toBe(false);
        expect(isBuffer(new Uint8Array(2))).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isBuffer(ref(Buffer.from('abc')))).toBe(false);
    });
});
