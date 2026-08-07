import { describe, it, expect } from 'vitest';
import { bindKey } from './bindKey';
import { placeholder } from './partial';

describe('bindKey', () => {
    it('vincula o método ao objeto', () => {
        const object = {
            user: 'fred',
            greet(this: { user: string }, greeting: string) {
                return `${greeting} ${this.user}`;
            }
        };
        const bound = bindKey(object, 'greet', 'hi');
        expect(bound()).toBe('hi fred');
    });

    it('relê o método do objeto a cada invocação (não captura a referência original)', () => {
        const object: any = {
            user: 'fred',
            greet(this: { user: string }, greeting: string) {
                return `${greeting} ${this.user}`;
            }
        };
        const bound = bindKey(object, 'greet', 'hi');
        expect(bound()).toBe('hi fred');

        object.greet = function (this: { user: string }, greeting: string) {
            return `new ${greeting} ${this.user}`;
        };
        expect(bound()).toBe('new hi fred');
    });

    it('suporta placeholder', () => {
        const object = {
            user: 'fred',
            greet(this: { user: string }, greeting: string, punctuation: string) {
                return `${greeting} ${this.user}${punctuation}`;
            }
        };
        const bound = bindKey(object, 'greet', placeholder, '!');
        expect(bound('hiya')).toBe('hiya fred!');
    });

    it('lança TypeError se a chave não apontar para uma função', () => {
        const object = { user: 'fred' };
        const bound = bindKey(object as any, 'user');
        expect(() => bound()).toThrow(TypeError);
    });
});
