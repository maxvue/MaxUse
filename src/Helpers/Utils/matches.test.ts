import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { matches } from './matches';

describe('matches', () => {
    it('cria função que verifica casamento parcial', () => {
        const isMatch = matches({ a: 1, b: 2 });
        expect(isMatch({ a: 1, b: 2, c: 3 })).toBe(true);
    });

    it('retorna false quando alguma chave não casa', () => {
        expect(matches({ a: 1, b: 2 })({ a: 1 })).toBe(false);
    });

    it('objeto fonte vazio sempre casa', () => {
        expect(matches({})({})).toBe(true);
        expect(matches({})({ a: 1 })).toBe(true);
    });

    it('fonte null é tratada como sem restrições', () => {
        expect(matches(null)({})).toBe(true);
    });

    it('peculiaridade: fonte string é coagida via Object(), não tratada como "sem restrições"', () => {
        expect(matches('abc')('abd')).toBe(false);
        expect(matches('abc')('abc')).toBe(true);
        expect(matches('x')([{ a: 1 }])).toBe(false);
    });

    it('compara profundamente objetos aninhados', () => {
        expect(matches({ a: { x: 1 } })({ a: { x: 1, y: 2 } })).toBe(true);
        expect(matches({ a: { x: 1 } })({ a: { x: 2 } })).toBe(false);
    });

    it('clona source no momento da criação — mudanças posteriores não afetam', () => {
        const source = { a: 1 };
        const isMatch = matches(source);
        source.a = 2;
        expect(isMatch({ a: 1 })).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(matches(ref({ a: 1 }))({ a: 1, b: 2 })).toBe(true);
    });
});
