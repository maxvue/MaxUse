import { describe, it, expect } from 'vitest';
import { mergeWith } from './mergeWith';

describe('mergeWith', () => {
    it('usa customizer para decidir como combinar arrays', () => {
        const customizer = (objValue: unknown, srcValue: unknown) => (Array.isArray(objValue) ? objValue.concat(srcValue) : undefined);
        expect(mergeWith({ a: [1] }, { a: [2] }, customizer)).toEqual({ a: [1, 2] });
    });

    it('customizer retornando undefined cai no merge padrão', () => {
        const customizer = () => undefined;
        expect(mergeWith({ a: { x: 1 } }, { a: { y: 2 } }, customizer)).toEqual({ a: { x: 1, y: 2 } });
    });

    it('peculiaridade: sem customizer (todos os argumentos são fontes), mescla normalmente', () => {
        expect(mergeWith({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3, 2] });
    });
});
