import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { replace } from './replace';

describe('replace', () => {
    it('substitui uma ocorrência de string literal', () => {
        expect(replace('Hi Fred', 'Fred', 'Barney')).toBe('Hi Barney');
    });

    it('substitui todas as ocorrências com RegExp global (peculiaridade)', () => {
        expect(replace('a-b-c', /-/g, '_')).toBe('a_b_c');
    });

    it('retorna string vazia para null convertido', () => {
        expect(replace(null, 'a', 'b')).toBe('');
    });

    it('funciona com Ref', () => {
        expect(replace(ref('Hi Fred'), 'Fred', 'Barney')).toBe('Hi Barney');
    });
});
