import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isError } from './isError';

describe('isError', () => {
    it('retorna true para instâncias de Error', () => {
        expect(isError(new Error('x'))).toBe(true);
        expect(isError(new TypeError('x'))).toBe(true);
    });

    it('true para DOMException e objetos com name+message', () => {
        expect(isError(new DOMException('x'))).toBe(true);

        class CustomError {
            name = 'CustomError';
            message = 'algo deu errado';
        }
        expect(isError(new CustomError())).toBe(true);
    });

    it('retorna false para objeto literal simples com name+message', () => {
        expect(isError({ name: 'x', message: 'y' })).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isError(null)).toBe(false);
        expect(isError(undefined)).toBe(false);
        expect(isError('erro')).toBe(false);
        expect(isError({})).toBe(false);
        expect(isError([])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isError(ref(new Error('x')))).toBe(true);
        expect(isError(ref(1))).toBe(false);
    });
});
