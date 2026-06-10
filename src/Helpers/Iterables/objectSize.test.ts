import { describe, it, expect } from 'vitest';
import { objectSize, isObjectValid } from './objectSize';

describe('objectSize', () => {
    it('retorna número de chaves de um objeto', () => {
        expect(objectSize({ a: 1, b: 2, c: 3 })).toBe(3);
    });

    it('retorna 0 para null', () => {
        expect(objectSize(null)).toBe(0);
    });

    it('retorna 0 para undefined', () => {
        expect(objectSize(undefined)).toBe(0);
    });

    it('retorna 0 para array', () => {
        expect(objectSize([1, 2, 3])).toBe(0);
    });

    it('retorna 0 para objeto vazio', () => {
        expect(objectSize({})).toBe(0);
    });

    it('retorna 0 para string', () => {
        expect(objectSize('hello')).toBe(0);
    });
});

describe('isObjectValid', () => {
    it('retorna true para objeto com chaves', () => {
        expect(isObjectValid({ a: 1 })).toBe(true);
    });

    it('retorna false para objeto vazio', () => {
        expect(isObjectValid({})).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isObjectValid(null)).toBe(false);
    });
});
