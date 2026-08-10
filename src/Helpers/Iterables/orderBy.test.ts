import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { orderBy, sortBy, sortByMulti } from './orderBy';

describe('orderBy', () => {
    const users = [
        { name: 'Carlos', age: 30 },
        { name: 'Ana', age: 25 },
        { name: 'Bruno', age: 35 }
    ];

    it('ordena por string key asc', () => {
        const result = orderBy(users, 'name');
        expect(result[0].name).toBe('Ana');
        expect(result[2].name).toBe('Carlos');
    });

    it('ordena por string key desc', () => {
        const result = orderBy(users, 'age', 'desc');
        expect(result[0].age).toBe(35);
    });

    it('ordena por função extratora', () => {
        const result = orderBy(users, (u) => u.name.length);
        expect(result[0].name).toBe('Ana');
    });

    it('suporta múltiplos critérios', () => {
        const items = [
            { dept: 'TI', name: 'Carlos' },
            { dept: 'TI', name: 'Ana' },
            { dept: 'RH', name: 'Bruno' }
        ];
        const result = orderBy(items, ['dept', 'name']);
        expect(result[0].dept).toBe('RH');
        expect(result[1].name).toBe('Ana');
    });

    it('suporta array de direções por critério', () => {
        const items = [
            { dept: 'TI', age: 25 },
            { dept: 'TI', age: 35 },
            { dept: 'RH', age: 30 }
        ];
        const result = orderBy(items, ['dept', 'age'], ['asc', 'desc']);
        expect(result[0].dept).toBe('RH');
        // Dentro de TI, age desc → 35 antes de 25
        expect(result[1].age).toBe(35);
        expect(result[2].age).toBe(25);
    });

    it('null/undefined vão para o final (valA undefined)', () => {
        const items = [{ v: undefined }, { v: 1 }, { v: 2 }];
        const result = orderBy(items, 'v');
        expect(result[0].v).toBe(1);
        expect(result[1].v).toBe(2);
        expect(result[2].v).toBeUndefined();
    });

    it('null/undefined vão para o final (valB undefined)', () => {
        const items = [{ v: 1 }, { v: undefined }];
        const result = orderBy(items, 'v');
        expect(result[0].v).toBe(1);
        expect(result[1].v).toBeUndefined();
    });

    it('null/undefined vão para o final (valA null)', () => {
        const items = [{ v: null }, { v: 1 }];
        const result = orderBy(items, 'v');
        expect(result[0].v).toBe(1);
        expect(result[1].v).toBeNull();
    });

    it('null/undefined vão para o final (valB null)', () => {
        const items = [{ v: 1 }, { v: null }];
        const result = orderBy(items, 'v');
        expect(result[0].v).toBe(1);
        expect(result[1].v).toBeNull();
    });

    it('retorna 0 quando itens são iguais em todos os critérios', () => {
        const items = [{ v: 1 }, { v: 1 }];
        const result = orderBy(items, 'v');
        expect(result).toEqual([{ v: 1 }, { v: 1 }]);
    });

    it('fallback compara valores diretamente quando rule não é string nem function', () => {
        // Passando um critério que não é string nem function (number) para forçar o else
        const items = [3, 1, 2];
        const result = orderBy(items, 0 as any);
        // O fallback usa valA = a, valB = b → ordena diretamente
        expect(result[0]).toBe(1);
    });

    it('retorna array vazio para null', () => {
        expect(orderBy(null)).toEqual([]);
    });

    it('retorna cópia sem ordenar quando sem critério', () => {
        const result = orderBy(users);
        expect(result.length).toBe(3);
    });

    it('aceita Record como input', () => {
        const obj = { a: { v: 2 }, b: { v: 1 } };
        const result = orderBy(obj, 'v');
        expect(result[0].v).toBe(1);
    });

    it('funciona com Ref', () => {
        const result = orderBy(ref(users), 'age');
        expect(result[0].age).toBe(25);
    });

    it('sortBy é alias de orderBy', () => {
        expect(sortBy).toBe(orderBy);
    });

    it('ordena por caminho profundo com notação de colchetes', () => {
        const arr = [{ a: [{ b: { c: 5 } }] }, { a: [{ b: { c: 2 } }] }];
        expect(sortBy(arr, 'a[0].b.c')[0].a[0].b.c).toBe(2);
    });

    it('ordena por caminho com ponto', () => {
        const arr = [{ u: { idade: 30 } }, { u: { idade: 20 } }];
        expect(sortBy(arr, 'u.idade')[0].u.idade).toBe(20);
    });

    it('mantém nulos no final também em desc (divergência documentada)', () => {
        const r = orderBy([{ a: 1 }, { a: null }, { a: 3 }], ['a'], ['desc']);
        expect(r.map((x) => x.a)).toEqual([3, 1, null]);
    });
});

describe('sortByMulti', () => {
    it('é exportado de orderBy (alias)', () => {
        expect(typeof sortByMulti).toBe('function');
    });

    it('funciona como orderBy', () => {
        const items = [{ v: 2 }, { v: 1 }, { v: 3 }];
        const result = sortByMulti(items, 'v');
        expect(result[0].v).toBe(1);
    });
});
