import { describe, it, expect } from 'vitest';
import { updateWith } from './updateWith';

describe('updateWith', () => {
    it('peculiaridade: customizer Object força objetos planos na criação do caminho', () => {
        const obj: Record<string, unknown> = {};
        updateWith(obj, '[0][1]', () => 'a', Object);
        expect(obj).toEqual({ 0: { 1: 'a' } });
        expect(Array.isArray(obj[0])).toBe(false);
    });

    it('atualiza o valor a partir do valor atual no caminho', () => {
        const obj = { a: { b: 2 } };
        updateWith(obj, 'a.b', (n: unknown) => (n as number) * 3);
        expect(obj).toEqual({ a: { b: 6 } });
    });

    it('retorna intocado para objeto null ou undefined', () => {
        expect(updateWith(null, 'a', () => 1)).toBeNull();
    });
});
