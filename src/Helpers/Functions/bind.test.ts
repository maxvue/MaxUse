import { describe, it, expect } from 'vitest';
import { bind } from './bind';
import { placeholder } from './partial';

describe('bind', () => {
    it('fixa o contexto "this"', () => {
        const greet = function (this: { user: string }, greeting: string, punctuation: string) {
            return `${greeting} ${this.user}${punctuation}`;
        };
        const object = { user: 'fred' };
        const bound = bind(greet, object, 'hi');
        expect(bound('!')).toBe('hi fred!');
    });

    it('suporta placeholder para argumentos', () => {
        const greet = function (this: { user: string }, greeting: string, punctuation: string) {
            return `${greeting} ${this.user}${punctuation}`;
        };
        const object = { user: 'fred' };
        const bound = bind(greet, object, placeholder, '!');
        expect(bound('hiya')).toBe('hiya fred!');
    });

    it('sem partials, apenas fixa o contexto', () => {
        const greet = function (this: { user: string }, greeting: string) {
            return `${greeting} ${this.user}`;
        };
        const bound = bind(greet, { user: 'fred' });
        expect(bound('hi')).toBe('hi fred');
    });

    it('uma vez fixado, um novo bind não substitui o "this" original', () => {
        const greet = function (this: { user: string }, greeting: string) {
            return `${greeting} ${this.user}`;
        };
        const bound = bind(greet, { user: 'fred' });
        const rebound = bind(bound, { user: 'other' });
        expect(rebound('hey')).toBe('hey fred');
    });

    it('expõe .placeholder', () => {
        expect(bind.placeholder).toBe(placeholder);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => bind(null as any, {})).toThrow(TypeError);
    });
});
