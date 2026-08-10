import { describe, it, expect } from 'vitest';
import { baseClone } from './_baseClone';

describe('baseClone', () => {
    it('clona primitivos por cópia direta', () => {
        expect(baseClone(42, true)).toBe(42);
        expect(baseClone('str', false)).toBe('str');
        expect(baseClone(null, true)).toBeNull();
    });

    it('clona Date e RegExp preservando propriedades', () => {
        const date = new Date(1700000000000);
        const dateClone = baseClone(date, true) as Date;
        expect(dateClone).toEqual(date);
        expect(dateClone).not.toBe(date);

        const regex = /abc/gi;
        const regexClone = baseClone(regex, true) as RegExp;
        expect(regexClone.source).toBe('abc');
        expect(regexClone.flags).toBe('gi');
    });

    it('clona Map e Set preservando referências ou clonando profundamente', () => {
        const set = new Set([1, 2]);
        const setClone = baseClone(set, true) as Set<number>;
        expect(setClone).toEqual(set);
        expect(setClone).not.toBe(set);

        const map = new Map([['a', 1]]);
        const mapClone = baseClone(map, true) as Map<string, number>;
        expect(mapClone).toEqual(map);
        expect(mapClone).not.toBe(map);
    });

    it('trata referências circulares sem estourar pilha', () => {
        const obj: any = { name: 'circular' };
        obj.self = obj;

        const clone: any = baseClone(obj, true);
        expect(clone.name).toBe('circular');
        expect(clone.self).toBe(clone);
    });
});
