import { describe, it, expect } from 'vitest';
import { assignWith } from './assignWith';

describe('assignWith', () => {
    it('usa customizer para decidir o valor atribuído', () => {
        const customizer = (objValue: unknown, srcValue: unknown) => (objValue === undefined ? srcValue : objValue);
        expect(assignWith({ a: 1 }, { a: 2, b: 3 }, customizer)).toEqual({ a: 1, b: 3 });
    });

    it('customizer retornando undefined cai no comportamento padrão', () => {
        const customizer = () => undefined;
        expect(assignWith({ a: 1 }, { b: 2 }, customizer)).toEqual({ a: 1, b: 2 });
    });

    it('aplica múltiplas fontes antes do customizer', () => {
        const customizer = (objValue: unknown, srcValue: unknown) => (objValue === undefined ? srcValue : objValue);
        expect(assignWith({ a: 1 }, { b: 2 }, { c: 3 }, customizer)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('peculiaridade: sem customizer (todos os argumentos são fontes), atribui normalmente', () => {
        expect(assignWith({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });
});
