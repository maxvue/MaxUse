import { describe, it, expect, vi } from 'vitest';
import { after } from './after';

describe('after', () => {
    it('só invoca a função a partir da n-ésima chamada', () => {
        const func = vi.fn(() => 'chamado');
        const done = after(3, func);

        expect(done()).toBeUndefined();
        expect(done()).toBeUndefined();
        expect(func).not.toHaveBeenCalled();

        expect(done()).toBe('chamado');
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('invoca em toda chamada subsequente após atingir o limite', () => {
        const func = vi.fn(() => 'ok');
        const done = after(1, func);

        done();
        done();
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('n <= 0 invoca já na primeira chamada', () => {
        const func = vi.fn(() => 'ok');
        const done = after(0, func);
        expect(done()).toBe('ok');
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('repassa argumentos e "this"', () => {
        const func = vi.fn(function (this: any, a: number) {
            return a + (this?.offset ?? 0);
        });
        const obj = { offset: 10, done: after(1, func) };
        expect(obj.done(5)).toBe(15);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => after(1, null as any)).toThrow(TypeError);
    });

    it('trunca n fracionário via toInteger', () => {
        const func = vi.fn(() => 'ok');
        const done = after(2.9, func);
        expect(done()).toBeUndefined();
        expect(done()).toBe('ok');
    });
});
