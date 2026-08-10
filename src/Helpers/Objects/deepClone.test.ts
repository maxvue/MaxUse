import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { deepClone } from './deepClone';

describe('deepClone', () => {
    // Primitivos
    it('clona string', () => {
        expect(deepClone('hello')).toBe('hello');
    });

    it('clona número', () => {
        expect(deepClone(42)).toBe(42);
    });

    it('retorna null para null', () => {
        expect(deepClone(null)).toBe(null);
    });

    it('retorna undefined para undefined', () => {
        expect(deepClone(undefined)).toBe(undefined);
    });

    // Objetos
    it('clona objeto simples sem compartilhar referência', () => {
        const original = { a: 1, b: 'hello' };
        const clone = deepClone(original);
        expect(clone).toEqual(original);
        expect(clone).not.toBe(original);
    });

    it('clona objeto profundo sem compartilhar referência', () => {
        const original = { a: { b: { c: 42 } } };
        const clone = deepClone(original);
        expect(clone).toEqual(original);
        clone.a.b.c = 100;
        expect(original.a.b.c).toBe(42);
    });

    // Arrays
    it('clona array simples', () => {
        const original = [1, 2, 3];
        const clone = deepClone(original);
        expect(clone).toEqual(original);
        expect(clone).not.toBe(original);
    });

    it('clona array aninhado sem compartilhar referência', () => {
        const original = [[1, 2], [3, 4]];
        const clone = deepClone(original);
        clone[0][0] = 99;
        expect(original[0][0]).toBe(1);
    });

    // Date
    it('clona Date mantendo o timestamp', () => {
        const original = new Date('2026-01-15');
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(Date);
        expect(clone.getTime()).toBe(original.getTime());
        expect(clone).not.toBe(original);
    });

    // RegExp
    it('clona RegExp mantendo source e flags', () => {
        const original = /test/gi;
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(RegExp);
        expect(clone.source).toBe('test');
        expect(clone.flags).toBe('gi');
        expect(clone).not.toBe(original);
    });

    // Map
    it('clona Map com profundidade', () => {
        const original = new Map([['key', { nested: true }]]);
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(Map);
        expect(clone.get('key')).toEqual({ nested: true });
        expect(clone.get('key')).not.toBe(original.get('key'));
    });

    // Set
    it('clona Set', () => {
        const original = new Set([1, 2, 3]);
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(Set);
        expect(clone.size).toBe(3);
        expect(clone).not.toBe(original);
    });

    // Referências circulares
    it('lida com referências circulares sem loop infinito', () => {
        const original: any = { a: 1 };
        original.self = original;
        const clone = deepClone(original);
        expect(clone.a).toBe(1);
        expect(clone.self).toBe(clone);
        expect(clone.self).not.toBe(original);
    });

    // Symbols
    it('clona propriedades com Symbol como chave', () => {
        const sym = Symbol('test');
        const original = { [sym]: 'value', normal: 42 };
        const clone = deepClone(original);
        expect(clone[sym]).toBe('value');
        expect(clone.normal).toBe(42);
    });

    // Reatividade
    it('funciona com Ref', () => {
        const original = ref({ a: 1 });
        const clone = deepClone(original);
        expect(clone).toEqual({ a: 1 });
    });

    it('funciona com Getter', () => {
        const clone = deepClone(() => ({ b: 2 }));
        expect(clone).toEqual({ b: 2 });
    });
});

describe('deepClone — regressão auditoria (achado 024)', () => {
    class Ponto {
        constructor(public x = 0, public y = 0) {}
        distancia() { return Math.hypot(this.x, this.y); }
    }

    it('preserva o protótipo de instâncias de classe', () => {
        const clone = deepClone(new Ponto(3, 4));

        expect(clone).toBeInstanceOf(Ponto);
        expect(typeof clone.distancia).toBe('function');
        expect(clone.distancia()).toBe(5);
    });

    it('preserva o protótipo em instâncias aninhadas', () => {
        const origem = { origem: new Ponto(1, 2), lista: [new Ponto(3, 4)] };
        const clone = deepClone(origem);

        expect(clone.origem).toBeInstanceOf(Ponto);
        expect(clone.lista[0]).toBeInstanceOf(Ponto);
        expect(clone.lista[0].distancia()).toBe(5);
    });

    it('desacopla o clone da instância original', () => {
        const original = new Ponto(1, 1);
        const clone = deepClone(original);

        clone.x = 99;

        expect(original.x).toBe(1);
        expect(clone).not.toBe(original);
    });

    it('preserva objetos com protótipo nulo', () => {
        const semProto = Object.create(null);
        semProto.a = 1;

        const clone = deepClone(semProto);

        expect(Object.getPrototypeOf(clone)).toBeNull();
        expect(clone.a).toBe(1);
    });

    it('mantém objetos literais como objetos literais', () => {
        const clone = deepClone({ a: 1, b: { c: 2 } });

        expect(clone.constructor).toBe(Object);
        expect(clone).toEqual({ a: 1, b: { c: 2 } });
    });

    it('preserva o protótipo em referências circulares', () => {
        const p: any = new Ponto(1, 2);
        p.self = p;

        const clone = deepClone(p);

        expect(clone).toBeInstanceOf(Ponto);
        expect(clone.self).toBe(clone);
    });

    it('clona TypedArray como TypedArray real', () => {
        const src = new Uint8Array([1, 2, 3]);
        const c = deepClone(src);
        expect(Object.prototype.toString.call(c)).toBe('[object Uint8Array]');
        expect(Array.from(c)).toEqual([1, 2, 3]);
        expect(c.buffer).not.toBe(src.buffer);
        expect(c.byteLength).toBe(3);
    });

    it('clona ArrayBuffer sem compartilhar memória', () => {
        const src = new ArrayBuffer(4);
        const c = deepClone(src);
        expect(Object.prototype.toString.call(c)).toBe('[object ArrayBuffer]');
        expect(c.byteLength).toBe(4);
        expect(c).not.toBe(src);
    });

    it('preserva lastIndex de RegExp', () => {
        const r = /a/g;
        r.lastIndex = 3;
        expect(deepClone(r).lastIndex).toBe(3);
    });

    it('preserva a mensagem e propriedades de Error', () => {
        const err = new Error('boom');
        const clone = deepClone(err);
        expect(clone).toBeInstanceOf(Error);
        expect(clone.message).toBe('boom');
    });
});

