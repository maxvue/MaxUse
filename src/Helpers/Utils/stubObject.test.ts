import { describe, it, expect } from 'vitest';
import { stubObject } from './stubObject';

describe('stubObject', () => {
    it('retorna um objeto vazio', () => {
        expect(stubObject()).toEqual({});
    });

    it('retorna uma nova instância a cada chamada (peculiaridade)', () => {
        expect(stubObject()).not.toBe(stubObject());
    });
});
