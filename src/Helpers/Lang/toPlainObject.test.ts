import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toPlainObject } from './toPlainObject';

describe('toPlainObject', () => {
    it('copia propriedades de objeto literal', () => {
        expect(toPlainObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('copia propriedades próprias e herdadas da instância de classe (peculiaridade)', () => {
        class Foo {
            a = 1;
            constructor() {

            }
        }
        (Foo.prototype as unknown as { c: number }).c = 3;
        const result = toPlainObject(new Foo());
        expect(result).toEqual({ a: 1, c: 3 });
    });

    it('exclui getters não-enumeráveis do protótipo', () => {
        class Bar {
            a = 1;
            get b() { return 2; }
        }
        expect(toPlainObject(new Bar())).toEqual({ a: 1 });
    });

    it('retorna objeto vazio para null e undefined', () => {
        expect(toPlainObject(null)).toEqual({});
        expect(toPlainObject(undefined)).toEqual({});
    });

    it('funciona com Ref', () => {
        expect(toPlainObject(ref({ a: 1 }))).toEqual({ a: 1 });
    });
});
