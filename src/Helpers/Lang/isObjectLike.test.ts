import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isObjectLike } from './isObjectLike';

describe('isObjectLike', () => {
    it('retorna true para objetos, arrays e outros valores de referência', () => {
        expect(isObjectLike({})).toBe(true);
        expect(isObjectLike([])).toBe(true);
        expect(isObjectLike(new Date())).toBe(true);
    });

    it('retorna false para função, async function e generator function, sem invocá-las (peculiaridade: typeof function não é object)', () => {
        let called = false;
        const fn = () => { called = true; };
        expect(isObjectLike(fn)).toBe(false);
        expect(called).toBe(false);

        expect(isObjectLike(async () => { called = true; })).toBe(false);
        expect(called).toBe(false);

        expect(isObjectLike(function* () { called = true; })).toBe(false);
        expect(called).toBe(false);
    });

    it('retorna false para null e primitivos', () => {
        expect(isObjectLike(null)).toBe(false);
        expect(isObjectLike(undefined)).toBe(false);
        expect(isObjectLike(1)).toBe(false);
        expect(isObjectLike('abc')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isObjectLike(ref({}))).toBe(true);
        expect(isObjectLike(ref(1))).toBe(false);
    });
});
