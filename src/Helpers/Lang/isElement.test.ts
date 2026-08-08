import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isElement } from './isElement';

describe('isElement', () => {
    it('retorna true para elemento DOM real', () => {
        expect(isElement(document.createElement('div'))).toBe(true);
        expect(isElement(document.body)).toBe(true);
    });

    it('retorna false para objeto literal com nodeType 1 (não é elemento de verdade)', () => {
        expect(isElement({ nodeType: 1 })).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isElement(null)).toBe(false);
        expect(isElement(undefined)).toBe(false);
        expect(isElement('div')).toBe(false);
        expect(isElement({})).toBe(false);
        expect(isElement([])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isElement(ref(document.createElement('span')))).toBe(true);
        expect(isElement(ref(1))).toBe(false);
    });
});
