import { describe, it, expect } from 'vitest';
import { functionsIn } from './functionsIn';

describe('functionsIn', () => {
    it('peculiaridade: inclui métodos herdados via protótipo', () => {
        function Foo(this: { a: number; b: () => number }) { this.a = 1; this.b = () => 2; }
        (Foo as unknown as { prototype: { c: () => void } }).prototype.c = () => {};
        expect(functionsIn(new (Foo as unknown as new () => { a: number; b: () => number })())).toEqual(['b', 'c']);
    });

    it('retorna vazio para objeto null ou undefined', () => {
        expect(functionsIn(null)).toEqual([]);
    });
});
