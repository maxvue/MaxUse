import { describe, it, expect } from 'vitest';
import { mixin } from './mixin';

describe('mixin', () => {
    it('adiciona os métodos de source ao object', () => {
        const object: any = {};
        mixin(object, { greet: (name: string) => `hi ${name}` });
        expect(object.greet('fred')).toBe('hi fred');
    });

    it('MUTA o objeto de destino e o retorna', () => {
        const object: any = {};
        const result = mixin(object, { greet: () => 'hi' });
        expect(result).toBe(object);
    });

    it('preserva propriedades já existentes em object', () => {
        const object: any = { existing: () => 'e' };
        mixin(object, { greet: () => 'hi' });
        expect(object.existing()).toBe('e');
        expect(object.greet()).toBe('hi');
    });

    it('ignora propriedades de source que não são função', () => {
        const object: any = {};
        mixin(object, { greet: () => 'hi', notAFunction: 42 } as any);
        expect(object.greet()).toBe('hi');
        expect(object.notAFunction).toBeUndefined();
    });

    it('adiciona os métodos como enumeráveis', () => {
        const object: any = {};
        mixin(object, { greet: () => 'hi' });
        expect(Object.getOwnPropertyDescriptor(object, 'greet')?.enumerable).toBe(true);
    });

    it('funciona adicionando métodos a um prototype', () => {
        class Foo {}
        mixin(Foo.prototype as any, { bar: () => 'baz' });
        expect((new Foo() as any).bar()).toBe('baz');
    });

    it('aceita options.chain sem efeito colateral (mantido por paridade de assinatura)', () => {
        const object: any = {};
        mixin(object, { greet: () => 'hi' }, { chain: false });
        expect(object.greet()).toBe('hi');
    });
});
