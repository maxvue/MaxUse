import { describe, it, expect } from 'vitest';
import { baseToString } from './_baseToString';

describe('baseToString', () => {
    it('retorna a própria string se já for string', () => {
        expect(baseToString('teste')).toBe('teste');
    });

    it('converte arrays em valores separados por vírgula', () => {
        expect(baseToString([1, 2, 'a'])).toBe('1,2,a');
        expect(baseToString([null, undefined])).toBe('null,undefined');
    });

    it('preserva sinal de -0 e trata Symbols', () => {
        expect(baseToString(-0)).toBe('-0');
        expect(baseToString(Symbol('foo'))).toBe('Symbol(foo)');
    });
});
