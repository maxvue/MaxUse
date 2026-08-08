import { describe, it, expect } from 'vitest';
import { create } from './create';

describe('create', () => {
    it('cria objeto que herda do prototype informado', () => {
        const proto = { greet: () => 'oi' };
        const obj = create(proto) as { greet: () => string };
        expect(Object.getPrototypeOf(obj)).toBe(proto);
        expect(obj.greet()).toBe('oi');
    });

    it('atribui properties como propriedades próprias do objeto criado', () => {
        const obj = create({ a: 1 }, { b: 2 }) as { a: number; b: number };
        expect(obj.b).toBe(2);
        expect(obj.a).toBe(1);
        expect(Object.prototype.hasOwnProperty.call(obj, 'a')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(obj, 'b')).toBe(true);
    });

    it('peculiaridade: prototype null/undefined/primitivo herda de Object.prototype, nunca fica sem protótipo', () => {
        expect(Object.getPrototypeOf(create(null))).toBe(Object.prototype);
        expect(Object.getPrototypeOf(create(undefined))).toBe(Object.prototype);
        expect(Object.getPrototypeOf(create(1 as unknown as object))).toBe(Object.prototype);
    });

    it('sem properties, retorna apenas o objeto com o protótipo', () => {
        const obj = create({ a: 1 });
        expect(obj).toEqual({});
    });
});
