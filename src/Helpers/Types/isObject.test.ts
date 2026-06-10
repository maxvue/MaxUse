import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isObject } from './isObject';

describe('isObject', () => {
    it('retorna true para objeto literal', () => {
        expect(isObject({})).toBe(true);
    });

    it('retorna true para objeto com propriedades', () => {
        expect(isObject({ a: 1 })).toBe(true);
    });

    it('retorna true para array (é typeof object)', () => {
        expect(isObject([])).toBe(true);
    });

    it('retorna false para arrow function (toValue resolve como getter)', () => {
        expect(isObject(() => {})).toBe(false);
    });

    it('retorna true para RegExp', () => {
        expect(isObject(/regex/)).toBe(true);
    });

    it('retorna true para Date', () => {
        expect(isObject(new Date())).toBe(true);
    });

    it('retorna true para Map', () => {
        expect(isObject(new Map())).toBe(true);
    });

    it('retorna true para Set', () => {
        expect(isObject(new Set())).toBe(true);
    });

    it('retorna false para null', () => {
        expect(isObject(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(isObject(undefined)).toBe(false);
    });

    it('retorna false para string', () => {
        expect(isObject('hello')).toBe(false);
    });

    it('retorna false para número', () => {
        expect(isObject(42)).toBe(false);
    });

    it('retorna false para boolean', () => {
        expect(isObject(true)).toBe(false);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(isObject(ref({}))).toBe(true);
        expect(isObject(ref(42))).toBe(false);
    });

    it('funciona com Getter (resolve o valor do getter)', () => {
        expect(isObject(() => ({ a: 1 }))).toBe(true);
    });
});
