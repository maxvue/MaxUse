import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { matchesProperty } from './matchesProperty';

describe('matchesProperty', () => {
    it('casa quando o valor no caminho é igual a srcValue', () => {
        expect(matchesProperty('a.b', 2)({ a: { b: 2 } })).toBe(true);
        expect(matchesProperty('a.b', 2)({ a: { b: 3 } })).toBe(false);
    });

    it('aceita caminho como array de segmentos', () => {
        expect(matchesProperty(['a', 'b'], 2)({ a: { b: 2 } })).toBe(true);
    });

    it('casamento parcial quando srcValue é objeto', () => {
        expect(matchesProperty('a', { x: 1 })({ a: { x: 1, y: 2 } })).toBe(true);
    });

    it('srcValue objeto vazio só casa se objValue também for objeto/array do mesmo tipo', () => {
        expect(matchesProperty('a', {})({})).toBe(false);
        expect(matchesProperty('a', {})({ a: 5 })).toBe(false);
        expect(matchesProperty('a', {})({ a: {} })).toBe(true);
        expect(matchesProperty('a', {})({ a: [] })).toBe(false);
    });

    it('peculiaridade: objValue e srcValue ambos undefined vira checagem de existência do caminho (hasIn)', () => {
        expect(matchesProperty('a', undefined)({})).toBe(false);
        expect(matchesProperty('a', undefined)({ a: undefined })).toBe(true);
    });

    it('trata NaN com SameValueZero', () => {
        expect(matchesProperty('a', NaN)({ a: NaN })).toBe(true);
        expect(matchesProperty('a', NaN)({ a: 1 })).toBe(false);
    });

    it('null só casa com null (não com undefined)', () => {
        expect(matchesProperty('a', null)({ a: null })).toBe(true);
        expect(matchesProperty('a', null)({ a: 1 })).toBe(false);
        expect(matchesProperty('a', null)({})).toBe(false);
    });

    it('clona srcValue no momento da criação', () => {
        const src = { x: 1 };
        const check = matchesProperty('a', src);
        src.x = 2;
        expect(check({ a: { x: 1 } })).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(matchesProperty(ref('a.b'), ref(2))({ a: { b: 2 } })).toBe(true);
    });
});
