import { describe, it, expect } from 'vitest';
import { bindAll } from './bindAll';

describe('bindAll', () => {
    it('vincula os métodos especificados ao objeto', () => {
        const object = {
            user: 'fred',
            greet(greeting: string) {
                return `${greeting} ${this.user}`;
            }
        };
        bindAll(object, ['greet']);
        const detached = object.greet;
        expect(detached('hi')).toBe('hi fred');
    });

    it('MUTA o objeto original', () => {
        const object = {
            user: 'fred',
            greet(greeting: string) {
                return `${greeting} ${this.user}`;
            }
        };
        const original = object.greet;
        bindAll(object, ['greet']);
        expect(object.greet).not.toBe(original);
    });

    it('aceita nomes variádicos e arrays aninhados', () => {
        const object = {
            a: 1,
            b: 2,
            getA() { return this.a; },
            getB() { return this.b; }
        };
        bindAll(object, ['getA'], 'getB');
        const getA = object.getA;
        const getB = object.getB;
        expect(getA.call(null as any)).toBe(1);
        expect(getB.call(null as any)).toBe(2);
    });

    it('retorna o próprio objeto', () => {
        const object = { greet() { return 'hi'; } };
        expect(bindAll(object, ['greet'])).toBe(object);
    });

    it('sem nomes, não faz nada e retorna o objeto', () => {
        const object = { value: 1 };
        expect(bindAll(object as any)).toBe(object);
    });
});
