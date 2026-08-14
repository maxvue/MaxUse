import { describe, it, expect } from 'vitest';
import { partial, placeholder } from './partial';
import { partialRight } from './partialRight';
import { curry } from './curry';
import { curryRight } from './curryRight';
import { bind } from './bind';
import { bindKey } from './bindKey';

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

describe('placeholder', () => {
    it('é um Symbol dedicado, não o objeto _', () => {
        expect(typeof placeholder).toBe('symbol');
        expect(partial.placeholder).toBe(placeholder);
        expect(partialRight.placeholder).toBe(placeholder);
        expect(curry.placeholder).toBe(placeholder);
        expect(curryRight.placeholder).toBe(placeholder);
        expect(bind.placeholder).toBe(placeholder);
        expect(bindKey.placeholder).toBe(placeholder);
    });

    it('reserva a posição em curry quando importado nominalmente', () => {
        const fn = (a: number, b: number, c: number) => [a, b, c];
        expect(curry(fn)(1, placeholder, 3)(2)).toEqual([1, 2, 3]);
    });
});
