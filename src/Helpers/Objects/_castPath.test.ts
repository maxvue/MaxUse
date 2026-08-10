import { describe, it, expect } from 'vitest';
import { castPath } from './_castPath';
import { toPath } from '../Lang/toPath';

describe('castPath', () => {
    it('retorna o próprio array se já for um array de segmentos', () => {
        const path = ['a', 'b'];
        expect(castPath(path, null, toPath)).toBe(path);
    });

    it('trata chave própria literal como segmento único sem dividir por pontos', () => {
        const obj = { 'a.b': 123 };
        expect(castPath('a.b', obj, toPath)).toEqual(['a.b']);
    });

    it('delega para toPath se não for uma chave própria literal simples', () => {
        expect(castPath('a.b[0]', {}, toPath)).toEqual(['a', 'b', '0']);
    });
});
