import { describe, it, expect } from 'vitest';
import { partialRight } from './partialRight';
import { placeholder } from './partial';

describe('partialRight', () => {
    it('anexa os argumentos pré-preenchidos ao final', () => {
        const greet = (greeting: string, name: string) => `${greeting} ${name}`;
        const greetFred = partialRight(greet, 'fred');
        expect(greetFred('hi')).toBe('hi fred');
    });

    it('sem placeholder, args ficam antes dos partials', () => {
        const list = (...args: unknown[]) => args;
        expect(partialRight(list, 'p1', 'p2')('a', 'b')).toEqual(['a', 'b', 'p1', 'p2']);
    });

    it('com um placeholder, apenas o excesso de args fica antes', () => {
        const list = (...args: unknown[]) => args;
        expect(partialRight(list, placeholder, 'p2')('a', 'b')).toEqual(['a', 'b', 'p2']);
        expect(partialRight(list, 'p1', placeholder)('a', 'b')).toEqual(['a', 'p1', 'b']);
    });

    it('com dois placeholders, todos os args são consumidos pelos placeholders', () => {
        const list = (...args: unknown[]) => args;
        expect(partialRight(list, placeholder, placeholder)('a', 'b', 'c')).toEqual(['a', 'b', 'c']);
    });

    it('expõe .placeholder', () => {
        expect(partialRight.placeholder).toBe(placeholder);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => partialRight(null as any)).toThrow(TypeError);
    });
});
