import { describe, it, expect } from 'vitest';
import { partial, placeholder } from './partial';

describe('partial', () => {
    it('pré-preenche os argumentos iniciais', () => {
        const greet = (greeting: string, name: string) => `${greeting} ${name}`;
        const sayHelloTo = partial(greet, 'hello');
        expect(sayHelloTo('fred')).toBe('hello fred');
    });

    it('suporta placeholder para pular uma posição', () => {
        const greet = (greeting: string, name: string) => `${greeting} ${name}`;
        const greetFred = partial(greet, placeholder, 'fred');
        expect(greetFred('hi')).toBe('hi fred');
    });

    it('expõe .placeholder no próprio partial', () => {
        expect(partial.placeholder).toBe(placeholder);
    });

    it('argumentos extras da chamada são anexados ao final', () => {
        const list = (...args: unknown[]) => args;
        const func = partial(list, 'a', 'b');
        expect(func('c', 'd')).toEqual(['a', 'b', 'c', 'd']);
    });

    it('preserva "this" na invocação', () => {
        const obj = {
            value: 10,
            calc(this: { value: number }, n: number) {
                return this.value + n;
            }
        };
        const func = partial(obj.calc, 5);
        expect(func.call(obj)).toBe(15);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => partial(null as any)).toThrow(TypeError);
    });
});
